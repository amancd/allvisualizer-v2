import Link from 'next/link';
import { Button } from '@/components/ui';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section - Simplified */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            World's 1st Open Source Visualization Platform
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Master complex concepts with interactive visual learning experiences. See algorithms come to life step-by-step.
          </p>

          {/* Einstein Quote */}
          <div className="pt-2">
            <blockquote className="text-base md:text-lg italic text-gray-500">
              "Imagination is more important than knowledge."
              <span className="block text-sm mt-1 not-italic text-gray-400">— Albert Einstein</span>
            </blockquote>
          </div>
              
          <div className="pt-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories">
                <Button size="lg">
                  Browse Categories
                </Button>
              </Link>
              <Link href="/physics-visualizer">
                <Button variant="outline" size="lg">
                  Start with Physics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Simplified */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Start learning with our interactive visualizers
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              <span>View all categories</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="space-y-4">
            {/* DSA - Available */}
            <Link href="/dsa-visualizer" className="block group">
              <div className="bg-white border-2 border-gray-300 rounded-xl p-6 hover:border-gray-600 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-900 transition-colors">
                      Data Structures & Algorithms
                    </h3>
                    <p className="text-gray-700 font-medium">
                      Learn sorting, searching, trees, graphs, and essential CS concepts
                    </p>
                  </div>
                  <svg className="w-6 h-6 text-gray-500 group-hover:text-gray-900 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Mathematics - Preview */}
            <Link href="/math-visualizer" className="block group">
              <div className="bg-white border-2 border-gray-300 rounded-xl p-6 hover:border-gray-600 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-900 transition-colors">
                        Mathematics
                      </h3>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-300">Preview</span>
                    </div>
                    <p className="text-gray-700 font-medium">
                      Visualize calculus, linear algebra, and mathematical concepts
                    </p>
                  </div>
                  <svg className="w-6 h-6 text-gray-500 group-hover:text-gray-900 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Physics - Preview */}
            <Link href="/physics-visualizer" className="block group">
              <div className="bg-white border-2 border-gray-300 rounded-xl p-6 hover:border-gray-600 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-900 transition-colors">
                        Physics
                      </h3>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-300">Preview</span>
                    </div>
                    <p className="text-gray-700 font-medium">
                      Simulate mechanics, waves, energy, and forces
                    </p>
                  </div>
                  <svg className="w-6 h-6 text-gray-500 group-hover:text-gray-900 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* AI/ML - Preview */}
            <Link href="/ai-ml-visualizer" className="block group">
              <div className="bg-white border-2 border-gray-300 rounded-xl p-6 hover:border-gray-600 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-900 transition-colors">
                        AI & Machine Learning
                      </h3>
                      <span className="px-3 py-1 bg-gray-200 text-gray-900 text-xs font-bold rounded-full border border-gray-300">Preview</span>
                    </div>
                    <p className="text-gray-700 font-medium">
                      Understand neural networks and AI algorithms visually
                    </p>
                  </div>
                  <svg className="w-6 h-6 text-gray-500 group-hover:text-gray-900 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Simplified */}
      <section className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Start Your Learning Journey Today
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Master complex concepts with interactive visualizations and step-by-step explanations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/categories">
              <Button size="lg">
                Explore All Categories
              </Button>
            </Link>
            <Link href="/dsa-visualizer">
              <Button variant="outline" size="lg">
                Start with DSA
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
