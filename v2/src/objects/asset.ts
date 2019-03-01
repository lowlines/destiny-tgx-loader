import { GearAssetDefinition } from "../models/definition";
import { TGXLoaderSettings } from "../models/settings";
import { TGXContent } from "./content";
import { TGXGear } from "./gear";

export class TGXGearAsset {
  public itemHash: number;
  public settings: TGXLoaderSettings;
  public gearAsset: GearAssetDefinition;
  public gear: TGXGear[];
  public content: TGXContent[];

  public constructor(
    itemHash: number,
    settings: TGXLoaderSettings,
    gearAsset: GearAssetDefinition,
    gear: TGXGear[],
    content: TGXContent[]
  ) {
    this.itemHash = itemHash;
    this.settings = settings;
    this.gearAsset = gearAsset;
    this.gear = gear;
    this.content = content;
  }
}
