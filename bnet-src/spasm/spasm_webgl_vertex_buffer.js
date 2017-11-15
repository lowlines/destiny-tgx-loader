// spasm_webgl_vertex_buffer.js

var Spasm = Spasm || {};

Spasm.VertexBuffer = function(gl, arrayBuffer, vertexStride, vertexCount, attributes)
{
	Spasm.Buffer.call(this, gl, arrayBuffer, gl.ARRAY_BUFFER);

	Spasm.assertInteger(vertexStride);
	Spasm.assertInteger(vertexCount);
	Spasm.assertArrayInstances(attributes, Spasm.VertexBufferAttribute);

	this.vertexStride = vertexStride;
	this.vertexCount = vertexCount;
	this.attributes = attributes;

	Spasm.VertexBuffer.debugAssertValidBuffer(arrayBuffer, vertexCount, vertexStride);
	this.debugAssertValidAttributes();
};

Spasm.VertexBuffer.prototype = Object.create(Spasm.Buffer.prototype);

Spasm.VertexBuffer.debugAssertValidBuffer = function(arrayBuffer, vertexCount, vertexStride)
{
	Spasm.assertArrayBuffer(arrayBuffer);
	Spasm.assertInteger(vertexStride);
	Spasm.assertInteger(vertexCount);

	var byteCount = vertexCount * vertexStride;
	var arrayBufferByteCount = arrayBuffer.byteLength;

	Spasm.assertEqual(byteCount, arrayBufferByteCount);
};

Spasm.VertexBuffer.prototype.debugAssertValidAttributes = function()
{
	var attributes = this.attributes;
	Spasm.assertArrayInstances(attributes, Spasm.VertexBufferAttribute);

	var vertexStride = this.vertexStride;
	var calculatedVertexStride = 0;

	var attributeCount = attributes.length;
	for (var attributeIndex = 0; attributeIndex < attributeCount; attributeIndex++)
	{
		var attribute = attributes[attributeIndex];
		var byteCount = attribute.byteCount;
		var byteOffset = attribute.byteOffset;

		Spasm.assertEqual(calculatedVertexStride, byteOffset);
		calculatedVertexStride += byteCount;
	}

	Spasm.assertEqual(calculatedVertexStride, vertexStride);
};

Spasm.VertexBuffer.prototype.setAttributePointer = function(handle, attribute)
{
	Spasm.assertInteger(handle);
	Spasm.assertInstance(attribute, Spasm.VertexBufferAttribute);

	var gl = this.gl;
	var vertexStride = this.vertexStride;

	var count = attribute.valueCount;
	var bufferValueType = attribute.bufferValueType;
	var normalized = attribute.normalized;
	var offset = attribute.byteOffset;

	// $TODO reduce the number of redundant calls to enableVertexAttribArray
	gl.enableVertexAttribArray(handle);
	gl.vertexAttribPointer(handle, count, bufferValueType, normalized, vertexStride, offset);
};
