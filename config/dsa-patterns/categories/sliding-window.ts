import type { PatternCategory } from '../types';

export const slidingWindow: PatternCategory = {
  name: 'Sliding Window Patterns',
  slug: 'sliding-window',
  subPatterns: [
    {
      title: 'Sliding Window - Fixed Size (Subarray Calculation)',
      slug: 'sw-fixed-size',
      recall: 'If the problem gives you a fixed window size k and asks for max/min/average of a subarray — use a fixed sliding window. Slide both ends together, add the new element, remove the old one.',
      theory: [
        'The window size k is given. Initialize by computing the result for the first k elements.',
        'Slide one step at a time: add nums[i], remove nums[i - k]. Update the answer each step.',
        'Works for rolling sums, rolling averages, max sum of size-k subarray, and count-based checks.',
        'Time: O(n), Space: O(1) — each element is visited exactly once.',
      ],
      template: `def max_sum_subarray(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum`,
      problems: [
        {
          name: 'Maximum Average Subarray I', difficulty: 'Easy', lc: 643,
          code: `def findMaxAverage(nums, k):\n    window = sum(nums[:k])\n    best = window\n    for i in range(k, len(nums)):\n        window += nums[i] - nums[i - k]\n        best = max(best, window)\n    return best / k`,
          explanation: 'Compute the sum of the first k elements. Slide the window: add the new right element, subtract the element leaving on the left. Track the max sum and divide by k at the end for the average.',
        },
        {
          name: 'Grumpy Bookstore Owner', difficulty: 'Medium', lc: 1052,
          code: `def maxSatisfied(customers, grumpy, minutes):\n    base = sum(c for c, g in zip(customers, grumpy) if g == 0)\n    extra = sum(customers[i] for i in range(minutes) if grumpy[i])\n    best = extra\n    for i in range(minutes, len(customers)):\n        if grumpy[i]: extra += customers[i]\n        if grumpy[i - minutes]: extra -= customers[i - minutes]\n        best = max(best, extra)\n    return base + best`,
          explanation: 'Base satisfaction = sum when not grumpy. Then slide a window of size "minutes" to find the window that recovers the most grumpy-lost customers. Add the best extra to base.',
        },
        {
          name: 'Number of Sub-arrays of Size K and Average >= Threshold', difficulty: 'Medium', lc: 1343,
          code: `def numOfSubarrays(arr, k, threshold):\n    target = k * threshold\n    window = sum(arr[:k])\n    count = 1 if window >= target else 0\n    for i in range(k, len(arr)):\n        window += arr[i] - arr[i - k]\n        if window >= target:\n            count += 1\n    return count`,
          explanation: 'Instead of dividing by k every step, compare the window sum directly against k * threshold. Slide the fixed window and count how many positions meet the condition.',
        },
        {
          name: 'Contains Duplicate II', difficulty: 'Easy', lc: 219,
          code: `def containsNearbyDuplicate(nums, k):\n    window = set()\n    for i, n in enumerate(nums):\n        if n in window:\n            return True\n        window.add(n)\n        if len(window) > k:\n            window.remove(nums[i - k])\n    return False`,
          explanation: 'Maintain a set of at most k elements (the current window). If the new element is already in the set, we found a duplicate within distance k. Otherwise add it and evict the oldest if the set exceeds size k.',
        },
        {
          name: 'Maximum Number of Vowels in a Substring of Given Length', difficulty: 'Medium', lc: 1456,
          code: `def maxVowels(s, k):\n    vowels = set('aeiou')\n    count = sum(1 for c in s[:k] if c in vowels)\n    best = count\n    for i in range(k, len(s)):\n        count += (s[i] in vowels) - (s[i - k] in vowels)\n        best = max(best, count)\n    return best`,
          explanation: 'Count vowels in the first k characters. Slide the window: add 1 if the new char is a vowel, subtract 1 if the leaving char was a vowel. Track the max count.',
        },
      ],
    },
    {
      title: 'Sliding Window - Variable Size (Condition-Based)',
      slug: 'sw-variable-size',
      recall: 'If the problem says "longest/shortest subarray/substring satisfying some condition" — use a variable-size sliding window. Expand right to include, shrink left when the condition breaks.',
      theory: [
        'Expand the window by advancing the right pointer and updating window state.',
        'When the constraint is violated, shrink from the left until valid again.',
        'For "longest" problems: update the answer before or while the window is valid. For "shortest": update after shrinking to a valid state.',
        'Each element enters and leaves the window at most once — O(n) total even with the inner while loop.',
      ],
      template: `def longest_subarray(nums, k):
    left = 0
    total = 0
    result = 0
    for right in range(len(nums)):
        total += nums[right]
        while total > k:
            total -= nums[left]
            left += 1
        result = max(result, right - left + 1)
    return result`,
      problems: [
        {
          name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', lc: 3,
          code: `def lengthOfLongestSubstring(s):\n    seen = {}\n    left = 0\n    best = 0\n    for right, ch in enumerate(s):\n        if ch in seen and seen[ch] >= left:\n            left = seen[ch] + 1\n        seen[ch] = right\n        best = max(best, right - left + 1)\n    return best`,
          explanation: 'Use a dict to track the last index of each character. When a repeat is found within the current window, jump left past the previous occurrence. This keeps the window always free of duplicates.',
        },
        {
          name: 'Minimum Size Subarray Sum', difficulty: 'Medium', lc: 209,
          code: `def minSubArrayLen(target, nums):\n    left = 0\n    total = 0\n    best = float('inf')\n    for right in range(len(nums)):\n        total += nums[right]\n        while total >= target:\n            best = min(best, right - left + 1)\n            total -= nums[left]\n            left += 1\n    return best if best != float('inf') else 0`,
          explanation: 'Expand right to grow the sum. Once sum >= target, record the window length, then shrink left to find the shortest valid window. The while loop ensures we try all valid shrinks before expanding again.',
        },
        {
          name: 'Longest Repeating Character Replacement', difficulty: 'Medium', lc: 424,
          code: `def characterReplacement(s, k):\n    counts = {}\n    left = 0\n    max_freq = 0\n    best = 0\n    for right in range(len(s)):\n        counts[s[right]] = counts.get(s[right], 0) + 1\n        max_freq = max(max_freq, counts[s[right]])\n        while (right - left + 1) - max_freq > k:\n            counts[s[left]] -= 1\n            left += 1\n        best = max(best, right - left + 1)\n    return best`,
          explanation: 'The key insight: window_size - max_freq_in_window = number of characters to replace. If that exceeds k, shrink from left. max_freq never needs to decrease — we only care about finding a larger window.',
        },
        {
          name: 'Fruit Into Baskets', difficulty: 'Medium', lc: 904,
          code: `def totalFruit(fruits):\n    basket = {}\n    left = 0\n    best = 0\n    for right, f in enumerate(fruits):\n        basket[f] = basket.get(f, 0) + 1\n        while len(basket) > 2:\n            basket[fruits[left]] -= 1\n            if basket[fruits[left]] == 0:\n                del basket[fruits[left]]\n            left += 1\n        best = max(best, right - left + 1)\n    return best`,
          explanation: 'This is "longest subarray with at most 2 distinct elements." Use a frequency map as the basket. When more than 2 types exist, shrink from left, removing fruits from the map when their count hits 0.',
        },
        {
          name: 'Max Consecutive Ones III', difficulty: 'Medium', lc: 1004,
          code: `def longestOnes(nums, k):\n    left = 0\n    zeros = 0\n    best = 0\n    for right in range(len(nums)):\n        if nums[right] == 0:\n            zeros += 1\n        while zeros > k:\n            if nums[left] == 0:\n                zeros -= 1\n            left += 1\n        best = max(best, right - left + 1)\n    return best`,
          explanation: 'Count zeros in the window. When zeros exceed k (the number of flips allowed), shrink from the left. The answer is the longest window that contains at most k zeros.',
        },
      ],
    },
    {
      title: 'Sliding Window - Monotonic Queue for Max/Min',
      slug: 'sw-monotonic-queue',
      recall: 'If you need the max or min inside a sliding window efficiently — use a monotonic deque. The deque stores indices and maintains decreasing order (for max) or increasing order (for min).',
      theory: [
        'A monotonic deque keeps candidate indices in sorted order of their values, so the front is always the current max (or min).',
        'When adding a new element, pop from the back while the new element is >= (for max-deque) or <= (for min-deque) the back element.',
        'Before using the front, check if its index is still within the window — if not, pop it from the front.',
        'This gives O(1) amortized max/min queries per step, O(n) total time.',
      ],
      template: `from collections import deque

def sliding_window_max(nums, k):
    dq = deque()  # stores indices, decreasing order of values
    result = []
    for i in range(len(nums)):
        # remove indices outside the window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        # maintain decreasing order
        while dq and nums[dq[-1]] <= nums[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result`,
      problems: [
        {
          name: 'Sliding Window Maximum', difficulty: 'Hard', lc: 239,
          code: `from collections import deque\n\ndef maxSlidingWindow(nums, k):\n    dq = deque()  # indices in decreasing value order\n    result = []\n    for i, n in enumerate(nums):\n        while dq and dq[0] < i - k + 1:\n            dq.popleft()\n        while dq and nums[dq[-1]] <= n:\n            dq.pop()\n        dq.append(i)\n        if i >= k - 1:\n            result.append(nums[dq[0]])\n    return result`,
          explanation: 'Monotonic decreasing deque of indices. Before adding index i: (1) pop front if outside window, (2) pop from back while value <= nums[i]. The front always holds the index of the current window max.',
        },
        {
          name: 'Shortest Subarray with Sum at Least K', difficulty: 'Hard', lc: 862,
          code: `from collections import deque\n\ndef shortestSubarray(nums, k):\n    n = len(nums)\n    prefix = [0] * (n + 1)\n    for i in range(n):\n        prefix[i + 1] = prefix[i] + nums[i]\n    dq = deque()  # monotonic increasing on prefix values\n    best = float('inf')\n    for i in range(n + 1):\n        while dq and prefix[i] - prefix[dq[0]] >= k:\n            best = min(best, i - dq.popleft())\n        while dq and prefix[dq[-1]] >= prefix[i]:\n            dq.pop()\n        dq.append(i)\n    return best if best != float('inf') else -1`,
          explanation: 'Build prefix sums. Use a monotonic increasing deque on prefix values. For each i, pop from front while prefix[i] - prefix[front] >= k (valid subarray found, record length). Pop from back while prefix[back] >= prefix[i] (they can never be better starting points).',
        },
        {
          name: 'Jump Game VI', difficulty: 'Medium', lc: 1696,
          code: `from collections import deque\n\ndef maxResult(nums, k):\n    n = len(nums)\n    dp = [0] * n\n    dp[0] = nums[0]\n    dq = deque([0])  # max deque on dp values\n    for i in range(1, n):\n        while dq and dq[0] < i - k:\n            dq.popleft()\n        dp[i] = dp[dq[0]] + nums[i]\n        while dq and dp[dq[-1]] <= dp[i]:\n            dq.pop()\n        dq.append(i)\n    return dp[-1]`,
          explanation: 'DP where dp[i] = nums[i] + max(dp[i-k..i-1]). Use a monotonic decreasing deque to get the max of the last k dp values in O(1). Pop front if out of range, use front as the max, then maintain deque order when inserting.',
        },
        {
          name: 'Longest Continuous Subarray With Absolute Diff <= Limit', difficulty: 'Medium', lc: 1438,
          code: `from collections import deque\n\ndef longestSubarray(nums, limit):\n    max_dq = deque()  # decreasing\n    min_dq = deque()  # increasing\n    left = 0\n    best = 0\n    for right, n in enumerate(nums):\n        while max_dq and nums[max_dq[-1]] <= n:\n            max_dq.pop()\n        while min_dq and nums[min_dq[-1]] >= n:\n            min_dq.pop()\n        max_dq.append(right)\n        min_dq.append(right)\n        while nums[max_dq[0]] - nums[min_dq[0]] > limit:\n            left += 1\n            if max_dq[0] < left: max_dq.popleft()\n            if min_dq[0] < left: min_dq.popleft()\n        best = max(best, right - left + 1)\n    return best`,
          explanation: 'Two deques: one for max (decreasing), one for min (increasing). If max - min > limit, shrink from left and pop deque fronts that fell out of window. The answer is the longest window where the difference stays within limit.',
        },
      ],
    },
    {
      title: 'Sliding Window - Character Frequency Matching',
      slug: 'sw-char-freq',
      recall: 'If the problem involves anagrams, permutations in a string, or matching character frequencies between a window and a target — use a frequency-counting sliding window with a "matched" counter.',
      theory: [
        'Build a frequency map of the target/pattern. Maintain a frequency map of the current window.',
        'Use a "matched" or "formed" counter: increment when a character reaches its required count, decrement when it drops below.',
        'When matched == required, the window contains a valid match. Record it and try shrinking.',
        'For fixed-length pattern matching (anagrams), the window size equals the pattern length. For minimum window substring, the window is variable.',
      ],
      template: `from collections import Counter

def find_anagrams(s, p):
    need = Counter(p)
    window = {}
    required = len(need)
    matched = 0
    result = []
    for i in range(len(s)):
        ch = s[i]
        window[ch] = window.get(ch, 0) + 1
        if ch in need and window[ch] == need[ch]:
            matched += 1
        # remove left element when window exceeds pattern length
        if i >= len(p):
            left_ch = s[i - len(p)]
            if left_ch in need and window[left_ch] == need[left_ch]:
                matched -= 1
            window[left_ch] -= 1
        if matched == required:
            result.append(i - len(p) + 1)
    return result`,
      problems: [
        {
          name: 'Find All Anagrams in a String', difficulty: 'Medium', lc: 438,
          code: `from collections import Counter\n\ndef findAnagrams(s, p):\n    if len(p) > len(s): return []\n    need = Counter(p)\n    window = Counter(s[:len(p)])\n    result = []\n    if window == need: result.append(0)\n    for i in range(len(p), len(s)):\n        window[s[i]] += 1\n        left = s[i - len(p)]\n        window[left] -= 1\n        if window[left] == 0: del window[left]\n        if window == need: result.append(i - len(p) + 1)\n    return result`,
          explanation: 'Initialize a Counter for both the pattern and the first window. Slide one character at a time: add the new right char, remove the leftmost char. When the two Counters are equal, record the start index. Comparing Counters is O(26) for lowercase letters.',
        },
        {
          name: 'Permutation in String', difficulty: 'Medium', lc: 567,
          code: `from collections import Counter\n\ndef checkInclusion(s1, s2):\n    n1, n2 = len(s1), len(s2)\n    if n1 > n2: return False\n    need = Counter(s1)\n    window = Counter(s2[:n1])\n    if window == need: return True\n    for i in range(n1, n2):\n        window[s2[i]] += 1\n        left = s2[i - n1]\n        window[left] -= 1\n        if window[left] == 0: del window[left]\n        if window == need: return True\n    return False`,
          explanation: 'Same approach as Find All Anagrams but return True as soon as a single match is found. Fixed window of size len(s1) slides across s2 comparing frequency counts.',
        },
        {
          name: 'Minimum Window Substring', difficulty: 'Hard', lc: 76,
          code: `from collections import Counter\n\ndef minWindow(s, t):\n    need = Counter(t)\n    window = {}\n    required = len(need)\n    formed = 0\n    left = 0\n    best = (float('inf'), 0, 0)\n    for right in range(len(s)):\n        ch = s[right]\n        window[ch] = window.get(ch, 0) + 1\n        if ch in need and window[ch] == need[ch]:\n            formed += 1\n        while formed == required:\n            if right - left + 1 < best[0]:\n                best = (right - left + 1, left, right)\n            window[s[left]] -= 1\n            if s[left] in need and window[s[left]] < need[s[left]]:\n                formed -= 1\n            left += 1\n    return '' if best[0] == float('inf') else s[best[1]:best[2]+1]`,
          explanation: 'Variable window with frequency matching. Expand right, incrementing "formed" when a char reaches its needed count. When formed == required, try shrinking from left to minimize. Record the shortest valid window.',
        },
        {
          name: 'Longest Substring with At Most K Distinct Characters', difficulty: 'Medium', lc: 340,
          code: `def lengthOfLongestSubstringKDistinct(s, k):\n    freq = {}\n    left = 0\n    best = 0\n    for right, ch in enumerate(s):\n        freq[ch] = freq.get(ch, 0) + 1\n        while len(freq) > k:\n            freq[s[left]] -= 1\n            if freq[s[left]] == 0:\n                del freq[s[left]]\n            left += 1\n        best = max(best, right - left + 1)\n    return best`,
          explanation: 'Maintain a frequency map of window characters. When distinct count exceeds k, shrink from left, deleting entries that reach 0. The longest valid window is the answer.',
        },
        {
          name: 'Subarrays with K Different Integers', difficulty: 'Hard', lc: 992,
          code: `def subarraysWithKDistinct(nums, k):\n    def atMost(k):\n        freq = {}\n        left = 0\n        count = 0\n        for right, n in enumerate(nums):\n            freq[n] = freq.get(n, 0) + 1\n            while len(freq) > k:\n                freq[nums[left]] -= 1\n                if freq[nums[left]] == 0:\n                    del freq[nums[left]]\n                left += 1\n            count += right - left + 1\n        return count\n    return atMost(k) - atMost(k - 1)`,
          explanation: 'Exactly k distinct = atMost(k) - atMost(k-1). The atMost helper counts subarrays with at most k distinct using a variable sliding window. For each right, the number of valid subarrays ending there is (right - left + 1).',
        },
      ],
    },
  ],
};
