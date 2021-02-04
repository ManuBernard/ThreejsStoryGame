import * as THREE from "three"
import game from "./game"

export default class Camera {
  constructor(options) {
    this._camera = null

    this.options = {
      width: 800,
      height: 600,
      fov: 50,
      near: 0.1,
      far: 1000,
      ...options,
    }

    this._camera = new THREE.PerspectiveCamera(
      this.options.fov,
      this.options.width / this.options.height,
      this.options.near,
      this.options.far
    )

    // Animate camera on tick
    game.addOnTickAnimation("cameraControl", this.onTick.bind(this))
  }

  /**
   * Get camera
   */
  get() {
    return this._camera
  }

  /**
   * Move camera
   * @param {object} position {x,y,z}
   * @param {object} rotation {x,y,z}
   */
  move(position, rotation) {
    this._camera.position.x = position.x
    this._camera.position.y = position.y
    this._camera.position.z = position.z

    this._camera.rotation.x = rotation.x
    this._camera.rotation.y = rotation.y
    this._camera.rotation.z = rotation.z
  }

  /**
   * Animate camera on tick
   */
  onTick() {
    this._camera.lookAt(game.player.get().position)
  }
}
