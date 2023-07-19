import state from "../state"

export default class User {
    constructor() {
        this.key = 'game-snack'
    }

    check() {
        return localStorage.getItem(this.key)
    }

    changeName() {
        const user = JSON.parse(localStorage.getItem(this.key))
        state.userName = user.name
    }

    getUser() {
        const user = JSON.parse(localStorage.getItem(this.key))
        return user
    }

    addUser(name) {
        state.userName = name
        localStorage.setItem(this.key, JSON.stringify({
            name: name,
            points: 0,
            maxPoints: 0,
        }))
    }

    savePoints() {
        const user = JSON.parse(localStorage.getItem(this.key))
        state.maxPoints = user.maxPoints >= state.points ?
            user.maxPoints :
            state.points
        localStorage.setItem(this.key, JSON.stringify({
            name: state.userName,
            points: state.points,
            maxPoints: user.maxPoints >= state.points ?
                user.maxPoints :
                state.points
        }))
    }
}
