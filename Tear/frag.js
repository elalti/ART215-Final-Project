const frag = `
	precision highp float;

	// Processing specific input
	uniform float time;
	uniform vec2 resolution;
	uniform vec2 mouse;

	// Layer between Processing and Shadertoy uniforms
	vec3 iResolution = vec3(resolution,0.0);
	vec2 iMouse = vec2(mouse.xy);

	#define PI 3.1415926535
	#define TWO_PI 6.283185307
	#define iTime time
	//#define fragCoord gl_FragCoord.xy
	#define fragCoord var_vertTexCoord.xy * iResolution.xy
	#define fragColor gl_FragColor

	//attributes, in
	varying vec4 var_centerGlPosition;
	varying vec3 var_vertNormal;
	varying vec2 var_vertTexCoord;

	//custom
	uniform sampler2D tex;
	uniform vec2 pos;
	uniform float angle;
	uniform float vel;

	vec2 round(vec2 n){
		return floor(n+0.5);
	}

	//from @etale_cohomology
	//https://www.shadertoy.com/view/4dSBDh
	//return from 0 to TWO_PI
	float atan3(vec2 st){
			return mod(atan(st.t, st.s), TWO_PI);
	}

	void main(){
		vec2 uv = fragCoord / iResolution.xy;
		vec2 move = vec2(0., 0.);
		if(vel>0.01){
			//float polarAngle = atan3(uv - pos);
			float polarAngle = atan(uv.y - pos.y, uv.x - pos.x);
			float res = mod(polarAngle - angle, TWO_PI);
			//gl_FragColor = vec4(res/TWO_PI, 0.0, 0.0, 1.0);
			//return;
			float dir = res > PI ? 1. : -1.;
			move.x = cos(angle + PI/2.) * vel/1000. * dir;
			move.y = sin(angle + PI/2.) * vel/1000. * dir;
			//fix the blur, but creates a rotation bug
			//move = round(move * iResolution.xy) / iResolution.xy;
		}
		vec4 color = texture2D(tex, uv + move);
		gl_FragColor = color;
	}
`;