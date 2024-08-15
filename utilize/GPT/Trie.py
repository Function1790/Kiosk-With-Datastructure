class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True
    
    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
    
    def autocomplete(self, prefix):
        node = self.search(prefix)
        if not node:
            return []
        return self._find_words(node, prefix)
    
    def _find_words(self, node, prefix):
        words = []
        if node.is_end_of_word:
            words.append(prefix)
        for char, next_node in node.children.items():
            words.extend(self._find_words(next_node, prefix + char))
        return words

# Example Usage
trie = Trie()
words = ["hello", "hell", "heaven", "heavy"]
for word in words:
    trie.insert(word)

print(trie.autocomplete("he"))  # ['hello', 'hell', 'heaven', 'heavy']
print(trie.autocomplete("hea")) # ['heaven', 'heavy']