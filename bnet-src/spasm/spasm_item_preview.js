// spasm_item_preview.js

var Spasm = Spasm || {};

Spasm.ItemPreview = function(canvas, contentBaseURL)
{
	Spasm.assertCanvas(canvas);
	Spasm.assertString(contentBaseURL);

	this.canvas = canvas;
	this.contentBaseURL = contentBaseURL;
	Spasm.Content.setContentBaseURL(contentBaseURL);

	this.renderer = new Spasm.Renderer(canvas);
	this.gearShaders = (this.renderer.canRender()
		? new Spasm.GearShader(this.renderer.gl)
		: null);

	// hasBlendIndices
	// hasBlendWeights
	// hasGearDyeTextures
	// ignoresTextures

	// pre-load common shaders
	if (this.gearShaders !== null)
	{
		this.gearShaders.getShaderProgram(false, false, false, false);
		this.gearShaders.getShaderProgram(true, false, false, false);
		this.gearShaders.getShaderProgram(true, true, false, false);
	}

	this.dropShadowEnabled = false;
	if (this.renderer.canRender())
	{
		this.dropShadow = new Spasm.DropShadow(this.renderer.gl);
	}

	this.camera = new Spasm.Camera(canvas);
	this.cameraControls = new Spasm.CameraControls(canvas, this.camera);

	var canvasWidth = Math.abs(canvas.width);
	var canvasHeight = Math.abs(canvas.height);

	this.canvasSize =
	{
		width : canvasWidth,
		height : canvasHeight
	};

	this.shouldAnimate = false;
	this.isAnimating = false;
	this.limitToFrame = false;

	this.isAnimationPaused = false;

	this.assetLoaders = null;
	this.assetLoadersCount = 0;
	this.genderType = 1;
	this.classHash = 0;

	this.frameIndex = 0;
	this.callback = null;

	this.itemReferenceIds = [];
	this.mutedItemReferenceIds = [];
	this.gearRenderables = [];

	this.renderWithHelmet = true;
	this.variantItemReferenceIds = {};

	// complicated, opaque, but works for hunter class items
	this.renderWithHelmetVariantsByCount = {0 : {}, 1 : {0 : ""}, 2 : {0 : "", 1 : ""}, 3 : {0 : "", 2 : ""}};
	this.renderWithoutHelmetVariantsByCount = {0 : {}, 1 : {0 : ""}, 2 : {0 : ""}, 3 : {1 : "", 2 : ""}};

	this.gearRenderableCache = {};
	this.femaleGearRenderableCache = {};
	this.maleGearRenderableCache = {};

	this.boundingVolume = null;
	this.focusedItemReferenceId = null;
	this.centeredItemReferenceId = null;

	this.loadProgressPerItem = {};
	this.totalLoadProgress = {loading : -1, loaded : -1};
	this.loadProgressCallback = function()
	{
	};

	this.primaryWeaponItemDefinition = null;
	this.assetManifests = null;

	this.animations = {};
	this.skeletons = {};

	this.skeletonFilePath = Spasm.Path.combine(Spasm.Content.AnimationsPath, "destiny_player_skeleton.js");
	this.animationFilePath = Spasm.Path.combine(Spasm.Content.AnimationsPath, "destiny_player_animation.js");

	var inputTypes = Spasm.Shader.InputTypes;
	var valueTypes = Spasm.Shader.ValueTypes;

	// skinning
	var boneCount = 72;
	var boneMatrixValueCount = 12;

	this.identityMatrices = new Float32Array(boneCount * boneMatrixValueCount);
	this.identityMatricesUniform = new Spasm.ShaderInput(inputTypes.uniform,
														 valueTypes.vec4,
														 "u_skinning_matrices",
														 boneCount);

	this.identityMatricesUniformData = new Spasm.UniformData(this.identityMatricesUniform,
															 this.identityMatrices);

	for (var boneIndex = 0; boneIndex < boneCount; boneIndex++)
	{
		this.identityMatrices.set(this.camera.matrices.identity34,
								  boneIndex * boneMatrixValueCount);
	}

	this.skinningMatrices = new Float32Array(boneCount * boneMatrixValueCount);
	this.skinningMatricesUniform = new Spasm.ShaderInput(inputTypes.uniform,
														 valueTypes.vec4,
														 "u_skinning_matrices",
														 boneCount);

	this.skinningMatricesUniformData = new Spasm.UniformData(this.skinningMatricesUniform,
															 this.skinningMatrices);

	// lighting
	// this.cameraPosition = new Float32Array([40.0, 30.0, 50.0]);
	// this.cameraPositionUniform = new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec3, "u_camera_position");
	// this.cameraPositionUniformData = new Spasm.UniformData(this.cameraPositionUniform, this.cameraPosition);

	this.lightPosition = new Float32Array([0.0, 10.0, 0.0]);
	this.lightPositionUniform = new Spasm.ShaderInput(inputTypes.uniform,
													  valueTypes.vec3,
													  "u_light_position");
	this.lightPositionUniformData = new Spasm.UniformData(this.lightPositionUniform,
														  this.lightPosition);

	this.mutedColor = 0.3;
	this.mutedColorDiffuse = new Float32Array([this.mutedColor, this.mutedColor, this.mutedColor, 1.0]);
	this.mutedColorDiffuseUniform = new Spasm.ShaderInput(inputTypes.uniform,
														  valueTypes.vec4,
														  "u_muted_color_diffuse");
	this.mutedColorDiffuseUnfiformData = new Spasm.UniformData(this.mutedColorDiffuseUniform,
															   this.mutedColorDiffuse);

	var self = this;
	this.animationFrame = function()
	{
		self.animate();
	};
};

Spasm.ItemPreview.prototype = {};

Spasm.ItemPreview.prototype.setRenderWithHelmet = function(renderWithHelmet)
{
	Spasm.assertBoolean(renderWithHelmet);

	this.renderWithHelmet = renderWithHelmet;
};

Spasm.ItemPreview.prototype.setVariantItemReferenceIds = function(variantItemReferenceIdsArray)
{
	Spasm.assertArray(variantItemReferenceIdsArray);

	var variantItemReferenceIds = {};

	var count = variantItemReferenceIdsArray.length;
	for (var index = 0; index < count; index++)
	{
		var variantItemReferenceId = variantItemReferenceIdsArray[index];
		variantItemReferenceIds[variantItemReferenceId] = "";
	}

	this.variantItemReferenceIds = variantItemReferenceIds;
};

Spasm.ItemPreview.prototype.getGearRenderableCache = function()
{
	var gearRenderableCache;

	if (this.itemReferenceIds.length === 1)
	{
		// weapons and ships
		gearRenderableCache = this.gearRenderableCache;
	}
	else if (this.isFemale())
	{
		gearRenderableCache = this.femaleGearRenderableCache;
	}
	else
	{
		gearRenderableCache = this.maleGearRenderableCache;
	}

	return gearRenderableCache;
};

Spasm.ItemPreview.prototype.onLoadAnimation = function(animation, success)
{
	Spasm.assertInstance(animation, Spasm.Animation);
	Spasm.assertBoolean(success);

	if (animation === this.animation)
	{
		this.checkLoadComplete();
	}
};

Spasm.ItemPreview.prototype.onLoadSkeleton = function(skeleton, success)
{
	Spasm.assertInstance(skeleton, Spasm.Skeleton);
	Spasm.assertBoolean(success);

	this.checkLoadComplete();
};

Spasm.ItemPreview.prototype.checkLoadComplete = function()
{
	if (this.assetLoadersCount === 0
		&& this.skeleton.loadComplete
		&& this.animation.loadComplete)
	{
		this.onLoadComplete();
	}
};

Spasm.ItemPreview.prototype.onLoadFailure = function()
{
	this.onFinishedLoading(false);
};

Spasm.ItemPreview.prototype.setGenderType = function(genderType)
{
	// Spasm.assertInteger(genderType);

	this.genderType = genderType;
};

Spasm.ItemPreview.prototype.setClassHash = function(classHash)
{
	// Spasm.assertInteger(classHash);

	this.classHash = classHash;
};

Spasm.ItemPreview.prototype.setFocusedItemReferenceId = function(itemReferenceId)
{
	if (itemReferenceId)
	{
		this.focusedItemReferenceId = itemReferenceId;
		this.centeredItemReferenceId = null;
	}
	else
	{
		this.focusedItemReferenceId = null;
	}
};

Spasm.ItemPreview.prototype.setCenteredItemReferenceId = function(itemReferenceId)
{
	if (itemReferenceId)
	{
		this.centeredItemReferenceId = itemReferenceId;
		this.focusedItemReferenceId = null;
	}
	else
	{
		this.centeredItemReferenceId = null;
	}
};

Spasm.ItemPreview.prototype.setDropShadowEnabled = function(enabled)
{
	Spasm.assertBoolean(enabled);

	this.dropShadowEnabled = enabled;
};

Spasm.ItemPreview.prototype.setRotationZDegrees = function(rotationZDegrees)
{
	Spasm.assertNumber(rotationZDegrees,
					   "Spasm.ItemPreview.setRotationZDegrees: input is not a number" + rotationZDegrees);

	this.camera.setRotationZDegrees(rotationZDegrees);
};

Spasm.ItemPreview.prototype.genderTypeFemale = 1;

Spasm.ItemPreview.prototype.isFemale = function()
{
	var isFemale = (this.genderType == this.genderTypeFemale); // jshint ignore:line
	return isFemale;
};

Spasm.ItemPreview.prototype.hasItemReferenceId = function(itemReferenceId)
{
	var hasItemReferenceId = false;

	var itemReferenceIds = this.itemReferenceIds;
	if (itemReferenceIds)
	{
		var itemReferenceIdCount = itemReferenceIds.length;
		for (var index = 0; index < itemReferenceIdCount; index++)
		{
			var itemReferenceIdAtIndex = itemReferenceIds[index];
			if (itemReferenceIdAtIndex == itemReferenceId)
			{
				hasItemReferenceId = true;
				break;
			}
		}
	}

	return hasItemReferenceId;
};

Spasm.ItemPreview.prototype.loadItemAssetManifests = function()
{
	var itemReferenceIds = this.itemReferenceIds;
	var assetManifests = this.assetManifests;

	if (!assetManifests)
	{
		assetManifests = {};
		this.assetManifests = assetManifests;
	}

	var self = this;
	var definitionType = "GearAsset";

	Spasm.assertValid(bungieNetPlatform, "missing bungie.net platform library");
	Spasm.assertValid(bungieNetPlatform.platformSettings, "missing bungie.net platform settings");
	var contentVersion = bungieNetPlatform.platformSettings.contentVersion;

	// item asset manifests
	var itemReferenceIdCount = itemReferenceIds.length;
	for (var itemReferenceIdIndex = 0; itemReferenceIdIndex < itemReferenceIdCount; itemReferenceIdIndex++)
	{
		var itemReferenceId = itemReferenceIds[itemReferenceIdIndex];
		var hasAssetManifest = (itemReferenceId in assetManifests);
		if (!hasAssetManifest)
		{
			// load asset manifest
			var getItemDefinition = false;
			bungieNetPlatform.destinyService.GetDestinySingleDefinition(
				definitionType,
				itemReferenceId,
				getItemDefinition,
				contentVersion,
				function(response)
				{
					Spasm.assertValid(response);

					var responseData = response.data;
					var gearAssetManifest = responseData.gearAsset;
					var requestedItemId = responseData.requestedId;
					self.onLoadItemAssetManifest(requestedItemId, gearAssetManifest);
				},
				function(error)
				{
					Spasm.assert(false, "error loading equipment item definition: " + error);
				});
		}
	}

	// shader asset manifest
	var shaderItemReferenceId = this.shaderItemReferenceId;
	var shaderItemDefinition = this.shaderItemDefinition;
	if (shaderItemReferenceId
		&& (!shaderItemDefinition
			|| shaderItemDefinition.itemHash != shaderItemReferenceId))
	{
		var getShaderDefinition = false;
		bungieNetPlatform.destinyService.GetDestinySingleDefinition(
			definitionType,
			shaderItemReferenceId,
			getShaderDefinition,
			contentVersion,
			function(response)
			{
				Spasm.assertValid(response);

				var responseData = response.data;
				var gearAssetManifest = responseData.gearAsset;
				var requestedItemId = responseData.requestedId;
				self.onLoadItemAssetManifest(requestedItemId, gearAssetManifest);

				// var responseDefinition = response.definition;
			},
			function(error)
			{
				Spasm.assert(false, "error loading equipment item definition: " + error);
			});
	}

	this.checkItemAssetManifestsLoadComplete();
};

Spasm.ItemPreview.prototype.addItemAssetManifest = function(itemReferenceId, itemAssetManifest)
{
	Spasm.assertValid(itemReferenceId);
	Spasm.assertValid(itemAssetManifest);

	var assetManifests = this.assetManifests;

	if (!assetManifests)
	{
		assetManifests = {};
		this.assetManifests = assetManifests;
	}

	assetManifests[itemReferenceId] = itemAssetManifest;
};

Spasm.ItemPreview.prototype.onLoadItemAssetManifest = function(itemReferenceId, itemAssetManifest)
{
	this.addItemAssetManifest(itemReferenceId, itemAssetManifest);

	if (this.hasItemReferenceId(itemReferenceId))
	{
		this.checkItemAssetManifestsLoadComplete();
	}
};

Spasm.ItemPreview.prototype.checkItemAssetManifestsLoadComplete = function()
{
	var itemAssetManifestsLoadComplete = false;

	var assetManifests = this.assetManifests;
	if (assetManifests)
	{
		var missingAssetManifest = false;

		var itemReferenceIds = this.itemReferenceIds;
		var itemReferenceIdCount = itemReferenceIds.length;
		for (var itemReferenceIdIndex = 0; itemReferenceIdIndex < itemReferenceIdCount; itemReferenceIdIndex++)
		{
			var itemReferenceId = itemReferenceIds[itemReferenceIdIndex];
			var hasAssetManifest = (itemReferenceId in assetManifests);
			if (!hasAssetManifest)
			{
				missingAssetManifest = true;
				break;
			}
		}

		if (!missingAssetManifest)
		{
			// we did it!
			this.loadItems();

			itemAssetManifestsLoadComplete = true;
		}
	}

	return itemAssetManifestsLoadComplete;
};

Spasm.ItemPreview.prototype.loadItems = function()
{
	var gearShaders = this.gearShaders;
	var itemReferenceIds = this.itemReferenceIds;
	var assetManifests = this.assetManifests;
	var self = this;

	var shaderItemDefinition = this.shaderItemDefinition;

	var assetLoaderCallback = function(loader, success)
	{
		if (success)
		{
			self.onLoadAssets(loader);
			self.checkLoadComplete();
		}
		else
		{
			self.onLoadFailure();
		}
	};

	var assetLoaderProgressCallback = function(loader, callbackItemReferenceId)
	{
		self.loadProgressPerItem[callbackItemReferenceId] = loader.loadProgress;
		self.determineItemPreviewLoadProgress();
	};

	if (gearShaders
		&& itemReferenceIds
		&& assetManifests)
	{
		this.assetLoaders = {};
		this.gearRenderables.length = 0;

		var isFemale = this.isFemale();
		var classHash = this.classHash;

		var gearRenderableCache = this.getGearRenderableCache();

		var itemCount = itemReferenceIds.length;

		for (var itemIndex = 0; itemIndex < itemCount; itemIndex++)
		{
			var itemReferenceId = itemReferenceIds[itemIndex];
			var assetManifest = assetManifests[itemReferenceId];

			if (itemReferenceId in gearRenderableCache)
			{
				this.gearRenderables.push(gearRenderableCache[itemReferenceId]);
			}
			else if (assetManifest)
			{
				if (assetManifest.content
					&& assetManifest.content.length > 0)
				{
					this.assetLoaders[itemReferenceId] = new Spasm.TGXAssetLoader(itemReferenceId,
																				  assetManifest,
																				  isFemale,
																				  classHash,
																				  assetLoaderCallback,
																				  assetLoaderProgressCallback);
					this.assetLoadersCount++;
				}
			}
			else
			{
				console.log("ItemPreview: missing asset manifest for item id: " + itemReferenceId);
			}
		}

		if (shaderItemDefinition)
		{
			var shaderItemReferenceId = "" + shaderItemDefinition.itemHash;
			var equippingBlock = shaderItemDefinition.equippingBlock;
			if (shaderItemReferenceId
				&& equippingBlock)
			{
				var defaultDyes = equippingBlock.defaultDyes;
				var customDyes = equippingBlock.customDyes;
				var lockedDyes = equippingBlock.lockedDyes;
				if ((defaultDyes
					 && defaultDyes.length > 0)
					|| (customDyes
						&& customDyes.length > 0)
					|| (lockedDyes
						&& lockedDyes.length > 0))
				{
					var shaderAssetManifest = assetManifests[shaderItemReferenceId];
					if (shaderAssetManifest
						&& shaderAssetManifest.content
						&& shaderAssetManifest.content.length > 0)
					{
						this.assetLoaders[shaderItemReferenceId] = new Spasm.TGXAssetLoader(shaderItemReferenceId,
																							shaderAssetManifest,
																							isFemale,
																							classHash,
																							assetLoaderCallback);
						this.assetLoadersCount++;
					}
				}
			}
		}

		var assetLoaderKeys = Object.keys(this.assetLoaders);
		if (assetLoaderKeys.length === 0)
		{
			setTimeout(function()
					   {
						   self.checkLoadComplete();
					   }, 0);
		}
	}
};

Spasm.ItemPreview.prototype.loadAnimation = function(animationFilePath)
{
	var animationPath = Spasm.Path.addVersionQuery(Spasm.Path.combine(Spasm.Content.StaticPath,
																	  animationFilePath));

	if (!(animationPath in this.animations))
	{
		this.animations[animationPath] = new Spasm.Animation(animationPath);
	}
};

Spasm.ItemPreview.prototype.setAnimation = function()
{
	var self = this;

	var animationPath = Spasm.Path.addVersionQuery(Spasm.Path.combine(Spasm.Content.StaticPath,
																	  this.animationFilePath));
	var skeletonPath = Spasm.Path.addVersionQuery(Spasm.Path.combine(Spasm.Content.StaticPath,
																	 this.skeletonFilePath));

	var animation = null;
	var skeleton = null;

	if (animationPath in this.animations)
	{
		animation = this.animations[animationPath];
	}
	else
	{
		animation = new Spasm.Animation(animationPath,
										function(response, success)
										{
											self.onLoadAnimation(response, success);
										});
		this.animations[animationPath] = animation;
	}

	if (skeletonPath in this.skeletons)
	{
		skeleton = this.skeletons[skeletonPath];
	}
	else
	{
		skeleton = new Spasm.Skeleton(skeletonPath,
									  function(response, success)
									  {
										  self.onLoadSkeleton(response, success);
									  });
		this.skeletons[skeletonPath] = skeleton;
	}

	this.animation = animation;
	this.skeleton = skeleton;
};

Spasm.ItemPreview.prototype.setItemReferenceIds = function(itemReferenceIds,
														   primaryWeaponItemDefinition,
														   shaderItemDefinition,
														   assetManifests,
														   callback)
{
	var mutedItemReferenceIds = {};
	this.setItemReferenceIdsWithMutedItems(itemReferenceIds,
										   primaryWeaponItemDefinition,
										   shaderItemDefinition,
										   mutedItemReferenceIds,
										   assetManifests,
										   callback);

	// instead, this simulates the 'load asset manifests' case
	//var shaderItemReferenceId = null;
	//if (shaderItemDefinition)
	//{
	//	shaderItemReferenceId = shaderItemDefinition.itemHash;
	//}
	//
	//this.loadItemReferenceIds(itemReferenceIds, shaderItemReferenceId, callback);
};

Spasm.ItemPreview.prototype.setItemReferenceIdsWithMutedItems = function(itemReferenceIds,
																		 primaryWeaponItemDefinition,
																		 shaderItemDefinition,
																		 mutedItemReferenceIds,
																		 assetManifests,
																		 callback)
{
	this.setAnimation();

	Spasm.assertArray(itemReferenceIds);
	Spasm.assertValid(mutedItemReferenceIds);
	Spasm.assertValid(assetManifests);
	Spasm.assertFunction(callback);

	this.itemReferenceIds = itemReferenceIds;
	this.primaryWeaponItemDefinition = primaryWeaponItemDefinition;
	this.shaderItemDefinition = shaderItemDefinition;
	this.mutedItemReferenceIds = mutedItemReferenceIds;
	this.assetManifests = assetManifests;
	this.callback = callback;

	var self = this;
	if (!this.renderer.canRender())
	{
		setTimeout(function()
				   {
					   self.checkLoadComplete();
				   }, 0);
	}
	else
	{
		this.loadItems();
	}
};

Spasm.ItemPreview.prototype.loadItemReferenceIds = function(itemReferenceIds,
															shaderItemReferenceId,
															callback)
{
	var mutedItemReferenceIds = {};
	this.loadItemReferenceIdsWithMutedItems(itemReferenceIds,
											shaderItemReferenceId,
											mutedItemReferenceIds,
											callback);
};

Spasm.ItemPreview.prototype.loadItemReferenceIdsWithMutedItems = function(itemReferenceIds,
																		  shaderItemReferenceId,
																		  mutedItemReferenceIds,
																		  callback)
{
	this.setAnimation();

	Spasm.assertArray(itemReferenceIds);
	// Spasm.assertValid(shaderItemReferenceId);
	Spasm.assertValid(mutedItemReferenceIds);
	Spasm.assertFunction(callback);

	this.itemReferenceIds = itemReferenceIds;
	this.shaderItemReferenceId = shaderItemReferenceId;
	this.mutedItemReferenceIds = mutedItemReferenceIds;
	this.callback = callback;

	this.loadItemAssetManifests();
};

Spasm.ItemPreview.prototype.onLoadAssets = function(loader)
{
	Spasm.assertInstance(loader, Spasm.TGXAssetLoader);
	if (loader.itemReferenceId in this.assetLoaders)
	{
		var gearDyes = loader.getGearDyes(this.renderer);

		var gearRenderable = loader.getGearRenderable(this.renderer);
		gearRenderable.setGearShaders(this.gearShaders);
		gearRenderable.setGearDyes(gearDyes);

		var gearRenderableCache = this.getGearRenderableCache();

		gearRenderableCache[loader.itemReferenceId] = gearRenderable;
		this.gearRenderables.push(gearRenderable);

		delete this.assetLoaders[loader.itemReferenceId];
		this.assetLoadersCount--;
	}
};

Spasm.ItemPreview.prototype.getTotalBoundingVolume = function()
{
	var gearRenderables = this.gearRenderables;
	var boundingVolumes = [];

	var gearRenderableCount = gearRenderables.length;
	for (var gearRenderableIndex = 0; gearRenderableIndex < gearRenderableCount; gearRenderableIndex++)
	{
		var gearRenderable = gearRenderables[gearRenderableIndex];
		var gearRenderableBoundingVolumes = gearRenderable.getBoundingVolumes();

		var boundingVolumeCount = gearRenderableBoundingVolumes.length;
		for (var boundingVolumeIndex = 0; boundingVolumeIndex < boundingVolumeCount; boundingVolumeIndex++)
		{
			var gearRenderableBoundingVolume = gearRenderableBoundingVolumes[boundingVolumeIndex];
			boundingVolumes.push(gearRenderableBoundingVolume);
		}
	}

	var boundingVolume = Spasm.boundingVolumeFromBoundingVolumes(boundingVolumes);
	return boundingVolume;
};

Spasm.ItemPreview.prototype.getBoundingVolumeForItemReferenceId = function(itemReferenceId)
{
	var gearRenderableCache = this.getGearRenderableCache();

	var boundingVolume;
	if (itemReferenceId
		&& (itemReferenceId in gearRenderableCache))
	{
		var gearRenderable = gearRenderableCache[itemReferenceId];
		boundingVolume = gearRenderable.getBoundingVolume();
	}
	else
	{
		boundingVolume = null;
	}

	return boundingVolume;
};

Spasm.ItemPreview.prototype.onLoadComplete = function()
{
	var gearRenderables = this.gearRenderables;
	var focusedItemReferenceId = this.focusedItemReferenceId;
	var centeredItemReferenceId = this.centeredItemReferenceId;
	var gearRenderableCache = this.getGearRenderableCache();

	var boundingVolumes = [];

	// $HACK set shader dyes as override dyes
	var shaderOverrideDyes = null;
	var shaderItemDefinition = this.shaderItemDefinition;
	if (shaderItemDefinition)
	{
		var shaderItemReferenceId = "" + shaderItemDefinition.itemHash;
		var shaderRenderable = gearRenderableCache[shaderItemReferenceId];
		if (shaderRenderable)
		{
			shaderOverrideDyes = shaderRenderable.gearDyes;
		}
	}

	var gearRenderableCount = gearRenderables.length;
	for (var gearRenderableIndex = 0; gearRenderableIndex < gearRenderableCount; gearRenderableIndex++)
	{
		var gearRenderable = gearRenderables[gearRenderableIndex];
		gearRenderable.setShaderOverrideDyes(shaderOverrideDyes);

		var gearRenderableBoundingVolumes = gearRenderable.getBoundingVolumes();

		var boundingVolumeCount = gearRenderableBoundingVolumes.length;
		for (var boundingVolumeIndex = 0; boundingVolumeIndex < boundingVolumeCount; boundingVolumeIndex++)
		{
			var gearRenderableBoundingVolume = gearRenderableBoundingVolumes[boundingVolumeIndex];
			boundingVolumes.push(gearRenderableBoundingVolume);
		}
	}

	var boundingVolume = null;
	if (centeredItemReferenceId
		&& (centeredItemReferenceId in gearRenderableCache))
	{
		boundingVolume = this.getBoundingVolumeForItemReferenceId(centeredItemReferenceId);
	}
	if (focusedItemReferenceId
		&& (focusedItemReferenceId in gearRenderableCache))
	{
		boundingVolume = this.getBoundingVolumeForItemReferenceId(focusedItemReferenceId);
	}
	else
	{
		boundingVolume = this.getTotalBoundingVolume();
	}

	this.boundingVolume = boundingVolume;
	this.camera.updateForBoundingVolume(boundingVolume, !!focusedItemReferenceId, !!centeredItemReferenceId);

	// $HACK set character camera to a fixed distance
	if (!focusedItemReferenceId
		&& !centeredItemReferenceId)
	{
		this.camera.orientation.modelTranslationVertical = 1.0;
	}

	var success = (this.renderer.canRender()
				   && this.skeleton.loadSuccess
				   && this.animation.loadSuccess);

	this.onFinishedLoading(success);
};

Spasm.ItemPreview.prototype.onFinishedLoading = function(success)
{
	var callback = this.callback;
	if (callback)
	{
		if (!success)
		{
			this.stopAnimating(true);
		}

		callback(success);
		this.callback = null;
	}
};

Spasm.ItemPreview.prototype.startAnimating = function()
{
	if (!this.shouldAnimate)
	{
		this.shouldAnimate = true;
		this.canvas.style.display = "block";

		if (!this.isAnimating)
		{
			this.animate();
		}
	}
};

Spasm.ItemPreview.prototype.stopAnimating = function(hideOnPause)
{
	if (!this.shouldAnimate)
	{
		return false;
	}
	this.shouldAnimate = false;
	this.isAnimating = false;

	var shouldHide = typeof hideOnPause === "undefined" ? true : hideOnPause;
	if (shouldHide)
	{
		this.canvas.style.display = "none";
	}
};

Spasm.ItemPreview.prototype.animate = function()
{
	this.isAnimating = false;

	if (this.shouldAnimate
		&& this.renderer.canRender())
	{
		this.isAnimating = true;
		window.requestAnimationFrame(this.animationFrame);
	}
	else
	{
		this.stopAnimating();
		return;
	}

	var gl = this.renderer.gl;
	var skinningMatrices = this.skinningMatrices;

	var itemReferenceIds = this.itemReferenceIds;

	var gearShaders = this.gearShaders;
	var gearRenderables = this.gearRenderables;

	var skeleton = this.skeleton;
	var animation = this.animation;

	var shouldRender;
	var shouldSkin;

	if (itemReferenceIds.length > 1)
	{
		shouldSkin = true;

		if (skeleton.loadComplete
			&& animation.loadComplete)
		{
			if (skeleton.loadSuccess
				&& skeleton.loadSuccess)
			{
				shouldRender = true;
				var currentFrameIndex = this.frameIndex;
				var frameCount = animation.frameCount;

				var frameIndex;

				var inverseObjectSpaceTransformMatrices = skeleton.inverseObjectSpaceTransformMatrices;
				var parentNodeIndices = skeleton.parentNodeIndices;

				if (frameCount > 0
					&& inverseObjectSpaceTransformMatrices
					&& parentNodeIndices)
				{
					if (this.limitToFrame)
					{
						frameIndex = 0;
					}
					else if (currentFrameIndex >= frameCount)
					{
						// reset frame index
						frameIndex = 0;
					}
					else if (currentFrameIndex < 0)
					{
						// wrap around frame index
						frameIndex = frameCount - 1;
					}
					else
					{
						frameIndex = currentFrameIndex;
					}

					animation.frameFillTransformBuffer(frameIndex,
													   skinningMatrices,
													   inverseObjectSpaceTransformMatrices,
													   parentNodeIndices);

					if (!this.isAnimationPaused)
					{
						this.frameIndex = frameIndex + 0.5;
					}
				}
			}
			else
			{
				// skeleton or animation load failed
				shouldRender = false;
			}
		}
		else
		{
			// skeleton or animation not loaded
			shouldRender = false;
		}
	}
	else
	{
		// one item, don't skin
		shouldRender = true;
		shouldSkin = false;
	}

	// check canvas view port
	var canvas = this.canvas;
	var canvasSize = this.canvasSize;

	var canvasWidth = Math.abs(canvas.width);
	var canvasHeight = Math.abs(canvas.height);

	var canvasChanged = (canvasWidth !== canvasSize.width
						 || canvasHeight !== canvasSize.height);

	if (canvasChanged)
	{
		gl.viewport(0, 0, canvasWidth, canvasHeight);

		canvasSize.width = canvasWidth;
		canvasSize.height = canvasHeight;
	}

	if (!this.limitToFrame || this.camera.isDirty() || canvasChanged)
	{
		this.camera.updateMatrices();

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		if (gearShaders
			&& shouldRender
			&& this.assetLoaders
			&& Object.keys(this.assetLoaders).length === 0)
		{
			// gearShaders.setUniformData(this.cameraPositionUniformData);
			gearShaders.setUniformData(this.lightPositionUniformData);
			gearShaders.setUniformData(this.mutedColorDiffuseUnfiformData);

			gearShaders.setUniformData(this.camera.uniformDatas.projectionMatrix);
			gearShaders.setUniformData(this.camera.uniformDatas.modelMatrix);
			gearShaders.setUniformData(this.camera.uniformDatas.viewMatrix);

			if (shouldSkin)
			{
				gearShaders.setUniformData(this.skinningMatricesUniformData);
			}
			else
			{
				gearShaders.setUniformData(this.identityMatricesUniformData);
			}

			var gearRenderableCount = gearRenderables.length;
			for (var gearRenderableIndex = 0; gearRenderableIndex < gearRenderableCount; gearRenderableIndex++)
			{
				var gearRenderable = gearRenderables[gearRenderableIndex];
				var gearRenderableItemId = gearRenderable.itemId;
				var isMuted = (!!this.mutedItemReferenceIds
							   && (gearRenderableItemId in this.mutedItemReferenceIds));

				var variantsByCount = null;
				var useVariants = (gearRenderableItemId in this.variantItemReferenceIds);
				if (useVariants)
				{
					var renderWithHelmet = this.renderWithHelmet;
					variantsByCount = (renderWithHelmet
						? this.renderWithHelmetVariantsByCount
						: this.renderWithoutHelmetVariantsByCount);
				}

				gearRenderable.render(isMuted, variantsByCount);
			}

			// drop shadow
			if (this.dropShadowEnabled
				&& this.boundingVolume)
			{
				this.dropShadow.setBoundingVolume(this.boundingVolume);

				// $TODO $HACK translate shadow backwards 0.15 units to line up with the character animation
				if (this.itemReferenceIds.length > 1)
				{
					this.dropShadow.dropShadowTranslation[0] -= 0.15;
				}

				this.dropShadow.setUniformData(this.camera.uniformDatas.projectionMatrix);
				this.dropShadow.setUniformData(this.camera.uniformDatas.modelMatrix);
				this.dropShadow.setUniformData(this.camera.uniformDatas.viewMatrix);

				this.dropShadow.render();
			}
		}
	}
};

Spasm.ItemPreview.prototype.determineItemPreviewLoadProgress = function()
{
	this.totalLoadProgress = {loading : 0, loaded : 0};
	var totalLoadProgress = this.totalLoadProgress;

	var loadProgressPerItem = this.loadProgressPerItem;

	for (var itemReferenceId in loadProgressPerItem)
	{
		var itemProgress = loadProgressPerItem[itemReferenceId];
		totalLoadProgress.loading += itemProgress.loading;
		totalLoadProgress.loaded += itemProgress.loaded;
	}
	this.loadProgressCallback();
};

Spasm.ItemPreview.prototype.pauseAnimation = function()
{
	this.isAnimationPaused = true;
};

Spasm.ItemPreview.prototype.unPauseAnimation = function()
{
	this.isAnimationPaused = false;
};