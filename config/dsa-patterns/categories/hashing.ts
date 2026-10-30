import type { PatternCategory } from '../types';

export const hashing: PatternCategory = {
  name: 'Hashing Patterns',
  slug: 'hashing',
  subPatterns: [
    {
      title: 'Hashing - Frequency Count / Grouping',
      slug: 'hash-freq',
      theory: [
        'Count occurrences with a hash map (Counter in Python). O(1) lookup per element.',
        'Group elements by a computed key (e.g., sorted string for anagrams).',
        'Two Sum pattern: for each element, check if complement exists in the map.',
        'Prefix sum + hash map: count subarrays with a given sum in O(n).',
      ],
      template: `from collections import Counter, defaultdict

def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())

def subarray_sum(nums, k):
    prefix = {0: 1}
    total = count = 0
    for num in nums:
        total += num
        count += prefix.get(total - k, 0)
        prefix[total] = prefix.get(total, 0) + 1
    return count`,
      problems: [
        { name: 'Two Sum', difficulty: 'Easy', lc: 1 },
        { name: 'Group Anagrams', difficulty: 'Medium', lc: 49 },
        { name: 'Subarray Sum Equals K', difficulty: 'Medium', lc: 560 },
        { name: 'Top K Frequent Elements', difficulty: 'Medium', lc: 347 },
        { name: 'Longest Consecutive Sequence', difficulty: 'Medium', lc: 128 },
      ],
    },
  ],
};
