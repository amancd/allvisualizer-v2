import type { Metadata } from 'next';
import { Callout, CodeTabs, Complexity, ContentSection, DetailPage, Prose, StepList } from '@/components/content';
import BestTimeToBuySellStockVisualizer from './BestTimeToBuySellStockVisualizer';

export const metadata: Metadata = {
  title: 'Best Time to Buy and Sell Stock - Array Algorithm | DSA Visualizer',
  description:
    'Learn the Best Time to Buy and Sell Stock problem with interactive visualization. Understand the greedy one-pass approach that tracks the minimum price and maximum profit.',
  keywords: ['best time to buy and sell stock', 'max profit', 'greedy', 'dynamic programming', 'array algorithm', 'leetcode', 'coding interview', 'algorithm visualization'],
  openGraph: {
    title: 'Best Time to Buy and Sell Stock - Interactive Algorithm Visualization',
    description: 'Master the greedy max-profit approach with step-by-step visualization',
  },
};

const solutions = [
  { label: 'JavaScript', language: 'javascript', code: `function maxProfit(prices) {
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
console.log(maxProfit(prices)); // Output: 5` },
  { label: 'Python', language: 'python', code: `def maxProfit(prices):
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
print(maxProfit(prices))  # Output: 5` },
  { label: 'Java', language: 'java', code: `class Solution {
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
}` },
  { label: 'C++', language: 'cpp', code: `#include <vector>
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
// cout << solution.maxProfit(prices); // Output: 5` },
];

export default function BestTimeToBuySellStockPage() {
  return (
    <DetailPage
      subject="dsa"
      item="best-time-to-buy-sell-stock"
      width="narrow"
      description="Find the maximum profit you can achieve from buying and selling a stock once. Learn the greedy approach that tracks the minimum price and maximum profit."
      meta={<span className="font-mono">Time O(n) · Space O(1)</span>}
    >
      <ContentSection title="Problem statement">
        <Prose>
          <p>
            You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the{' '}
            <code>i</code>
            <sup>th</sup> day.
          </p>
          <p>
            You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the
            future to sell that stock.
          </p>
          <p>
            Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return{' '}
            <code>0</code>.
          </p>
        </Prose>
        <Callout tone="example" title="Example 1" className="mt-5">
          <pre className="whitespace-pre-wrap font-mono text-[13px]">{`Input:  prices = [7, 1, 5, 3, 6, 4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.`}</pre>
        </Callout>
        <Callout tone="example" title="Example 2" className="mt-4">
          <pre className="whitespace-pre-wrap font-mono text-[13px]">{`Input:  prices = [7, 6, 4, 3, 1]
Output: 0
Explanation: No transactions are done, i.e. max profit = 0.`}</pre>
        </Callout>
      </ContentSection>

      <ContentSection title="Interactive visualizer" description="See the algorithm run step by step.">
        <BestTimeToBuySellStockVisualizer />
      </ContentSection>

      <ContentSection title="Approach">
        <StepList
          steps={[
            <>
              <strong className="text-ink">Track the minimum price.</strong> Keep track of the minimum price seen so far as
              we iterate through the array. This represents the best day to buy.
            </>,
            <>
              <strong className="text-ink">Calculate the potential profit.</strong> For each price, calculate the profit if we
              sell at the current price (current price − minimum price).
            </>,
            <>
              <strong className="text-ink">Update the maximum profit.</strong> Keep track of the maximum profit encountered so
              far. This greedy approach finds the optimal solution in one pass.
            </>,
          ]}
        />
      </ContentSection>

      <ContentSection title="Solution">
        <CodeTabs samples={solutions} />
      </ContentSection>

      <ContentSection title="Time & space complexity">
        <Complexity
          time="O(n)"
          timeNote="We traverse the array once, performing constant-time operations at each step."
          space="O(1)"
          spaceNote="We only use two variables (minPrice and maxProfit) regardless of input size."
        />
      </ContentSection>
    </DetailPage>
  );
}
