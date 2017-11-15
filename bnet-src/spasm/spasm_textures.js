// spasm_textures.js

var Spasm = Spasm || {};

Spasm.TextureLoader = function(filePath, callback)
{
	Spasm.assertPath(filePath);
	Spasm.assertFunction(callback);

	this.filePath = filePath;
	this.callback = callback;

	this.loadComplete = false;
	this.loadSuccess = false;

	var image = document.createElement("img");
	this.image = image;

	// if we change back to using a CDN, re-enable this.  This needs to not be "anonymous", but rather "use-credentials" so that cookies are sent,
	// otherwise the lockdown module won't work.
	// image.crossOrigin = "use-credentials";

	var self = this;
	image.onload = function()
	{
		self.onImageLoad();
	};
	image.onerror = function()
	{
		self.onImageError();
	};
	image.src = filePath;
};

Spasm.TextureLoader.prototype =
{
	constructor : Spasm.TextureLoader,
	onImageLoad : function()
	{
		this.loadComplete = true;
		this.loadSuccess = true;
		this.callback(this);
	},
	onImageError : function()
	{
		this.loadComplete = true;
		this.loadSuccess = false;
		this.callback(this);
	},
	isComplete : function()
	{
		return this.loadComplete;
	},
	isCompleteAndOK : function()
	{
		return (this.loadComplete
				&& this.loadSuccess);
	}
};
