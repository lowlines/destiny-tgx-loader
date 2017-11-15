// spasm_webgl_shader_program.js

var Spasm = Spasm || {};

Spasm.ShaderProgram = function(gl, vertexShader, fragmentShader)
{
	Spasm.assertWebGLContext(gl);
	Spasm.assertInstance(vertexShader, Spasm.Shader);
	Spasm.assertInstance(fragmentShader, Spasm.Shader);

	this.gl = gl;
	this.vertexShader = vertexShader;
	this.fragmentShader = fragmentShader;

	this.assertMatchingVaryings();

	this.program = gl.createProgram();
	Spasm.assertInstance(this.program, WebGLProgram);

	this.handles = {};
	this.hasHandles = false;

	this.link();

	// defer getHandles() until it is necessary
	// this.getHandles();
	console.log('ShaderProgram', vertexShader, fragmentShader);
};

Spasm.ShaderProgram.prototype =
{
	constructor : Spasm.ShaderProgram
};

Spasm.ShaderProgram.prototype.link = function()
{
	var gl = this.gl;
	var program = this.program;

	var vertexShader = this.vertexShader;
	var fragmentShader = this.fragmentShader;

	gl.attachShader(program, vertexShader.shader);
	gl.attachShader(program, fragmentShader.shader);
	gl.linkProgram(program);

	// this.assertLinkStatus();
	// this.assertValidateStatus();
};

Spasm.ShaderProgram.prototype.assertLinkStatus = function()
{
	var gl = this.gl;
	var program = this.program;

	var linkSuccess = true; // gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!linkSuccess)
	{
		var programLinkInfoLog = gl.getProgramInfoLog(program);
		throw programLinkInfoLog;
	}
};

Spasm.ShaderProgram.prototype.assertValidateStatus = function()
{
	var gl = this.gl;
	var program = this.program;

	gl.validateProgram(program);

	var validateSuccess = true; // gl.getProgramParameter(program, gl.VALIDATE_STATUS);
	if (!validateSuccess)
	{
		var programValidateInfoLog = gl.getProgramInfoLog(program);
		throw programValidateInfoLog;
	}
};

Spasm.ShaderProgram.prototype.assertMatchingVaryings = function()
{
	var vertexShader = this.vertexShader;
	var fragmentShader = this.fragmentShader;

	var vertexShaderVaryings = vertexShader.varyings;
	var fragmentShaderVaryings = fragmentShader.varyings;

	var vertexShaderVaryingCount = vertexShaderVaryings.length;
	var fragmentShaderVaryingCount = fragmentShaderVaryings.length;

	Spasm.assertEqual(vertexShaderVaryingCount, fragmentShaderVaryingCount);
	for (var index = 0; index < vertexShaderVaryingCount; index++)
	{
		var vertexShaderVarying = vertexShaderVaryings[index];
		var fragmentShaderVarying = fragmentShaderVaryings[index];

		Spasm.assert(vertexShaderVarying.equals(fragmentShaderVarying));
	}
};

Spasm.ShaderProgram.prototype.getHandles = function()
{
	var gl = this.gl;
	var program = this.program;
	var handles = this.handles;

	var vertexShader = this.vertexShader;
	var fragmentShader = this.fragmentShader;

	var vertexShaderUniformCount = vertexShader.uniforms.length;
	for (var vertexShaderUniformIndex = 0;
		 vertexShaderUniformIndex < vertexShaderUniformCount;
		 vertexShaderUniformIndex++)
	{
		var vertexShaderUniform = vertexShader.uniforms[vertexShaderUniformIndex];
		var vertexShaderUniformName = vertexShaderUniform.name;
		var vertexShaderUniformLocation = gl.getUniformLocation(program, vertexShaderUniformName);

		if (vertexShaderUniformLocation instanceof WebGLUniformLocation)
		{
			handles[vertexShaderUniformName] = vertexShaderUniformLocation;
		}
	}

	var vertexShaderAttributeCount = vertexShader.attributes.length;
	for (var vertexShaderAttributeIndex = 0;
		 vertexShaderAttributeIndex < vertexShaderAttributeCount;
		 vertexShaderAttributeIndex++)
	{
		var vertexShaderAttribute = vertexShader.attributes[vertexShaderAttributeIndex];
		var vertexShaderAttributeName = vertexShaderAttribute.name;
		var vertexShaderAttributeLocation = gl.getAttribLocation(program, vertexShaderAttributeName);

		Spasm.assertInteger(vertexShaderAttributeLocation);

		if (vertexShaderAttributeLocation >= 0)
		{
			handles[vertexShaderAttributeName] = vertexShaderAttributeLocation;
		}
	}

	// $TODO shared uniforms are accessed twice, could be optimized
	var fragmentShaderUniformCount = fragmentShader.uniforms.length;
	for (var fragmentShaderUniformIndex = 0;
		 fragmentShaderUniformIndex < fragmentShaderUniformCount;
		 fragmentShaderUniformIndex++)
	{
		var fragmentShaderUniform = fragmentShader.uniforms[fragmentShaderUniformIndex];
		var fragmentShaderUniformName = fragmentShaderUniform.name;
		var fragmentShaderUniformLocation = gl.getUniformLocation(program, fragmentShaderUniformName);

		if (fragmentShaderUniformLocation instanceof WebGLUniformLocation)
		{
			handles[fragmentShaderUniformName] = fragmentShaderUniformLocation;
		}
	}

	this.hasHandles = true;
};

Spasm.ShaderProgram.prototype.useProgram = function()
{
	var gl = this.gl;
	var program = this.program;

	gl.useProgram(program);
};

Spasm.ShaderProgram.prototype.bindVertexAttributes = function(vertexBuffers)
{
	Spasm.assertArrayInstances(vertexBuffers, Spasm.VertexBuffer);

	var vertexShader = this.vertexShader;

	if (!this.hasHandles)
	{
		this.getHandles();
	}

	var handles = this.handles;

	var vertexShaderAttributes = vertexShader.attributes;
	Spasm.assertArrayInstances(vertexShaderAttributes, Spasm.ShaderInput);

	var vertexShaderAttributeCount = vertexShaderAttributes.length;
	var vertexBufferCount = vertexBuffers.length;
	for (var vertexBufferIndex = 0; vertexBufferIndex < vertexBufferCount; vertexBufferIndex++)
	{
		var vertexBuffer = vertexBuffers[vertexBufferIndex];
		vertexBuffer.bindBuffer();

		var attributes = vertexBuffer.attributes;

		Spasm.assertArrayInstances(attributes, Spasm.VertexBufferAttribute);
		var unusedAttributes = attributes.slice();

		var attributeCount = attributes.length;
		for (var attributeIndex = 0; attributeIndex < attributeCount; attributeIndex++)
		{
			var attribute = attributes[attributeIndex];

			var attributeShaderValueName = attribute.shaderValueName;
			var attributeShaderValueType = attribute.shaderValueType;

			for (var vertexShaderAttributeIndex = 0;
				 vertexShaderAttributeIndex < vertexShaderAttributeCount;
				 vertexShaderAttributeIndex++)
			{
				var vertexShaderAttribute = vertexShaderAttributes[vertexShaderAttributeIndex];
				if (vertexShaderAttribute.name === attributeShaderValueName
					&& vertexShaderAttribute.valueType === attributeShaderValueType)
				{
					unusedAttributes = unusedAttributes.splice(unusedAttributes.indexOf(attribute), 1);

					var attributeHandle = handles[vertexShaderAttribute.name];
					if (!!attributeHandle
						|| attributeHandle === 0)
					{
						vertexBuffer.setAttributePointer(attributeHandle, attribute);
					}
					break;
				}
			}
		}
	}
};

Spasm.ShaderProgram.prototype.resetVertexAttributes = function()
{
	var gl = this.gl;
	var vertexShader = this.vertexShader;
	var handles = this.handles;

	var attributes = vertexShader.attributes;
	var attributeCount = attributes.length;

	for (var attributeIndex = 0; attributeIndex < attributeCount; attributeIndex++)
	{
		var attribute = attributes[attributeIndex];
		var attributeName = attribute.name;

		var handle = handles[attributeName];
		if (handle >= 0)
		{
			gl.disableVertexAttribArray(handle);
		}
	}
};

Spasm.ShaderProgram.prototype.setUniformData = function(uniformData)
{
	Spasm.assert(uniformData, Spasm.UniformData);

	if (!this.hasHandles)
	{
		this.getHandles();
	}

	var handles = this.handles;

	var shaderInput = uniformData.shaderInput;
	var data = uniformData.data;

	var uniformName = shaderInput.name;
	var uniformValueType = shaderInput.valueType;

	var handle = handles[uniformName];
	if (handle)
	{
		var gl = this.gl;
		console.log('setUniformData['+uniformValueType+']', handle, data);
		switch (uniformValueType)
		{
			case "mat2":
				gl.uniformMatrix2fv(handle, false, data);
				break;
			case "mat3":
				gl.uniformMatrix3fv(handle, false, data);
				break;
			case "mat4":
				gl.uniformMatrix4fv(handle, false, data);
				break;
			case "vec2":
				gl.uniform2fv(handle, data);
				break;
			case "vec3":
				gl.uniform3fv(handle, data);
				break;
			case "vec4":
				gl.uniform4fv(handle, data);
				break;
			case "float":
				gl.uniform1f(handle, data);
				break;
			case "sampler2D":
				gl.uniform1i(handle, data);
				break;
			default:
				Spasm.assert(false, "invalid or missing uniform value type");
				break;
		}
	}
};
