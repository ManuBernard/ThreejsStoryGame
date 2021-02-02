import * as THREE from "three"
import { gui } from "./helper/debug"

import Player from "./player.js"
import Stage from "./stage.js"

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

export default class Game {
  constructor() {
    this.currentStage = null
    this.loadedStages = []

    this._initScene()
    this._initCanvas()
    this._initRenderer()
    this._initCamera()
    this._initHandleSize()
    this._initPlayer()

    this.running = false
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

      if (this.currentStage) this.currentStage.watch()

      this.player.move()

      this.camera.lookAt(this.player.direction.position)

      this.player.direction.lookAt(
        this.camera.position.x,
        this.player.direction.position.y,
        this.camera.position.z
      )
      // Rerender the scene
      this.renderer.render(this.scene, this.camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }.bind(this)

    tick()
  }

  /**
   * Load Stage
   */
  loadStage(to, callback) {
    console.log("Loading" + to)

    import(/* webpackChunkName:  "[request]" */ `../stages/${to}`).then(
      function (module) {
        console.log("Loaded " + to)
        this.loadedStages[to] = module.stage

        if (callback) {
          callback()
        }
      }.bind(this)
    )
  }

  /**
   * Start Stage
   */
  startStage(to, from) {
    // Clean the current Stage
    if (this.currentStage) {
      this.currentStage._clean()
    }

    // Launch the new Stage
    window.requestAnimationFrame(
      function () {
        this.currentStage = new Stage(this.loadedStages[to], this, from)
        this.preloadStages()
      }.bind(this)
    )
  }

  /**
   * Preload stages
   */

  preloadStages() {
    for (let key in this.currentStage.doors) {
      if (this.currentStage.doors[key].position) {
        this.loadStage(key)
      }
    }
  }

  /**
   * Move camera
   */
  moveCamera(position, rotation) {
    this.camera.position.set(position.x, position.y, position.z)
    this.camera.rotation.set(rotation.x, rotation.y, rotation.z)

    this.scene.add(this.camera)
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
    this.player.addTo(this.scene)
  }
}

// Scene
