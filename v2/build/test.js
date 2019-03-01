'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs');
var fetch = _interopDefault(require('node-fetch'));
var path = require('path');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Game;
(function (Game) {
    Game["Destiny"] = "destiny";
    Game["Destiny2"] = "destiny2";
})(Game || (Game = {}));
var Platform;
(function (Platform) {
    Platform["mobile"] = "mobile";
    Platform["web"] = "web";
})(Platform || (Platform = {}));
var PrimitiveType;
(function (PrimitiveType) {
    PrimitiveType[PrimitiveType["TRIANGLES"] = 3] = "TRIANGLES";
    PrimitiveType[PrimitiveType["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
})(PrimitiveType || (PrimitiveType = {}));
var Gender;
(function (Gender) {
    Gender[Gender["Default"] = 0] = "Default";
    Gender[Gender["Male"] = 1] = "Male";
    Gender[Gender["Female"] = 2] = "Female";
})(Gender || (Gender = {}));
//# sourceMappingURL=enums.js.map

var TGXGearAsset = /** @class */ (function () {
    function TGXGearAsset(itemHash, settings, gearAsset, gear, content) {
        this.itemHash = itemHash;
        this.settings = settings;
        this.gearAsset = gearAsset;
        this.gear = gear;
        this.content = content;
    }
    return TGXGearAsset;
}());
//# sourceMappingURL=asset.js.map

var TGXGeometry = /** @class */ (function () {
    function TGXGeometry(data, name) {
        this.name = name;
        this.data = data;
        var metadata = null;
        var buffers = {};
        data.entries.map(function (entry, index) {
            if (entry.name === "render_metadata.js") {
                metadata = JSON.parse(entry.data.toString());
            }
            else {
                buffers[entry.name] = entry;
            }
        });
    }
    return TGXGeometry;
}());
//# sourceMappingURL=geometry.js.map

function getFile(url, isJson) {
    if (isJson === void 0) { isJson = true; }
    // console.log(`GET ${url}`);
    return fetch(url, {}).then(function (res) { return (isJson ? res.json() : res.arrayBuffer()); });
}
function mkdirs(folderPath) {
    folderPath.split(path.sep).reduce(function (currentPath, folder) {
        currentPath += folder + path.sep;
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
        }
        return currentPath;
    }, "");
}
function mkpath(filePath) {
    mkdirs(path.dirname(filePath));
}
function dumpFile(path, data, isRaw) {
    if (isRaw === void 0) { isRaw = false; }
    //   console.log(path.replace(tmpPath, ""));
    mkpath(path);
    fs.writeFileSync(path, isRaw ? data : JSON.stringify(data, null, "  "));
}
//# sourceMappingURL=common.js.map

var TGXTextureType;
(function (TGXTextureType) {
    TGXTextureType["Binary"] = "binary";
    TGXTextureType["Plated"] = "plated";
})(TGXTextureType || (TGXTextureType = {}));
var TGXTexture = /** @class */ (function () {
    function TGXTexture(name) {
        this.name = name;
    }
    return TGXTexture;
}());
var TGXBinaryTexture = /** @class */ (function (_super) {
    __extends(TGXBinaryTexture, _super);
    function TGXBinaryTexture(data, name) {
        var _this = _super.call(this, name) || this;
        _this.data = data;
        _this.type = TGXTextureType.Binary;
        return _this;
    }
    return TGXBinaryTexture;
}(TGXTexture));
var TGXPlatedTexture = /** @class */ (function (_super) {
    __extends(TGXPlatedTexture, _super);
    function TGXPlatedTexture(data, name) {
        var _this = _super.call(this, name) || this;
        _this.type = TGXTextureType.Plated;
        _this.data = data;
        return _this;
    }
    return TGXPlatedTexture;
}(TGXTexture));
//# sourceMappingURL=texture.js.map

var TGXContent = /** @class */ (function () {
    function TGXContent(data, settings) {
        this.data = data;
        this.settings = settings;
    }
    TGXContent.prototype.init = function () {
        var _this = this;
        var content = this.data;
        return Promise.all([
            Promise.all(content.geometry.map(function (name) { return _this.getGeometry(name); })),
            Promise.all(content.textures.map(function (texture) { return _this.getTexture(texture); }))
        ]).then(function (res) {
            var geometry = res[0];
            var textures = res[1];
            _this.geometry = geometry;
            _this.textures = textures;
            return _this;
        });
    };
    TGXContent.prototype.getGeometry = function (geometry) {
        return this.getTGXBin(this.settings.contentpath + "/geometry/platform/" + this.settings.platform + "/geometry/" + geometry)
            .then(function (res) {
            return new TGXGeometry(res, geometry);
        })["catch"](function (e) {
            console.log("Failed:TGXGeometry", geometry);
            return null;
        });
    };
    TGXContent.prototype.getTexture = function (texture, isPlated) {
        if (isPlated === void 0) { isPlated = false; }
        var textureType = isPlated ? "plated_textures" : "textures";
        var textureUrl = this.settings.contentpath + "/geometry/platform/" + this.settings.platform + "/" + textureType + "/" + texture;
        if (texture.indexOf(".bin") != -1) {
            return this.getTGXBin(textureUrl)
                .then(function (res) { return new TGXBinaryTexture(res, texture); })["catch"](function (e) {
                console.log("Failed:TGXTexture", texture);
                return null;
            });
        }
        // Return already plated texture
        return getFile(textureUrl, false)
            .then(function (res) { return new TGXPlatedTexture(res, texture); })["catch"](function (e) {
            console.log("Failed:TGXPlatedTexture", texture);
            return null;
        });
    };
    TGXContent.prototype.getTGXBin = function (url) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getFile(url, false).then(function (res) {
                        var data = Buffer.from(res);
                        var magic = data.slice(0, 0x4).toString(); // TGXM
                        var version = data.readUInt32LE(0x4);
                        var entryOffset = data.readUInt32LE(0x8);
                        var entryCount = data.readUInt32LE(0xc);
                        var referenceId = data
                            .slice(0x10, 0x100)
                            .toString()
                            .split("\u0000")[0];
                        var entries = [];
                        // console.log(magic, referenceId, url.slice(url.lastIndexOf("/") + 1));
                        for (var i = 0; i < entryCount; i++) {
                            var fileOffset = entryOffset + 0x110 * i;
                            var name = data
                                .slice(fileOffset, fileOffset + 0x100)
                                .toString()
                                .split("\u0000")[0];
                            var dataOffset = data.readUInt32LE(fileOffset + 0x100); // uint64
                            var dataSize = data.readUInt32LE(fileOffset + 0x108); // uint64
                            var fileData = data.slice(dataOffset, dataOffset + dataSize);
                            // console.log("#" + i, name);
                            entries.push({
                                name: name,
                                offset: dataOffset,
                                size: dataSize,
                                data: fileData
                            });
                        }
                        return {
                            magic: magic,
                            version: version,
                            entry_offset: entryOffset,
                            entry_count: entryCount,
                            reference_id: referenceId,
                            entries: entries,
                            rawData: data
                        };
                    })];
            });
        });
    };
    return TGXContent;
}());
//# sourceMappingURL=content.js.map

var TGXGear = /** @class */ (function () {
    function TGXGear(name, settings) {
        this.name = name;
        this.settings = settings;
    }
    TGXGear.prototype.init = function () {
        var _this = this;
        var gearUrl = this.settings.contentpath + "/geometry/gear/" + this.name;
        return getFile(gearUrl)
            .then(function (res) {
            _this.data = res;
            return _this;
        })["catch"](function (e) {
            console.log("Failed:TGXGear", _this.name);
            return _this;
        });
    };
    TGXGear.prototype.getDyeTextures = function () {
        var dyes = this.data.default_dyes.concat(this.data.locked_dyes, this.data.custom_dyes);
        var dyeTextures = [];
        dyes.map(function (dye) {
            for (var textureId in dye.textures) {
                var dyeTexture = dye.textures[textureId];
                if (dyeTextures.indexOf(dyeTexture) !== -1) {
                    continue;
                }
                dyeTextures.push(dyeTexture);
            }
        });
        return dyeTextures;
    };
    TGXGear.prototype.getArtContent = function (classHash, isFemale) {
        if (classHash === void 0) { classHash = 0; }
        if (isFemale === void 0) { isFemale = false; }
        var arrangements = [];
        if (this.data.art_content) {
            arrangements = [__assign({}, this.data.art_content, { class_hash: 0 })];
        }
        if (this.data.art_content_sets) {
            // Filter by classHash
            if (this.data.art_content_sets.length > 1 && classHash) {
                for (var i = 0; i < this.data.art_content_sets.length; i++) {
                    var artContentSet = this.data.art_content_sets[i];
                    if (artContentSet.classHash === classHash) {
                        arrangements = [
                            __assign({}, artContentSet.arrangement, { class_hash: classHash })
                        ];
                        break;
                    }
                }
            }
            // Return all arrangements
            if (arrangements.length === 0) {
                arrangements = this.data.art_content_sets.map(function (artContentSet) {
                    return __assign({}, artContentSet.arrangement, { class_hash: 0 });
                });
            }
        }
        return arrangements;
    };
    TGXGear.prototype.getArtRegions = function (classHash, isFemale) {
        if (classHash === void 0) { classHash = 0; }
        if (isFemale === void 0) { isFemale = false; }
        var arrangements = this.getArtContent(classHash, isFemale);
        var regions = [];
        arrangements.map(function (arrangement) {
            var gearSet = arrangement.gear_set;
            if (gearSet.regions.length > 0) {
                gearSet.regions.map(function (region) {
                    regions.push(__assign({}, region, { class_hash: arrangement.class_hash, arrangement_hash: arrangement.hash, is_female: false }));
                });
            }
            else {
                regions.push({
                    region_index: -1,
                    pattern_list: [
                        isFemale
                            ? gearSet.female_override_art_arrangement
                            : gearSet.base_art_arrangement
                    ],
                    class_hash: arrangement.class_hash,
                    arrangement_hash: arrangement.hash,
                    is_female: isFemale
                });
            }
        });
        return regions;
    };
    TGXGear.prototype.getArtContentPatterns = function (classHash, isFemale) {
        var _this = this;
        if (classHash === void 0) { classHash = 0; }
        if (isFemale === void 0) { isFemale = false; }
        var patterns = [];
        var regions = this.getArtRegions(classHash, isFemale);
        regions.map(function (region) {
            if (region.pattern_list.length > 1) {
                console.warn("MultiPatternRegion", _this.name, region.arrangement_hash, region.region_index);
            }
            region.pattern_list.map(function (pattern) {
                patterns.push(__assign({}, pattern, { class_hash: region.class_hash, arrangement_hash: region.arrangement_hash, is_female: region.is_female, region_index: region.region_index }));
            });
        });
        return patterns;
    };
    TGXGear.prototype.getGeometryHashes = function (classHash, isFemale) {
        if (classHash === void 0) { classHash = 0; }
        if (isFemale === void 0) { isFemale = false; }
        var geometryHashes = [];
        var patterns = this.getArtContentPatterns(classHash, isFemale);
        patterns.map(function (pattern) {
            pattern.geometry_hashes.map(function (geometryHash) {
                if (geometryHashes.indexOf(geometryHash) === -1) {
                    geometryHashes.push(geometryHash);
                }
            });
        });
        return geometryHashes;
    };
    return TGXGear;
}());
//# sourceMappingURL=gear.js.map

var DefaultTGXLoaderSettings = {
    apiBasepath: "https://www.bungie.net/Platform/Destiny2",
    apiKey: "",
    basepath: "https://www.bungie.net",
    contentpath: "",
    game: Game.Destiny2,
    platform: Platform.mobile,
    classHash: 0,
    isFemale: false
};
var TGXLoader = /** @class */ (function () {
    function TGXLoader(settings) {
        if (!settings) {
            settings = DefaultTGXLoaderSettings;
        }
        settings.contentpath =
            settings.basepath + "/common/" + settings.game + "_content";
        this.settings = settings;
    }
    TGXLoader.prototype.getItem = function (itemHash) {
        // console.log("Item", itemHash);
        var _this = this;
        var gearAssetUrl = "https://lowlidev.com.au/destiny/api/gearasset/" + itemHash + "?" + this.settings.game;
        return getFile(gearAssetUrl)
            .then(function (res) {
            var gearAsset = res.gearAsset;
            // console.log(
            //   "GearAsset",
            //   res.requestedId,
            //   "Gear",
            //   gearAsset.gear.length,
            //   "Content",
            //   gearAsset.content.length
            // );
            return Promise.all([
                Promise.all(gearAsset.gear.map(function (name, index) {
                    // console.log("Gear[" + index + "]", name);
                    return new TGXGear(name, __assign({}, _this.settings)).init();
                })),
                Promise.all(gearAsset.content.map(function (content, index) {
                    // console.log("Content[" + index + "]");
                    return new TGXContent(content, __assign({}, _this.settings)).init();
                }))
            ]).then(function (result) {
                var gear = result[0];
                var content = result[1];
                return new TGXGearAsset(itemHash, __assign({}, _this.settings), gearAsset, gear, content);
            });
        })["catch"](function (e) {
            console.log("FailedToLoad", itemHash);
            return null;
        });
    };
    return TGXLoader;
}());
//# sourceMappingURL=tgx.js.map

//# sourceMappingURL=index.js.map

var tmpPath = path.resolve("./temp");
var loader = new TGXLoader();
function getItems(hashes, offset) {
    if (offset === void 0) { offset = 0; }
    if (offset >= hashes.length) {
        return;
    }
    var itemHash = hashes[offset];
    // Skip items already dumped
    //   if (fs.existsSync(`${tmpPath}/destiny2/${itemHash}`)) {
    //     console.log("Skipped Item", itemHash);
    //     setTimeout(() => {
    //       loadItems(hashes, offset + 1);
    //     }, 100);
    //     return;
    //   }
    loader.getItem(itemHash).then(function (asset) {
        var content = asset.content;
        var gear = asset.gear;
        var geometryCount = content.map(function (item) { return item.geometry.length; });
        var textureCount = content.map(function (item) { return item.textures.length; });
        var defaultDyeCount = gear.map(function (item) { return item.data.default_dyes.length; });
        var lockedDyeCount = gear.map(function (item) { return item.data.locked_dyes.length; });
        var customDyeCount = gear.map(function (item) { return item.data.custom_dyes.length; });
        var regionIndexes = content.map(function (item) {
            if (item.data.region_index_sets) {
                return Object.keys(item.data.region_index_sets);
            }
            var indexes = [];
            if (item.data.male_index_set) {
                indexes.push("m");
            }
            if (item.data.female_index_set) {
                indexes.push("f");
            }
            return indexes;
        });
        console.log("Item", itemHash, "Geometry", geometryCount, "Textures", textureCount, "DefaultDyes", defaultDyeCount, "LockedDyes", lockedDyeCount, "CustomDyes", customDyeCount, "Regions", regionIndexes);
        dumpItem(asset);
        setTimeout(function () {
            getItems(hashes, offset + 1);
        }, 1000);
    });
}
function dumpItem(asset) {
    //console.log(asset);
    //   asset.gear.map((gear: TGXGear) => {
    //     const dyeTextures = gear.getDyeTextures();
    //     const geometryHashes = gear.getGeometryHashes();
    //     console.log("DyeTextures", dyeTextures);
    //     console.log("GeometryHashes", geometryHashes);
    //   });
    var gearAssetPath = tmpPath + "/" + asset.settings.game + "/" + asset.itemHash;
    dumpFile(gearAssetPath + "/gear_asset.json", asset.gearAsset);
    asset.gear.map(function (gear) {
        dumpFile(gearAssetPath + "/gear/" + gear.name, gear.data);
    });
    asset.content.map(function (content) {
        content.geometry.map(function (geometry) {
            var geometryPath = gearAssetPath + "/content/geometry/" + geometry.data.reference_id;
            dumpFile(geometryPath + "/" + geometry.name, geometry.data.rawData, true);
            geometry.data.entries.map(function (entry) {
                dumpFile(geometryPath + "/" + entry.name, entry.data, true);
            });
        });
        content.textures.map(function (texture) {
            var texturePath = gearAssetPath + "/content/textures";
            switch (texture.type) {
                case TGXTextureType.Binary:
                    var binaryTexture = texture;
                    var binaryTexturePath_1 = texturePath + "/" + binaryTexture.data.reference_id;
                    dumpFile(binaryTexturePath_1 + "/" + binaryTexture.name, binaryTexture.data.rawData, true);
                    binaryTexture.data.entries.map(function (textureEntry) {
                        dumpFile(binaryTexturePath_1 + "/" + textureEntry.name + ".png", textureEntry.data, true);
                    });
                    break;
                case TGXTextureType.Plated:
                    var platedTexture = texture;
                    dumpFile(texturePath + "/" + platedTexture.name, platedTexture.data);
                    break;
            }
        });
    });
}
//# sourceMappingURL=export.js.map

// getItemHashes().then(itemHashes => {
//   dumpFile(itemHashesPath, itemHashes);
// });
var loader$1 = new TGXLoader();
getItems([
    //   4124984448, // Hard Light
    1667080811 // Knucklehead Radar
]);
//# sourceMappingURL=test.js.map
