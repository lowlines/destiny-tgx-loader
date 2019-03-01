# Vertex Shader
# ------------------------
precision mediump float;

uniform mat4 u_projection_matrix;
uniform mat4 u_model_matrix;
uniform mat4 u_view_matrix;
uniform vec4 u_drop_shadow_scale;
uniform vec4 u_drop_shadow_translation;
attribute vec4 a_position;
varying vec4 v_position;

void main() {
	mat4 model_view_matrix = u_view_matrix * u_model_matrix;
	mat4 camera_matrix = u_projection_matrix * model_view_matrix;
	vec4 position_transformed = vec4((a_position.x * u_drop_shadow_scale.x) + u_drop_shadow_translation.x,(a_position.y * u_drop_shadow_scale.y) + u_drop_shadow_translation.y,(a_position.z * u_drop_shadow_scale.z) + u_drop_shadow_translation.z,1.0);
	gl_Position = camera_matrix * position_transformed;
	v_position = a_position;
}


# Fragment Shader
# ------------------------
precision mediump float;

varying vec4 v_position;

void main() {
	float distance = (v_position.x * v_position.x)+ (v_position.y * v_position.y);
	float intensity = 1.0 - (distance * (5.0/3.0));
	gl_FragColor = vec4(0.0, 0.0, 0.0, intensity - 0.3);
}