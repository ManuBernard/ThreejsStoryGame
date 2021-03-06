import * as THREE from "three"
const textureLoader = new THREE.TextureLoader()

// stage object
export const stage = { name: "fabrik" }

// Textures sources
import groundTextureSource from "../textures/6.png"

// Textures
const groundTexture = textureLoader.load(groundTextureSource)

// Materials
const groundMaterial = new THREE.MeshMatcapMaterial({
  matcap: groundTexture,
  side: THREE.BackSide,
})

// Geometries
const groundGeometry = new THREE.PlaneGeometry(20, 20, 20)

// Meshes
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.name = "Ground"
ground.rotation.x = Math.PI / 2

stage.meshes = []
stage.meshes.push(ground)

// Doors
stage.doors = {
  map: {
    position: { x: -5.5, y: 1, z: 0 },
    size: 3,
    rotation: 2,
  },
}

// Camera
stage.camera = {
  position: { x: -10, y: 2, z: 0 },
  rotation: { x: -0.6, y: 0, z: 0 },
}
