import * as THREE from "three"
import Controller from "./controller"
export default class Caracter {
  constructor() {
    this.speed = 0.1

    this._createBody()

    this.controller = new Controller()
  }

  _createBody() {
    this.body = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.4, 20, 20),
      new THREE.MeshNormalMaterial()
    )

    this.body.position.y = 1

    this.body.geometry.computeBoundingBox()

    this.body.userData.preserve = true
  }

  /**
   * Move
   */
  move() {
    if (this.controller.movingZ.length) {
      this.body.position.z +=
        this.controller.movingZ[0] == "up" ? -this.speed : this.speed
    }

    if (this.controller.movingX.length) {
      this.body.position.x +=
        this.controller.movingX[0] == "left" ? -this.speed : this.speed
    }
  }
}
