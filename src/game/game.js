import * as THREE from "three"
import { gui } from "./helper/debug"

import Player from "./player.js"

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

export default class Game {
  constructor() {
    this.currentLevel

    this._initScene()
    this._initCanvas()
    this._initRenderer()
    this._initCamera()
    this._initHandleSize()
    this._initPlayer()

    // Debug
    this._initDebug()
  }

  _initCanvas() {
    this.canvas = document.querySelector("canvas.webgl")
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })

    this.renderer.setSize(sizes.width, sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  _initScene() {
    this.scene = new THREE.Scene()
  }

  _initCamera(fov = 50, near = 0.1, far = 1000) {
    this.camera = new THREE.PerspectiveCamera(
      fov,
      sizes.width / sizes.height,
      near,
      far
    )
  }

  _initHandleSize() {
    // Handle screen resize
    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      // Update camera
      this.camera.aspect = sizes.width / sizes.height
      this.camera.updateProjectionMatrix()

      // Update renderer
      this.renderer.setSize(sizes.width, sizes.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
  }

  _initPlayer() {
    this.player = new Player()
    this.scene.add(this.player.body)
    this.player.body.position.x = 1
  }

  _initDebug() {
    this.debug = gui

    // Camera
    const camera = this.debug.addFolder("Camera")
    camera.add(this.camera.position, "x").name("PosX")
    camera.add(this.camera.position, "y").name("PosY")
    camera.add(this.camera.position, "z").name("Posz")
    camera
      .add(this.camera.rotation, "x")
      .name("RotX")
      .min(-Math.PI * 2)
      .max(Math.PI * 2)
      .step(0.001)
    camera
      .add(this.camera.rotation, "y")
      .name("RotY")
      .min(-Math.PI * 2)
      .max(Math.PI * 2)
      .step(0.001)
    camera
      .add(this.camera.rotation, "z")
      .name("RotZ")
      .min(-Math.PI * 2)
      .max(Math.PI * 2)
      .step(0.001)
  }

  // Public

  /**
   * Start game
   */
  start() {
    // Init clock
    const clock = new THREE.Clock()

    const tick = function () {
      const elapsedTime = clock.getElapsedTime()

      if (this.currentLevel) this.currentLevel.watch()

      this.player.move()

      // Rerender the scene
      this.renderer.render(this.scene, this.camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }.bind(this)

    tick()
  }

  /**
   * Load level
   */
  loadLevel(to, from) {
    import("../levels/" + to).then(
      function (module) {
        const level = module.default
        this.currentLevel = new level(this, from)
      }.bind(this)
    )
  }

  /**
   * Add camera
   */
  moveCamera(position, rotation) {
    this.camera.position.set(position.x, position.y, position.z)
    this.camera.rotation.set(rotation.x, rotation.y, rotation.z)

    this.scene.add(this.camera)
  }
}

// Scene