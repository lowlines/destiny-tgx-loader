// spasm_webgl_index_buffer.js

var Spasm = Spasm || {};

Spasm.IndexBuffer = function(gl, arrayBuffer, indexCount, elementType)
{
    Spasm.Buffer.call(this, gl, arrayBuffer, gl.ELEMENT_ARRAY_BUFFER);

    Spasm.assertInteger(indexCount);
    Spasm.assertInteger(elementType);

    this.indexCount = indexCount;
    this.elementType = elementType;
};

Spasm.IndexBuffer.prototype = Object.create(Spasm.Buffer.prototype);
