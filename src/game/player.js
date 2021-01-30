import * as THREE from "three"

import skinTextureSource from "../textures/1.png"
import hairTextureSource from "../textures/3.png"
import shirtTextureSource from "../textures/2.png"

const textureLoader = new THREE.TextureLoader()

import Controller from "./controller"

const skinTexture = textureLoader.load(skinTextureSource)
const hairTexture = textureLoader.load(hairTextureSource)
const shirtTexture = textureLoader.load(shirtTextureSource)

export default class Caracter {
  constructor() {
    this.speed = 0.1

    this._initDirection()
    this._createBody()

    this.direction.add(this.body)

    this.controller = new Controller()
  }

  addTo(scene) {
    scene.add(this.direction)
  }

  _initDirection() {
    this.direction = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.3, 0.3, 0.3),
      new THREE.MeshStandardMaterial({ color: "red", wireframe: true })
    )
    this.direction.userData.preserve = true
  }

  _createBody() {
    const body = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.75, 1, 0.25),
      new THREE.MeshMatcapMaterial({ matcap: shirtTexture })
    )

    body.userData.preserve = true

    const head = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.5, 0.5, 0.5),
      new THREE.MeshMatcapMaterial({ matcap: skinTexture })
    )

    head.userData.preserve = true

    head.position.z = 0.15

    const hair = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.6, 0.6, 0.6),
      new THREE.MeshMatcapMaterial({ matcap: hairTexture })
    )

    hair.userData.preserve = true

    const eyebrow = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.3, 0.1, 0.1),
      new THREE.MeshStandardMaterial({ color: "black" })
    )

    eyebrow.userData.preserve = true

    head.add(hair)
    head.add(eyebrow)
    hair.position.z = -0.1
    hair.position.y = 0.1

    eyebrow.position.z = 0.26

    head.position.y = 0.75
    body.add(head)

    this.body = body

    this.body.geometry.computeBoundingBox()
    this.body.userData.preserve = true
  }

  /**
   * Move
   */
  move() {
    const mz = this.controller.movingZ[0]
    const mx = this.controller.movingX[0]

    if (mz) {
      const vector = mz == "up" ? -this.speed : this.speed
      this.direction.translateZ(vector)
    }

    if (mx) {
      const vector = mx == "left" ? -this.speed : this.speed
      this.direction.translateX(vector)
    }

    // Body Rotation
    if (mz == "down" && !mx) {
      this.body.rotation.y = 0
    } else if (mz == "down" && mx == "right") {
      this.body.rotation.y = Math.PI * 0.25
    } else if (mx == "right" && !mz) {
      this.body.rotation.y = Math.PI * 0.5
    } else if (mz == "up" && mx == "left") {
      this.body.rotation.y = Math.PI * 1.25
    } else if (mz == "up" && !mx) {
      this.body.rotation.y = Math.PI
    } else if (mz == "up" && mx == "right") {
      this.body.rotation.y = Math.PI * 0.75
    } else if (mx == "left" && !mz) {
      this.body.rotation.y = Math.PI * 1.5
    } else if (mz == "down" && mx == "left") {
      this.body.rotation.y = Math.PI * 1.75
    }
  }
}
