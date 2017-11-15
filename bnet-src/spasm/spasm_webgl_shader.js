// spasm_webgl_shader.js

var Spasm = Spasm || {};

Spasm.Shader = function(gl, type, sourceLines, inputs)
{
    Spasm.assertWebGLContext(gl);
    Spasm.assertNumber(type);
    Spasm.assertArray(sourceLines);
    Spasm.assertArrayInstances(inputs, Spasm.ShaderInput);

    var source = sourceLines.join("\n");

    this.gl = gl;
    this.type = type;
    this.lines = sourceLines;
    this.source = source;
    this.inputs = inputs;

    this.assertInputs();

    this.uniforms = [];
    this.attributes = [];
    this.varyings = [];

    var inputCount = inputs.length;
    for (var inputIndex = 0; inputIndex < inputCount; inputIndex++)
    {
        var input = inputs[inputIndex];
        switch(input.inputType)
        {
            case Spasm.Shader.InputTypes.uniform:
                this.uniforms.push(input);
                break;
            case Spasm.Shader.InputTypes.attribute:
                this.attributes.push(input);
                break;
            case Spasm.Shader.InputTypes.varying:
                this.varyings.push(input);
                break;
            default:
                Spasm.assert(false);
                break;
        }
    }

    this.shader = gl.createShader(type);
    Spasm.assertInstance(this.shader, WebGLShader);

    this.compile();
};

Spasm.Shader.InputTypes =
{
    uniform : "uniform",
    attribute : "attribute",
    varying : "varying"
};

// http://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf
Spasm.Shader.ValueTypes =
{
    bool : "bool",
    int : "int",
    float : "float",

    vec2 : "vec2",
    vec3 : "vec3",
    vec4 : "vec4",

    bvec2 : "bvec2",
    bvec3 : "bvec3",
    bvec4 : "bvec4",

    ivec2 : "ivec2",
    ivec3 : "ivec3",
    ivec4 : "ivec4",

    mat2 : "mat2",
    mat3 : "mat3",
    mat4 : "mat4",

    sampler2D : "sampler2D",
    samplerCube : "samplerCube"
};

Spasm.Shader.prototype =
{
    constructor : Spasm.Shader
};

Spasm.Shader.prototype.compile = function()
{
    var gl = this.gl;
    var source = this.source;
    var shader = this.shader;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    this.assertCompileStatus();
};

Spasm.Shader.prototype.assertCompileStatus = function()
{
    var gl = this.gl;
    var shader = this.shader;

    var compileSuccess = true; // gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compileSuccess)
    {
        var shaderInfoLog = gl.getShaderInfoLog(shader);
        throw shaderInfoLog;
    }
};

Spasm.Shader.prototype.assertInputs = function()
{
    var source = this.source;
    var inputs = this.inputs;

    var inputCount = inputs.length;
    for (var index = 0; index < inputCount; index++)
    {
        var input = inputs[index];
        var declaration = input.declaration;
        var position = source.indexOf(declaration);
        Spasm.assert(position >= 0);
    }
};
