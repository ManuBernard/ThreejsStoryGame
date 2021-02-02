import * as THREE from "three"
import level from "../game/level"

import groundTextureSource from "../textures/1.png"

const name = "level2"

const doors = [
  // {
  //   destination: "level2b",
  //   position: { x: -4, y: 1, z: 0 },
  //   size: { x: 1, y: 2, z: 1 },
  //   rotation: 0,
  //   spawn: { x: -3, y: 1, z: 0 },
  // },
  {
    destination: "level1",
    position: { x: 4, y: 1, z: 0 },
    size: { x: 1, y: 2, z: 1 },
    rotation: 0,
    spawn: { x: 3, y: 1, z: 0 },
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

    // Add Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(12, 12),
      new THREE.MeshMatcapMaterial({ matcap: this.textures.ground })
    )
    ground.rotation.x = -Math.PI / 2

    window.requestAnimationFrame(
      function () {
        this.game.scene.add(ground)
      }.bind(this)
    )

    // Position cameras
    this.game.camera.position.set(0, 26, 8)
    this.game.camera.rotation.set(4.81, 0, 0)
  }
}
