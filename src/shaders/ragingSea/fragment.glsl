precision mediump float;

uniform vec3 uColor;
uniform vec3 uWaveDepthColor;
uniform vec3 uWaveSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying vec2 vUv;
varying float vElevation;

void main()
{
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uWaveDepthColor, uWaveSurfaceColor, mixStrength);
    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
}