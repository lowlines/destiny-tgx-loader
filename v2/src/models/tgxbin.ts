export interface TGXBin {
  magic: string; // char[4] TGXM
  version: number; // uint32
  entry_offset: number; // uint32
  entry_count: number; // uint32
  reference_id: string; // char[0x100]
  //
  entries: TGXBinEntry[];

  rawData: Buffer;
}

export interface TGXBinEntry {
  name: string; // char[0x100]
  offset: number; // uint64
  size: number; // uint64
  data: any;
}
