class Stack {
    constructor() {
        this.arr = []
    }
    push(item) {
        this.arr.push(item)
    }
    pop() {
        return this.arr.pop()
    }
}