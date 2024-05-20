//Double Stack Queue
class Queue {
    constructor() {
        this.inputStack = []
        this.outputStack = []
    }
    enqueue(item) {
        this.inputStack.push(item)
    }
    transfer() {
        while (this.inputStack.length > 0) {
            this.outputStack.push(this.inputStack.pop())
        }
    }
    dequeue() {
        if (this.outputStack.length == 0) {
            this.transfer()
        }
        return this.outputStack.pop()
    }
}