import "./style.css"

import Game from "./game/game.js"

// Initialize the game
const game = new Game()
game.start()
game.loadStage("map", "init")
