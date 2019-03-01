import {
  GearAssetContent,
  GearAssetDefinition,
  GearAssetResponse
} from "./models/definition";
import { Game, Platform } from "./models/enums";
import { TGXLoaderSettings } from "./models/settings";
import { TGXGearAsset } from "./objects/asset";
import { TGXContent } from "./objects/content";
import { TGXGear } from "./objects/gear";
import { getFile } from "./util/common";

const DefaultTGXLoaderSettings: TGXLoaderSettings = {
  apiBasepath: "https://www.bungie.net/Platform/Destiny2",
  apiKey: "",
  basepath: "https://www.bungie.net",
  contentpath: "",
  game: Game.Destiny2,
  platform: Platform.mobile,
  classHash: 0,
  isFemale: false
};

export class TGXLoader {
  private settings: TGXLoaderSettings;
  public constructor(settings?: TGXLoaderSettings) {
    if (!settings) {
      settings = DefaultTGXLoaderSettings;
    }
    settings.contentpath =
      settings.basepath + "/common/" + settings.game + "_content";
    this.settings = settings;
  }

  public getItem(itemHash: number): Promise<TGXGearAsset | null> {
    // console.log("Item", itemHash);

    const gearAssetUrl = `https://lowlidev.com.au/destiny/api/gearasset/${itemHash}?${
      this.settings.game
    }`;

    return getFile(gearAssetUrl)
      .then((res: GearAssetResponse) => {
        const gearAsset: GearAssetDefinition = res.gearAsset;
        // console.log(
        //   "GearAsset",
        //   res.requestedId,
        //   "Gear",
        //   gearAsset.gear.length,
        //   "Content",
        //   gearAsset.content.length
        // );

        return Promise.all([
          Promise.all(
            gearAsset.gear.map((name: string, index: number) => {
              // console.log("Gear[" + index + "]", name);
              return new TGXGear(name, { ...this.settings }).init();
            })
          ),
          Promise.all(
            gearAsset.content.map(
              (content: GearAssetContent, index: number) => {
                // console.log("Content[" + index + "]");
                return new TGXContent(content, { ...this.settings }).init();
              }
            )
          )
        ]).then(result => {
          const gear: TGXGear[] = result[0];
          const content: TGXContent[] = result[1];

          return new TGXGearAsset(
            itemHash,
            { ...this.settings },
            gearAsset,
            gear,
            content
          );
        });
      })
      .catch(e => {
        console.log("FailedToLoad", itemHash);
        return null;
      });
  }
}
