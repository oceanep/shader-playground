import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import test2VertextShaer from './shaders/test2/vertex.glsl'
import test2FragmentShader from './shaders/test2/fragment.glsl'
import { BufferAttribute } from 'three'

// Collect Shaders
const vertexShaders = [testVertexShader, test2VertextShaer]
const fragmentShaders = [testFragmentShader, test2FragmentShader]

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const flagTexture = textureLoader.load('/textures/dk_bg.jpg')

/**
 * Test meshes
 */
// Geometries
const meshCount = vertexShaders.length; // Number of meshes you want
const meshWidth = 1; // Width of each mesh
const meshHeight = 1; // Height of each mesh
const spacing = 0.1; // Space between meshes
const maxPerRow = 4; // Maximum meshes per row
const verticalSpacing = 0.1; // Space between rows

// Calculate grid position
const getGridPosition = (index) => {
    const row = Math.floor(index / maxPerRow);
    const col = index % maxPerRow;
    
    // Calculate total width for centering each row
    const itemsInThisRow = Math.min(meshCount - row * maxPerRow, maxPerRow);
    const rowWidth = (meshWidth * itemsInThisRow) + (spacing * (itemsInThisRow - 1));
    const rowStartX = -rowWidth / 2 + meshWidth / 2;
    
    return {
        x: rowStartX + col * (meshWidth + spacing),
        y: row * -(meshHeight + verticalSpacing)
    };
};

const geometries = []
const materials = []
const meshes = []

for (let i = 0; i < meshCount; i++) {
    const geometry = new THREE.PlaneGeometry(meshWidth, 1, 32, 32);
    geometries.push(geometry);
}

// Index Specific Geometry Modifications
// Add random bump noise to first geometry only
const count = geometries[0].attributes.position.count
const random = new Float32Array(count)
for(let i = 0; i < count; i++){
    random[i] = Math.random()
}
geometries[0].setAttribute('aRandom', new BufferAttribute(random, 1))

// Materials
for (let i = 0; i < meshCount; i++) {
    const material = new THREE.RawShaderMaterial({
        vertexShader: vertexShaders[i],
        fragmentShader: fragmentShaders[i],
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: {
            uTime: { value: 0.0 },
            uColor: { value: new THREE.Color() },
            uTexture: { value: flagTexture }
        }
    })
    
    materials.push(material)
}

// Index Specific Material Modifications
materials[0].uniforms.uFrequency = { value: new THREE.Vector2(15.0, 7.5) }

gui.add(materials[0].uniforms.uFrequency.value, 'x').min(0).max(20).step(0.1).name('frequencyX')
gui.add(materials[0].uniforms.uFrequency.value, 'y').min(0).max(20).step(0.1).name('frequencyY')

// Mesh
for(let i = 0; i < meshCount; i++) {
    const mesh = new THREE.Mesh(geometries[i], materials[i])
    scene.add(mesh)
    const { x, y } = getGridPosition(i)
    mesh.position.copy(
        new THREE.Vector3(
            x,
            y,
            0
        )
    )
    meshes.push(mesh);
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update material
    materials.forEach((material, i) => {
        material.uniforms.uTime.value = elapsedTime * (i + 1)
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()