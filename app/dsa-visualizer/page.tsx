import Link from 'next/link';

export default function DSAVisualizer() {
  const dsaCategories = [
    {
      title: 'Arrays',
      description: 'Visualize array operations, sorting, and searching algorithms',
      icon: '📊',
      topics: ['Sorting', 'Searching', 'Two Pointers', 'Sliding Window']
    },
    {
      title: 'Linked Lists',
      description: 'Understand pointer manipulation and list operations',
      icon: '🔗',
      topics: ['Insertion', 'Deletion', 'Reversal', 'Cycle Detection']
    },
    {
      title: 'Stacks & Queues',
      description: 'Learn LIFO and FIFO data structures',
      icon: '📚',
      topics: ['Push/Pop', 'Enqueue/Dequeue', 'Applications']
    },
    {
      title: 'Trees',
      description: 'Explore binary trees, BST, and tree traversals',
      icon: '🌳',
      topics: ['Traversals', 'BST Operations', 'AVL Trees', 'Heaps']
    },
    {
      title: 'Graphs',
      description: 'Understand graph representations and algorithms',
      icon: '🕸️',
      topics: ['BFS', 'DFS', 'Dijkstra', 'MST']
    },
    {
      title: 'Dynamic Programming',
      description: 'Master optimization and memoization techniques',
      icon: '💡',
      topics: ['Fibonacci', 'Knapsack', 'LCS', 'Edit Distance']
    },
    {
      title: 'Recursion',
      description: 'Visualize recursive calls and backtracking',
      icon: '🔄',
      topics: ['Base Cases', 'Backtracking', 'Tree Recursion']
    },
    {
      title: 'Hashing',
      description: 'Learn hash tables and collision resolution',
      icon: '#️⃣',
      topics: ['Hash Functions', 'Collision Handling', 'Applications']
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Data Structures & Algorithms Visualizer
          </h1>
          <p className="text-xl text-indigo-100">
            Interactive visualizations to master DSA concepts with ease
          </p>
        </div>
      </section>

      {/* Sample Problems */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Practice Problems</h2>
            <p className="text-gray-600">Try small problems with explanations and visualizers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/dsa-visualizer/problems/two-sum" className="block">
              <div className="bg-indigo-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-gray-900">Two Sum</h3>
                <p className="text-sm text-gray-600 mt-2">Find two indices that add up to target. Includes approach, solution and a small visualizer.</p>
                <div className="mt-4 inline-block text-sm text-indigo-600 font-medium">Open Problem →</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose a Topic to Visualize
            </h2>
            <p className="text-lg text-gray-600">
              Click on any category to explore interactive visualizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dsaCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md card-hover p-6 cursor-pointer border-2 border-transparent hover:border-indigo-500 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-4 transition-transform group-hover:scale-125 inline-block">{category.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {category.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium hover:bg-indigo-100 transition-colors"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-indigo-600 text-sm font-semibold group-hover:translate-x-2 transition-transform inline-block">
                  Coming Soon →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discord Community Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Join Our Learning Community
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Discuss concepts, ask questions, and learn together on Discord
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://discord.gg/z4TgSrJQ"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all hover:shadow-xl hover:scale-105 transform text-center"
              >
                Join Discord Community
              </a>
              <Link
                href="/about"
                className="bg-indigo-500 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all text-center"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            What Makes Our Visualizer Special
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Step-by-Step Execution</h3>
              <p className="text-gray-600">
                Watch algorithms execute one step at a time with detailed explanations
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Input</h3>
              <p className="text-gray-600">
                Use your own data to see how algorithms work with different inputs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Complexity Analysis</h3>
              <p className="text-gray-600">
                Understand time and space complexity with real-time analysis
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
