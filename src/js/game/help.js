import state from "./state"

export function randomCol() {
    const max = state.tetrisGrid[0].length
    const randomColValue = Math.floor(Math.random() * max)
    if (state.tetrisGrid[0][randomColValue] == 0) {
        return randomColValue
    }
    return randomCol()
}

export function randomFigure(max = 2, min = 1) {
    const range = max - min
    return Math.round(Math.random() * range + min)
}
