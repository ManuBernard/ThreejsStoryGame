/** @module Game */
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as CANNON from "cannon-es"
import * as physics from "./helper/physics"

import Stage from "./stage"
import Player from "./player"
import Camera from "./camera"

import stageLoader from "./stageLoader"

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
    // Threejs scene, canvas & renderer
    this.scene = initScene()
    this.canvas = initCanvas()
    this.renderer = initRenderer(sizes, this.canvas)

    // The game current stage
    this.stage = null

    // The camera & the player
    this.camera = null
    this.player = null

    // Possibility to freeze the game for a while (for exemple during stage )
    this.frozenControls = false

    this.initWorld()
  }

  initWorld() {
    this.world = new CANNON.World()
    this.world.broadphase = new CANNON.SAPBroadphase(this.world)
    // this.world.allowSleep = true
    this.world.gravity.set(0, -9.02, 0)

    const defaultContactMaterial = new CANNON.ContactMaterial(
      physics.defaultMaterial,
      physics.defaultMaterial,
      {
        friction: 1,
        restitution: 0.7,
      }
    )

    this.world.defaultContactMaterial = defaultContactMaterial
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

    const clock = new THREE.Clock()
    let oldElapsedTime = 0

    const tick = function () {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - oldElapsedTime
      oldElapsedTime = elapsedTime

      this.world.step(1 / 60, deltaTime, 3)

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
    stageLoader.load(to)
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
}

const game = new Game()

export default game
