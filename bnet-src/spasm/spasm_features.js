// spasm_features.js

var Spasm = Spasm || {};

Spasm.Features = function(canvas)
{
	Spasm.assertCanvas(canvas);

	this.canvas = canvas;

	var gl = null;
	var glException = null;
	var viewport = null;

	var supportsWebGL = Spasm.Features.supportsWebGL();
	if (supportsWebGL)
	{
		try
		{
			var options = {antialias : true, preserveDrawingBuffer : true};
			gl = (canvas.getContext("webgl", options)
				  || canvas.getContext("experimental-webgl", options));

			viewport = gl.getParameter(gl.VIEWPORT);
		}
		catch (exception)
		{
			glException = exception;
		}
	}

	this.gl = gl;
	this.glException = glException;
	this.viewport = viewport;

	this.requiredShaderValueCountSupported = false;
	this.requiredExtensionsSupported = false;
	this.requiredFunctionsSupported = false;

	if (viewport)
	{
		var viewportValues = [];
		var viewportValueCount = viewport.length;
		for (var viewportValueIndex = 0; viewportValueIndex < viewportValueCount; viewportValueIndex++)
		{
			var viewportValue = viewport[viewportValueIndex];
			viewportValues.push(viewportValue);
		}
	}

	this.shaderSupport =
	{
		vertex : {
			uniformVectors : 0,
			attributes : 0
		},
		fragment : {
			uniformVectors : 0,
			varyingVectors : 0,
			textureCount : 0
		}
	};

	if (gl)
	{
		this.requiredShaderValueCountSupported = this.checkMaxShaderValues(gl);
		this.checkContextAttributes(gl);
		this.requiredExtensionsSupported = this.checkExtensions(gl);
		this.requiredFunctionsSupported = this.checkRequiredFunctions();
	}
};

Spasm.Features.prototype = {};

Spasm.Features.prototype.floatingPointTextureExtensionName = "OES_texture_float";

Spasm.Features.prototype.requiredExtensions = [];
Spasm.Features.prototype.optionalExtensions = [Spasm.Features.prototype.floatingPointTextureExtensionName,
											   "WEBGL_lose_context",
											   "WEBKIT_WEBGL_lose_context",
											   "MOZ_WEBGL_lose_context"];

Spasm.Features.prototype.requiredFunctions = ["ArrayBuffer.prototype.slice"];

Spasm.Features.prototype.checkRequiredFunctions = function()
{
	var requiredFunctions = this.requiredFunctions;
	Spasm.assertStringArray(requiredFunctions);

	var requiredFunctionsAvailable = true;
	var requiredFunctionCount = requiredFunctions.length;
	for (var requiredFunctionIndex = 0; requiredFunctionIndex < requiredFunctionCount; requiredFunctionIndex++)
	{
		var requiredFunctionName = requiredFunctions[requiredFunctionIndex];
		var requiredFunctionNameSplit = requiredFunctionName.split(".");
		var requiredFunctionNameSplitCount = requiredFunctionNameSplit.length;

		var requiredFunctionNameObject = window;
		for (var requiredFunctionNameSplitIndex = 0;
			 requiredFunctionNameSplitIndex < requiredFunctionNameSplitCount;
			 requiredFunctionNameSplitIndex++)
		{
			var requiredFunctionNameSplitSegment = requiredFunctionNameSplit[requiredFunctionNameSplitIndex];
			if (requiredFunctionNameObject && requiredFunctionNameObject[requiredFunctionNameSplitSegment])
			{
				requiredFunctionNameObject = requiredFunctionNameObject[requiredFunctionNameSplitSegment];
			}
			else
			{
				break;
			}
		}

		requiredFunctionsAvailable = (requiredFunctionsAvailable && (typeof requiredFunctionNameObject === "function"));
	}

	return requiredFunctionsAvailable;
};

Spasm.Features.supportsWebGL = function()
{
	var supportsWebGL = !!window.WebGLRenderingContext;
	return supportsWebGL;
};

Spasm.Features.prototype.supportsFloatingPointTextures = function()
{
	return this.floatingPointTextureExtensionStatus;
};

Spasm.Features.prototype.canRender = function()
{
	var gl = this.gl;
	var canRender = (Spasm.Features.supportsWebGL()
					 && gl
					 && this.requiredShaderValueCountSupported
					 && this.requiredExtensionsSupported
					 && this.requiredFunctionsSupported
					 && !gl.isContextLost());
	return canRender;
};

Spasm.Features.prototype.checkMaxShaderValues = function(gl)
{
	Spasm.assertWebGLContext(gl);

	var requiredShaderValueCountSupported = true;

	var maxVertexShaderUniformVectorCount = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
	var maxVertexShaderAttributeCount = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

	this.shaderSupport.vertex.uniformVectors = maxVertexShaderUniformVectorCount;
	this.shaderSupport.vertex.attributes = maxVertexShaderAttributeCount;

	// vertex shader
	// uniforms - camera matrix (3), animation transforms (3 * 72 = 216)

	var requiredVertexShaderUniformVectorCount = 250;
	if (maxVertexShaderUniformVectorCount < requiredVertexShaderUniformVectorCount)
	{
		console.log("insufficient vertex shader uniform vector count " +
					"(require " + requiredVertexShaderUniformVectorCount + ", " +
					"have " + maxVertexShaderUniformVectorCount + ")");
		requiredShaderValueCountSupported = false;
	}

	// attributes - position/normal/tangent (3), texcoords (2), color (1), blend indices/weights (2)

	var requiredVertexShaderAttributeCount = 3 + 2 + 1 + 2;
	if (maxVertexShaderAttributeCount < requiredVertexShaderAttributeCount)
	{
		console.log("insufficient vertex shader attribute count " +
					"(require " + requiredVertexShaderAttributeCount + ", " +
					"have " + maxVertexShaderAttributeCount + ")");
		requiredShaderValueCountSupported = false;
	}

	var maxFragmentShaderUniformVectorCount = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
	var maxFragmentShaderVaryingVectorCount = gl.getParameter(gl.MAX_VARYING_VECTORS);
	var maxFragmentShaderTextureCount = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

	this.shaderSupport.fragment.uniformVectors = maxFragmentShaderUniformVectorCount;
	this.shaderSupport.fragment.varyingVectors = maxFragmentShaderVaryingVectorCount;
	this.shaderSupport.fragment.textureCount = maxFragmentShaderTextureCount;

	// fragment shader
	// uniforms - diffuse/normal/gearstack textures, dye textures, change colors (2)

	var requiredFragmentShaderUniformVectorCount = 2;
	if (maxFragmentShaderUniformVectorCount < requiredFragmentShaderUniformVectorCount)
	{
		console.log("insufficient fragment shader uniform vector count " +
					"(require " + requiredFragmentShaderUniformVectorCount + ", " +
					"have " + maxFragmentShaderUniformVectorCount + ")");
		requiredShaderValueCountSupported = false;
	}

	// varyings - normal/tangent (2), texcoords (2), color (1)
	var requiredFragmentShaderVaryingVectorCount = 2 + 2 + 1;
	if (maxFragmentShaderVaryingVectorCount < requiredFragmentShaderVaryingVectorCount)
	{
		console.log("insufficient fragment shader varying vector count " +
					"(require " + requiredFragmentShaderVaryingVectorCount + ", " +
					"have " + maxFragmentShaderVaryingVectorCount + ")");
		requiredShaderValueCountSupported = false;
	}

	// texture image units - diffuse/normal/gearstack (3), dye diffuse/normal (2), decal (1)
	var requiredFragmentShaderTextureCount = 3 + 2 + 1;
	if (maxFragmentShaderTextureCount < requiredFragmentShaderTextureCount)
	{
		console.log("insufficient fragment shader texture count " +
					"(require " + requiredFragmentShaderTextureCount + ", " +
					"have " + maxFragmentShaderTextureCount + ")");
		requiredShaderValueCountSupported = false;
	}

	return requiredShaderValueCountSupported;
};

Spasm.Features.prototype.checkContextAttributes = function(gl)
{
	Spasm.assertWebGLContext(gl);

	var contextAttributes = gl.getContextAttributes();

	Spasm.assertValid(contextAttributes, "invalid context attributes");
};

Spasm.Features.prototype.checkExtensions = function(gl)
{
	Spasm.assertWebGLContext(gl);

	var supportedExtensions = gl.getSupportedExtensions();
	var requiredExtensions = this.requiredExtensions;
	var optionalExtensions = this.optionalExtensions;

	var requiredExtensionStatus = this.extensionStatus(requiredExtensions, supportedExtensions);
	this.optionalExtensionStatus = this.extensionStatus(optionalExtensions, supportedExtensions);

	this.floatingPointTextureExtensionStatus = supportedExtensions.indexOf(this.floatingPointTextureExtensionName);

	return requiredExtensionStatus;
};

Spasm.Features.prototype.extensionStatus = function(extensions, supportedExtensions)
{
	Spasm.assertStringArray(extensions);
	Spasm.assertStringArray(supportedExtensions);

	var extensionStatus = {};

	var extensionCount = extensions.length;
	for (var extensionIndex = 0; extensionIndex < extensionCount; extensionIndex++)
	{
		var extension = extensions[extensionIndex];
		var supportedExtensionIndex = supportedExtensions.indexOf(extension);
		extensionStatus[extension] = (supportedExtensionIndex >= 0);
	}

	return extensionStatus;
};
