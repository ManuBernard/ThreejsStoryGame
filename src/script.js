import "./style.css"

import Game from "./game/game.js"
const game = new Game()

game.start()

window.setTimeout(function () {
  game.loadLevel("level1", () => {
    game.startLevel("level1", "init")
  })
}, 100)
