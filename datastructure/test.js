class Node {
  constructor(value, next) {
    this.value = value
    this.next = next
  }
}

var nodes = []
var array = []
var count = 10000000
for (var i = 0; i < count; i++) {
  nodes.push(new Node(count - i, i == 0 ? null : nodes[i - 1]))
  array.push(count - i)
}
console.time('lined');
for (var i = 0; i < count; i++) {
  if (nodes[i].value == 1) {
    break
  }
}
console.timeEnd('lined');

console.time('array');
for (var i = 0; i < count; i++) {
  if (array[i] == 1) {
    break
  }
}
console.timeEnd('array');