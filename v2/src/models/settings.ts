import { Game, Platform } from "./enums";

export interface TGXLoaderSettings {
  apiKey: string;
  apiBasepath: string;
  basepath: string;
  contentpath: string;
  platform: Platform;
  game: Game;
  isFemale: boolean;
  classHash: number;
}
