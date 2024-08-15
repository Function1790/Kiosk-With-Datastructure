class Trie:
    root = {}

    def insert(self, word):
        current = self.root
        for char in word:
            if char not in current:
                current[char] = {}
            current = current[char]
        # '*'는 단어가 끝났다는 의미임
        current['*'] = 1
    
    def search(self, word):
        current = self.root
        for char in word:
            if char not in current:
                return None # 해당 단어가 존재하지 않음
            current = current[char]
        return current # 뒤에 붙는 글자들 반환
    
    def autoComplete(self, prefix): # prefix는 사용자가 입력한 단어
        nextWords = self.search(prefix)
        if nextWords==None: # 뒤에오는 단어가 없다면
            return [] # 해당 단어로 시작하는 단어 없음
        return self.joinNextWords(prefix, nextWords)
    
    def joinNextWords(self, prefix, nextWords):
        result = []
        for i in nextWords:
            if i == '*':
                result.append(prefix)
                continue
            for j in self.joinNextWords(i, nextWords[i]):
                result.append(prefix + j)
        return result
        
trie = Trie()

trie = Trie()
f = open('words.txt', 'r', encoding='UTF8')
words = f.readlines()
f.close()
#[trie.insert(i.replace("\n","")) for i in words]
trie.insert("hello")
trie.insert("helio")
print(trie.root)

#while True:
#    prefix = input("Input text >> ")
#    print(trie.autoComplete(prefix))