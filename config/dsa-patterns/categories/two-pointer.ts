import type { PatternCategory } from '../types';

export const twoPointer: PatternCategory = {
  name: 'Two Pointer Patterns',
  slug: 'two-pointer',
  subPatterns: [
    {
      title: 'Two Pointers - Converging (Sorted Array Target Sum)',
      slug: 'tp-converging',
      recall: 'If the input is sorted and you need a pair/sum — think left+right pointers converging inward. Move the smaller side up or the larger side down.',
      theory: [
        'Place one pointer at the start and one at the end of a sorted array.',
        'If the sum is too small, move the left pointer right. If too large, move the right pointer left.',
        'Works because sorting gives a monotonic relationship between pointer movement and sum.',
        'Time: O(n), Space: O(1). Requires sorted input or sort first in O(n log n).',
      ],
      template: `def two_sum_sorted(nums, target):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        curr = nums[left] + nums[right]\n        if curr == target:\n            return [left, right]\n        elif curr < target:\n            left += 1\n        else:\n            right -= 1\n    return [-1, -1]`,
      problems: [
        {
          name: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', lc: 167,
          code: `def twoSum(numbers, target):\n    l, r = 0, len(numbers) - 1\n    while l < r:\n        s = numbers[l] + numbers[r]\n        if s == target:\n            return [l + 1, r + 1]\n        elif s < target:\n            l += 1\n        else:\n            r -= 1`,
          explanation: 'Array is sorted. Start pointers at both ends. If sum < target, move left pointer right to increase sum. If sum > target, move right pointer left to decrease it. Return 1-indexed positions.',
        },
        {
          name: '3Sum', difficulty: 'Medium', lc: 15,
          code: `def threeSum(nums):\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i-1]:\n            continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l+1]: l += 1\n                while l < r and nums[r] == nums[r-1]: r -= 1\n                l += 1; r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    return res`,
          explanation: 'Sort the array. Fix one number, then use converging two pointers on the rest to find pairs that sum to negative of the fixed number. Skip duplicates at every level to avoid duplicate triplets.',
        },
        {
          name: '3Sum Closest', difficulty: 'Medium', lc: 16,
          code: `def threeSumClosest(nums, target):\n    nums.sort()\n    closest = float('inf')\n    for i in range(len(nums) - 2):\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if abs(s - target) < abs(closest - target):\n                closest = s\n            if s < target: l += 1\n            elif s > target: r -= 1\n            else: return s\n    return closest`,
          explanation: 'Same two-pointer approach as 3Sum but instead of looking for exactly 0 we track whichever sum is closest to target. If we hit target exactly, return immediately.',
        },
        {
          name: '4Sum', difficulty: 'Medium', lc: 18,
          code: `def fourSum(nums, target):\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 3):\n        if i > 0 and nums[i] == nums[i-1]: continue\n        for j in range(i+1, len(nums) - 2):\n            if j > i+1 and nums[j] == nums[j-1]: continue\n            l, r = j + 1, len(nums) - 1\n            while l < r:\n                s = nums[i]+nums[j]+nums[l]+nums[r]\n                if s == target:\n                    res.append([nums[i],nums[j],nums[l],nums[r]])\n                    while l<r and nums[l]==nums[l+1]: l+=1\n                    while l<r and nums[r]==nums[r-1]: r-=1\n                    l+=1; r-=1\n                elif s < target: l+=1\n                else: r-=1\n    return res`,
          explanation: 'Extend 3Sum by adding one more outer loop. Fix two numbers with nested loops, then converge two pointers for the remaining pair. Skip duplicates at each level.',
        },
        {
          name: 'Two Sum IV - Input is a BST', difficulty: 'Easy', lc: 653,
          code: `def findTarget(root, k):\n    seen = set()\n    stack = [root]\n    while stack:\n        node = stack.pop()\n        if not node: continue\n        if k - node.val in seen:\n            return True\n        seen.add(node.val)\n        stack.append(node.left)\n        stack.append(node.right)\n    return False`,
          explanation: 'Traverse the BST (DFS or BFS). For each node, check if complement (k - node.val) exists in a set. If yes, found the pair. Otherwise add current value to set and continue.',
        },
      ],
    },
    {
      title: 'Two Pointers - Fast & Slow (Cycle Detection)',
      slug: 'tp-fast-slow',
      recall: 'Linked list + "cycle" or "middle" → use slow (1 step) and fast (2 steps). They meet inside a cycle. Reset one to head and walk both at 1 step to find the cycle start.',
      theory: [
        'Use two pointers moving at different speeds (slow = 1 step, fast = 2 steps).',
        'If there is a cycle, they will eventually meet inside the cycle.',
        'To find the cycle start: reset one pointer to head, then both move 1 step until they meet.',
        'Also used to find the middle of a linked list (when fast reaches the end, slow is at the middle).',
      ],
      template: `def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False\n\ndef find_cycle_start(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            slow = head\n            while slow != fast:\n                slow = slow.next\n                fast = fast.next\n            return slow\n    return None`,
      problems: [
        {
          name: 'Linked List Cycle', difficulty: 'Easy', lc: 141,
          code: `def hasCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False`,
          explanation: 'Slow moves 1 step, fast moves 2 steps. If there is a cycle, fast will eventually lap slow and they will meet. If fast reaches null, no cycle exists.',
        },
        {
          name: 'Linked List Cycle II', difficulty: 'Medium', lc: 142,
          code: `def detectCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            slow = head\n            while slow != fast:\n                slow = slow.next\n                fast = fast.next\n            return slow\n    return None`,
          explanation: 'First detect cycle with fast/slow. Once they meet, reset slow to head. Now move both 1 step at a time — they meet at the cycle entry. This works because the distance from head to cycle start equals the distance from meeting point to cycle start.',
        },
        {
          name: 'Happy Number', difficulty: 'Easy', lc: 202,
          code: `def isHappy(n):\n    def next_num(x):\n        total = 0\n        while x:\n            x, d = divmod(x, 10)\n            total += d * d\n        return total\n    slow = n\n    fast = next_num(n)\n    while fast != 1 and slow != fast:\n        slow = next_num(slow)\n        fast = next_num(next_num(fast))\n    return fast == 1`,
          explanation: 'Treat the sequence of digit-square sums as a linked list. Use Floyd\'s cycle detection. If fast reaches 1 it is happy. If slow meets fast before that, there is a cycle and it is not happy.',
        },
        {
          name: 'Middle of the Linked List', difficulty: 'Easy', lc: 876,
          code: `def middleNode(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow`,
          explanation: 'Fast moves 2x the speed of slow. When fast reaches the end, slow is exactly at the middle. For even-length lists, this returns the second middle node.',
        },
      ],
    },
    {
      title: 'Two Pointers - Fixed Separation (Nth Node from End)',
      slug: 'tp-fixed-separation',
      recall: '"Nth from the end" → advance one pointer N steps ahead first, then walk both together. When the leader hits null, the follower is at the target.',
      theory: [
        'Advance the first pointer by N steps, then move both pointers together.',
        'When the first pointer hits the end, the second pointer is N nodes from the end.',
        'Use a dummy node before head to handle edge cases (e.g., removing the head node).',
        'Time: O(n) single pass, Space: O(1).',
      ],
      template: `def remove_nth_from_end(head, n):\n    dummy = ListNode(0, head)\n    first = second = dummy\n    for _ in range(n + 1):\n        first = first.next\n    while first:\n        first = first.next\n        second = second.next\n    second.next = second.next.next\n    return dummy.next`,
      problems: [
        {
          name: 'Remove Nth Node From End of List', difficulty: 'Medium', lc: 19,
          code: `def removeNthFromEnd(head, n):\n    dummy = ListNode(0, head)\n    first = second = dummy\n    for _ in range(n + 1):\n        first = first.next\n    while first:\n        first = first.next\n        second = second.next\n    second.next = second.next.next\n    return dummy.next`,
          explanation: 'Use a dummy node. Advance first pointer n+1 steps. Then move both until first is null. Now second.next is the node to remove. Skip it by relinking.',
        },
        {
          name: 'Rotate List', difficulty: 'Medium', lc: 61,
          code: `def rotateRight(head, k):\n    if not head or not head.next: return head\n    length = 1\n    tail = head\n    while tail.next:\n        tail = tail.next\n        length += 1\n    k %= length\n    if k == 0: return head\n    tail.next = head  # make circular\n    curr = head\n    for _ in range(length - k - 1):\n        curr = curr.next\n    new_head = curr.next\n    curr.next = None\n    return new_head`,
          explanation: 'Find the length and make the list circular. The new head is at position (length - k). Walk to the node before the new head, break the circle there.',
        },
        {
          name: 'Reorder List', difficulty: 'Medium', lc: 143,
          code: `def reorderList(head):\n    # Find middle\n    slow = fast = head\n    while fast.next and fast.next.next:\n        slow = slow.next\n        fast = fast.next.next\n    # Reverse second half\n    prev, curr = None, slow.next\n    slow.next = None\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    # Merge two halves\n    first, second = head, prev\n    while second:\n        tmp1, tmp2 = first.next, second.next\n        first.next = second\n        second.next = tmp1\n        first, second = tmp1, tmp2`,
          explanation: 'Three steps: (1) find the middle with slow/fast, (2) reverse the second half, (3) interleave the two halves by alternating links.',
        },
      ],
    },
    {
      title: 'Two Pointers - In-place Array Modification',
      slug: 'tp-inplace',
      recall: '"Remove/modify in-place with O(1) space" → use a slow (write) pointer and a fast (read) pointer. Fast scans everything; slow only advances when we keep an element.',
      theory: [
        'Use a slow pointer (write position) and a fast pointer (read position).',
        'Fast pointer scans every element; slow pointer only advances when we keep an element.',
        'Overwrites in-place without extra space. Common for removing duplicates or specific values.',
        'Time: O(n), Space: O(1). Order of remaining elements is preserved.',
      ],
      template: `def remove_duplicates(nums):\n    if not nums: return 0\n    slow = 0\n    for fast in range(1, len(nums)):\n        if nums[fast] != nums[slow]:\n            slow += 1\n            nums[slow] = nums[fast]\n    return slow + 1`,
      problems: [
        {
          name: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', lc: 26,
          code: `def removeDuplicates(nums):\n    if not nums: return 0\n    slow = 0\n    for fast in range(1, len(nums)):\n        if nums[fast] != nums[slow]:\n            slow += 1\n            nums[slow] = nums[fast]\n    return slow + 1`,
          explanation: 'slow marks the last unique position. fast scans the array. When fast finds a new value, increment slow and copy it there. Array is sorted so duplicates are adjacent.',
        },
        {
          name: 'Remove Element', difficulty: 'Easy', lc: 27,
          code: `def removeElement(nums, val):\n    slow = 0\n    for fast in range(len(nums)):\n        if nums[fast] != val:\n            nums[slow] = nums[fast]\n            slow += 1\n    return slow`,
          explanation: 'slow is the write pointer. fast reads every element. If fast finds a non-val element, write it at slow and advance slow. Final slow value is the new length.',
        },
        {
          name: 'Move Zeroes', difficulty: 'Easy', lc: 283,
          code: `def moveZeroes(nums):\n    slow = 0\n    for fast in range(len(nums)):\n        if nums[fast] != 0:\n            nums[slow], nums[fast] = nums[fast], nums[slow]\n            slow += 1`,
          explanation: 'Same as remove element but swap instead of overwrite. slow tracks the position for the next non-zero. Swap fast\'s non-zero with slow\'s zero, advance slow.',
        },
        {
          name: 'Remove Duplicates from Sorted Array II', difficulty: 'Medium', lc: 80,
          code: `def removeDuplicates(nums):\n    slow = 0\n    for fast in range(len(nums)):\n        if slow < 2 or nums[fast] != nums[slow - 2]:\n            nums[slow] = nums[fast]\n            slow += 1\n    return slow`,
          explanation: 'Allow at most 2 of each value. Write at slow only if slow < 2 (first two elements always valid) or the current value differs from nums[slow-2]. This generalizes to allow K duplicates.',
        },
        {
          name: 'Sort Colors', difficulty: 'Medium', lc: 75,
          code: `def sortColors(nums):\n    lo, mid, hi = 0, 0, len(nums) - 1\n    while mid <= hi:\n        if nums[mid] == 0:\n            nums[lo], nums[mid] = nums[mid], nums[lo]\n            lo += 1; mid += 1\n        elif nums[mid] == 1:\n            mid += 1\n        else:\n            nums[mid], nums[hi] = nums[hi], nums[mid]\n            hi -= 1`,
          explanation: 'Dutch National Flag algorithm. Three pointers: lo (boundary for 0s), mid (scanner), hi (boundary for 2s). Swap 0s to the front and 2s to the back. mid only advances when it sees 0 or 1.',
        },
      ],
    },
    {
      title: 'Two Pointers - String Comparison with Backspaces',
      slug: 'tp-backspace',
      recall: '"Compare strings with backspaces (#) without building them" → process from the end, count backspaces, skip characters accordingly, then compare.',
      theory: [
        'Process strings from the end. When you hit a "#", count backspaces and skip characters.',
        'Compare characters only when both pointers are on non-skipped characters.',
        'Simulating from the end avoids building the final string, giving O(1) space.',
        'Time: O(n + m), Space: O(1).',
      ],
      template: `def backspace_compare(s, t):\n    i, j = len(s) - 1, len(t) - 1\n    skip_s = skip_t = 0\n    while i >= 0 or j >= 0:\n        while i >= 0:\n            if s[i] == '#': skip_s += 1; i -= 1\n            elif skip_s > 0: skip_s -= 1; i -= 1\n            else: break\n        while j >= 0:\n            if t[j] == '#': skip_t += 1; j -= 1\n            elif skip_t > 0: skip_t -= 1; j -= 1\n            else: break\n        if i >= 0 and j >= 0 and s[i] != t[j]: return False\n        if (i >= 0) != (j >= 0): return False\n        i -= 1; j -= 1\n    return True`,
      problems: [
        {
          name: 'Backspace String Compare', difficulty: 'Easy', lc: 844,
          code: `def backspaceCompare(s, t):\n    def process(string):\n        i = len(string) - 1\n        skip = 0\n        while i >= 0:\n            if string[i] == '#': skip += 1; i -= 1\n            elif skip > 0: skip -= 1; i -= 1\n            else: yield string[i]; i -= 1\n    return list(process(s)) == list(process(t))`,
          explanation: 'Use a generator that walks the string from the end. On "#" increment skip counter. On a normal char with skip > 0, skip it. Otherwise yield it. Compare the two generated sequences.',
        },
        {
          name: 'Remove All Adjacent Duplicates In String', difficulty: 'Easy', lc: 1047,
          code: `def removeDuplicates(s):\n    stack = []\n    for ch in s:\n        if stack and stack[-1] == ch:\n            stack.pop()\n        else:\n            stack.append(ch)\n    return ''.join(stack)`,
          explanation: 'Use a stack as the result. Push each character. If the top of the stack equals the current character, pop instead — this removes the adjacent pair. Final stack is the answer.',
        },
      ],
    },
    {
      title: 'Two Pointers - Expanding From Center (Palindromes)',
      slug: 'tp-expand-center',
      recall: '"Find palindromic substrings" → for every index, expand outward with two pointers (left--, right++) while characters match. Check both odd-length (center = i) and even-length (center = i, i+1).',
      theory: [
        'For each index (and each pair of adjacent indices), expand outward while characters match.',
        'Handles both odd-length and even-length palindromes.',
        'Track the longest palindrome found so far by comparing lengths.',
        'Time: O(n²) worst case, Space: O(1). Can be improved to O(n) with Manacher\'s algorithm.',
      ],
      template: `def longest_palindrome(s):\n    res = ""\n    for i in range(len(s)):\n        # Odd length\n        l, r = i, i\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            if r - l + 1 > len(res): res = s[l:r+1]\n            l -= 1; r += 1\n        # Even length\n        l, r = i, i + 1\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            if r - l + 1 > len(res): res = s[l:r+1]\n            l -= 1; r += 1\n    return res`,
      problems: [
        {
          name: 'Longest Palindromic Substring', difficulty: 'Medium', lc: 5,
          code: `def longestPalindrome(s):\n    res = ""\n    for i in range(len(s)):\n        for l, r in [(i, i), (i, i+1)]:\n            while l >= 0 and r < len(s) and s[l] == s[r]:\n                if r - l + 1 > len(res):\n                    res = s[l:r+1]\n                l -= 1; r += 1\n    return res`,
          explanation: 'For each index, try expanding two palindromes: one centered at i (odd length) and one centered between i and i+1 (even length). Expand while characters match and track the longest found.',
        },
        {
          name: 'Palindromic Substrings', difficulty: 'Medium', lc: 647,
          code: `def countSubstrings(s):\n    count = 0\n    for i in range(len(s)):\n        for l, r in [(i, i), (i, i+1)]:\n            while l >= 0 and r < len(s) and s[l] == s[r]:\n                count += 1\n                l -= 1; r += 1\n    return count`,
          explanation: 'Same expand-from-center approach, but instead of tracking the longest, increment a counter for every valid palindrome you encounter during expansion.',
        },
      ],
    },
    {
      title: 'Two Pointers - String Reversal',
      slug: 'tp-string-reversal',
      recall: '"Reverse something in-place" → left pointer at start, right pointer at end, swap and move inward until they meet.',
      theory: [
        'Place pointers at start and end of the string (or segment). Swap and move inward.',
        'For reversing words: reverse the whole string, then reverse each word individually.',
        'Works in-place with O(1) extra space on mutable arrays.',
        'Time: O(n), Space: O(1) if array is mutable.',
      ],
      template: `def reverse_string(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1`,
      problems: [
        {
          name: 'Reverse String', difficulty: 'Easy', lc: 344,
          code: `def reverseString(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1`,
          explanation: 'Classic swap from both ends. left and right converge toward the middle, swapping characters at each step. Mutates the list in-place.',
        },
        {
          name: 'Reverse Vowels of a String', difficulty: 'Easy', lc: 345,
          code: `def reverseVowels(s):\n    s = list(s)\n    vowels = set('aeiouAEIOU')\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and s[l] not in vowels: l += 1\n        while l < r and s[r] not in vowels: r -= 1\n        s[l], s[r] = s[r], s[l]\n        l += 1; r -= 1\n    return ''.join(s)`,
          explanation: 'Two pointers from both ends. Skip non-vowels. When both land on vowels, swap them and move inward. Only vowels get reversed; all other characters stay in place.',
        },
        {
          name: 'Reverse Words in a String', difficulty: 'Medium', lc: 151,
          code: `def reverseWords(s):\n    return ' '.join(s.split()[::-1])`,
          explanation: 'split() handles multiple spaces and leading/trailing spaces by default. Reverse the resulting list of words and join with a single space.',
        },
        {
          name: 'Reverse String II', difficulty: 'Easy', lc: 541,
          code: `def reverseStr(s, k):\n    s = list(s)\n    for i in range(0, len(s), 2 * k):\n        s[i:i+k] = s[i:i+k][::-1]\n    return ''.join(s)`,
          explanation: 'Every 2k characters, reverse the first k. Python slice assignment makes this concise. Step through the string in chunks of 2k.',
        },
        {
          name: 'Valid Palindrome', difficulty: 'Easy', lc: 125,
          code: `def isPalindrome(s):\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and not s[l].isalnum(): l += 1\n        while l < r and not s[r].isalnum(): r -= 1\n        if s[l].lower() != s[r].lower():\n            return False\n        l += 1; r -= 1\n    return True`,
          explanation: 'Two pointers from both ends. Skip non-alphanumeric characters. Compare lowercase versions. If any mismatch, return False. If pointers meet, it is a palindrome.',
        },
      ],
    },
  ],
};
