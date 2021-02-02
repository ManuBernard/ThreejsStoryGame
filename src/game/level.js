import * as THREE from "three"

const textureLoader = new THREE.TextureLoader()

import { detectCollisionCubes } from "./helper/collisions"

export default class level {
  constructor(game, from) {
    console.log("from = " + from)

    this.game = game
    this.from = from
    this.isReady = true

    this.doors = []
    this.textures = {}
    this.materials = {}
    this.geometries = {}
    this.meshes = {}

    this.init()

    this.build()
    this.loadDoors()
    this.loadMeshes()

    this.loadPlayer()

    this.game.scene.add(this.group)

    console.log(this.doors)

    console.log(this.game.scene.children)
  }

  /**
   * Public
   */

  init() {
    this.group = new THREE.Group()
    this.group.name = "Current level"
  }

  loadMeshes() {
    for (const mesh in this.meshes) {
      this.group.add(this.meshes[mesh])
    }
  }

  loadPlayer() {
    this.doors.forEach((door) => {
      if (door.destination == this.from) {
        console.log(this.from)
        this.game.player.direction.position.set(
          door.spawn.x,
          door.spawn.y,
          door.spawn.z
        )
      }
    })
  }

  /**
   * Add a door
   */
  loadDoors() {
    this.materials["door"] = new THREE.MeshBasicMaterial({
      wireframe: true,
    })

    this.doors.forEach((door, index) => {
      if (door.position) {
        this.geometries["door" + index] = new THREE.BoxBufferGeometry(
          door.size.x,
          door.size.y,
          door.size.z
        )

        door.mesh = new THREE.Mesh(
          this.geometries["door" + index],
          this.materials["door"]
        )

        door.mesh.name = "Door to " + door.destination

        door.mesh.userData.doorTo = door.destination

        door.mesh.position.set(
          door.position.x,
          door.position.y,
          door.position.z
        )

        this.doors.push(door)
        this.group.add(door.mesh)

        // Preload level
        this.game.loadLevel(door.destination)
      }
    })
  }

  loadTexture(name, source) {
    this.textures[name] = textureLoader.load(source)
  }

  watch() {
    if (this.isReady) this._checkDoorCollision()
  }

  /**
   *
   *
   *  Private
   *
   *
   */

  _clean() {
    for (const material in this.materials) {
      this.materials[material].dispose()
    }

    this.materials = {}

    for (const geometry in this.geometries) {
      this.geometries[geometry].dispose()
    }

    this.geometries = {}

    this.game.scene.remove(this.group)

    // for (let i = scene.children.length - 1; i >= 0; i--) {
    //   const obj = scene.children[i]

    //   if (!obj.userData.preserve) {
    //     console.log("remove ob", obj)
    //     this.game.scene.remove(obj)
    //   }
    // }
  }

  /**
   * Check for contact with doors
   */
  _checkDoorCollision() {
    if (this.game.scene) {
      this.game.scene.traverse(
        function (obj) {
          if (obj && obj.userData.doorTo) {
            const col = detectCollisionCubes(obj, this.game.player.body)

            if (col) {
              this.isReady = false
              this.game.startLevel(
                obj.userData.doorTo,
                this.game.currentLevel.name
              )
            }
          }
        }.bind(this)
      )
    }
  }
}
