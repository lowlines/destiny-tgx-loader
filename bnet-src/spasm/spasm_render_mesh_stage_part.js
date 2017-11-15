// spasm_render_mesh_stage_part.js

var Spasm = Spasm || {};

Spasm.RenderMeshStagePart = function (stagePart)
{
	Spasm.assertValid(stagePart);

	this.stagePart = stagePart;

	var shader = stagePart.shader;
	var staticTextures = shader ? shader.static_textures : null;
	var staticTextureCount = staticTextures && staticTextures.length ? staticTextures.length : 0;

	this.shader = shader;
	this.staticTextures = staticTextures;
	this.staticTextureCount = staticTextureCount;

	this.startIndex = stagePart.start_index;
	this.indexCount = stagePart.index_count;
	this.indexMin = stagePart.index_min;
	this.indexMax = stagePart.index_max;

	this.flags = stagePart.flags;
	this.gearDyeChangeColorIndex = stagePart.gear_dye_change_color_index;

    this.externalIdentifier = stagePart.external_identifier;

	this.primitiveType = stagePart.primitive_type;
	this.lodCategory = stagePart.lod_category;
	this.lodRun = stagePart.lod_run;
};

Spasm.RenderMeshStagePart.prototype = {};
