import type { PatternCategory } from '../types';

export const binarySearch: PatternCategory = {
  name: 'Binary Search Patterns',
  slug: 'binary-search',
  subPatterns: [
    {
      title: 'Binary Search - On Sorted Array/List',
      slug: 'bs-sorted',
      recall: 'Sorted input + find target/position → classic binary search. Use lo <= hi when you need to check every element; use lo < hi when you converge to a single answer.',
      theory: [
        'Standard binary search on a sorted array. Initialize lo = 0, hi = n - 1.',
        'Compute mid = lo + (hi - lo) // 2 to avoid integer overflow.',
        'Compare nums[mid] to target: equal → found; less → search right half; greater → search left half.',
        'Halves the search space each iteration → O(log n) time, O(1) space.',
        'Extend to 2D matrices: treat the matrix as a flat sorted array, convert index → row/col.',
        'For "search insert position", when the loop exits, lo is the correct insertion index.',
      ],
      template: `def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1  # or lo for insertion point`,
      problems: [
        {
          name: 'Binary Search', difficulty: 'Easy', lc: 704,
          code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
          explanation: 'Textbook binary search. Compare mid to target, halve the range. Returns index or -1.',
        },
        {
          name: 'Search Insert Position', difficulty: 'Easy', lc: 35,
          code: `def searchInsert(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return lo`,
          explanation: 'Same as binary search but when not found, lo points to where target would be inserted to keep the array sorted.',
        },
        {
          name: 'Search a 2D Matrix', difficulty: 'Medium', lc: 74,
          code: `def searchMatrix(matrix, target):
    m, n = len(matrix), len(matrix[0])
    lo, hi = 0, m * n - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        val = matrix[mid // n][mid % n]
        if val == target:
            return True
        elif val < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return False`,
          explanation: 'Treat the m×n matrix as a flat sorted array of length m*n. Convert flat index to row = mid // n, col = mid % n. Then standard binary search.',
        },
        {
          name: 'Guess Number Higher or Lower', difficulty: 'Easy', lc: 374,
          code: `def guessNumber(n):
    lo, hi = 1, n
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        result = guess(mid)
        if result == 0:
            return mid
        elif result == -1:
            hi = mid - 1
        else:
            lo = mid + 1`,
          explanation: 'Binary search on [1, n]. The API guess() returns 0 (correct), -1 (lower), or 1 (higher). Halve the range based on the hint.',
        },
        {
          name: 'Search a 2D Matrix II', difficulty: 'Medium', lc: 240,
          code: `def searchMatrix(matrix, target):
    row, col = 0, len(matrix[0]) - 1
    while row < len(matrix) and col >= 0:
        if matrix[row][col] == target:
            return True
        elif matrix[row][col] < target:
            row += 1
        else:
            col -= 1
    return False`,
          explanation: 'Start from top-right corner. If value > target, move left. If value < target, move down. Eliminates one row or column each step → O(m + n).',
        },
        {
          name: 'Kth Missing Positive Number', difficulty: 'Easy', lc: 1539,
          code: `def findKthPositive(arr, k):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        missing = arr[mid] - (mid + 1)
        if missing < k:
            lo = mid + 1
        else:
            hi = mid - 1
    return lo + k`,
          explanation: 'At index mid, the count of missing numbers before arr[mid] is arr[mid] - (mid + 1). Binary search for the first index where missing >= k. Answer is lo + k.',
        },
        {
          name: 'Valid Perfect Square', difficulty: 'Easy', lc: 367,
          code: `def isPerfectSquare(num):
    lo, hi = 1, num
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        sq = mid * mid
        if sq == num:
            return True
        elif sq < num:
            lo = mid + 1
        else:
            hi = mid - 1
    return False`,
          explanation: 'Binary search on [1, num]. Check if mid*mid == num. If mid² < num search right, if mid² > num search left.',
        },
        {
          name: 'Arranging Coins', difficulty: 'Easy', lc: 441,
          code: `def arrangeCoins(n):
    lo, hi = 1, n
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        total = mid * (mid + 1) // 2
        if total == n:
            return mid
        elif total < n:
            lo = mid + 1
        else:
            hi = mid - 1
    return hi`,
          explanation: 'k complete rows need k*(k+1)/2 coins. Binary search for the largest k where k*(k+1)/2 <= n. When loop ends, hi is that value.',
        },
      ],
    },
    {
      title: 'Binary Search - Find Min/Max in Rotated Sorted Array',
      slug: 'bs-rotated',
      recall: 'Rotated sorted array → one side of mid is always sorted. Check which side is sorted, then decide if target (or minimum) is in that sorted half or the other.',
      theory: [
        'A rotated sorted array has a pivot where the order breaks. Two sorted halves exist.',
        'To find the minimum: compare nums[mid] to nums[hi]. If nums[mid] > nums[hi], min is in the right half; otherwise it is in the left half (including mid).',
        'To search for a target: determine which half is sorted (nums[lo] <= nums[mid] means left is sorted), then check if target falls in the sorted range.',
        'With duplicates (LC 81, 154), when nums[lo] == nums[mid] == nums[hi], shrink both ends — worst case O(n).',
        'Time: O(log n) without duplicates. Space: O(1).',
        'Finding the pivot index lets you reduce any rotated array problem to a standard binary search on the correct half.',
      ],
      template: `# Find minimum in rotated sorted array
def findMin(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1      # min is in right half
        else:
            hi = mid           # mid could be the min
    return nums[lo]

# Search in rotated sorted array
def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:          # left half sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                              # right half sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
      problems: [
        {
          name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', lc: 153,
          code: `def findMin(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    return nums[lo]`,
          explanation: 'Compare mid to hi. If nums[mid] > nums[hi], the rotation point (minimum) must be to the right of mid. Otherwise, mid itself could be the minimum, so set hi = mid. Converges to a single element.',
        },
        {
          name: 'Find Minimum in Rotated Sorted Array II', difficulty: 'Hard', lc: 154,
          code: `def findMin(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        elif nums[mid] < nums[hi]:
            hi = mid
        else:
            hi -= 1  # duplicate: shrink
    return nums[lo]`,
          explanation: 'Same as LC 153 but with duplicates. When nums[mid] == nums[hi], we cannot determine which side — safely shrink hi by 1. Worst case O(n).',
        },
        {
          name: 'Search in Rotated Sorted Array', difficulty: 'Medium', lc: 33,
          code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
          explanation: 'Determine which half is sorted. If left half is sorted (nums[lo] <= nums[mid]), check if target is in [lo, mid). If yes, search left; otherwise search right. Mirror logic for right half sorted.',
        },
        {
          name: 'Search in Rotated Sorted Array II', difficulty: 'Medium', lc: 81,
          code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return True
        if nums[lo] == nums[mid] == nums[hi]:
            lo += 1
            hi -= 1
        elif nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return False`,
          explanation: 'Handles duplicates. When lo, mid, hi all equal, shrink both ends. Otherwise same sorted-half logic as LC 33.',
        },
        {
          name: 'Find Peak Element', difficulty: 'Medium', lc: 162,
          code: `def findPeakElement(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] < nums[mid + 1]:
            lo = mid + 1
        else:
            hi = mid
    return lo`,
          explanation: 'If nums[mid] < nums[mid+1], a peak must exist to the right (since the sequence is still climbing). Otherwise a peak is at mid or to its left. Converges to a peak in O(log n).',
        },
        {
          name: 'Find the Rotation Count', difficulty: 'Medium', lc: 153,
          code: `def findRotationCount(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    return lo  # index of minimum = rotation count`,
          explanation: 'The number of rotations equals the index of the minimum element. Finding the minimum index is identical to LC 153. The index itself is the answer.',
        },
      ],
    },
    {
      title: 'Binary Search - On Answer / Condition Function',
      slug: 'bs-on-answer',
      recall: 'If the problem asks "what is the minimum X such that condition is feasible?" — binary search on X. Write a feasibility checker, then find the boundary where it flips from False to True.',
      theory: [
        'Instead of searching a sorted array, binary search the answer space [minAnswer, maxAnswer].',
        'Define a monotonic feasibility function: can_do(x) that returns True/False.',
        'If minimizing: find the smallest x where can_do(x) is True → use hi = mid when feasible.',
        'If maximizing: find the largest x where can_do(x) is True → use lo = mid when feasible.',
        'Time: O(check(n) × log(range)). Space depends on the feasibility check.',
        'Common cue words: "minimum maximum", "maximum minimum", "at most K", "within D days".',
        'Always verify the monotonicity assumption: if can_do(x) is True, then can_do(x+1) is also True (for minimization problems).',
        'Typical answer ranges: [1, max(array)] for speed/capacity, [min, sum] for partitioning.',
      ],
      template: `def binary_search_on_answer(lo, hi, can_do):
    """Find minimum feasible answer."""
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_do(mid):
            hi = mid          # mid works, try smaller
        else:
            lo = mid + 1      # mid doesn't work, need bigger
    return lo

# Example: Koko Eating Bananas
def minEatingSpeed(piles, h):
    def can_finish(speed):
        return sum((p + speed - 1) // speed for p in piles) <= h
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_finish(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
      problems: [
        {
          name: 'Koko Eating Bananas', difficulty: 'Medium', lc: 875,
          code: `def minEatingSpeed(piles, h):
    def can_finish(speed):
        return sum((p + speed - 1) // speed for p in piles) <= h
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_finish(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
          explanation: 'Answer space is [1, max(piles)]. At speed mid, hours needed = sum of ceil(pile/speed). If total hours <= h, mid is feasible — try smaller. Otherwise need faster speed.',
        },
        {
          name: 'Capacity To Ship Packages Within D Days', difficulty: 'Medium', lc: 1011,
          code: `def shipWithinDays(weights, days):
    def can_ship(cap):
        d, cur = 1, 0
        for w in weights:
            if cur + w > cap:
                d += 1
                cur = 0
            cur += w
        return d <= days
    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_ship(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
          explanation: 'Min capacity is max(weights) (must fit largest package), max is sum(weights) (ship all in one day). Greedily count days needed at capacity mid. If days <= D, try smaller capacity.',
        },
        {
          name: 'Split Array Largest Sum', difficulty: 'Hard', lc: 410,
          code: `def splitArray(nums, k):
    def can_split(maxSum):
        count, cur = 1, 0
        for n in nums:
            if cur + n > maxSum:
                count += 1
                cur = 0
            cur += n
        return count <= k
    lo, hi = max(nums), sum(nums)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_split(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
          explanation: 'Minimize the largest subarray sum when splitting into k parts. Binary search on the answer (max subarray sum). Greedily assign elements to partitions — if adding next element exceeds mid, start a new partition. Feasible if partitions <= k.',
        },
        {
          name: 'Minimum Number of Days to Make m Bouquets', difficulty: 'Medium', lc: 1482,
          code: `def minDays(bloomDay, m, k):
    if m * k > len(bloomDay):
        return -1
    def can_make(days):
        bouquets = flowers = 0
        for b in bloomDay:
            if b <= days:
                flowers += 1
                if flowers == k:
                    bouquets += 1
                    flowers = 0
            else:
                flowers = 0
        return bouquets >= m
    lo, hi = min(bloomDay), max(bloomDay)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_make(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
          explanation: 'Binary search on days [min, max]. At day mid, count consecutive bloomed flowers → bouquets. If we can make >= m bouquets of k flowers, try fewer days.',
        },
        {
          name: 'Magnetic Force Between Two Balls', difficulty: 'Medium', lc: 1552,
          code: `def maxDistance(position, m):
    position.sort()
    def can_place(minDist):
        count, last = 1, position[0]
        for p in position[1:]:
            if p - last >= minDist:
                count += 1
                last = p
        return count >= m
    lo, hi = 1, position[-1] - position[0]
    while lo < hi:
        mid = lo + (hi - lo + 1) // 2   # upper-mid for maximize
        if can_place(mid):
            lo = mid
        else:
            hi = mid - 1
    return lo`,
          explanation: 'Maximize minimum distance. Sort positions. Binary search on distance. Greedily place balls — if gap from last placed >= mid, place here. Use upper-mid (lo + (hi - lo + 1) // 2) because we maximize.',
        },
        {
          name: 'Minimum Limit of Balls in a Bag', difficulty: 'Medium', lc: 1760,
          code: `def minimumSize(nums, maxOps):
    def can_do(maxBalls):
        ops = 0
        for n in nums:
            ops += (n - 1) // maxBalls
        return ops <= maxOps
    lo, hi = 1, max(nums)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_do(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
          explanation: 'Minimize the maximum bag size. To get all bags <= mid, each bag of size n needs ceil(n/mid) - 1 = (n-1)//mid splits. If total splits <= maxOps, mid is feasible.',
        },
        {
          name: 'Nth Magical Number', difficulty: 'Hard', lc: 878,
          code: `def nthMagicalNumber(n, a, b):
    from math import gcd
    lcm = a * b // gcd(a, b)
    def count(x):
        return x // a + x // b - x // lcm
    lo, hi = 1, n * min(a, b)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if count(mid) >= n:
            hi = mid
        else:
            lo = mid + 1
    return lo % (10**9 + 7)`,
          explanation: 'A number is magical if divisible by a or b. Count of magical numbers up to x = x//a + x//b - x//lcm (inclusion-exclusion). Binary search for smallest x with count >= n.',
        },
        {
          name: 'Find the Smallest Divisor Given a Threshold', difficulty: 'Medium', lc: 1283,
          code: `def smallestDivisor(nums, threshold):
    def can_do(d):
        return sum((n + d - 1) // d for n in nums) <= threshold
    lo, hi = 1, max(nums)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if can_do(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
          explanation: 'At divisor mid, the sum of ceil(n/mid) for all n. If sum <= threshold, mid is feasible — try smaller. Same template as Koko Eating Bananas.',
        },
      ],
    },
    {
      title: 'Binary Search - Find First/Last Occurrence',
      slug: 'bs-first-last',
      recall: 'Need leftmost or rightmost position of a value → use bisect_left / bisect_right logic. For first: when nums[mid] >= target, go left (hi = mid). For last: when nums[mid] <= target, go right (lo = mid + 1), then subtract 1.',
      theory: [
        'bisect_left(target): find the first index where nums[i] >= target. Use hi = mid when nums[mid] >= target.',
        'bisect_right(target): find the first index where nums[i] > target. Use hi = mid when nums[mid] > target.',
        'First occurrence of target = bisect_left(target), then verify nums[result] == target.',
        'Last occurrence of target = bisect_right(target) - 1, then verify nums[result] == target.',
        'Count of target = bisect_right(target) - bisect_left(target).',
        'Time: O(log n). Two binary searches for first + last is still O(log n).',
      ],
      template: `def find_first_last(nums, target):
    def bisect_left(target):
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = lo + (hi - lo) // 2
            if nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid
        return lo

    def bisect_right(target):
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = lo + (hi - lo) // 2
            if nums[mid] <= target:
                lo = mid + 1
            else:
                hi = mid
        return lo

    first = bisect_left(target)
    last = bisect_right(target) - 1
    if first <= last and first < len(nums) and nums[first] == target:
        return [first, last]
    return [-1, -1]`,
      problems: [
        {
          name: 'Find First and Last Position of Element in Sorted Array', difficulty: 'Medium', lc: 34,
          code: `def searchRange(nums, target):
    def bisect_left(t):
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < t:
                lo = mid + 1
            else:
                hi = mid
        return lo
    def bisect_right(t):
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] <= t:
                lo = mid + 1
            else:
                hi = mid
        return lo
    first = bisect_left(target)
    last = bisect_right(target) - 1
    if first <= last and first < len(nums) and nums[first] == target:
        return [first, last]
    return [-1, -1]`,
          explanation: 'Two binary searches: bisect_left finds the first index >= target, bisect_right finds the first index > target. First occurrence is bisect_left, last is bisect_right - 1. Verify the element actually equals target.',
        },
        {
          name: 'Count of Smaller Numbers After Self', difficulty: 'Hard', lc: 315,
          code: `from sortedcontainers import SortedList
def countSmaller(nums):
    sl = SortedList()
    res = []
    for n in reversed(nums):
        res.append(sl.bisect_left(n))
        sl.add(n)
    return res[::-1]`,
          explanation: 'Process from right to left. Maintain a sorted list of elements seen so far. For each number, bisect_left gives the count of elements smaller than it. SortedList gives O(log n) insert and search.',
        },
      ],
    },
    {
      title: 'Binary Search - Median and Kth of Two Sorted Arrays',
      slug: 'bs-median-kth',
      recall: 'Median of two sorted arrays → binary search on the smaller array\'s partition. Find a cut where left halves of both arrays contain exactly half the total elements, and max(left) <= min(right).',
      theory: [
        'To find the median of two sorted arrays of sizes m and n, binary search on the shorter array.',
        'Choose a partition i in nums1 (0 to m). Then j = (m + n + 1) // 2 - i ensures left halves have the right count.',
        'Valid partition: max(left1, left2) <= min(right1, right2).',
        'If left1 > right2, we took too many from nums1 → move left. If left2 > right1, too few from nums1 → move right.',
        'Edge cases: use -∞ and +∞ for out-of-bounds left and right values.',
        'Time: O(log min(m, n)). Space: O(1). This is the optimal solution.',
        'The same binary-search-on-partition idea extends to finding the Kth smallest element across two sorted arrays.',
      ],
      template: `def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    lo, hi = 0, m
    while lo <= hi:
        i = (lo + hi) // 2
        j = (m + n + 1) // 2 - i
        left1  = nums1[i-1] if i > 0 else float('-inf')
        right1 = nums1[i]   if i < m else float('inf')
        left2  = nums2[j-1] if j > 0 else float('-inf')
        right2 = nums2[j]   if j < n else float('inf')

        if left1 <= right2 and left2 <= right1:
            if (m + n) % 2 == 1:
                return max(left1, left2)
            return (max(left1, left2) + min(right1, right2)) / 2
        elif left1 > right2:
            hi = i - 1
        else:
            lo = i + 1`,
      problems: [
        {
          name: 'Median of Two Sorted Arrays', difficulty: 'Hard', lc: 4,
          code: `def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    lo, hi = 0, m
    while lo <= hi:
        i = (lo + hi) // 2
        j = (m + n + 1) // 2 - i
        l1 = nums1[i-1] if i > 0 else float('-inf')
        r1 = nums1[i]   if i < m else float('inf')
        l2 = nums2[j-1] if j > 0 else float('-inf')
        r2 = nums2[j]   if j < n else float('inf')
        if l1 <= r2 and l2 <= r1:
            if (m + n) % 2:
                return max(l1, l2)
            return (max(l1, l2) + min(r1, r2)) / 2
        elif l1 > r2:
            hi = i - 1
        else:
            lo = i + 1`,
          explanation: 'Binary search on the partition of the smaller array. Choose cut i in nums1, then j = half - i ensures left sides have half the elements. Valid when max(lefts) <= min(rights). For odd total, median is max(left); for even, average of max(left) and min(right).',
        },
        {
          name: 'Kth Smallest Element in a Sorted Matrix', difficulty: 'Medium', lc: 378,
          code: `def kthSmallest(matrix, k):
    n = len(matrix)
    lo, hi = matrix[0][0], matrix[-1][-1]
    while lo < hi:
        mid = lo + (hi - lo) // 2
        count = 0
        j = n - 1
        for i in range(n):
            while j >= 0 and matrix[i][j] > mid:
                j -= 1
            count += j + 1
        if count >= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
          explanation: 'Binary search on value [min, max]. For each mid, count elements <= mid by walking the staircase from bottom-left of each row. If count >= k, answer is <= mid. Converge to the exact kth value.',
        },
        {
          name: 'Find K-th Smallest Pair Distance', difficulty: 'Hard', lc: 719,
          code: `def smallestDistancePair(nums, k):
    nums.sort()
    lo, hi = 0, nums[-1] - nums[0]
    while lo < hi:
        mid = lo + (hi - lo) // 2
        count = left = 0
        for right in range(len(nums)):
            while nums[right] - nums[left] > mid:
                left += 1
            count += right - left
        if count >= k:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
          explanation: 'Binary search on distance [0, max-min]. For each mid, count pairs with distance <= mid using a sliding window on the sorted array. If count >= k, try smaller distance.',
        },
        {
          name: 'Find K Closest Elements', difficulty: 'Medium', lc: 658,
          code: `def findClosestElements(arr, k, x):
    lo, hi = 0, len(arr) - k
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if x - arr[mid] > arr[mid + k] - x:
            lo = mid + 1
        else:
            hi = mid
    return arr[lo:lo + k]`,
          explanation: 'Binary search for the starting index of the k-length window. Compare distances from x to the left edge (arr[mid]) and right edge (arr[mid+k]). If left is farther, shift window right.',
        },
      ],
    },
  ],
};
