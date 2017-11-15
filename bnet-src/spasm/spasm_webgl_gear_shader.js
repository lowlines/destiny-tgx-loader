// spasm_webgl_gear_shader.js

var Spasm = Spasm || {};

Spasm.GearShader = function(gl)
{
	Spasm.assertWebGLContext(gl);

	this.gl = gl;

	var inputTypes = Spasm.Shader.InputTypes;
	var valueTypes = Spasm.Shader.ValueTypes;

	this.uniforms =
	{
		projectionMatrix : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.mat4, "u_projection_matrix"),
		modelMatrix : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.mat4, "u_model_matrix"),
		viewMatrix : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.mat4, "u_view_matrix"),

		positionScale : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec3, "u_position_scale"),
		positionOffset : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec3, "u_position_offset"),

		texcoordScale : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec2, "u_texcoord_scale"),
		texcoordOffset : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec2, "u_texcoord_offset"),

		skinningMatrices : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec4, "u_skinning_matrices", 72 * 3),

		textureDiffuse : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.sampler2D, "u_texture_diffuse"),
		textureNormal : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.sampler2D, "u_texture_normal"),
		textureGearstack : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.sampler2D, "u_texture_gearstack"),

		textureDyeDiffuse : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.sampler2D, "u_texture_dye_diffuse"),
		textureDyeNormal : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.sampler2D, "u_texture_dye_normal"),
		// textureDyeDecal : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.sampler2D, "u_texture_dye_decal"),

		blendModeUniform : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.int, "u_blend_mode"),

		changeColor : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec4, "u_change_color"),

		decalAlphaMapTransform : new Spasm.ShaderInput(inputTypes.uniform,
													   valueTypes.vec4,
													   "u_decal_alpha_map_transform"),
		decalBlendOption : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.int, "u_decal_blend_option"),

		detailNormalContributionStrength : new Spasm.ShaderInput(inputTypes.uniform,
																 valueTypes.vec4,
																 "u_detail_normal_contribution_strength"),
		detailTransform : new Spasm.ShaderInput(inputTypes.uniform,
												valueTypes.vec4,
												"u_detail_transform"),

		specularProperties : new Spasm.ShaderInput(inputTypes.uniform,
												   valueTypes.vec4,
												   "u_specular_properties"),
		subsurfaceScatteringStrength : new Spasm.ShaderInput(inputTypes.uniform,
															 valueTypes.vec4,
															 "u_subsurface_scattering_strength"),

		cameraPosition : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec3, "u_camera_position"),
		lightPosition : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec3, "u_light_position"),
		mutedColorDiffuse : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec4, "u_muted_color_diffuse")
	};

	this.attributes =
	{
		position : new Spasm.ShaderInput(inputTypes.attribute, valueTypes.vec4, "a_position"),
		normal : new Spasm.ShaderInput(inputTypes.attribute, valueTypes.vec4, "a_normal"),
		tangent : new Spasm.ShaderInput(inputTypes.attribute, valueTypes.vec4, "a_tangent"),

		texcoord : new Spasm.ShaderInput(inputTypes.attribute, valueTypes.vec2, "a_texcoord"),
		texcoord1 : new Spasm.ShaderInput(inputTypes.attribute, valueTypes.vec2, "a_texcoord1"),
		texcoord2 : new Spasm.ShaderInput(inputTypes.attribute, valueTypes.vec2, "a_texcoord2"),

		blendIndices : new Spasm.ShaderInput(inputTypes.attribute, valueTypes.vec4, "a_blendindices"),
		blendWeights : new Spasm.ShaderInput(inputTypes.attribute, valueTypes.vec4, "a_blendweight")
	};

	this.varyings =
	{
		position : new Spasm.ShaderInput(inputTypes.varying, valueTypes.vec3, "v_position"),
		normal : new Spasm.ShaderInput(inputTypes.varying, valueTypes.vec3, "v_normal"),
		binormal : new Spasm.ShaderInput(inputTypes.varying, valueTypes.vec3, "v_binormal"),
		tangent : new Spasm.ShaderInput(inputTypes.varying, valueTypes.vec3, "v_tangent"),

		texcoord : new Spasm.ShaderInput(inputTypes.varying, valueTypes.vec2, "v_texcoord"),
		texcoord2 : new Spasm.ShaderInput(inputTypes.varying, valueTypes.vec2, "v_texcoord2")
	};

	this.vertexShaders = {};
	this.vertexShaderInputs = {};

	this.fragmentShaders = {};
	this.fragmentShaderInputs = {};

	this.shaderPrograms = {};
	this.uniformDatas = {};
};

Spasm.GearShader.prototype = {};

Spasm.GearShader.prototype.getVertexShaderSourceLines = function(hasBlendIndices,
																 hasBlendWeights,
																 hasGearDyeTextures)
{
	// var vertexShaderKey = this.getVertexShaderKey(hasBlendIndices, hasBlendWeights, hasGearDyeTextures);
	var vertexShaderInputs = this.getVertexShaderInput(hasBlendIndices,
													   hasBlendWeights,
													   hasGearDyeTextures);

	var lines = [];

	// header
	// lines.push("// Spasm.GearShader vertex shader");
	// lines.push("// " + vertexShaderKey);
	// lines.push("");

	// precision
	lines.push("precision mediump float;");
	lines.push("");

	// inputs
	var vertexShaderInputCount = vertexShaderInputs.length;
	for (var vertexShaderInputIndex = 0;
		 vertexShaderInputIndex < vertexShaderInputCount;
		 vertexShaderInputIndex++)
	{
		var vertexShaderInput = vertexShaderInputs[vertexShaderInputIndex];
		lines.push(vertexShaderInput.declaration);
	}
	lines.push("");

	// functions
	lines.push("mat4 transpose(mat4 inMatrix) {" +
			   "vec4 i0 = inMatrix[0];" +
			   "vec4 i1 = inMatrix[1];" +
			   "vec4 i2 = inMatrix[2];" +
			   "vec4 i3 = inMatrix[3];" +

			   "mat4 outMatrix = mat4(" +
			   "vec4(i0.x, i1.x, i2.x, i3.x)," +
			   "vec4(i0.y, i1.y, i2.y, i3.y)," +
			   "vec4(i0.z, i1.z, i2.z, i3.z)," +
			   "vec4(i0.w, i1.w, i2.w, i3.w)" + ");" +
			   "return outMatrix;" + "}");

	lines.push("mat4 get_bone_transform(int bone_index)");
	lines.push("{");
	lines.push("int stride_bone_index = bone_index * 3;");
	lines.push("vec4 i0 = u_skinning_matrices[stride_bone_index + 0];" +
			   "vec4 i1 = u_skinning_matrices[stride_bone_index + 1];" +
			   "vec4 i2 = u_skinning_matrices[stride_bone_index + 2];" +
			   "vec4 i3 = vec4(0.0, 0.0, 0.0, 1.0);");

	lines.push("mat4 bone_transform = mat4(" +
			   "vec4(i0.x, i1.x, i2.x, i3.x)," +
			   "vec4(i0.y, i1.y, i2.y, i3.y)," +
			   "vec4(i0.z, i1.z, i2.z, i3.z)," +
			   "vec4(i0.w, i1.w, i2.w, i3.w));" +
			   "return bone_transform;");

	lines.push("}");
	lines.push("");

	// begin main
	lines.push("void main()");
	lines.push("{");

	// begin skinning
	if (hasBlendIndices)
	{
		lines.push("ivec4 blend_indices = ivec4(a_blendindices);");
		if (hasBlendWeights)
		{
			// up to four bones
			lines.push("mat4 skinning_transform = (get_bone_transform(blend_indices[0]) * a_blendweight[0]);");
			lines.push("skinning_transform += (get_bone_transform(blend_indices[1]) * a_blendweight[1]);");
			lines.push("skinning_transform += (get_bone_transform(blend_indices[2]) * a_blendweight[2]);");
			lines.push("skinning_transform += (get_bone_transform(blend_indices[3]) * a_blendweight[3]);");
		}
		else
		{
			// up to two bones
			lines.push("vec2 blend_weight = vec2(a_blendindices.zw)/255.0;");
			lines.push("mat4 skinning_transform = get_bone_transform(blend_indices[0]) * blend_weight[0];");
			lines.push("skinning_transform += get_bone_transform(blend_indices[1]) * blend_weight[1];");
		}
	}
	else
	{
		// one bone
		lines.push("int bone_index = int((a_position.w * 32767.0) + 0.01);");
		lines.push("mat4 skinning_transform = get_bone_transform(bone_index);");
	}

	// transforms
	lines.push("mat4 model_view_matrix = u_view_matrix * u_model_matrix;");
	lines.push("mat4 camera_matrix = u_projection_matrix * model_view_matrix;");

	lines.push("vec4 position_transformed = vec4(" +
			   "(a_position.x * u_position_scale.x) + u_position_offset.x," +
			   "(a_position.y * u_position_scale.y) + u_position_offset.y," +
			   "(a_position.z * u_position_scale.z) + u_position_offset.z," +
			   "1.0);");

	lines.push("vec4 position_skinned = vec4((skinning_transform * position_transformed).xyz, 1.0);");

	lines.push("mat3 skinning_rotation_transform = mat3(skinning_transform);");

	lines.push("mat3 model_view_rotation_transform = mat3(model_view_matrix);");

	lines.push("vec3 object_space_normal = vec3(a_normal.xyz);");
	lines.push("vec3 object_space_tangent = vec3(a_tangent.xyz);");
	lines.push("vec3 object_space_binormal = vec3(cross(object_space_normal, object_space_tangent)" +
			   " * a_tangent.w);");

	lines.push("mat3 normal_transform = skinning_rotation_transform;");
	lines.push("v_normal = model_view_rotation_transform * (skinning_rotation_transform * object_space_normal);");
	lines.push("v_tangent = model_view_rotation_transform * (skinning_rotation_transform * object_space_tangent);");
	lines.push("v_binormal = model_view_rotation_transform * (skinning_rotation_transform * object_space_binormal);");

	lines.push("vec2 texcoord = vec2(" +
			   "(a_texcoord.x * u_texcoord_scale.x) + u_texcoord_offset.x," +
			   "(a_texcoord.y * u_texcoord_scale.y) + u_texcoord_offset.y);");

	// varyings
	lines.push("v_position = (model_view_matrix * position_skinned).xyz;");

	lines.push("v_texcoord = texcoord;");
	// if (hasGearDyeTextures)
	{
		lines.push("v_texcoord2 = ((texcoord * a_texcoord2) * u_detail_transform.xy) + u_detail_transform.zw;");
	}

	// set position
	lines.push("gl_Position = camera_matrix * position_skinned;");

	// end main
	lines.push("}");
	lines.push("");

	return lines;
};

Spasm.GearShader.prototype.getVertexShaderInput = function(hasBlendIndices,
														   hasBlendWeights,
														   hasGearDyeTextures)
{
	var vertexShaderKey = this.getVertexShaderKey(hasBlendIndices,
												  hasBlendWeights,
												  hasGearDyeTextures);

	var vertexShaderInputs = this.vertexShaderInputs;
	var vertexShaderInput = vertexShaderInputs[vertexShaderKey];
	if (!vertexShaderInput)
	{
		var uniforms = this.uniforms;
		var attributes = this.attributes;
		var varyings = this.varyings;

		vertexShaderInput = [];
		vertexShaderInput.push(uniforms.projectionMatrix);
		vertexShaderInput.push(uniforms.modelMatrix);
		vertexShaderInput.push(uniforms.viewMatrix);

		vertexShaderInput.push(uniforms.skinningMatrices);

		vertexShaderInput.push(uniforms.positionScale);
		vertexShaderInput.push(uniforms.positionOffset);

		vertexShaderInput.push(uniforms.texcoordScale);
		vertexShaderInput.push(uniforms.texcoordOffset);

		vertexShaderInput.push(attributes.position);
		vertexShaderInput.push(attributes.normal);
		vertexShaderInput.push(attributes.tangent);

		vertexShaderInput.push(attributes.texcoord);

		// if (hasGearDyeTextures)
		{
			vertexShaderInput.push(uniforms.detailTransform);
			vertexShaderInput.push(attributes.texcoord2);
		}

		if (hasBlendIndices)
		{
			vertexShaderInput.push(attributes.blendIndices);
			if (hasBlendWeights)
			{
				vertexShaderInput.push(attributes.blendWeights);
			}
		}

		vertexShaderInput.push(varyings.position);
		vertexShaderInput.push(varyings.normal);
		vertexShaderInput.push(varyings.binormal);
		vertexShaderInput.push(varyings.tangent);
		vertexShaderInput.push(varyings.texcoord);

		// if (hasGearDyeTextures)
		{
			vertexShaderInput.push(varyings.texcoord2);
		}

		vertexShaderInputs[vertexShaderKey] = vertexShaderInput;
	}

	return vertexShaderInput;
};

Spasm.GearShader.prototype.getFragmentShaderInput = function(hasGearDyeTextures, ignoresTextures)
{
	var fragmentShaderKey = this.getFragmentShaderKey(hasGearDyeTextures, ignoresTextures);

	var fragmentShaderInputs = this.fragmentShaderInputs;
	var fragmentShaderInput = fragmentShaderInputs[fragmentShaderKey];
	if (!fragmentShaderInput)
	{
		var uniforms = this.uniforms;
		var varyings = this.varyings;

		fragmentShaderInput = [];

		if (ignoresTextures)
		{
			fragmentShaderInput.push(uniforms.mutedColorDiffuse);
		}

		fragmentShaderInput.push(uniforms.textureDiffuse);
		fragmentShaderInput.push(uniforms.textureNormal);
		fragmentShaderInput.push(uniforms.textureGearstack);

		fragmentShaderInput.push(uniforms.changeColor);

		fragmentShaderInput.push(uniforms.cameraPosition);
		fragmentShaderInput.push(uniforms.lightPosition);

		fragmentShaderInput.push(varyings.position);
		fragmentShaderInput.push(varyings.normal);
		fragmentShaderInput.push(varyings.binormal);
		fragmentShaderInput.push(varyings.tangent);
		fragmentShaderInput.push(varyings.texcoord);

		// if (hasGearDyeTextures)
		{
			fragmentShaderInput.push(uniforms.textureDyeDiffuse);
			fragmentShaderInput.push(uniforms.textureDyeNormal);
			// fragmentShaderInput.push(uniforms.textureDyeDecal);

			fragmentShaderInput.push(varyings.texcoord2);
		}

		fragmentShaderInputs[fragmentShaderKey] = fragmentShaderInput;
	}

	return fragmentShaderInput;
};

Spasm.GearShader.prototype.getFragmentShaderSourceLines = function(hasGearDyeTextures, ignoresTextures)
{
	// var fragmentShaderKey = this.getFragmentShaderKey(hasGearDyeTextures, ignoresTextures);
	var fragmentShaderInputs = this.getFragmentShaderInput(hasGearDyeTextures, ignoresTextures);

	var lines = [];

	// header
	// lines.push("// Spasm.GearShader fragment shader");
	// lines.push("// " + fragmentShaderKey);
	// lines.push("");

	// precision
	lines.push("precision mediump float;");
	lines.push("");

	// inputs
	var fragmentShaderInputCount = fragmentShaderInputs.length;
	for (var fragmentShaderInputIndex = 0;
		 fragmentShaderInputIndex < fragmentShaderInputCount;
		 fragmentShaderInputIndex++)
	{
		var fragmentShaderInput = fragmentShaderInputs[fragmentShaderInputIndex];
		lines.push(fragmentShaderInput.declaration);
	}
	lines.push("");

	// defines
	lines.push("#define saturate(value) clamp(value, 0.0, 1.0)");

	// constants
	lines.push("const float gamma_correction_power = 2.2;");
	lines.push("const float gamma_correction_power_inverse = 1.0/2.2;");

	// functions
	lines.push("vec4 blend_overlay(vec4 back, vec4 front)");
	lines.push("{");
	lines.push("return front * saturate(back * 4.0) + saturate(back - 0.25);");
	lines.push("}");
	lines.push("");

	// main function
	lines.push("void main()");
	lines.push("{");

	lines.push("vec4 color_diffuse = pow(texture2D(u_texture_diffuse, v_texcoord), "
			   + "vec4(gamma_correction_power));");
	// lines.push("vec4 color_diffuse_texture = color_diffuse;");

	lines.push("vec2 normal_sample_raw = texture2D(u_texture_normal, v_texcoord).xy;");
	lines.push("vec2 normal_sample = normal_sample_raw;");
	lines.push("vec3 tangent_world_space = normalize(v_tangent);");
	lines.push("vec3 binormal_world_space = normalize(v_binormal);");
	lines.push("vec3 normal_world_space = normalize(v_normal);");
	lines.push("normal_sample = normal_sample * 2.0 - 1.0;");

	// if (hasGearDyeTextures)
	{
		lines.push("vec4 color_dye_diffuse_texture = texture2D(u_texture_dye_diffuse, v_texcoord2);");

		lines.push("float dye_alpha = color_dye_diffuse_texture.w;");
		lines.push("float dye_color_normalize = (1.0 - dye_alpha) * 0.5;");

		lines.push("vec4 color_dye_diffuse = pow(vec4("
				   + "color_dye_diffuse_texture.x * dye_alpha + dye_color_normalize, "
				   + "color_dye_diffuse_texture.y * dye_alpha + dye_color_normalize, "
				   + "color_dye_diffuse_texture.z * dye_alpha + dye_color_normalize, "
				   + "1.0), vec4(gamma_correction_power));");

		lines.push("color_diffuse = blend_overlay(color_dye_diffuse, color_diffuse);");

		lines.push("vec4 color_dye_normal = texture2D(u_texture_dye_normal, v_texcoord2);");
		// lines.push("vec4 color_dye_decal = texture2D(u_texture_dye_decal, v_texcoord2);");

		lines.push("color_dye_normal = color_dye_normal * 2.0 - 1.0;");
		lines.push("normal_sample = normal_sample + color_dye_normal.xy;");
	}

	lines.push("vec4 color_gearstack = texture2D(u_texture_gearstack, v_texcoord);");

	// $TODO $HACK discard fragments with gearstack blue channel less than 0.1
	// seems to work reasonably well for armor, does not work for weapons
	// lines.push("if(color_gearstack.b < 0.1)");
	// lines.push("{");
	// lines.push("discard;");
	// lines.push("}");

	if (ignoresTextures)
	{
		lines.push("color_diffuse = u_muted_color_diffuse; // vec4(0.447, 0.498, 0.465, 1.0);");
		lines.push("color_gearstack.r = 0.0; // = vec4(0.3, 0.3, 0.3, 1.0);");
	}

	lines.push("float z = sqrt(saturate(1.0 - dot(normal_sample, normal_sample)));");
	lines.push("vec3 normal_tangent_space = vec3(normal_sample.x, normal_sample.y, z);");
	lines.push("vec3 bumpy_normal = (tangent_world_space * normal_tangent_space.x)"
			   + " + (binormal_world_space * normal_tangent_space.y)"
			   + " + (normal_world_space * normal_tangent_space.z);");

	lines.push("vec3 camera_direction = normalize(u_camera_position - v_position);");

	lines.push("float nDotL = saturate(dot(camera_direction, bumpy_normal)"
			   + " * (-1.0 + 2.0 * float(gl_FrontFacing)));");

	lines.push("vec3 reflection = (bumpy_normal * (nDotL * 2.00)) - camera_direction;");
	lines.push("float rDotV = max(0.0, dot(reflection, camera_direction));");
	lines.push("vec3 specular = saturate(vec3(0.2,0.2,0.2) * pow(rDotV, color_gearstack.g * 255.0))"
			   + " * color_gearstack.g;");

	lines.push("vec4 blend_color_uncorrected = mix(color_diffuse,"
			   + "blend_overlay(color_diffuse, u_change_color),"
			   + "color_gearstack.r);");
	lines.push("vec3 blend_color = pow(blend_color_uncorrected.xyz, vec3(gamma_correction_power_inverse));");

	lines.push("vec3 ambient_color = 0.60 * blend_color;");
	lines.push("vec3 diffuse_color = 0.40 * (nDotL * blend_color);");

	lines.push("gl_FragColor = vec4(ambient_color + diffuse_color + specular, 1.0);");

	// end main
	lines.push("}");
	lines.push("");

	return lines;
};

Spasm.GearShader.prototype.getShaderProgramKey = function(hasBlendIndices,
														  hasBlendWeights,
														  hasGearDyeTextures,
														  ignoresTextures)
{
	Spasm.assertBoolean(hasBlendIndices);
	Spasm.assertBoolean(hasBlendWeights);
	Spasm.assertBoolean(hasGearDyeTextures);
	Spasm.assertBoolean(ignoresTextures);

	Spasm.assert(hasBlendWeights ? hasBlendIndices : true);

	var shaderProgramKey = JSON.stringify(
		{
			vertexShader : this.getVertexShaderKey(hasBlendIndices, hasBlendWeights, hasGearDyeTextures),
			fragmentShader : this.getFragmentShaderKey(hasGearDyeTextures, ignoresTextures)
		});

	return shaderProgramKey;
};

Spasm.GearShader.prototype.getVertexShaderKey = function(hasBlendIndices,
														 hasBlendWeights,
														 hasGearDyeTextures)
{
	Spasm.assertBoolean(hasBlendIndices);
	Spasm.assertBoolean(hasBlendWeights);
	Spasm.assertBoolean(hasGearDyeTextures);

	Spasm.assert(hasBlendWeights ? hasBlendIndices : true);

	var vertexShaderKeyObject =
		{
			hasBlendWeights : hasBlendWeights,
			hasBlendIndices : hasBlendIndices
			// hasGearDyeTextures : hasGearDyeTextures
		};

	var vertexShaderKey = JSON.stringify(vertexShaderKeyObject);

	return vertexShaderKey;
};

Spasm.GearShader.prototype.getFragmentShaderKey = function(hasGearDyeTextures, ignoresTextures)
{
	Spasm.assertBoolean(hasGearDyeTextures);
	Spasm.assertBoolean(ignoresTextures);

	var fragmentShaderKeyObject =
		{
			// hasGearDyeTextures : hasGearDyeTextures,
			ignoresTextures : ignoresTextures
		};

	var fragmentShaderKey = JSON.stringify(fragmentShaderKeyObject);

	return fragmentShaderKey;
};

Spasm.GearShader.prototype.getVertexShader = function(hasBlendIndices,
													  hasBlendWeights,
													  hasGearDyeTextures)
{
	var vertexShaderKey = this.getVertexShaderKey(hasBlendIndices,
												  hasBlendWeights,
												  hasGearDyeTextures);
	var vertexShader = this.vertexShaders[vertexShaderKey];
	if (!vertexShader)
	{
		var gl = this.gl;
		var vertexShaderSourceLines = this.getVertexShaderSourceLines(hasBlendIndices,
																	  hasBlendWeights,
																	  hasGearDyeTextures);
		var vertexShaderInputs = this.getVertexShaderInput(hasBlendIndices,
														   hasBlendWeights,
														   hasGearDyeTextures);

		vertexShader = new Spasm.Shader(gl, gl.VERTEX_SHADER, vertexShaderSourceLines, vertexShaderInputs);

		this.vertexShaders[vertexShaderKey] = vertexShader;
	}

	return vertexShader;
};

Spasm.GearShader.prototype.getFragmentShader = function(hasGearDyeTextures, ignoresTextures)
{
	var fragmentShaderKey = this.getFragmentShaderKey(hasGearDyeTextures, ignoresTextures);
	var fragmentShader = this.fragmentShaders[fragmentShaderKey];
	if (!fragmentShader)
	{
		var gl = this.gl;
		var fragmentShaderSourceLines = this.getFragmentShaderSourceLines(hasGearDyeTextures, ignoresTextures);
		var fragmentShaderInputs = this.getFragmentShaderInput(hasGearDyeTextures, ignoresTextures);

		fragmentShader = new Spasm.Shader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceLines, fragmentShaderInputs);

		this.fragmentShaders[fragmentShaderKey] = fragmentShader;
	}

	return fragmentShader;
};

Spasm.GearShader.prototype.getShaderProgram = function(hasBlendIndices,
													   hasBlendWeights,
													   hasGearDyeTextures,
													   ignoresTextures)
{
	Spasm.assertBoolean(hasBlendIndices);
	Spasm.assertBoolean(hasBlendWeights);
	Spasm.assertBoolean(hasGearDyeTextures);
	Spasm.assertBoolean(ignoresTextures);

	Spasm.assert(hasBlendWeights ? hasBlendIndices : true,
				 "cannot have blend weights without blend indices");

	var gl = this.gl;

	var shaderProgramKey = this.getShaderProgramKey(hasBlendIndices,
													hasBlendWeights,
													hasGearDyeTextures,
													ignoresTextures);
	var shaderProgram = this.shaderPrograms[shaderProgramKey];
	if (!shaderProgram)
	{
		var vertexShader = this.getVertexShader(hasBlendIndices, hasBlendWeights, hasGearDyeTextures);
		var fragmentShader = this.getFragmentShader(hasGearDyeTextures, ignoresTextures);

		shaderProgram = new Spasm.ShaderProgram(gl, vertexShader, fragmentShader);

		var uniformDatas = this.uniformDatas;
		var uniformDataKeys = Object.keys(uniformDatas);
		if (uniformDataKeys.length > 0)
		{
			shaderProgram.useProgram();

			for (var uniformDataKey in uniformDatas)
			{
				var uniformData = uniformDatas[uniformDataKey];
				shaderProgram.setUniformData(uniformData);
			}
		}

		this.shaderPrograms[shaderProgramKey] = shaderProgram;
	}

	return shaderProgram;
};

Spasm.GearShader.prototype.setUniformData = function(uniformData)
{
	Spasm.assertInstance(uniformData, Spasm.UniformData);

	var shaderInput = uniformData.shaderInput;
	var uniformName = shaderInput.name;

	this.uniformDatas[uniformName] = uniformData;

	var shaderPrograms = this.shaderPrograms;
	for (var shaderProgramKey in shaderPrograms)
	{
		var shaderProgram = shaderPrograms[shaderProgramKey];
		shaderProgram.useProgram();
		shaderProgram.setUniformData(uniformData);
	}
};
