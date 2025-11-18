'use client';

import { useState } from 'react';
import Link from 'next/link';
import BestTimeToBuySellStockVisualizer from './BestTimeToBuySellStockVisualizer';

export default function BestTimeToBuySellStockPage() {
  const [showTOC, setShowTOC] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'java' | 'cpp'>('javascript');

  const solutions = {
    javascript: `function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    
    for (let i = 0; i < prices.length; i++) {
        // Update minimum price seen so far
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        }
        // Calculate profit if we sell at current price
        else if (prices[i] - minPrice > maxProfit) {
            maxProfit = prices[i] - minPrice;
        }
    }
    
    return maxProfit;
}

// Example usage
const prices = [7, 1, 5, 3, 6, 4];
console.log(maxProfit(prices)); // Output: 5`,

    python: `def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        # Update minimum price seen so far
        if price < min_price:
            min_price = price
        # Calculate profit if we sell at current price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    
    return max_profit

# Example usage
prices = [7, 1, 5, 3, 6, 4]
print(maxProfit(prices))  # Output: 5`,

    java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        
        for (int i = 0; i < prices.length; i++) {
            // Update minimum price seen so far
            if (prices[i] < minPrice) {
                minPrice = prices[i];
            }
            // Calculate profit if we sell at current price
            else if (prices[i] - minPrice > maxProfit) {
                maxProfit = prices[i] - minPrice;
            }
        }
        
        return maxProfit;
    }
    
    // Example usage
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] prices = {7, 1, 5, 3, 6, 4};
        System.out.println(solution.maxProfit(prices)); // Output: 5
    }
}`,

    cpp: `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX;
        int maxProfit = 0;
        
        for (int i = 0; i < prices.size(); i++) {
            // Update minimum price seen so far
            if (prices[i] < minPrice) {
                minPrice = prices[i];
            }
            // Calculate profit if we sell at current price
            else if (prices[i] - minPrice > maxProfit) {
                maxProfit = prices[i] - minPrice;
            }
        }
        
        return maxProfit;
    }
};

// Example usage
// vector<int> prices = {7, 1, 5, 3, 6, 4};
// Solution solution;
// cout << solution.maxProfit(prices); // Output: 5`
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile TOC Toggle */}
      <button
        onClick={() => setShowTOC(!showTOC)}
        className="fixed bottom-6 right-6 z-50 lg:hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Table of Contents - Sidebar */}
            <aside className={`${showTOC ? 'block' : 'hidden'} lg:block fixed lg:sticky top-20 left-0 w-64 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit z-40 lg:z-0 m-4 lg:m-0`}>
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">On This Page</h3>
              <nav className="space-y-2">
                <a href="#problem" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-1">Problem Statement</a>
                <a href="#examples" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-1">Examples</a>
                <a href="#approach" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-1">Approach</a>
                <a href="#solution" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-1">Solution</a>
                <a href="#complexity" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-1">Complexity Analysis</a>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 animate-fade-in">
                <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link href="/dsa-visualizer" className="hover:text-gray-900 transition-colors">DSA Visualizer</Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link href="/dsa-visualizer/arrays" className="hover:text-gray-900 transition-colors">Arrays</Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium">Best Time to Buy and Sell Stock</span>
              </div>

              {/* Hero Section */}
              <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-white p-6 md:p-8 rounded-2xl border border-gray-300 mb-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                      Best Time to Buy and Sell Stock
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold border border-green-200">
                        Easy
                      </span>
                      <span className="px-3 py-1 bg-gray-200 text-gray-900 rounded-lg text-sm font-semibold">
                        Array
                      </span>
                      <span className="px-3 py-1 bg-gray-200 text-gray-900 rounded-lg text-sm font-semibold">
                        Dynamic Programming
                      </span>
                      <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-semibold">
                        Greedy
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Find the maximum profit you can achieve from buying and selling a stock once. Learn the greedy approach to track minimum price and maximum profit.
                </p>
              </div>

              {/* Problem Statement */}
              <section id="problem" className="scroll-mt-24 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Problem Statement</h2>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 mb-4 text-sm md:text-base">
                      You are given an array <code className="px-2 py-1 bg-gray-100 rounded text-sm">prices</code> where <code className="px-2 py-1 bg-gray-100 rounded text-sm">prices[i]</code> is the price of a given stock on the <code className="px-2 py-1 bg-gray-100 rounded text-sm">i<sup>th</sup></code> day.
                    </p>
                    <p className="text-gray-700 mb-4 text-sm md:text-base">
                      You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.
                    </p>
                    <p className="text-gray-700 text-sm md:text-base">
                      Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return <code className="px-2 py-1 bg-gray-100 rounded text-sm">0</code>.
                    </p>
                  </div>
                </div>
              </section>

              {/* Examples */}
              <section id="examples" className="scroll-mt-24 mb-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Examples</h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Example 1:</div>
                      <div className="font-mono text-xs sm:text-sm space-y-1">
                        <div><span className="text-gray-600">Input:</span> prices = [7,1,5,3,6,4]</div>
                        <div><span className="text-gray-600">Output:</span> 5</div>
                        <div className="text-gray-600 text-xs mt-2">
                          <strong>Explanation:</strong> Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Example 2:</div>
                      <div className="font-mono text-xs sm:text-sm space-y-1">
                        <div><span className="text-gray-600">Input:</span> prices = [7,6,4,3,1]</div>
                        <div><span className="text-gray-600">Output:</span> 0</div>
                        <div className="text-gray-600 text-xs mt-2">
                          <strong>Explanation:</strong> No transactions are done, i.e. max profit = 0.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Interactive Visualizer */}
              <section id="visualizer" className="scroll-mt-24 mb-8 animate-fade-in" style={{ animationDelay: '0.17s' }}>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-8 rounded-2xl border-2 border-blue-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Interactive Visualizer</h2>
                  </div>
                  <BestTimeToBuySellStockVisualizer />
                </div>
              </section>

              {/* Approach */}
              <section id="approach" className="scroll-mt-24 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Approach</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-200 text-gray-900 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Track Minimum Price</h4>
                        <p className="text-gray-700 text-sm md:text-base">Keep track of the minimum price seen so far as we iterate through the array. This represents the best day to buy.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-200 text-gray-900 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Calculate Potential Profit</h4>
                        <p className="text-gray-700 text-sm md:text-base">For each price, calculate the profit if we sell at the current price (current price - minimum price).</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-200 text-gray-900 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Update Maximum Profit</h4>
                        <p className="text-gray-700 text-sm md:text-base">Keep track of the maximum profit encountered so far. This greedy approach ensures we find the optimal solution in one pass.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Solution */}
              <section id="solution" className="scroll-mt-24 mb-8 animate-fade-in" style={{ animationDelay: '0.25s' }}>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Solution</h2>
                  </div>

                  {/* Language Tabs */}
                  <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200 pb-4">
                    {(['javascript', 'python', 'java', 'cpp'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                          selectedLanguage === lang
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="bg-gray-900 rounded-xl p-4 md:p-6 overflow-x-auto">
                    <pre className="text-gray-100 text-xs sm:text-sm font-mono leading-relaxed">
                      {solutions[selectedLanguage]}
                    </pre>
                  </div>
                </div>
              </section>

              {/* Complexity */}
              <section id="complexity" className="scroll-mt-24 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Complexity Analysis</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 md:p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-700">Time Complexity</span>
                        <code className="px-3 py-1 bg-green-100 text-green-700 rounded-md font-mono text-sm font-semibold">O(n)</code>
                      </div>
                      <p className="text-sm text-gray-600">We traverse the array once, performing constant time operations at each step.</p>
                    </div>

                    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-700">Space Complexity</span>
                        <code className="px-3 py-1 bg-gray-200 text-gray-900 rounded-md font-mono text-sm font-semibold">O(1)</code>
                      </div>
                      <p className="text-sm text-gray-600">We only use two variables (minPrice and maxProfit) regardless of input size.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Next Steps */}
              <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white animate-fade-in" style={{ animationDelay: '0.35s' }}>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready for More Challenges?</h3>
                <p className="text-sm md:text-base text-blue-100 mb-6">
                  Continue practicing with more array problems and master dynamic programming concepts.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Link
                    href="/dsa-visualizer/arrays"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold text-sm md:text-base hover:bg-gray-50 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    More Array Problems
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
    </div>
  );
}
