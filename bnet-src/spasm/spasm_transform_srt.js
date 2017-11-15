// spasm_transform_srt.js

var Spasm = Spasm || {};

Spasm.TransformSRT = function(scale, rotation, translation)
{
    scale = scale || 1.0;
    rotation = rotation || [0.0, 0.0, 0.0, 1.0];
    translation = translation || [0.0, 0.0, 0.0];

    this.scale = scale;
    this.rotation = quat.create();
    this.translation = vec3.create();

    quat.copy(this.rotation, rotation);
    vec3.copy(this.translation, translation);
};

Spasm.TransformSRT.prototype = {};

Spasm.TransformSRT.prototype.copy = function(srt)
{
    Spasm.assertInstance(srt, Spasm.TransformSRT);

    this.scale = srt.scale;
    this.rotation.copy(srt.rotation);
    this.translation.copy(srt.translation);
};

Spasm.TransformSRT.prototype.multiply = function(left, right)
{
    Spasm.assertInstance(left, Spasm.TransformSRT);
    Spasm.assertInstance(left, Spasm.TransformSRT);

    quat.multiply(this.rotation, left.rotation, right.rotation);

    this.scale = left.scale * right.scale;

    vec3.copy(this.translation, right.translation);
    vec3.transformQuat(this.translation, this.translation, left.rotation);
    vec3.scale(this.translation, this.translation, left.scale);
    vec3.add(this.translation, this.translation, left.translation);
};

Spasm.TransformSRT.prototype.setMatrix = function(out)
{
    var scale = this.scale;
    var translation = this.translation;

    mat4.fromQuat(out, this.rotation);
    mat4.scale(out, out, [scale, scale, scale]);

    out[12] = translation[0];
    out[13] = translation[1];
    out[14] = translation[2];

    return out;
};
