import * as THREE from "three"

import { detectCollisionCubes } from "./helper/collisions"

export default class level {
  constructor(game, from) {
    this.from = from
    this.game = game
    this.doors = []

    this._build()
  }

  /**
   * Public
   */

  setStartPoint(startPoints) {
    this.game.player.body.position.set(
      startPoints[this.from].x,
      startPoints[this.from].y,
      startPoints[this.from].z
    )
  }

  watch() {
    this._checkDoorCollision()
  }

  /**
   * Add a door
   */
  addDoor(position, size, destination) {
    const door = new THREE.Mesh(
      new THREE.BoxBufferGeometry(size.x, size.y, size.z),
      new THREE.MeshBasicMaterial({ wireframe: true })
    )

    door.userData.doorTo = destination
    door.position.set(position.x, position.y, position.z)

    this.doors.push(door)
    this.game.scene.add(door)
  }

  /**
   * Private
   */
  _clean() {
    const scene = this.game.scene

    for (let i = scene.children.length - 1; i >= 0; i--) {
      const obj = scene.children[i]
      if (!obj.userData.preserve) scene.remove(obj)
    }
  }

  /**
   * Check for contact with doors
   */
  _checkDoorCollision() {
    for (let i = this.game.scene.children.length - 1; i >= 0; i--) {
      const obj = this.game.scene.children[i]
      if (obj && obj.userData.doorTo) {
        const col = detectCollisionCubes(obj, this.game.player.body)
        if (col) {
          this.game.loadLevel(obj.userData.doorTo, this.game.currentLevel.name)
          this._clean()
        }
      }
    }
  }
}
