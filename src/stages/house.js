import * as THREE from "three"
const textureLoader = new THREE.TextureLoader()

// Textures sources
import groundTextureSource from "../textures/1.png"

// Textures
const groundTexture = textureLoader.load(groundTextureSource)

// Materials
const groundMaterial = new THREE.MeshMatcapMaterial({
  matcap: groundTexture,
  side: THREE.BackSide,
})

// Geometries
const groundGeometry = new THREE.BoxBufferGeometry(20, 20, 20)

// Meshes
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.name = "Ground"
ground.position.x = 5.5
ground.position.y = 10
ground.rotation.y = 2

// stage object
export const stage = { name: "house" }

stage.doors = {
  init: {
    spawn: { x: 0, y: 1, z: 0 },
  },
  map: {
    position: { x: -5.5, y: 1, z: 0 },
    size: { x: 1, y: 2, z: 1 },
    rotation: 0,
    spawn: { x: -3, y: 1, z: 0 },
  },
}

// Camera
stage.camera = {
  position: { x: 0, y: 8, z: 10 },
  rotation: { x: -0.6, y: 0, z: 0 },
}

// Meshes
stage.meshes = []
stage.meshes.push(ground)
