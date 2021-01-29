import * as THREE from "three"
import level from "../game/level"
import groundTextureSource from "../textures/2.png"

const textureLoader = new THREE.TextureLoader()
const groundTexture = textureLoader.load(groundTextureSource)

export default class level2 extends level {
  constructor(game, from) {
    super(game, from)
  }

  _build() {
    // Define level name
    this.name = "level2"

    // Set possible starting points
    this.setStartPoint({
      level3: { x: -3, y: 1, z: 0 },
      level1: { x: 3, y: 1, z: 0 },
    })

    // Add Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(12, 12),
      new THREE.MeshMatcapMaterial({ matcap: groundTexture })
    )
    ground.rotation.x = -Math.PI / 2
    this.game.scene.add(ground)

    // Add doors
    this.addDoor({ x: -4, y: 1, z: 0 }, { x: 1, y: 2, z: 1 }, "level3")
    this.addDoor({ x: 4, y: 1, z: 0 }, { x: 1, y: 2, z: 1 }, "level1")

    // Position cameras
    this.game.camera.position.set(-4, 26, 0)
    this.game.camera.rotation.set(4.81, 0, 0)
  }
}