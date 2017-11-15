// spasm_webgl_vertex_buffer_attribute.js

var Spasm = Spasm || {};

Spasm.VertexBufferAttribute = function(semantic,
									   semanticIndex,
									   shaderValueType,
									   bufferValueType,
									   valueCount,
									   normalized,
									   byteCount,
									   byteOffset)
{
	Spasm.assertString(semantic);
	Spasm.assertInteger(semanticIndex);
	Spasm.assertString(shaderValueType);
	Spasm.assertInteger(bufferValueType);
	Spasm.assertInteger(valueCount);
	Spasm.assertBoolean(normalized);
	Spasm.assertInteger(byteCount);
	Spasm.assertInteger(byteOffset);

	this.semantic = semantic;
	this.semanticIndex = semanticIndex;

	this.shaderValueType = shaderValueType;
	this.bufferValueType = bufferValueType;
	this.valueCount = valueCount;
	this.normalized = normalized;
	this.byteCount = byteCount;
	this.byteOffset = byteOffset;

	this.assertValidAttribute();

	// prefix attribute names in the shader with 'a_'
	this.shaderValueName = "a_" + semantic + (semanticIndex > 0 ? semanticIndex : "");
	this.declaration = "attribute " + shaderValueType + " " + this.shaderValueName + ";";
};

Spasm.VertexBufferAttribute.prototype = {};

Spasm.VertexBufferAttribute.prototype.assertValidAttribute = function()
{
	var semanticIndex = this.semanticIndex;

	var shaderValueType = this.shaderValueType;
	var bufferValueType = this.bufferValueType;

	var valueCount = this.valueCount;

	var byteCount = this.byteCount;
	var byteOffset = this.byteOffset;

	Spasm.assert(semanticIndex >= 0);

	Spasm.assert(shaderValueType in Spasm.Shader.ValueTypes);
	Spasm.assert(bufferValueType >= 0);

	Spasm.assert(valueCount >= 1);

	Spasm.assert(byteCount >= 1);
	Spasm.assert(byteOffset >= 0);
};
