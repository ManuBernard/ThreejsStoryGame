/** @module Stage */

import * as THREE from "three"
import Door from "./door"

import { detectCollisionCubes } from "./helper/collisions"

/** Class representing a stage, is responsible for the landscape, doodads, doors, npc...  */
export default class stage {
  /**
   * Create a stage.
   * @param {object} stageData The stage data
   * @param {object} game The main game occurence
   * @param {string} from The name of the stage where the player is coming from
   */
  constructor(stageData, game, from) {
    this.game = game
    this.from = from

    this.name = stageData.name
    this.meshes = stageData.meshes
    this.doors = stageData.doors
    this.camera = stageData.camera

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
    for (let key in this.doors) {
      if (this.doors[key].position) {
        const door = new Door(key, this.doors[key])
        this.group.add(door.mesh)
      }
    }
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

  /**
   * Watch, is called on every frame
   */
  watch() {
    this._checkDoorCollision()
  }

  /**
   * Clean the stage (remove objects + dispose materials and geometries)
   */
  clean() {
    this.game.scene.traverse(function (obj) {
      if (!obj.userData.preserve) {
        if (obj.material) obj.material.dispose()
        if (obj.geometry) obj.geometry.dispose()
      }
    })

    this.game.scene.remove(this.group)
  }

  /**
   *
   *
   *  Private
   *
   *
   */

  /**
   * Check for contact with doors
   * @private
   */
  _checkDoorCollision() {
    this.game.scene.traverse(
      function (obj) {
        if (obj && obj.userData.doorTo) {
          const col = detectCollisionCubes(obj, this.game.player.body)

          if (col) {
            this.game.loadStage(obj.userData.doorTo, this.name)
          }
        }
      }.bind(this)
    )
  }
}
