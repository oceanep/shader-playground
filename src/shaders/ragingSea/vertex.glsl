uniform vec2 uWaveFrequency;
uniform float uWaveAmplitude;
uniform float uWaveSpeed;
uniform float uTime;

varying vec2 vUv;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uWaveFrequency.x + uTime * uWaveSpeed) *
                      sin(modelPosition.z * uWaveFrequency.y + uTime * uWaveSpeed) *
                      uWaveAmplitude;  

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    
    vUv = uv;
}