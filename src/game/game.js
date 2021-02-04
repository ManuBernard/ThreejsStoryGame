/** @module Game */
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import Stage from "./stage"
import Player from "./player"
import Camera from "./camera"

import {
  initScene,
  initCanvas,
  initRenderer,
  initHandleSize,
} from "./helper/initgame"

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const animationsOnTick = []

class Game {
  constructor() {
    this.scene = initScene()
    this.canvas = initCanvas()
    this.renderer = initRenderer(sizes, this.canvas)

    this.currentStage = null
    this.loadedStages = []

    this.camera = null
    this.player = null

    this.frozenControls = false
  }

  /**
   * Start game
   */
  start(options) {
    this.options = { ...options }

    this.camera = new Camera(sizes)
    this.player = new Player()

    this.scene.add(this.player.get())

    // Handle window resize
    initHandleSize(sizes, this.camera.get(), this.renderer)

    const tick = function () {
      animationsOnTick.forEach((animation) => {
        animation.animate()
      })

      // Rerender the scene
      this.renderer.render(this.scene, this.camera.get())

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }.bind(this)

    tick()

    if (this.options.debug) {
      new OrbitControls(this.camera.get(), this.canvas)

      const axesHelper = new THREE.AxesHelper(1)
      this.scene.add(axesHelper)
    }
  }

  /**
   * Load the stage
   * @param {string} to The name of the stage to load
   */
  loadStage(to) {
    if (this.frozenControls) {
      return
    }

    this.frozenControls = true

    if (this.currentStage) {
      this.currentStage.clean()
    }

    // Check if the stage is already loaded
    if (this.loadedStages.hasOwnProperty("to")) {
      this._loadStage(this.loadedStages[to])
    } else {
      // If not, load it
      this._loadStageChunk(
        to,
        function () {
          this._loadStage(this.loadedStages[to])
        }.bind(this)
      )
    }
  }

  /**
   * Add an animation to be executed on game tick
   * @param {string} name The name of the animation
   * @param {function} animation The animation to be executed
   */
  addOnTickAnimation(name, animate) {
    animationsOnTick.push({
      name,
      animate,
    })
  }

  /**
   * Remove an animation from the tick loop
   * @param {string} name The name of the animation to remove
   */
  removeOnTickAnimation(name) {
    animationsOnTick.splice(
      animationsOnTick.findIndex((animation) => animation.name === name),
      1
    )
  }

  /**
   * Load stage
   * @param {ObjectConstructor} stage The stage to load
   * @private
   */
  _loadStage(options) {
    options.from = this.currentStage ? this.currentStage.options.name : "init"
    this.currentStage = new Stage(options)

    window.requestAnimationFrame(
      function () {
        this.frozenControls = false
        this._preloadStages()
      }.bind(this)
    )
  }

  /**
   * Preload all stages that can be accessed from this one (based on doors in the stage)
   * @private
   */
  _preloadStages() {
    for (let key in this.currentStage.getDoors()) {
      if (this.currentStage.getDoors()[key].size) {
        this._loadStageChunk(key)
      }
    }
  }

  /**
   *  Load webpack chunk for a specific stage
   * @param {string} to The name of chunk to load (file name door key)
   * @param {function} callback Function to execute once loaded
   * @private
   */
  _loadStageChunk(to, callback = null) {
    import(/* webpackChunkName:  "[request]" */ `../stages/${to}`).then(
      function (module) {
        this.loadedStages[to] = module.stage

        if (callback) {
          callback()
        }
      }.bind(this)
    )
  }
}

const game = new Game()

export default game
