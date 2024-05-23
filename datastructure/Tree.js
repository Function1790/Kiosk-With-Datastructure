//Base
class Tree {
    constructor(value = null, children = [null]) {
        this.value = value
        this.children = this.children
    }
}
const tree = new Tree(1, [2, new Tree(3, [4, 5])])
    // 구조 모양 
    //     1
    //   2   3
    //      4 5


//Binary Tree
function getIndexOfParent(currentIndex) {
    return Math.floor(currentIndex / 2)
}

class BinaryTree {
    constructor(arr = [null]) {
        this.arr = arr
    }
    getParent(currentIndex) {
            // 부모 노드의 인덱스 = 내림((자신의 인덱스)/2)
            // getIndexOfParent는 자신의 인덱스로 부터 부모의 인덱스를 불러오는 함수
            return this.arr[getIndexOfParent(currentIndex)] // 부모의 값 반환
        }
        // 이진트리에 값 추가하기
    push(item) {
            this.arr.push(item)
        }
        /** 왼쪽 노드: dir=0 | 오른쪽 노드: dir=1*/
    getChild(currentIndex, dir = 0) {
        // 자식노드의 인덱스 = 2i or 2i+1
        return this.arr[currentIndex * 2 + dir] // 자식노드의 값 반환
    }
}