// spasm_webgl_renderable.js

var Spasm = Spasm || {};

Spasm.Renderable = function(gl, vertexBuffers, indexBuffer, uniformDatas, textures, parts, boundingVolume)
{
	Spasm.assertWebGLContext(gl);
	Spasm.assertArrayInstances(vertexBuffers, Spasm.VertexBuffer);
	Spasm.assertInstance(indexBuffer, Spasm.IndexBuffer);
	Spasm.assertArrayInstances(uniformDatas, Spasm.UniformData);
	Spasm.assertArrayInstances(parts, Spasm.RenderablePart);
	Spasm.assertInstance(boundingVolume, Spasm.BoundingVolume);

	this.gl = gl;

	this.vertexBuffers = vertexBuffers;
	this.indexBuffer = indexBuffer;

	this.uniformDatas = uniformDatas;
	this.textures = textures;

	this.parts = parts;
	this.boundingVolume = boundingVolume;

	this.partExternalIdentifiers = {};
	var partCount = parts.length;
	for (var partIndex = 0; partIndex < partCount; partIndex++)
	{
		var part = parts[partIndex];
		var partExternalIdentifier = part.externalIdentifier;
		if (partExternalIdentifier != null)
		{
			this.partExternalIdentifiers[partExternalIdentifier] = "";
		}
	}

	this.gearShaders = null;
	this.gearDyes = [];

	var hasBlendIndices = false;
	var hasBlendWeights = false;
	var hasTexcoord2 = false;

	var vertexBufferCount = vertexBuffers.length;
	for (var vertexBufferIndex = 0; vertexBufferIndex < vertexBufferCount; vertexBufferIndex++)
	{
		var vertexBuffer = vertexBuffers[vertexBufferIndex];
		var attributes = vertexBuffer.attributes;

		var attributeCount = attributes.length;
		for (var attributeIndex = 0; attributeIndex < attributeCount; attributeIndex++)
		{
			var attribute = attributes[attributeIndex];
			var shaderValueName = attribute.shaderValueName;
			if (shaderValueName === "a_texcoord2")
			{
				hasTexcoord2 = true;
			}
			else if (shaderValueName === "a_blendindices")
			{
				hasBlendIndices = true;
			}
			else if (shaderValueName === "a_blendweight")
			{
				hasBlendWeights = true;
			}
		}
	}

	this.hasTexcoord2 = hasTexcoord2;
	this.hasBlendIndices = hasBlendIndices;
	this.hasBlendWeights = hasBlendWeights;

	this.assertValidVertexBuffers();
	this.assertValidIndexBuffer();
	this.assertValidParts();
};

Spasm.Renderable.prototype = {};

Spasm.Renderable.prototype.bindBuffers = function()
{
	var gl = this.gl;
	var vertexBuffers = this.vertexBuffers;
	var indexBuffer = this.indexBuffer;
	var textures = this.textures;

	indexBuffer.bindBuffer();

	var vertexBufferCount = vertexBuffers.length;
	for (var vertexBufferIndex = 0; vertexBufferIndex < vertexBufferCount; vertexBufferIndex++)
	{
		var vertexBuffer = vertexBuffers[vertexBufferIndex];
		vertexBuffer.bindBuffer(gl);
	}

	indexBuffer.bindBuffer(gl);

	var textureKeys = Object.keys(textures);
	var textureCount = textureKeys.length;
	for (var textureIndex = 0; textureIndex < textureCount; textureIndex++)
	{
		var textureKey = textureKeys[textureIndex];
		var texture = textures[textureKey];
		if (texture)
		{
			texture.bindTexture();
		}
	}
};

Spasm.Renderable.prototype.useShaderProgram = function(shaderProgram)
{
	Spasm.assertInstance(shaderProgram, Spasm.ShaderProgram);

	var vertexBuffers = this.vertexBuffers;
	var uniformDatas = this.uniformDatas;

	Spasm.assertArrayInstances(vertexBuffers, Spasm.VertexBuffer);

	shaderProgram.useProgram();
	shaderProgram.bindVertexAttributes(vertexBuffers);

	var uniformDataCount = uniformDatas.length;
	for (var uniformDataIndex = 0; uniformDataIndex < uniformDataCount; uniformDataIndex++)
	{
		var uniformData = uniformDatas[uniformDataIndex];
		shaderProgram.setUniformData(uniformData);
	}
};

Spasm.Renderable.prototype.render = function(isMuted, variants)
{
	var gearShaders = this.gearShaders;
	Spasm.assertInstance(gearShaders, Spasm.GearShader);

	this.bindBuffers();

	var ignoreTextures = !!isMuted;

	var shaderProgram = gearShaders.getShaderProgram(this.hasBlendIndices,
													 this.hasBlendWeights,
													 this.hasTexcoord2,
													 ignoreTextures);
	this.useShaderProgram(shaderProgram);

	var gl = this.gl;
	var parts = this.parts;

	var elementType = this.indexBuffer.elementType;

	var gearDyes = this.gearDyes;
	var gearDyeCount = gearDyes.length;

	var partCount = parts.length;
	for (var partIndex = 0; partIndex < partCount; partIndex++)
	{
		var part = parts[partIndex];
		var partIsCloth = part.isCloth;

		if (variants
			&& !partIsCloth)
		{
			var partExternalIdentifier = part.externalIdentifier;
			if (!(partExternalIdentifier in variants))
			{
				// don't render the part if it's not a valid variant
				continue;
			}
		}

		var gearDyeSlot = part.gearDyeSlot;
		var usePrimaryColor = part.usePrimaryColor;

		for (var gearDyeIndex = 0; gearDyeIndex < gearDyeCount; gearDyeIndex++)
		{
			var gearDye = gearDyes[gearDyeIndex];
			if (gearDye.slotTypeIndex === gearDyeSlot)
			{
				gearDye.bindTextures();

				var uniformDatas = gearDye.uniformDatas;
				var uniformDataCount = uniformDatas.length;
				for (var uniformDataIndex = 0; uniformDataIndex < uniformDataCount; uniformDataIndex++)
				{
					var uniformData = uniformDatas[uniformDataIndex];
					shaderProgram.setUniformData(uniformData);
				}

				var changeColorData = (usePrimaryColor
					? gearDye.primaryColorUniformData
					: gearDye.secondaryColorUniformData);

				shaderProgram.setUniformData(changeColorData);
			}
		}

		var partPrimitiveType = part.primitiveType;
		var partIndexStart = part.indexStart;
		var partIndexCount = part.indexCount;
		var offsetByte = (partIndexStart * 2); // bytes per index buffer value
		gl.drawElements(partPrimitiveType, partIndexCount, elementType, offsetByte);
	}

	shaderProgram.resetVertexAttributes();
};

Spasm.Renderable.prototype.assertValidParts = function()
{
	var indexBuffer = this.indexBuffer;
	var parts = this.parts;

	var indexCount = indexBuffer.indexCount;

	var partCount = parts.length;

	for (var partIndex = 0; partIndex < partCount; partIndex++)
	{
		var part = parts[partIndex];
		var partIndexStart = part.indexStart;
		var partIndexCount = part.indexCount;

		var partIndexMax = partIndexStart + partIndexCount;
		Spasm.assert(partIndexMax <= indexCount);
	}
};

Spasm.Renderable.prototype.setGearShaders = function(gearShaders)
{
	Spasm.assertInstance(gearShaders, Spasm.GearShader);

	this.gearShaders = gearShaders;
};

Spasm.Renderable.prototype.setGearDyes = function(gearDyes)
{
	Spasm.assertArrayInstances(gearDyes, Spasm.GearDye);

	this.gearDyes = gearDyes;
};

Spasm.Renderable.prototype.assertValidVertexBuffers = function()
{
	var vertexBuffers = this.vertexBuffers;
	var vertexBufferCount = vertexBuffers.length;
	var vertexCount = vertexBuffers[0].vertexCount;
	if (vertexBufferCount > 1)
	{
		for (var vertexBufferIndex = 1; vertexBufferIndex < vertexBufferCount; vertexBufferIndex++)
		{
			var vertexBuffer = vertexBuffers[vertexBufferIndex];
			Spasm.assertEqual(vertexCount, vertexBuffer.vertexCount);
		}
	}
};

Spasm.Renderable.prototype.assertValidIndexBuffer = function()
{
	var indexBuffer = this.indexBuffer;
	var vertexBuffers = this.vertexBuffers;

	var vertexCount = vertexBuffers[0].vertexCount;

	var indexCount = indexBuffer.indexCount;
	var indexBufferView = new Uint16Array(indexBuffer.arrayBuffer);

	for (var indexIndex = 0; indexIndex < indexCount; indexIndex++)
	{
		var vertexIndex = indexBufferView[indexIndex];
		Spasm.assert(vertexIndex < vertexCount);
	}
};
