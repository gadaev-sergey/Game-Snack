export default {
    isPlay: false,
    isControllerAllowed: true,
    fallingSpeed: 300,
    currentFallingSpeed: 300,
    cleanupAnimationDuration: 150,
    dropAnimationDuration: 100,
    addAnimationDuration: 300,
    userName: 'user',
    points: 0,
    lvl: 1,
    maxFigure: 3,
    tetrisGrid: [
        [0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0,],
        [x(), x(), x(), x(), x(), x(), x(),],
        [x(), x(), x(), x(), x(), x(), x(),],
        [x(), x(), x(), x(), x(), x(), x(),],
      ],
}

function x(max = 3, min = 1) {
    const range = max - min
    return Math.round(Math.random() * range + min)
}
