import * as THREE from "three"
import game from "./game"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

let camera

export default class Camera {
  constructor(sizes) {
    this.init(sizes)
  }

  /**
   * Initialize camera
   * @param {float} fov Field of view
   * @param {float} near Near distance
   * @param {float} far Far distance
   * @private
   */
  init(sizes, fov = 50, near = 0.1, far = 1000) {
    camera = new THREE.PerspectiveCamera(
      fov,
      sizes.width / sizes.height,
      near,
      far
    )

    // Animate camera on tick
    game.addOnTickAnimation("cameraControl", this.onTick)
  }

  get() {
    return camera
  }

  /**
   * Move camera
   */
  move(position, rotation) {
    camera.position.x = position.x
    camera.position.y = position.y
    camera.position.z = position.z

    camera.rotation.x = rotation.x
    camera.rotation.y = rotation.y
    camera.rotation.z = rotation.z
  }

  /**
   * Animate camera on tick
   */
  onTick() {
    camera.lookAt(game.player.direction.position)
  }
}
