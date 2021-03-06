import * as THREE from "three"
const textureLoader = new THREE.TextureLoader()

// Textures sources
import groundTextureSource from "../textures/5.png"

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

// Stage object
export const stage = { name: "map" }

stage.doors = {
  init: {
    position: { x: 0, y: 1, z: -2 },
  },
  fabrik: {
    position: { x: -5.5, y: 1, z: 0 },
    size: 2,
    rotation: Math.PI / 4,
  },
  house: {
    position: { x: 5.5, y: 1, z: 0 },
    size: 3,
    rotation: Math.PI * 1.5,
  },
}

// Camera
stage.camera = {
  position: { x: 5, y: 6, z: 12 },
  rotation: { x: -0.6, y: 0, z: 0 },
}

// Meshes
stage.meshes = []
stage.meshes.push(ground)
