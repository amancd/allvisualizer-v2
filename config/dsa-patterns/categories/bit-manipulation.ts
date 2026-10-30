import type { PatternCategory } from '../types';

export const bitManipulation: PatternCategory = {
  name: 'Bit Manipulation Patterns',
  slug: 'bit-manipulation',
  subPatterns: [
    {
      title: 'Bit Manipulation - XOR Tricks',
      slug: 'bit-xor',
      theory: [
        'a ^ a = 0, a ^ 0 = a. XOR of all elements cancels pairs — the unpaired element remains.',
        'To find two unique numbers: XOR all, get a diff bit, partition into two groups by that bit.',
        'XOR is its own inverse: if c = a ^ b, then a = c ^ b.',
        'Useful for finding missing/duplicate numbers without extra space.',
      ],
      template: `def single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result

def missing_number(nums):
    n = len(nums)
    result = n
    for i in range(n):
        result ^= i ^ nums[i]
    return result`,
      problems: [
        { name: 'Single Number', difficulty: 'Easy', lc: 136 },
        { name: 'Single Number II', difficulty: 'Medium', lc: 137 },
        { name: 'Missing Number', difficulty: 'Easy', lc: 268 },
        { name: 'Complement of Base 10 Integer', difficulty: 'Easy', lc: 1009 },
        { name: 'Sum of Two Integers', difficulty: 'Medium', lc: 371 },
      ],
    },
  ],
};
