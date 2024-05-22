class Stack {
    constructor() {
        this.arr = [] // 스택에 사용될 배열
    }

    // 배열에 원소 추가 함수
    push(item) {
        this.arr.push(item)
    }

    // 배열에서 원소를 꺼내는 함수
    pop() {
        return this.arr.pop()
    }
}

var stack = new Stack() // 스택 자료구조 선언
stack.push(1) // 스택에 1 추가
stack.push(2) // 스택에 2 추가
stack.push(3) // 스택에 3 추가
console.log(stack) // 스택 출력
console.log(stack.pop()) // 스택에서 데이터 하나 꺼내어 출력
console.log(stack) // 스택 출력