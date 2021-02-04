/** @module Door */

import * as THREE from "three"
import game from "./game"

import { detectCollisionCubes } from "./helper/collisions"

const fontLoader = new THREE.FontLoader()

/** Class representing a door, the way to travel from a stage to another. */
export default class door {
  /**
   * Create a door.
   * @param {string} destination The name of destination stage
   * @param {object} data Set of data to create the door
   */
  constructor(destination, options) {
    this._door = null

    this.options = { ...options }
    this.destination = destination

    if (this.options.size) {
      const doorGeometry = new THREE.BoxGeometry(this.options.size, 2, 1)

      const doorMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
      })

      this._door = new THREE.Mesh(doorGeometry, doorMaterial)
      this._door.name = "Door to " + destination
      this._door.userData.doorTo = destination

      this._door.position.set(
        this.options.position.x,
        this.options.position.y,
        this.options.position.z
      )

      this._door.rotation.y = this.options.rotation

      if (game.options.debug) {
        this._showName()
        this._showSpawnMarker()
      }
    }
  }

  get() {
    return this._door
  }

  /**
   * Check for contact with players and load a new stage

   */
  checkCollision() {
    if (this._door) {
      if (this.destinationName)
        this.destinationName.lookAt(game.camera.get().position)

      const col = detectCollisionCubes(this._door, game.player.getBody())
      if (col) {
        game.loadStage(this.destination)
      }
    }
  }

  _showName() {
    fontLoader.load("/fonts/optimer_regular.typeface.json", (font) => {
      const textGeometry = new THREE.TextGeometry(this.destination, {
        font: font,
        size: 0.5,
        height: 0.1,
      })

      textGeometry.center()

      const textMesh = new THREE.Mesh(
        textGeometry,
        new THREE.MeshBasicMaterial({ color: "red" })
      )

      textMesh.position.y = 1.5

      this.destinationName = textMesh
      this._door.add(textMesh)
    })
  }

  _showSpawnMarker() {
    const axesHelper = new THREE.AxesHelper(3)
    this._door.add(axesHelper)

    const point = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 32, 32),
      new THREE.MeshBasicMaterial({ color: "red" })
    )

    point.name = "spawn"
    point.position.z = 2

    this._door.add(point)
  }
}
