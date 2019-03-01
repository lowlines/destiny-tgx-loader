FragmentShader #define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
const float gamma_correction_power = 2.2;
const float gamma_correction_power_inverse = 1.0/2.2;
vec4 blend_overlay(vec4 back, vec4 front) {
return front * saturate(back * 4.0) + saturate(back - 0.25);
}
vec4 blend_multiply(vec4 back, vec4 front) {
return back * front;
}
vec4 blend_screen(vec4 back, vec4 front) {
vec4 back_screen = vec4(1.0 - back.x, 1.0 - back.y, 1.0 - back.z, 1.0);
vec4 front_screen = vec4(1.0 - front.x, 1.0 - front.y, 1.0 - front.z, 1.0);
vec4 screen = back_screen * front_screen;
return vec4(1.0 - screen.x, 1.0 - screen.y, 1.0 - screen.z, 1.0);
}
vec4 blend_hard_light(vec4 back, vec4 front) {
return vec4(
front.x < 0.5 ? (2.0 * back.x * front.x) : (1.0 - 2.0 * (1.0 - back.x) * (1.0 - front.x)),
front.y < 0.5 ? (2.0 * back.y * front.y) : (1.0 - 2.0 * (1.0 - back.y) * (1.0 - front.y)),
front.z < 0.5 ? (2.0 * back.z * front.z) : (1.0 - 2.0 * (1.0 - back.z) * (1.0 - front.z)),
1.0
);
}
#ifdef USE_DYE
uniform sampler2D gearstackMap;
uniform float blendMode;
uniform bool usePrimaryColor;
uniform vec3 primaryColor;
uniform vec3 secondaryColor;
uniform vec3 wornColor;
#endif
#ifdef USE_DETAIL
uniform sampler2D dyeDiffuseMap;
varying vec2 vUv2;
#endif
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
#ifdef USE_DYE
diffuseColor = pow(diffuseColor, vec4(gamma_correction_power));
#ifdef USE_DETAIL
vec4 color_dye_diffuse_texture = texture2D(dyeDiffuseMap, vUv2);
float dye_alpha = color_dye_diffuse_texture.w;
float dye_color_normalize = (1.0 - dye_alpha) * 0.5;
vec4 color_dye_diffuse = pow(vec4(color_dye_diffuse_texture.x * dye_alpha + dye_color_normalize, color_dye_diffuse_texture.y * dye_alpha + dye_color_normalize, color_dye_diffuse_texture.z * dye_alpha + dye_color_normalize, 1.0), vec4(gamma_correction_power));
diffuseColor = blend_overlay(color_dye_diffuse, diffuseColor);
#endif
#ifdef USE_GEARSTACKMAP
vec4 gearstackColor = texture2D(gearstackMap, vUv);
vec4 dyeColor = usePrimaryColor ? vec4(primaryColor, 1.0) : vec4(secondaryColor, 1.0);
vec4 blendColorUncorrected = mix(diffuseColor, blend_overlay(diffuseColor, dyeColor), gearstackColor.r);
diffuseColor = blendColorUncorrected;
vec4 detailColor = vec4(wornColor, 1.0);
vec4 blendDetail = mix(diffuseColor, blend_overlay(diffuseColor, detailColor), gearstackColor.b);
diffuseColor = blendDetail;
#endif
diffuseColor = vec4(pow(diffuseColor.xyz, vec3(gamma_correction_power_inverse)), 1.0);
#endif
#ifdef USE_GLASS
#endif
#ifdef USE_HUD
#endif
	#ifdef USE_COLOR
vec3 vtxColor = vColor;
#endif
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
specularStrength = 1.0;
#ifdef USE_DYE
#ifdef USE_GEARSTACKMAP
vec4 gearstackSpecular = texture2D(gearstackMap, vUv);
specularStrength = gearstackSpecular.g * 0.4;
#ifdef NO_SHINE
specularStrength = 0.0;
#endif
#endif
#endif
	#include <normal_flip>
	#include <normal_fragment>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_template>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
	#include <premultiplied_alpha_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}