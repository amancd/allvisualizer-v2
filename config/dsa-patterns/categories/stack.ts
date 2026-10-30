import type { PatternCategory } from '../types';

export const stack: PatternCategory = {
  name: 'Stack Patterns',
  slug: 'stack',
  subPatterns: [
    {
      title: 'Stack - Matching Brackets / Parentheses',
      slug: 'st-brackets',
      theory: [
        'Push opening brackets onto the stack. On closing bracket, pop and check if it matches.',
        'If the stack is empty when popping, or non-empty at the end — invalid.',
        'Extend to multi-character tokens (e.g., HTML tags) by storing full tokens on the stack.',
        'Time: O(n), Space: O(n) worst case.',
      ],
      template: `def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
        else:
            stack.append(ch)
    return len(stack) == 0`,
      problems: [
        { name: 'Valid Parentheses', difficulty: 'Easy', lc: 20 },
        { name: 'Generate Parentheses', difficulty: 'Medium', lc: 22 },
        { name: 'Minimum Remove to Make Valid Parentheses', difficulty: 'Medium', lc: 1249 },
        { name: 'Longest Valid Parentheses', difficulty: 'Hard', lc: 32 },
        { name: 'Remove Outermost Parentheses', difficulty: 'Easy', lc: 1021 },
      ],
    },
    {
      title: 'Stack - Monotonic Stack (Next Greater / Smaller)',
      slug: 'st-monotonic',
      theory: [
        'Maintain a stack in increasing (or decreasing) order.',
        'For "next greater element": pop elements smaller than current, they found their answer.',
        'For "next smaller element": pop elements greater than current.',
        'Time: O(n) — each element is pushed and popped at most once.',
      ],
      template: `def next_greater_element(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # stores indices
    for i in range(n):
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)
    return result`,
      problems: [
        { name: 'Daily Temperatures', difficulty: 'Medium', lc: 739 },
        { name: 'Next Greater Element I', difficulty: 'Easy', lc: 496 },
        { name: 'Largest Rectangle in Histogram', difficulty: 'Hard', lc: 84 },
        { name: 'Trapping Rain Water', difficulty: 'Hard', lc: 42 },
        { name: 'Online Stock Span', difficulty: 'Medium', lc: 901 },
      ],
    },
    {
      title: 'Stack - Expression Evaluation',
      slug: 'st-expression',
      theory: [
        'Use a stack of numbers. When you see an operator, pop operands, compute, push result.',
        'For infix: convert to postfix first, or handle precedence with two stacks.',
        'Reverse Polish Notation (postfix) is naturally stack-friendly.',
        'Handle unary minus and multi-digit numbers carefully during parsing.',
      ],
      template: `def eval_rpn(tokens):
    stack = []
    ops = {'+': lambda a, b: a + b,
           '-': lambda a, b: a - b,
           '*': lambda a, b: a * b,
           '/': lambda a, b: int(a / b)}
    for token in tokens:
        if token in ops:
            b, a = stack.pop(), stack.pop()
            stack.append(ops[token](a, b))
        else:
            stack.append(int(token))
    return stack[0]`,
      problems: [
        { name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', lc: 150 },
        { name: 'Basic Calculator', difficulty: 'Hard', lc: 224 },
        { name: 'Basic Calculator II', difficulty: 'Medium', lc: 227 },
        { name: 'Min Stack', difficulty: 'Medium', lc: 155 },
        { name: 'Decode String', difficulty: 'Medium', lc: 394 },
      ],
    },
  ],
};
