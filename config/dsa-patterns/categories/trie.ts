import type { PatternCategory } from '../types';

export const trie: PatternCategory = {
  name: 'Trie Patterns',
  slug: 'trie',
  subPatterns: [
    {
      title: 'Trie - Prefix Matching',
      slug: 'trie-prefix',
      theory: [
        'Each node has a dictionary of children and an is_end flag.',
        'Insert: walk the tree, create nodes as needed, mark end.',
        'Search: walk the tree, return is_end at the final node.',
        'Prefix search: like search but return True if final node exists (don\'t check is_end).',
      ],
      template: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self._find(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._find(prefix) is not None

    def _find(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node`,
      problems: [
        { name: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', lc: 208 },
        { name: 'Design Add and Search Words Data Structure', difficulty: 'Medium', lc: 211 },
        { name: 'Word Search II', difficulty: 'Hard', lc: 212 },
        { name: 'Replace Words', difficulty: 'Medium', lc: 648 },
        { name: 'Longest Word in Dictionary', difficulty: 'Medium', lc: 720 },
      ],
    },
  ],
};
