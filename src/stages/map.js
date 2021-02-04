import * as THREE from "three"
const textureLoader = new THREE.TextureLoader()
import game from "../game/game"
import Stage from "../game/stage"

import * as physics from "../game/helper/physics"

// Textures sources
import groundTextureSource from "../textures/5.png"

// Textures
const groundTexture = textureLoader.load(groundTextureSource)

const doors = {
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
const camera = {
  position: { x: 5, y: 6, z: 12 },
  rotation: { x: -0.6, y: 0, z: 0 },
}

game.camera.move(camera.position, camera.rotation)

// Meshes
const meshes = []
// meshes.push(ground)

// Physics objects
const floorGeometry = new THREE.BoxGeometry(1, 1, 1)

// Materials
const floorMaterial = new THREE.MeshMatcapMaterial({
  matcap: groundTexture,
})

const floor = physics.createBox(
  { x: 10, y: 10, z: 1 },
  { x: 0, y: 0, z: 0 },
  { x: -Math.PI / 1.5, y: 0, z: 0 },
  floorMaterial,
  0
)

const floor2 = physics.createBox(
  { x: 10, y: 10, z: 1 },
  { x: 0, y: 2.41, z: -9 },
  { x: -Math.PI / 2, y: 0, z: 0 },
  floorMaterial,
  0
)

const box = physics.createBox(
  { x: 1, y: 1, z: 1 },
  { x: 0, y: 1.3, z: 3 },
  { x: 0, y: 0, z: 0 },
  floorMaterial,
  8
)

const objects = []
objects.push(floor)
objects.push(floor2)
objects.push(box)

export default function stage(from) {
  game.stage = new Stage()
  game.stage.from = "init"
  game.stage.loadDoors(doors)
  game.stage.loadMeshes(meshes)
  game.stage.loadPhysicsObjects(objects)
  game.stage.start()
}
