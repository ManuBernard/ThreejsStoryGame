import * as THREE from "three"
import Player from "../player"
/**
 * Initialize canvas
 * @private
 */
export const initCanvas = () => {
  return document.querySelector("canvas.webgl")
}

/**
 * Create renderer
 * @private
 */
export const initRenderer = (sizes, canvas) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  })

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  return renderer
}

/**
 * Create scene
 * @private
 */
export const initScene = () => {
  return new THREE.Scene()
}

/**
 * Initialize player and add to scene
 * @private
 */
export const initPlayer = () => {
  return new Player()
}

/**
 * Initialize camera
 * @param {float} fov Field of view
 * @param {float} near Near distance
 * @param {float} far Far distance
 * @private
 */
export const initCamera = (sizes, fov = 50, near = 0.1, far = 1000) => {
  return new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, near, far)
}

/**
 * Handle screen resize
 * @private
 */
export const initHandleSize = (sizes, camera, renderer) => {
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}
