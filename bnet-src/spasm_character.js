(function()
{
	var spasmCharacter = function(membershipType, membershipId, characterId, canvas, animation)
	{
		// public
		this.onAnimate = function() { };
		this.isMuted = false;
		this.$loadDial = null;
		this.replacementItemIds = [];
		this.focusedItemReferenceId = null;
		this.centeredItemReferenceId = null;
		this.renderWithHelmet = true;


		// private
		this._destinyAccount = null;
		this._membershipType = membershipType;
		this._membershipId = membershipId;
		this._characterId = characterId;
		this._isHunter = false;
		this._classItemReferenceId = null;
		this._canvas = canvas;
		this._animation = animation;
		this._itemPreview = null;
	};

	spasmCharacter.prototype.init = function()
	{
		this.loadAccount();
	};

	spasmCharacter.prototype.loadAccount = function()
	{
		var self = this;

		var contentPath = "https://www.bungie.net/";//"/";

		this._itemPreview = new Spasm.ItemPreview(this._canvas, contentPath);
		if (this._animation)
		{
			this._itemPreview.animationFilePath = this._animation;
		}
		this._itemPreview.setAnimation();
		var canRender = this._itemPreview.renderer.canRender();

		if (!canRender)
		{
			console.warn('Cannot Render Character', this._itemPreview);
			return;
		}

		// load destiny account
		bungieNetPlatform.destinyService.GetAccountSummary(
		this._membershipType,
		this._membershipId,
		true, // GetAccountDefinitions
		function (response)
		{
			console.log('GetAccountSummary', response);
			if (response)
			{
				self.destinyAccount = response;
				self.loadReplacementItems(function ()
				{
					self.loadCharacter();
				});
			}
		},
		function (error)
		{
			Bnet.error("error loading destiny account");
			Bnet.error(error.errorMessage);
		});
	};

	spasmCharacter.prototype.setFocusedItemReferenceId = function(focusedItemReferenceId) {
		this.focusedItemReferenceId = focusedItemReferenceId;
	}

	spasmCharacter.prototype.setCenteredItemReferenceId = function(centeredItemReferenceId) {
		this.centeredItemReferenceId = centeredItemReferenceId;
	}

	spasmCharacter.prototype.loadReplacementItems = function (callback) {
		var self = this;

		var replacementItemCount = this.replacementItemIds.length;
		if (replacementItemCount > 0)
		{
			for (var i = 0, replacementIdsLength = this.replacementItemIds.length; i < replacementIdsLength; i++) {
				var replacementItemId = this.replacementItemIds[i];

				bungieNetPlatform.destinyService.GetDestinySingleDefinition(
					"InventoryItem",
					replacementItemId,
					false, //GetItemDefinition
					bungieNetPlatform.platformSettings.contentVersion,
					function (response) {
						var itemDefinition = response.data.inventoryItem;
						self.destinyAccount.definitions.items[itemDefinition.itemHash] = itemDefinition;
						callback();
					},
					function (error) {
						Bnet.error("error loading replacement item definition");
					});
			}
		}
		else
		{
			callback();
		}
	};

	spasmCharacter.prototype.loadCharacter = function () {
		var self = this;

		var destinyAccountData = self.destinyAccount.data;
		var destinyAccountDefinitions = self.destinyAccount.definitions;

		var characters = destinyAccountData.characters;

		var armorItemIds = [];
		var renderableItemIds = [];
		var renderableItemGearAssetManifests = {};
		var renderableShaderDefinition = null;

		var character = null;
		for (var i = 0; i < characters.length; i++)
		{
			var characterTest = characters[i];
			if (characterTest.characterBase.characterId === this._characterId)
			{
				character = characterTest;
			}
		}

		if (character != null)
		{
			var characterBase = character.characterBase;
			var peerView = characterBase.peerView;
			var equipment = peerView.equipment;
			var equipmentCount = equipment.length;

			this._isHunter = characterBase.classType === Globals.DestinyClass.Hunter;

			this._itemPreview.setGenderType(characterBase.genderType);
			this._itemPreview.setClassHash(characterBase.classHash);

			if (this.focusedItemReferenceId)
			{
				this._itemPreview.setFocusedItemReferenceId(this.focusedItemReferenceId);
			}

			if (this.centeredItemReferenceId)
			{
				this._itemPreview.setCenteredItemReferenceId(this.centeredItemReferenceId);
			}
			
			// Replace existing items with replacement items
			for (var j = 0, replacementItemsLength = this.replacementItemIds.length; j < replacementItemsLength; j++)
			{
				var replacementItemHash = this.replacementItemIds[j];
				var replacementItemDefinition = destinyAccountDefinitions.items[replacementItemHash];
				var replacementBucketId = replacementItemDefinition.bucketTypeHash;

				// Loop through existing items
				for (var k = 0; k < equipmentCount; k++)
				{
					var existingEquipmentItem = equipment[k];
					var existingItemDefinition = destinyAccountDefinitions.items[existingEquipmentItem.itemHash];
					var existingBucketId = existingItemDefinition.bucketTypeHash;

					// If we find an item in the same bucket as the replacement, splice the replacement in its place
					if (replacementBucketId === existingBucketId)
					{
						equipment.splice(k, 1, {
							itemHash: replacementItemHash
						});
					}
				}
			}

			equipmentCount = equipment.length;

			// dictionary for the renderable buckets,
			// so we can query bucket identifiers with the 'in' operator
			var armorBucketIdentifiers =
			{
				"BUCKET_HEAD": true,
				"BUCKET_ARMS": true,
				"BUCKET_CHEST": true,
				"BUCKET_LEGS": true,
				"BUCKET_CLASS_ITEMS": true
			};

			var shaderBucketIdentifier = "BUCKET_SHADER";

			for (var equipmentIndex = 0;
				equipmentIndex < equipmentCount;
				equipmentIndex++)
			{
				var equipmentBucket = equipment[equipmentIndex];

				var itemId = equipmentBucket.itemHash;
				var itemDefinition = destinyAccountDefinitions.items[itemId];

				var bucketId = itemDefinition.bucketTypeHash;
				var bucketDefinition = destinyAccountDefinitions.buckets[bucketId];

				var shouldLoadGearAssetManifest = false;

				var bucketIdentifier = bucketDefinition.bucketIdentifier;

				if (bucketIdentifier === "BUCKET_CLASS_ITEMS")
				{
					this._classItemReferenceId = "" + itemId;
				}

				if (bucketIdentifier in armorBucketIdentifiers)
				{
					// load gear asset manifest for this item, 
					// so we know what we have to download in order to render

					armorItemIds.push("" + itemId);
					renderableItemIds.push("" + itemId);

					shouldLoadGearAssetManifest = true;
				}
				else if (bucketIdentifier == shaderBucketIdentifier)
				{
					renderableItemIds.push("" + itemId);
					renderableShaderDefinition = itemDefinition;

					shouldLoadGearAssetManifest = true;
				}

				if (shouldLoadGearAssetManifest)
				{
					var getItemDefinition = false;
					bungieNetPlatform.destinyService.GetDestinySingleDefinition(
						"GearAsset",
						itemId,
						false, //GetItemDefinition
						bungieNetPlatform.platformSettings.contentVersion,
						function(response){
							if (response)
							{
								var responseData = response.data;
								var gearAssetManifest = responseData.gearAsset;
								var requestedItemId = responseData.requestedId;

								renderableItemGearAssetManifests["" + requestedItemId] = gearAssetManifest;
								var keys = Object.keys(renderableItemGearAssetManifests);
								var keyCount = keys.length;
								if (keyCount === renderableItemIds.length)
								{
									self.showCharacter(
										armorItemIds,
										renderableItemGearAssetManifests,
										renderableShaderDefinition);
								}
							}
							else
							{
								Bnet.error("no response for item definition");
							}
						},
						function(error){
							Bnet.error("error loading equipment item definition");
							Bnet.error(error.errorMessage);
						});
				}
			}
		}
		else {
			console.warn('Character Not Found', this._characterId, characters);
		}
	};

	spasmCharacter.prototype.showCharacter = function (itemIds, itemGearAssetManifests, shaderDefinition)
	{
		var self = this;

		if (this._isHunter && this._classItemReferenceId !== null)
		{
			this._itemPreview.setVariantItemReferenceIds([this._classItemReferenceId]);
			this._itemPreview.setRenderWithHelmet(this.renderWithHelmet);
		}

		if (this.$loadDial)
		{
			this.$loadDial.knob({
				width: 183,
				height: 183,
				thickness: 0.13,
				displayInput: true,
				bgColor: "rgba(0,0,0,0)",
				fgColor: "#f5f5f5",
				'draw': function ()
				{
					$(".guardianDialWrapper").addClass("active");
					this.i.addClass("active");

					$(this.i).val(this.cv + "%");
				}
			});

			this._itemPreview.loadProgressCallback = function()
			{
				var loadProgress = self._itemPreview.totalLoadProgress;
				var totalToLoad = loadProgress.loaded + loadProgress.loading;
				var percentage = loadProgress.loaded / totalToLoad * 100;
				self.$loadDial.val(percentage).trigger("change");
				if (percentage >= 98)
				{
					self.$loadDial.parent().fadeOut(250);
				}
			};
		}

		if (this.isMuted)
		{
			var mutedItems = {};
			for (var i = 0, itemIdsLength = itemIds.length; i < itemIdsLength; i++)
			{
				mutedItems[itemIds[i]] = "";
			}

			this._itemPreview.setItemReferenceIdsWithMutedItems(
				itemIds,
				null, //primary weapon
				null, // shader definition
				mutedItems,
				itemGearAssetManifests,
				function(success){
					if (success)
					{
						self._itemPreview.startAnimating();
						self.onAnimate();
					}
					else
					{
						Bnet.error("error loading item preview");
					}
				});
		}
		else
		{
			this._itemPreview.setItemReferenceIds(
				itemIds,
				null, //primary weapon
				shaderDefinition,
				itemGearAssetManifests,
				function (success)
				{
					if (success)
					{
						self._itemPreview.startAnimating();
						self.onAnimate();
					}
					else
					{
						Bnet.error("error loading item preview");
					}
				});
		}
	};

	window.SpasmCharacter = spasmCharacter;
})();

