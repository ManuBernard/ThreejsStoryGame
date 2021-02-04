import * as THREE from "three"
import * as CANNON from "cannon-es"

export const defaultMaterial = new CANNON.Material("concrete")
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

export const createBox = (size, position, rotation, material, mass) => {
  // Threejs
  const mesh = new THREE.Mesh(boxGeometry, material)
  mesh.scale.set(size.x, size.y, size.z)
  mesh.castShadow = true
  mesh.position.copy(position)
  mesh.rotation.x = -rotation.x
  // mesh.rotation.y = -rotation.y
  // mesh.rotation.z = -rotation.z

  // Cannon
  const shape = new CANNON.Box(
    new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
  )
  const body = new CANNON.Body({
    mass: mass,
    shape: shape,
    position: new CANNON.Vec3(0, 3, 0),
    material: defaultMaterial,
  })

  body.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), rotation.x)
  // body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, -1, 0), rotation.y)
  // body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, -1), rotation.z)

  body.position.copy(position)

  return {
    mesh,
    body,
  }
}
