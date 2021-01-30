import * as THREE from "three"
import level from "../game/level"
import groundTextureSource from "../textures/3.png"

const textureLoader = new THREE.TextureLoader()
const groundTexture = textureLoader.load(groundTextureSource)

export default class level3 extends level {
  constructor(game, from) {
    super(game, from)
  }

  _build() {
    // Define level name
    this.name = "level3"

    // Set possible starting points
    this.setStartPoint({
      level2b: { x: 3, y: 1, z: 0 },
    })

    // Add doors
    this.addDoor({ x: 4, y: 1, z: 0 }, { x: 1, y: 2, z: 1 }, "level2b")

    // Add Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(12, 12),
      new THREE.MeshMatcapMaterial({ matcap: groundTexture })
    )
    ground.rotation.x = -Math.PI / 2
    this.game.scene.add(ground)

    // Position cameras
    this.game.camera.position.set(0, 3, 11)
    this.game.camera.rotation.set(0, 0.2, 0)
  }
}
