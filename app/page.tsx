import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section - Simplified */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Learn Data Structures & Algorithms Through Visualization
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Master complex concepts with interactive visual learning experiences. See algorithms come to life step-by-step.
          </p>
              
          <div className="pt-4">
            <Link
              href="/dsa-visualizer"
              className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - Simplified */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse Topics
            </h2>
            <p className="text-lg text-gray-600">
              Start learning with our interactive visualizers
            </p>
          </div>

          <div className="space-y-4">
            {/* DSA - Available */}
            <Link href="/dsa-visualizer" className="block group">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-indigo-500 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      Data Structures & Algorithms
                    </h3>
                    <p className="text-gray-600">
                      Learn sorting, searching, trees, graphs, and essential CS concepts
                    </p>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Coming Soon Categories */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-700">
                      Mathematics
                    </h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">Coming Soon</span>
                  </div>
                  <p className="text-gray-500">
                    Visualize calculus, linear algebra, and mathematical concepts
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-700">
                      Physics
                    </h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">Coming Soon</span>
                  </div>
                  <p className="text-gray-500">
                    Explore motion, forces, energy, and physics principles
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-700">
                      AI & Machine Learning
                    </h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">Coming Soon</span>
                  </div>
                  <p className="text-gray-500">
                    Understand neural networks and AI algorithms visually
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Simplified */}
      <section className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of learners mastering DSA through visualization
          </p>
          <Link
            href="/dsa-visualizer"
            className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
