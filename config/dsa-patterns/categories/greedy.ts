import type { PatternCategory } from '../types';

export const greedy: PatternCategory = {
  name: 'Greedy Patterns',
  slug: 'greedy',
  subPatterns: [
    {
      title: 'Greedy - Interval Scheduling',
      slug: 'greedy-interval',
      theory: [
        'Sort intervals by end time. Greedily pick the earliest-finishing non-overlapping interval.',
        'For "minimum rooms / resources": sort by start, use a min-heap of end times.',
        'For "merge intervals": sort by start, extend or create new merged interval.',
        'Exchange argument proves greedy is optimal here.',
      ],
      template: `def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda x: x[1])
    count = 0
    end = float('-inf')
    for s, e in intervals:
        if s >= end:
            end = e
        else:
            count += 1  # remove this interval
    return count

def merge_intervals(intervals):
    intervals.sort()
    merged = [intervals[0]]
    for s, e in intervals[1:]:
        if s <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], e)
        else:
            merged.append([s, e])
    return merged`,
      problems: [
        { name: 'Merge Intervals', difficulty: 'Medium', lc: 56 },
        { name: 'Non-overlapping Intervals', difficulty: 'Medium', lc: 435 },
        { name: 'Insert Interval', difficulty: 'Medium', lc: 57 },
        { name: 'Meeting Rooms II', difficulty: 'Medium', lc: 253 },
        { name: 'Minimum Number of Arrows to Burst Balloons', difficulty: 'Medium', lc: 452 },
      ],
    },
    {
      title: 'Greedy - Kadane\'s / Jump Game',
      slug: 'greedy-kadane',
      theory: [
        'Kadane\'s algorithm: track a running sum. Reset to 0 (or current element) when it goes negative.',
        'Jump game: track the farthest reachable index. If current index > farthest — can\'t reach.',
        'Jump game II: BFS levels — track the farthest you can reach from the current "level" of jumps.',
        'These are greedy because the locally optimal choice (take the best option now) is globally optimal.',
      ],
      template: `def max_subarray(nums):
    max_sum = curr_sum = nums[0]
    for num in nums[1:]:
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    return max_sum

def can_jump(nums):
    farthest = 0
    for i in range(len(nums)):
        if i > farthest:
            return False
        farthest = max(farthest, i + nums[i])
    return True`,
      problems: [
        { name: 'Maximum Subarray', difficulty: 'Medium', lc: 53 },
        { name: 'Jump Game', difficulty: 'Medium', lc: 55 },
        { name: 'Jump Game II', difficulty: 'Medium', lc: 45 },
        { name: 'Gas Station', difficulty: 'Medium', lc: 134 },
        { name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', lc: 121 },
      ],
    },
  ],
};
