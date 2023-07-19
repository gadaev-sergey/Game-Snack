import state from "./state"
import vars from "./vars"
import anime from 'animejs/lib/anime.es.js';

export function gameOver() {
    const popup = document.createElement('div')
    const popupWrapper = document.createElement('div')
    const popupContent = document.createElement('div')
    const title = document.createElement('div')
    const desc = document.createElement('div')
    const btnRestart = document.createElement('button')

    popup.classList.add('popup','popup-game-over')
    popupWrapper.classList.add('popup__wrapper','popup-game-over__wrapper')
    popupContent.classList.add('popup__content','popup-game-over__content')
    title.classList.add('popup__title','popup-game-over__title')
    desc.classList.add('popup__desc','popup-game-over__desc')
    btnRestart.classList.add('popup__btn','popup-game-over__btn')

    title.textContent = 'GAME OVER'
    desc.innerHTML = `Твой рекорд - ${state.maxPoints} очков.<br> ${state.userName}, хочешь попробовать еще раз?`
    btnRestart.textContent = 'Ессественно'

    popupContent.append(title, desc, btnRestart)
    popupWrapper.append(popupContent)
    popup.append(popupWrapper)

    btnRestart.addEventListener('click', () => {
        location.reload()
    })

    return popup
}

export function createWelcome(auth) {
    const popup = document.createElement('div')
    const popupWrapper = document.createElement('div')
    const popupContent = document.createElement('div')
    const title = document.createElement('div')
    const desc = document.createElement('div')
    const form = document.createElement('form')
    const input = document.createElement('input')
    const btnStart = document.createElement('button')

    popup.classList.add('popup')
    popupWrapper.classList.add('popup__wrapper')
    popupContent.classList.add('popup__content')
    title.classList.add('popup__title')
    desc.classList.add('popup__desc')
    form.classList.add('popup__form')
    input.classList.add('popup__input')
    btnStart.classList.add('popup__btn')

    title.textContent = 'Игра - Перекус'
    desc.innerHTML = auth ?
        `Привет ${auth.name}.<br>Твой рекорд - ${auth.maxPoints} очков. Правила все теже - собери 4 в ряд по горизонтали или по вертикали` :
        'Правила просты - собери 4 в ряд по горизонтали или по вертикали. Управление доступно со стрелочек на клавиатуре'
    input.placeholder = 'Введите имя'
    btnStart.textContent = 'Начать'

    input.addEventListener('input', e => {
        e.target.value = e.target.value.substr(0, 8)
    })

    auth ?
        form.append(btnStart) :
        form.append(input, btnStart)
    popupContent.append(title, desc, form)
    popupWrapper.append(popupContent)
    popup.append(popupWrapper)

    function submit (beforeAnim, callback) {
        form.addEventListener('submit', e => {
            e.preventDefault()
            beforeAnim()
            btnStart.disabled = true
            const animation = anime.timeline({
                targets: ['.popup__title'],
                duration: 150,
                easing: 'easeInQuad',
            }).add({
                opacity: 0,
                scale: 0
            }).add({
                targets: ['.popup__desc'],
                duration: 150,
                easing: 'easeInQuad',
                opacity: 0,
                scale: 0
            }).add({
                targets: ['.popup__input'],
                duration: 150,
                easing: 'easeInQuad',
                opacity: 0,
                scale: 0
            }).add({
                targets: ['.popup__btn'],
                duration: 150,
                easing: 'easeInQuad',
                opacity: 0,
                scale: 0
            }).add({
                targets: ['.popup'],
                duration: 500,
                easing: 'easeInSine',
                opacity: 0,
            })
            animation.finished.then(() => {
                callback()
                popup.remove()
            })
        })
    }

    return {popup, input, submit}
}

export function createBoxBoard() {
    const boxBoard = document.createElement('div')
    boxBoard.classList.add('game__box-board')

    return boxBoard
}

export function createBoard() {
    const board = document.createElement('div')
    const user = document.createElement('div')
    const points = document.createElement('div')
    const pointsDesc = document.createElement('div')
    const lvl = document.createElement('div')
    const lvlDesc = document.createElement('div')

    board.classList.add('game__board')
    user.classList.add('game__user')
    points.classList.add('game__points')
    pointsDesc.classList.add('game__desc')
    lvl.classList.add('game__lvl')
    lvlDesc.classList.add('game__desc')

    points.id = 'game-points'

    pointsDesc.textContent = 'points'
    lvlDesc.textContent = 'lvl'

    board.append(user, points, pointsDesc, lvl, lvlDesc)

    return {board, user, points, lvl}
}

export function createController() {
    const container = document.createElement('div')
    const left = document.createElement('div')
    const down = document.createElement('div')
    const right = document.createElement('div')

    container.classList.add('game-controller')
    left.classList.add('game-controller__btn')
    down.classList.add('game-controller__btn')
    right.classList.add('game-controller__btn')

    left.innerHTML = vars.svg.left
    down.innerHTML = vars.svg.down
    right.innerHTML = vars.svg.right

    container.append(left, down, right)

    return {container, left, down, right}
}

export function createBoxGrid() {
    const boxGrid = document.createElement('div')
    boxGrid.classList.add('game__box-grid')

    return boxGrid
}

export function createBoxController() {
    const boxController = document.createElement('div')
    boxController.classList.add('game__box-controller')

    return boxController
}

export function createGrid() {
    const grid = document.createElement('div')
    grid.classList.add('game__grid')
    state.tetrisGrid.forEach(line => {
        const row = createRow(line)
        grid.append(row)
    })
    return grid
}

function createRow(line) {
    const row = document.createElement('div')
    row.classList.add('game__row')
    line.forEach(item => {
        const elem = item ? createFigure(item) : createСell()
        row.append(elem)
    });
    return row
}

function createСell() {
    const cell = document.createElement('div')
    cell.classList.add('game__cell')
    return cell
}

function createFigure(number) {
    const cell = document.createElement('div')
    const figure = document.createElement('div')
    cell.classList.add('game__cell', 'game__cell--pos')
    figure.classList.add('game__figure')
    figure.style.backgroundImage = `url('img/game/figure/${number}.png')`
    cell.append(figure)
    return cell
}
