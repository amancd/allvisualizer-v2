"use client";

import Link from 'next/link';
import { useState } from 'react';
import GiscusComments from "@/components/ui/GiscusComments";
import TwoSumVisualizer from "./TwoSumVisualizer";

type Language = 'javascript' | 'python' | 'java' | 'cpp';

const solutions: Record<Language, { code: string; label: string }> = {
  javascript: {
    label: 'JavaScript',
    code: `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return null;
}`
  },
  python: {
    label: 'Python',
    code: `def two_sum(nums, target):
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return None`
  },
  java: {
    label: 'Java',
    code: `public class Solution {
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
}`
  },
  cpp: {
    label: 'C++',
    code: `class Solution {
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
};`
  }
};

export default function TwoSumProblem() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('javascript');

  return (
    <div className="min-h-screen bg-white pt-16">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link href="/dsa-visualizer" className="hover:text-indigo-600">DSA</Link>
          <span>/</span>
          <span className="text-gray-900">Two Sum</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Two Sum</h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium">
              Easy
            </span>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            Find two numbers in an array that add up to a target value.
          </p>
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            <span>Time: O(n)</span>
            <span>•</span>
            <span>Space: O(n)</span>
          </div>
        </header>

        {/* Problem Statement */}
        <section className="prose max-w-none mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Problem Statement</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Given an array of integers <code className="px-2 py-1 bg-gray-100 rounded text-sm">nums</code> and 
            an integer <code className="px-2 py-1 bg-gray-100 rounded text-sm">target</code>, return indices of 
            the two numbers such that they add up to <code className="px-2 py-1 bg-gray-100 rounded text-sm">target</code>.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-6 overflow-x-auto">
            <p className="text-sm font-semibold text-gray-700 mb-2">Example:</p>
            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-all">{`Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] == 9, so we return [0, 1]`}</pre>
          </div>

          <p className="text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
            <strong>Note:</strong> You may assume that each input has exactly one solution, and you may not use the same element twice.
          </p>
        </section>

        {/* Approach */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Approach</h2>
          <p className="text-gray-700 mb-6">
            The optimal solution uses a hash map to achieve O(n) time complexity:
          </p>

          <ol className="space-y-4 list-decimal list-inside text-gray-700">
            <li>Create an empty hash map to store numbers and their indices</li>
            <li>Iterate through the array once</li>
            <li>For each number, calculate its complement (target - current number)</li>
            <li>Check if the complement exists in the hash map</li>
            <li>If yes, return the indices. If no, add the current number to the map</li>
          </ol>

          <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
            <p className="text-sm text-green-900">
              <strong>Why this works:</strong> By storing each number as we iterate, we can check in O(1) time 
              if the complement has been seen before, avoiding nested loops.
            </p>
          </div>
        </section>

        {/* Solution */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Solution</h2>

          {/* Language Tabs */}
          <div className="flex gap-2 mb-4 border-b border-gray-200">
            {(Object.keys(solutions) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  selectedLanguage === lang
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {solutions[lang].label}
              </button>
            ))}
          </div>
          
          {/* Code Block */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <pre className="p-6 overflow-x-auto text-sm"><code className="text-gray-100 font-mono">{solutions[selectedLanguage].code}</code></pre>
          </div>
        </section>

        {/* Visualizer */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Visualizer</h2>
          <p className="text-gray-600 mb-6">
            See the algorithm in action step-by-step:
          </p>
          <TwoSumVisualizer />
        </section>

        {/* Complexity */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Time & Space Complexity</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Time Complexity</div>
              <code className="text-lg font-mono font-semibold text-gray-900">O(n)</code>
              <p className="text-sm text-gray-600 mt-2">Single pass through the array</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Space Complexity</div>
              <code className="text-lg font-mono font-semibold text-gray-900">O(n)</code>
              <p className="text-sm text-gray-600 mt-2">Hash map storage for n elements</p>
            </div>
          </div>
        </section>

        {/* Discussion */}
        <section className="mb-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Discussion</h2>
          <p className="text-gray-600 mb-6">
            Have questions or want to discuss alternative approaches? Join the conversation below.
          </p>
          <GiscusComments />
        </section>

        {/* Back Link */}
        <div className="pt-8 border-t border-gray-200">
          <Link
            href="/dsa-visualizer"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to DSA Visualizer
          </Link>
        </div>
      </article>
    </div>
  );
}
