// spasm_webgl_renderer.js

var Spasm = Spasm || {};

Spasm.Renderer = function(canvas)
{
	Spasm.assertCanvas(canvas);

	this.canvas = canvas;
	this.renderables = [];

	this.features = new Spasm.Features(canvas);
	if (this.canRender())
	{
		this.gl = this.features.gl;
		this.initWebGL();
	}
	else
	{
		this.gl = null;
	}
};

Spasm.Renderer.prototype =
{
	constructor : Spasm.Renderer
};

Spasm.Renderer.prototype.canRender = function()
{
	return this.features.canRender();
};

Spasm.Renderer.prototype.initWebGL = function()
{
	var gl = this.gl;

	if (gl)
	{
		Spasm.assertWebGLContext(gl);

		this.gl = gl;

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);

		gl.disable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.disable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		gl.clearColor(0.0, 0.0, 0.0, 0.0);

		this.clearFlags = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT;
		gl.clear(this.clearFlags);

		this.glTextures = [];
		var textureReferenceIdCount = 32;
		for (var textureIndex = 0; textureIndex < textureReferenceIdCount; textureIndex++)
		{
			var textureReference = gl["TEXTURE" + textureIndex];
			this.glTextures.push(textureReference);
		}
	}
};

Spasm.Renderer.prototype.render = function()
{
	if (this.canRender())
	{
		var gl = this.gl;

		var renderables = this.renderables;
		var renderableCount = renderables.length;
		for (var renderableIndex = 0; renderableIndex < renderableCount; renderableIndex++)
		{
			var renderable = renderables[renderableIndex];
			renderable.render(gl);
		}
	}
};

Spasm.Renderer.prototype.animate = function()
{
	if (this.canRender())
	{
		var self = this;
		window.requestAnimationFrame(function()
									 {
										 self.animate();
									 });

		this.render();
	}
};

Spasm.Renderer.prototype.addRenderable = function(renderable)
{
	Spasm.assertInstance(renderable, Spasm.Renderable);

	this.renderables.push(renderable);
};

Spasm.Renderer.prototype.getDiffusePlateTextureIndex = function()
{
	var diffusePlateTextureIndex = 0;
	return diffusePlateTextureIndex;
};

Spasm.Renderer.prototype.getNormalPlateTextureIndex = function()
{
	var normalPlateTextureIndex = 1;
	return normalPlateTextureIndex;
};

Spasm.Renderer.prototype.getGearstackPlateTextureIndex = function()
{
	var gearstackPlateTextureIndex = 2;
	return gearstackPlateTextureIndex;
};

Spasm.Renderer.prototype.getDiffuseDyeTextureIndex = function()
{
	var diffuseDyeTextureIndex = 3;
	return diffuseDyeTextureIndex;
};

Spasm.Renderer.prototype.getNormalDyeTextureIndex = function()
{
	var normalDyeTextureIndex = 4;
	return normalDyeTextureIndex;
};

Spasm.Renderer.prototype.getDecalDyeTextureIndex = function()
{
	var decalDyeTextureIndex = 5;
	return decalDyeTextureIndex;
};
