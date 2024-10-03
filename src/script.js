import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()

const meshObject = {}

const physicalMaterial = new THREE.MeshPhysicalMaterial({color: "#f8f8f8"})

gltfLoader.load("/models/anisotropic-disc.gltf", (gltf) => {

    physicalMaterial.metalness = 1
    physicalMaterial.roughness = .32

    gltf.scene.children[0].material = physicalMaterial
    meshObject.Cylinder = gltf.scene.children[0]
    console.log(meshObject.Cylinder)

    meshObject.Cylinder.scale.set(4,.75,4)
    meshObject.Cylinder.rotation.y = -.5

    scene.add(meshObject.Cylinder)
})

/**
 * Base
 */
// Debug
const gui = new GUI()
const global = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const cylinderGeometry = new THREE.CylinderGeometry(2,2,1,64,32)
const material = new THREE.MeshPhysicalMaterial({color: "#f9f9f9"})
material.metalness = 1
material.roughness = .32

const mesh = new THREE.Mesh(cylinderGeometry,material)
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.z = -0.2
mesh.position.y = 3.14

// scene.add(mesh)

/**
 * Environment map
 */
// Global intensity
global.envMapIntensity = 1
gui
    .add(global, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Models
 */
// Helmet


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 0.7)
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight)

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
camera.position.set(5, 5, 8)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
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
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()