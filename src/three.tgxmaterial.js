// Custom ShaderMaterial that implements Destiny gear dyes
(function() {
	function parseColor(color) {
		if (!color) color = 0;
		if (typeof color == 'number') color = new THREE.Color().setHex(color);
		return color;
	}
	function colorToFloat(color) {
		color = parseColor(color);
		return new THREE.Vector3(color.r, color.g, color.b);
	}

	function TGXMaterial(params) {
		if (!params) params = {};

		var shaderLib = THREE.ShaderLib.phong;//standard;
		var uniforms = THREE.UniformsUtils.clone(shaderLib.uniforms);
		var vertexShader = shaderLib.vertexShader;
		var fragmentShader = shaderLib.fragmentShader;

		THREE.ShaderMaterial.call(this, {
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			lights: true,
			fog: true
		});

		this.game = 'destiny2';

		this.map = null;
		this.normalMap = null;
		this.envMap = null;
		this.alphaMap = null;
		this.emissiveMap = null;
		this.gearstackMap = null;

		this.defaultAttributeValues.detailUv = [0, 0];

		this.color = new THREE.Color(0xffffff);

		this.detailMap = null;
		this.detailNormalMap = null;
		this.detailDecalMap = null;
		this.primaryDetailMap = null;
		this.secondaryDetailMap = null;

		this.detailEnvMap = null; // Vex Mythoclast

		this.emissive = new THREE.Color(0x000000);
		this.emissiveIntensity = 1;
		this.specular = new THREE.Color(0x111111);
		this.shininess = 30;
		this.reflectivity = 1;

		//this.metalness = 0.5;
		//this.roughness = 0.5;

		//this.side = THREE.DoubleSide;

		//if (Object.keys(params).length > 0) console.log('MaterialParams', params);

		this.isGlass = false;
		this.isHud = false;
		this.isUnknown = false;

		this.useAlphaTest = false;

		this.isCloth = false;
		this.blendMode = 0;
		this.usePrimaryColor = true;
		this.useDye = true;
		this.useDetail = true;
		this.primaryColor = new THREE.Color(0x000000);
		this.secondaryColor = new THREE.Color(0x000000);

		this.wornColor = new THREE.Color(0x666666);

		this.detailDiffuseTransform = new THREE.Vector4(1, 1, 0, 0);
		this.detailNormalTransform = new THREE.Vector4(1, 1, 0, 0);

		//this.detailTransform = new THREE.Vector4(0, 0, 0, 0);
		//this.detailNormalContributionStrength = new THREE.Vector4(0, 0, 0, 0);
		//this.decalAlphaMapTransform = new THREE.Vector4(0, 0, 0, 0);
		//this.decalBlendOption = 0;
		//this.specularProperties = new THREE.Vector4(0, 0, 0, 0);
		//this.subsurfaceScatteringStrength = new THREE.Vector4(0, 0, 0, 0);

		this.setValues(params);
		this.extensions.derivatives = true;

		this.update();
	}
	TGXMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
	TGXMaterial.prototype.constructor = TGXMaterial;
	TGXMaterial.prototype.copy = function(source) {
		THREE.ShaderMaterial.prototype.copy.call( this, source );

		if (source.game !== undefined) this.game = source.game;

		if (source.map !== undefined) this.map = source.map;
		if (source.normalMap !== undefined) this.normalMap = source.normalMap;
		if (source.envMap !== undefined) this.envMap = source.envMap;
		if (source.alphaMap !== undefined) this.alphaMap = source.alphaMap;
		if (source.emissiveMap !== undefined) this.emissiveMap = source.emissiveMap;
		if (source.gearstackMap !== undefined) this.gearstackMap = source.gearstackMap;

		if (source.color !== undefined) this.color = source.color;

		if (source.metalness !== undefined) this.metalness = source.metalness;
		if (source.roughness !== undefined) this.roughness = source.roughness;

		if (source.detailMap !== undefined) this.detailMap = source.detailMap;
		if (source.detailNormalMap !== undefined) this.detailNormalMap = source.detailNormalMap;
		if (source.detailDecalMap !== undefined) this.detailDecalMap = source.detailDecalMap;
		if (source.primaryDetailMap !== undefined) this.primaryDetailMap = source.primaryDetailMap;
		if (source.secondaryDetaileMap !== undefined) this.secondaryDetaileMap = source.secondaryDetaileMap;

		if (source.emissive !== undefined) this.emissive = source.emissive;
		if (source.emissiveIntensity !== undefined) this.emissiveIntensity = source.emissiveIntensity;
		if (source.specular !== undefined) this.specular = source.specular;
		if (source.shininess !== undefined) this.shininess = source.shininess;
		if (source.reflectivity !== undefined) this.reflectivity = source.reflectivity;

		if (source.vertexColors !== undefined) this.vertexColors = source.vertexColors;

		if (source.isGlass !== undefined) this.isGlass = source.isGlass;
		if (source.isHud !== undefined) this.isHud = source.isHud;
		if (source.isUnknown !== undefined) this.isUnknown = source.isUnknown;

		if (source.isCloth !== undefined) this.isCloth = source.isCloth;
		if (source.blendMode !== undefined) this.blendMode = source.blendMode;
		if (source.usePrimaryColor !== undefined) this.usePrimaryColor = source.usePrimaryColor;
		if (source.useDye !== undefined) this.useDye = source.useDye;
		if (source.useDetail !== undefined) this.useDetail = source.useDetail;
		if (source.useAlphaTest !== undefined) this.useAlphaTest = source.useAlphaTest;
		if (source.primaryColor !== undefined) this.primaryColor = source.primaryColor;
		if (source.secondaryColor !== undefined) this.secondaryColor = source.secondaryColor;

		if (source.wornColor !== undefined) this.wornColor = source.wornColor;

		if (source.detailDiffuseTransform !== undefined) this.detailDiffuseTransform = source.detailDiffuseTransform;
		if (source.detailNormalTransform !== undefined) this.detailNormalTransform = source.detailNormalTransform;

		//if (source.detailTransform !== undefined) this.detailTransform = source.detailTransform;
		//if (source.detailNormalContributionStrength !== undefined) this.detailNormalContributionStrength = source.detailNormalContributionStrength;
		//if (source.decalAlphaMapTransform !== undefined) this.decalAlphaMapTransform = source.decalAlphaMapTransform;
		//if (source.decalBlendOption !== undefined) this.decalBlendOption = source.decalBlendOption;
		//if (source.specularProperties !== undefined) this.specularProperties = source.specularProperties;
		//if (source.subsurfaceScatteringStrength !== undefined) this.subsurfaceScatteringStrength = source.subsurfaceScatteringStrength;

		this.update();
		return this;
	};
	TGXMaterial.prototype.update = function() {
		var uniforms = this.uniforms;
		var vertexShader = this.vertexShader;
		var fragmentShader = this.fragmentShader;
		var defines = {};

		//console.log('MaterialUpdate', this);

		if (this.skinning) {
			defines['USE_SKINNING'] = '';
		}
		if (this.map) {
			defines['USE_MAP'] = '';
			uniforms.map = {value: this.map};
		}
		if (this.normalMap) {
			defines['USE_NORMALMAP'] = '';
			uniforms.normalMap = {value: this.normalMap};
		}
		if (this.envMap) {
			defines['USE_ENVMAP'] = '';
			uniforms.envMap = {value: this.envMap};
		}
		if (this.alphaMap) {
			defines['USE_ALPHAMAP'] = '';
			uniforms.alphaMap = {value: this.alphaMap};
		}
		if (this.emissiveMap) {
			defines['USE_EMISSIVEMAP'] = '';
			uniforms.emissiveMap = {value: this.emissiveMap};
		}
		if (this.color) {
			uniforms.diffuse = {value: this.color};
		}
		if (this.transparent) {
			//uniforms.transparent = true;
			uniforms.opacity = {value: this.opacity};
		}

		// Destiny Specific Stuff
		if (this.gearstackMap) {
			defines['USE_GEARSTACKMAP'] = '';
			uniforms.gearstackMap = {value: this.gearstackMap};
			switch(this.game) {
				case 'destiny2':
					defines['USE_DESTINY2'] = '';

					//defines['USE_AOMAP'] = '';
					//uniforms.aoMap = {value: this.gearstackMap};
					//
					//defines['USE_ROUGHNESSMAP'] = '';
					//uniforms.roughnessMap = {value: this.gearstackMap};

					defines['USE_SPECULARMAP'] = '';
					uniforms.specularMap = uniforms.gearstackMap;
					break;
				default:
					defines['USE_DESTINY'] = '';
					uniforms.blendMode = {value: this.blendMode};
					break;
			}
		}

		//uniforms.metalness = {value: this.metalness};
		//uniforms.roughness = {value: this.roughness};

		//if (this.useDye) {
		//	defines['USE_DYE'] = '';
		//}

		if (this.vertexColors) {
			defines['USE_COLOR'] = '';
		}
		if (this.isGlass) {
			defines['USE_GLASS'] = '';
		}
		if (this.isHud) {
			defines['USE_HUD'] = '';
		}
		if (this.isUnknown) {
			defines['USE_UNKNOWN'] = '';
		}
		if (this.isCloth) {
			defines['USE_CLOTH_DYE'] = '';
		}

		if (this.useAlphaTest) {
			defines['USE_ALPHATESTSTACK'] = '';
		}

		uniforms.usePrimaryColor = {value: this.usePrimaryColor};
		uniforms.primaryColor = {value: this.primaryColor};
		uniforms.secondaryColor = {value: this.secondaryColor};
		uniforms.wornColor = {value: this.wornColor};

		uniforms.emissive.value.copy(this.emissive).multiplyScalar(this.emissiveIntensity);
		uniforms.specular = {value: this.specular};
		uniforms.shininess = {value: this.shininess};
		uniforms.reflectivity = {value: this.reflectivity};

		uniforms.detailDiffuseTransform = {value: this.detailDiffuseTransform};
		uniforms.detailNormalTransform = {value: this.detailNormalTransform};

		if (this.useDetail) {
			if (this.detailMap) {
				defines['USE_DETAIL'] = '';
				uniforms.detailMap = {value: this.detailMap};
			} else {
				//defines['USE_DETAIL'] = '';
				uniforms.detailMap = {value: this.usePrimaryColor ? this.primaryDetailMap : this.secondaryDetailMap};
			}
			if (this.detailNormalMap) {
				defines['USE_DETAIL_NORMAL'] = '';
				uniforms.detailNormalMap = {value: this.detailNormalMap};
			}
			if (this.detailDecalMap) {
				defines['USE_DECAL'] = '';
				uniforms.detailDecalMap = {value: this.detailDecalMap};
			}
		}

		if (this.shininess == 0) {
			defines['NO_SHINE'] = '';
		}

		//console.log('MaterialParams', this);

		// Spasm.GearShader
		// Since most of the rendering is handled by Three.js, only some of this shader code is needed
		if (vertexShader.indexOf('USE_DETAIL') == -1) {
			// Detail Vertex Vars
			var uv2ParsVertex = [
				"#ifdef USE_DETAIL",
					"attribute vec2 uv2;",
					"varying vec2 vUv2;",
					"uniform vec4 detailDiffuseTransform;",
					"uniform vec4 detailNormalTransform;",
				"#endif",
			];

			vertexShader = this.insertAfter('#include <uv2_pars_vertex>', vertexShader, uv2ParsVertex);

			var uv2Vertex = [
				"#ifdef USE_DETAIL",
					"vUv2 = (uv2 * detailDiffuseTransform.xy) + detailDiffuseTransform.zw;",
					// vertexShader.push("v_texcoord2 = ((texcoord * a_texcoord2) * u_detail_transform.xy) + u_detail_transform.zw;"),
				"#endif"
			];
			vertexShader = this.insertAfter('#include <uv2_vertex>', vertexShader, uv2Vertex);
		}

		if (fragmentShader.indexOf('USE_GEARSTACKMAP') == -1) {
			var gearstackParsFragment = [
				//"#define saturate(value) clamp(value, 0.0, 1.0)",
				"const float gamma_correction_power = 2.2;",
				"const float gamma_correction_power_inverse = 1.0/2.2;",

				// Blend Functions
				"vec4 blend_overlay(vec4 back, vec4 front) {",
					"return front * saturate(back * 4.0) + saturate(back - 0.25);",
				"}",
				"vec4 blend_multiply(vec4 back, vec4 front) {",
					"return back * front;",
				"}",
				"vec4 blend_screen(vec4 back, vec4 front) {",
					"vec4 back_screen = vec4(1.0 - back.x, 1.0 - back.y, 1.0 - back.z, 1.0);",
					"vec4 front_screen = vec4(1.0 - front.x, 1.0 - front.y, 1.0 - front.z, 1.0);",
					"vec4 screen = back_screen * front_screen;",
					"return vec4(1.0 - screen.x, 1.0 - screen.y, 1.0 - screen.z, 1.0);",
				"}",
				"vec4 blend_hard_light(vec4 back, vec4 front) {",
					"return vec4(",
						"front.x < 0.5 ? (2.0 * back.x * front.x) : (1.0 - 2.0 * (1.0 - back.x) * (1.0 - front.x)),",
						"front.y < 0.5 ? (2.0 * back.y * front.y) : (1.0 - 2.0 * (1.0 - back.y) * (1.0 - front.y)),",
						"front.z < 0.5 ? (2.0 * back.z * front.z) : (1.0 - 2.0 * (1.0 - back.z) * (1.0 - front.z)),",
						"1.0",
					");",
				"}",

				// Gearstack Fragment Vars
				"#ifdef USE_GEARSTACKMAP",
					"uniform sampler2D gearstackMap;",
				"#endif",

				"#ifdef USE_DESTINY",
					"uniform float blendMode;",
					"uniform bool usePrimaryColor;",
					"uniform vec3 primaryColor;",
					"uniform vec3 secondaryColor;",
				"#endif",

				"#ifdef USE_DESTINY2",
					"uniform bool usePrimaryColor;",
					"uniform vec3 primaryColor;",
					"uniform vec3 secondaryColor;",
					"uniform vec3 wornColor;",
				"#endif",

				// Texture Detail Fragment Vars
				"#ifdef USE_DETAIL",
					"uniform sampler2D detailMap;",
					"uniform sampler2D detailNormalMap;",
					"varying vec2 vUv2;",
				"#endif",

				"#ifdef USE_DECAL",
					"uniform sampler2D detailDecalMap;",
				"#endif",
			];
			fragmentShader = this.insertAfter('#include <map_pars_fragment>', fragmentShader, gearstackParsFragment);

			// TODO Fix normal detail
			var gearstackNormalFragment = [
				"#ifndef USE_DETAIL_NORMAL",
					"#include <normalmap_pars_fragment>",
				"#endif",
				"#ifdef USE_DETAIL_NORMAL",
					"#ifdef USE_NORMALMAP",
						//"\n\tuniform sampler2D normalMap;",
						"\n\tuniform vec2 normalScale;",
						"uniform vec4 detailNormalTransform;",
						"\n\tvec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {",
							"\n\t\tvec3 q0 = dFdx( eye_pos.xyz );",
							"\n\t\tvec3 q1 = dFdy( eye_pos.xyz );",
							"\n\t\tvec2 st0 = dFdx( vUv.st );",
							"\n\t\tvec2 st1 = dFdy( vUv.st );",
							"\n\t\tvec3 S = normalize( q0 * st1.t - q1 * st0.t );",
							"\n\t\tvec3 T = normalize( -q0 * st1.s + q1 * st0.s );",
							"\n\t\tvec3 N = normalize( surf_norm );",
							//"\n\t\tvec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;",
							"\n\t\tvec3 mapN = texture2D( detailNormalMap, vUv2 ).xyz * 2.0 - 1.0;",
							//"\n\t\tmapN.xy = normalScale * mapN.xy;",
							"mapN.xy = detailNormalTransform.xy * mapN.xy + detailNormalTransform.zw;",
							"\n\t\tmat3 tsn = mat3( S, T, N );",
							"\n\t\treturn normalize( tsn * mapN );",
						"\n\t}",
					"\n#endif\n",
				"#endif",
				//"#ifdef USE_DETAIL_NORMAL",
				//	"normalMap = detailNormalMap;",
				//	//"vec4 color_dye_normal = texture2D(detailNormalMap, vUv2);",
				//	//"color_dye_normal = color_dye_normal * 2.0 - 1.0;",
				//	//"vNormal = vNormal + color_dye_normal.xy;",
				//"#endif"
			];
			//fragmentShader = this.replace('#include <normalmap_pars_fragment>', fragmentShader, gearstackNormalFragment);

			var gearstackFragment = [
				"diffuseColor = pow(diffuseColor, vec4(gamma_correction_power));",

				"vec4 gearstackColor = vec4(1.0, 1.0, 1.0, 1.0);",
				"vec4 dyeColor = vec4(1.0, 1.0, 1.0, 1.0);",

				"#ifdef USE_GEARSTACKMAP",
					"gearstackColor = texture2D(gearstackMap, vUv);",
					"dyeColor = usePrimaryColor ? vec4(primaryColor, 1.0) : vec4(secondaryColor, 1.0);",
				"#endif",

				// Dye Textures (Detail)
				"#ifdef USE_DETAIL",
					"vec4 color_dye_diffuse_texture = texture2D(detailMap, vUv2);",
					//"vec4 color_dye_diffuse_texture = texture2D(u_texture_dye_diffuse, v_texcoord2);",

					"float dye_alpha = color_dye_diffuse_texture.w;",
					"float dye_color_normalize = (1.0 - dye_alpha) * 0.5;",
					"vec4 color_dye_diffuse = pow(vec4("
						+"color_dye_diffuse_texture.x * dye_alpha + dye_color_normalize, "
						+"color_dye_diffuse_texture.y * dye_alpha + dye_color_normalize, "
						+"color_dye_diffuse_texture.z * dye_alpha + dye_color_normalize, 1.0), "
						+"vec4(gamma_correction_power));",
					//"diffuseColor = blend_overlay(color_dye_diffuse, diffuseColor);",

					// TODO figure out how to make decals look worn
					"#ifdef USE_DECAL",
						"vec4 decalColor = texture2D(detailDecalMap, vUv2);",
						//"diffuseColor = blend_multiply(decalColor, diffuseColor);",
					"#endif",

					//"vec4 color_dye_normal = texture2D(dyeNormal, vUv2);",
					//"color_dye_normal = color_dye_normal * 2.0 - 1.0;",
					//"normal = normal + color_dye_normal.xy;",
				"#endif",

				"#ifdef USE_DESTINY",
					"vec4 blendColorUncorrected = mix(diffuseColor, blend_overlay(diffuseColor, dyeColor), gearstackColor.r);",
					"diffuseColor = blendColorUncorrected;",

					// Worn Color
					//"vec4 detailColor = vec4(wornColor, 1.0);",
					//"vec4 blendDetail = mix(diffuseColor, blend_overlay(diffuseColor, detailColor), dyeAmbientColor.b);",
					//"diffuseColor = blendDetail;",

					//"vec4 decalColor = vec4(1.0, 0.0, 1.0, 1.0);",
					//"vec4 blendDecal = mix(diffuseColor, blend_multiply(diffuseColor, decalColor), gearstackColor.b);",
					//"diffuseColor = blendDecal;",
				"#endif",

				"#ifdef USE_DESTINY2",
					// Gearstack Textures
					// Notes from https://twitter.com/HashtagVeegie/status/929245226207649792
					// Red is AO, Green is smoothness, Blue is encoded alpha test and emissive.
					// Alpha is encoded dye mask, non-dyed metalness, and wear mask.

					"vec4 blendColorUncorrected = mix(diffuseColor, blend_overlay(diffuseColor, dyeColor), gearstackColor.r);",
					"diffuseColor = blendColorUncorrected;",
				"#endif",

				"diffuseColor = vec4(pow(diffuseColor.xyz, vec3(gamma_correction_power_inverse)), 1.0);",

				"#ifdef USE_GLASS",
					"diffuseColor = vec4(0.0, 0.0, 1.0, 1.0);",
				"#endif",
				"#ifdef USE_HUD",
					"diffuseColor = vec4(1.0, 0.0, 1.0, 1.0);", // pink
				"#endif",
				"#ifdef USE_UNKNOWN",
					"diffuseColor = vec4(0.0, 1.0, 0.0, 1.0);", // green
				"#endif",

				"#ifdef USE_ALPHATESTSTACK",
					"#ifdef USE_DESTINY",
						"diffuseColor.a *= gearstackColor.b;",
					"#endif",
				"#endif",
			];
			fragmentShader = this.insertAfter('#include <map_fragment>', fragmentShader, gearstackFragment);

			var alphaFragment = [
				"#ifdef USE_ALPHATESTSTACK",
					"#ifdef USE_DESTINY",
						"diffuseColor.a *= gearstackColor.b;",
					"#endif",
				"#endif"
			];
			//fragmentShader = this.insertAfter('#include <alphamap_fragment>', fragmentShader, alphaFragment);

			// Vertex Colors
			// Doesn't appear to be a standard color, possibly flags?
			var colorFragment = [
				"#ifdef USE_COLOR",
					"vec3 vtxColor = vColor;",
					//"diffuseColor = vec4(vColor, 1.0);",
					//"diffuseColor = mix(diffuseColor, blend_overlay(diffuseColor, vec4(primaryColor, 1.0)), vColor.r);",
				"#endif"
			];
			fragmentShader = this.replace('#include <color_fragment>', fragmentShader, colorFragment);

			// Gearstack Specular Fragment
			var specularFragment = [
				"specularStrength = 1.0;",

				"#ifdef USE_GEARSTACKMAP",
					"vec4 gearstackSpecular = texture2D(gearstackMap, vUv);",
					"specularStrength = gearstackSpecular.g * 0.4;",
				"#endif",
				"#ifdef NO_SHINE",
					"specularStrength = 0.0;",
				"#endif",
			];

			fragmentShader = this.insertAfter('#include <specularmap_fragment>', fragmentShader, specularFragment);

			//console.log('VertexShader', vertexShader);
			//console.log('FragmentShader', fragmentShader);
		}
		this.defines = defines;
		this.vertexShader = vertexShader;
		this.fragmentShader = fragmentShader;
	};
	TGXMaterial.prototype.insertBefore = function(search, shader, insertCode) {
		search += "\n";
		if (typeof insertCode != 'string') insertCode = insertCode.join("\n")+"\n";
		shader = shader.replace(search, insertCode+search);
		return shader;
	};
	TGXMaterial.prototype.insertAfter = function(search, shader, insertCode) {
		search += "\n";
		if (typeof insertCode != 'string') insertCode = insertCode.join("\n")+"\n";
		shader = shader.replace(search, search+insertCode);
		return shader;
	};
	TGXMaterial.prototype.replace = function(search, shader, insertCode) {
		search += "\n";
		if (typeof insertCode != 'string') insertCode = insertCode.join("\n")+"\n";
		shader = shader.replace(search, insertCode);
		return shader;
	};
	THREE.TGXMaterial = TGXMaterial;
})();