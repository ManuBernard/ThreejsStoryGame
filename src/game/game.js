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
    this._data = {}

    this.scene = initScene()
    this.canvas = initCanvas()
    this.renderer = initRenderer(sizes, this.canvas)

    this.currentStage = null
    this.loadedStages = []

    this.camera = null
    this.player = null

    this.frozenControls = false
  }

  init() {
    this.camera = new Camera(sizes)
    this.player = new Player()

    this.scene.add(this.player.get())

    new OrbitControls(this.camera.get(), this.canvas)

    // const axesHelper = new THREE.AxesHelper(1)
    // this.scene.add(axesHelper)

    // Handle window resize
    initHandleSize(sizes, this.camera.get(), this.renderer)
  }

  /**
   * Start game
   */
  start() {
    this.init()

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
  }

  /**
   * Load the stage
   * @param {string} to The name of the stage to load
   * @param {string} from The name of the stage coming from (used to locate the player to the correct spawn in the new stage)
   */
  loadStage(to, from) {
    if (this.frozenControls) {
      return
    }

    this.frozenControls = true

    if (this.currentStage) {
      this.currentStage.clean()
    }

    // Check if the stage is already loaded
    if (this.loadedStages.hasOwnProperty("to")) {
      this._loadStage(this.loadedStages[to], from)
    } else {
      // If not, load it
      this._loadStageChunk(
        to,
        function () {
          this._loadStage(this.loadedStages[to], from)
        }.bind(this)
      )
    }
  }

  /**
   * Add an animation to be executed on game tick
   * @param {string} name The stage of the animation
   * @param {function} animation The to be executed
   */
  addOnTickAnimation(name, animate) {
    animationsOnTick.push({
      name,
      animate,
    })
  }

  /**
   * Add an animation to be executed on game tick
   * @param {string} name The stage of the animation
   * @param {function} animation The to be executed
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
   * @param {string} from The name of the current stage
   * @private
   */
  _loadStage(stage, from) {
    this.currentStage = new Stage(stage, from)

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
    for (let key in this.currentStage.doors) {
      if (this.currentStage.doors[key].size) {
        this._loadStageChunk(key)
      }
    }
  }

  /**
   *  Load webpack chunk for a specific chunk
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
