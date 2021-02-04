/** @module Stage */

import * as THREE from "three"
import game from "./game"
import Door from "./door"

/** Class representing a stage, is responsible for the landscape, doodads, doors, npc...  */
export default class stage {
  /**
   * Create a stage.
   * @param {string} from The name of the stage where the player is coming from
   * @param {object} options The options
   */
  constructor(from, options) {
    this.name = options.name

    this._group = null
    this._doors = {}

    this.from = from
    this.options = { ...options }

    this.init()

    this.loadMeshes(options.meshes)
    this.loadDoors(options.doors)

    this.placePlayer()
    game.camera.move(options.camera.position, options.camera.rotation)
  }

  /**
   * Init the stage: creates a new group that will contains all the object used by the stage
   */
  init() {
    this.group = new THREE.Group()
    this.group.name = "Stage " + this.name
    game.scene.add(this.group)

    // Animate camera on tick
    game.addOnTickAnimation("stageControl", this.onTick.bind(this))
  }

  /**
   * Return stage's doors
   */
  getDoors() {
    return this._doors
  }

  /**
   * Return stage's group
   */
  getGroup() {
    return this._group
  }

  /**
   * Load all meshes needed to draw the stage
   */
  loadMeshes(meshes) {
    for (const mesh in meshes) {
      this.group.add(meshes[mesh])
    }
  }

  /**
   * Load all doors (doors are teleports to other stages)
   */
  loadDoors(doors) {
    for (let key in doors) {
      const door = new Door(key, doors[key])
      this._doors[key] = door
      if (door.get()) this.group.add(door.get())
    }
  }

  /**
   * Place the player in the scene
   */
  placePlayer() {
    const door = this._doors[this.from]
    const rotation = door.options.rotation ? door.options.rotation : 0

    const x = door.options.position.x + Math.sin(rotation) * 2
    const z = door.options.position.z + Math.cos(rotation) * 2

    game.player.get().position.x = x
    game.player.get().position.y = door.options.position.y
    game.player.get().position.z = z
  }

  /**
   * Called on every frame, check doors collisions
   */
  onTick() {
    if (!game.frozenControls) {
      // Check contact between player and doors
      for (let key in this._doors) {
        const door = this._doors[key]
        door.checkCollision(game)
      }
    }
  }

  /**
   * Clean the stage (remove animations + remove objects + dispose materials and geometries)
   */
  clean() {
    game.removeOnTickAnimation("stageControl")

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
