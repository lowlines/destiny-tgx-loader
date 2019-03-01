import { TGXBin } from "../models/tgxbin";

export enum TGXTextureType {
  Binary = "binary",
  Plated = "plated"
}

export class TGXTexture {
  public name: string;
  public type: string;
  public constructor(name: string) {
    this.name = name;
  }
}

export class TGXBinaryTexture extends TGXTexture {
  public data: TGXBin;
  public constructor(data: TGXBin, name: string) {
    super(name);
    this.data = data;
    this.type = TGXTextureType.Binary;
  }
}

export class TGXPlatedTexture extends TGXTexture {
  public data: Buffer;
  public constructor(data: Buffer, name: string) {
    super(name);
    this.type = TGXTextureType.Plated;
    this.data = data;
  }
}
