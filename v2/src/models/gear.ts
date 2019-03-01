export interface Gear {
  default_dyes: DyeAbstract[];
  locked_dyes: DyeAbstract[];
  custom_dyes: DyeAbstract[];
  reference_id: string;
  art_content?: ArtContentArrangement;
  art_content_sets?: ArtContentSet[];
}

export interface DyeAbstract {
  hash: number;
  investment_hash: number;
  slot_type_index: number;
  cloth: boolean;
  material_properties: DyeMaterialAbstract;
  textures: DyeTextures;
}

export interface DyeMaterialAbstract {}

// Destiny 1
export interface DyeLegacy extends DyeAbstract {
  variant: number;
  blend_mode: number;
  material_properties: DyeMaterialLegacy;
  textures: DyeTextures;
}

export interface DyeMaterialLegacy extends DyeMaterialAbstract {
  primary_color: number[]; // rgba
  secondary_color: number[]; // rgba
  detail_transform: number[]; // sx, sy, tx, ty
  detail_normal_contribution_strength: number[];
  decal_alpha_map_transform: number[];
  decal_blend_option: number;
  specular_properties: number[];
  subsurface_scattering_strength: number[];
}

// Destiny 2
export interface Dye extends DyeAbstract {
  material_properties: DyeMaterial;
}

export interface DyeMaterial extends DyeMaterialAbstract {
  detail_diffuse_transform: number[]; // sx, sy, tx, ty
  detail_normal_transform: number[]; // sx, sy, tx, ty
  spec_aa_xform: number[];
  emissive_tint_color_and_intensity_bias: number[];
  primary_emissive_tint_color_and_intensity_bias: number[];
  secondary_emissive_tint_color_and_intensity_bias: number[];
  specular_properties: number[];
  lobe_pbr_params: number[];
  tint_pbr_params: number[];
  emissive_pbr_params: number[];
  primary_albedo_tint: number[]; // rgba
  primary_material_params: number[];
  primary_material_advanced_params: number[];
  primary_roughness_remap: number[];
  secondary_albedo_tint: number[]; // rgba
  secondary_material_params: number[];
  secondary_material_advanced_params: number[];
  secondary_roughness_remap: number[];
  worn_albedo_tint: number[]; // rgba
  wear_remap: number[];
  worn_roughness_remap: number[];
  worn_material_parameters: number[];
  primary_worn_albedo_tint: number[];
  primary_wear_remap: number[];
  primary_worn_roughness_remap: number[];
  primary_worn_material_parameters: number[];
  secondary_worn_albedo_tint: number[];
  secondary_wear_remap: number[];
  secondary_worn_roughness_remap: number[];
  secondary_worn_material_parameters: number[];
  subsurface_scattering_strength_and_emissive: number[];
  primary_subsurface_scattering_strength_and_emissive: number[];
  secondary_subsurface_scattering_strength_and_emissive: number[];
}

export interface DyeTextures {
  diffuse: DyeTexture;
  normal: DyeTexture;
  decal?: DyeTexture;
  primary_diffuse: DyeTexture;
  secondary_diffuse: DyeTexture;
}

export interface DyeTexture {
  name: string;
  reference_id: string;
}

export interface ArtContentSet {
  classHash: number;
  arrangement: ArtContentArrangement;
}

export interface ArtContentArrangement {
  hash: number;
  gear_set: ArtContentGearSet;
}

export interface ArtContentGearSet {
  regions: ArtContentRegion[];
  base_art_arrangement: ArtContentPattern;
  female_override_art_arrangement: ArtContentPattern;
}

export interface ArtContentRegion {
  region_index: number;
  pattern_list: ArtContentPattern[];
}

export interface ArtContentPattern {
  hash: number;
  geometry_hashes?: string[];
}
