/** @module Player */

import * as THREE from "three"
import game from "./game"

import skinTextureSource from "../textures/1.png"
import hairTextureSource from "../textures/3.png"
import shirtTextureSource from "../textures/2.png"

const textureLoader = new THREE.TextureLoader()

import Controller from "./controller"

const skinTexture = textureLoader.load(skinTextureSource)
const hairTexture = textureLoader.load(hairTextureSource)
const shirtTexture = textureLoader.load(shirtTextureSource)

let player
let body

/** Class representing the player. */
export default class Player {
  /**
   * Create the player.
   */
  constructor(options) {
    this.options = { speed: 0.1, ...options }

    initPlayer()
    initBody()

    player.add(body)

    this.controller = new Controller()

    // Animates player on tick
    game.addOnTickAnimation("move", this.onTick.bind(this))
  }

  get() {
    return player
  }

  getBody() {
    return body
  }

  /**
   * Move the player in the stage
   * This is call on every animation frame
   */
  onTick() {
    player.lookAt(
      game.camera.get().position.x,
      player.position.y,
      game.camera.get().position.z
    )

    const mz = this.controller.movingZ[0]
    const mx = this.controller.movingX[0]

    if (mz) {
      const vector = mz == "up" ? -this.options.speed : this.options.speed
      player.translateZ(vector)
    }

    if (mx) {
      const vector = mx == "left" ? -this.options.speed : this.options.speed
      player.translateX(vector)
    }

    // Body Rotation
    if (mz == "down" && !mx) {
      body.rotation.y = 0
    } else if (mz == "down" && mx == "right") {
      body.rotation.y = Math.PI * 0.25
    } else if (mx == "right" && !mz) {
      body.rotation.y = Math.PI * 0.5
    } else if (mz == "up" && mx == "left") {
      body.rotation.y = Math.PI * 1.25
    } else if (mz == "up" && !mx) {
      body.rotation.y = Math.PI
    } else if (mz == "up" && mx == "right") {
      body.rotation.y = Math.PI * 0.75
    } else if (mx == "left" && !mz) {
      body.rotation.y = Math.PI * 1.5
    } else if (mz == "down" && mx == "left") {
      body.rotation.y = Math.PI * 1.75
    }
  }
}

/**
 * Initialize player
 */
const initPlayer = () => {
  player = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.3, 0.3, 0.3),
    new THREE.MeshStandardMaterial({ color: "red", wireframe: true })
  )

  player.name = "Player"
  player.userData.preserve = true
}

/**
 * Initialize player body
 * @Private
 */
const initBody = () => {
  body = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.75, 1, 0.25),
    new THREE.MeshMatcapMaterial({ matcap: shirtTexture })
  )

  body.name = "Body"
  body.userData.preserve = true

  const head = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.5, 0.5, 0.5),
    new THREE.MeshMatcapMaterial({ matcap: skinTexture })
  )

  head.name = "Head"
  head.userData.preserve = true

  head.position.z = 0.15

  const hair = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.6, 0.6, 0.6),
    new THREE.MeshMatcapMaterial({ matcap: hairTexture })
  )

  hair.name = "Hair"
  hair.userData.preserve = true

  const eyebrow = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.3, 0.1, 0.1),
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
  body.add(head)

  body.geometry.computeBoundingBox()
  body.userData.preserve = true
}
