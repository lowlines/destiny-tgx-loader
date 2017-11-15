// spasm_drop_shadow.js

var Spasm = Spasm || {};

Spasm.DropShadow = function(gl)
{
	Spasm.assertWebGLContext(gl);

	this.gl = gl;

	this.vertices =
	[
		-1.0, -1.0, 0.0, 1.0,
		1.0, -1.0, 0.0, 1.0,
		-1.0, 1.0, 0.0, 1.0,
		1.0, 1.0, 0.0, 1.0
	];

	this.boundingVolume = null;

	var inputTypes = Spasm.Shader.InputTypes;
	var valueTypes = Spasm.Shader.ValueTypes;

	// shader inputs
	this.uniforms =
	{
		projectionMatrix : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.mat4, "u_projection_matrix"),
		modelMatrix : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.mat4, "u_model_matrix"),
		viewMatrix : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.mat4, "u_view_matrix"),

		scale : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec4, "u_drop_shadow_scale"),
		translation : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec4, "u_drop_shadow_translation"),

		shadowColor : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec4, "u_shadow_color")
	};

	this.attributes =
	{
		position : new Spasm.ShaderInput(inputTypes.attribute, valueTypes.vec4, "a_position")
	};

	this.varyings =
	{
		position : new Spasm.ShaderInput(inputTypes.varying, valueTypes.vec4, "v_position")
	};

	this.vertexBufferAttribute = new Spasm.VertexBufferAttribute("position", 0, valueTypes.vec4, gl.FLOAT,
																 4, false, 4 * 4, 0);

	this.vertexBuffer = new Spasm.VertexBuffer(gl, (new Float32Array(this.vertices)).buffer,
											   this.vertices.length, 4, [this.vertexBufferAttribute]);

	this.dropShadowScale = new Float32Array([1.0, 1.0, 1.0, 1.0]);
	this.dropShadowScaleUniform = new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec4, "u_drop_shadow_scale");
	this.dropShadowScaleUnfiformData = new Spasm.UniformData(this.dropShadowScaleUniform, this.dropShadowScale);

	this.dropShadowTranslation = new Float32Array([0.0, 0.0, 0.0, 1.0]);
	this.dropShadowTranslationUniform = new Spasm.ShaderInput(inputTypes.uniform,
															  valueTypes.vec4,
															  "u_drop_shadow_translation");
	this.dropShadowTranslationUnfiformData = new Spasm.UniformData(this.dropShadowTranslationUniform,
																   this.dropShadowTranslation);

	this.uniformDatas = {};

	// shader program
	var vertexShaderInputs = this.getVertexShaderInputs();
	var fragmentShaderInputs = this.getFragmentShaderInputs();

	this.vertexShader = new Spasm.Shader(gl,
										 gl.VERTEX_SHADER,
										 this.getVertexShaderSourceLines(vertexShaderInputs),
										 vertexShaderInputs);

	this.fragmentShader = new Spasm.Shader(gl,
										   gl.FRAGMENT_SHADER,
										   this.getFragmentShaderSourceLines(fragmentShaderInputs),
										   fragmentShaderInputs);

	this.shaderProgram = new Spasm.ShaderProgram(gl, this.vertexShader, this.fragmentShader);
};

Spasm.DropShadow.prototype = {};

Spasm.DropShadow.prototype.setUniformData = function(uniformData)
{
	Spasm.assertInstance(uniformData, Spasm.UniformData);

	var shaderInput = uniformData.shaderInput;
	var uniformName = shaderInput.name;

	this.uniformDatas[uniformName] = uniformData;

	this.shaderProgram.useProgram();
	this.shaderProgram.setUniformData(uniformData);
};

Spasm.DropShadow.prototype.render = function()
{
	this.setUniformData(this.dropShadowScaleUnfiformData);
	this.setUniformData(this.dropShadowTranslationUnfiformData);

	this.shaderProgram.useProgram();

	this.vertexBuffer.bindBuffer();

	this.shaderProgram.bindVertexAttributes([this.vertexBuffer]);

	var gl = this.gl;

	// force blend and cull face
	var blendEnabled = gl.isEnabled(gl.BLEND);
	var cullFaceEnabled = gl.isEnabled(gl.CULL_FACE);

	gl.enable(gl.BLEND);
	gl.enable(gl.CULL_FACE);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	// undo blend and cull face state if necessary
	if (!blendEnabled)
	{
		gl.disable(gl.BLEND);
	}

	if (!cullFaceEnabled)
	{
		gl.disable(gl.CULL_FACE);
	}
};

Spasm.DropShadow.prototype.getVertexShaderSourceLines = function(vertexShaderInputs)
{
	Spasm.assertArrayInstances(vertexShaderInputs, Spasm.ShaderInput);

	var lines = [];

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

	// begin main()
	lines.push("void main()");
	lines.push("{");

	// transforms
	lines.push("mat4 model_view_matrix = u_view_matrix * u_model_matrix;");
	lines.push("mat4 camera_matrix = u_projection_matrix * model_view_matrix;");

	// transformed position
	lines.push("vec4 position_transformed = vec4("
			   + "(a_position.x * u_drop_shadow_scale.x) + u_drop_shadow_translation.x,"
			   + "(a_position.y * u_drop_shadow_scale.y) + u_drop_shadow_translation.y,"
			   + "(a_position.z * u_drop_shadow_scale.z) + u_drop_shadow_translation.z,"
			   + "1.0);");

	// set position
	lines.push("gl_Position = camera_matrix * position_transformed;");

	// pipe input position into varying for fragment shader
	lines.push("v_position = a_position;");

	// end main()
	lines.push("}");
	lines.push("");

	return lines;
};

Spasm.DropShadow.prototype.getFragmentShaderSourceLines = function(fragmentShaderInputs)
{
	Spasm.assertArrayInstances(fragmentShaderInputs, Spasm.ShaderInput);

	var lines = [];

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

	// begin main()
	lines.push("void main()");
	lines.push("{");

	lines.push("float distance = (v_position.x * v_position.x)"
			   + "+ (v_position.y * v_position.y);");
	lines.push("float intensity = 1.0 - (distance * (5.0/3.0));");

	lines.push("gl_FragColor = vec4(0.0, 0.0, 0.0, intensity - 0.3);");

	// end main()
	lines.push("}");
	lines.push("");

	return lines;
};

Spasm.DropShadow.prototype.getVertexShaderInputs = function()
{
	var uniforms = this.uniforms;
	var attributes = this.attributes;
	var varyings = this.varyings;

	var inputs =
			[
				uniforms.projectionMatrix,
				uniforms.modelMatrix,
				uniforms.viewMatrix,
				uniforms.scale,
				uniforms.translation,
				attributes.position,
				varyings.position
			];

	return inputs;
};

Spasm.DropShadow.prototype.getFragmentShaderInputs = function()
{
	// var uniforms = this.uniforms;
	var varyings = this.varyings;

	var inputs =
			[
				varyings.position
				// uniforms.shadowColor
			];

	return inputs;
};

Spasm.DropShadow.prototype.setBoundingVolume = function(boundingVolume)
{
	Spasm.assertInstance(boundingVolume, Spasm.BoundingVolume);

	this.boundingVolume = boundingVolume;

	var centerPoint = boundingVolume.getCenterPoint();

	this.dropShadowTranslation[0] = centerPoint[0];
	this.dropShadowTranslation[1] = centerPoint[1];

	// allow for a small margin between the model and the shadow
	this.dropShadowTranslation[2] = boundingVolume.minZ - 0.005;

	this.dropShadowScale[0] = ((boundingVolume.maxX - boundingVolume.minX) / 2.0) * 1.5;
	this.dropShadowScale[1] = ((boundingVolume.maxY - boundingVolume.minY) / 2.0) * 1.5;
};
