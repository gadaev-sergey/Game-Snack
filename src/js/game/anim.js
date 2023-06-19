export function animLeft(elem) {
    if (elem.style.left) {
        const currentValue = elem.style.left.replace('px', '')
        const value = Number(currentValue) - elem.offsetWidth + 2
        elem.style.left = `${value}px`
    } else {
        elem.style.left = `-${elem.offsetWidth + 2}px`
    }
}

export function animRight(elem) {
    if (elem.style.left) {
        const currentValue = elem.style.left.replace('px', '')
        const value = Number(currentValue) + elem.offsetWidth + 2
        elem.style.left = `${value}px`
    } else {
        elem.style.left = `${elem.offsetWidth + 2}px`
    }
}
