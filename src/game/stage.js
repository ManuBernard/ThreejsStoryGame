/** @module Stage */

import * as THREE from "three"
import game from "./game"
import Door from "./door"

/** Class representing a stage, is responsible for the landscape, doodads, doors, npc...  */
export default class stage {
  /**
   * Create a stage.
   * @param {object} stageData The stage data { doors : {} , meshes  : [] , camera : {} }
   * @param {object} game The main game occurence
   * @param {string} from The name of the stage where the player is coming from
   */
  constructor(stageData, from) {
    this.from = from

    this.name = stageData.name

    this.doors = {}
    this.meshes = stageData.meshes
    this.camera = stageData.camera

    this.init()

    this.placeCamera()
    this.loadMeshes()

    this.loadDoors(stageData.doors)
    this.placePlayer()
  }

  /**
   * Init the stage: creates a new group that will contains all the object used by the stage
   */
  init() {
    this.group = new THREE.Group()
    this.group.name = "Stage " + this.name
    game.scene.add(this.group)
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
  loadDoors(doors) {
    for (let key in doors) {
      const door = new Door(key, doors[key])
      this.doors[key] = door

      if (door.mesh) this.group.add(door.mesh)
    }
  }

  /**
   * Place the player in the scene
   */
  placePlayer() {
    const door = this.doors[this.from]
    const rotation = door.rotation ? door.rotation : 0

    const x = door.position.x + Math.sin(rotation) * 2
    const z = door.position.z + Math.cos(rotation) * 2

    game.player.get().position.x = x
    game.player.get().position.y = door.position.y
    game.player.get().position.z = z
  }

  /**
   * Place the camera in the scene
   */
  placeCamera() {
    game.camera.move(this.camera.position, this.camera.rotation)
  }

  /**
   * Watch, is called on every frame
   */
  watch() {
    // Check contact between player and doors
    for (let key in this.doors) {
      const door = this.doors[key]
      door.checkCollision(game)
    }
  }

  /**
   * Clean the stage (remove objects + dispose materials and geometries)
   */
  clean() {
    game.scene.traverse(
      function (obj) {
        if (!obj.userData.preserve) {
          if (obj.material) obj.material.dispose()
          if (obj.geometry) obj.geometry.dispose()
        }
      }.bind(this)
    )

    game.scene.remove(this.group)
  }
}
