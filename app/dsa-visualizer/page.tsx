import Link from 'next/link';

export default function DSAVisualizer() {
  const dsaCategories = [
    {
      title: 'Arrays',
      description: 'Visualize array operations, sorting, and searching algorithms',
      icon: '📊',
      color: 'from-blue-500 to-cyan-500',
      topics: ['Sorting', 'Searching', 'Two Pointers', 'Sliding Window'],
      slug: 'arrays',
      isAvailable: true
    },
    {
      title: 'Linked Lists',
      description: 'Understand pointer manipulation and list operations',
      icon: '🔗',
      color: 'from-purple-500 to-pink-500',
      topics: ['Insertion', 'Deletion', 'Reversal', 'Cycle Detection'],
      slug: 'linked-lists',
      isAvailable: true
    },
    {
      title: 'Stacks & Queues',
      description: 'Learn LIFO and FIFO data structures',
      icon: '📚',
      color: 'from-emerald-500 to-teal-500',
      topics: ['Push/Pop', 'Enqueue/Dequeue', 'Applications'],
      slug: 'stacks-queues',
      isAvailable: true
    },
    {
      title: 'Trees',
      description: 'Explore binary trees, BST, and tree traversals',
      icon: '🌳',
      color: 'from-green-500 to-lime-500',
      topics: ['Traversals', 'BST Operations', 'AVL Trees', 'Heaps'],
      slug: 'trees',
      isAvailable: true
    },
    {
      title: 'Graphs',
      description: 'Understand graph representations and algorithms',
      icon: '🕸️',
      color: 'from-orange-500 to-amber-500',
      topics: ['BFS', 'DFS', 'Dijkstra', 'MST'],
      slug: 'graphs',
      isAvailable: true
    },
    {
      title: 'Dynamic Programming',
      description: 'Master optimization and memoization techniques',
      icon: '💡',
      color: 'from-yellow-500 to-orange-500',
      topics: ['Fibonacci', 'Knapsack', 'LCS', 'Edit Distance'],
      slug: 'dynamic-programming',
      isAvailable: false
    },
    {
      title: 'Recursion',
      description: 'Visualize recursive calls and backtracking',
      icon: '🔄',
      color: 'from-indigo-500 to-purple-500',
      topics: ['Base Cases', 'Backtracking', 'Tree Recursion'],
      slug: 'recursion',
      isAvailable: false
    },
    {
      title: 'Hashing',
      description: 'Learn hash tables and collision resolution',
      icon: '#️⃣',
      color: 'from-pink-500 to-rose-500',
      topics: ['Hash Functions', 'Collision Handling', 'Applications'],
      slug: 'hashing',
      isAvailable: false
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-indigo-50 via-purple-50 to-transparent opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium">DSA Visualizer</span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              50+ Interactive Visualizations
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Data Structures &
              <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Algorithms Visualizer
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Master DSA concepts through interactive visualizations. Watch algorithms execute step-by-step, experiment with your own data, and build deep understanding.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dsa-visualizer/problems/two-sum"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg overflow-hidden transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Try Practice Problems
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <a
                href="https://discord.gg/z4TgSrJQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-lg hover:border-gray-300 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Join Community
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Problems Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Practice Problems
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learn by Doing
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Solve real problems with complete explanations, solutions, and interactive visualizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/dsa-visualizer/problems/two-sum" className="group">
              <div className="relative h-full bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                
                <div className="relative">
                  {/* Difficulty Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mb-4">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Easy
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    Two Sum
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Find two numbers in an array that add up to a target value. Includes detailed approach, solution code, and interactive visualizer.
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>With Visualizer</span>
                    </div>
                    <svg className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Placeholder cards */}
            <div className="group cursor-not-allowed">
              <div className="relative h-full bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl border-2 border-dashed border-gray-300 opacity-60">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-300 rounded-full text-xs font-medium text-gray-700 mb-4">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                  Coming Soon
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-3">More Problems</h3>
                <p className="text-gray-600 mb-6">Additional practice problems with visualizations are on the way.</p>
              </div>
            </div>

            <div className="group cursor-not-allowed">
              <div className="relative h-full bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl border-2 border-dashed border-gray-300 opacity-60">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-300 rounded-full text-xs font-medium text-gray-700 mb-4">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                  Coming Soon
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-3">More Problems</h3>
                <p className="text-gray-600 mb-6">Additional practice problems with visualizations are on the way.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="relative py-24 md:py-32 bg-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Topics
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose a Topic to Visualize
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
              Click on any category to explore interactive visualizations and learn DSA concepts in depth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dsaCategories.map((category, index) => {
              const CardContent = (
                <div className="relative">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {category.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Topics Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.topics.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors"
                      >
                        {topic}
                      </span>
                    ))}
                    {category.topics.length > 3 && (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-md text-xs font-medium">
                        +{category.topics.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    {category.isAvailable ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Available Now
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                        Coming Soon
                      </div>
                    )}
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              );

              return category.isAvailable ? (
                <Link
                  key={index}
                  href={`/dsa-visualizer/${category.slug}`}
                  className="group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 p-6 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`}></div>
                  {CardContent}
                </Link>
              ) : (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl border-2 border-gray-100 p-6 cursor-not-allowed transition-all overflow-hidden opacity-75"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`}></div>
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Makes Our Visualizer Special
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Built with learners in mind, featuring everything you need to master DSA
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-all hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-200">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Step-by-Step Execution</h3>
                <p className="text-gray-600 leading-relaxed">
                  Watch algorithms execute one step at a time with detailed explanations for each operation
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-purple-100 transition-all hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-purple-200">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Input</h3>
                <p className="text-gray-600 leading-relaxed">
                  Use your own data to see how algorithms work with different inputs and edge cases
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-pink-100 transition-all hover:shadow-xl hover:shadow-pink-100/50 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-pink-200">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Complexity Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  Understand time and space complexity with real-time analysis and visual representations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community CTA Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Join our Community
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Learn Together with Others
          </h2>
          <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of learners in our Discord community. Discuss concepts, ask questions, and grow together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.gg/z4TgSrJQ"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-indigo-600 rounded-xl font-semibold text-lg overflow-hidden transition-all hover:bg-gray-50 hover:shadow-2xl hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Join Discord Community
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:bg-opacity-10 transition-all hover:-translate-y-1"
            >
              Learn More About Us
            </Link>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white border-opacity-20">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">5K+</div>
              <div className="text-indigo-200 text-sm md:text-base">Community Members</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-indigo-200 text-sm md:text-base">Active Support</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">100+</div>
              <div className="text-indigo-200 text-sm md:text-base">Daily Discussions</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
