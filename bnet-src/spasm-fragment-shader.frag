precision mediump float;

uniform sampler2D u_texture_diffuse;
uniform sampler2D u_texture_normal;
uniform sampler2D u_texture_gearstack;
uniform vec4 u_change_color;
uniform vec3 u_camera_position;
uniform vec3 u_light_position;
varying vec3 v_position;
varying vec3 v_normal;
varying vec3 v_binormal;
varying vec3 v_tangent;
varying vec2 v_texcoord;
uniform sampler2D u_texture_dye_diffuse;
uniform sampler2D u_texture_dye_normal;
varying vec2 v_texcoord2;

#define saturate(value) clamp(value, 0.0, 1.0)
const float gamma_correction_power = 2.2;
const float gamma_correction_power_inverse = 1.0/2.2;
vec4 blend_overlay(vec4 back, vec4 front) {
	return front * saturate(back * 4.0) + saturate(back - 0.25);
}

void main() {
	vec4 color_diffuse = pow(texture2D(u_texture_diffuse, v_texcoord), vec4(gamma_correction_power));
	vec2 normal_sample_raw = texture2D(u_texture_normal, v_texcoord).xy;
	vec2 normal_sample = normal_sample_raw;
	vec3 tangent_world_space = normalize(v_tangent);
	vec3 binormal_world_space = normalize(v_binormal);
	vec3 normal_world_space = normalize(v_normal);
	normal_sample = normal_sample * 2.0 - 1.0;
	vec4 color_dye_diffuse_texture = texture2D(u_texture_dye_diffuse, v_texcoord2);
	float dye_alpha = color_dye_diffuse_texture.w;
	float dye_color_normalize = (1.0 - dye_alpha) * 0.5;
	vec4 color_dye_diffuse = pow(vec4(
		color_dye_diffuse_texture.x * dye_alpha + dye_color_normalize,
		color_dye_diffuse_texture.y * dye_alpha + dye_color_normalize,
		color_dye_diffuse_texture.z * dye_alpha + dye_color_normalize, 1.0
		), vec4(gamma_correction_power)
	);
	color_diffuse = blend_overlay(color_dye_diffuse, color_diffuse);
	vec4 color_dye_normal = texture2D(u_texture_dye_normal, v_texcoord2);
	color_dye_normal = color_dye_normal * 2.0 - 1.0;
	normal_sample = normal_sample + color_dye_normal.xy;
	vec4 color_gearstack = texture2D(u_texture_gearstack, v_texcoord);
	float z = sqrt(saturate(1.0 - dot(normal_sample, normal_sample)));
	vec3 normal_tangent_space = vec3(normal_sample.x, normal_sample.y, z);
	vec3 bumpy_normal = (tangent_world_space * normal_tangent_space.x) + (binormal_world_space * normal_tangent_space.y) + (normal_world_space * normal_tangent_space.z);
	vec3 camera_direction = normalize(u_camera_position - v_position);
	float nDotL = saturate(dot(camera_direction, bumpy_normal) * (-1.0 + 2.0 * float(gl_FrontFacing)));
	vec3 reflection = (bumpy_normal * (nDotL * 2.00)) - camera_direction;
	float rDotV = max(0.0, dot(reflection, camera_direction));
	vec3 specular = saturate(vec3(0.2,0.2,0.2) * pow(rDotV, color_gearstack.g * 255.0)) * color_gearstack.g;
	vec4 blend_color_uncorrected = mix(color_diffuse,blend_overlay(color_diffuse, u_change_color),color_gearstack.r);
	vec3 blend_color = pow(blend_color_uncorrected.xyz, vec3(gamma_correction_power_inverse));
	vec3 ambient_color = 0.60 * blend_color;
	vec3 diffuse_color = 0.40 * (nDotL * blend_color);
	gl_FragColor = vec4(ambient_color + diffuse_color + specular, 1.0);
}