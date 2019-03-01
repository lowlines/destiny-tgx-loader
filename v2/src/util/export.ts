import * as path from "path";
import {
  TGXBinaryTexture,
  TGXGear,
  TGXGearAsset,
  TGXPlatedTexture,
  TGXTextureType
} from "../objects";
import { TGXLoader } from "../tgx";
import { dumpFile, getFile } from "./common";

const tmpPath = path.resolve("./temp");
const itemHashesPath = `${tmpPath}/destiny2/items.json`;
const loader = new TGXLoader();

export function getItemHashes(page: number = 0): Promise<number[]> {
  const itemHashes: number[] = [];
  return getFile(
    `https://lowlidev.com.au/destiny/api/search?count=300&direction=2&order=3&page=${page}&categories=1,20,39,42,43&destiny2`
  ).then((res: any) => {
    console.log("Found ", res.itemHashes.length, "items.");
    res.itemHashes.map((itemHash: number) => itemHashes.push(itemHash));
    if (res.hasMore) {
      return getItemHashes(page + 1).then((hashes: number[]) => {
        hashes.map(itemHash => itemHashes.push(itemHash));
        return itemHashes;
      });
    }
    return itemHashes;
  });
}

export function getItems(hashes: number[], offset = 0) {
  if (offset >= hashes.length) {
    return;
  }
  const itemHash = hashes[offset];

  // Skip items already dumped
  //   if (fs.existsSync(`${tmpPath}/destiny2/${itemHash}`)) {
  //     console.log("Skipped Item", itemHash);
  //     setTimeout(() => {
  //       loadItems(hashes, offset + 1);
  //     }, 100);
  //     return;
  //   }

  loader.getItem(itemHash).then(asset => {
    const content = asset.content;
    const gear = asset.gear;
    const geometryCount = content.map(item => item.geometry.length);
    const textureCount = content.map(item => item.textures.length);
    const defaultDyeCount = gear.map(item => item.data.default_dyes.length);
    const lockedDyeCount = gear.map(item => item.data.locked_dyes.length);
    const customDyeCount = gear.map(item => item.data.custom_dyes.length);
    const regionIndexes = content.map(item => {
      if (item.data.region_index_sets) {
        return Object.keys(item.data.region_index_sets);
      }
      const indexes = [];
      if (item.data.male_index_set) {
        indexes.push("m");
      }
      if (item.data.female_index_set) {
        indexes.push("f");
      }
      return indexes;
    });
    console.log(
      "Item",
      itemHash,
      "Geometry",
      geometryCount,
      "Textures",
      textureCount,
      "DefaultDyes",
      defaultDyeCount,
      "LockedDyes",
      lockedDyeCount,
      "CustomDyes",
      customDyeCount,
      "Regions",
      regionIndexes
    );
    dumpItem(asset);

    setTimeout(() => {
      getItems(hashes, offset + 1);
    }, 1000);
  });
}

export function dumpItem(asset: TGXGearAsset) {
  //console.log(asset);

  //   asset.gear.map((gear: TGXGear) => {
  //     const dyeTextures = gear.getDyeTextures();
  //     const geometryHashes = gear.getGeometryHashes();

  //     console.log("DyeTextures", dyeTextures);
  //     console.log("GeometryHashes", geometryHashes);
  //   });

  const gearAssetPath = `${tmpPath}/${asset.settings.game}/${asset.itemHash}`;
  dumpFile(`${gearAssetPath}/gear_asset.json`, asset.gearAsset);

  asset.gear.map((gear: TGXGear) => {
    dumpFile(`${gearAssetPath}/gear/${gear.name}`, gear.data);
  });

  asset.content.map(content => {
    content.geometry.map(geometry => {
      const geometryPath = `${gearAssetPath}/content/geometry/${
        geometry.data.reference_id
      }`;
      dumpFile(`${geometryPath}/${geometry.name}`, geometry.data.rawData, true);

      geometry.data.entries.map(entry => {
        dumpFile(`${geometryPath}/${entry.name}`, entry.data, true);
      });
    });

    content.textures.map(texture => {
      const texturePath = `${gearAssetPath}/content/textures`;
      switch (texture.type) {
        case TGXTextureType.Binary:
          const binaryTexture: TGXBinaryTexture = texture as TGXBinaryTexture;
          const binaryTexturePath = `${texturePath}/${
            binaryTexture.data.reference_id
          }`;
          dumpFile(
            `${binaryTexturePath}/${binaryTexture.name}`,
            binaryTexture.data.rawData,
            true
          );
          binaryTexture.data.entries.map(textureEntry => {
            dumpFile(
              `${binaryTexturePath}/${textureEntry.name}.png`,
              textureEntry.data,
              true
            );
          });
          break;
        case TGXTextureType.Plated:
          const platedTexture: TGXPlatedTexture = texture as TGXPlatedTexture;
          dumpFile(`${texturePath}/${platedTexture.name}`, platedTexture.data);
          break;
      }
    });
  });
}
