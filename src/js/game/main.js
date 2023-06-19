import User from "./class/User";
import Rules from "./class/Rules";
import Game from "./class/Game";

const container = document.getElementById('app')
const USER = new User({name: 'Красавчик', lvl: 1})
const RULES = new Rules()
const GAME = new Game(container, USER, RULES)

GAME.start()
