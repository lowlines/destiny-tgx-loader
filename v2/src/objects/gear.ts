import {
  ArtContentArrangement,
  ArtContentGearSet,
  ArtContentPattern,
  ArtContentRegion,
  DyeAbstract,
  DyeTexture,
  Gear
} from "../models/gear";
import { TGXLoaderSettings } from "../models/settings";
import { getFile } from "../util/common";

interface FilteredArtContentArrangement extends ArtContentArrangement {
  class_hash: number;
}
interface FilteredArtContentRegion extends ArtContentRegion {
  class_hash: number;
  is_female: boolean;
  arrangement_hash: number;
}
interface FilteredArtContentPattern extends ArtContentPattern {
  class_hash: number;
  is_female: boolean;
  arrangement_hash: number;
  region_index: number;
}

export class TGXGear {
  public name: string;
  public data: Gear;
  public settings: TGXLoaderSettings;

  public constructor(name: string, settings: TGXLoaderSettings) {
    this.name = name;
    this.settings = settings;
  }

  public init(): Promise<TGXGear> {
    const gearUrl = `${this.settings.contentpath}/geometry/gear/${this.name}`;
    return getFile(gearUrl)
      .then(res => {
        this.data = res;
        return this;
      })
      .catch(e => {
        console.log("Failed:TGXGear", this.name);
        return this;
      });
  }

  public getDyeTextures(): DyeTexture[] {
    const dyes: DyeAbstract[] = [
      ...this.data.default_dyes,
      ...this.data.locked_dyes,
      ...this.data.custom_dyes
    ];

    const dyeTextures: DyeTexture[] = [];

    dyes.map(dye => {
      for (let textureId in dye.textures) {
        const dyeTexture: DyeTexture = dye.textures[textureId];
        if (dyeTextures.indexOf(dyeTexture) !== -1) {
          continue;
        }
        dyeTextures.push(dyeTexture);
      }
    });

    return dyeTextures;
  }

  public getArtContent(
    classHash: number = 0,
    isFemale: boolean = false
  ): FilteredArtContentArrangement[] {
    let arrangements: FilteredArtContentArrangement[] = [];
    if (this.data.art_content) {
      arrangements = [{ ...this.data.art_content, class_hash: 0 }];
    }
    if (this.data.art_content_sets) {
      // Filter by classHash
      if (this.data.art_content_sets.length > 1 && classHash) {
        for (let i = 0; i < this.data.art_content_sets.length; i++) {
          const artContentSet = this.data.art_content_sets[i];
          if (artContentSet.classHash === classHash) {
            arrangements = [
              { ...artContentSet.arrangement, class_hash: classHash }
            ];
            break;
          }
        }
      }
      // Return all arrangements
      if (arrangements.length === 0) {
        arrangements = this.data.art_content_sets.map(artContentSet => {
          return { ...artContentSet.arrangement, class_hash: 0 };
        });
      }
    }

    return arrangements;
  }

  public getArtRegions(
    classHash: number = 0,
    isFemale: boolean = false
  ): FilteredArtContentRegion[] {
    const arrangements = this.getArtContent(classHash, isFemale);

    const regions: FilteredArtContentRegion[] = [];

    arrangements.map(arrangement => {
      const gearSet: ArtContentGearSet = arrangement.gear_set;
      if (gearSet.regions.length > 0) {
        gearSet.regions.map(region => {
          regions.push({
            ...region,
            class_hash: arrangement.class_hash,
            arrangement_hash: arrangement.hash,
            is_female: false
          });
        });
      } else {
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
  }

  public getArtContentPatterns(
    classHash: number = 0,
    isFemale: boolean = false
  ): FilteredArtContentPattern[] {
    const patterns: FilteredArtContentPattern[] = [];
    const regions: FilteredArtContentRegion[] = this.getArtRegions(
      classHash,
      isFemale
    );
    regions.map(region => {
      if (region.pattern_list.length > 1) {
        console.warn(
          "MultiPatternRegion",
          this.name,
          region.arrangement_hash,
          region.region_index
        );
      }

      region.pattern_list.map(pattern => {
        patterns.push({
          ...pattern,
          class_hash: region.class_hash,
          arrangement_hash: region.arrangement_hash,
          is_female: region.is_female,
          region_index: region.region_index
        });
      });
    });
    return patterns;
  }

  public getGeometryHashes(classHash = 0, isFemale: boolean = false): string[] {
    const geometryHashes = [];

    const patterns: FilteredArtContentPattern[] = this.getArtContentPatterns(
      classHash,
      isFemale
    );

    patterns.map(pattern => {
      pattern.geometry_hashes.map(geometryHash => {
        if (geometryHashes.indexOf(geometryHash) === -1) {
          geometryHashes.push(geometryHash);
        }
      });
    });

    return geometryHashes;
  }
}
