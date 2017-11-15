precision mediump float;

uniform mat4 u_projection_matrix;
uniform mat4 u_model_matrix;
uniform mat4 u_view_matrix;
uniform vec4 u_skinning_matrices[216];
uniform vec3 u_position_scale;
uniform vec3 u_position_offset;
uniform vec2 u_texcoord_scale;
uniform vec2 u_texcoord_offset;
attribute vec4 a_position;
attribute vec4 a_normal;
attribute vec4 a_tangent;
attribute vec2 a_texcoord;
uniform vec4 u_detail_transform;
attribute vec2 a_texcoord2;
varying vec3 v_position;
varying vec3 v_normal;
varying vec3 v_binormal;
varying vec3 v_tangent;
varying vec2 v_texcoord;
varying vec2 v_texcoord2;

mat4 transpose(mat4 inMatrix) {
	vec4 i0 = inMatrix[0];
	vec4 i1 = inMatrix[1];
	vec4 i2 = inMatrix[2];
	vec4 i3 = inMatrix[3];
	mat4 outMatrix = mat4(
		vec4(i0.x, i1.x, i2.x, i3.x),
		vec4(i0.y, i1.y, i2.y, i3.y),
		vec4(i0.z, i1.z, i2.z, i3.z),
		vec4(i0.w, i1.w, i2.w, i3.w)
	);
	return outMatrix;
}
mat4 get_bone_transform(int bone_index) {
	int stride_bone_index = bone_index * 3;
	vec4 i0 = u_skinning_matrices[stride_bone_index + 0];
	vec4 i1 = u_skinning_matrices[stride_bone_index + 1];
	vec4 i2 = u_skinning_matrices[stride_bone_index + 2];
	vec4 i3 = vec4(0.0, 0.0, 0.0, 1.0);
	mat4 bone_transform = mat4(
		vec4(i0.x, i1.x, i2.x, i3.x),
		vec4(i0.y, i1.y, i2.y, i3.y),
		vec4(i0.z, i1.z, i2.z, i3.z),
		vec4(i0.w, i1.w, i2.w, i3.w)
	);
	return bone_transform;
}

void main() {
	int bone_index = int((a_position.w * 32767.0) + 0.01);
	mat4 skinning_transform = get_bone_transform(bone_index);
	mat4 model_view_matrix = u_view_matrix * u_model_matrix;
	mat4 camera_matrix = u_projection_matrix * model_view_matrix;
	vec4 position_transformed = vec4(
		(a_position.x * u_position_scale.x) + u_position_offset.x,
		(a_position.y * u_position_scale.y) + u_position_offset.y,
		(a_position.z * u_position_scale.z) + u_position_offset.z,
		1.0
	);
	vec4 position_skinned = vec4((skinning_transform * position_transformed).xyz, 1.0);
	mat3 skinning_rotation_transform = mat3(skinning_transform);
	mat3 model_view_rotation_transform = mat3(model_view_matrix);
	vec3 object_space_normal = vec3(a_normal.xyz);
	vec3 object_space_tangent = vec3(a_tangent.xyz);
	vec3 object_space_binormal = vec3(cross(object_space_normal, object_space_tangent) * a_tangent.w);
	mat3 normal_transform = skinning_rotation_transform;
	v_normal = model_view_rotation_transform * (skinning_rotation_transform * object_space_normal);
	v_tangent = model_view_rotation_transform * (skinning_rotation_transform * object_space_tangent);
	v_binormal = model_view_rotation_transform * (skinning_rotation_transform * object_space_binormal);
	vec2 texcoord = vec2(
		(a_texcoord.x * u_texcoord_scale.x) + u_texcoord_offset.x,
		(a_texcoord.y * u_texcoord_scale.y) + u_texcoord_offset.y
	);
	v_position = (model_view_matrix * position_skinned).xyz;
	v_texcoord = texcoord;
	v_texcoord2 = ((texcoord * a_texcoord2) * u_detail_transform.xy) + u_detail_transform.zw;
	gl_Position = camera_matrix * position_skinned;
}