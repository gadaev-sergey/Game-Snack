import state from "../state"
import anime from 'animejs/lib/anime.es.js';

export default class Rules {
    constructor() {
        this.isChange = false
    }

    async check(grid) {
        this.isChange = false
        await this._checkRow(grid)
        await this._checkCol(grid)

        return this.isChange
    }

    async _checkCol(grid) {
        const countCol = []
        const iterable = []
        const gridClearElements = []
        state.tetrisGrid[0].forEach((row, rowIndex) => {
            countCol.push(rowIndex)
        })
        countCol.forEach(col => {
            const currentCol = []
            state.tetrisGrid.forEach((row, rowIndex) => {
                const element = {
                    el: row[col],
                    colIndex: col,
                    rowIndex: rowIndex,
                }
                currentCol.push(element)
            })

            let first = {elem: null, elemIndex: null}
            let second = {elem: null, elemIndex: null}
            let third = {elem: null, elemIndex: null}
            let fourth = {elem: null, elemIndex: null}

            currentCol.forEach((elem, elemIndex) => {
                first = second
                second = third
                third = fourth
                fourth = {
                    elem: elem.el,
                    colIndex: elem.colIndex,
                    rowIndex: elem.rowIndex,
                }
                if (first.elem &&
                    first.elem == second.elem &&
                    second.elem == third.elem &&
                    third.elem == fourth.elem) {
                        this.isChange = true
                        const promise = new Promise((resolve, reject) => {
                            gridClearElements.push(first, second, third, fourth)
                            const animation = anime.timeline({
                                targets: [
                                    grid.children[first.rowIndex].children[first.colIndex].children[0],
                                    grid.children[second.rowIndex].children[second.colIndex].children[0],
                                    grid.children[third.rowIndex].children[third.colIndex].children[0],
                                    grid.children[fourth.rowIndex].children[fourth.colIndex].children[0],
                                ],
                                duration: state.cleanupAnimationDuration,
                                easing: 'linear'
                            }).add({
                                scale: 0,
                                opacity: 0,
                            })
                            animation.finished.then(() => {
                                gridClearElements.forEach(elem => {
                                    state.tetrisGrid[elem.rowIndex][elem.colIndex] = 0
                                })
                                // TODO добавить начисление очков
                                resolve()
                            })
                        })
                        iterable.push(promise)
                }
            })
        })
        await Promise.all(iterable);
    }

    async _checkRow(grid) {
        const iterable = []
        const gridClearElements = []
        state.tetrisGrid.forEach(async (row, rowIndex) => {
            let first = {elem: null, elemIndex: null}
            let second = {elem: null, elemIndex: null}
            let third = {elem: null, elemIndex: null}
            let fourth = {elem: null, elemIndex: null}
            row.forEach(async (elem, elemIndex) => {
                first = second
                second = third
                third = fourth
                fourth = {elem, elemIndex}
                if (first.elem &&
                    first.elem == second.elem &&
                    second.elem == third.elem &&
                    third.elem == fourth.elem) {
                        this.isChange = true
                        const promise = new Promise((resolve, reject) => {
                            gridClearElements.push(first.elemIndex, second.elemIndex, third.elemIndex, fourth.elemIndex)
                            const animation = anime.timeline({
                                targets: [
                                    grid.children[rowIndex].children[first.elemIndex].children[0],
                                    grid.children[rowIndex].children[second.elemIndex].children[0],
                                    grid.children[rowIndex].children[third.elemIndex].children[0],
                                    grid.children[rowIndex].children[fourth.elemIndex].children[0],
                                ],
                                duration: state.cleanupAnimationDuration,
                                easing: 'linear'
                            }).add({
                                scale: 0,
                                opacity: 0,
                            })
                            animation.finished.then(() => {
                                gridClearElements.forEach(elem => {
                                    row[elem] = 0
                                })
                                // TODO добавить начисление очков
                                resolve()
                            })
                        })
                        iterable.push(promise)
                }
            })
        });
        await Promise.all(iterable);
    }

    drop(grid) {
        const iterable = []
        for (let indexRow = 0; indexRow < state.tetrisGrid.length; indexRow++) {
            const row = grid.children[indexRow]
            for (let indexCol = 0; indexCol < state.tetrisGrid[indexRow].length; indexCol++) {
                const elem = grid.children[indexRow].children[indexCol]
                if (elem.children[0]) {
                    const isNextRow = grid.children[indexRow + 1]
                    if (isNextRow) {
                        const isNextElem = isNextRow.children[indexCol]
                        if (!isNextElem.children[0]) {
                            const target = {
                                elem: elem,
                                posRow: indexRow,
                                posCol: indexCol,
                            }
                            const promise = this._moveDown(target)
                            iterable.push(promise)
                        }
                    }
                }
            }
        }
        return Promise.all(iterable);
    }

    _moveDown(item) {
        const target = item.elem.children[0]
        const promise = new Promise((resolve, reject) => {
            target.style.setProperty('--speed', state.dropAnimationDuration + 'ms')
            target.classList.add('anim-down')
            target.addEventListener('animationend', () => {
                const figure = state.tetrisGrid[item.posRow][item.posCol]
                state.tetrisGrid[item.posRow][item.posCol] = 0
                state.tetrisGrid[item.posRow + 1][item.posCol] = figure
                resolve(true)
            })
        });
        return promise
    }
}
