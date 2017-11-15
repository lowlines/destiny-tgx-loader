// spasm_webgl_shader_uniform_data.js

var Spasm = Spasm || {};

Spasm.UniformData = function(shaderInput, data)
{
    data = data || null;

    Spasm.assertInstance(shaderInput, Spasm.ShaderInput);
    // Spasm.assertValid(data);

    this.shaderInput = shaderInput;
    this.data = data;
};

Spasm.UniformData.prototype = {};

