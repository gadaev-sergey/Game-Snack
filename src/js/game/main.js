import User from "./class/User";
import Rules from "./class/Rules";
import Game from "./class/Game";

const container = document.getElementById('app')

const popup = document.createElement('div')
const popupWrapper = document.createElement('div')
const popupContent = document.createElement('div')
const title = document.createElement('div')
const desc = document.createElement('div')
const btnStart = document.createElement('button')

popup.classList.add('popup')
popupWrapper.classList.add('popup__wrapper')
popupContent.classList.add('popup__content')
title.classList.add('popup__title')
desc.classList.add('popup__desc')
btnStart.classList.add('popup__btn')

title.textContent = 'Игра - Перекус'
desc.textContent = 'Собери 4 в ряд...'
btnStart.textContent = 'Start'

popupContent.append(title, desc, btnStart)
popupWrapper.append(popupContent)
popup.append(popupWrapper)

container.append(popup)

btnStart.addEventListener('click', () => {
    const USER = new User({name: 'Красавчик', lvl: 1})
    const RULES = new Rules()
    const GAME = new Game(container, USER, RULES)

    GAME.start()
})

