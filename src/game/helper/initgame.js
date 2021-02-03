import * as THREE from "three"

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
