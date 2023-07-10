import { createBoxBoard, createBoard, createGrid, createBoxGrid, createController, createBoxController } from "../createElem"
import { randomCol, randomFigure } from "../help"
import { animLeft, animRight } from "../anim"
import anime from 'animejs/lib/anime.es.js';
import state from "../state"

export default class Game {
    constructor(container, user, rules) {
        this.container = container
        this.boxBoard = createBoxBoard(),
        this.board = createBoard(),
        this.boxGrid = createBoxGrid()
        this.grid = createGrid()
        this.boxController = createBoxController()
        this.controller = createController()
        this.currentCol = randomCol()
        this.currentColElem = this.currentCol
        this.currentRow = 0
        this.figure = 0
        this.userName = this.board.user
        this.points = this.board.points
        this.lvl = this.board.lvl
        this.user = user
        this.rules = rules
        this._render()
        this._hendler()
    }

    async start() {
        this._addFigure()
        this._renderGrid()
        await this._moveFigure()
    }

    _addFigure() {
        state.fallingSpeed = state.currentFallingSpeed
        this._updateSpeed()
        this.figure = randomFigure()
        state.tetrisGrid[this.currentRow][this.currentCol] = this.figure
        this.grid = createGrid()
    }

    async _moveFigure() {
        const possibleStep = this.currentRow + 1
        const isRow = state.tetrisGrid[possibleStep]
        const isCol = isRow ? state.tetrisGrid[possibleStep][this.currentCol] === 0 : null
        const isGameOver = state.tetrisGrid[0].every(elem => elem !== 0)

        this.currentColElem = this.currentCol

        if (this.currentRow === 0) {
            state.isControllerAllowed = false
            const target = this.grid.children[this.currentRow].children[this.currentColElem].children[0]
            target.style.transform = 'scale(0)'
            const promise = await new Promise((resolve, reject) => {
                const animation = anime({
                    targets: [
                        target,
                    ],
                    keyframes: [
                        {scale: 0, opacity: 0},
                        {scale: 1, opacity: 1},
                      ],
                    duration: state.addAnimationDuration,
                    easing: 'linear'
                })
                animation.finished.then(() => {
                    state.isControllerAllowed = true
                    resolve()
                })
            })
        }

        if (isRow && isCol) {
            const elem = this.grid.children[this.currentRow].children[this.currentCol].children[0]
            this._updateSpeed()
            elem.classList.add('anim-down')
            elem.addEventListener('animationend', () => {
                state.tetrisGrid[this.currentRow][this.currentCol] = 0
                this.currentRow++
                state.tetrisGrid[this.currentRow][this.currentCol] = this.figure
                this._renderGrid()
                this._moveFigure()
            })
        } else if (isGameOver) {
            setTimeout(() => {
                alert("Game Over")
            }, 100)
        }
        else {
            await this._checkRules()
            this.currentRow = 0
            this.currentCol = randomCol()
            this.start()
        }
    }

    async _startRules() {
        this._renderGrid()
        this._renderLvl()
        await this.rules.check(this.grid)
        const promises = await this.rules.drop(this.grid)
        if (promises.includes(true)) {
            await this._startRules()
        }
    }

    async _checkRules() {
        const check = await this.rules.check(this.grid)
        if (check) {
            await this._startRules()
        }
    }

    _renderGrid() {
        this.boxGrid.innerHTML = ''
        this.grid = createGrid()
        this.boxGrid.append(this.grid)
    }

    _renderPoints() {
        this.points.textContent = state.points
    }

    _renderLvl() {
        this.lvl.textContent = state.lvl
    }

    _render() {
        this.container.classList.add('game')
        this.container.innerHTML = ''
        this.userName.textContent = state.userName
        this._renderPoints()
        this._renderLvl()
        this.boxBoard.append(this.board.board)
        this._renderGrid()
        this.boxController.append(this.controller.container)
        this.container.append(this.boxBoard, this.boxGrid, this.boxController)
    }

    _updateSpeed() {
        const elem = this.grid.children[this.currentRow].children[this.currentCol].children[0]
        const value = state.fallingSpeed * 0.001 + 's'
        elem ? elem.style.setProperty('--speed', value) : null
    }

    _hendler(remove = false) {
        const keydownHendler = (event) => {
            if (event.key === 'ArrowLeft' && state.isControllerAllowed) this._moveLeft()
            if (event.key === 'ArrowDown' && state.isControllerAllowed) this._moveDown()
            if (event.key === 'ArrowRight' && state.isControllerAllowed) this._moveRight()
        }
        const left = () => {
            if (state.isControllerAllowed) this._moveLeft()
        }
        const down = () => {
            if (state.isControllerAllowed) this._moveDown()
        }
        const right = () => {
            if (state.isControllerAllowed) this._moveRight()
        }

        window.addEventListener('keydown', keydownHendler)
        this.controller.left.addEventListener('click', left)
        this.controller.down.addEventListener('click', down)
        this.controller.right.addEventListener('click', right)
    }

    _moveLeft() {
        const possibleStep = this.currentCol - 1
        const isNoNull = this.currentCol > 0
        const isFreeCell = state.tetrisGrid[this.currentRow + 1][possibleStep] === 0

        if (isNoNull && isFreeCell) {
            animLeft(this.grid.children[this.currentRow].children[this.currentColElem].children[0])
            state.tetrisGrid[this.currentRow][this.currentCol] = 0
            this.currentCol -= 1
        }
    }

    _moveRight() {
        const possibleStep = this.currentCol + 1
        const isNoNull = this.currentCol + 1 < state.tetrisGrid[this.currentRow].length
        const isFreeCell = state.tetrisGrid[this.currentRow + 1][possibleStep] === 0

        if (isNoNull && isFreeCell) {
            animRight(this.grid.children[this.currentRow].children[this.currentColElem].children[0])
            state.tetrisGrid[this.currentRow][this.currentCol] = 0
            this.currentCol += 1
        }
    }

    _moveDown() {
        state.fallingSpeed = 10
        this._updateSpeed()
    }
}
