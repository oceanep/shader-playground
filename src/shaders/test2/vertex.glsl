uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 view = viewMatrix * modelPosition;
    vec4 projection = projectionMatrix * view;
    
    gl_Position = projection;
    
    vUv = uv;
}