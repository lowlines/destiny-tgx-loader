// spasm_webgl_texture.js

var Spasm = Spasm || {};

Spasm.Texture = function(gl, index, image)
{
	Spasm.assertWebGLContext(gl);
	Spasm.assertInteger(index);
	Spasm.assertImage(image);

	Spasm.assert(index >= 0, "texture index is less than 0: " + index);
	Spasm.assert(index < 32, "texture index is greater or equal to 32: " + index);

	this.gl = gl;
	this.index = index;
	this.image = image;

	this.glTextureIndex = gl["TEXTURE" + index];
	Spasm.assertInteger(this.glTextureIndex);

	this.textureHandle = gl.createTexture();
	this.setTextureImage();
};

Spasm.Texture.prototype = {};

Spasm.Texture.prototype.bindTexture = function()
{
	var gl = this.gl;

	gl.activeTexture(this.glTextureIndex);
	gl.bindTexture(gl.TEXTURE_2D, this.textureHandle);
};

Spasm.Texture.prototype.setTextureImage = function()
{
	this.bindTexture();

	var gl = this.gl;
	var image = this.image;

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	if (image.width === image.height)
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
	}
	else
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	}
};

Spasm.Texture.prototype.setTextureUniform = function(textureUniform)
{
	Spasm.assertShaderUniform(textureUniform);

	this.bindTexture();

	var gl = this.gl;
	var index = this.index;

	gl.uniform1i(textureUniform, index);
};
