class Queue {
    constructor() {
        this.arr = [] // 큐에 사용될 변수 선언
    }

    //push 처럼 데이터를 넣는 함수
    enqueue(item) {
        this.arr.push(item) // 마지막 부분에 데이터 추가
    }

    // pop 처럼 데이터를 추출하는 함수
    dequeue() {
        return this.arr.shift() // 가장 앞에서 데이터 추출
    }
}

var queue = new Queue() // 큐 변수 선언
queue.enqueue(1) // 큐에 1 추가
queue.enqueue(2) // 큐에 2 추가
queue.enqueue(3) // 큐에 3 추가
console.log(queue) // 큐 출력
console.log(queue.dequeue()) // 큐에서 데이터 추출 및 출력
console.log(queue)