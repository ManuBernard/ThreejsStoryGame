import * as THREE from "three"
import level from "../game/level"

const name = "level1"

// Textures
import groundTextureSource from "../textures/1.png"

// Doors
const doors = [
  {
    destination: "level2",
    position: { x: -5.5, y: 1, z: 0 },
    size: { x: 1, y: 2, z: 1 },
    rotation: 0,
    spawn: { x: -3, y: 1, z: 0 },
  },
  {
    destination: "init",
    spawn: { x: 0, y: 1, z: 0 },
  },
]

export default class level1 extends level {
  constructor(game, from) {
    super(game, from)
    this.name = name
  }

  build() {
    // Load textures
    this.loadTexture("ground", groundTextureSource)

    // Add doors
    this.doors = doors

    // Materials
    this.materials["ground"] = new THREE.MeshMatcapMaterial({
      matcap: this.textures.ground,
      side: THREE.BackSide,
    })

    // Geometries
    this.geometries["ground"] = new THREE.BoxBufferGeometry(20, 20, 20)

    // Mesh
    this.meshes["ground"] = new THREE.Mesh(
      this.geometries["ground"],
      this.materials["ground"]
    )

    this.meshes["ground"].name = "ground"
    this.meshes["ground"].position.x = 5.5
    this.meshes["ground"].position.y = 10
    this.meshes["ground"].rotation.y = 2

    // Position cameras
    this.game.camera.position.set(0, 8, 10)
    this.game.camera.rotation.set(-0.6, 0, 0.0)
  }
}
