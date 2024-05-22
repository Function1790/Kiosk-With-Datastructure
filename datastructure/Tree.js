//Base
class Tree {
    constructor(value = null, children = [null]) {
        this.value = value
        this.children = this.children
    }
}

//Binary Tree
function getIndexOfParent(currentIndex) {
    return Math.floor(currentIndex / 2)
}

class BinaryTree {
    constructor(arr = [null]) {
        this.arr = arr
    }
    getParent(currentIndex) {
        return this.arr[getIndexOfParent(currentIndex)]
    }
    push(item) {
        this.arr.push(item)
    }
    /** [left] dir=0  [right] dir=1*/
    getChild(currentIndex, dir = 0) {
        return this.arr[currentIndex * 2 + dir]
    }
}