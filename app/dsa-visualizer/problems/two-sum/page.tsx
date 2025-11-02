"use client";

import Link from 'next/link';
import DiscordComments from "@/components/ui/DiscordComments";
import TwoSumVisualizer from "@/components/visualizers/TwoSumVisualizer";

export default function TwoSumProblem() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/dsa-visualizer" className="text-sm text-indigo-600 hover:underline">
          ← Back to DSA Visualizer
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Two Sum</h1>
        <p className="text-gray-600">Given an array of integers, return indices of the two numbers such that they add up to a specific target.</p>
      </header>

      <div className="grid md:grid-cols-4 gap-8">
        {/* TOC */}
        <nav className="md:col-span-1">
          <div className="sticky top-24 bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold mb-3">Contents</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#problem" className="text-indigo-600 hover:underline">Problem</a>
              </li>
              <li>
                <a href="#approach" className="text-indigo-600 hover:underline">Approach</a>
              </li>
              <li>
                <a href="#solution" className="text-indigo-600 hover:underline">Solution</a>
              </li>
              <li>
                <a href="#visualizer" className="text-indigo-600 hover:underline">Visualizer</a>
              </li>
              <li>
                <a href="#complexity" className="text-indigo-600 hover:underline">Time Complexity</a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Content */}
        <main className="md:col-span-3 space-y-8">
          <section id="problem" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-3">Problem</h2>
            <p>
              Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
              You may assume that each input would have exactly one solution, and you may not use the same element twice.
            </p>
            <pre className="mt-4 bg-gray-100 p-3 rounded">{`Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}</pre>
          </section>

          <section id="approach" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-3">Approach</h2>
            <p className="mb-2">We present two common approaches:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Brute force</strong>: Check all pairs (O(n^2) time, O(1) space).</li>
              <li><strong>Hash map</strong>: Store previously seen values and their indices; for each number check if target - num exists in the map (O(n) time, O(n) space).</li>
            </ul>
          </section>

          <section id="solution" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-3">Solution (JavaScript)</h2>
            <pre className="mt-2 bg-gray-100 p-3 rounded overflow-auto text-sm">{`function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return null;
}`}</pre>
          </section>

                    {/* Visualizer Section */}
          <section id="visualizer" className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Interactive Visualizer</h2>
            <TwoSumVisualizer />
          </section>

          <section id="complexity" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-3">Time & Space Complexity</h2>
            <ul className="list-disc list-inside">
              <li><strong>Hash map approach</strong>: Time - O(n), Space - O(n)</li>
              <li><strong>Brute force</strong>: Time - O(n^2), Space - O(1)</li>
            </ul>
          </section>

          {/* Discord comments component for discussion */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Discussion</h2>
            <DiscordComments topic="Two Sum" />
          </section>
        </main>
      </div>
    </div>
  );
}
