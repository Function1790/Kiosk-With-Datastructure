const input = document.getElementById('input')
const result = document.getElementById('result')

const MAX_SEARCH_LENGTH = 11;

class Trie {
  constructor() {
    this.root = {};
  }

  insert(word) {
    let current = this.root;
    for (let char of word) {
      if (!(char in current)) {
        current[char] = {};
      }
      current = current[char];
    }
    // '*'는 단어가 끝났다는 의미임
    current['*'] = 1;
  }

  search(word) {
    let current = this.root;
    for (let char of word) {
      if (!(char in current)) {
        return null; // 해당 단어가 존재하지 않음
      }
      current = current[char];
    }
    return current; // 뒤에 붙는 글자들 반환
  }

  autoComplete(prefix) { // prefix는 사용자가 입력한 단어
    const nextWords = this.search(prefix);
    if (nextWords === null) { // 뒤에오는 단어가 없다면
      return []; // 해당 단어로 시작하는 단어 없음
    }
    return this.joinNextWords(prefix, nextWords);
  }

  joinNextWords(prefix, nextWords) {
    const result = [];
    for (let i in nextWords) {
      if (this.count >= MAX_SEARCH_LENGTH) {
        break
      }
      if (i === '*') {
        result.push(prefix);
        continue;
      }
      for (let j of this.joinNextWords(prefix + i, nextWords[i])) {
        result.push(j);
      }
    }
    return result;
  }
}

// Trie 객체 생성
const trie = new Trie();

// 파일에서 단어를 읽어와서 Trie에 삽입
fetch('words.txt')
  .then(response => response.text())
  .then(data => {
    const words = data.split('\n').slice(0, 3000); // 최대 3000 단어 사용
    words.forEach(word => trie.insert(word.trim()));
  });

input.addEventListener('keyup', () => {
  if(!input.value){
    return
  }
  const words = trie.autoComplete(input.value)
  var HTML = ''
  for (var i in words) {
    HTML += `<div class="word">${words[i]}</div>`
  }
  result.innerHTML = HTML
})