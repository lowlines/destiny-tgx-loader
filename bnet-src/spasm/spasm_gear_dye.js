// spasm_gear_dye.js

var Spasm = Spasm || {};

Spasm.GearDye = function(dye, textures)
{
    Spasm.assertValid(dye);
    Spasm.assertCollectionInstances(textures, Spasm.Texture);

    this.dye = dye;
    this.textures = textures;

    this.identifier = dye.identifier;
    this.blendMode = dye.blend_mode;

    // slotTypeIndex is important for fragment shader change color
    this.slotTypeIndex = dye.slot_type_index;

    this.materialProperties =
    {
        primaryColor : dye.material_properties.primary_color,
        secondaryColor : dye.material_properties.secondary_color,
        detailTransform : dye.material_properties.detail_transform,
        detailNormalContributionStrength : dye.material_properties.detail_normal_contribution_strength,
        decalAlphaMapTransform : dye.material_properties.decal_alpha_map_transform,
        decalBlendOption : dye.material_properties.decal_blend_option,
        specularProperties : dye.material_properties.specular_properties,
        subsurfaceScatteringStrength : dye.material_properties.subsurface_scattering_strength
    };

    this.uniformDatas = this.getUniformDatas();
};

Spasm.GearDye.prototype = {};

Spasm.GearDye.prototype.bindTextures = function()
{
    var textures = this.textures;
    var textureKeys = Object.keys(textures);
    var textureCount = textureKeys.length;
    for (var textureIndex = 0; textureIndex < textureCount; textureIndex++)
    {
        var textureKey = textureKeys[textureIndex];
        var texture = textures[textureKey];

        texture.bindTexture();
    }
};

Spasm.GearDye.prototype.getUniformDatas = function()
{
    var inputTypes = Spasm.Shader.InputTypes;
    var valueTypes = Spasm.Shader.ValueTypes;

    var blendModeUniform = new Spasm.ShaderInput(inputTypes.uniform, valueTypes.int, "u_blend_mode");
    var changeColorUniform = new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec4, "u_change_color");

    var decalAlphaMapTransformUniform =
        new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec4, "u_decal_alpha_map_transform");
    var decalBlendOptionUniform =
        new Spasm.ShaderInput(inputTypes.uniform, valueTypes.int, "u_decal_blend_option");

    var detailNormalContributionStrengthUniform =
        new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec4, "u_detail_normal_contribution_strength");
    var detailTransformUniform =
        new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec4, "u_detail_transform");

    var specularPropertiesUniform =
        new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec4, "u_specular_properties");
    var subsurfaceScatteringStrengthUniform =
        new Spasm.ShaderInput(inputTypes.uniform, valueTypes.vec4, "u_subsurface_scattering_strength");

    var blendModeUniformData = new Spasm.UniformData(blendModeUniform, this.blendMode.value);

    var decalAlphaMapTransformUniformData =
        new Spasm.UniformData(decalAlphaMapTransformUniform, this.materialProperties.decalAlphaMapTransform);
    var decalBlendOptionUniformData =
        new Spasm.UniformData(decalBlendOptionUniform, this.materialProperties.decalBlendOption);

    var detailNormalContributionStrengthUniformData =
        new Spasm.UniformData(detailNormalContributionStrengthUniform,
            this.materialProperties.detailNormalContributionStrength);
    var detailTransformUniformData =
        new Spasm.UniformData(detailTransformUniform, this.materialProperties.detailTransform);

    var specularPropertiesUniformData =
        new Spasm.UniformData(specularPropertiesUniform, this.materialProperties.specularProperties);
    var subsurfaceScatteringStrengthUniformData =
        new Spasm.UniformData(subsurfaceScatteringStrengthUniform,
            this.materialProperties.subsurfaceScatteringStrength);

    var textureDyeDiffuseUniform =
        new Spasm.ShaderInput(inputTypes.uniform, valueTypes.sampler2D, "u_texture_dye_diffuse");
    var textureDyeNormalUniform =
        new Spasm.ShaderInput(inputTypes.uniform, valueTypes.sampler2D, "u_texture_dye_normal");
    var textureDyeDecalUniform =
        new Spasm.ShaderInput(inputTypes.uniform, valueTypes.sampler2D, "u_texture_dye_decal");

    var textureDyeDiffuseUniformData = new Spasm.UniformData(textureDyeDiffuseUniform, 3);
    var textureDyeNormalUniformData = new Spasm.UniformData(textureDyeNormalUniform, 4);
    var textureDyeDecalUniformData = new Spasm.UniformData(textureDyeDecalUniform, 5);

    var uniformDatas =
    [
        blendModeUniformData,
        decalAlphaMapTransformUniformData,
        decalBlendOptionUniformData,
        detailNormalContributionStrengthUniformData,
        detailTransformUniformData,
        specularPropertiesUniformData,
        subsurfaceScatteringStrengthUniformData,
        textureDyeDiffuseUniformData,
        textureDyeNormalUniformData,
        textureDyeDecalUniformData
    ];

    this.primaryColorUniformData =
        new Spasm.UniformData(changeColorUniform, this.materialProperties.primaryColor);
    this.secondaryColorUniformData =
        new Spasm.UniformData(changeColorUniform, this.materialProperties.secondaryColor);

    return uniformDatas;
};
