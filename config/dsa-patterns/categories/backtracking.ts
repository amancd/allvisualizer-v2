import type { PatternCategory } from '../types';

export const backtracking: PatternCategory = {
  name: 'Backtracking Patterns',
  slug: 'backtracking',
  subPatterns: [
    {
      title: 'Backtracking - Subsets / Combinations',
      slug: 'bt-subsets',
      theory: [
        'For each element, decide to include it or not — generates all subsets.',
        'For combinations of size k: only recurse until path has k elements.',
        'To avoid duplicates with duplicate input: sort first, skip equal adjacent element at same level.',
        'Time: O(2^n) for subsets, O(C(n,k)) for combinations.',
      ],
      template: `def subsets(nums):
    result = []
    def backtrack(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return result

def combine(n, k):
    result = []
    def backtrack(start, path):
        if len(path) == k:
            result.append(path[:])
            return
        for i in range(start, n + 1):
            path.append(i)
            backtrack(i + 1, path)
            path.pop()
    backtrack(1, [])
    return result`,
      problems: [
        { name: 'Subsets', difficulty: 'Medium', lc: 78 },
        { name: 'Subsets II', difficulty: 'Medium', lc: 90 },
        { name: 'Combinations', difficulty: 'Medium', lc: 77 },
        { name: 'Combination Sum', difficulty: 'Medium', lc: 39 },
        { name: 'Combination Sum II', difficulty: 'Medium', lc: 40 },
      ],
    },
    {
      title: 'Backtracking - Permutations',
      slug: 'bt-permutations',
      theory: [
        'Every element must appear exactly once. Use a visited set or swap-based approach.',
        'For duplicates: sort first, only pick an element if the previous duplicate was used in this path.',
        'Number of permutations: n! — grows fast, prune whenever possible.',
        'Swap-based: swap element into current position, recurse, swap back.',
      ],
      template: `def permutations(nums):
    result = []
    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            backtrack(path, used)
            path.pop()
            used[i] = False
    backtrack([], [False] * len(nums))
    return result`,
      problems: [
        { name: 'Permutations', difficulty: 'Medium', lc: 46 },
        { name: 'Permutations II', difficulty: 'Medium', lc: 47 },
        { name: 'Next Permutation', difficulty: 'Medium', lc: 31 },
        { name: 'Permutation Sequence', difficulty: 'Hard', lc: 60 },
        { name: 'Letter Combinations of a Phone Number', difficulty: 'Medium', lc: 17 },
      ],
    },
    {
      title: 'Backtracking - Grid / Board Search',
      slug: 'bt-grid',
      theory: [
        'DFS from each cell. Mark visited to avoid revisiting in the current path.',
        'Unmark (backtrack) when returning so other paths can use the cell.',
        'Prune by checking bounds, visited status, and character match before recursing.',
        'Time: O(m * n * 4^L) for word search of length L on an m × n board.',
      ],
      template: `def word_search(board, word):
    rows, cols = len(board), len(board[0])
    def dfs(r, c, idx):
        if idx == len(word):
            return True
        if (r < 0 or r >= rows or c < 0 or c >= cols
                or board[r][c] != word[idx]):
            return False
        temp = board[r][c]
        board[r][c] = '#'  # mark visited
        found = (dfs(r+1,c,idx+1) or dfs(r-1,c,idx+1)
                 or dfs(r,c+1,idx+1) or dfs(r,c-1,idx+1))
        board[r][c] = temp  # backtrack
        return found
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False`,
      problems: [
        { name: 'Word Search', difficulty: 'Medium', lc: 79 },
        { name: 'Word Search II', difficulty: 'Hard', lc: 212 },
        { name: 'N-Queens', difficulty: 'Hard', lc: 51 },
        { name: 'Sudoku Solver', difficulty: 'Hard', lc: 37 },
        { name: 'Palindrome Partitioning', difficulty: 'Medium', lc: 131 },
      ],
    },
  ],
};
