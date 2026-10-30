import type { PatternCategory } from '../types';

export const dynamicProgramming: PatternCategory = {
  name: 'Dynamic Programming Patterns',
  slug: 'dynamic-programming',
  subPatterns: [
    {
      title: 'DP - Fibonacci Pattern (Linear Recurrence)',
      slug: 'dp-fib',
      theory: [
        'dp[i] depends on dp[i-1] and dp[i-2] (or a small fixed window of previous states).',
        'Can often optimize space from O(n) to O(1) by tracking only the last 2-3 values.',
        'Climb stairs, house robber, min cost climbing stairs all follow this pattern.',
        'Always start by defining what dp[i] represents clearly.',
      ],
      template: `def climb_stairs(n):
    if n <= 2: return n
    prev2, prev1 = 1, 2
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    return prev1

def house_robber(nums):
    prev2, prev1 = 0, 0
    for num in nums:
        curr = max(prev1, prev2 + num)
        prev2 = prev1
        prev1 = curr
    return prev1`,
      problems: [
        { name: 'Climbing Stairs', difficulty: 'Easy', lc: 70 },
        { name: 'House Robber', difficulty: 'Medium', lc: 198 },
        { name: 'House Robber II', difficulty: 'Medium', lc: 213 },
        { name: 'Min Cost Climbing Stairs', difficulty: 'Easy', lc: 746 },
        { name: 'Decode Ways', difficulty: 'Medium', lc: 91 },
      ],
    },
    {
      title: 'DP - Knapsack / Subset Sum',
      slug: 'dp-knapsack',
      theory: [
        'Classic 0/1 knapsack: for each item, decide to include or exclude.',
        'dp[i][w] = max value using first i items with capacity w.',
        'Subset sum variant: dp[i] = True if sum i is achievable.',
        'Space optimization: iterate capacity in reverse for 1D DP.',
      ],
      template: `def can_partition(nums):
    total = sum(nums)
    if total % 2: return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    return dp[target]

def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
      problems: [
        { name: 'Partition Equal Subset Sum', difficulty: 'Medium', lc: 416 },
        { name: 'Coin Change', difficulty: 'Medium', lc: 322 },
        { name: 'Coin Change II', difficulty: 'Medium', lc: 518 },
        { name: 'Target Sum', difficulty: 'Medium', lc: 494 },
        { name: 'Last Stone Weight II', difficulty: 'Medium', lc: 1049 },
      ],
    },
    {
      title: 'DP - Longest Common Subsequence / String DP',
      slug: 'dp-lcs',
      theory: [
        'Compare two sequences with a 2D table. dp[i][j] = answer for s1[:i] and s2[:j].',
        'If characters match: dp[i][j] = dp[i-1][j-1] + 1.',
        'If not: dp[i][j] = max(dp[i-1][j], dp[i][j-1]) for LCS.',
        'Edit distance adds insert/delete/replace transitions.',
      ],
      template: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
      problems: [
        { name: 'Longest Common Subsequence', difficulty: 'Medium', lc: 1143 },
        { name: 'Edit Distance', difficulty: 'Medium', lc: 72 },
        { name: 'Distinct Subsequences', difficulty: 'Hard', lc: 115 },
        { name: 'Shortest Common Supersequence', difficulty: 'Hard', lc: 1092 },
        { name: 'Interleaving String', difficulty: 'Medium', lc: 97 },
      ],
    },
    {
      title: 'DP - Longest Increasing Subsequence (LIS)',
      slug: 'dp-lis',
      theory: [
        'dp[i] = length of LIS ending at index i. For each j < i, if nums[j] < nums[i]: dp[i] = max(dp[i], dp[j]+1).',
        'O(n²) basic DP. O(n log n) with patience sorting (maintain tails array + binary search).',
        'Variations: longest non-decreasing, longest chain, Russian doll envelopes.',
        'Can reconstruct the sequence by tracking parent pointers.',
      ],
      template: `import bisect

def length_of_lis(nums):
    tails = []
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    return len(tails)`,
      problems: [
        { name: 'Longest Increasing Subsequence', difficulty: 'Medium', lc: 300 },
        { name: 'Number of Longest Increasing Subsequence', difficulty: 'Medium', lc: 673 },
        { name: 'Russian Doll Envelopes', difficulty: 'Hard', lc: 354 },
        { name: 'Maximum Length of Pair Chain', difficulty: 'Medium', lc: 646 },
        { name: 'Longest String Chain', difficulty: 'Medium', lc: 1048 },
      ],
    },
    {
      title: 'DP - Grid Paths',
      slug: 'dp-grid',
      theory: [
        'dp[i][j] = ways/cost to reach cell (i,j). Transition from dp[i-1][j] and dp[i][j-1].',
        'Initialize first row and first column as base cases.',
        'For obstacles: set dp[i][j] = 0 if cell is blocked.',
        'Space optimization: use a single row and overwrite in place.',
      ],
      template: `def unique_paths(m, n):
    dp = [1] * n
    for i in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j - 1]
    return dp[-1]

def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    for i in range(m):
        for j in range(n):
            if i == 0 and j == 0: continue
            elif i == 0: grid[i][j] += grid[i][j-1]
            elif j == 0: grid[i][j] += grid[i-1][j]
            else: grid[i][j] += min(grid[i-1][j], grid[i][j-1])
    return grid[-1][-1]`,
      problems: [
        { name: 'Unique Paths', difficulty: 'Medium', lc: 62 },
        { name: 'Unique Paths II', difficulty: 'Medium', lc: 63 },
        { name: 'Minimum Path Sum', difficulty: 'Medium', lc: 64 },
        { name: 'Triangle', difficulty: 'Medium', lc: 120 },
        { name: 'Maximal Square', difficulty: 'Medium', lc: 221 },
      ],
    },
  ],
};
