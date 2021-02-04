/** @module Stage */

import * as THREE from "three"
import game from "./game"
import Door from "./door"

/** Stage class: responsible for the meshs, doors, positionning camera.  */
export default class stage {
  /**
   * Create a stage.
   * @param {string} from The name of the stage where the player is coming from
   * @param {object} options The options
   */
  constructor(options) {
    this._from = "init"
    this._group = new THREE.Group()
    this._group.name = "Stage " + this.name
    this._doors = {}
    this._meshes = []
    this._physicObjects = []

    game.scene.add(this._group)
  }

  /**
   * Start the stage
   */
  start() {
    this.spawnPlayer(this._doors[this._from])

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
    this.objects = meshes
    for (const mesh in meshes) {
      this._group.add(meshes[mesh])
    }
  }

  /**
   * Load all meshes needed to draw the stage
   */
  loadPhysicsObjects(objects) {
    this._physicObjects = objects
    for (const key in objects) {
      this._group.add(objects[key].mesh)
      game.world.addBody(objects[key].body)
    }
  }

  /**
   * Load all doors (doors are teleports to other stages)
   */
  loadDoors(doors) {
    for (let key in doors) {
      const door = new Door(key, doors[key])
      this._doors[key] = door
      if (door.get()) this._group.add(door.get())
    }
  }

  /**
   * Spawn the player in the scene in front of the corect door
   */
  spawnPlayer(door) {
    const doorPosition = door.options.position
    const rotation = door.options.rotation ? door.options.rotation : 0

    const x = doorPosition.x + Math.sin(rotation) * 2
    const y = doorPosition.y + 0
    const z = doorPosition.z + Math.cos(rotation) * 2

    game.player.get().position.x = x
    game.player.get().position.y = y
    game.player.get().position.z = z
  }

  /**
   * Called on every frame, check doors collisions
   */
  onTick() {
    if (!game.frozenControls) {
      // Check collision between player and doors
      for (let key in this._doors) {
        const door = this._doors[key]
        door.checkCollision(game)
      }
      for (const object of this._physicObjects) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
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

    game.scene.remove(this._group)
  }
}
