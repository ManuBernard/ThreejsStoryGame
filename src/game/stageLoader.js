/** @module StageLoader */

import game from "./game"
import Stage from "./stage"

/** Stage class: responsible for the meshs, doors, positionning camera.  */
class StageLoader {
  constructor() {
    this.loadedStages = {}
  }

  /**
   * Load the stage
   * @param {string} to The name of the stage to load
   */
  load(to, from) {
    if (game.frozenControls) {
      return
    }

    game.frozenControls = true

    if (game.stage) {
      game.stage.clean()
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
   * Load stage
   * @param {ObjectConstructor} stage The stage to load
   * @private
   */
  _loadStage(options) {
    options.from = game.stage ? game.stage.options.name : "init"
    game.stage = new Stage(options)

    window.requestAnimationFrame(
      function () {
        game.frozenControls = false
        this._preloadStages()
      }.bind(this)
    )
  }

  /**
   * Preload all stages that can be accessed from this one (based on doors in the stage)
   * @private
   */
  _preloadStages() {
    for (let key in game.stage.getDoors()) {
      if (game.stage.getDoors()[key].size) {
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

const stageLoader = new StageLoader()

export default stageLoader
