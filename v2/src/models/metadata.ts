import { PrimitiveType } from "./enums";

export interface RenderMetadata {
  render_model: RenderModel;
  texture_plates: RenderTexturePlate[];
}

export interface RenderModel {
  render_meshes: RenderMesh[];
}

export interface RenderMesh {
  bounding_volume: BoundingVolume;
  index_buffer: IndexBuffer;
  position_offset: number[]; // xyz
  position_scale: number[]; // xyz
  stage_part_list: StagePart;
  stage_part_offsets: number[];
  stage_part_vertex_stream_layout_definitions: VertexStreamLayoutDefinition[];
  stage_part_vertex_stream_layout_lookup: number[];
  texcoord0_scale_offset: number[]; // sx, sy, tx, ty
  texcoord_offset: number[]; // tx, ty
  texcoord_scale: number[]; // sx, sy
  vertex_buffers: VertexBuffer[];
}

export interface BoundingVolume {
  min_x: number;
  max_x: number;
  min_y: number;
  max_y: number;
  min_z: number;
  max_z: number;
}

export interface IndexBuffer {
  file_name: string;
  byte_size: number;
  value_byte_size: number;
}

export interface StagePart {
  external_identifier: number;
  flags: number;
  gear_dye_change_color_index: number;
  index_count: number;
  index_max: number;
  index_min: number;
  lod_category: LodCategory;
  lod_run: number;
  primitive_type: PrimitiveType;
  shader: StagePartShader;
  start_index: number;
  variant_shader_index: number;
}

export interface LodCategory {
  value: number;
  name: string;
}

export interface StagePartShader {
  static_textures: string[];
  type: number;
}

export interface VertexStreamLayoutDefinition {
  type: string;
  formats: VertexStreamLayoutFormat[];
}

export interface VertexStreamLayoutFormat {
  stride: number;
  elements: VertexStreamLayoutElement[];
}

export interface VertexStreamLayoutElement {
  offset: number;
  semantic: string;
  sementic_index: number;
  size: number;
  type: string;
  normalized: boolean;
}

export interface VertexBuffer {
  file_name: string;
  byte_size: number;
  stride_byte_size: number;
}

export interface RenderTexturePlate {
  gear_decal_dye_index: number;
  gear_slot_requires_plating: boolean;
  number_of_gear_slots: number;
  number_of_plateable_gear_slots: number;
  plate_set: TexturePlateSet;
}

export interface TexturePlateSet {
  diffuse: TexturePlate;
  gearstack: TexturePlate;
  normal: TexturePlate;
}

export interface TexturePlate {
  plate_index: number;
  plate_size: number[]; // width, height
  reference_id: string;
  texture_placements: TexturePlacement[];
}

export interface TexturePlacement {
  texture_size_x: number;
  texture_size_y: number;
  position_x: number;
  position_y: number;
  texture_tag_name: string;
}
