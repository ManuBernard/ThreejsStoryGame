/** @module Game */
import Stage from "./stage.js"

import {
  initScene,
  initCanvas,
  initRenderer,
  initCamera,
  initHandleSize,
  initPlayer,
} from "./helper/initgame"

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

class Game {
  constructor() {
    this._data = {}

    this.scene = initScene()
    this.canvas = initCanvas()
    this.renderer = initRenderer(sizes, this.canvas)
    this.camera = initCamera(sizes)
    this.player = initPlayer()

    this.currentStage = null
    this.loadedStages = []

    this.frozenControls = false

    // Handle window resize
    initHandleSize(sizes, this.camera, this.renderer)
  }

  /**
   * Start game
   */
  start() {
    this.scene.add(this.player.direction)

    const tick = function () {
      if (this.currentStage && !this.frozenControls) this.currentStage.watch()

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
   * Move camera
   */
  moveCamera(position, rotation) {
    this.camera.position.set(position.x, position.y, position.z)
    this.camera.rotation.set(rotation.x, rotation.y, rotation.z)
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
