/** @module Player */

import * as THREE from "three"
import game from "./game"
import Controller from "./controller"

const textureLoader = new THREE.TextureLoader()

import skinTextureSource from "../textures/1.png"
import hairTextureSource from "../textures/3.png"
import shirtTextureSource from "../textures/2.png"

const skinTexture = textureLoader.load(skinTextureSource)
const hairTexture = textureLoader.load(hairTextureSource)
const shirtTexture = textureLoader.load(shirtTextureSource)

export default class Player {
  constructor(options) {
    this._player = null
    this._body = null

    this.options = { speed: 0.1, ...options }

    this._initPlayer()
    this._initBody()

    this._player.add(this._body)

    this.controller = new Controller()

    // Animates player on tick
    game.addOnTickAnimation("move", this.onTick.bind(this))
  }

  /**
   * Get player
   */
  get() {
    return this._player
  }

  /**
   * Get player body
   */
  getBody() {
    return this._body
  }

  /**
   * Move the player in the stage
   */
  onTick() {
    this._player.lookAt(
      game.camera.get().position.x,
      this._player.position.y,
      game.camera.get().position.z
    )

    const mz = this.controller.movingZ[0]
    const mx = this.controller.movingX[0]

    if (mz) {
      const vector = mz == "up" ? -this.options.speed : this.options.speed
      this._player.translateZ(vector)
    }

    if (mx) {
      const vector = mx == "left" ? -this.options.speed : this.options.speed
      this._player.translateX(vector)
    }

    // Body Rotation
    if (mz == "down" && !mx) {
      this._body.rotation.y = 0
    } else if (mz == "down" && mx == "right") {
      this._body.rotation.y = Math.PI * 0.25
    } else if (mx == "right" && !mz) {
      this._body.rotation.y = Math.PI * 0.5
    } else if (mz == "up" && mx == "left") {
      this._body.rotation.y = Math.PI * 1.25
    } else if (mz == "up" && !mx) {
      this._body.rotation.y = Math.PI
    } else if (mz == "up" && mx == "right") {
      this._body.rotation.y = Math.PI * 0.75
    } else if (mx == "left" && !mz) {
      this._body.rotation.y = Math.PI * 1.5
    } else if (mz == "down" && mx == "left") {
      this._body.rotation.y = Math.PI * 1.75
    }
  }

  /**
   * Initialize player
   * @Private
   */
  _initPlayer() {
    this._player = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshStandardMaterial({ color: "red", wireframe: true })
    )

    this._player.name = "Player"
    this._player.userData.preserve = true
  }

  /**
   * Initialize player body
   * @Private
   */
  _initBody() {
    this._body = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 1, 0.25),
      new THREE.MeshMatcapMaterial({ matcap: shirtTexture })
    )

    this._body.name = "Body"
    this._body.userData.preserve = true

    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshMatcapMaterial({ matcap: skinTexture })
    )

    head.name = "Head"
    head.userData.preserve = true

    head.position.z = 0.15

    const hair = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.6, 0.6),
      new THREE.MeshMatcapMaterial({ matcap: hairTexture })
    )

    hair.name = "Hair"
    hair.userData.preserve = true

    const eyebrow = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.1, 0.1),
      new THREE.MeshStandardMaterial({ color: "black" })
    )

    eyebrow.name = "Eyebrow"
    eyebrow.userData.preserve = true

    head.add(hair)
    head.add(eyebrow)
    hair.position.z = -0.1
    hair.position.y = 0.1

    eyebrow.position.z = 0.26

    head.position.y = 0.75

    this._body.add(head)

    this._body.geometry.computeBoundingBox()
    this._body.userData.preserve = true
  }
}
