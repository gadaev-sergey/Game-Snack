import User from "./class/User";
import Rules from "./class/Rules";
import Game from "./class/Game";
import {createWelcome} from "./createElem"

const USER = new User()
const auth = JSON.parse(USER.check())

const container = document.getElementById('app')
const welcome = createWelcome(auth)
container.append(welcome.popup)

const RULES = new Rules()
const GAME = new Game(container, USER, RULES)

function bedoreVisible() {
    if (auth) USER.changeName()
    else {
        const userName = welcome.input.value.trim()
        if (userName && userName !== '') USER.addUser(userName)
        else USER.addUser('user')
    }
    GAME.renderName()
}

const afterVisible = () => {
    GAME.start()
}

welcome.submit(bedoreVisible, afterVisible)
