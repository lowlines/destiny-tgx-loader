// spasm_webgl_shader_input.js

var Spasm = Spasm || {};

// used for uniforms, attributes, and varyings
Spasm.ShaderInput = function (inputType, valueType, name, count)
{
	count = count || 1;

	Spasm.assertString(inputType);
	Spasm.assertString(valueType);
	Spasm.assertString(name);
	Spasm.assertInteger(count);

	Spasm.assert(count >= 1);
	Spasm.assert(inputType in Spasm.Shader.InputTypes);
	Spasm.assert(valueType in Spasm.Shader.ValueTypes);

	this.inputType = inputType;
	this.name = name;
	this.valueType = valueType;
	this.count = count;

	this.isArray = this.count > 1;

	this.declaration =
		this.inputType + " " +
		this.valueType + " " +
		this.name +
		(this.isArray ? "[" + this.count + "]" : "") + ";";
};

Spasm.ShaderInput.prototype =
{
	constructor : Spasm.ShaderInput
};

Spasm.ShaderInput.prototype.equals = function (input)
{
	Spasm.assertInstance(input, Spasm.ShaderInput);

	var isEqual = ((this.inputType === input.inputType)
		&& this.name === input.name
		&& this.valueType === input.valueType
		&& this.count === input.count);

	// could probably just compare declarations
	Spasm.assertEqual(isEqual, this.declaration === input.declaration);

	return isEqual;
};
