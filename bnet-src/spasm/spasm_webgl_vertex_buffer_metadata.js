// spasm_webgl_vertex_buffer_metadata

var Spasm = Spasm || {};

Spasm.VertexBufferMetadata = function(vertexCount, vertexStride, attributes)
{
	Spasm.assertInteger(vertexCount);
	Spasm.assertInteger(vertexStride);
	Spasm.assertArrayInstances(attributes, Spasm.VertexBufferAttribute);

	this.vertexCount = vertexCount;
	this.vertexStride = vertexStride;
	this.attributes = attributes;

	this.assertMatchingAttributes();
};

Spasm.VertexBufferMetadata.prototype = {};

Spasm.VertexBufferMetadata.prototype.assertMatchingAttributes = function()
{
	var vertexStride = this.vertexStride;
	var attributes = this.attributes;

	var attributeSizeTotal = 0;
	var attributeCount = attributes.length;
	for (var attributeIndex = 0; attributeIndex < attributeCount; attributeIndex++)
	{
		var attribute = attributes[attributeIndex];
		attributeSizeTotal += attribute.size;
	}

	Spasm.assertEqual(attributeSizeTotal, vertexStride);
};
