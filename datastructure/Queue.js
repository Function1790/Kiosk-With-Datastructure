class Queue {
    constructor() {
        this._arr = []
    }
    enqueue(item) {
        this._arr.push(item)
    }
    dequeue() {
        return this._arr.shift()
    }
}