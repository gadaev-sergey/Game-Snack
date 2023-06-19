import { createGrid, createBoxGrid, createController, createBoxController } from "../createElem"
import { randomCol, randomFigure } from "../help"
import { animLeft, animRight } from "../anim"
import state from "../state"

export default class Game {
    constructor(container, user, rules) {
        this.container = container
        this.user = user
        this.rules = rules
        this.boxGrid = createBoxGrid()
        this.grid = createGrid()
        this.boxController = createBoxController()
        this.controller = createController()
        this.currentCol = randomCol()
        this.currentColElem = this.currentCol
        this.currentRow = 0
        this.currentFallingSpeed = state.fallingSpeed
        this.figure = 0
        this._render()
        this._hendler()
    }

    start() {
        this._addFigure()
        this._renderGrid()
        this._moveFigure()
    }

    _addFigure() {
        state.fallingSpeed = this.currentFallingSpeed
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

    async _checkRules() {
        const check = this.rules.check()
        if (check) {
            this._renderGrid()
            const promises = await this.rules.drop(this.grid)
            if (promises.includes(true)) {
                console.log('повтор')
                this._renderGrid()
                await this.rules.drop(this.grid) // TODO  нужно сделать рекурсию
                await this._checkRules()
            }
        }
    }

    _renderGrid() {
        this.boxGrid.innerHTML = ''
        this.grid = createGrid()
        this.boxGrid.append(this.grid)
    }

    _render() {
        this.container.classList.add('game')
        this.container.innerHTML = ''
        this._renderGrid()
        this.boxController.append(this.controller.container)
        this.container.append(this.boxGrid, this.boxController)
    }

    _updateSpeed() {
        const elem = this.grid.children[this.currentRow].children[this.currentCol].children[0]
        const value = state.fallingSpeed * 0.001 + 's'
        elem ? elem.style.setProperty('--speed', value) : null
    }

    _hendler() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') this._moveLeft()
            if (event.key === 'ArrowDown') this._moveDown()
            if (event.key === 'ArrowUp') this._moveRotation()
            if (event.key === 'ArrowRight') this._moveRight()
        })

        this.controller.left.addEventListener('click', () => this._moveLeft())
        this.controller.down.addEventListener('click', () => this._moveDown())
        this.controller.rotation.addEventListener('click', () => this._moveRotation())
        this.controller.right.addEventListener('click', () => this._moveRight())
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

    _moveRotation() {
        console.log("rotation")
    }
}
