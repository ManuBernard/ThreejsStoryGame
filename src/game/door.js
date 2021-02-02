import * as THREE from "three"

export default class door {
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
