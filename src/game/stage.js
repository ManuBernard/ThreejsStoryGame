import * as THREE from "three"
import Door from "./door"

import { detectCollisionCubes } from "./helper/collisions"

export default class stage {
  constructor(stage, game, from) {
    console.log(stage.name)
    this.game = game
    this.from = from

    this.name = stage.name
    this.meshes = stage.meshes
    this.doors = stage.doors
    this.camera = stage.camera

    this.init()

    this.placePlayer()
    this.placeCamera()

    this.loadMeshes()

    window.requestAnimationFrame(
      function () {
        this.loadDoors()
      }.bind(this)
    )
  }

  /**
   * Init the stage: creates a new group that will contains all the object used by the stage
   */
  init() {
    this.group = new THREE.Group()
    this.group.name = "Stage " + this.name
    this.game.scene.add(this.group)
  }

  /**
   * Load all meshes needed to draw the stage
   */
  loadMeshes() {
    for (const mesh in this.meshes) {
      this.group.add(this.meshes[mesh])
    }
  }

  /**
   * Load all doors (doors are teleports to other stages)
   */
  loadDoors() {
    // window.setTimeout(
    // function () {
    for (let key in this.doors) {
      if (this.doors[key].position) {
        const door = new Door(key, this.doors[key])
        this.group.add(door.mesh)
      }
    }
    //   }.bind(this),
    //   1000
    // )
  }

  /**
   * Place the player in the scene
   */
  placePlayer() {
    const door = this.doors[this.from]

    this.game.player.direction.position.set(
      door.spawn.x,
      door.spawn.y,
      door.spawn.z
    )
  }

  /**
   * Place the camera in the scene
   */
  placeCamera() {
    this.game.camera.position.set(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z
    )
    this.game.camera.rotation.set(
      this.camera.rotation.x,
      this.camera.rotation.y,
      this.camera.rotation.z
    )
  }

  watch() {
    this._checkDoorCollision()
  }

  /**
   *
   *
   *  Private
   *
   *
   */

  _clean() {
    // for (const material in this.materials) {
    //   this.materials[material].dispose()
    // }

    // this.materials = {}

    // for (const geometry in this.geometries) {
    //   this.geometries[geometry].dispose()
    // }

    // this.geometries = {}

    this.game.scene.traverse(function (obj) {
      if (!obj.userData.preserve) {
        console.log(obj.material)
        if (obj.material) obj.material.dispose()
        if (obj.geometry) obj.geometry.dispose()
      }
    })

    this.game.scene.remove(this.group)
  }

  /**
   * Check for contact with doors
   */
  _checkDoorCollision() {
    this.game.scene.traverse(
      function (obj) {
        if (obj && obj.userData.doorTo) {
          const col = detectCollisionCubes(obj, this.game.player.body)

          if (col) {
            this.game.startStage(obj.userData.doorTo, this.name)
          }
        }
      }.bind(this)
    )
  }
}
