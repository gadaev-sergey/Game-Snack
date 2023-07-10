import state from "./state"
import vars from "./vars"

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

    user.textContent = 'user'
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
