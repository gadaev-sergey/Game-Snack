import state from "../state"

export default class Rules {
    constructor() {
        this.isChange = false
    }

    check() {
        this.isChange = false
        this._checkRow()
        this._checkCol()

        return this.isChange
    }

    _checkCol() {
        const countCol = []
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
                        // TODO create promise scale items
                        state.tetrisGrid[first.rowIndex][first.colIndex] = 0
                        state.tetrisGrid[second.rowIndex][second.colIndex] = 0
                        state.tetrisGrid[third.rowIndex][third.colIndex] = 0
                        state.tetrisGrid[fourth.rowIndex][fourth.colIndex] = 0
                }
            })
        })
    }

    _checkRow() {
        state.tetrisGrid.forEach((row, rowIndex) => {
            let first = {elem: null, elemIndex: null}
            let second = {elem: null, elemIndex: null}
            let third = {elem: null, elemIndex: null}
            let fourth = {elem: null, elemIndex: null}
            row.forEach((elem, elemIndex) => {
                first = second
                second = third
                third = fourth
                fourth = {elem, elemIndex}
                if (first.elem &&
                    first.elem == second.elem &&
                    second.elem == third.elem &&
                    third.elem == fourth.elem) {
                        this.isChange = true
                        // TODO create promise scale items
                        row[first.elemIndex] = 0
                        row[second.elemIndex] = 0
                        row[third.elemIndex] = 0
                        row[fourth.elemIndex] = 0
                }
            })
        });
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
                            console.log('Im found')
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
            target.style.setProperty('--speed', 0.1 + 's')
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
