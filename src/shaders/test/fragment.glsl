precision mediump float;

uniform sampler2D uTexture;

varying float vRandom;
varying float vZdepth;
varying vec2 vUv;

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    vec3 rgb = textureColor.rgb * (vRandom + 0.5) * (vZdepth * 2.0 + 0.35);
    gl_FragColor = vec4(rgb, 1.0);
}