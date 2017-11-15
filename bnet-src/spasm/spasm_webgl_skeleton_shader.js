// spasm_webgl_skeleton_shader.js

var Spasm = Spasm || {};

Spasm.SkeletonShader = function(gl)
{
    Spasm.assertWebGLContext(gl);

    this.gl = gl;

    var inputTypes = Spasm.Shader.InputTypes;
    var valueTypes = Spasm.Shader.ValueTypes;

    this.uniforms =
    {
        projectionMatrix : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.mat4, "u_projection_matrix"),
        modelMatrix : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.mat4, "u_model_matrix"),
        viewMatrix : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.mat4, "u_view_matrix"),
        vertexColor : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec4, "u_vertex_color"),
        pointSize : new Spasm.ShaderInput(inputTypes.uniform, valueTypes.float, "u_point_size")
    };

    this.attributes =
    {
        boneIndex : new Spasm.ShaderInput(inputTypes.attribute, valueTypes.float, "a_bone_index"),
        vertexColor : new Spasm.ShaderInput(inputTypes.attribute, valueTypes.vec4, "a_vertex_color")
    };

    this.varyings =
    {
        vertexColor : new Spasm.ShaderInput(inputTypes.varying, valueTypes.vec4, "v_vertex_color")
    };

    this.vertexShaders = {};
    this.vertexShaderInputs = {};
    this.vertexShaderSources = {};

    this.fragmentShaders = {};
    this.fragmentShaderInputs = {};
    this.fragmentShaderSources = {};

    this.shaderPrograms = {};
};

Spasm.SkeletonShader.prototype = {};

Spasm.SkeletonShader.prototype.maxBoneCount = 72;

Spasm.SkeletonShader.prototype.getBoneTransformsUniform = function(boneCount)
{
    Spasm.assertInteger(boneCount);
    Spasm.assert(boneCount > 0);
    Spasm.assert(boneCount <= this.maxBoneCount);

    var inputTypes = Spasm.Shader.InputTypes;
    var valueTypes = Spasm.Shader.ValueTypes;

    var boneTransformsUniform = new Spasm.ShaderInput(
        inputTypes.uniform, valueTypes.vec4, "u_bone_transforms", boneCount * 3);

    return boneTransformsUniform;
};

Spasm.SkeletonShader.prototype.getVertexShaderKey = function(boneCount, hasVertexColorAttribute)
{
    Spasm.assertInteger(boneCount);
    Spasm.assertBoolean(hasVertexColorAttribute);

    var vertexShaderKey = "" + boneCount + hasVertexColorAttribute;

    return vertexShaderKey;
};

Spasm.SkeletonShader.prototype.getFragmentShaderKey = function(hasVertexColorAttribute)
{
    Spasm.assertBoolean(hasVertexColorAttribute);

    var fragmentShaderKey = "" + hasVertexColorAttribute;

    return fragmentShaderKey;
};

Spasm.SkeletonShader.prototype.getShaderProgramKey = function(boneCount, hasVertexColorAttribute)
{
    Spasm.assertInteger(boneCount);
    Spasm.assertBoolean(hasVertexColorAttribute);

    var shaderProgramKey = "" + boneCount + hasVertexColorAttribute;

    return shaderProgramKey;
};

Spasm.SkeletonShader.prototype.getVertexShaderInput = function(boneCount, hasVertexColorAttribute)
{
    Spasm.assertInteger(boneCount);
    Spasm.assertBoolean(hasVertexColorAttribute);

    var vertexShaderKey = this.getVertexShaderKey(boneCount, hasVertexColorAttribute);
    var vertexShaderInput = this.vertexShaderInputs[vertexShaderKey];
    if (!vertexShaderInput)
    {
        var uniforms = this.uniforms;
        var attributes = this.attributes;
        var varyings = this.varyings;

        vertexShaderInput = [];
        vertexShaderInput.push(uniforms.projectionMatrix);
        vertexShaderInput.push(uniforms.modelMatrix);
        vertexShaderInput.push(uniforms.viewMatrix);
        vertexShaderInput.push(uniforms.pointSize);

        var boneTransformsUniform = this.getBoneTransformsUniform(boneCount);
        vertexShaderInput.push(boneTransformsUniform);

        if (hasVertexColorAttribute)
        {
            vertexShaderInput.push(attributes.vertexColor);
            vertexShaderInput.push(varyings.vertexColor);
        }
        else
        {
            vertexShaderInput.push(uniforms.vertexColor);
        }

        vertexShaderInput.push(attributes.boneIndex);

        this.vertexShaderInputs[vertexShaderKey] = vertexShaderInput;
    }

    return vertexShaderInput;
};

Spasm.SkeletonShader.prototype.getVertexShaderSource = function(boneCount, hasVertexColorAttribute)
{
    Spasm.assertInteger(boneCount);
    Spasm.assertBoolean(hasVertexColorAttribute);

    var vertexShaderKey = this.getVertexShaderKey(boneCount, hasVertexColorAttribute);
    var vertexShaderSource = this.vertexShaderSources[vertexShaderKey];
    if (!vertexShaderSource)
    {
        var lines = [];

        // header
        lines.push("// Spasm.SkeletonShader vertex shader");
        lines.push("// key = " + vertexShaderKey);
        lines.push("");

        // precision
        lines.push("precision mediump float;");
        lines.push("");

        lines.push("// inputs");
        var vertexShaderInputs = this.getVertexShaderInput(boneCount, hasVertexColorAttribute);
        var vertexShaderInputCount = vertexShaderInputs.length;

        for (var vertexShaderInputIndex = 0; vertexShaderInputIndex < vertexShaderInputCount; vertexShaderInputIndex++)
        {
            var vertexShaderInput = vertexShaderInputs[vertexShaderInputIndex];
            lines.push(vertexShaderInput.declaration);
        }
        lines.push("");

        // functions

        // main
        lines.push("void main()");
        lines.push("{");

        lines.push("// bone transform");
        lines.push("int bone_index = int(a_bone_index);");
        lines.push("int stride_bone_index = 3 * bone_index;");
        lines.push("mat4 bone_transform = mat4(" +
            "u_bone_transforms[stride_bone_index + 0]," +
            "u_bone_transforms[stride_bone_index + 1]," +
            "u_bone_transforms[stride_bone_index + 2]," +
            "vec4(0.0, 0.0, 0.0, 1.0));");
        lines.push("vec4 bone_position = vec4(" +
            "bone_transform[0][3]," +
            "bone_transform[1][3]," +
            "bone_transform[2][3]," +
            "1.0);");
        // lines.push("vec4 bone_position = vec4(" +
        //     "bone_transform[3][0]," +
        //     "bone_transform[3][1]," +
        //     "bone_transform[3][2]," +
        //     "1.0);");
        lines.push("");

        lines.push("// position");
        lines.push("vec4 position = (u_projection_matrix * u_view_matrix * u_model_matrix) * bone_position;");
        lines.push("gl_Position = position;");
        lines.push("");

        lines.push("gl_PointSize = u_point_size;");

        if (hasVertexColorAttribute)
        {
            lines.push("v_vertex_color = a_vertex_color;");
            lines.push("");
        }

        lines.push("}");
        lines.push("");

        vertexShaderSource = lines.join("\n");
        this.vertexShaderSources[vertexShaderKey] = vertexShaderSource;
    }

    return vertexShaderSource;
};

Spasm.SkeletonShader.prototype.getFragmentShaderInput = function(hasVertexColorAttribute)
{
    var fragmentShaderKey = this.getFragmentShaderKey(hasVertexColorAttribute);
    var fragmentShaderInput = this.fragmentShaderInputs[fragmentShaderKey];
    if (!fragmentShaderInput)
    {
        var uniforms = this.uniforms;
        var varyings = this.varyings;

        fragmentShaderInput = [];

        if (hasVertexColorAttribute)
        {
            fragmentShaderInput.push(varyings.vertexColor);
        }
        else
        {
            fragmentShaderInput.push(uniforms.vertexColor);
        }

        this.fragmentShaderInputs[fragmentShaderKey] = fragmentShaderInput;
    }

    return fragmentShaderInput;
};


Spasm.SkeletonShader.prototype.getFragmentShaderSource = function(hasVertexColorAttribute)
{
    var fragmentShaderKey = this.getFragmentShaderKey(hasVertexColorAttribute);

    var fragmentShaderSource = this.fragmentShaderSources[fragmentShaderKey];
    if (!fragmentShaderSource)
    {
        var lines = [];

        // header
        lines.push("// Spasm.SkeletonShader fragment shader");
        lines.push("// key = " + fragmentShaderKey);
        lines.push("");

        // precision
        lines.push("precision mediump float;");
        lines.push("");

        lines.push("// inputs");
        var fragmentShaderInputs = this.getFragmentShaderInput(hasVertexColorAttribute);
        var fragmentShaderInputCount = fragmentShaderInputs.length;

        for (var fragmentShaderInputIndex = 0;
             fragmentShaderInputIndex < fragmentShaderInputCount;
             fragmentShaderInputIndex++)
        {
            var fragmentShaderInput = fragmentShaderInputs[fragmentShaderInputIndex];
            lines.push(fragmentShaderInput.declaration);
        }
        lines.push("");

        // main
        lines.push("void main()");
        lines.push("{");

        if (hasVertexColorAttribute)
        {
            lines.push("gl_FragColor = v_vertex_color;");
        }
        else
        {
            lines.push("gl_FragColor = u_vertex_color;");
        }

        lines.push("}");
        lines.push("");

        fragmentShaderSource = lines.join("\n");
        this.fragmentShaderSources[fragmentShaderKey] = fragmentShaderSource;
    }

    return fragmentShaderSource;
};

Spasm.SkeletonShader.prototype.getFragmentShader = function(hasVertexColorAttribute)
{
    var fragmentShaderKey = this.getFragmentShaderKey(hasVertexColorAttribute);

    var fragmentShader = this.fragmentShaders[fragmentShaderKey];
    if (!fragmentShader)
    {
        var fragmentShaderInputs = this.getFragmentShaderInput(hasVertexColorAttribute);
        var fragmentShaderSource = this.getFragmentShaderSource(hasVertexColorAttribute);

        var gl = this.gl;
        fragmentShader = new Spasm.Shader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource, fragmentShaderInputs);

        this.fragmentShaders[fragmentShaderKey] = fragmentShader;
    }

    return fragmentShader;
};

Spasm.SkeletonShader.prototype.getVertexShader = function(boneCount, hasVertexColorAttribute)
{
    Spasm.assertInteger(boneCount);
    Spasm.assertBoolean(hasVertexColorAttribute);

    var vertexShaderKey = this.getVertexShaderKey(boneCount, hasVertexColorAttribute);
    var vertexShader = this.vertexShaders[vertexShaderKey];
    if (!vertexShader)
    {
        var vertexShaderInput = this.getVertexShaderInput(boneCount, hasVertexColorAttribute);
        var vertexShaderSource = this.getVertexShaderSource(boneCount, hasVertexColorAttribute);

        var gl = this.gl;
        vertexShader = new Spasm.Shader(gl, gl.VERTEX_SHADER, vertexShaderSource, vertexShaderInput);

        this.vertexShaders[vertexShaderKey] = vertexShader;
    }

    return vertexShader;
};

Spasm.SkeletonShader.prototype.getShaderProgram = function(boneCount, hasVertexColorAttribute)
{
    var shaderProgramKey = this.getShaderProgramKey(boneCount, hasVertexColorAttribute);
    var shaderProgram = this.shaderPrograms[shaderProgramKey];

    if (!shaderProgram)
    {
        var vertexShader = this.getVertexShader(boneCount, hasVertexColorAttribute);
        var fragmentShader = this.getFragmentShader(hasVertexColorAttribute);

        var gl = this.gl;
        shaderProgram = new Spasm.ShaderProgram(gl, vertexShader, fragmentShader);
        this.shaderPrograms[shaderProgramKey] = shaderProgram;
    }

    return shaderProgram;
};
