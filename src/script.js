import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import test2VertextShaer from './shaders/test2/vertex.glsl'
import test2FragmentShader from './shaders/test2/fragment.glsl'
import { BufferAttribute } from 'three'

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
// Geometry 1
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

const count = geometry.attributes.position.count
const random = new Float32Array(count)

for(let i = 0; i < count; i++){
    random[i] = Math.random()
}

geometry.setAttribute('aRandom', new BufferAttribute(random, 1))

// Material
const material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
        uFrequency: { value: new THREE.Vector2(15.0, 7.5) },
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Color() },
        uTexture: { value: flagTexture }
    }
})

gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.1).name('frequencyX')
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.1).name('frequencyY')

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
mesh.position.copy(new THREE.Vector3(-0.55, 0, 0))

// Geometry 2
const geometry2 = new THREE.PlaneGeometry(1 ,1 ,32 ,32)

// Material
const material2 = new THREE.RawShaderMaterial({
    vertexShader: test2VertextShaer,
    fragmentShader: test2FragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0.0}
    }
})
// Mesh
const mesh2 = new THREE.Mesh(geometry2, material2)
scene.add(mesh2)
mesh2.position.copy(new THREE.Vector3(0.55, 0, 0))

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
    material.uniforms.uTime.value = elapsedTime
    material2.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()