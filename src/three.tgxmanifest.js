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