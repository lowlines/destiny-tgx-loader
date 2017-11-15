// spasm_render_mesh.js

var Spasm = Spasm || {};

Spasm.RenderMesh = function(renderMesh)
{
	Spasm.assertValid(renderMesh);
	this.renderMesh = renderMesh;

	this.boundingVolume = Spasm.boundingVolumeFromRenderMetadata(renderMesh.bounding_volume);

	this.skinning = renderMesh.skinning;

	this.positionOffset = renderMesh.position_offset;
	this.positionScale = renderMesh.position_scale;

	var texcoordScaleOffset = renderMesh.texcoord0_scale_offset;
	this.textureScale = [texcoordScaleOffset[0], texcoordScaleOffset[1]];
	this.textureOffset = [texcoordScaleOffset[2], texcoordScaleOffset[3]];

	this.stageParts = [];
	var stagePartCount = renderMesh.stage_part_list.length;
	for (var stagePartIndex = 0; stagePartIndex < stagePartCount; stagePartIndex++)
	{
		var renderMeshStagePart = renderMesh.stage_part_list[stagePartIndex];
		var stagePart = new Spasm.RenderMeshStagePart(renderMeshStagePart);
		this.stageParts.push(stagePart);
	}

	this.stagePartOffsets = renderMesh.stage_part_offsets;
	this.stagePartVertexStreamLayoutLookup = renderMesh.stage_part_vertex_stream_layout_lookup;
	this.stagePartVertexStreamLayoutDefintions = renderMesh.stage_part_vertex_stream_layout_definitions;

	this.indexBufferMetadata =
	{
		fileName : renderMesh.index_buffer.file_name,
		byteSize : renderMesh.index_buffer.byte_size,
		valueByteSize : renderMesh.index_buffer.value_byte_size
	};

	this.vertexBufferMetadatas = [];
	var vertexBufferCount = renderMesh.vertex_buffers.length;
	for (var vertexBufferIndex = 0; vertexBufferIndex < vertexBufferCount; vertexBufferIndex++)
	{
		var renderMeshVertexBuffer = renderMesh.vertex_buffers[vertexBufferIndex];
		var vertexBufferMetadata =
			{
				fileName : renderMeshVertexBuffer.file_name,
				byteSize : renderMeshVertexBuffer.byte_size,
				strideByteSize : renderMeshVertexBuffer.stride_byte_size
			};

		this.vertexBufferMetadatas.push(vertexBufferMetadata);
	}
};

Spasm.RenderMesh.prototype = {};

Spasm.RenderMesh.prototype.setVertexBuffers = function(vertexBuffers)
{
	Spasm.assertArrayInstances(vertexBuffers, Spasm.VertexBuffer);

	this.vertexBuffers = vertexBuffers;
};

Spasm.RenderMesh.prototype.setIndexBuffer = function(indexBuffer)
{
	Spasm.assertInstance(indexBuffer, Spasm.IndexBuffer);

	this.indexBuffer = indexBuffer;
};

Spasm.RenderMesh.prototype.getRenderable = function(gl, textures, texturePlates)
{
	Spasm.assertWebGLContext(gl);
	Spasm.assertValid(textures);

	var uniformDatas = this.getUniformDatas(textures, texturePlates);
	var vertexBuffers = this.vertexBuffers;
	var indexBuffer = this.indexBuffer;

	var renderableParts = this.getRenderableParts(gl);
	var boundingVolume = this.boundingVolume;

	var renderable = new Spasm.Renderable(
		gl, vertexBuffers, indexBuffer, uniformDatas, texturePlates, renderableParts, boundingVolume);

	return renderable;
};

Spasm.RenderMesh.prototype.stagesToRender = [0]; // [0, 7];

Spasm.RenderMesh.prototype.getRenderableParts = function(gl)
{
	Spasm.assertWebGLContext(gl);

	var stageParts = this.stageParts;
	var stagePartOffsets = this.stagePartOffsets;
	var stagesToRender = this.stagesToRender;

	var stagePartCount = stageParts.length;
	var stagePartOffsetCount = stagePartOffsets.length;
	var renderStageWeCareAboutCount = stagesToRender.length;

	var renderableParts = [];

	for (var renderStageWeCareAboutIndex = 0;
		 renderStageWeCareAboutIndex < renderStageWeCareAboutCount;
		 renderStageWeCareAboutIndex++)
	{
		var renderStageWeCareAbout = stagesToRender[renderStageWeCareAboutIndex];
		Spasm.assert(renderStageWeCareAbout + 1 < stagePartOffsetCount);

		var renderStagePartStartIndex = stagePartOffsets[renderStageWeCareAbout];
		var renderStagePartEndIndex = stagePartOffsets[renderStageWeCareAbout + 1];

		for (var renderStagePartIndex = renderStagePartStartIndex;
			 renderStagePartIndex < renderStagePartEndIndex;
			 renderStagePartIndex++)
		{
			Spasm.assert(renderStagePartIndex < stagePartCount);

			var stagePart = stageParts[renderStagePartIndex];

			var externalIdentifier = stagePart.externalIdentifier;
			var partPrimitiveType = stagePart.primitiveType;

			var primitiveType = (partPrimitiveType === 3
				? gl.TRIANGLES
				: gl.TRIANGLE_STRIP);

			var isCloth = primitiveType === gl.TRIANGLES;

			var lodCategory = stagePart.lodCategory;
			var lodCategoryName = lodCategory.name;

			// only render highest level-of-detail (0)
			if (lodCategoryName.indexOf("0") >= 0)
			{
				var indexStart = stagePart.startIndex;
				var indexCount = stagePart.indexCount;
				var changeColorIndex = stagePart.gearDyeChangeColorIndex;

				var renderablePart = new Spasm.RenderablePart(indexStart, indexCount,
															  changeColorIndex, primitiveType,
															  externalIdentifier, isCloth);
				renderableParts.push(renderablePart);
			}
		}
	}

	return renderableParts;
};

Spasm.RenderMesh.prototype.getAttributes = function(gl)
{
	Spasm.assertWebGLContext(gl);

	var vertexBufferMetadatas = this.vertexBufferMetadatas;
	var vertexBufferCount = vertexBufferMetadatas.length;

	var vertexStreamLayoutDefinitions = this.stagePartVertexStreamLayoutDefintions;
	var vertexStreamLayoutDefinitionCount = vertexStreamLayoutDefinitions.length;
	Spasm.assertEqual(vertexStreamLayoutDefinitionCount, 1);

	var vertexStreamLayout = vertexStreamLayoutDefinitions[0];
	var vertexStreamLayoutFormats = vertexStreamLayout.formats;
	var vertexStreamLayoutFormatCount = vertexStreamLayoutFormats.length;

	Spasm.assertEqual(vertexBufferCount, vertexStreamLayoutFormatCount);

	var vertexBufferAttributes = [];
	var semanticIdentifiers = [];
	var vertexBufferSemantics = {};

	for (var vertexBufferIndex = 0; vertexBufferIndex < vertexBufferCount; vertexBufferIndex++)
	{
		var attributes = [];

		var vertexBufferMetadata = vertexBufferMetadatas[vertexBufferIndex];
		var vertexBufferStride = vertexBufferMetadata.strideByteSize;

		var vertexStreamLayoutFormat = vertexStreamLayoutFormats[vertexBufferIndex];

		var vertexStreamLayoutStride = vertexStreamLayoutFormat.stride;
		Spasm.assertEqual(vertexBufferStride, vertexStreamLayoutStride);

		var vertexStreamLayoutElements = vertexStreamLayoutFormat.elements;
		var vertexStreamLayoutElementCount = vertexStreamLayoutElements.length;

		var elementValueSizeNames = ["ubyte", "byte", "ushort", "short", "uint", "int", "float"];
		var semanticElementByteSizes = {};

		var elementByteOffset = 0;
		for (var vertexStreamLayoutElementIndex = 0;
			 vertexStreamLayoutElementIndex < vertexStreamLayoutElementCount;
			 vertexStreamLayoutElementIndex++)
		{
			var vertexStreamLayoutElement = vertexStreamLayoutElements[vertexStreamLayoutElementIndex];

			var semanticIndex = vertexStreamLayoutElement.semantic_index;
			var semanticName = vertexStreamLayoutElement.semantic;
			var elementTypeName = vertexStreamLayoutElement.type;

			var semanticNameStripped = semanticName.replace("_tfx_vb_semantic_", "");
			var elementTypeNameStripped = elementTypeName.replace("_vertex_format_attribute_", "");

			var foundElementValueType = "";
			var foundElementValueByteSize = 0;
			var foundElementValueCount = 0;

			var elementValueSizesCount = elementValueSizeNames.length;
			for (var elementValueSizeIndex = 0;
				 elementValueSizeIndex < elementValueSizesCount;
				 elementValueSizeIndex++)
			{
				var elementValueSizeName = elementValueSizeNames[elementValueSizeIndex];
				var indexOfElementValueSizeName = elementTypeNameStripped.indexOf(elementValueSizeName);
				if (indexOfElementValueSizeName === 0)
				{
					var elementTypeNameStrippedLength = elementTypeNameStripped.length;
					var elementValueCountString = elementTypeNameStripped[elementTypeNameStrippedLength - 1];

					foundElementValueCount = parseInt(elementValueCountString);
					Spasm.assertInteger(foundElementValueCount);

					switch (elementValueSizeName)
					{
						case "byte":
							foundElementValueType = "BYTE";
							foundElementValueByteSize = 1;
							break;
						case "ubyte":
							foundElementValueType = "UNSIGNED_BYTE";
							foundElementValueByteSize = 1;
							break;
						case "short":
							foundElementValueType = "SHORT";
							foundElementValueByteSize = 2;
							break;
						case "ushort":
							foundElementValueType = "UNSIGNED_SHORT";
							foundElementValueByteSize = 2;
							break;
						case "int":
							foundElementValueType = "INT";
							foundElementValueByteSize = 4;
							break;
						case "uint":
							foundElementValueType = "UNSIGNED_INT";
							foundElementValueByteSize = 4;
							break;
						case "float":
							foundElementValueType = "FLOAT";
							foundElementValueByteSize = 4;
							break;
						default:
							Spasm.assert(false, "invalid elementValueSizeName: " + elementValueSizeName);
							break;
					}
					break;
				}
			}

			var foundElementByteSize = foundElementValueByteSize * foundElementValueCount;
			var bufferValueType = gl[foundElementValueType];

			var isNormalized = vertexStreamLayoutElement.normalized;

			if (semanticNameStripped.indexOf("position") >= 0
				&& foundElementValueType === "FLOAT")
			{
				// $HACK cloth position doesn't need to be scaled or offset
				this.positionScale = [1.0, 1.0, 1.0];
				this.positionOffset = [0.0, 0.0, 0.0];
			}

			var semanticIdentifier = "" + semanticNameStripped + "" + semanticIndex;
			if (semanticIdentifier in semanticIdentifiers)
			{
				console.log("oops - duplicate semantic identifier: " + semanticIdentifier);
			}
			semanticIdentifiers.push(semanticIdentifier);

			semanticElementByteSizes[semanticIdentifier] = foundElementByteSize;

			// track all semantics and their placements
			vertexBufferSemantics[semanticIdentifier] =
			{
				vertexBufferIndex : vertexBufferIndex,
				byteOffset : elementByteOffset,
				elementSize : foundElementByteSize,
				elementTypeName : elementTypeName,
				vertexStride : vertexBufferStride,
				elementValueSize : foundElementValueByteSize,
				elementValueCount : foundElementValueCount
			};

			var shaderValueType = (foundElementValueCount === 1
				? "float"
				: "vec" + foundElementValueCount);

			var attribute = new Spasm.VertexBufferAttribute(semanticNameStripped, semanticIndex,
															shaderValueType, bufferValueType,
															foundElementValueCount, isNormalized,
															foundElementByteSize, elementByteOffset);

			attributes.push(attribute);

			// increment byte offset
			elementByteOffset += foundElementByteSize;
		}

		// sum semantic element sizes
		var totalSemanticElementByteSize = 0;

		var semanticElementSizeKeys = Object.keys(semanticElementByteSizes);
		var semanticElementSizeCount = semanticElementSizeKeys.length;

		for (var semanticElementNameIndex = 0;
			 semanticElementNameIndex < semanticElementSizeCount;
			 semanticElementNameIndex++)
		{
			var semanticElementName = semanticElementSizeKeys[semanticElementNameIndex];
			totalSemanticElementByteSize += semanticElementByteSizes[semanticElementName];
		}

		// double check calculated vertex stride
		var totalElementSizeVertexStrideDifference = totalSemanticElementByteSize - vertexBufferStride;
		Spasm.assert(totalElementSizeVertexStrideDifference === 0,
					 "non-zero stride difference: " +
					 "given - " + vertexBufferStride +
					 ", calculated - " + totalSemanticElementByteSize);

		vertexBufferAttributes.push(attributes);
	}

	return vertexBufferAttributes;
};

Spasm.RenderMesh.prototype.getUniformDatas = function(textures, texturePlates)
{
	var positionScale = this.positionScale;
	var positionOffset = this.positionOffset;

	var textureScale = this.textureScale;
	var textureOffset = this.textureOffset;

	var inputTypes = Spasm.Shader.InputTypes;
	var valueTypes = Spasm.Shader.ValueTypes;

	var positionScaleUniform = new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec3, "u_position_scale");
	var positionScaleUniformData = new Spasm.UniformData(positionScaleUniform, new Float32Array(positionScale));

	var positionOffsetUniform = new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec3, "u_position_offset");
	var positionOffsetUniformData = new Spasm.UniformData(positionOffsetUniform, new Float32Array(positionOffset));

	var texcoordScaleUniform = new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec2, "u_texcoord_scale");
	var texcoordScaleUniformData = new Spasm.UniformData(texcoordScaleUniform, new Float32Array(textureScale));

	var texcoordOffsetUniform = new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec2, "u_texcoord_offset");
	var texcoordOffsetUniformData = new Spasm.UniformData(texcoordOffsetUniform, new Float32Array(textureOffset));

	var uniformDatas =
			[
				positionScaleUniformData,
				positionOffsetUniformData,
				texcoordScaleUniformData,
				texcoordOffsetUniformData
			];

	for (var key in texturePlates)
	{
		var texturePlate = texturePlates[key];
		if (texturePlate)
		{
			var textureUniform = new Spasm.ShaderInput(inputTypes.uniform, valueTypes.sampler2D, "u_texture_" + key);
			var textureUniformData = new Spasm.UniformData(textureUniform, texturePlate.index);
			uniformDatas.push(textureUniformData);
		}
	}

	return uniformDatas;
};
