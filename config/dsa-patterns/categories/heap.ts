import type { PatternCategory } from '../types';

export const heap: PatternCategory = {
  name: 'Heap / Priority Queue Patterns',
  slug: 'heap',
  subPatterns: [
    {
      title: 'Heap - Top K Elements',
      slug: 'heap-topk',
      theory: [
        'To find the K largest: use a min-heap of size K. Push every element, pop when size > K.',
        'To find the K smallest: use a max-heap (negate values in Python) of size K.',
        'Alternative: quickselect for O(n) average but O(n²) worst case.',
        'Heap of size K: O(n log K) total, better than sorting O(n log n) when K << n.',
      ],
      template: `import heapq

def top_k_frequent(nums, k):
    freq = {}
    for n in nums:
        freq[n] = freq.get(n, 0) + 1
    # min-heap by frequency, pop smallest when size > k
    heap = []
    for num, count in freq.items():
        heapq.heappush(heap, (count, num))
        if len(heap) > k:
            heapq.heappop(heap)
    return [x[1] for x in heap]`,
      problems: [
        { name: 'Kth Largest Element in an Array', difficulty: 'Medium', lc: 215 },
        { name: 'Top K Frequent Elements', difficulty: 'Medium', lc: 347 },
        { name: 'K Closest Points to Origin', difficulty: 'Medium', lc: 973 },
        { name: 'Kth Largest Element in a Stream', difficulty: 'Easy', lc: 703 },
        { name: 'Sort Characters By Frequency', difficulty: 'Medium', lc: 451 },
      ],
    },
    {
      title: 'Heap - Two Heaps (Median Tracking)',
      slug: 'heap-two',
      theory: [
        'Maintain a max-heap for the lower half and a min-heap for the upper half.',
        'After each insertion, rebalance so sizes differ by at most 1.',
        'Median is the top of the larger heap (or average of both tops if equal size).',
        'Insert: O(log n). Get median: O(1).',
      ],
      template: `import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []  # max-heap (negate values)
        self.hi = []  # min-heap

    def addNum(self, num):
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2`,
      problems: [
        { name: 'Find Median from Data Stream', difficulty: 'Hard', lc: 295 },
        { name: 'Sliding Window Median', difficulty: 'Hard', lc: 480 },
        { name: 'IPO', difficulty: 'Hard', lc: 502 },
        { name: 'Merge K Sorted Lists', difficulty: 'Hard', lc: 23 },
        { name: 'Task Scheduler', difficulty: 'Medium', lc: 621 },
      ],
    },
  ],
};
