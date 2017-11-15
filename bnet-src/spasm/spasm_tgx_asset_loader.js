// spasm_tgx_asset_loader.js

var Spasm = Spasm || {};

Spasm.TGXAssetLoader = function(itemReferenceId, assetManifest, isFemale, classHash, callback, progressCallback)
{
	Spasm.assertString(itemReferenceId);
	Spasm.assertValid(assetManifest);
	Spasm.assertBoolean(isFemale);
	Spasm.assertFunction(callback);

	this.itemReferenceId = itemReferenceId;
	this.assetManifest = assetManifest;
	this.isFemale = isFemale;
	this.classHash = classHash;

	this.callback = callback;
	this.progressCallback = (typeof progressCallback !== "undefined" ? progressCallback : function()
	{
	});

	this.contentLoaders = {gear : {}, geometry : {}, textures : {}, platedTextures : {}};
	this.contentLoaded = {gear : {}, geometry : {}, textures : {}, platedTextures : {}};

	this.loadProgress = {loading : -1, loaded : -1};

	this.onLoadAssetManifest();
};

Spasm.TGXAssetLoader.prototype = {};

Spasm.TGXAssetLoader.prototype.onContentLoadComplete = function()
{
	if (this.callback)
	{
		this.callback(this, true);
		this.callback = null;
	}
};

Spasm.TGXAssetLoader.prototype.onLoadFailure = function()
{
	if (this.callback)
	{
		this.callback(this, false);
		this.callback = null;
	}
};

Spasm.TGXAssetLoader.prototype.getGearDyes = function(renderer)
{
	Spasm.assertInstance(renderer, Spasm.Renderer);

	var gl = renderer.gl;
	Spasm.assertWebGLContext(gl);

	var loadedGear = this.contentLoaded.gear;
	var gearKeys = Object.keys(loadedGear);
	var gearCount = gearKeys.length;

	Spasm.assert(gearCount >= 1);

	var textures = this.contentLoaded.textures;
	var textureKeys = Object.keys(textures);
	var textureCount = textureKeys.length;

	var gearKey = gearKeys[0];
	var gear = loadedGear[gearKey];

	var gearDyeDefinitions =
		{
			customDyes : gear.custom_dyes || [],
			defaultDyes : gear.default_dyes || [],
			lockedDyes : gear.locked_dyes || []
		};

	var gearDyes = {};

	var gearDyeDefinitionKeys = Object.keys(gearDyeDefinitions);
	var gearDyeDefinitionKeyCount = gearDyeDefinitionKeys.length;
	for (var gearDyeDefinitionKeyIndex = 0;
		 gearDyeDefinitionKeyIndex < gearDyeDefinitionKeyCount;
		 gearDyeDefinitionKeyIndex++)
	{
		var gearDyeDefinitionKey = gearDyeDefinitionKeys[gearDyeDefinitionKeyIndex];
		var gearDyeDefinitionsList = gearDyeDefinitions[gearDyeDefinitionKey];
		var gearDyeDefinitionCount = gearDyeDefinitionsList.length;

		var gearDyeList = [];

		for (var dyeIndex = 0; dyeIndex < gearDyeDefinitionCount; dyeIndex++)
		{
			var dye = gearDyeDefinitionsList[dyeIndex];
			var dyeTextureMetadata = dye.textures;

			var dyeTextureMetadataDiffuse = dyeTextureMetadata.diffuse;
			var dyeTextureMetadataNormal = dyeTextureMetadata.normal;
			var dyeTextureMetadataDecal = dyeTextureMetadata.decal;

			var dyeTextureReferenceIdDiffuse = dyeTextureMetadataDiffuse.reference_id;
			var dyeTextureReferenceIdNormal = dyeTextureMetadataNormal.reference_id;
			var dyeTextureReferenceIdDecal = dyeTextureMetadataDecal.reference_id;

			var dyeTextures = {};

			for (var textureIndex = 0; textureIndex < textureCount; textureIndex++)
			{
				var textureKey = textureKeys[textureIndex];
				var textureImage = textures[textureKey];
				var textureHandleIndex;

				//noinspection IfStatementWithTooManyBranchesJS
				if (dyeTextureReferenceIdDiffuse
					&& textureKey.indexOf(dyeTextureReferenceIdDiffuse) >= 0)
				{
					textureHandleIndex = renderer.getDiffuseDyeTextureIndex();
					dyeTextures.diffuse = new Spasm.Texture(gl, textureHandleIndex, textureImage);
				}
				else if (dyeTextureReferenceIdNormal
						 && textureKey.indexOf(dyeTextureReferenceIdNormal) >= 0)
				{
					textureHandleIndex = renderer.getNormalDyeTextureIndex();
					dyeTextures.normal = new Spasm.Texture(gl, textureHandleIndex, textureImage);
				}
				else if (dyeTextureReferenceIdDecal
						 && textureKey.indexOf(dyeTextureReferenceIdDecal) >= 0)
				{
					textureHandleIndex = renderer.getDecalDyeTextureIndex();
					dyeTextures.decal = new Spasm.Texture(gl, textureHandleIndex, textureImage);
				}
				else
				{
					textureHandleIndex = null;
				}
			}

			var gearDye = new Spasm.GearDye(dye, dyeTextures);

			gearDyeList.push(gearDye);
		}

		gearDyes[gearDyeDefinitionKey] = gearDyeList;
	}

	return gearDyes;
};

Spasm.TGXAssetLoader.prototype.getGearRenderable = function(renderer)
{
	Spasm.assertInstance(renderer, Spasm.Renderer);

	var gl = renderer.gl;
	Spasm.assertWebGLContext(gl);

	var itemReferenceId = this.itemReferenceId;

	var gearRenderableModels = this.getGearRenderableModels(renderer);
	var gearRenderable = new Spasm.GearRenderable(itemReferenceId, gearRenderableModels);

	return gearRenderable;
};

Spasm.TGXAssetLoader.prototype.getGearRenderableModels = function(renderer)
{
	Spasm.assertInstance(renderer, Spasm.Renderer);

	var gl = renderer.gl;
	Spasm.assertWebGLContext(gl);

	var contentLoaded = this.contentLoaded;
	var geometry = contentLoaded.geometry;

	var gearRenderableModels = [];
	var gearIdentifiers = [];

	var gears = contentLoaded.gear;
	for (var gearPath in gears)
	{
		var gear = gears[gearPath];

		var artContent = gear.art_content;

		var artContentSets = gear.art_content_sets;
		if (artContentSets)
		{
			var artContentSetCount = artContentSets.length;
			if (artContentSetCount > 1)
			{
				var classHash = this.classHash;
				var selectedArtContentSet = null;
				for (var artContentSetIndex = 0; artContentSetIndex < artContentSetCount; artContentSetIndex++)
				{
					var artContentSet = artContentSets[artContentSetIndex];

					if (selectedArtContentSet === null
						|| artContentSet.classHash == classHash)
					{
						selectedArtContentSet = artContentSet;
					}
				}

				if (selectedArtContentSet !== null
					&& selectedArtContentSet.arrangement != null)
				{
					artContent = selectedArtContentSet.arrangement;
				}
			}
		}

		if (artContent)
		{
			var gearSet = artContent.gear_set;

			var regions = gearSet.regions;
			var regionCount = regions.length;
			if (regionCount > 0)
			{
				for (var regionIndex = 0; regionIndex < regionCount; regionIndex++)
				{
					var region = regions[regionIndex];
					var patternList = region.pattern_list;
					var patternCount = patternList.length;
					if (patternCount > 0)
					{
						var pattern = patternList[0];
						var patternGeometryHashes = pattern.geometry_hashes;
						var patternGeometryHashCount = patternGeometryHashes.length;
						for (var patternGeometryHashIndex = 0;
							 patternGeometryHashIndex < patternGeometryHashCount;
							 patternGeometryHashIndex++)
						{
							var patternGeometryHash = patternGeometryHashes[patternGeometryHashIndex];
							gearIdentifiers.push(patternGeometryHash);
						}
					}
				}
			}
			else
			{
				var artArrangement = null;
				if (this.isFemale)
				{
					artArrangement = gearSet.female_override_art_arrangement;
				}
				else
				{
					artArrangement = gearSet.base_art_arrangement;
				}

				if (artArrangement !== null)
				{
					var geometryHashes = artArrangement.geometry_hashes;
					var geometryHashCount = geometryHashes.length;
					for (var geometryHashIndex = 0; geometryHashIndex < geometryHashCount; geometryHashIndex++)
					{
						var geometryHash = geometryHashes[geometryHashIndex];
						gearIdentifiers.push(geometryHash);
					}
				}
			}
		}
	}

	var gearIdentifierCount = gearIdentifiers.length;
	for (var gearIdentifierIndex = 0; gearIdentifierIndex < gearIdentifierCount; gearIdentifierIndex++)
	{
		var gearIdentifier = gearIdentifiers[gearIdentifierIndex];
		var geometryFiles = geometry[gearIdentifier];
		if (geometryFiles)
		{
			var gearRenderableModel = this.getGearRenderableModel(renderer, gearIdentifier, geometryFiles);
			gearRenderableModels.push(gearRenderableModel);
		}
	}

	return gearRenderableModels;
};

Spasm.TGXAssetLoader.prototype.getGearRenderableModel = function(renderer, gearIdentifier, geometryFiles)
{
	Spasm.assertInstance(renderer, Spasm.Renderer);
	Spasm.assertString(gearIdentifier);
	Spasm.assertValid(geometryFiles);

	var gl = renderer.gl;
	var contentLoaded = this.contentLoaded;

	var renderMetadataBuffer = geometryFiles["render_metadata.js"];
	var renderMetadataCharBuffer = new Uint8Array(renderMetadataBuffer);

	var renderMetadataJSON = Spasm.Utilities.jsonFromCharBuffer(renderMetadataCharBuffer);
	Spasm.assertValid(renderMetadataJSON);

	var renderModel = renderMetadataJSON.render_model;
	var renderMeshes = renderModel.render_meshes;
	var renderMeshCount = renderMeshes.length;

	var textureDiffuse = null;
	var textureNormal = null;
	var textureGearstack = null;

	var textureIndexDiffuse = renderer.getDiffusePlateTextureIndex();
	var textureIndexNormal = renderer.getNormalPlateTextureIndex();
	var textureIndexGearstack = renderer.getGearstackPlateTextureIndex();

	var texturePlateMetadata = renderMetadataJSON.texture_plates;
	var texturePlateCount = texturePlateMetadata.length;
	if (texturePlateCount === 1)
	{
		var texturePlate = texturePlateMetadata[0];
		var texturePlateSet = texturePlate.plate_set;

		var texturePlateDiffuse = texturePlateSet.diffuse;
		var texturePlateNormal = texturePlateSet.normal;
		var texturePlateGearstack = texturePlateSet.gearstack;

		var texturePlateReferenceIdDiffuse = texturePlateDiffuse.reference_id;
		var texturePlateReferenceIdNormal = texturePlateNormal.reference_id;
		var texturePlateReferenceIdGearstack = texturePlateGearstack.reference_id;

		var platedTextures = contentLoaded.platedTextures;
		var platedTextureKeys = Object.keys(platedTextures);
		var platedTextureCount = platedTextureKeys.length;
		for (var platedTextureIndex = 0;
			 platedTextureIndex < platedTextureCount;
			 platedTextureIndex++)
		{
			var platedTextureKey = platedTextureKeys[platedTextureIndex];
			if (platedTextureKey.indexOf(texturePlateReferenceIdDiffuse) >= 0)
			{
				var textureImageDiffuse = platedTextures[platedTextureKey];
				textureDiffuse = new Spasm.Texture(gl, textureIndexDiffuse, textureImageDiffuse);
			}
			else if (platedTextureKey.indexOf(texturePlateReferenceIdNormal) >= 0)
			{
				var textureImageNormal = platedTextures[platedTextureKey];
				textureNormal = new Spasm.Texture(gl, textureIndexNormal, textureImageNormal);
			}
			else if (platedTextureKey.indexOf(texturePlateReferenceIdGearstack) >= 0)
			{
				var textureImageGearstack = platedTextures[platedTextureKey];
				textureGearstack = new Spasm.Texture(gl, textureIndexGearstack, textureImageGearstack);
			}
		}
	}
	else
	{
		var loadedTextures = contentLoaded.textures;
		var loadedTextureKeys = Object.keys(loadedTextures);
		var loadedTextureCount = loadedTextureKeys.length;

		// $HACK no plated textures? try the shader static textures
		if (renderMeshCount > 0)
		{
			var renderMeshForHack = renderMeshes[0];
			var stagePartCount = renderMeshForHack.stage_part_list.length;
			for (var stagePartIndex = 0; stagePartIndex < stagePartCount; stagePartIndex++)
			{
				var renderMeshStagePart = renderMeshForHack.stage_part_list[stagePartIndex];
				var stagePartShader = renderMeshStagePart.shader;
				if (stagePartShader && stagePartShader.static_textures)
				{
					var staticTextures = stagePartShader.static_textures;
					var staticTextureCount = staticTextures.length;
					if (staticTextureCount >= 5)
					{
						// $HACK hard coding static texture indices for hands
						var staticTextureIdDiffuse = staticTextures[0];
						var staticTextureIdNormal = staticTextures[2];
						var staticTextureIdGearstack = staticTextures[4];

						var staticTextureKeyDiffuse = null;
						var staticTextureKeyNormal = null;
						var staticTextureKeyGearstack = null;

						for (var loadedTextureIndex = 0;
							 loadedTextureIndex < loadedTextureCount;
							 loadedTextureIndex++)
						{
							var loadedTextureKey = loadedTextureKeys[loadedTextureIndex];
							if (loadedTextureKey.indexOf(staticTextureIdDiffuse) >= 0)
							{
								staticTextureKeyDiffuse = loadedTextureKey;
							}
							else if (loadedTextureKey.indexOf(staticTextureIdNormal) >= 0)
							{
								staticTextureKeyNormal = loadedTextureKey;
							}
							else if (loadedTextureKey.indexOf(staticTextureIdGearstack) >= 0)
							{
								staticTextureKeyGearstack = loadedTextureKey;
							}
						}

						if (staticTextureKeyDiffuse && staticTextureKeyNormal && staticTextureKeyGearstack)
						{
							var staticTextureImageDiffuse = loadedTextures[staticTextureKeyDiffuse];
							var staticTextureImageNormal = loadedTextures[staticTextureKeyNormal];
							var staticTextureImageGearstack = loadedTextures[staticTextureKeyGearstack];

							textureDiffuse = new Spasm.Texture(gl,
															   textureIndexDiffuse,
															   staticTextureImageDiffuse);
							textureNormal = new Spasm.Texture(gl,
															  textureIndexNormal,
															  staticTextureImageNormal);
							textureGearstack = new Spasm.Texture(gl,
																 textureIndexGearstack,
																 staticTextureImageGearstack);
							break;
						}
					}
				}
			}
		}
	}

	var texturePlates =
		{
			diffuse : textureDiffuse,
			normal : textureNormal,
			gearstack : textureGearstack
		};

	var textures = [];

	var renderableMeshes = [];
	for (var renderMeshIndex = 0; renderMeshIndex < renderMeshCount; renderMeshIndex++)
	{
		var renderMesh = renderMeshes[renderMeshIndex];
		var renderMeshObject = new Spasm.RenderMesh(renderMesh);

		// set index buffer
		var indexBufferMetadata = renderMesh.index_buffer;
		var indexBufferFileName = indexBufferMetadata.file_name;
		var indexBufferByteSize = indexBufferMetadata.byte_size;
		var indexBufferValueByteSize = indexBufferMetadata.value_byte_size;
		var indexCount = indexBufferByteSize / indexBufferValueByteSize;

		var indexArrayBuffer = geometryFiles[indexBufferFileName];
		var indexBufferObject = new Spasm.IndexBuffer(gl, indexArrayBuffer, indexCount, gl.UNSIGNED_SHORT);
		renderMeshObject.setIndexBuffer(indexBufferObject);

		// get vertex buffer attributes
		var attributes = renderMeshObject.getAttributes(gl);

		// set vertex buffers
		var vertexBufferMetadatas = renderMesh.vertex_buffers;
		var vertexBufferCount = vertexBufferMetadatas.length;
		var vertexBufferObjects = [];
		for (var vertexBufferIndex = 0; vertexBufferIndex < vertexBufferCount; vertexBufferIndex++)
		{
			var vertexBufferMetadata = vertexBufferMetadatas[vertexBufferIndex];
			var vertexBufferFileName = vertexBufferMetadata.file_name;
			var vertexBufferByteSize = vertexBufferMetadata.byte_size;
			var vertexBufferStrideByteSize = vertexBufferMetadata.stride_byte_size;
			var vertexCount = vertexBufferByteSize / vertexBufferStrideByteSize;

			if (!Spasm.Utilities.stringEndsWith(vertexBufferFileName, ".tgx"))
			{
				vertexBufferFileName += ".tgx";
			}
			var vertexArrayBuffer = geometryFiles[vertexBufferFileName];
			var vertexBufferObject = new Spasm.VertexBuffer(gl, vertexArrayBuffer,
															vertexBufferStrideByteSize, vertexCount,
															attributes[vertexBufferIndex]);
			vertexBufferObjects.push(vertexBufferObject);
		}

		renderMeshObject.setVertexBuffers(vertexBufferObjects);

		var renderableMesh = renderMeshObject.getRenderable(gl, textures, texturePlates);
		renderableMeshes.push(renderableMesh);
	}

	var gearRenderableModel = new Spasm.GearRenderableModel(gearIdentifier, renderableMeshes);
	return gearRenderableModel;
};

Spasm.TGXAssetLoader.prototype.onLoadAssetManifest = function()
{
	var assetManifest = this.assetManifest;
	Spasm.assertValid(assetManifest);

	var contentArray = assetManifest.content;

	var platformContent = null;
	for (var contentIndex = 0; contentIndex < contentArray.length; contentIndex++)
	{
		platformContent = contentArray[contentIndex];
		if (platformContent.platform === "web")
		{
			break;
		}
	}

	var indexSets = [];
	var regionKeysToNotLoad =
		{
			"2" : 2, // hud
			"6" : 6, // ammo
			"21" : 21 // reticle
		};

	var dyeIndexSet = platformContent.dye_index_set;
	if (dyeIndexSet)
	{
		indexSets.push(dyeIndexSet);
	}

	var regionsIndexSets = platformContent.region_index_sets;
	var femaleIndexSet = platformContent.female_index_set;
	var maleIndexSet = platformContent.male_index_set;

	if (regionsIndexSets)
	{
		var regionKeys = Object.keys(regionsIndexSets);
		var regionKeyCount = regionKeys.length;

		for (var regionKeyIndex = 0; regionKeyIndex < regionKeyCount; regionKeyIndex++)
		{
			var regionKey = regionKeys[regionKeyIndex];
			var regionKeyString = "" + regionKey;
			if (!(regionKeyString in regionKeysToNotLoad))
			{
				var regionIndexSets = regionsIndexSets[regionKey];
				var regionIndexSetCount = regionIndexSets.length;

				if (regionIndexSetCount > 0)
				{
					indexSets.push(regionIndexSets[0]);
				}
			}
		}
	}
	else if (this.isFemale)
	{
		indexSets.push(femaleIndexSet);
	}
	else
	{
		indexSets.push(maleIndexSet);
	}

	var gear = assetManifest.gear;
	var geometry = platformContent.geometry;
	var textures = platformContent.textures;
	var platedTextures = platformContent.plate_regions;

	var geometryIndexSet = {};
	var textureIndexSet = {};
	var platedTextureIndexSet = {};

	var indexSetCount = indexSets.length || 0;
	for (var indexSetIndex = 0; indexSetIndex < indexSetCount; indexSetIndex++)
	{
		var indexSet = indexSets[indexSetIndex] || {};
		if (indexSet.geometry)
		{
			var indexSetGeometry = indexSet.geometry;
			for (var indexSetGeometryIndex = 0;
				 indexSetGeometryIndex < indexSetGeometry.length;
				 indexSetGeometryIndex++)
			{
				var indexSetGeometryValue = indexSetGeometry[indexSetGeometryIndex];
				geometryIndexSet[indexSetGeometryValue] = indexSetGeometryValue;
			}
		}

		if (indexSet.textures)
		{
			var indexSetTextures = indexSet.textures;
			for (var indexSetTexturesIndex = 0;
				 indexSetTexturesIndex < indexSetTextures.length;
				 indexSetTexturesIndex++)
			{
				var indexSetTexturesValue = indexSetTextures[indexSetTexturesIndex];
				textureIndexSet[indexSetTexturesValue] = indexSetTexturesValue;
			}
		}

		if (indexSet.plate_regions)
		{
			var indexSetPlatedTextures = indexSet.plate_regions;
			for (var indexSetPlatedTexturesIndex = 0;
				 indexSetPlatedTexturesIndex < indexSetPlatedTextures.length;
				 indexSetPlatedTexturesIndex++)
			{
				var indexSetPlatedTexturesValue = indexSetPlatedTextures[indexSetPlatedTexturesIndex];
				platedTextureIndexSet[indexSetPlatedTexturesValue] = indexSetPlatedTexturesValue;
			}
		}
	}

	var gearLoaders = this.contentLoaders.gear;
	var geometryBufferLoaders = this.contentLoaders.geometry;
	var textureLoaders = this.contentLoaders.textures;
	var platedTextureLoaders = this.contentLoaders.platedTextures;

	var self = this;
	var gearLoaderCallback = function(loader)
	{
		self.onLoadGearJSON(loader);
	};

	var gearCount = gear.length;
	for (var gearIndex = 0; gearIndex < gearCount; gearIndex++)
	{
		var gearFileName = gear[gearIndex];
		Spasm.assert(Spasm.Utilities.stringEndsWith(gearFileName, ".js"));

		var gearFilePath = Spasm.Path.addVersionQuery(Spasm.Path.combine(Spasm.Content.GearPath,
																		 gearFileName));

		gearLoaders[gearFilePath] = new Spasm.JSONLoader(gearFilePath, gearLoaderCallback);
	}

	var geometryLoaderCallback = function(loader)
	{
		self.onLoadGeometryBuffer(loader);
	};

	var geometryIndexSetKeys = Object.keys(geometryIndexSet);
	var geometryIndexCount = geometryIndexSetKeys.length;
	for (var geometryIndexSetIndex = 0; geometryIndexSetIndex < geometryIndexCount; geometryIndexSetIndex++)
	{
		var geometryIndex = geometryIndexSetKeys[geometryIndexSetIndex];
		var geometryFileName = geometry[geometryIndex];

		var geometryFilePath = Spasm.Path.addVersionQuery(Spasm.Path.combine(Spasm.Content.GeometryPath,
																			 geometryFileName));

		geometryBufferLoaders[geometryFilePath] = new Spasm.TGXBinLoader(geometryFilePath,
																		 geometryLoaderCallback);
	}

	var textureLoaderCallback = function(loader)
	{
		self.onLoadTexture(loader);
	};

	var textureIndexSetKeys = Object.keys(textureIndexSet);
	var textureIndexCount = textureIndexSetKeys.length;
	for (var textureIndexSetIndex = 0; textureIndexSetIndex < textureIndexCount; textureIndexSetIndex++)
	{
		var textureIndex = textureIndexSetKeys[textureIndexSetIndex];
		var textureFileName = textures[textureIndex];
		var textureFilePath = Spasm.Path.addVersionQuery(Spasm.Path.combine(Spasm.Content.TexturesPath,
																			textureFileName));

		textureLoaders[textureFilePath] = new Spasm.TextureLoader(textureFilePath, textureLoaderCallback);
	}

	var platedTextureLoaderCallback = function(loader)
	{
		self.onLoadPlatedTexture(loader);
	};

	var platedTextureIndexSetKeys = Object.keys(platedTextureIndexSet);
	var platedTextureIndexCount = platedTextureIndexSetKeys.length;
	for (var platedTextureIndexSetIndex = 0;
		 platedTextureIndexSetIndex < platedTextureIndexCount;
		 platedTextureIndexSetIndex++)
	{
		var platedTextureIndex = platedTextureIndexSetKeys[platedTextureIndexSetIndex];
		var platedTextureFileName = platedTextures[platedTextureIndex];
		var platedTextureFilePath = Spasm.Path.addVersionQuery(Spasm.Path.combine(Spasm.Content.PlatedTexturesPath,
																				  platedTextureFileName));

		platedTextureLoaders[platedTextureFilePath] = new Spasm.TextureLoader(platedTextureFilePath,
																			  platedTextureLoaderCallback);
	}
};

Spasm.TGXAssetLoader.prototype.checkContentLoadComplete = function()
{
	var contentLoaders = this.contentLoaders;

	this.determineLoadProgress();

	var outstandingContentLoaderCount = 0;

	var contentLoaderGroupKeys = Object.keys(contentLoaders);
	var contentLoaderGroupCount = contentLoaderGroupKeys.length;
	for (var contentLoaderGroupIndex = 0;
		 contentLoaderGroupIndex < contentLoaderGroupCount;
		 contentLoaderGroupIndex++)
	{
		var contentLoaderGroupName = contentLoaderGroupKeys[contentLoaderGroupIndex];
		var contentLoaderGroup = contentLoaders[contentLoaderGroupName];
		var contentLoaderKeys = Object.keys(contentLoaderGroup);
		outstandingContentLoaderCount += contentLoaderKeys.length;
	}

	if (outstandingContentLoaderCount === 0)
	{
		this.onContentLoadComplete();
	}
};

Spasm.TGXAssetLoader.prototype.determineLoadProgress = function()
{
	var key;
	var contentLoaders = this.contentLoaders;
	var contentLoaded = this.contentLoaded;

	var loadingKeys = 0;
	var loadedKeys = 0;

	for (key in contentLoaders)
	{
		var loaderGroup = contentLoaders[key];
		loadingKeys += Object.keys(loaderGroup).length;
	}

	for (key in contentLoaded)
	{
		var loadedGroup = contentLoaded[key];
		loadedKeys += Object.keys(loadedGroup).length;
	}

	this.loadProgress = {
		loading : loadingKeys,
		loaded : loadedKeys
	};

	this.progressCallback(this, this.itemReferenceId);
};

Spasm.TGXAssetLoader.prototype.onLoadGearJSON = function(loader)
{
	Spasm.assertInstance(loader, Spasm.JSONLoader);

	if (loader.isCompleteAndOK())
	{
		var filePath = loader.filePath;
		Spasm.assertPath(filePath);

		var parsedResponse = loader.parsedResponse;
		Spasm.assertValid(parsedResponse);

		this.contentLoaded.gear[filePath] = parsedResponse;
		var gearLoaders = this.contentLoaders.gear;

		Spasm.assert(filePath in gearLoaders);

		var gearLoader = gearLoaders[filePath];
		Spasm.assertEqual(gearLoader, loader);

		delete gearLoaders[filePath];

		this.checkContentLoadComplete();
	}
	else
	{
		this.onLoadFailure();
	}
};

Spasm.TGXAssetLoader.prototype.onLoadGeometryBuffer = function(loader)
{
	Spasm.assertInstance(loader, Spasm.TGXBinLoader);

	if (loader.isCompleteAndOK())
	{
		var filePath = loader.filePath;
		Spasm.assertPath(filePath);

		var fileIdentifier = loader.fileIdentifier;
		Spasm.assertString(fileIdentifier);

		var fileBuffers = loader.getFileBuffers();
		Spasm.assertValid(fileBuffers);

		this.contentLoaded.geometry[fileIdentifier] = fileBuffers;

		var geometryLoaders = this.contentLoaders.geometry;
		Spasm.assert(filePath in geometryLoaders);

		var geometryLoader = geometryLoaders[filePath];
		Spasm.assertEqual(geometryLoader, loader);

		delete geometryLoaders[filePath];

		this.checkContentLoadComplete();
	}
	else
	{
		this.onLoadFailure();
	}
};

Spasm.TGXAssetLoader.prototype.onLoadTexture = function(loader)
{
	Spasm.assertInstance(loader, Spasm.TextureLoader);

	if (loader.isCompleteAndOK())
	{
		var filePath = loader.filePath;
		Spasm.assertPath(filePath);

		var image = loader.image;
		Spasm.assertValid(image);

		this.contentLoaded.textures[filePath] = image;

		var textureLoaders = this.contentLoaders.textures;
		var textureLoader = textureLoaders[filePath];
		Spasm.assertEqual(textureLoader, loader);

		delete textureLoaders[filePath];

		this.checkContentLoadComplete();
	}
	else
	{
		this.onLoadFailure();
	}
};

Spasm.TGXAssetLoader.prototype.onLoadPlatedTexture = function(loader)
{
	Spasm.assertInstance(loader, Spasm.TextureLoader);

	if (loader.isCompleteAndOK())
	{
		var filePath = loader.filePath;
		Spasm.assertPath(filePath);

		var image = loader.image;

		// now using <img> element
		Spasm.assertValid(image, Image);

		this.contentLoaded.platedTextures[filePath] = image;

		var platedTextureLoaders = this.contentLoaders.platedTextures;
		var platedTextureLoader = platedTextureLoaders[filePath];
		Spasm.assertEqual(platedTextureLoader, loader);

		delete platedTextureLoaders[filePath];

		this.checkContentLoadComplete();
	}
	else
	{
		this.onLoadFailure();
	}
};
