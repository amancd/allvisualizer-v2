import type { Metadata } from 'next';
import DSAPatterns from '../DSAPatterns';

export const metadata: Metadata = {
  title: 'DSA Patterns – Notes & Code Templates for Coding Interviews',
  description: 'All 93 DSA patterns with notes, theory, and ready-to-use Python code templates. Two Pointers, Sliding Window, Binary Search, Trees, Graphs, Dynamic Programming and more.',
  keywords: ['dsa patterns', 'coding interview patterns', 'leetcode patterns', 'two pointers', 'sliding window', 'dynamic programming', 'algorithm templates', 'data structures notes'],
};

export default function DSAPatternsPage() {
  return <DSAPatterns />;
}
