/** @module Door */

import * as THREE from "three"

/** Class representing a door, the way to travel from a stage to another. */
export default class door {
  /**
   * Create a door.
   * @param {string} destination The name of destination stage
   * @param {object} data Set of data to create the door
   * @param {object.size} data Set of data to create the door
   */
  constructor(destination, data) {
    const doorGeometry = new THREE.BoxBufferGeometry(
      data.size.x,
      data.size.y,
      data.size.z
    )
    const doorMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
    })

    this.mesh = new THREE.Mesh(doorGeometry, doorMaterial)
    this.mesh.name = "Door to " + destination
    this.mesh.userData.doorTo = destination
    this.mesh.position.set(data.position.x, data.position.y, data.position.z)
  }
}
