/** @module Door */

import * as THREE from "three"
import { detectCollisionCubes } from "./helper/collisions"

/** Class representing a door, the way to travel from a stage to another. */
export default class door {
  /**
   * Create a door.
   * @param {string} destination The name of destination stage
   * @param {object} data Set of data to create the door
   */
  constructor(destination, data) {
    this.destination = destination

    this.position = data.position
    this.rotation = data.rotation

    if (data.size) {
      const doorGeometry = new THREE.BoxBufferGeometry(data.size, 2, 1)

      const doorMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
      })

      this.mesh = new THREE.Mesh(doorGeometry, doorMaterial)
      this.mesh.name = "Door to " + destination
      this.mesh.userData.doorTo = destination
      this.mesh.position.set(data.position.x, data.position.y, data.position.z)

      this.mesh.rotation.y = this.rotation

      this._showName()
      this._showSpawnMarker()
    }
  }

  /**
   * Check for contact with players and load a new stage
   * @param {object} game The game object, containing the player and the level to load
   */
  checkCollision(game) {
    if (this.mesh) {
      if (this.destinationName)
        this.destinationName.lookAt(game.camera.position)

      const col = detectCollisionCubes(this.mesh, game.player.body)
      if (col) {
        game.loadStage(this.destination, game.currentStage.name)
      }
    }
  }

  _showName() {
    const fontLoader = new THREE.FontLoader()

    fontLoader.load("/fonts/optimer_regular.typeface.json", (font) => {
      const textGeometry = new THREE.TextBufferGeometry(this.destination, {
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
      this.mesh.add(textMesh)
    })
  }

  _showSpawnMarker() {
    const axesHelper = new THREE.AxesHelper(3)
    this.mesh.add(axesHelper)

    const point = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 32, 32),
      new THREE.MeshBasicMaterial({ color: "red" })
    )

    point.name = "spawn"
    point.position.z = 2

    this.mesh.add(point)
  }
}
