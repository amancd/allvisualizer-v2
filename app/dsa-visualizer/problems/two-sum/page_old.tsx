"use client";

import Link from 'next/link';
import { useState } from 'react';
import DisqusComments from "@/components/ui/DisqusComments";
import TwoSumVisualizer from "@/components/visualizers/TwoSumVisualizer";

type Language = 'javascript' | 'python' | 'java' | 'cpp';

const solutions: Record<Language, { code: string; label: string; ext: string }> = {
  javascript: {
    label: 'JavaScript',
    ext: 'solution.js',
    code: `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return null; // No solution found
}`
  },
  python: {
    label: 'Python',
    ext: 'solution.py',
    code: `def two_sum(nums, target):
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return None  # No solution found`
  },
  java: {
    label: 'Java',
    ext: 'Solution.java',
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
        
        return null; // No solution found
    }
}`
  },
  cpp: {
    label: 'C++',
    ext: 'solution.cpp',
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
        
        return {}; // No solution found
    }
};`
  }
};

export default function TwoSumProblem() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('javascript');

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link href="/dsa-visualizer" className="hover:text-indigo-600">DSA</Link>
          <span>/</span>
          <span className="text-gray-900">Two Sum</span>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Two Sum</h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Easy
            </span>
          </div>
          <p className="text-lg text-gray-600">
            Find two numbers in an array that add up to a target value.
          </p>
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            <span>Time: O(n)</span>
            <span>•</span>
            <span>Space: O(n)</span>
          </div>
        </header>
Output: [0, 1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}</pre>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                  <p className="text-xs sm:text-sm text-blue-900">
                    <strong>Note:</strong> You may assume that each input would have exactly one solution, and you may not use the same element twice.
                  </p>
                </div>
              </div>
            </section>

            {/* Approach Section */}
            <section id="approach" className="scroll-mt-24 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Approach</h2>
                </div>
                
                <p className="text-sm md:text-base text-gray-700 mb-6">We can solve this problem using two different approaches:</p>

                <div className="space-y-4">
                  {/* Brute Force */}
                  <div className="border border-gray-200 rounded-xl p-4 md:p-6 hover:border-red-200 hover:bg-red-50/30 transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Brute Force Approach</h3>
                        <p className="text-sm text-gray-600 mb-3">Check all possible pairs of numbers to find the target sum.</p>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs sm:text-sm">
                          <span className="px-2.5 sm:px-3 py-1 bg-red-50 text-red-700 rounded-full font-medium">Time: O(n²)</span>
                          <span className="px-2.5 sm:px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">Space: O(1)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hash Map */}
                  <div className="border-2 border-indigo-200 bg-indigo-50/50 rounded-xl p-4 md:p-6 hover:border-indigo-300 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900">Hash Map Approach</h3>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Optimal</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          Use a hash map to store previously seen values and their indices. For each number, check if <code className="px-2 py-0.5 bg-white rounded text-sm font-mono">target - num</code> exists in the map.
                        </p>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs sm:text-sm">
                          <span className="px-2.5 sm:px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">Time: O(n)</span>
                          <span className="px-2.5 sm:px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full font-medium">Space: O(n)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Solution Section */}
            <section id="solution" className="scroll-mt-24 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Solution</h2>
                </div>

                {/* Language Tabs */}
                <div className="flex flex-wrap gap-2 mb-4 p-1 bg-gray-100 rounded-xl">
                  {(Object.keys(solutions) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`flex-1 min-w-[70px] px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                        selectedLanguage === lang
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                    >
                      {solutions[lang].label}
                    </button>
                  ))}
                </div>
                
                {/* Code Block */}
                <div className="bg-gray-900 rounded-xl overflow-hidden animate-fade-in">
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">{solutions[selectedLanguage].ext}</span>
                  </div>
                  <pre className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm"><code className="text-gray-100 font-mono">{solutions[selectedLanguage].code}</code></pre>
                </div>

                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                  <p className="text-sm text-green-900">
                    <strong>Why this works:</strong> By storing each number and its index in a hash map, we can check in O(1) time if the complement (target - current number) has been seen before.
                  </p>
                </div>
              </div>
            </section>

            {/* Visualizer Section */}
            <section id="visualizer" className="scroll-mt-24 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Interactive Visualizer</h2>
                </div>
                
                <p className="text-sm md:text-base text-gray-600 mb-6">
                  Watch the algorithm in action! Enter your own values or use the default example to see how the hash map approach solves the problem step by step.
                </p>

                <TwoSumVisualizer />
              </div>
            </section>

            {/* Complexity Section */}
            <section id="complexity" className="scroll-mt-24 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Time & Space Complexity</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  {/* Hash Map Approach */}
                  <div className="border-2 border-green-200 bg-green-50/50 rounded-xl p-4 md:p-6 hover:shadow-lg hover:scale-105 transition-all">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <h3 className="text-base md:text-lg font-bold text-gray-900">Hash Map Approach</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Optimal</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm text-gray-700 font-medium">Time Complexity</span>
                        <code className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-md font-mono text-xs sm:text-sm font-semibold">O(n)</code>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm text-gray-700 font-medium">Space Complexity</span>
                        <code className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md font-mono text-xs sm:text-sm font-semibold">O(n)</code>
                      </div>
                    </div>
                    <p className="mt-4 text-xs sm:text-sm text-gray-600">
                      Single pass through the array with hash map storage.
                    </p>
                  </div>

                  {/* Brute Force */}
                  <div className="border border-gray-200 rounded-xl p-4 md:p-6 bg-gray-50 hover:shadow-lg hover:scale-105 transition-all">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Brute Force Approach</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm text-gray-700 font-medium">Time Complexity</span>
                        <code className="px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded-md font-mono text-xs sm:text-sm font-semibold">O(n²)</code>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm text-gray-700 font-medium">Space Complexity</span>
                        <code className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-md font-mono text-xs sm:text-sm font-semibold">O(1)</code>
                      </div>
                    </div>
                    <p className="mt-4 text-xs sm:text-sm text-gray-600">
                      Nested loops to check all pairs.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Discussion Section */}
            <section id="discussion" className="scroll-mt-24 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Discussion</h2>
                </div>
                
                <p className="text-sm md:text-base text-gray-600 mb-6">
                  Join the conversation! Ask questions, share insights, or discuss alternative approaches with the community.
                </p>

                <DisqusComments 
                  identifier="two-sum" 
                  title="Two Sum - DSA Visualizer"
                  url={typeof window !== 'undefined' ? window.location.href : 'https://allvisualizer.com/dsa-visualizer/problems/two-sum'}
                />
              </div>
            </section>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-6 md:p-8 text-white animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready for More Challenges?</h3>
              <p className="text-sm md:text-base text-indigo-100 mb-6">
                Continue your learning journey with more DSA problems and visualizations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link
                  href="/dsa-visualizer"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold text-sm md:text-base hover:bg-gray-50 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Explore More Problems
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a
                  href="https://discord.gg/z4TgSrJQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold text-sm md:text-base hover:bg-white/30 transition-all hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Join Discord
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
