class MaxHeap {
    constructor() {
        this.arr = [null];
    }

    swap(a, b) {
        [this.arr[a], this.arr[b]] = [this.arr[b], this.arr[a]];
    }

    size() {
        return this.arr.length - 1;
    }

    empty() {
        return this.size() === 0;
    }

    push(value) {
        this.arr.push(value);
        let cur = this.arr.length - 1;
        let par = Math.floor(cur / 2);

        while (par > 0 && this.arr[par] < value) {
            this.swap(cur, par);
            cur = par;
            par = Math.floor(cur / 2);
        }
    }

    pop() {
        if (this.empty()) {
            return 0;
        }
        if (this.size() === 1) {
            return this.arr.pop();
        }
        let returnValue = this.arr[1];
        this.arr[1] = this.arr.pop();

        let cur = 1;
        let left = 2;
        let right = 3;

        while (this.arr[cur] < this.arr[left] || this.arr[cur] < this.arr[right]) {
            if (this.arr[left] < this.arr[right]) {
                this.swap(cur, right);
                cur = right;
            } else {
                this.swap(cur, left);
                cur = left;
            }
            left = cur * 2;
            right = cur * 2 + 1;
        }

        return returnValue;
    }
}