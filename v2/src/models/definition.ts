import { Platform } from "./enums";

export interface GearAssetResponse {
  requestedId: string; // itemHash
  gearAsset: GearAssetDefinition;
}

export interface GearAssetDefinition {
  gear: string[]; // json
  content: GearAssetContent[];
}

export interface GearAssetContent {
  platform: Platform;
  geometry: string[];
  textures: string[];
  plate_regions?: string[]; // png/jpg Pre-plated textures for web
  dye_index_set?: IndexSet;
  region_index_sets: { [key: string]: IndexSet[] };
  female_index_set?: IndexSet;
  male_index_set?: IndexSet;
}

export interface IndexSet {
  textures: number[]; // tgxm.bin
  geometry: number[]; // tgxm
  shaders?: number[];
}
