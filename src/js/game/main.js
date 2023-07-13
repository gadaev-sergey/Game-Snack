import User from "./class/User";
import Rules from "./class/Rules";
import Game from "./class/Game";
import {createWelcome} from "./createElem"

const container = document.getElementById('app')
const welcome = createWelcome()
container.append(welcome.popup)

welcome.submit(() => {
    const USER = new User({name: 'Красавчик', lvl: 1})
    const RULES = new Rules()
    const GAME = new Game(container, USER, RULES)
    GAME.start()
})
