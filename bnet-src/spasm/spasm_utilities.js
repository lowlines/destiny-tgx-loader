// spasm_utilities.js

var Spasm = Spasm || {};

Spasm.Utilities = {};

// http://stackoverflow.com/questions/280634/endswith-in-javascript
Spasm.Utilities.stringEndsWith = function(string, suffix)
{
	Spasm.assertString(string);
	Spasm.assertString(suffix);

	var endsWithSuffix = string.indexOf(suffix, string.length - suffix.length) !== -1;
	return endsWithSuffix;
};

Spasm.Utilities.jsonFromCharBuffer = function(charBuffer)
{
	var charBufferString = Spasm.Utilities.stringFromCharBuffer(charBuffer);

	var jsonObject = null;

	try
	{
		jsonObject = JSON.parse(charBufferString);
	}
	catch (exception)
	{
		console.log("error parsing json from char buffer: " + exception);
	}

	return jsonObject;
};

Spasm.Utilities.stringFromCharBuffer = function(charBuffer)
{
	Spasm.assertInstance(charBuffer, Uint8Array);

	var charBufferByteCount = charBuffer.byteLength;
	var charBufferString = "";
	for (var charBufferIndex = 0; charBufferIndex < charBufferByteCount; charBufferIndex++)
	{
		charBufferString += String.fromCharCode(charBuffer[charBufferIndex]);
	}

	return charBufferString;
};