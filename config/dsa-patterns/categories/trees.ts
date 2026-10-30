import type { PatternCategory } from '../types';

export const trees: PatternCategory = {
  name: 'Tree Patterns',
  slug: 'trees',
  subPatterns: [
    {
      title: 'Tree - DFS (Pre/In/Post Order)',
      slug: 'tree-dfs',
      theory: [
        'Preorder: process node, then left, then right. Good for serialization.',
        'Inorder: left, node, right. Gives sorted order for BSTs.',
        'Postorder: left, right, node. Good for computing sizes / heights (bottom-up).',
        'Recursive implementation is simplest. Iterative uses an explicit stack.',
      ],
      template: `def dfs(node):
    if not node:
        return base_case
    left = dfs(node.left)
    right = dfs(node.right)
    # combine results (postorder logic)
    return combine(left, right, node.val)

# Iterative preorder
def preorder(root):
    if not root: return []
    stack, result = [root], []
    while stack:
        node = stack.pop()
        result.append(node.val)
        if node.right: stack.append(node.right)
        if node.left: stack.append(node.left)
    return result`,
      problems: [
        { name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', lc: 104 },
        { name: 'Invert Binary Tree', difficulty: 'Easy', lc: 226 },
        { name: 'Path Sum', difficulty: 'Easy', lc: 112 },
        { name: 'Diameter of Binary Tree', difficulty: 'Easy', lc: 543 },
        { name: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', lc: 124 },
      ],
    },
    {
      title: 'Tree - BFS (Level Order)',
      slug: 'tree-bfs',
      theory: [
        'Use a queue. Process all nodes at the current level before moving to the next.',
        'Track level size at the start of each iteration: level_size = len(queue).',
        'Useful for level order output, zigzag, right side view, minimum depth.',
        'Time: O(n), Space: O(w) where w is the max width of the tree.',
      ],
      template: `from collections import deque

def level_order(root):
    if not root: return []
    queue = deque([root])
    result = []
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result`,
      problems: [
        { name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', lc: 102 },
        { name: 'Binary Tree Zigzag Level Order Traversal', difficulty: 'Medium', lc: 103 },
        { name: 'Binary Tree Right Side View', difficulty: 'Medium', lc: 199 },
        { name: 'Minimum Depth of Binary Tree', difficulty: 'Easy', lc: 111 },
        { name: 'Average of Levels in Binary Tree', difficulty: 'Easy', lc: 637 },
      ],
    },
    {
      title: 'Tree - BST Properties',
      slug: 'tree-bst',
      theory: [
        'Left subtree values < node < right subtree values.',
        'Inorder traversal of a BST gives sorted order — use this to validate or find kth element.',
        'Search / insert / delete: O(h) where h = log n for balanced, n for skewed.',
        'Pass min/max bounds down during validation to check BST property.',
      ],
      template: `def is_valid_bst(node, lo=float('-inf'), hi=float('inf')):
    if not node:
        return True
    if node.val <= lo or node.val >= hi:
        return False
    return (is_valid_bst(node.left, lo, node.val) and
            is_valid_bst(node.right, node.val, hi))

def kth_smallest(root, k):
    stack = []
    curr = root
    while stack or curr:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        k -= 1
        if k == 0:
            return curr.val
        curr = curr.right`,
      problems: [
        { name: 'Validate Binary Search Tree', difficulty: 'Medium', lc: 98 },
        { name: 'Kth Smallest Element in a BST', difficulty: 'Medium', lc: 230 },
        { name: 'Lowest Common Ancestor of a BST', difficulty: 'Medium', lc: 235 },
        { name: 'Convert Sorted Array to BST', difficulty: 'Easy', lc: 108 },
        { name: 'Delete Node in a BST', difficulty: 'Medium', lc: 450 },
      ],
    },
  ],
};
