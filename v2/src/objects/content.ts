import { GearAssetContent } from "../models/definition";
import { TGXLoaderSettings } from "../models/settings";
import { TGXBin } from "../models/tgxbin";
import { TGXGeometry } from "../objects/geometry";
import { getFile } from "../util/common";
import { TGXBinaryTexture, TGXPlatedTexture, TGXTexture } from "./texture";

export class TGXContent {
  public data: GearAssetContent;
  public settings: TGXLoaderSettings;
  public geometry: TGXGeometry[];
  public textures: TGXTexture[];

  public constructor(data: GearAssetContent, settings: TGXLoaderSettings) {
    this.data = data;
    this.settings = settings;
  }

  public init(): Promise<TGXContent> {
    const content = this.data;
    return Promise.all([
      Promise.all(content.geometry.map(name => this.getGeometry(name))),
      Promise.all(content.textures.map(texture => this.getTexture(texture)))
    ]).then(res => {
      const geometry: TGXGeometry[] = res[0];
      const textures: TGXTexture[] = res[1];
      this.geometry = geometry;
      this.textures = textures;

      return this;
    });
  }

  private getGeometry(geometry: string): Promise<TGXGeometry | null> {
    return this.getTGXBin(
      `${this.settings.contentpath}/geometry/platform/${
        this.settings.platform
      }/geometry/${geometry}`
    )
      .then(res => {
        return new TGXGeometry(res, geometry);
      })
      .catch(e => {
        console.log("Failed:TGXGeometry", geometry);
        return null;
      });
  }

  private getTexture(
    texture: string,
    isPlated: boolean = false
  ): Promise<TGXTexture> {
    const textureType = isPlated ? "plated_textures" : "textures";
    const textureUrl = `${this.settings.contentpath}/geometry/platform/${
      this.settings.platform
    }/${textureType}/${texture}`;

    if (texture.indexOf(".bin") != -1) {
      return this.getTGXBin(textureUrl)
        .then(res => new TGXBinaryTexture(res, texture))
        .catch(e => {
          console.log("Failed:TGXTexture", texture);
          return null;
        });
    }
    // Return already plated texture
    return getFile(textureUrl, false)
      .then(res => new TGXPlatedTexture(res, texture))
      .catch(e => {
        console.log("Failed:TGXPlatedTexture", texture);
        return null;
      });
  }

  private async getTGXBin(url: string): Promise<TGXBin> {
    return getFile(url, false).then(res => {
      const data = Buffer.from(res);

      const magic = data.slice(0, 0x4).toString(); // TGXM
      const version = data.readUInt32LE(0x4);
      const entryOffset = data.readUInt32LE(0x8);
      const entryCount = data.readUInt32LE(0xc);
      const referenceId = data
        .slice(0x10, 0x100)
        .toString()
        .split("\u0000")[0];

      const entries = [];

      // console.log(magic, referenceId, url.slice(url.lastIndexOf("/") + 1));

      for (let i = 0; i < entryCount; i++) {
        const fileOffset = entryOffset + 0x110 * i;
        const name = data
          .slice(fileOffset, fileOffset + 0x100)
          .toString()
          .split("\u0000")[0];
        const dataOffset = data.readUInt32LE(fileOffset + 0x100); // uint64
        const dataSize = data.readUInt32LE(fileOffset + 0x108); // uint64
        const fileData = data.slice(dataOffset, dataOffset + dataSize);
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
    });
  }
}
