import * as THREE from "three"
import level from "../game/level"
import groundTextureSource from "../textures/1.png"

const textureLoader = new THREE.TextureLoader()
const groundTexture = textureLoader.load(groundTextureSource)

export default class level1 extends level {
  constructor(game, from) {
    super(game, from)
  }

  _build() {
    // Define level name
    this.name = "level1"

    // Set possible starting points
    this.setStartPoint({
      init: { x: 0, y: 1, z: 0 },
      level2: { x: -3, y: 1, z: 0 },
    })

    // Add doors
    this.addDoor({ x: -5.5, y: 1, z: 0 }, { x: 1, y: 2, z: 1 }, "level2")

    // Add Ground
    const ground = new THREE.Mesh(
      new THREE.BoxBufferGeometry(20, 20, 20),
      new THREE.MeshMatcapMaterial({
        matcap: groundTexture,
        side: THREE.BackSide,
      })
    )

    ground.position.y = 10
    ground.position.x = 5.5
    ground.rotation.y = 2
    this.game.scene.add(ground)

    const house = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      new THREE.MeshMatcapMaterial({ matcap: groundTexture })
    )

    house.position.y = 0.5
    house.position.x = this.game.scene.add(house)

    // Position cameras
    this.game.camera.position.set(0, 8, 10)
    this.game.camera.rotation.set(-0.6, 0, 0.0)
  }
}
