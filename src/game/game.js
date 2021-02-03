/** @module Game */

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import Player from "./player.js"
import Stage from "./stage.js"

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * Class representing the game, contains the THREEJS scene, the renderer, the player the level...
 */
export default class Game {
  /**
   * Create the game.
   */
  constructor() {
    this.scene = null
    this.canvas = null
    this.renderer = null
    this.currentStage = null
    this.loadedStages = []
    this.player = null
    this.camera = null

    // Game state
    this.frozen = false

    this._initScene()
    this._initCanvas()
    this._initRenderer()
    this._initCamera()
    this._initHandleSize()
    this._initPlayer()

    const controls = new OrbitControls(this.camera, this.canvas)
    controls.enableDamping = true

    const axesHelper = new THREE.AxesHelper(20)
    this.scene.add(axesHelper)
  }

  /**
   * Start game
   */
  start() {
    const tick = function () {
      if (this.currentStage && !this.frozen) this.currentStage.watch()

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
   * Load the stage (the game is divided into many stages) each stages is a "mini scene".
   * Loading a new stage will first clean the current stage (if there is one), meaning removing all meshes and disposes materials and geometries.
   * Then it will check if the new stage is already loaded, if not, it will load the webpack chunk and once it's done, load the stage.
   * Finally it will preload all the stages that are directly availables via the doors of the new loaded stage.
   * @param {string} to The name of the stage to load
   * @param {string} from The name of the stage coming from (used to locate the player to the correct spawn in the new stage)
   */
  loadStage(to, from) {
    if (this.frozen) {
      return
    }

    this.frozen = true

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
   *
   *
   *  Private
   *
   *
   */

  /**
   * Load stage
   * @param {ObjectConstructor} stage The stage to load
   * @param {string} from The name of the current stage
   * @private
   */
  _loadStage(stage, from) {
    this.currentStage = new Stage(stage, this, from)

    window.requestAnimationFrame(
      function () {
        this.frozen = false
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

  /**
   * Initialize canvas
   * @private
   */
  _initCanvas() {
    this.canvas = document.querySelector("canvas.webgl")
  }

  /**
   * Create renderer
   * @private
   */
  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })

    this.renderer.setSize(sizes.width, sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  /**
   * Create scene
   * @private
   */
  _initScene() {
    this.scene = new THREE.Scene()
  }

  /**
   * Initialize player and add to scene
   * @private
   */
  _initPlayer() {
    this.player = new Player()
    this.player.addTo(this.scene)
  }

  /**
   * Initialize camera
   * @param {float} fov Field of view
   * @param {float} near Near distance
   * @param {float} far Far distance
   * @private
   */
  _initCamera(fov = 50, near = 0.1, far = 1000) {
    this.camera = new THREE.PerspectiveCamera(
      fov,
      sizes.width / sizes.height,
      near,
      far
    )

    this.scene.add(this.camera)
  }

  /**
   * Handle screen resize
   * @private
   */
  _initHandleSize() {
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
}
