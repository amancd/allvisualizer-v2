import type { Metadata } from 'next';
import { Callout, CodeTabs, Complexity, ContentSection, DetailPage, Prose, StepList } from '@/components/content';
import TwoSumVisualizer from './TwoSumVisualizer';

export const metadata: Metadata = {
  title: 'Two Sum Problem - Array Algorithm | DSA Visualizer',
  description:
    'Learn the Two Sum problem with interactive visualization. Understand the hash map approach, see step-by-step execution, and practice in multiple programming languages.',
  keywords: ['two sum', 'array algorithm', 'hash map', 'leetcode', 'coding interview', 'algorithm visualization'],
  openGraph: {
    title: 'Two Sum - Interactive Algorithm Visualization',
    description: 'Master the Two Sum problem with step-by-step visualization',
  },
};

const solutions = [
  { label: 'JavaScript', language: 'javascript', code: `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return null;
}` },
  { label: 'Python', language: 'python', code: `def two_sum(nums, target):
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return None` },
  { label: 'Java', language: 'java', code: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            
            map.put(nums[i], i);
        }
        
        return null;
    }
}` },
  { label: 'C++', language: 'cpp', code: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            
            seen[nums[i]] = i;
        }
        
        return {};
    }
};` },
];

export default function TwoSumPage() {
  return (
    <DetailPage
      subject="dsa"
      item="two-sum"
      width="narrow"
      description="Find two numbers in an array that add up to a target value."
      meta={<span className="font-mono">Time O(n) · Space O(n)</span>}
    >
      <ContentSection title="Problem statement">
        <Prose>
          <p>
            Given an array of integers <code>nums</code> and an integer <code>target</code>, return the indices of the
            two numbers that add up to <code>target</code>.
          </p>
        </Prose>
        <Callout tone="example" title="Example" className="mt-5">
          <pre className="whitespace-pre-wrap font-mono text-[13px]">{`Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] == 9, so we return [0, 1]`}</pre>
        </Callout>
        <Callout tone="note" className="mt-4">
          You may assume each input has exactly one solution, and you may not use the same element twice.
        </Callout>
      </ContentSection>

      <ContentSection title="Approach" description="A hash map gives an O(n) solution:">
        <StepList
          steps={[
            'Create an empty hash map to store numbers and their indices.',
            'Iterate through the array once.',
            'For each number, calculate its complement (target − current number).',
            'Check whether the complement is already in the hash map.',
            'If it is, return both indices. Otherwise add the current number to the map.',
          ]}
        />
        <Callout tone="tip" title="Why this works" className="mt-5">
          Storing each number as we go lets us check in O(1) whether its complement has been seen, avoiding nested loops.
        </Callout>
      </ContentSection>

      <ContentSection title="Solution">
        <CodeTabs samples={solutions} />
      </ContentSection>

      <ContentSection title="Interactive visualizer" description="See the algorithm run step by step.">
        <TwoSumVisualizer />
      </ContentSection>

      <ContentSection title="Time & space complexity">
        <Complexity time="O(n)" timeNote="Single pass through the array" space="O(n)" spaceNote="Hash map stores up to n elements" />
      </ContentSection>
    </DetailPage>
  );
}
