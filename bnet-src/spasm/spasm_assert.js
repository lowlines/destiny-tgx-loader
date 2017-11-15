// spasm_assert.js

var Spasm = Spasm || {};

// js asserts
// http://stackoverflow.com/questions/15313418/javascript-assert
Spasm.assert = function(condition, message)
{
	if (!condition)
	{
		throw message || "assertion failed";
	}
};

Spasm.assertFalse = function(condition, message)
{
	Spasm.assert(!condition, message);
};

Spasm.assertDefined = function(value, message)
{
	Spasm.assert(typeof value !== "undefined", message);
};

Spasm.assertNotNull = function(value, message)
{
	Spasm.assert(value !== null, message);
};

Spasm.assertValid = function(value, message)
{
	Spasm.assertDefined(value, message);
	Spasm.assertNotNull(value, message);
};

Spasm.assertEqual = function(a, b, message)
{
	Spasm.assert(a === b, message);
};

Spasm.assertType = function(object, typeName, message)
{
	Spasm.assert(typeof object === typeName, message);
};

Spasm.isArray = function(array)
{
	return Object.prototype.toString.call(array) === "[object Array]";
};

Spasm.assertInstance = function(object, type, message)
{
	Spasm.assertValid(object, message);
	Spasm.assert(object instanceof type, message);
};

Spasm.assertArray = function(array, message)
{
	Spasm.assertValid(array, message);
	Spasm.assert(Spasm.isArray(array), message);
};

Spasm.assertArrayBuffer = function(arrayBuffer, message)
{
	Spasm.assertInstance(arrayBuffer, ArrayBuffer, message);
};

Spasm.assertWebGLContext = function(gl, message)
{
	if (window.gli)
	{
		// gli and CaptureContext are used for WebGL Inspector debugging
		// however, the type isn't part of the window, so we can't use a type-check
		// Spasm.assertInstance(gl, CaptureContext, message);
		Spasm.assertValid(gl, message);
	}
	else
	{
		Spasm.assertInstance(gl, WebGLRenderingContext, message);
	}
};

Spasm.assertCanvas = function(canvas, message)
{
	Spasm.assertValid(canvas, message);
	Spasm.assert(canvas.tagName === "CANVAS");

	// $TODO more robust checks for a valid canvas object
};

Spasm.assertDOMEvent = function(event)
{
	Spasm.assertValid(event);

	// $TODO more robust checks for a valid DOM event object
};

Spasm.assertFunction = function(value, message)
{
	Spasm.assertValid(value, message);
	Spasm.assertType(value, "function", message);
};

Spasm.assertNumber = function(number, message)
{
	Spasm.assertValid(number, message);
	Spasm.assertType(number, "number", message);
};

Spasm.assertInteger = function(number, message)
{
	Spasm.assertNumber(number, message);
	Spasm.assert(number % 1 === 0, message);
};

Spasm.assertBoolean = function(boolean, message)
{
	Spasm.assertValid(boolean, message);
	Spasm.assertType(boolean, "boolean", message);
};

Spasm.assertString = function(string, message)
{
	Spasm.assertValid(string, message);
	Spasm.assertType(string, "string", message);
};

Spasm.assertStringArray = function(array, message)
{
	Spasm.assertArray(array, message);
	var arrayLength = array.length;
	for (var index = 0; index < arrayLength; index++)
	{
		var object = array[index];
		Spasm.assertString(object, message);
	}
};

Spasm.assertPath = function(path, message)
{
	Spasm.assertString(path, message);
};

Spasm.assertImage = function(image, message)
{
	Spasm.assertValid(image, message);
};

Spasm.assertShaderUniform = function(uniform, message)
{
	Spasm.assertInstance(uniform, WebGLUniformLocation, message);
};

Spasm.assertArrayInstances = function(array, type, message)
{
	Spasm.assertArray(array, message);
	var arrayLength = array.length;
	for (var index = 0; index < arrayLength; index++)
	{
		var object = array[index];
		Spasm.assertInstance(object, type, message);
	}
};

Spasm.assertCollectionInstances = function(collection, type, message)
{
	Spasm.assertValid(collection, message);
	for (var key in collection)
	{
		var value = collection[key];
		Spasm.assertInstance(value, type, message);
	}
};

// test asserts
Spasm.assert(true);
Spasm.assertFalse(false);
Spasm.assertValid({});
Spasm.assertString("");
Spasm.assertArray([]);
Spasm.assertEqual(2, 2.0);
Spasm.assertInteger(12345678901234567890);
Spasm.assertNumber(0.0, "zero is a number");
Spasm.assertBoolean(false, "false is a boolean");
