import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import test2VertextShader from './shaders/test2/vertex.glsl'
import test2FragmentShader from './shaders/test2/fragment.glsl'
import ragingSeaVertexShader from './shaders/ragingSea/vertex.glsl'
import ragingSeaFragmentShader from './shaders/ragingSea/fragment.glsl'
import { BufferAttribute } from 'three'

// Collect Shaders and other Mesh Metadata
const meshData = [
    {
        subdivision: 32,
        rawShaderBase: true,
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
    },
    {
        subdivision: 32,
        rawShaderBase: true,
        vertexShader: test2VertextShader,
        fragmentShader: test2FragmentShader,
    },
    {
        subdivision: 256,
        rawShaderBase: false,
        vertexShader: ragingSeaVertexShader,
        fragmentShader: ragingSeaFragmentShader,
        color: 'rgb(50%, 80%, 100%)',
        debugColors: {
            depthColor: '#002775',
            surfaceColor: '#b0abf8'
        }
    }
]

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
const meshCount = meshData.length // Number of meshes you want
const meshWidth = 1 // Width of each mesh
const meshHeight = 1 // Height of each mesh
const spacing = 0.1 // Space between meshes
const maxPerRow = 2 // Maximum meshes per row
const verticalSpacing = 0.1 // Space between rows

// Calculate grid position
const getGridPosition = (index) => {
    const row = Math.floor(index / maxPerRow)
    const col = index % maxPerRow
    
    // Calculate total width for centering each row
    const itemsInThisRow = Math.min(meshCount - row * maxPerRow, maxPerRow)
    const amtRows = Math.ceil(meshCount / maxPerRow)

    const rowWidth = (meshWidth * itemsInThisRow) + (spacing * (itemsInThisRow - 1))
    const rowsHeight = (amtRows * meshHeight) + (verticalSpacing * (amtRows - 1))

    const rowStartX = -rowWidth / 2 + meshWidth / 2
    const rowStartY = rowsHeight / 2 - meshHeight / 2
    
    return {
        x: rowStartX + col * (meshWidth + spacing),
        y: rowStartY + row * -(meshHeight + verticalSpacing)
    }
}

const geometries = []
const materials = []
const meshes = []

for (let i = 0; i < meshCount; i++) {
    const geometry = new THREE.PlaneGeometry(
        meshWidth, 
        1, 
        meshData[i].subdivision, 
        meshData[i].subdivision
    )
    geometries.push(geometry)
}

// Index Specific Geometry Modifications

// mesh 1
// Add random bump noise to first geometry only
const count = geometries[0].attributes.position.count
const random = new Float32Array(count)
for(let i = 0; i < count; i++){
    random[i] = Math.random()
}
geometries[0].setAttribute('aRandom', new BufferAttribute(random, 1))

// Materials
for (let i = 0; i < meshCount; i++) {
    const _args = {
        vertexShader: meshData[i].vertexShader,
        fragmentShader: meshData[i].fragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: {
            uTime: { value: 0.0 },
            uColor: meshData[i]?.color 
                ? { value: new THREE.Color(meshData[i].color)}
                : { value: new THREE.Color() }, 
            uTexture: { value: flagTexture }
        }
    }
    const material = meshData[i].rawShaderBase 
        ? new THREE.RawShaderMaterial(_args) 
        : new THREE.ShaderMaterial(_args)
    
    materials.push(material)
}

// Index Specific Material Modifications
// mesh 1 uniforms
materials[0].uniforms.uFrequency = { value: new THREE.Vector2(15.0, 7.5) }

// mesh 2 uniforms

// mesh 3 uniforms
materials[2].uniforms.uWaveFrequency = { value: new THREE.Vector2(5.0, 6.5) }
materials[2].uniforms.uWaveAmplitude = { value: 0.165}
materials[2].uniforms.uWaveSpeed = { value: 2.0 }

materials[2].uniforms.uSmWaveFrequency = { value: 8.5 }
materials[2].uniforms.uSmWaveAmplitude = { value: 0.09 }
materials[2].uniforms.uSmWaveSpeed = { value: 0.8 }
materials[2].uniforms.uSmWaveIterations = { value: 4.0 }

materials[2].uniforms.uWaveDepthColor = { value: new THREE.Color(meshData[2].debugColors.depthColor) }
materials[2].uniforms.uWaveSurfaceColor = { value: new THREE.Color(meshData[2].debugColors.surfaceColor) }
materials[2].uniforms.uColorOffset = { value: 0.25 }
materials[2].uniforms.uColorMultiplier = { value: 5.5 }

// Debug
// mesh 1 gui
gui.add(materials[0].uniforms.uFrequency.value, 'x').min(0).max(20).step(0.1).name('mesh1_frequencyX')
gui.add(materials[0].uniforms.uFrequency.value, 'y').min(0).max(20).step(0.1).name('mesh1_frequencyY')

// mesh 2 gui

// mesh 3 gui
gui.add(materials[2].uniforms.uWaveAmplitude, 'value').min(0).max(1.0).step(0.001).name('mesh3_uWaveAmplitude')
gui.add(materials[2].uniforms.uWaveFrequency.value, 'x').min(0).max(10.0).step(0.1).name('mesh3_uWaveFrequencyX')
gui.add(materials[2].uniforms.uWaveFrequency.value, 'y').min(0).max(10.0).step(0.1).name('mesh3_uWaveFrequencyZ')
gui.add(materials[2].uniforms.uWaveSpeed, 'value').min(0).max(5.0).step(0.01).name('mesh3_uWaveSpeed')

gui.add(materials[2].uniforms.uSmWaveAmplitude, 'value').min(0).max(2.0).step(0.001).name('mesh3_uSmWaveAmplitude')
gui.add(materials[2].uniforms.uSmWaveFrequency, 'value').min(0).max(30.0).step(0.01).name('mesh3_uSmWaveFrequency')
gui.add(materials[2].uniforms.uSmWaveSpeed, 'value').min(0).max(3.0).step(0.01).name('mesh3_uSmWaveSpeed')
gui.add(materials[2].uniforms.uSmWaveIterations, 'value').min(0).max(8.0).step(1).name('mesh3_uSmWaveIterations')

gui.addColor(
        meshData[2].debugColors, 'depthColor'
    ).onChange(() => {
        materials[2].uniforms.uWaveDepthColor.value.set(meshData[2].debugColors.depthColor)
    }).name('mesh3_uWaveDepthColor')
gui.addColor(
        meshData[2].debugColors, 'surfaceColor'
    ).onChange(() => {
        materials[2].uniforms.uWaveSurfaceColor.value.set(meshData[2].debugColors.surfaceColor)
    }).name('mesh4_uWaveSurfaceColor')
gui.add(materials[2].uniforms.uColorOffset, 'value').min(0).max(2.0).step(0.001).name('mesh3_uColorOffset')
gui.add(materials[2].uniforms.uColorMultiplier, 'value').min(0).max(10.0).step(0.1).name('mesh3_uColorMultiplier')

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
    meshes.push(mesh)
}

// Index Specific Mesh Modifications

// mesh 3 
// Rotate wave mesh for better visibility
meshes[2].rotation.x = - Math.PI / 2

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
        material.uniforms.uTime.value = elapsedTime + i
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()