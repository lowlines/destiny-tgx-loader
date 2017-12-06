// Sources
// https://www.bungie.net/sharedbundle/spasm
// http://www.gdcvault.com/play/1020412/Building-Customizable-Characters-for-Bungie
// http://advances.realtimerendering.com/destiny/siggraph2014/
// http://advances.realtimerendering.com/destiny/gdc_2017/

// @codekit-append "three.tgxutils.js";
// @codekit-append "three.tgxloader.js";
// @codekit-append "three.tgxmaterial.js";
// @codekit-append "three.tgxmanifest.js";

THREE.TGXLoaderUtils = (function() {
	var scope = {
		// https://www.khronos.org/opengl/wiki/Normalized_Integer
		unormalize: function(value, bits) {
			var max = Math.pow(2, bits) - 1;
			return value/max;
		},

		normalize: function(value, bits) {
			var max = Math.pow(2, bits-1) - 1;
			return Math.max(value/max, -1);
		},

		byte: function(data, offset) {
			return scope.decodeSigned(data, offset, 1);
		},

		ubyte: function(data, offset) {
			return scope.decodeUnsigned(data, offset, 1);
		},

		short: function(data, offset) {
			return scope.decodeSigned(data, offset, 2);
		},

		ushort: function(data, offset) {
			return scope.decodeUnsigned(data, offset, 2);
		},

		int: function(data, offset) {
			return scope.decodeSigned(data, offset, 4);
		},

		uint: function(data, offset) {
			return scope.decodeUnsigned(data, offset, 4);
		},

		float: function(data, offset) {
			return scope.decodeFloat(scope.bytes(data, offset, 4), 1, 8, 23, -126, 127);
		},

		bytes: function(data, offset, length) {
			var bytes = [];
			for (var i=0; i<length; i++) {
				bytes.push(scope.ubyte(data, offset+i));
			}
			return bytes;
		},

		string: function(data, offset, length) {
			var str = '';
			if (offset == undefined) offset = 0;
			if (length == undefined) length = data.length-offset;
			for (var i=0; i<length; i++) {
				var chr = data[offset+i];
				if (chr == 0) continue;
				str += String.fromCharCode(chr);
			}
			//var str = data.substr(offset, length);
			//if (str.indexOf("\0") != -1) str = str.substr(0, str.indexOf("\0"));
			return str;
		},

		bits: function(value, length) {
			var str = '';
			for (var i=0; i<length; i++) {
				str = ((value >> i) & 0x1)+str;
			}
			return str;
		},

		radianToDegrees: function(value) {
			return value * 180 / Math.PI;
		},

		degreesToRadian: function(value) {
			return value * Math.PI / 180;
		},

		padNum: function(num, length) {
			num = num.toString();
			while(num.length < length) {
				num = '0'+num;
			}
			return num;
		},

		decodeHex: function(data, offset, length) {
			var hex = '';

			if (typeof data == 'number') {
				length = offset != undefined ? offset : 4;
				for (var i=0; i<length; i++) {
					var u8 = (data >> (i*8)) & 0xFF;
					hex = scope.padNum(u8.toString(16), 2).toUpperCase() + hex;
				}
				return '0x'+hex;
			}

			if (offset == undefined) offset = 0;
			if (length == undefined) length = data.length;
			for (var i=0; i<length; i++) {
				hex = scope.padNum(data.charCodeAt(offset+i).toString(16).toUpperCase(), 2) + hex;
			}
			return '0x'+hex;
		},

		decodeUnsigned: function(data, offset, length) {
			var int = 0;
			for (var i=0; i<length; i++) {
				int |= data[offset+i] << (i*8);
			}
			return int;
		},

		decodeSigned: function(data, offset, length) {
			if (typeof data != 'number') data = scope.decodeUnsigned(data, offset, length);
			else length = offset;
			var bits = length * 8;
			var max = (1 << bits) - 1;
			if (data & (1 << (bits - 1))) {
				data = (data & max) - max;
			}
			return data;
		},

		decodeFloat: function(bytes, signBits, exponentBits, fractionBits, eMin, eMax, littleEndian) {
			if (littleEndian == undefined) littleEndian = true;
			var totalBits = (signBits + exponentBits + fractionBits);

			var binary = "";
			for (var i = 0, l = bytes.length; i < l; i++) {
				var bits = bytes[i].toString(2);
				while (bits.length < 8)
					bits = "0" + bits;

				if (littleEndian)
					binary = bits + binary;
				else
					binary += bits;
			}

			var sign = (binary.charAt(0) == '1')?-1:1;
			var exponent = parseInt(binary.substr(signBits, exponentBits), 2) - eMax;
			var significandBase = binary.substr(signBits + exponentBits, fractionBits);
			var significandBin = '1'+significandBase;
			var i = 0;
			var val = 1;
			var significand = 0;

			if (exponent == -eMax) {
				if (significandBase.indexOf('1') == -1)
					return 0;
				else {
					exponent = eMin;
					significandBin = '0'+significandBase;
				}
			}

			while (i < significandBin.length) {
				significand += val * parseInt(significandBin.charAt(i));
				val = val / 2;
				i++;
			}

			return sign * significand * Math.pow(2, exponent);
		}
	};
	return scope;
})();

// This is a copy of THREE.FileLoader with some extra settings applied to the XMLHttpRequest
// Was getting this error when trying to apply it to a standard THREE.FileLoader
// Error: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.
THREE.BungieNetLoader = function(manager) {
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
};
Object.assign(THREE.BungieNetLoader.prototype, {
	load: function (url, apiKey, onLoad, onProgress, onError ) {

		if ( url === undefined ) url = '';

		if ( this.path !== undefined ) url = this.path + url;

		var scope = this;

		var cached = THREE.Cache.get( url );

		if ( cached !== undefined ) {

			scope.manager.itemStart( url );

			setTimeout( function () {

				if ( onLoad ) onLoad( cached );

				scope.manager.itemEnd( url );

			}, 0 );

			return cached;

		}

		var request = new XMLHttpRequest();
		request.open( 'GET', url, true );

		// If an API Key is supplied, add it to the request header
		// otherwise assume we want binary data
		if (typeof apiKey == 'string') request.setRequestHeader('X-API-Key', apiKey);
		if (url.indexOf('geometry') != -1) request.responseType = 'arraybuffer';

		request.addEventListener( 'load', function ( event ) {

			var response = event.target.response;

			THREE.Cache.add( url, response );

			if ( this.status === 200 ) {

				if ( onLoad ) onLoad( response );

				scope.manager.itemEnd( url );

			} else if ( this.status === 0 ) {

				// Some browsers return HTTP Status 0 when using non-http protocol
				// e.g. 'file://' or 'data://'. Handle as success.

				console.warn( 'THREE.FileLoader: HTTP Status 0 received.' );

				if ( onLoad ) onLoad( response );

				scope.manager.itemEnd( url );

			} else {

				if ( onError ) onError( event );

				scope.manager.itemError( url );

			}

		}, false );

		if ( onProgress !== undefined ) {

			request.addEventListener( 'progress', function ( event ) {

				onProgress( event );

			}, false );

		}

		request.addEventListener( 'error', function ( event ) {

			if ( onError ) onError( event );

			scope.manager.itemError( url );

		}, false );

		if ( this.responseType !== undefined ) request.responseType = this.responseType;
		if ( this.withCredentials !== undefined ) request.withCredentials = this.withCredentials;

		if ( request.overrideMimeType ) request.overrideMimeType( this.mimeType !== undefined ? this.mimeType : 'text/plain' );

		request.send( null );

		scope.manager.itemStart( url );

		return request;

	}
});

THREE.TGXLoader = function (manager) {
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
};

// Global defaults
THREE.TGXLoader.APIKey = null;
THREE.TGXLoader.APIBasepath = 'https://www.bungie.net/d1/Platform/Destiny';
THREE.TGXLoader.Basepath = 'https://www.bungie.net';
THREE.TGXLoader.Platform = 'web';
THREE.TGXLoader.ManifestPath = null;
THREE.TGXLoader.DefaultAnimationPath = 'destiny_player_animation.js';
THREE.TGXLoader.Game = 'destiny';
THREE.TGXLoader.NoCache = false;

THREE.TGXLoader.EnvMapPath = null;

// Destiny 2
THREE.TGXLoader.APIBasepath2 = 'https://www.bungie.net/Platform/Destiny2';
THREE.TGXLoader.ManifestPath2 = null;

Object.assign(THREE.TGXLoader.prototype, {
	load: function(options, onLoad, onProgress, onError) {
		var defaultOptions = {
			//itemHash: options,
			itemHashes: [options],
			shaderHash: 0,
			ornamentHash: 0,
			classHash: 0,
			isFemale: false,
			apiKey: THREE.TGXLoader.APIKey,
			//apiBasepath: THREE.TGXLoader.APIBasepath,
			basepath: THREE.TGXLoader.Basepath,
			platform: THREE.TGXLoader.Platform,
			//manifestPath: THREE.TGXLoader.ManifestPath,
			loadTextures: true,
			loadSkeleton: false,
			loadAnimation: false,
			animationPath: THREE.TGXLoader.DefaultAnimationPath,
			game: THREE.TGXLoader.Game,
			noCache: THREE.TGXLoader.NoCache,

			envMapPath: THREE.TGXLoader.EnvMapPath,

			ignoreLockedDyes: false,

			debugMode: false
		};
		if (typeof options != 'object') options = {};

		var game = options.game ? options.game : defaultOptions.game;
		switch(game) {
			case 'destiny2':
				defaultOptions.apiBasepath = THREE.TGXLoader.APIBasepath2;
				defaultOptions.manifestPath = THREE.TGXLoader.ManifestPath2;
				break;
			default:
				defaultOptions.apiBasepath = THREE.TGXLoader.APIBasepath;
				defaultOptions.manifestPath = THREE.TGXLoader.ManifestPath;
				break;
		}
		for (var key in defaultOptions) {
			if (options[key] === undefined) options[key] = defaultOptions[key];
		}

		if (options.itemHash != undefined) options.itemHashes = [options.itemHash];

		console.log('Loader', options);

		var scope = this;

		//if (onProgress === undefined) {
		//	onProgress = function(event) {
		//		console.log(event);
		//	}
		//}

		if (onError === undefined) {
			onError = function(error) {
				console.error(error);
			};
		}

		var url, loader, loadedCount = 0, loadedTotal = 0, items = [], shaderHashes = [], shaders = {};

		// Mobile manifest support
		if (options.platform == 'mobile' && !options.manifestPath && !THREE.TGXManifest.isCapable()) {
			options.platform = 'web';
		}

		function assetsLoaded() {
			if (loadedCount == loadedTotal) {
				for (var i=0; i<items.length; i++) {
					var item = items[i];
					item.shaderHash = shaderHashes[i];
				}
				scope.parse(items, shaders, options, onLoad, onProgress, onError);
			}
		}

		function itemAsset(itemIndex, itemHash) {
			gearAsset(itemHash, function(item) {
				//console.log('LoadedItem['+itemIndex+']', item);
				items[itemIndex] = item;
			});
		}

		function shaderAsset(itemIndex, shaderHash) {
			shaderHashes[itemIndex] = shaderHash;
			if (shaderHash == 0 || shaders[shaderHash] != undefined) {
				loadedCount++;
				assetsLoaded();
				return;
			}
			shaders[shaderHash] = null;
			gearAsset(shaderHash, function(shader) {
				//console.log('LoadedShader['+itemIndex+']', shader);
				shaders[shaderHash] = shader;
			});
		}

		function gearAsset(/*itemIndex*/itemHash, callback) {
			//var itemHash = options.itemHashes[itemIndex];
			if (options.platform == 'mobile') {
				if (options.manifestPath) { // Load manifest server-side
					var url = options.manifestPath.replace('$itemHash', itemHash);
					loader = new THREE.BungieNetLoader(this.manager);
					loader.load(url, options.apiKey, function(response) {
						loadedCount++;
						try { // Invalid JSON response
							response = JSON.parse(response);
							//items[itemIndex] = response;
							callback(response);
						} catch(e) {
							console.error('Invalid JSON', url);
						}
						assetsLoaded();
					}, onProgress, onError);
				} else { // Load manifest locally
					var manifest = THREE.TGXLoader.Manifest;
					if (!THREE.TGXLoader.Manifest) {
						THREE.TGXLoader.Manifest = manifest = new THREE.TGXManifest(this.manager, options);
					}
					manifest.getAsset(itemHash, function(data) {
						//items.push(data);
						loadedCount++;
						callback(data);
						assetsLoaded();
					}, onProgress, onError);
				}
				return;
			}

			// Web version support
			url = options.apiBasepath+'/Manifest/22/'+itemHash+'/'; // GetDestinySingleDefinition

			loader = new THREE.BungieNetLoader(this.manager);
			loader.load(url, options.apiKey, function (response) {
				loadedCount++;
				try { // Invalid JSON response
					response = JSON.parse(response);
				} catch(e) {
					console.error('Invalid JSON', url);
				}

				if (response.ErrorCode == 1) {
					//items[itemIndex] = response.Response.data;
					callback(response.Response.data);
				} else {
					console.error('Bungie Error Response', response);
				}
				assetsLoaded();
			}, onProgress, onError);
		}

		loadedTotal = options.itemHashes.length*2;

		// Only load the single ornamentHash when there is only one item
		var defaultOrnamentHash = options.itemHashes.length == 1 ? options.ornamentHash : 0;

		for (var i=0; i<options.itemHashes.length; i++) {
			var itemHash = options.itemHashes[i];
			var ornamentHash = options.ornamentHashes && i<options.ornamentHashes.length ? options.ornamentHashes[i] : defaultOrnamentHash;
			var shaderHash = options.shaderHashes && i < options.shaderHashes.length ? options.shaderHashes[i] : options.shaderHash;
			//console.log('Item['+i+']', options.itemHashes[i], 'Shader', shaderHash);
			itemAsset(i, ornamentHash ? ornamentHash : itemHash);
			shaderAsset(i, shaderHash);
		}
	},
	//parse: (function() {
	parse: function(items, shaders, options, onLoad, onProgress, onError) {
		var utils = THREE.TGXLoaderUtils;

		var game = options.game;
		var basepath = options.basepath;
		var contentpath = basepath+'/common/'+game+'_content';
		var platform = options.platform;
		var animationPath = options.animationPath;
		var isFemale = options.isFemale;
		var classHash = options.classHash;
		var loadSkeleton = options.loadSkeleton;
		var loadAnimation = options.loadAnimation;
		var loadTextures = options.loadTextures;
		var noCache = options.noCache;
		var onLoadCallback = onLoad;
		var onProgressCallback = onProgress;
		var onErrorCallback = onError;

		var ignoreLockedDyes = options.ignoreLockedDyes;
		var debugMode = options.debugMode;

		var contentLoaded = {
			items: items,
			regions: {},
			gear: {},
			tgxms: {
				geometry: {},
				textures: {}
			},
			geometry: {},
			textures: {},
			platedTextures: {},
			mobileTextures: {},
			skeleton: null,
			animations: []
		};
		var assetLoadCount = 0;
		var assetLoadTotal = 0;
		var contentParsed = false;

		// Rendering
		var hasBones = false;
		var defaultMaterial, geometry, materials;
		var vertexOffset = 0;

		// Missing Textures
		var DEFAULT_CUBEMAP = '2164797681_default_monocrome_cubemap'/*'env_0'*/;

		// Spasm.TGXAssetLoader.prototype.onLoadAssetManifest
		function loadAssetManifest(gear) {
			console.log('GearAsset', gear);
			if (!gear.gearAsset) {
				console.warn('MissingGearAsset', gear);
				return;
			}

			var gearAsset = gear.gearAsset;

			contentLoaded.regions[gear.requestedId] = [];

			// Tally up gear resources for loading
			assetLoadTotal += Object.keys(gearAsset.gear).length;
			if (loadSkeleton) assetLoadTotal++;
			if (loadAnimation) assetLoadTotal++;

			for (var i=0; i<gearAsset.content.length; i++) {
				var content = gearAsset.content[i];
				console.log('Content['+i+']', content);
				var contentRegions = loadAssetManifestContent(content);

				contentLoaded.regions[gear.requestedId][i] = contentRegions;
			}

			// Load Gear
			for (var gearIndex in gearAsset.gear) {
				(function(gearIndex) {
					var gearUrl = contentpath+'/geometry/gear/'+gearAsset.gear[gearIndex];
					loadPart(gearUrl, function(gear) {
						gear = JSON.parse(utils.string(gear));
						gear.url = gearUrl;
						//console.log('LoadGear', gearUrl);
						//console.log(gear);
						contentLoaded.gear[gear.reference_id] = gear;
						assetLoadCount++;
						checkContentLoaded();
					}, onProgressCallback, onErrorCallback);
				})(gearIndex);
			}

			// Load Bones / Animations
			if (loadSkeleton && contentLoaded.skeleton == undefined) {
				contentLoaded.skeleton = null;
				loadPart(contentpath+'/animations/destiny_player_skeleton.js', function(skeleton) {
					skeleton = JSON.parse(skeleton);
					contentLoaded.skeleton = skeleton;
					assetLoadCount++;
					checkContentLoaded();
				}, onProgressCallback, onErrorCallback);

				if (loadAnimation) {
					loadPart(contentpath+'/animations/'+animationPath, function(animations) {
						animations = JSON.parse(animations);
						contentLoaded.animations = animations;
						assetLoadCount++;
						checkContentLoaded();
					}, onProgressCallback, onErrorCallback);
				}
			}
		}

		function loadAssetManifestContent(content) {
			// Filter Regions
			var filteredRegionIndexSets = [];

			if (content.dye_index_set) {
				//console.log('DyeIndexSet', content.dye_index_set);
				filteredRegionIndexSets.push(content.dye_index_set);
			}

			if (content.region_index_sets) { // Use gender neutral sets
				for (var setIndex in content.region_index_sets) {
					var regionIndexSet = content.region_index_sets[setIndex];
					//console.log('RegionIndexSet', setIndex, regionIndexSet);
					var skipSet = false;
					// regionKeysToNotLoad
					//switch(parseInt(setIndex)) {
					//	//case 2: // hud
					//	case 6: // ammo
					//	case 21: // reticle
					//		skipSet = true;
					//		break;
					//	default:
					//		break;
					//}
					if (skipSet) continue;
					for (var j=0; j<regionIndexSet.length; j++) {
						filteredRegionIndexSets.push(regionIndexSet[j]);
					}
				}
			} else if (content.female_index_set && content.male_index_set) { // Use gender-specific set (ie armor)
				//console.log('GenderedIndexSet', content.female_index_set, content.male_index_set);
				filteredRegionIndexSets.push(isFemale ? content.female_index_set : content.male_index_set);
			} else {
				// This is probably a shader
				//console.warn('NoIndexSetFound['+i+']', content);
			}

			// Build Asset Index Table
			var geometryIndexes = {};
			var textureIndexes = {};
			var platedTextureIndexes = {};

			for (var filteredRegionIndex in filteredRegionIndexSets) {
				var filteredRegionIndexSet = filteredRegionIndexSets[filteredRegionIndex];
				var index, i;
				if (filteredRegionIndexSet == undefined) {
					console.warn('MissingFilterRegionIndexSet', filteredRegionIndex, filteredRegionIndexSets);
					continue;
				}
				// Shaders don't have geometry
				if (filteredRegionIndexSet.geometry) {
					for (i=0; i<filteredRegionIndexSet.geometry.length; i++) {
						index = filteredRegionIndexSet.geometry[i];
						geometryIndexes[index] = index;
					}
				}
				for (i=0; i<filteredRegionIndexSet.textures.length; i++) {
					index = filteredRegionIndexSet.textures[i];
					textureIndexes[index] = index;
				}
				// Web only
				if (filteredRegionIndexSet.plate_regions) {
					for (i=0; i<filteredRegionIndexSet.plate_regions.length; i++) {
						index = filteredRegionIndexSet.plate_regions[i];
						platedTextureIndexes[index] = index;
					}
				}
				// Apparently there are shaders?
				if (filteredRegionIndexSet.shaders) {
					console.warn('AssetHasShaders['+i+']', filteredRegionIndexSet.shaders);
				}
			}

			// Tally up geometries and textures for loading
			assetLoadTotal += Object.keys(geometryIndexes).length;
			if (loadTextures) {
				assetLoadTotal += Object.keys(textureIndexes).length;
				assetLoadTotal += Object.keys(platedTextureIndexes).length;
				assetLoadTotal++; // Envmap
			}

			// Remember everything for later
			var contentRegions = {
				//indexSets: filteredRegionIndexSets,
				geometry: {},
				textures: {},
				platedTextures: {},
				shaders: {}
			};

			// Load Geometry
			for (var geometryIndex in geometryIndexes) {
				(function(geometryIndex) {
					loadGeometry(content.geometry[geometryIndex], function(geometry) {
						//console.log('Geometry', geometry);
						contentLoaded.geometry[geometry.fileIdentifier] = geometry;
						contentRegions.geometry[geometryIndex] = geometry.fileIdentifier;
						assetLoadCount++;
						checkContentLoaded();
					});
				})(geometryIndex);
			}

			if (loadTextures) {
				// EnvMap
				var canvas = document.createElement('canvas');
				canvas.width = 64;
				canvas.height = 64;
				var ctx = canvas.getContext('2d');
				ctx.fillStyle = '#000000';
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				var envMap = canvas.toDataURL('image/png');
				loadDataTexture(envMap, DEFAULT_CUBEMAP, function(textureData) {
					assetLoadCount++;
					checkContentLoaded();
				});

				// Load Textures
				for (var textureIndex in textureIndexes) {
					(function(textureIndex) {
						var texture = content.textures[textureIndex];
						loadTexture(texture, false, function(textureData) {
							contentRegions.textures[textureIndex] = textureData.referenceId;
							assetLoadCount++;
							checkContentLoaded();
						});
					})(textureIndex);
				}

				// Load Plated Textures
				for (var platedTextureIndex in platedTextureIndexes) {
					(function(platedTextureIndex) {
						var platedTexture = content.plate_regions[platedTextureIndex];
						loadTexture(platedTexture, true, function(textureData) {
							contentRegions.platedTextures[platedTextureIndex] = textureData.referenceId;
							assetLoadCount++;
							checkContentLoaded();
						});
					})(platedTextureIndex);
				}
			}

			return contentRegions;
		}

		// Check for when all content has loaded
		function checkContentLoaded() {
			if (assetLoadCount < assetLoadTotal) return;
			if (contentParsed) return;
			contentParsed = true;

			parseContent(contentLoaded);
		}

		function loadPart(url, onLoad) {
			var loader = new THREE.BungieNetLoader( this.manager );
			loader.load(url+(noCache ? '?'+new Date().getTime() : ''), null, function (response) {
				if (response instanceof ArrayBuffer) response = new Uint8Array(response);
				if (onLoad) onLoad(response);
			}, onProgressCallback, onErrorCallback);
		}

		function loadGeometry(geometry, onLoad) {
			var url = contentpath+'/geometry/platform/'+platform+'/geometry/'+geometry;
			loadTGXBin(url, onLoad, onProgressCallback, onErrorCallback);
		}

		// Spasm.TGXBinLoader
		function loadTGXBin(url, onLoad) {
			loadPart(url, function(data) {
				//console.log(data);
				var magic = utils.string(data, 0x0, 0x4); // TGXM
				var version = utils.uint(data, 0x4);
				var fileOffset = utils.uint(data, 0x8);
				var fileCount = utils.uint(data, 0xC);
				var fileIdentifier = utils.string(data, 0x10, 0x100);
				//console.log(magic, version, fileOffset.toString(16), fileCount, fileIdentifier);
				if (magic != 'TGXM') {
					console.error('Invalid TGX File', url);
					return;
				}
				var files = [];
				var fileLookup = [];
				var renderMetadata = false;
				for (var f=0; f<fileCount; f++) {
					var headerOffset = fileOffset+0x110*f;
					var name = utils.string(data, headerOffset, 0x100);
					var offset = utils.uint(data, headerOffset+0x100);
					var type = utils.uint(data, headerOffset+0x104);
					var size = utils.uint(data, headerOffset+0x108);
					var fileData = data.slice(offset, offset+size);
					//console.log('file['+f+']', headerOffset.toString(16), name, offset.toString(16), size);
					if (name.indexOf('.js') != -1) { // render_metadata.js
						fileData = JSON.parse(utils.string(fileData));
						renderMetadata = fileData;
					}
					files.push({
						name: name,
						offset: offset,
						type: type,
						size: size,
						data: fileData
					});
					fileLookup.push(name);
				}
				var tgxBin = {
					url: url,
					fileIdentifier: fileIdentifier,
					files: files,
					lookup: fileLookup,
					metadata: renderMetadata
				};
				//console.log('LoadTGXBin', url);
				//console.log(tgxBin);
				contentLoaded.tgxms[url.indexOf('.bin') != -1 ? 'textures' : 'geometry'][url.slice(url.lastIndexOf('/')+1).split('.')[0]] = tgxBin;
				if (onLoad) onLoad(tgxBin);
			}, onProgressCallback, onErrorCallback);
		}

		function loadDataTexture(textureUri, referenceId, onLoad, isPlated) {
			if (isPlated === undefined) isPlated = false;

			var contentId = isPlated ? 'platedTextures' : 'textures';

			if (contentLoaded[contentId][referenceId] != undefined) {
				console.warn('CachedDataTexture['+referenceId+']', textureUri);
				if (onLoad) onLoad(contentLoaded[contentId][referenceId]);
				return;
			}

			var loader = new THREE.TextureLoader(this.manager);
			var textureData = loader.load(textureUri, function(texture) {
				if (onLoad) onLoad(texture);
			}, onProgressCallback, onErrorCallback);
			textureData.flipY = false;
			textureData.minFilter = THREE.LinearMipMapLinearFilter;
			//textureData.magFilter = THREE.NearestFilter;
			textureData.wrapS = THREE.RepeatWrapping;
			textureData.wrapT = THREE.RepeatWrapping;

			textureData.name = referenceId;
			textureData.src = textureUri;

			contentLoaded[contentId][referenceId] = {
				referenceId: referenceId,
				texture: textureData
			};
		}

		function loadTexture(texture, isPlated, onLoad) {
			if (isPlated === undefined) isPlated = false;
			var url = contentpath+'/geometry/platform/'+platform+'/'+(isPlated ? 'plated_textures' : 'textures')+'/'+texture;

			var referenceId = texture.split('.')[0];

			if (texture.indexOf('.bin') != -1) { // Mobile texture
				loadTGXBin(url, function(tgxBin) {
					//console.log('MobileTexture', tgxBin);
					contentLoaded.mobileTextures[referenceId] = {
						url: url,
						referenceId: referenceId,
						fileIdentifier: tgxBin.fileIdentifier,
						texture: tgxBin.lookup
					};
					var count = 0;
					var total = tgxBin.files.length;
					for (var i=0; i<tgxBin.files.length; i++) {
						(function(fileIndex) {
							var textureFile = tgxBin.files[fileIndex];
							if (contentLoaded['textures'][textureFile.name] !== undefined) {
								//console.warn('CachedTexture', textureFile);
								count++;
								if (count == total && onLoad) onLoad(contentLoaded.mobileTextures[referenceId]);
								return;
							}
							var textureData = loadMobileTexture(textureFile, function() {
								count++;
								//console.log('MobileTexture['+referenceId+']', textureFile.name, textureData.image.src);
								if (count == total && onLoad) onLoad(contentLoaded.mobileTextures[referenceId]);
							});
							textureData.name = textureFile.name;
							textureData.flipY = false;
							textureData.minFilter = THREE.LinearFilter;
							textureData.magFilter = THREE.LinearFilter;
							textureData.wrapS = THREE.RepeatWrapping;
							textureData.wrapT = THREE.RepeatWrapping;
							contentLoaded['textures'][textureFile.name] = {
								url: url,
								mobileReferenceId: referenceId,
								referenceId: textureFile.name,
								texture: textureData
							};
						})(i);
					}
				});
			} else {
				var contentId = isPlated ? 'platedTextures' : 'textures';
				if (contentLoaded[contentId][referenceId] !== undefined) {
					//console.warn('CachedTexture', contentId+'_'+referenceId);
					if (onLoad) onLoad(contentLoaded[contentId][referenceId]);
					return;
				}

				var loader = new THREE.TextureLoader(this.manager);
				var textureData = loader.load(url, function(texture) {
					//console.log('Texture['+referenceId+']', textureData.image.src);
					if (onLoad) onLoad(texture);
				}, onProgressCallback, onErrorCallback);
				textureData.name = referenceId;
				textureData.flipY = false;
				textureData.minFilter = THREE.LinearFilter;
				textureData.magFilter = THREE.LinearFilter;
				textureData.wrapS = THREE.RepeatWrapping;
				textureData.wrapT = THREE.RepeatWrapping;

				contentLoaded[contentId][referenceId] = {
					url: url,
					referenceId: referenceId,
					texture: textureData
				};
			}
		}

		function loadMobileTexture(textureFile, onLoad) {
			var isPng = utils.string(textureFile.data, 1, 3) == 'PNG';
			var mimeType = 'image/'+(isPng ? 'png' : 'jpeg');

			var urlCreator = window.URL || window.webkitURL;
			var imageUrl = urlCreator.createObjectURL(new Blob([textureFile.data], {type: mimeType}));

			var texture = new THREE.Texture();

			var image = new Image();
			image.onload = function () {
				texture.image = image;
				texture.needsUpdate = true;
				if (onLoad) onLoad(texture);
			};
			image.src = imageUrl;

			return texture;
		}

		function parseContent() {
			console.log('ContentLoaded', contentLoaded);

			// Set up THREE.Geometry and load skeleton (if any)
			geometry = new THREE.Geometry();
			geometry.bones = parseSkeleton();
			hasBones = geometry.bones.length > 0;

			var animation = hasBones && loadAnimation ? parseAnimation(geometry.bones) : false;

			// Set up default white material
			defaultMaterial = new THREE.MeshLambertMaterial({
				emissive: 0x444444,
				color: 0x777777,
				shading: THREE.FlatShading,
				side: THREE.DoubleSide,
				skinning: hasBones
			});
			defaultMaterial.name = 'DefaultMaterial';
			materials = [];
			if (!loadTextures) materials.push(defaultMaterial);

			vertexOffset = 0;
			for (var i=0; i<contentLoaded.items.length; i++) {
				parseItem(contentLoaded.items[i]);
			}
			//for (var gearId in contentLoaded.gear) {
			//	var gear = contentLoaded.gear[gearId];
			//	parseGear(gear);
			//}

			if (typeof onLoadCallback !== 'function') {
				console.warn('NoOnLoadCallback', geometry, materials, animation);
				return;
			}
			onLoadCallback(geometry, materials, animation ? [animation] : []);
		}

		function parseItem(item) {
			var gear = contentLoaded.gear[item.requestedId];
			var shaderGear = item.shaderHash ? contentLoaded.gear[item.shaderHash] : null;

			// TODO: Should iterate this, but its never has more than one
			var regionIndexSets = item.gearAsset.content[0].region_index_sets;
			var assetIndexSet = contentLoaded.regions[item.requestedId];

			console.log('ParseItem', item, assetIndexSet);

			// Figure out which geometry should be loaded ie class, gender
			//var geometryHashes = [], geometryTextures = {};
			var artContent = gear.art_content;
			var artContentSets = gear.art_content_sets;
			if (artContentSets && artContentSets.length > 1) {
				//console.log('Requires Arrangement', artContentSets);
				for (var r=0; r<artContentSets.length; r++) {
					var artContentSet = artContentSets[r];
					if (artContentSet.classHash == classHash) {
						artContent = artContentSet.arrangement;
						break;
					}
				}
			} else if (artContentSets && artContentSets.length > 0) {
				artContent = artContentSets[0].arrangement;
			}

			console.log('ArtContent', artContent);

			var artRegionPatterns = [];

			if (artContent) {
				var gearSet = artContent.gear_set;
				var regions = gearSet.regions;
				if (regions.length > 0) {
					for (var u=0; u<regions.length; u++) {
						var region = regions[u];
						var regionIndexSet = regionIndexSets[region.region_index];
						//console.log('Region['+u+':'+region.region_index+']', region.pattern_list, regionIndexSet);

						//if (region.pattern_list.length > 0) {
							//var pattern = region.pattern_list[0]; // Always 1?
						if (region.pattern_list.length > 1) {
							console.warn('MultiPatternRegion['+u+']', region);
							// Weapon attachments?
						}
						for (var p=0; p<region.pattern_list.length; p++) {
							var pattern = region.pattern_list[p];
							//var patternIndex = regionIndexSet[p];

							// TODO Figure out why this breaks on some models
							//var patternTextures = [];
							//for (var t=0; t<patternIndex.textures.length; t++) {
							//	var textureIndex = patternIndex.textures[t];
							//	var texture = assetIndexSet[0].textures[textureIndex];
							//	patternTextures.push(texture);
							//}

							artRegionPatterns.push({
								hash: pattern.hash,
								artRegion: u,
								patternIndex: p,
								regionIndex: region.region_index,
								geometry: pattern.geometry_hashes,
								//textures: patternTextures
							});

							//console.log('Pattern['+u+':'+p+']', pattern, patternTextures);
							//
							//for (var h=0; h<pattern.geometry_hashes.length; h++) {
							//	//geometryHashes.push(pattern.geometry_hashes[h]);
							//	parseTextures(pattern.geometry_hashes[h], patternTextures);
							//}
							break;
						}
					}
				} else {
					var overrideArtArrangement = isFemale ? gearSet.female_override_art_arrangement : gearSet.base_art_arrangement;
					artRegionPatterns.push({
						hash: overrideArtArrangement.hash,
						artRegion: isFemale ? 'female' : 'male',
						patternIndex: -1,
						regionIndex: -1,
						geometry: overrideArtArrangement.geometry_hashes,
						textures: [] // TODO Implement this later
					});
					//for (var o=0; o<overrideArtArrangement.geometry_hashes.length; o++) {
					//	//geometryHashes.push(overrideArtArrangement.geometry_hashes[o]);
					//	parseTextures(overrideArtArrangement.geometry_hashes[o]);
					//}
				}
			}

			//console.log('GeometryHashes', geometryHashes);
			//var geometryTextures = parseTextures(geometryHashes);
			var geometryTextures = parseTextures(artRegionPatterns);

			var gearDyes = parseGearDyes(gear, shaderGear);
			//console.log('GearDyes', gearDyes);

			// Compress geometry into a single THREE.Geometry
			//if (geometryHashes.length == 0) console.warn('NoGeometry');
			for (var a=0; a<artRegionPatterns.length; a++) {
				var artRegionPattern = artRegionPatterns[a];

				var skipRegion = false;
				switch(artRegionPattern.regionIndex) {
					case -1: // armor (no region)
					case 0: // weapon grip
					case 1: // weapon body
					//case 2: // ??
					case 3: // weapon scope
					case 4: // weapon stock/scope?
					case 5: // weapon magazine
					case 6: // weapon ammo (machine guns)

					case 8: // ship helm
					case 9: // ship guns
					case 10: // ship casing
					case 11: // ship engine
					case 12: // ship body
						break;

					case 21: // hud
						skipRegion = true;
						break;

					case 22: // sparrow wings
					case 23: // sparrow body

					case 24: // ghost shell casing
					case 25: // ghost shell body
					case 26: // ghost shell cube?
						break;
					default:
						console.warn('UnknownArtRegion['+a+']', artRegionPattern.regionIndex);
						break;
				}
				if (skipRegion) continue;
				//if (artRegionPattern.regionIndex != 3) continue;
				//if (artRegionPattern.regionIndex != 25) continue;

				console.log('ArtRegion['+a+']', artRegionPattern);

				//if (artRegionPattern.regionIndex != 1) continue;
				//for (var g=0; g<geometryHashes.length; g++) {
				//	var geometryHash = geometryHashes[g];

				for (var g=0; g<artRegionPattern.geometry.length; g++) {
					var geometryHash = artRegionPattern.geometry[g];
					var tgxBin = contentLoaded.geometry[geometryHash];

					//if (g != 0) continue;
					//if (g != 1) continue;
					if (tgxBin == undefined) {
						console.warn('MissingGeometry['+g+']', geometryHash);
						continue;
					}

					//console.log('Geometry['+g+']', geometryHash, tgxBin);

					//var renderMeshes = parseTGXAsset(tgxBin, geometryHash);

					parseGeometry(geometryHash, geometryTextures, gearDyes);
				}
			}

			//geometry.mergeVertices();
			//geometry.computeVertexNormals();
		}

		//function parseTextures(geometryHashes) {
		function parseTextures(artRegionPatterns) {
			var canvas, ctx;
			var canvasPlates = {};
			var geometryTextures = [];

			//for (var g=0; g<geometryHashes.length; g++) {
				//var geometryHash = geometryHashes[g];
			for (var a=0; a<artRegionPatterns.length; a++) {
				var artRegionPattern = artRegionPatterns[a];

				for (var g=0; g<artRegionPattern.geometry.length; g++) {
					var geometryHash = artRegionPattern.geometry[g];

					var tgxBin = contentLoaded.geometry[geometryHash];

					if (!tgxBin) {
						console.warn('MissingTGXBinGeometry['+g+']', geometryHash);
						continue;
					}

					var metadata = tgxBin.metadata;
					var texturePlates = metadata.texture_plates;

					//console.log('Metadata['+g+']', tgxBin);

					// Spasm.TGXAssetLoader.prototype.getGearRenderableModel
					//console.log('TexturePlates['+g+']', texturePlates);
					if (texturePlates.length == 1) {
						var texturePlate = texturePlates[0];
						var texturePlateSet = texturePlate.plate_set;

						// Stitch together plate sets
						// Web versions are pre-stitched

						for (var texturePlateId in texturePlateSet) {
							var texturePlate = texturePlateSet[texturePlateId];
							var texturePlateRef = texturePlateId+'_'+texturePlate.plate_index;

							var textureId = texturePlateId;
							switch(texturePlateId) {
								case 'diffuse': textureId = 'map'; break;
								case 'normal': textureId = 'normalMap'; break;
								case 'gearstack': textureId = 'gearstackMap'; break;
								default:
									console.warn('UnknownTexturePlateId', texturePlateId, texturePlateSet);
									break;
							}

							// Web version uses pre-plated textures
							var platedTexture = contentLoaded.platedTextures[texturePlate.reference_id];
							var scale = 1;

							if (platedTexture) {
								scale = platedTexture.texture.image.width/texturePlate.plate_size[0];
							}

							if (texturePlate.texture_placements.length == 0) {
								//console.warn('SkippedEmptyTexturePlate['+texturePlateId+'_'+texturePlate.plate_index+']');
								//continue;
							}

							var canvasPlate = canvasPlates[texturePlateRef];
							if (!canvasPlate) {
								//console.log('NewTexturePlacementCanvas['+texturePlateRef+']');
								canvas = document.createElement('canvas');
								canvas.width = texturePlate.plate_size[0];
								canvas.height = texturePlate.plate_size[1];
								ctx = canvas.getContext('2d');

								ctx.fillStyle = '#000000';
								ctx.fillRect(0, 0, canvas.width, canvas.height);

								ctx.fillStyle = '#FFFFFF';
								canvasPlate = {
									plateId: texturePlateId,
									textureId: textureId,
									canvas: canvas,
									hashes: []
								};
								canvasPlates[texturePlateRef] = canvasPlate;
							}
							canvas = canvasPlate.canvas;
							ctx = canvas.getContext('2d');
							if (canvasPlate.hashes.indexOf(geometryHash) == -1) canvasPlate.hashes.push(geometryHash);

							for (var p=0; p<texturePlate.texture_placements.length; p++) {
								var placement = texturePlate.texture_placements[p];
								var placementTexture = contentLoaded.textures[placement.texture_tag_name];
								//VertexColorsent);

								// Fill draw area with white in case there are textures with an alpha channel
								//ctx.fillRect(placement.position_x*scale, placement.position_y*scale, placement.texture_size_x*scale, placement.texture_size_y*scale);
								// Actually it looks like the alpha channel is being used for masking
								ctx.clearRect(
									placement.position_x*scale, placement.position_y*scale,
									placement.texture_size_x*scale, placement.texture_size_y*scale
								);

								if (platedTexture) {
									ctx.drawImage(
										platedTexture.texture.image,
										placement.position_x*scale, placement.position_y*scale,
										placement.texture_size_x*scale, placement.texture_size_y*scale,
										placement.position_x*scale, placement.position_y*scale,
										placement.texture_size_x*scale, placement.texture_size_y*scale
									);
								} else {
									// Should be fixed, but add these checks in case
									if (!placementTexture) {
										console.warn('MissingPlacementTexture', placement.texture_tag_name, contentLoaded.textures);
										continue;
									}
									if (!placementTexture.texture.image) {
										console.warn('TextureNotLoaded', placementTexture);
										continue;
									}
									ctx.drawImage(
										placementTexture.texture.image,
										placement.position_x, placement.position_y,
										placement.texture_size_x, placement.texture_size_y);
								}
							}
						}
					}
					else if (texturePlates.length > 1) {
						console.warn('MultipleTexturePlates?', texturePlates);
					}

				}
			}

			for (var canvasPlateId in canvasPlates) {
				var canvasPlate = canvasPlates[canvasPlateId];
				var dataUrl = canvasPlate.canvas.toDataURL('image/png');
				loadDataTexture(dataUrl, canvasPlateId, null, true);
				for (var i=0; i<canvasPlate.hashes.length; i++) {
					var geometryHash = canvasPlate.hashes[i];
					if (geometryTextures[geometryHash] == undefined) {
						geometryTextures[geometryHash] = {};
					}
					//if (geometryTextures[geometryHash][canvasPlate.plateId] != undefined) {
					if (geometryTextures[geometryHash][canvasPlate.textureId] != undefined) {
						//console.warn('OverridingTexturePlate['+geometryHash+':'+canvasPlate.plateId+']', geometryTextures[geometryHash][canvasPlate.plateId]);
						console.warn('OverridingTexturePlate['+geometryHash+':'+canvasPlate.textureId+']', geometryTextures[geometryHash][canvasPlate.textureId]);
						continue;
					}
					var texture = contentLoaded.platedTextures[canvasPlateId].texture;
					//geometryTextures[geometryHash][canvasPlate.plateId] = texture;
					geometryTextures[geometryHash][canvasPlate.textureId] = texture;
				}
			}

			return geometryTextures;
		}

		function checkRenderPart(part) {
			var shouldRender = false;

			// Spasm was checking the lod category name for zeros which was very inefficient.
			// This implementation checks the lod category value and then further checks against
			// the part flags before filtering out geometry.
			switch(part.lodCategory.value) {
				case 0: // Main Geometry
				case 1: // Grip/Stock
				case 2: // Stickers
				case 3: // Internal/Hidden Geometry?
				//case 8: // Grip/Stock/Scope
					//if (!(part.flags & 0x30)) {
						shouldRender = true;
					//}
					break;
				case 8: // HUD / Low poly geometries
					//if (!(part.flags & 0x10)) { // HUD
						shouldRender = false;
					//}

					break;

				case 4: // LOD 1: Low poly geometries
				case 7: // LOD 2: Low poly geometries
				case 9: // LOD 3: Low poly geometries
					shouldRender = false;
					break;
				default:
					console.warn('SkippedRenderMeshPart', part.lodCategory, part);
					break;
			}

			switch(part.shader ? part.shader.type : 7) {
				case -1:
					shouldRender = false;
					break;
			}

			return shouldRender;
		}

		function parseGeometry(geometryHash, geometryTextures, gearDyes) {
			var tgxBin = contentLoaded.geometry[geometryHash];
			var renderMeshes = parseTGXAsset(tgxBin, geometryHash);

			//console.log('ParseGeometry', geometryHash, geometryTextures, gearDyes, materials.length);

			//if (geometryHash != '1780854371-0') return;

			//console.log('RenderMeshes', renderMeshes);
			var gearDyeSlotOffsets = [];

			if (loadTextures) {
				for (var i=0; i<gearDyes.length; i++) {
					var gearDye = gearDyes[i];

					gearDyeSlotOffsets.push(materials.length);

					// Create a material for both primary and secondary color variants
					for (var j=0; j<2; j++) {
						var materialParams = {
							game: game,
							//side: THREE.DoubleSide,
							//overdraw: true,
							skinning: hasBones,
							//color: 0x777777,
							//emissive: 0x444444,
							usePrimaryColor: j == 0,
							envMap: null
						};
						//materialParams.envMap = contentLoaded.textures[DEFAULT_CUBEMAP].texture;
						for (var textureId in geometryTextures[geometryHash]) {
							var texture = geometryTextures[geometryHash][textureId];

							materialParams[textureId] = texture;
							//
							////if (j == 0) logTexture(textureId, texture);
							//
							//switch(textureId) {
							//	case 'diffuse': materialParams.map = texture; break;
							//	case 'normal': materialParams.normalMap = texture; break;
							//	case 'gearstack': materialParams.gearstackMap = texture; break;
							//	default:
							//		console.warn('UnknownGeometryTexture', textureId);
							//		break;
							//}
						}

						copyGearDyeParams(gearDye, materialParams);

						var material = new THREE.TGXMaterial(materialParams);
						//var material = new THREE.MeshPhongMaterial(materialParams);
						material.name = geometryHash+'-'+(j == 0 ? 'Primary' : 'Secondary')+i;
						materials.push(material);
					}
				}
			}

			for (var m=0; m<renderMeshes.length; m++) {
				var renderMesh = renderMeshes[m];
				var indexBuffer = renderMesh.indexBuffer;
				var vertexBuffer = renderMesh.vertexBuffer;
				var positionOffset = renderMesh.positionOffset;
				var positionScale = renderMesh.positionScale;
				var texcoord0ScaleOffset = renderMesh.texcoord0ScaleOffset;
				var texcoordOffset = renderMesh.texcoordOffset;
				var texcoordScale = renderMesh.texcoordScale;
				var parts = renderMesh.parts;

				//if (m != 0) continue;
				//if (m != 1) continue;

				if (parts.length == 0) {
					console.log('Skipped RenderMesh['+geometryHash+':'+m+']: No parts');
					continue;
				} // Skip meshes with no parts

				//console.log('RenderMesh['+m+']', renderMesh);

				// Spasm.Renderable.prototype.render
				var partCount = -1;
				for (var p=0; p<parts.length; p++) {
					var part = parts[p];

					if (!checkRenderPart(part)) continue;
					partCount++;

					var gearDyeSlot = part.gearDyeSlot;

					if (gearDyeSlotOffsets[gearDyeSlot] == undefined) {
						console.warn('MissingDefaultDyeSlot', gearDyeSlot);
						gearDyeSlot = 0;
					}
					var materialIndex = gearDyeSlotOffsets[gearDyeSlot]+(part.usePrimaryColor ? 0 : 1);

					//console.log('RenderMeshPart['+geometryHash+':'+m+':'+p+']', part);

					// Load Material
					if (loadTextures) {
						var material = parseMaterial(part, gearDyes[gearDyeSlot], geometryTextures[geometryHash]);

						if (material) {
							material.name = geometryHash+'-CustomShader'+m+'-'+p;
							materials.push(material);
							materialIndex = materials.length-1;
						}
					}

					// Load Vertex Stream
					var increment = 3;
					var start = part.indexStart;
					var count = part.indexCount;

					// PrimitiveType, 3=TRIANGLES, 5=TRIANGLE_STRIP
					// https://stackoverflow.com/questions/3485034/convert-triangle-strips-to-triangles

					if (part.primitiveType === 5) {
						increment = 1;
						count -= 2;
					}

					for (var i=0; i<count; i+= increment) {
						var faceVertexNormals = [];
						var faceVertexUvs = [];
						var faceVertex = [];

						var faceColors = [];

						var detailVertexUvs = [];

						var faceIndex = start+i;

						var tri = part.primitiveType === 3 || i & 1 ? [0, 1, 2] : [2, 1, 0];

						for (var j=0; j<3; j++) {
							var index = indexBuffer[faceIndex+tri[j]];
							var vertex = vertexBuffer[index];
							if (!vertex) { // Verona Mesh
								console.warn('MissingVertex['+index+']');
								i=count;
								break;
							}
							var normal = vertex.normal0;
							var uv = vertex.texcoord0;
							var color = vertex.color0;

							var detailUv = vertex.texcoord2;
							if (!detailUv) detailUv = [0, 0];

							faceVertex.push(index+vertexOffset);
							faceVertexNormals.push(new THREE.Vector3(-normal[0], -normal[1], -normal[2]));

							var uvu = uv[0]*texcoordScale[0]+texcoordOffset[0];
							var uvv = uv[1]*texcoordScale[1]+texcoordOffset[1];
							faceVertexUvs.push(new THREE.Vector2(uvu, uvv));

							if (color) {
								//console.log('Color['+m+':'+p+':'+i+':'+j+']', color);
								faceColors.push(new THREE.Color(color[0], color[1], color[2]));
							}

							//if (p == 10) {
							//	console.log('Vertex['+j+']', index, vertex);
							//}

							//console.log(
							//	uv[0]+','+uv[1],
							//	texcoordScale[0]+'x'+texcoordScale[1],
							//	texcoordOffset[0]+','+texcoordOffset[1],
							//	detailUv[0]+','+detailUv[1]
							//);

							detailVertexUvs.push(new THREE.Vector2(
								uvu*detailUv[0],
								uvv*detailUv[1]
							));
						}
						var face = new THREE.Face3(faceVertex[0], faceVertex[1], faceVertex[2], faceVertexNormals);
						face.materialIndex = materialIndex;
						if (faceColors.length > 0) face.vertexColors = faceColors;
						geometry.faces.push(face);
						geometry.faceVertexUvs[0].push(faceVertexUvs);

						if (geometry.faceVertexUvs.length < 2) geometry.faceVertexUvs.push([]);
						geometry.faceVertexUvs[1].push(detailVertexUvs);
					}
				}

				//return;

				for (var v=0; v<vertexBuffer.length; v++) {
					var vertex = vertexBuffer[v];
					var position = vertex.position0;
					var x = position[0];//*positionScale[0]+positionOffset[0];
					var y = position[1];//*positionScale[1]+positionOffset[1];
					var z = position[2];//*positionScale[2]+positionOffset[2]; // Apply negative scale to fix lighting
					if (platform == 'web') { // Ignored on mobile?
						x = x*positionScale[0]+positionOffset[0];
						y = y*positionScale[1]+positionOffset[1];
						z = z*positionScale[2]+positionOffset[2];
					}
					geometry.vertices.push(new THREE.Vector3(x, y, z));

					// Set bone weights
					var boneIndex = position[3];//Math.abs((positionOffset[3] * 32767.0) + 0.01);
					//var bone = geometry.bones[boneIndex];

					var blendIndices = vertex.blendindices0 ? vertex.blendindices0 : [boneIndex, 255, 255, 255];
					var blendWeights = vertex.blendweight0 ? vertex.blendweight0: [1, 0, 0, 0];

					var skinIndex = [0, 0, 0, 0];
					var skinWeight = [0, 0, 0, 0];

					var totalWeights = 0;
					for (var w=0; w<blendIndices.length; w++) {
						if (blendIndices[w] == 255) break;
						skinIndex[w] = blendIndices[w];
						skinWeight[w] = blendWeights[w];
						totalWeights += blendWeights[w]*255;
					}
					if (totalWeights != 255) console.error('MissingBoneWeight', 255-totalWeights, i, j);

					geometry.skinIndices.push(new THREE.Vector4().fromArray(skinIndex));
					geometry.skinWeights.push(new THREE.Vector4().fromArray(skinWeight));
					//geometry.skinIndices[index+vertexOffset].fromArray(skinIndex);
					//geometry.skinWeights[index+vertexOffset].fromArray(skinWeight);
				}
				vertexOffset += vertexBuffer.length;
			}
		}

		function copyGearDyeParams(gearDye, materialParams) {
			for (var dyeKey in gearDye) {
				var paramKey = dyeKey;
				var dyeTexture = false;
				switch(dyeKey) {
					case 'hash':
					case 'investmentHash':
					case 'slotTypeIndex':
					case 'variant':
						paramKey = '';
						break;
					case 'diffuse': paramKey = 'detailMap'; dyeTexture = true; break;
					case 'normal': paramKey = 'detailNormalMap'; dyeTexture = true; break;
					case 'decal': paramKey = 'detailDecalMap'; dyeTexture = true; break;

					case 'primaryDiffuse': paramKey = 'primaryDetailMap'; dyeTexture = true; break;
					case 'secondaryDiffuse': paramKey = 'secondaryDetailMap'; dyeTexture = true; break;
				}
				if (paramKey) {
					materialParams[paramKey] = gearDye[dyeKey];
				}
			}
		}

		function parseMaterial(part, gearDye, textures) {
			var materialParams = {
				game: game,
				//side: THREE.DoubleSide,
				//overdraw: true,
				skinning: hasBones,
				//color: 0x777777,
				//emissive: 0x444444,
				//envMap: dyeMaterial.envMap ? dyeMaterial.envMap : null,
				//metalness: ,
				envMap: null,
				usePrimaryColor: part.usePrimaryColor
			};

			if (part.variantShaderIndex != -1) console.warn('VariantShaderPresent['+part.variantShaderIndex+']', part);

			if (!textures) {
				console.warn('NoGeometryTextures', part);
				textures = {
					map: null,
					normalMap: null,
					gearstackMap: null,
					envMap: null
				};
			}
			if (textures.envMap == undefined) textures.envMap = null;

			if (part.shader) {
				var shader = part.shader;
				var staticTextureIds = shader.staticTextures ? shader.staticTextures : [];
				var staticTextureCount = staticTextureIds.length;

				// Use these for debugging
				var color = 0x333333;
				var emissive = new THREE.Color(Math.random(), Math.random(), Math.random());
				//materialParams.color = color;
				//materialParams.emissive = emissive;

				var override = false;
				var log = false;
				var textureLookup = [];

				//var dyeColor = dyeMaterial.usePrimaryColor ? dyeMaterial.primaryColor : dyeMaterial.secondaryColor;
				console.log('Shader', shader, utils.bits(part.flags, 16)+' ('+part.flags+')');

				if (part.flags & 0x20) {
					materialParams.transparent = true;
					materialParams.useAlphaTest = true;
					//materialParams.transparent = true;
					//materialParams.useAlphaTest = true;
					//materialParams.emissive = emissive;
					//override = true;
				}

				switch(shader.type) {
					case 7:
						materialParams.map = textures.map;
						materialParams.normalMap = textures.normalMap;
						materialParams.gearstackMap = textures.gearstackMap;
						materialParams.envMap = textures.envMap;
						copyGearDyeParams(gearDye, materialParams);
						override = staticTextureCount > 0;
						log = true;

						switch(staticTextureCount) {
							case 0:
							//	//if (part.flags & 0x1) {
							//	//	materialParams.color = color;
							//	//	materialParams.emissive = emissive;
							//	//	log = true;
							//	//	override = true;
							//	//}
								break;
							case 1:
								if (part.flags & 0x40) {
									materialParams.map = false;
									materialParams.normalMap = false;
									materialParams.gearstackMap = null;
									textureLookup.push('detailDecalMap');
									override = true;
								}
								else if (part.flags & 0x20) { // Decal
									//materialParams.color = color;
									//materialParams.emissive = emissive;
									textureLookup.push('detailDecalMap');
									log = true;
								}
								else /*if (part.flags & 0x10)*/ { // Cubemap
									//materialParams.map = false;
									//materialParams.normalMap = false;
									//materialParams.gearstackMap = null;
									//textureLookup.push('cubeMap');
									//override = true;
								}
								//else {
								//	materialParams.color = color;
									//materialParams.emissive = emissive;
								//	log = true;
								//}
								log = true;
								break;
							case 2:
								override = true;
								// Sunbreaker (neckbit)
								textureLookup.push('map');
								textureLookup.push('normalMap');

								materialParams.gearstackMap = null;
								materialParams.detailMap = null;
								materialParams.detailNormalMap = null;

								//if (part.flags & 0x8) { // Detail Overlay?
									//textureLookup.push('detailOverlayMap');
									//textureLookup.push('detailOverlayMap'); // Dupe?

								//}
								//else {
								//	materialParams.color = color;
								//	materialParams.emissive = 0xFF0000;//emissive;
								//	log = true;
								//}
								break;
							case 3:
								// TODO implement this effect
								if (part.flags & 0x40) {
									// Sound and Fury
									materialParams.emissive = emissive;
									materialParams.map = null;
									materialParams.normalMap = null;
									//materialParams.envMap = null;
									textureLookup.push('map');
									textureLookup.push('normalMap');
									textureLookup.push('specularMap');
									log = true;
								}
								else if (part.flags & 0x10) { // The Number (Liquid Bubble)
									//materialParams.color = color;
									//materialParams.emissive = emissive;
									//textureLookup.push('map'); // 4072752356_weapon_omolon_liquid_gradient_dif
									//textureLookup.push('alphaMap'); // 4072752356_weapon_omolon_liquid_bubbles_dif
									//textureLookup.push('cubeMap'); // 2690020957_default_monocrome_cubemap

									// Patience and Time netting
									textureLookup.push('map');
									textureLookup.push('alphaMap');
									textureLookup.push('normalMap');

									materialParams.map = null;
									materialParams.normalMap = null;
									materialParams.gearstackMap = null;
									materialParams.envMap = null;

									materialParams.useDye = false;
									//log = true;
								} else {
									console.warn('UnknownShaderTypeLength', shader);
									materialParams.color = color;
									materialParams.emissive = emissive;
									log = true;
								}
								break;
							case 5:
								// D1 Sunbreaker (Gloves)
								textureLookup.push('map');
								textureLookup.push('detailMap');
								textureLookup.push('normalMap');
								textureLookup.push('detailNormalMap');
								textureLookup.push('gearstackMap'); // scratchMap
								override = true;
								//log = true;
								//if (part.flags & 0x10) { // Ghost Shell Eye
								//	materialParams.color = color;
								//	materialParams.emissive = emissive;
								//	//materialParams.transparent = true;
								//	//textureLookup.push('map');
								//	//textureLookup.push('alphaMap');
								//	//textureLookup.push('normalMap');
								//	//textureLookup.push('gearstackMap');
								//} else {
								//	console.warn('UnknownShaderTypeLength', shader);
								//	materialParams.color = color;
								//	materialParams.emissive = emissive;
								//	log = true;
								//}
								break;
							default:
								console.warn('UnknownShaderTypeLength', shader);
								materialParams.color = color;
								materialParams.emissive = emissive;
								log = true;
								break;
						}
						break;
					case 8: // EmissiveMap
						// Vex Mythoclast
						//copyGearDyeParams(gearDye, materialParams);
						materialParams.color = color;
						materialParams.emissive = 0xffffff;//emissive;
						//materialParams.emissiveIntensity = 1;
						switch(staticTextureCount) {
							case 0:
								materialParams.emissive = emissive;
								log = true;
								break;
							case 1:
								textureLookup.push('emissiveMap');
								break;
							default:
								console.warn('UnknownShaderTypeLength', shader);
								materialParams.color = color;
								materialParams.emissive = emissive;
								log = true;
								break;
						}
						if (!(part.flags & 0x20)) {
							console.warn('ShaderMissingEmissiveFlag_20', shader, part.flags)
						}
						if (part.flags & 0x10) {
							//console.warn('ShaderHasUnknownEmissiveFlag_10', shader, part.flags);
						}
						if (part.flags & ~0x35) {
							//console.warn('ShaderHasUnknownEmissiveFlags', shader, part.flags, part.flags & ~0x35);
						}
						override = true;
						//log = true;
						break;
					case 9: // Cubemap/DetailNoise?
						materialParams.map = textures.map;
						materialParams.normalMap = textures.normalMap;
						materialParams.gearstackMap = textures.gearstackMap;
						copyGearDyeParams(gearDye, materialParams);
						override = true;

						//materialParams.color = color;
						//materialParams.emissive = new THREE.Color(1.0, 0, 0, 1.0);

						if (part.flags & 0x40) {
							//materialParams.transparent = true;
							//materialParams.useAlphaTest = true;
							override = true;
						}

						switch(staticTextureCount) {
							case 0:
								//override = false;
								break;
							case 1:
								textureLookup.push('cubeMap');
								break;
							case 2:
								textureLookup.push('cubeMap');
								textureLookup.push('detailEnvMap');
								log = true;
								break;
							default:
								console.warn('UnknownShaderTypeLength', shader);
								materialParams.color = color;
								materialParams.emissive = emissive;
								log = true;
								break;
						}

						//log = true;

						if (part.flags & ~0x5) { // Flags 5, 1, 0
							console.warn('ShaderHasUnknownNoiseFlags', shader, part.flags, part.flags & ~0x5);
						}

						//log = true;
						break;
					case 11:
						materialParams.map = textures.map;
						materialParams.normalMap = textures.normalMap;
						materialParams.gearstackMap = textures.gearstackMap;
						copyGearDyeParams(gearDye, materialParams);
						override = true;

						//materialParams.useAlphaTest = true;
						//if (part.flags & 0x1) {
							//materialParams.transparent = true;
							//materialParams.useAlphaTest = true;
						//}

						//logTexture(materialParams.map.name, materialParams.map);
						//logTexture(materialParams.normalMap.name, materialParams.normalMap);
						//logTexture(materialParams.gearstackMap.name, materialParams.gearstackMap);

						switch(staticTextureCount) {
							//case 0:
							//	materialParams.emissive = emissive;
							//	break;
							case 2:
								//textureLookup.push('cubeMap');
								//textureLookup.push('cubeMap'); // Dupe?
								textureLookup.push('detailNormalMap');
								textureLookup.push('detailMap');
								//materialParams.emissive = emissive;

								//materialParams.gearstackMap = null;
								//materialParams.detailMap = null;
								//materialParams.detailNormalMap = null;
								log = true;
								break;
							default:
								console.warn('UnknownShaderTypeLength', shader, part.flags);
								materialParams.color = color;
								materialParams.emissive = emissive;
								break;
						}
					//	materialParams.color = color;
						//materialParams.emissive = emissive;
					//	//copyGearDyeParams(gearDye, materialParams);
					//	override = true;
						break;
					default:
						console.warn('UnknownShaderType', shader);
						//copyGearDyeParams(gearDye, materialParams);
						//materialParams.color = color;
						//materialParams.emissive = emissive;
						//override = true;
						break;
				}

				//if (part.flags & 0x5) { // Textured?
				//if (part.flags & 0x1) { // Textured?
				//if (!(part.flags & 0x1)) { // ??
				//	materialParams.color = color;
				//	materialParams.emissive = emissive;
				//	override = true;
				//}

				//if (shader.type == 11) {
				//	override = true;
				//	//log = true;
				//	materialParams.color = color;
				//	materialParams.emissive = emissive;
				//} else {
					log = false;
				if (!debugMode) {
					override = false;
				}
				//}

				if (log) {
					console.log('ParseMaterial',
						"\n\tPart:", part,
						"\n\tFlags:", utils.bits(part.flags, 16)+' ('+part.flags+')',
						"\n\tLOD:", part.lodCategory,
						"\n\tShader:", part.shader,
						"\n\tGearDye:", gearDye,
						"\n\tTextures:", textures
					);
					console.log(
						"%c #"+new THREE.Color(gearDye.primaryColor).getHexString()
						+" %c #"+new THREE.Color(gearDye.secondaryColor).getHexString(),
						"border-left: 14px solid #"+new THREE.Color(gearDye.primaryColor).getHexString()+';',
						"border-left: 14px solid #"+new THREE.Color(gearDye.secondaryColor).getHexString()+';'
					);

					for (var i=0; i<staticTextureIds.length; i++) {
						var staticTextureId = staticTextureIds[i];
						var staticTextureContent = contentLoaded.textures[staticTextureId];
						if (!staticTextureContent) {
							console.warn('MissingTexture['+staticTextureId+']');
							//continue;
						}
						var staticTexture = staticTextureContent ? staticTextureContent.texture : null;
						logTexture('staticTexture'+i+(textureLookup[i] !== undefined ? '['+textureLookup[i]+']' : ''), staticTexture);
					}
				}

				for (var i=0; i<textureLookup.length; i++) {
					var textureId = textureLookup[i];
					var staticTextureId = staticTextureIds[i];
					var staticTextureContent = contentLoaded.textures[staticTextureId];
					if (!staticTextureContent) {
						console.warn('MissingTexture['+staticTextureId+']');
						//continue;
					}
					var staticTexture = staticTextureContent ? staticTextureContent.texture : null;
					switch(textureId) {
						case 'alphaMap':
							materialParams.transparent = true;
							break;
						case 'cubeMap':
							staticTexture = loadCubeTexture(staticTexture);
							textureId = 'envMap';
							break;
					}
					materialParams[textureId] = staticTexture;
				}

				if (!override) return false;

				if (log) console.log('MaterialParams', materialParams, "\n\n");
				return new THREE.TGXMaterial(materialParams);
				//return new THREE.MeshPhongMaterial(materialParams);
			} else {
				console.warn('NoShader', part);
			}
			return false;
		}

		function loadCubeTexture(texture) {
			var textureId = (texture ? texture.name : 'null')+'__';
			if (contentLoaded.textures[textureId] !== undefined) {
				return contentLoaded.textures[textureId].texture;
			}

			var loader = new THREE.CubeTextureLoader();

			var cubeWidth = 256;
			var cubeHeight = 256;

			var canvas = document.createElement('canvas');
			if (texture) {
				cubeWidth = texture.image.width/4;
				cubeHeight = texture.image.height/3;
			}
			var cubeSize = Math.floor(cubeWidth/4)*4;
			canvas.width = cubeSize;
			canvas.height = cubeSize;
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = '#000000';
			ctx.fillRect(0, 0, cubeSize, cubeSize);
			//ctx.drawImage(texture.image, 0, 0);
			var offsets = [
				[0, 0],
				[0, 1],
				[1, 1],
				[2, 1],
				[3, 1],
				[0, 2]
			];
			var images = [];
			for (var i=0; i<offsets.length; i++) {
				var offset = offsets[i];
				if (texture) {
					ctx.drawImage(texture.image, offset[0]*cubeWidth, offset[1]*cubeHeight, cubeWidth, cubeHeight, 0, 0, cubeSize, cubeSize);
				}
				var cubeFace = canvas.toDataURL('image/png');
				//logImageSrc(cubeFace);
				images.push(cubeFace);
			}

			var cubeTexture = loader.load(images);
			cubeTexture.name = textureId;
			contentLoaded.textures[textureId] = {
				referenceId: textureId,
				texture: cubeTexture
			};

			return cubeTexture;
		}

		function logTexture(textureId, texture) {
			var src = null;
			var logName = '';
			if (texture) {
				src = texture.image ? texture.image.src : texture.src;
				logName = texture.name+(src && src.indexOf('blob') != -1 ? ' '+src : '');
			}

			console.log(textureId+': '+logName, texture);

			if (src && src.indexOf('blob') != -1) {
				var canvas = document.createElement('canvas');
				canvas.width = texture.image.width;
				canvas.height = texture.image.height;
				var ctx = canvas.getContext('2d');
				ctx.drawImage(texture.image, 0, 0, canvas.width, canvas.height);
				src = canvas.toDataURL('image/png');
			}

			if (src) logImageSrc(src);
		}

		function logImageSrc(src) {
			console.log('%c  ', 'font-size: 50px; background: url("'+src+'") center no-repeat; background-size: contain; border: 1px solid;');
		}

		// Spasm.Skeleton.prototype.onLoadSkeletonSuccess
		// TODO Fix bone loading
		function parseSkeleton() {
			var bones = [];
			var absBones = [];
			if (contentLoaded.skeleton) {
				var definition = contentLoaded.skeleton.definition;
				//var transforms = definition.default_inverse_object_space_transforms;
				var inverseTransforms = definition.default_inverse_object_space_transforms;
				var transforms = definition.default_object_space_transforms;
				//transforms = inverseTransforms;
				var nodes = definition.nodes;

				for (var n=0; n<nodes.length; n++) {
					var node = nodes[n];
					var inverseTransform = inverseTransforms[n];
					var transform = transforms[n];

					//if (n > 26) continue; // For now don't worry about fingers, facial rigs, etc

					//var ts = transform.ts;
					var offset = transform.offset;
					var origin = transform.origin || [0, 0, 0]; // ts[0-2];
					var r = transform.r || [0, 0, 0, 1];
					var s = transform.scale || 1; // ts[3];
					var parentNode = bones[node.parent_node_index];

					var pos = new THREE.Vector3(origin[0], origin[1], origin[2]);
					var scale = new THREE.Vector3(s, s, s);
					var rotq = new THREE.Quaternion(r[0], r[1], r[2], r[3]);
					var euler = new THREE.Euler().setFromQuaternion(rotq);

					euler.set(0, 0, 0);
					rotq.setFromEuler(euler);

					var absPos = new THREE.Vector3(pos.x, pos.y, pos.z);
					var absRotq = new THREE.Quaternion(rotq.x, rotq.y, rotq.z, rotq.w);
					var absEuler = new THREE.Euler().setFromQuaternion(absRotq);

					var absScale = new THREE.Vector3(scale.x, scale.y, scale.z);

					if (n == 0) {
						//euler.y = utils.degreesToRadian(-90);
						//euler.set(utils.degreesToRadian(-90), 0, utils.degreesToRadian(-90));
						//rotq.setFromEuler(euler);
					}

					if (parentNode) {
						//pos.set(parentNode.pos[0]-pos.x, parentNode.pos[1]-pos.y, parentNode.pos[2]-pos.z);

						absPos.x -= parentNode.pos[0];
						absPos.y -= parentNode.pos[1];
						absPos.z -= parentNode.pos[2];

						var parentRotq = new THREE.Quaternion().fromArray(parentNode.rotq);
						var parentEuler = new THREE.Euler().setFromQuaternion(parentRotq);


						absEuler.x -= parentEuler.x;
						absEuler.y -= parentEuler.y;
						absEuler.z -= parentEuler.z;
						//absRotq.setFromEuler(absEuler);

						absRotq = absRotq.multiply(parentRotq.inverse());
					}

					//if (n == 0 || n == 1 || n == 3 || n == 4 || n == 6)
					if (n <= -1/*26*/) console.log('Bone['+n+']', node.name.string+':'+node.name.hash, node.parent_node_index,
						"\n"+'pos: '+pos.x+', '+pos.y+', '+pos.z,
						"\n"+'apos: '+absPos.x+', '+absPos.y+', '+absPos.z,
						//"\n"+'lpos: '+logPos.x+', '+logPos.y+', '+logPos.z,
						//"\n"+'ipos: '+inversePos.x+', '+inversePos.y+', '+inversePos.z,

						//"\n"+'orotq: '+r[0]+', '+r[1]+', '+r[2]+', '+r[3],
						//	"\n"+'rotq: '+rotq.x+','+rotq.y+','+rotq.z+','+rotq.w,
						"\n"+'rot: '+Math.round(utils.radianToDegrees(euler.x))+', '+Math.round(utils.radianToDegrees(euler.y))+', '+Math.round(utils.radianToDegrees(euler.z)),
						"\n"+'arot: '+Math.round(utils.radianToDegrees(absEuler.x))+', '+Math.round(utils.radianToDegrees(absEuler.y))+', '+Math.round(utils.radianToDegrees(absEuler.z)),

						//"\n"+'irot: '+Math.round(utils.radianToDegrees(inverseEuler.x))+', '+Math.round(utils.radianToDegrees(inverseEuler.y))+', '+Math.round(utils.radianToDegrees(inverseEuler.z)),
						//"\n"+'lrot: '+Math.round(utils.radianToDegrees(logEuler.x))+', '+Math.round(utils.radianToDegrees(logEuler.y))+', '+Math.round(utils.radianToDegrees(logEuler.z)),
						////'rotq: '+r[0]+'/'+rotq.x+','+r[1]+'/'+rotq.y+','+r[2]+'/'+rotq.z+','+r[3]+'/'+rotq.w,
						//'scale: '+s,
						"\n"+'scale: '+scale.x+', '+scale.y+', '+scale.z
						//"\n"+'iscale: '+inverseScale.x+', '+inverseScale.y+', '+inverseScale.z
						//	'origin: '+Math.round(offset[0]*100)+', '+Math.round(offset[1]*100)+', '+Math.round(offset[2]*100)
						//origin,
						//r,
						//s,
						//offset,
						//pos,
						//rotq,
						//scale
					);

					bones.push({
						parent: node.parent_node_index,
						nodeHash: node.name.hash,
						name: node.name.string,
						pos: pos.toArray(),
						rotq: rotq.toArray(),
						scl: scale.toArray()
					});
					absBones.push({
						parent: node.parent_node_index,
						nodeHash: node.name.hash,
						name: node.name.string,
						pos: absPos.toArray(),
						rotq: absRotq.toArray(),
						scl: absScale.toArray()
					});
				}
				//console.log('Bones', bones, absBones);
			}
			return absBones;
		}

		function parseAnimation(bones) {
			console.log('Animation['+animationPath+']', contentLoaded.animations);
			var animation = contentLoaded.animations[0];

			var animRate = 30;
			var animLength = animation.duration_in_frames / animRate;

			var staticBoneData = animation.static_bone_data;
			var staticScaleControlMap = staticBoneData.scale_control_map;
			var staticRotationControlMap = staticBoneData.rotation_control_map;
			var staticTranslationControlMap = staticBoneData.translation_control_map;
			var staticTransforms = staticBoneData.transform_stream_header.streams.frames[0];

			var staticScales = staticTransforms.scales;
			var staticRotations = staticTransforms.rotations;
			var staticTranslations = staticTransforms.translations;

			var animatedBoneData = animation.animated_bone_data;
			var animatedScaleControlMap = animatedBoneData.scale_control_map;
			var animatedRotationControlMap = animatedBoneData.rotation_control_map;
			var animatedTranslationControlMap = animatedBoneData.translation_control_map;
			var animatedTransformFrames = animatedBoneData.transform_stream_header.streams.frames;

			var hierarchy = [];

			for (var i=0; i<animation.frame_count; i++) {
				var animatedTransforms = animatedTransformFrames[i];
				var animatedScales = animatedTransforms.scales;
				var animatedRotations = animatedTransforms.rotations;
				var animatedTranslations = animatedTransforms.translations;

				for (var j=0; j<animation.node_count; j++) {
					var staticScaleIndex = staticScaleControlMap.indexOf(j);
					var staticRotationIndex = staticRotationControlMap.indexOf(j);
					var staticTranslationIndex = staticTranslationControlMap.indexOf(j);

					var animatedScaleIndex = animatedScaleControlMap.indexOf(j);
					var animatedRotationIndex = animatedRotationControlMap.indexOf(j);
					var animatedTranslationIndex = animatedTranslationControlMap.indexOf(j);

					var scale = staticScaleIndex >= 0 ?
						staticScales[staticScaleIndex] : animatedScales[animatedScaleIndex];
					var rotation = staticRotationIndex >= 0 ?
						staticRotations[staticRotationIndex] : animatedRotations[animatedRotationIndex];
					var translation = staticTranslationIndex >= 0
						?
						staticTranslations[staticTranslationIndex]
						: animatedTranslations[animatedTranslationIndex];

					var bone = bones[j];

					//console.log('Frame['+i+'-'+j+']', translation, rotation, scale, bone);
					if (i == 0) {
						hierarchy.push({
							parent: bone.parent,
							name: bone.name,
							keys: []
						});
					}
					var node = hierarchy[j];
					node.keys.push({
						time: i/animRate,
						pos: translation,
						rot: rotation,
						scl: [scale, scale, scale]
					});
				}
				//break;
			}

			return {
				name: animationPath.split('.js')[0],
				fps: animRate,
				length: animLength,
				hierarchy: hierarchy
			};
		}

		// Spasm.TGXAssetLoader.prototype.getGearDyes
		function getGearDyes(gear) {
			var dyeGroups = {
				customDyes: gear.custom_dyes || [],
				defaultDyes: gear.default_dyes || [],
				lockedDyes: gear.locked_dyes || []
			};

			var gearDyeGroups = {};

			for (var dyeType in dyeGroups) {
				var dyes = dyeGroups[dyeType];
				var gearDyes = [];
				for (var i=0; i<dyes.length; i++) {
					var dye = dyes[i];
					var dyeTextures = dye.textures;
					var materialProperties = dye.material_properties;
					console.log('GearDye['+dyeType+']['+i+']', dye);

					var gearDyeTextures = {};

					for (var dyeTextureId in dyeTextures) {
						var dyeTexture = dyeTextures[dyeTextureId];
						//console.log('DyeTexture['+dyeTextureId+']', dyeTexture);

						if (dyeTexture.reference_id && contentLoaded.textures[dyeTexture.reference_id] !== undefined) {
							gearDyeTextures[dyeTextureId] = contentLoaded.textures[dyeTexture.reference_id];
						}
						else if (dyeTexture.name && contentLoaded.textures[dyeTexture.name] !== undefined) {
							gearDyeTextures[dyeTextureId] = contentLoaded.textures[dyeTexture.name];
						}
					}

					//console.log('DyeTextures', gearDyeTextures);

					// Spasm.GearDye
					var gearDye = {
						//identifier: dye.identifier, // Doesn't exist?
						hash: dye.hash,
						investmentHash: dye.investment_hash,
						slotTypeIndex: dye.slot_type_index,
						variant: dye.variant,

						diffuse: gearDyeTextures.diffuse ? gearDyeTextures.diffuse.texture : null,
						normal: gearDyeTextures.normal ? gearDyeTextures.normal.texture : null,
						decal: gearDyeTextures.decal ? gearDyeTextures.decal.texture : null,

						// Not used?
						//primaryColor: 0x000000,
						primaryDiffuse: gearDyeTextures.primary_diffuse ? gearDyeTextures.primary_diffuse.texture : null,
						//secondaryColor: 0x000000,
						secondaryDiffuse: gearDyeTextures.secondary_diffuse ? gearDyeTextures.secondary_diffuse.texture : null,

						isCloth: dye.cloth
					};

					var dyeMat = dye.material_properties;

					switch(game) {
						case 'destiny':
							gearDye.dyeVariant = dye.variant;
							gearDye.dyeBlendMode = dye.blend_mode;

							gearDye.primaryColor = new THREE.Color().fromArray(dyeMat.primary_color);
							gearDye.secondaryColor = new THREE.Color().fromArray(dyeMat.secondary_color);

							gearDye.decalAlphaMapTransform = dyeMat.decal_alpha_map_transform;
							gearDye.decalBlendOption = dyeMat.decal_blend_option;

							gearDye.detailNormalContributionStrength = dyeMat.detail_normal_contribution_strength;
							gearDye.detailTransform = dyeMat.detail_transform;
							gearDye.specularProperties = dyeMat.specular_properties;
							gearDye.subsurfaceScatteringStrength = dyeMat.subsurface_scattering_strength;

							//var spec = dyeMat.specular_properties;
							//gearDye.specular = new THREE.Color(spec[0], spec[0], spec[0]);
							//gearDye.shininess = spec[1];
							//gearDye.reflectivity = spec[1];
							//gearDye.shininess = dye.material_properties.subsurface_scattering_strength[0];
							break;
						case 'destiny2':
							gearDye.primaryColor = new THREE.Color().fromArray(dyeMat.primary_albedo_tint);//.primary_material_params;
							gearDye.secondaryColor = new THREE.Color().fromArray(dyeMat.secondary_albedo_tint);//.secondary_material_params;
							gearDye.wornColor = new THREE.Color().fromArray(dyeMat.worn_albedo_tint);

							var spec = dye.material_properties.specular_properties;
							//gearDye.specular = new THREE.Color(spec[0], spec[0], spec[0]);
							//gearDye.shininess = spec[1];
							//gearDye.specular = new THREE.Color(0xffffff);
							//gearDye.shininess = 32;

							var emissive = dye.material_properties.emissive_tint_color_and_intensity_bias;
							//gearDye.emissive = new THREE.Color(emissive[1], emissive[2], emissive[3]);
							//gearDye.emissiveIntensity = emissive[0];
							//gearDye.emissive = new THREE.Color().fromArray(new THREE.Vector3().fromArray(dye.material_properties.emissive_tint_color_and_intensity_bias));
							//gearDye.shininess = dye.material_properties.subsurface_scattering_strength_and_emissive[0];

							gearDye.detailDiffuseTransform = dye.material_properties.detail_diffuse_transform;
							gearDye.detailNormalTransform = dye.material_properties.detail_normal_transform;

							// Physically Based Rendering
							// emissive_pbr_params
							// lobe_pbr_params
							// tint_pbr_params
							break;
					}

					//console.log(gearDye);
					gearDyes.push(gearDye);
				}
				gearDyeGroups[dyeType] = gearDyes;
			}
			return gearDyeGroups;
		}
		function parseGearDyes(gear, shaderGear) {

			var gearDyeGroups = getGearDyes(gear);
			var shaderDyeGroups = shaderGear ? getGearDyes(shaderGear) : gearDyeGroups;

			console.log('GearDyes', gearDyeGroups);
			//console.log('ShaderGearDyes', shaderDyeGroups);

			// Spasm.GearRenderable.prototype.getResolvedDyeList
			var resolvedDyes = [];
			var dyeTypeOrder = ['defaultDyes', 'customDyes', 'lockedDyes'];
			for (var i=0; i<dyeTypeOrder.length; i++) {
				var dyeType = dyeTypeOrder[i];
				var dyes = [];
				switch(dyeType) {
					case 'defaultDyes':
						dyes = gearDyeGroups[dyeType];
						break;
					case 'customDyes':
						dyes = shaderDyeGroups[dyeType];
						break;
					case 'lockedDyes':
						dyes = gearDyeGroups[dyeType];
						break;
				}
				for (var j=0; j<dyes.length; j++) {
					var dye = dyes[j];
					//if (dyeType == 'lockedDyes' && ignoreLockedDyes && resolvedDyes[dye.slotTypeIndex]) continue;
					//resolvedDyes[dye.slotTypeIndex] = dye;
					resolvedDyes[j] = dye;
				}
			}

			console.log('ResolvedGearDyes', resolvedDyes);

			return resolvedDyes;
		}

		// Spasm.TGXAssetLoader.prototype.getGearRenderableModel
		function parseTGXAsset(tgxBin, geometryHash) {
			var metadata = tgxBin.metadata; // Arrangement
			//console.log('Metadata['+geometryHash+']', metadata);

			var meshes = [];

			//for (var renderMeshIndex in metadata.render_model.render_meshes) {
			for (var r=0; r<metadata.render_model.render_meshes.length; r++) {
				var renderMeshIndex = r;
				var renderMesh = metadata.render_model.render_meshes[renderMeshIndex]; // BoB Bunch of Bits

				//console.log('RenderMesh['+renderMeshIndex+']', renderMesh);
				//if (renderMeshIndex != 0) continue;

				// IndexBuffer
				var indexBufferInfo = renderMesh.index_buffer;
				var indexBufferData = tgxBin.files[tgxBin.lookup.indexOf(indexBufferInfo.file_name)].data;

				var indexBuffer = [];
				for (var j=0; j<indexBufferInfo.byte_size; j+=indexBufferInfo.value_byte_size) {
					var indexValue = utils.ushort(indexBufferData, j);
					indexBuffer.push(indexValue);
				}
				//console.log('IndexBuffer', indexBufferInfo);

				// VertexBuffer
				var vertexBuffer = parseVertexBuffers(tgxBin, renderMesh);

				// Spasm.RenderMesh.prototype.getRenderableParts
				//console.log('RenderMesh['+renderMeshIndex+']',
				//	"\n\tPartOffsets:", renderMesh.stage_part_offsets,
				//	"\n\tPartList:", renderMesh.stage_part_list,
				//	"\n\t", renderMesh);

				var parts = [];
				var partIndexList = [];
				var stagesToRender = [0, 7, 15]; // Hardcoded?
				var partOffsets = [];

				var partLimit = renderMesh.stage_part_offsets[4];//renderMesh.stage_part_list.length;
				for (var i=0; i<partLimit; i++) {
					partOffsets.push(i);
				}

				for (var i=0; i<partOffsets.length; i++) {
					var partOffset = partOffsets[i];
					var stagePart = renderMesh.stage_part_list[partOffset];
					//console.log('StagePart['+renderMeshIndex+':'+partOffset+']',
					//	"\n\tLOD:", stagePart.lod_category,
					//	"\n\tShader:", stagePart.shader,
					//	"\n\tFlags:", stagePart.flags,
					//	"\n\tVariantShader:", stagePart.variant_shader_index
					//);
					if (!stagePart) {
						console.warn('MissingStagePart['+renderMeshIndex+':'+partOffset+']');
						continue;
					}
					if (partIndexList.indexOf(stagePart.start_index) != -1) {
						//console.warn('DuplicatePart['+renderMeshIndex+':'+partOffset, stagePart);
						continue;
					}
					partIndexList.push(stagePart.start_index);
					parts.push(parseStagePart(stagePart));
				}

				// Spasm.RenderMesh
				meshes.push({
					positionOffset: renderMesh.position_offset,
					positionScale: renderMesh.position_scale,
					texcoordOffset: renderMesh.texcoord_offset,
					texcoordScale: renderMesh.texcoord_scale,
					texcoord0ScaleOffset: renderMesh.texcoord0_scale_offset,
					indexBuffer: indexBuffer,
					vertexBuffer: vertexBuffer,
					parts: parts
				});
			}

			return meshes;
		}

		// Spasm.RenderMesh.prototype.getAttributes
		function parseVertexBuffers(tgxBin, renderMesh) {
			var stagePartVertexStreamLayoutDefinition = renderMesh.stage_part_vertex_stream_layout_definitions[0];
			var formats = stagePartVertexStreamLayoutDefinition.formats;

			var vertexBuffer = [];

			for (var vertexBufferIndex in renderMesh.vertex_buffers) {
				//for (var j=0; renderMesh.vertex_buffers.length; j++) {
				var vertexBufferInfo = renderMesh.vertex_buffers[vertexBufferIndex];
				var vertexBufferData = tgxBin.files[tgxBin.lookup.indexOf(vertexBufferInfo.file_name)].data;
				var format = formats[vertexBufferIndex];

				//console.log('VertexBuffer['+vertexBufferIndex+']', vertexBufferInfo.file_name, vertexBufferInfo, "\n"+'Elements', format);

				var vertexIndex = 0;
				for (var v=0; v<vertexBufferInfo.byte_size; v+= vertexBufferInfo.stride_byte_size) {
					var vertexOffset = v;
					if (vertexBuffer.length <= vertexIndex) vertexBuffer[vertexIndex] = {};
					for (var e=0; e<format.elements.length; e++) {
						var element = format.elements[e];
						var values = [];

						var elementType = element.type.replace('_vertex_format_attribute_', '');
						var types = ["ubyte", "byte", "ushort", "short", "uint", "int", "float"];
						for (var typeIndex in types) {
							var type = types[typeIndex];
							if (elementType.indexOf(type) === 0) {
								var count = parseInt(elementType.replace(type, ''));
								var j, value;
								switch(type) {
									case 'ubyte':
										for (j=0; j<count; j++) {
											value = utils.ubyte(vertexBufferData, vertexOffset);
											if (element.normalized) value = utils.unormalize(value, 8);
											values.push(value);
											vertexOffset++;
										}
										break;
									case 'byte':
										for (j=0; j<count; j++) {
											value = utils.byte(vertexBufferData, vertexOffset);
											if (element.normalized) value = utils.normalize(value, 8);
											values.push(value);
											vertexOffset++;
										}
										break;
									case 'ushort':
										for(j=0; j<count; j++) {
											value = utils.ushort(vertexBufferData, vertexOffset);
											if (element.normalized) value = utils.unormalize(value, 16);
											values.push(value);
											vertexOffset += 2;
										}
										break;
									case 'short':
										for(j=0; j<count; j++) {
											value = utils.short(vertexBufferData, vertexOffset);
											if (element.normalized) value = utils.normalize(value, 16);
											values.push(value);
											vertexOffset += 2;
										}
										break;
									case 'uint':
										for(j=0; j<count; j++) {
											value = utils.uint(vertexBufferData, vertexOffset);
											if (element.normalized) value = utils.unormalize(value, 32);
											values.push(value);
											vertexOffset += 4;
										}
										break;
									case 'int':
										for(j=0; j<count; j++) {
											value = utils.int(vertexBufferData, vertexOffset);
											if (element.normalized) value = utils.normalize(value, 32);
											values.push(value);
											vertexOffset += 4;
										}
										break;
									case 'float':
										// Turns out all that icky binary2float conversion stuff can be done with a typed array, who knew?
										values = new Float32Array(vertexBufferData.buffer, vertexOffset, count);
										vertexOffset += count*4;
										//console.log(values);
										//console.log(floatArray());
										//for(j=0; j<count; j++) {
										//	value = utils.float(vertexBufferData, vertexOffset);
										//	values.push(value);
										//	vertexOffset += 4;
										//}
										break;
								}
								break;
							}
						}

						var semantic = element.semantic.replace('_tfx_vb_semantic_', '');
						switch(semantic) {
							case 'position':
							case 'normal':
							case 'tangent': // Not used
							case 'texcoord':
							case 'blendweight': // Bone weights 0-1
							case 'blendindices': // Bone indices, 255=none, index starts at 1?
							case 'color':
								break;
							default:
								console.warn('Unknown Vertex Semantic', semantic, element.semantic_index, values);
								break;
						}
						vertexBuffer[vertexIndex][semantic+element.semantic_index] = values;
					}
					vertexIndex++;
				}
			}
			return vertexBuffer;
		}

		// Spasm.RenderablePart
		function parseStagePart(stagePart) {
			var gearDyeSlot = 0;
			var usePrimaryColor = true;
			var useInvestmentDecal = false;

			//console.log('StagePart', stagePart);

			switch(stagePart.gear_dye_change_color_index) {
				case 0:
					gearDyeSlot = 0;
					break;
				case 1:
					gearDyeSlot = 0;
					usePrimaryColor = false;
					break;
				case 2:
					gearDyeSlot = 1;
					break;
				case 3:
					gearDyeSlot = 1;
					usePrimaryColor = false;
					break;
				case 4:
					gearDyeSlot = 2;
					break;
				case 5:
					gearDyeSlot = 2;
					usePrimaryColor = false;
					break;
				case 6:
					gearDyeSlot = 3;
					useInvestmentDecal = true;
					break;
				case 7:
					gearDyeSlot = 3;
					useInvestmentDecal = true;
					break;
				default:
					console.warn('UnknownDyeChangeColorIndex['+stagePart.gear_dye_change_color_index+']', stagePart);
					break;
			}

			var part = {
				//externalIdentifier: stagePart.external_identifier,
				//changeColorIndex: stagePart.gear_dye_change_color_index,
				//primitiveType: stagePart.primitive_type,
				//lodCategory: stagePart.lod_category,
				gearDyeSlot: gearDyeSlot,
				usePrimaryColor: usePrimaryColor,
				useInvestmentDecal: useInvestmentDecal,
				//indexMin: stagePart.index_min,
				//indexMax: stagePart.index_max,
				//indexStart: stagePart.start_index,
				//indexCount: stagePart.index_count
			};

			for (var key in stagePart) {
				var partKey = key;
				var value = stagePart[key];
				switch(key) {
					//case 'external_identifier': partKey = 'externalIdentifier'; break;
					case 'gear_dye_change_color_index': partKey = 'changeColorIndex'; break;
					//case 'primitive_type': partKey = 'primitiveType'; break;
					//case 'lod_category': partKey = 'lodCategory'; break;

					//case 'index_min': partKey = 'indexMin'; break;
					//case 'index_max': partKey = 'indexMax'; break;
					case 'start_index': partKey = 'indexStart'; break;
					//case 'index_count': partKey = 'indexCount'; break;

					case 'shader':
						var staticTextures = value.static_textures;
						value = {
							type: value.type
						};
						if (staticTextures) value.staticTextures = staticTextures;
						break;

					//case 'static_textures': partKey = 'staticTextures'; break;

					default:
						var keyWords = key.split('_');
						var partKey = '';
						for (var i=0; i<keyWords.length; i++) {
							var keyWord = keyWords[i];
							partKey += i == 0 ? keyWord : keyWord.slice(0, 1).toUpperCase()+keyWord.slice(1);
						}
						break;
				}
				part[partKey] = value;
			}

			//if (stagePart.shader) {
			//	var shader = stagePart.shader;
			//	//console.log('StagePartShader', shader);
			//	part.shader = shader.type;
			//	part.staticTextures = shader.static_textures ? shader.static_textures : [];
			//}

			return part;
		}

		//return function(items, options, onLoad, onProgress, onError) {
			for (var i=0; i<items.length; i++) {
				var item = items[i];
				var shader = item.shaderHash ? shaders[item.shaderHash] : null;
				//console.log('ParseGearAsset['+i+']', item, shader);
				loadAssetManifest(item);
				if (shader) loadAssetManifest(shader);
			}
		//}
	//})()
	}
});

// Custom ShaderMaterial that implements Destiny gear dyes
(function() {
	function TGXMaterial(params) {
		if (!params) params = {};

		var shaderLib = THREE.ShaderLib.phong;//standard;
		var uniforms = THREE.UniformsUtils.clone(shaderLib.uniforms);
		var vertexShader = shaderLib.vertexShader;
		var fragmentShader = shaderLib.fragmentShader;

		THREE.ShaderMaterial.call(this, {
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			lights: true,
			fog: true
		});

		this.defaultAttributeValues.detailUv = [0, 0];
		this.side = THREE.DoubleSide;

		this.game = 'destiny2';

		this.map = null;
		this.normalMap = null;
		this.envMap = null;
		this.alphaMap = null;
		this.emissiveMap = null;
		this.gearstackMap = null;

		this.color = new THREE.Color(0xffffff);
		this.emissive = new THREE.Color(0x000000);
		this.emissiveIntensity = 1;
		this.specular = new THREE.Color(0x111111);
		this.shininess = 30;
		this.reflectivity = 1;

		//this.metalness = 0.5;
		//this.roughness = 0.5;

		this.detailMap = null;
		this.detailNormalMap = null;
		this.detailDecalMap = null;
		this.primaryDetailMap = null;
		this.secondaryDetailMap = null;

		this.dyeVariant = 0;
		this.dyeBlendMode = 0;

		this.isCloth = false;

		this.usePrimaryColor = true;
		this.primaryColor = new THREE.Color(0x000000);
		this.secondaryColor = new THREE.Color(0xFFFFFF);

		// Destiny 1 Properties
		this.detailTransform = new THREE.Vector4(1, 1, 0, 0);
		this.decalAlphaMapTransform = new THREE.Vector4(1, 1, 0, 0);
		this.decalBlendOption = 0;
		this.detailNormalContributionStrength = new THREE.Vector4(1, 1, 1, 1);
		this.specularProperties = new THREE.Vector4(0, 0, 0, 0);
		this.subsurfaceScatteringStrength = new THREE.Vector4(32.3, 1, 1, 1);

		// Destiny 2 Properties
		this.detailDiffuseTransform = new THREE.Vector4(1, 1, 0, 0);
		this.detailNormalTransform = new THREE.Vector4(1, 1, 0, 0);
		this.wornColor = new THREE.Color(0x666666);

		// Flags
		this.useAlphaTest = false; // 0x20
		//this.transparent = true;

		this.useDye = true;
		this.useDetail = true;

		//this.detailEnvMap = null; // Vex Mythoclast


		this.setValues(params);
		this.extensions.derivatives = true;

		this.update();
	}
	TGXMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
	TGXMaterial.prototype.constructor = TGXMaterial;
	TGXMaterial.prototype.copy = function(source) {
		THREE.ShaderMaterial.prototype.copy.call(this, source);
		//THREE.MeshPhongMaterial.prototype.copy.call(this, source);

		this.map = source.map;
		this.normalMap = source.normalMap;
		this.specularMap = source.specularMap;
		this.envMap = source.envMap;
		this.emissiveMap = source.emissiveMap;
		this.alphaMap = source.alphaMap;
		//
		this.color = source.color;
		this.emissive = source.emissive;
		this.emissiveIntensity = source.emissiveIntensity;
		this.specular = source.specular;
		this.shininess = source.shininess;
		this.reflectivity = source.reflectivity;

		this.transparency = source.transparency;
		//
		this.skinning = source.skinning;

		// Destiny specific stuff
		this.game = source.game;

		this.gearstackMap = source.gearstackMap;

		this.detailMap = source.detailMap;
		this.detailNormalMap = source.detailNormalMap;
		this.detailDecalMap = source.detailDecalMap;
		this.primaryDetailMap = source.primaryDetailMap;
		this.secondaryDetaileMap = source.secondaryDetaileMap;

		this.dyeVariant = source.dyeVariant;
		this.dyeBlendMode = source.dyeBlendMode;

		this.isCloth = source.isCloth;

		this.usePrimaryColor = source.usePrimaryColor;
		this.primaryColor = source.primaryColor;
		this.secondaryColor = source.secondaryColor;

		// Destiny 1 Properties
		this.detailTransform = source.detailTransform;
		this.decalAlphaMapTransform = source.decalAlphaMapTransform;
		this.decalBlendOption = source.decalBlendOption;
		this.detailNormalContributionStrength = source.detailNormalContributionStrength;
		this.specularProperties = source.specularProperties;
		this.subsurfaceScatteringStrength = source.subsurfaceScatteringStrength;

		// Destiny 2 Properties
		this.detailDiffuseTransform = source.detailDiffuseTransform;
		this.detailNormalTransform = source.detailNormalTransform;
		this.wornColor = source.wornColor;

		// Flags
		this.useDye = source.useDye;
		this.useDetail = source.useDetail;
		this.useAlphaTest = source.useAlphaTest;

		this.update();
		return this;
	};
	TGXMaterial.prototype.update = function() {
		var uniforms = this.uniforms;
		var vertexShader = this.vertexShader;
		var fragmentShader = this.fragmentShader;
		var defines = {};

		//console.log('MaterialUpdate', this);

		if (this.skinning) {
			defines['USE_SKINNING'] = '';
		}
		if (this.map) {
			defines['USE_MAP'] = '';
			uniforms.map = {value: this.map};
		}
		if (this.normalMap) {
			defines['USE_NORMALMAP'] = '';
			uniforms.normalMap = {value: this.normalMap};
		}
		if (this.envMap) {
			defines['USE_ENVMAP'] = '';
			uniforms.envMap = {value: this.envMap};
		}
		if (this.alphaMap) {
			defines['USE_ALPHAMAP'] = '';
			uniforms.alphaMap = {value: this.alphaMap};
		}
		if (this.emissiveMap) {
			defines['USE_EMISSIVEMAP'] = '';
			uniforms.emissiveMap = {value: this.emissiveMap};
		}
		if (this.color) {
			uniforms.diffuse = {value: this.color};
		}
		if (this.transparent) {
			//uniforms.transparent = true;
			uniforms.opacity = {value: this.opacity};
		}

		uniforms.emissive.value.copy(this.emissive).multiplyScalar(this.emissiveIntensity);
		uniforms.specular = {value: this.specular};
		uniforms.shininess = {value: this.shininess};
		uniforms.reflectivity = {value: this.reflectivity};

		//uniforms.metalness = {value: this.metalness};
		//uniforms.roughness = {value: this.roughness};

		if (this.vertexColors) {
			defines['USE_COLOR'] = '';
		}

		// Destiny Specific Stuff
		uniforms.usePrimaryColor = {value: this.usePrimaryColor};
		uniforms.primaryColor = {value: this.primaryColor};
		uniforms.secondaryColor = {value: this.secondaryColor};

		if (this.gearstackMap) {
			defines['USE_GEARSTACKMAP'] = '';
			uniforms.gearstackMap = {value: this.gearstackMap};
			switch(this.game) {
				case 'destiny2':
					//defines['USE_AOMAP'] = '';
					//uniforms.aoMap = {value: this.gearstackMap};
					//
					//defines['USE_ROUGHNESSMAP'] = '';
					//uniforms.roughnessMap = {value: this.gearstackMap};

					//defines['USE_SPECULARMAP'] = '';
					//uniforms.specularMap = uniforms.gearstackMap;
					break;
				default:
					//uniforms.blendMode = {value: this.blendMode};
					break;
			}
		}

		switch(this.game) {
			case 'destiny2':
				defines['USE_DESTINY2'] = '';

				uniforms.wornColor = {value: this.wornColor};

				uniforms.detailDiffuseTransform = {value: this.detailDiffuseTransform};
				uniforms.detailNormalTransform = {value: this.detailNormalTransform};
				break;
			default:
				defines['USE_DESTINY'] = '';

				uniforms.detailDiffuseTransform = {value: this.detailTransform};
				uniforms.detailNormalTransform = {value: this.detailTransform};

				uniforms.decalAlphaMapTransform = {value: this.decalAlphaMapTransform};
				uniforms.decalBlendOption = {value: this.decalBlendOption};
				uniforms.detailNormalContributionStrength = {value: this.detailNormalContributionStrength};
				uniforms.specularProperties = {value: this.specularProperties};

				var spec = this.specularProperties;
				uniforms.specular = {value: new THREE.Color(spec[0], spec[0], spec[0])};
				uniforms.shininess = {value: spec[1]};
				//uniforms.reflectivity = {value: spec[1]};

				uniforms.subsurfaceScatteringStrength = {value: this.subsurfaceScatteringStrength};
				break;
		}


		//if (this.isCloth) {
		//	defines['USE_CLOTH_DYE'] = '';
		//}

		if (this.useAlphaTest) {
			defines['USE_ALPHATESTSTACK'] = '';
		}

		if (this.useDetail) {
			if (this.detailMap) {
				defines['USE_DETAIL'] = '';
				uniforms.detailMap = {value: this.detailMap};
			} else {
				//defines['USE_DETAIL'] = '';
				uniforms.detailMap = {value: this.usePrimaryColor ? this.primaryDetailMap : this.secondaryDetailMap};
			}
			if (this.detailNormalMap) {
				defines['USE_DETAIL_NORMAL'] = '';
				uniforms.detailNormalMap = {value: this.detailNormalMap};
			}
			if (this.detailDecalMap) {
				defines['USE_DECAL'] = '';
				uniforms.detailDecalMap = {value: this.detailDecalMap};
			}
		}

		if (this.shininess == 0) {
			defines['NO_SHINE'] = '';
		}

		//console.log('MaterialParams', this);

		// Spasm.GearShader
		// Since most of the rendering is handled by Three.js, only some of this shader code is needed
		if (vertexShader.indexOf('USE_DETAIL') == -1) {
			// Detail Vertex Vars
			var uv2ParsVertex = [
				"#ifdef USE_DETAIL",
					"attribute vec2 uv2;",
					"varying vec2 vUv2;",
					"uniform vec4 detailDiffuseTransform;",
					"uniform vec4 detailNormalTransform;",
				"#endif",
			];

			vertexShader = this.insertAfter('#include <uv2_pars_vertex>', vertexShader, uv2ParsVertex);

			var uv2Vertex = [
				"#ifdef USE_DETAIL",
					"vUv2 = (uv2 * detailDiffuseTransform.xy) + detailDiffuseTransform.zw;",
					// vertexShader.push("v_texcoord2 = ((texcoord * a_texcoord2) * u_detail_transform.xy) + u_detail_transform.zw;"),
				"#endif"
			];
			vertexShader = this.insertAfter('#include <uv2_vertex>', vertexShader, uv2Vertex);
		}

		if (fragmentShader.indexOf('USE_GEARSTACKMAP') == -1) {
			var gearstackParsFragment = [
				//"#define saturate(value) clamp(value, 0.0, 1.0)",
				"const float gamma_correction_power = 2.2;",
				"const float gamma_correction_power_inverse = 1.0/2.2;",

				// Blend Functions
				"vec4 blend_overlay(vec4 back, vec4 front) {",
					"return front * saturate(back * 4.0) + saturate(back - 0.25);",
				"}",
				"vec4 blend_multiply(vec4 back, vec4 front) {",
					"return back * front;",
				"}",
				"vec4 blend_screen(vec4 back, vec4 front) {",
					"vec4 back_screen = vec4(1.0 - back.x, 1.0 - back.y, 1.0 - back.z, 1.0);",
					"vec4 front_screen = vec4(1.0 - front.x, 1.0 - front.y, 1.0 - front.z, 1.0);",
					"vec4 screen = back_screen * front_screen;",
					"return vec4(1.0 - screen.x, 1.0 - screen.y, 1.0 - screen.z, 1.0);",
				"}",
				"vec4 blend_hard_light(vec4 back, vec4 front) {",
					"return vec4(",
						"front.x < 0.5 ? (2.0 * back.x * front.x) : (1.0 - 2.0 * (1.0 - back.x) * (1.0 - front.x)),",
						"front.y < 0.5 ? (2.0 * back.y * front.y) : (1.0 - 2.0 * (1.0 - back.y) * (1.0 - front.y)),",
						"front.z < 0.5 ? (2.0 * back.z * front.z) : (1.0 - 2.0 * (1.0 - back.z) * (1.0 - front.z)),",
						"1.0",
					");",
				"}",

				// Gearstack Fragment Vars
				"#ifdef USE_GEARSTACKMAP",
					"uniform sampler2D gearstackMap;",
				"#endif",

				"#ifdef USE_DESTINY",
					"uniform float blendMode;",
					"uniform bool usePrimaryColor;",
					"uniform vec3 primaryColor;",
					"uniform vec3 secondaryColor;",
				"#endif",

				"#ifdef USE_DESTINY2",
					"uniform bool usePrimaryColor;",
					"uniform vec3 primaryColor;",
					"uniform vec3 secondaryColor;",
					"uniform vec3 wornColor;",
				"#endif",

				// Texture Detail Fragment Vars
				"#ifdef USE_DETAIL",
					"uniform sampler2D detailMap;",
					"uniform sampler2D detailNormalMap;",
					"varying vec2 vUv2;",
				"#endif",

				"#ifdef USE_DECAL",
					"uniform sampler2D detailDecalMap;",
				"#endif",
			];
			fragmentShader = this.insertAfter('#include <map_pars_fragment>', fragmentShader, gearstackParsFragment);

			// TODO Fix normal detail
			var gearstackNormalFragment = [
				"#ifndef USE_DETAIL_NORMAL",
					"#include <normalmap_pars_fragment>",
				"#endif",
				"#ifdef USE_DETAIL_NORMAL",
					"#ifdef USE_NORMALMAP",
						//"\n\tuniform sampler2D normalMap;",
						"\n\tuniform vec2 normalScale;",
						"uniform vec4 detailNormalTransform;",
						"\n\tvec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {",
							"\n\t\tvec3 q0 = dFdx( eye_pos.xyz );",
							"\n\t\tvec3 q1 = dFdy( eye_pos.xyz );",
							"\n\t\tvec2 st0 = dFdx( vUv.st );",
							"\n\t\tvec2 st1 = dFdy( vUv.st );",
							"\n\t\tvec3 S = normalize( q0 * st1.t - q1 * st0.t );",
							"\n\t\tvec3 T = normalize( -q0 * st1.s + q1 * st0.s );",
							"\n\t\tvec3 N = normalize( surf_norm );",
							//"\n\t\tvec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;",
							"\n\t\tvec3 mapN = texture2D( detailNormalMap, vUv2 ).xyz * 2.0 - 1.0;",
							//"\n\t\tmapN.xy = normalScale * mapN.xy;",
							"mapN.xy = detailNormalTransform.xy * mapN.xy + detailNormalTransform.zw;",
							"\n\t\tmat3 tsn = mat3( S, T, N );",
							"\n\t\treturn normalize( tsn * mapN );",
						"\n\t}",
					"\n#endif\n",
				"#endif",
				//"#ifdef USE_DETAIL_NORMAL",
				//	"normalMap = detailNormalMap;",
				//	//"vec4 color_dye_normal = texture2D(detailNormalMap, vUv2);",
				//	//"color_dye_normal = color_dye_normal * 2.0 - 1.0;",
				//	//"vNormal = vNormal + color_dye_normal.xy;",
				//"#endif"
			];
			//fragmentShader = this.replace('#include <normalmap_pars_fragment>', fragmentShader, gearstackNormalFragment);

			var gearstackFragment = [
				"diffuseColor = pow(diffuseColor, vec4(gamma_correction_power));",

				"vec4 gearstackColor = vec4(1.0, 1.0, 1.0, 1.0);",
				"vec4 dyeColor = vec4(1.0, 1.0, 1.0, 1.0);",

				"#ifdef USE_GEARSTACKMAP",
					"gearstackColor = texture2D(gearstackMap, vUv);",
					"dyeColor = usePrimaryColor ? vec4(primaryColor, 1.0) : vec4(secondaryColor, 1.0);",
				"#endif",

				// Dye Textures (Detail)
				"#ifdef USE_DETAIL",
					"vec4 color_dye_diffuse_texture = texture2D(detailMap, vUv2);",
					//"vec4 color_dye_diffuse_texture = texture2D(u_texture_dye_diffuse, v_texcoord2);",

					"float dye_alpha = color_dye_diffuse_texture.w;",
					"float dye_color_normalize = (1.0 - dye_alpha) * 0.5;",
					"vec4 color_dye_diffuse = pow(vec4("
						+"color_dye_diffuse_texture.x * dye_alpha + dye_color_normalize, "
						+"color_dye_diffuse_texture.y * dye_alpha + dye_color_normalize, "
						+"color_dye_diffuse_texture.z * dye_alpha + dye_color_normalize, 1.0), "
						+"vec4(gamma_correction_power));",
					//"diffuseColor = blend_overlay(color_dye_diffuse, diffuseColor);",

					// TODO figure out how to make decals look worn
					"#ifdef USE_DECAL",
						"vec4 decalColor = texture2D(detailDecalMap, vUv2);",
						//"diffuseColor = blend_multiply(decalColor, diffuseColor);",
					"#endif",

					//"vec4 color_dye_normal = texture2D(dyeNormal, vUv2);",
					//"color_dye_normal = color_dye_normal * 2.0 - 1.0;",
					//"normal = normal + color_dye_normal.xy;",
				"#endif",

				"#ifdef USE_DESTINY",
					"vec4 blendColorUncorrected = mix(diffuseColor, blend_overlay(diffuseColor, dyeColor), gearstackColor.r);",
					"diffuseColor = blendColorUncorrected;",

					// Worn Color
					//"vec4 detailColor = vec4(wornColor, 1.0);",
					//"vec4 blendDetail = mix(diffuseColor, blend_overlay(diffuseColor, detailColor), dyeAmbientColor.b);",
					//"diffuseColor = blendDetail;",

					//"vec4 decalColor = vec4(1.0, 0.0, 1.0, 1.0);",
					//"vec4 blendDecal = mix(diffuseColor, blend_multiply(diffuseColor, decalColor), gearstackColor.b);",
					//"diffuseColor = blendDecal;",
				"#endif",

				"#ifdef USE_DESTINY2",
					// Gearstack Textures
					// Notes from https://twitter.com/HashtagVeegie/status/929245226207649792
					// Red is AO, Green is smoothness, Blue is encoded alpha test and emissive.
					// Alpha is encoded dye mask, non-dyed metalness, and wear mask.

					"vec4 blendColorUncorrected = mix(diffuseColor, blend_overlay(diffuseColor, dyeColor), gearstackColor.r);",
					"diffuseColor = blendColorUncorrected;",
				"#endif",

				"diffuseColor = vec4(pow(diffuseColor.xyz, vec3(gamma_correction_power_inverse)), 1.0);",

				"#ifdef USE_ALPHATESTSTACK",
					"#ifdef USE_DESTINY",
						//"diffuseColor.a = gearstackColor.b;",
						"diffuseColor.a = diffuseColor.g;",
						"if (diffuseColor.a < 1.0 - gearstackColor.b) discard;",
					"#endif",
				"#endif",
			];
			fragmentShader = this.insertAfter('#include <map_fragment>', fragmentShader, gearstackFragment);

			var alphaFragment = [
				"#ifdef USE_ALPHATESTSTACK",
					"#ifdef USE_DESTINY",
						//"diffuseColor.a = gearstackColor.b;",
						//"diffuseColor.a = 0.5;",
					"#endif",
				"#endif"
			];
			//fragmentShader = this.insertAfter('#include <alphamap_fragment>', fragmentShader, alphaFragment);

			// Vertex Colors
			// Doesn't appear to be a standard color, possibly flags?
			var colorFragment = [
				"#ifdef USE_COLOR",
					"vec3 vtxColor = vColor;",
					//"diffuseColor = vec4(vColor, 1.0);",
					//"diffuseColor = mix(diffuseColor, blend_overlay(diffuseColor, vec4(primaryColor, 1.0)), vColor.r);",
				"#endif"
			];
			fragmentShader = this.replace('#include <color_fragment>', fragmentShader, colorFragment);

			// Gearstack Specular Fragment
			//var specularFragment = [
			//	"specularStrength = 1.0;",
			//
			//	"#ifdef USE_GEARSTACKMAP",
			//		"vec4 gearstackSpecular = texture2D(gearstackMap, vUv);",
			//		"specularStrength = gearstackSpecular.g * 0.4;",
			//	"#endif",
			//	"#ifdef NO_SHINE",
			//		"specularStrength = 0.0;",
			//	"#endif",
			//];
			var specularFragment = [
				"#ifndef USE_SPECULARMAP",
					"specularStrength = 1.0;",
					"#ifdef USE_DESTINY",
						"specularStrength = gearstackColor.g * 0.2;",
					"#endif",
					//"#ifdef NO_SHINE",
					//	"specularStrength = 0.0;",
					//"#endif",
				"#endif"
			];

			fragmentShader = this.insertAfter('#include <specularmap_fragment>', fragmentShader, specularFragment);

			//console.log('VertexShader', vertexShader);
			//console.log('FragmentShader', fragmentShader);
		}
		this.defines = defines;
		this.vertexShader = vertexShader;
		this.fragmentShader = fragmentShader;
	};
	TGXMaterial.prototype.insertBefore = function(search, shader, insertCode) {
		search += "\n";
		if (typeof insertCode != 'string') insertCode = insertCode.join("\n")+"\n";
		shader = shader.replace(search, insertCode+search);
		return shader;
	};
	TGXMaterial.prototype.insertAfter = function(search, shader, insertCode) {
		search += "\n";
		if (typeof insertCode != 'string') insertCode = insertCode.join("\n")+"\n";
		shader = shader.replace(search, search+insertCode);
		return shader;
	};
	TGXMaterial.prototype.replace = function(search, shader, insertCode) {
		search += "\n";
		if (typeof insertCode != 'string') insertCode = insertCode.join("\n")+"\n";
		shader = shader.replace(search, insertCode);
		return shader;
	};
	THREE.TGXMaterial = TGXMaterial;
})();

// A pure javascript loader for querying the mobile manifest.
// It's dependent on the following libraries:
// - zip.js (http://gildas-lormeau.github.io/zip.js/)
// - sql.js (https://github.com/kripken/sql.js)
(function() {
	var manifestBlob = null;
	var apiKey = THREE.TGXLoader.APIKey;
	var apiBasepath = THREE.TGXLoader.APIBasepath;
	var basepath = THREE.TGXLoader.Basepath;

	// https://github.com/DestinyItemManager/DIM/blob/master/src/scripts/services/dimManifestService.factory.js
	// This manifest loader is based on DIM's code
	function loadDatabase(response, onLoad, onProgress, onError) {
		var assetDatabases = response.Response.mobileGearAssetDataBases;
		if (assetDatabases.length > 0) {
			var assetDatabase = assetDatabases[assetDatabases.length - 1];
			var assetDatabaseUrl = basepath+assetDatabase.path;

			//console.log('Database', assetDatabaseUrl);

			// http://gildas-lormeau.github.io/zip.js/
			zip.useWebWorkers = true;
			zip.workerScripts = {
				inflater: ['/lib/zipjs/z-worker.js', '/lib/zipjs/inflate.js']
			};
			zip.createReader(new zip.HttpReader(assetDatabaseUrl), function(zipReader) {
				zipReader.getEntries(function(entries) {
					if (entries.length == 0) {
						console.error('Empty Database');
						return;
					}
					entries[0].getData(new zip.BlobWriter(), function(blob) {
						var blobReader = new FileReader();
						blobReader.addEventListener("error", onError);
						blobReader.addEventListener("load", function() {
							zipReader.close(function() {
								manifestBlob = new Uint8Array(blobReader.result);
								if (onLoad) onLoad();
							});
						});
						blobReader.readAsArrayBuffer(blob);
					});
				});
			}, onError);
		} else {
			console.error('Empty Database');
		}
	}

	function TGXManifest(manager, options) {
		this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
		if (options === undefined) options = {};
		if (options.apiKey !== undefined) apiKey = options.apiKey;
		if (options.apiBasepath !== undefined) apiBasepath = options.apiBasepath;
		if (options.basepath !== undefined) basepath = options.basepath;

	}
	TGXManifest.isCapable = function() {
		var isCapable = true;
		if (!window.zip) {
			console.warn('Missing zip.js library.');
			isCapable = false;
		}
		if (!window.SQL) {
			console.warn('Missing sql.js library.');
			isCapable = false;
		}
		return isCapable;
	};
	Object.assign(TGXManifest.prototype, {
		load: function(onLoad, onProgress, onError) {
			var scope = this;
			var manifestUrl = apiBasepath+'/Manifest/';
			var loader = new THREE.BungieNetLoader(this.manager);
			loader.load(manifestUrl, apiKey, function(response) {
				response = JSON.parse(response);
				//console.log('Manifest', response);
				if (response.ErrorCode == 1) {
					loadDatabase(response, function() {
						if (onLoad) onLoad(scope);
					}, onProgress, onError);
				} else {
					console.error('Bungie Error Response', response);
				}
			}, onProgress, onError);
		},
		getAsset: function(id, onLoad, onProgress, onError) {
			var scope = this;
			if (!manifestBlob) {
				scope.load(function() {
					scope.getAsset(id, onLoad, onProgress, onError);
				}, onProgress, onError);
				return;
			}
			//console.log(manifestBlob);
			// https://github.com/kripken/sql.js
			var db = new SQL.Database(manifestBlob);

			var res = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
			//console.log(res);

			var key = 'id';
			var where = ' WHERE '+key+'='+id+' OR '+key+'='+(id-4294967296);
			var res = db.exec("SELECT * FROM DestinyGearAssetsDefinition"+where);
			if (res.length > 0) {
				var data = {
					requestedId: id,
					gearAsset: JSON.parse(res[0].values[0][1])
				};
				onLoad(data);
				return;
			}
			console.error('Item Not Found', id);
		}
	});
	THREE.TGXManifest = TGXManifest;
})();

