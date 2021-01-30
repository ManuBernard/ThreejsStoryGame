import "./style.css"

import Game from "./game/game.js"
const game = new Game()

game.start()

window.setTimeout(function () {
  game.loadStage("fabrik", () => {
    game.startStage("fabrik", "init")
  })
}, 100)
