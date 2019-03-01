import { TGXBin } from "../models/tgxbin";

export class TGXGeometry {
  public name: string;
  public data: TGXBin;
  public constructor(data: TGXBin, name: string) {
    this.name = name;
    this.data = data;

    let metadata = null;
    const buffers = {};
    data.entries.map((entry, index) => {
      if (entry.name === "render_metadata.js") {
        metadata = JSON.parse(entry.data.toString());
      } else {
        buffers[entry.name] = entry;
      }
    });
  }
}
