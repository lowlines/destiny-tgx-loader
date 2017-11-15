// spasm_loaders.js

var Spasm = Spasm || {};

Spasm.ReadyStateComplete = 4;
Spasm.HTTPStatusOK = 200;
Spasm.HTTPStatusNotModified = 304;

Spasm.Loader = function(filePath)
{
	Spasm.assertPath(filePath, "invalid file path");

	this.filePath = filePath;

	var request = new XMLHttpRequest();
	this.request = request;
	request.onreadystatechange = this.stateChangeCallback();
	request.onprogress = this.progressCallback();

	request.open("GET", filePath);
	request.send();
};

Spasm.Loader.prototype =
{
	constructor : Spasm.Loader,
	stateChangeCallback : function()
	{
		var self = this;
		return function()
		{
			self.onStateChange();
		};
	},
	progressCallback : function()
	{
		var self = this;
		return function()
		{
			self.onProgress();
		};
	},
	onStateChange : function()
	{
	},
	onProgress : function()
	{
	}
};

Spasm.Loader.prototype.isComplete = function()
{
	var request = this.request;

	return request.readyState === Spasm.ReadyStateComplete;
};

Spasm.Loader.prototype.isCompleteAndOK = function()
{
	var request = this.request;
	var responseCode = request.status;
	
	return ((request.readyState === Spasm.ReadyStateComplete)
			&& ((responseCode >= 200 && responseCode < 300)
				|| (request.status === Spasm.HTTPStatusNotModified)));
};

Spasm.BufferLoader = function(filePath, callback)
{
	Spasm.Loader.call(this, filePath);
	this.callback = callback;

	this.request.responseType = "arraybuffer";
};
Spasm.BufferLoader.prototype = Object.create(Spasm.Loader.prototype);
Spasm.BufferLoader.prototype.onStateChange = function()
{
	if (this.isComplete())
	{
		this.callback(this);
	}
};

Spasm.JSONLoader = function(filePath, callback)
{
	Spasm.Loader.call(this, filePath);
	this.callback = callback;

	this.parsedResponse = null;
};

Spasm.JSONLoader.prototype = Object.create(Spasm.Loader.prototype);
Spasm.JSONLoader.prototype.onStateChange = function()
{
	if (this.isComplete())
	{
		if (this.isCompleteAndOK())
		{
			var request = this.request;
			var responseText = request.responseText;

			try
			{
				this.parsedResponse = JSON.parse(responseText);
			}
			catch (exception)
			{
				console.log("Spasm.JSONLoader parse error : " + exception);
			}
		}

		this.callback(this);
	}
};
