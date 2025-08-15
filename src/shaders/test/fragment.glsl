precision mediump float;

varying float vRandom;
varying float vZdepth;

void main()
{
    vec3 rgb = vec3(1.0 - vRandom, vRandom, 1.0) + vZdepth;
    gl_FragColor = vec4(rgb, 1.0);
}