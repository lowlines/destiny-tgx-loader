// spasm_webgl_buffer.js

var Spasm = Spasm || {};

Spasm.Buffer = function(gl, arrayBuffer, bufferType)
{
    Spasm.assertWebGLContext(gl);
    Spasm.assertValid(arrayBuffer);
    Spasm.assertInteger(bufferType);

    this.gl = gl;
    this.arrayBuffer = arrayBuffer;
    this.bufferType = bufferType;

    var bufferHandle = gl.createBuffer();
    this.bufferHandle = bufferHandle;

    gl.bindBuffer(bufferType, bufferHandle);
    gl.bufferData(bufferType, arrayBuffer, gl.STATIC_DRAW);
};

Spasm.Buffer.prototype =
{
    constructor : Spasm.Buffer
};

Spasm.Buffer.prototype.bindBuffer = function()
{
    var gl = this.gl;
    var bufferType = this.bufferType;
    var bufferHandle = this.bufferHandle;
	
	console.log('glBuffer', bufferType, bufferHandle);

    gl.bindBuffer(bufferType, bufferHandle);
};
