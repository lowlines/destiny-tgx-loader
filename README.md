# three-tgx-loader

Load Destiny model assets from Bungie.net with the BungieNetPlatform APIs.

## Example:
```javascript
var itemHash = 1274330687; // Gjallarhorn
THREE.TGXLoader.APIKey = '{insert-api-key}'; // https://www.bungie.net/en/Application
var loader = new THREE.TGXLoader();
loader.load(itemHash, function(geometry, materials) {
	console.log('LoadedItem', geometry, materials);
	mesh = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
	mesh.rotation.x = 90 * Math.PI / 180;
	mesh.scale.set(500, 500, 500);
	scene.add(mesh);
});
```

## Advanced Options:
This loader can be customized based on your hosting settings and/or preferences. Here is the full list of options you can set either globally or per instance.
```javascript
// Global Defaults
THREE.TGXLoader.APIKey = null;
THREE.TGXLoader.APIBasepath = "https://www.bungie.net/d1/Platform/Destiny"; // The basepath for making API requests
THREE.TGXLoader.Basepath = "https://www.bungie.net"; // The basepath to load gear assets from
THREE.TGXLoader.Platform = "web"; // Whether to use "web" or "mobile" gear assets (note the latter requires extra setup to use.
THREE.TGXLoader.ManifestPath = null; // The url for server-side manifest querying. Must include $itemHash
THREE.TGXLoader.NoCache = false; // Whether to force assets to ignore caching.

// Destiny 2 Global Defaults
THREE.TGXLoader.APIBasepath2 = 'https://www.bungie.net/Platform/Destiny2';
THREE.TGXLoader.ManifestPath2 = null;

// Instance options
new THREE.TGXLoader({
	itemHash: 0, // The itemHash to load (required)
	classHash: 0, // The classHash to load
	isFemale: false, // Whether to use male or female geometry sets (for Armor)
	apiKey: THREE.TGXLoader.APIKey,
	apiBasepath: THREE.TGXLoader.APIBasepath,
	basepath: THREE.TGXLoader.Basepath,
	platform: THREE.TGXLoader.Platform,
	manifestPath: THREE.TGXLoader.ManifestPath,
	loadTextures: true, // Whether textures should be loaded
	loadSkeleton: false, // Whether the skeleton should be loaded (not implemented yet)
	loadAnimation: false, // Whether the animation should be loaded (not implemented yet)
	animationPath: THREE.TGXLoader.DefaultAnimationPath, // The animation to load (not implemented yet)
}, onLoadCallback, onProgressCallback, onErrorCallback);
```

## Loadouts
It's possible to supply an array of itemHashes to render a loadout with a single call. Note that this will flatten everything into a single geometry so if you want to be able to control items individually, it is recommended that you create a loader for each item.
```javascript
new THREE.TGXLoader({
	itemHashes: [0], // The itemHash to load (required)
});
```

## Shaders
You can specify a custom shader to apply to an item. Optionally you can also tell the loader to ignore locked dyes, which are often present on exotic items.
```javascript
new THREE.TGXLoader({
	itemHash: 0, // The itemHash to load (required)
	shaderHash: 0, // The shader itemHash to load, 0 will load the item without a shader and if the default.

	ignoreLockedDyes: false // Whether to ignore locked dyes when applying custom shaders
});
```

## Loadouts with Shaders
Much like loadouts, you can specify an array of shaderHashes for each item in your loadout. This was not possible in-game for Destiny 1.
```javascript
new THREE.TGXLoader({
	itemHashes: [0],
	shaderHashes: [0]
});
```

## Destiny 2 Support
This loader now supports Destiny 2. Here's an example of how to load an item. Only mobile assets are available for Destiny 2 models.
```javascript
new THREE.TGXLoader({
	itemHash: 0, // The itemHash to load (required)
	game: 'destiny2',
	apiBasepath: THREE.TGXLoader.APIBasepath2,
	manifestPath2: THREE.TGXLoader.ManifestPath2
}, onLoadCallback, onProgressCallback, onErrorCallback);
```

## Loading Mobile Assets
This loader supports both web and mobile versions of loading gear assets however the latter requires access to the mobile manifest. This can be done via one of two methods:

* Client-side loading, requires [sql.js](https://github.com/kripken/sql.js/) and [zip.js](https://gildas-lormeau.github.io/zip.js/) and will take a bit to load initially but won't require any extra calls.
* Server-side loading, requires specifying a cross-origin friendly endpoint that will return a response that matches the response data format when loading GearAsset definitions from [GetDestinySingleDefinition](https://destinydevs.github.io/BungieNetPlatform/docs/DestinyService/GetDestinySingleDefinition).

Due to the way compression is applied to the textures, you will get better quality from loading the mobile assets over the web versions.

## Progress Bars
The TGXLoader uses the default Three.js LoadingManager (see https://threejs.org/docs/#api/loaders/managers/LoadingManager).

## Spasm Source Code
This implementation is based on Bungie's Spasm library (see https://www.bungie.net/sharedbundle/spasm). Since the production files are minified, an unminified copy of the source code has been included with this repo.

## Changelog

### 7 November 2017

* Added support for custom shaders.
* Dyes should be correctly coming through on Destiny 2 models now.

### 6 November 2017

* Fixed variable scope issue that caused subsequent loaders to merge together.
* Fixed an issue where the timing of when all content finished loading would cause the parseContent() function to be called a ton of times.
* Fixed 2 references to the chosen platform that were actually using the static value.
* Made it easier to switch between D1 and D2 modes.
* Fixed an issue that would crash three.js when loading multiple models into a scene.
* Added preliminary support for Destiny 2 models.