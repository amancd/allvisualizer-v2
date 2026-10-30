import type { PatternCategory } from '../types';

export const linkedList: PatternCategory = {
  name: 'Linked List Patterns',
  slug: 'linked-list',
  subPatterns: [
    {
      title: 'Linked List - In-place Reversal',
      slug: 'll-reversal',
      theory: [
        'Use three pointers: prev, curr, next. Redirect curr.next to prev each step.',
        'To reverse a sub-list: note the node before and after the sub-list, reverse the middle, reconnect.',
        'Dummy node simplifies edge cases where head changes.',
        'Time: O(n), Space: O(1).',
      ],
      template: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

def reverse_between(head, left, right):
    dummy = ListNode(0, head)
    prev = dummy
    for _ in range(left - 1):
        prev = prev.next
    curr = prev.next
    for _ in range(right - left):
        nxt = curr.next
        curr.next = nxt.next
        nxt.next = prev.next
        prev.next = nxt
    return dummy.next`,
      problems: [
        { name: 'Reverse Linked List', difficulty: 'Easy', lc: 206 },
        { name: 'Reverse Linked List II', difficulty: 'Medium', lc: 92 },
        { name: 'Palindrome Linked List', difficulty: 'Easy', lc: 234 },
        { name: 'Swap Nodes in Pairs', difficulty: 'Medium', lc: 24 },
        { name: 'Reverse Nodes in k-Group', difficulty: 'Hard', lc: 25 },
      ],
    },
    {
      title: 'Linked List - Merge / Sorted Operations',
      slug: 'll-merge',
      theory: [
        'Use a dummy node and a tail pointer. Compare heads of two lists, link the smaller one.',
        'For K sorted lists: use a min-heap of (value, list_index) to pick the next node.',
        'Merge sort on a linked list: find middle (fast/slow), split, recurse, merge.',
        'Time: O(n) for two lists, O(n log k) for k lists.',
      ],
      template: `def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    tail = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    tail.next = l1 or l2
    return dummy.next`,
      problems: [
        { name: 'Merge Two Sorted Lists', difficulty: 'Easy', lc: 21 },
        { name: 'Merge K Sorted Lists', difficulty: 'Hard', lc: 23 },
        { name: 'Sort List', difficulty: 'Medium', lc: 148 },
        { name: 'Insertion Sort List', difficulty: 'Medium', lc: 147 },
        { name: 'Add Two Numbers', difficulty: 'Medium', lc: 2 },
      ],
    },
  ],
};
