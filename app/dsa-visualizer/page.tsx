import type { Metadata } from "next";
import Link from 'next/link';
import { Button } from '@/components/ui';

export const metadata: Metadata = {
  title: "DSA Visualizer - Data Structures & Algorithms | AllVisualizer",
  description: "Master Data Structures and Algorithms through interactive visualizations. Learn Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, and more with step-by-step execution.",
  keywords: ["DSA visualizer", "data structures", "algorithms", "sorting algorithms", "graph algorithms", "tree traversal", "dynamic programming"],
  openGraph: {
    title: "DSA Visualizer - Interactive Learning | AllVisualizer",
    description: "Master DSA concepts through interactive visualizations",
  },
};

export default function DSAVisualizer() {
  const dsaCategories = [
    {
      title: 'Arrays',
      description: 'Visualize array operations, sorting, and searching algorithms',
      icon: '[]',
      color: 'from-blue-500 to-cyan-500',
      topics: ['Sorting', 'Searching', 'Two Pointers', 'Sliding Window'],
      slug: 'arrays',
      isAvailable: true
    },
    {
      title: 'Linked Lists',
      description: 'Understand pointer manipulation and list operations',
      icon: '→',
      color: 'from-purple-500 to-pink-500',
      topics: ['Insertion', 'Deletion', 'Reversal', 'Cycle Detection'],
      slug: 'linked-lists',
      isAvailable: true
    },
    {
      title: 'Stacks & Queues',
      description: 'Learn LIFO and FIFO data structures',
      icon: '||',
      color: 'from-emerald-500 to-teal-500',
      topics: ['Push/Pop', 'Enqueue/Dequeue', 'Applications'],
      slug: 'stacks-queues',
      isAvailable: true
    },
    {
      title: 'Trees',
      description: 'Explore binary trees, BST, and tree traversals',
      icon: '⊤',
      color: 'from-green-500 to-lime-500',
      topics: ['Traversals', 'BST Operations', 'AVL Trees', 'Heaps'],
      slug: 'trees',
      isAvailable: true
    },
    {
      title: 'Graphs',
      description: 'Understand graph representations and algorithms',
      icon: '⬡',
      color: 'from-orange-500 to-amber-500',
      topics: ['BFS', 'DFS', 'Dijkstra', 'MST'],
      slug: 'graphs',
      isAvailable: true
    },
    {
      title: 'Dynamic Programming',
      description: 'Master optimization and memoization techniques',
      icon: 'DP',
      color: 'from-yellow-500 to-orange-500',
      topics: ['Fibonacci', 'Knapsack', 'LCS', 'Edit Distance'],
      slug: 'dynamic-programming',
      isAvailable: false
    },
    {
      title: 'Recursion',
      description: 'Visualize recursive calls and backtracking',
      icon: '↻',
      color: 'from-indigo-500 to-purple-500',
      topics: ['Base Cases', 'Backtracking', 'Tree Recursion'],
      slug: 'recursion',
      isAvailable: false
    },
    {
      title: 'Hashing',
      description: 'Learn hash tables and collision resolution',
      icon: '#',
      color: 'from-pink-500 to-rose-500',
      topics: ['Hash Functions', 'Collision Handling', 'Applications'],
      slug: 'hashing',
      isAvailable: false
    },
    {
      title: 'Strings',
      description: 'Master string manipulation and pattern matching',
      icon: '""',
      color: 'from-red-500 to-orange-500',
      topics: ['Palindromes', 'Substrings', 'Pattern Matching', 'Anagrams'],
      slug: 'strings',
      isAvailable: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Data Structures & Algorithms Visualizer
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Master DSA concepts through interactive visualizations. Watch algorithms execute step-by-step, experiment with your own data, and build deep understanding.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/dsa-visualizer/problems/two-sum">
                <Button size="lg" rightIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                }>
                  Try Practice Problems
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Problems Section */}
      <section className="py-16 md:py-20 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Practice Problems
            </h2>
            <p className="text-lg text-gray-600">
              Solve real problems with complete explanations, solutions, and interactive visualizations
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/dsa-visualizer/problems/two-sum" className="block group">
              <div className="p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900">
                        Two Sum
                      </h3>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                        Easy
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Find two numbers in an array that add up to a target value.
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link href="/dsa-visualizer/problems/valid-palindrome" className="block group">
              <div className="p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900">
                        Valid Palindrome
                      </h3>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                        Easy
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Determine if a string is a palindrome using two pointers.
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Browse Topics
            </h2>
            <p className="text-lg text-gray-600">
              Explore DSA concepts organized by category
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {dsaCategories.map((category, index) => {
              const CardContent = (
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900">
                        {category.title}
                      </h3>
                    </div>
                    {category.isAvailable ? (
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs font-medium flex-shrink-0">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {category.topics.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                    {category.topics.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                        +{category.topics.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );

              return category.isAvailable ? (
                <Link
                  key={index}
                  href={`/dsa-visualizer/${category.slug}`}
                  className="group block p-5 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all"
                >
                  {CardContent}
                </Link>
              ) : (
                <div
                  key={index}
                  className="group block p-5 bg-white border border-gray-200 rounded-lg opacity-60 cursor-not-allowed"
                >
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>


    </div>
  );
}
