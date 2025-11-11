import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-indigo-50 via-purple-50 to-transparent opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium animate-fade-in">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                Trusted by 10,000+ learners worldwide
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Learn Through
                <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Interactive Visualization
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Master complex concepts in Data Structures, Algorithms, and more with engaging visual learning experiences designed for developers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Link
                  href="/dsa-visualizer"
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg overflow-hidden transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-lg hover:border-gray-300 hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  Watch Demo
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-600"><span className="font-semibold text-gray-900">4.9/5</span> rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-600"><span className="font-semibold text-gray-900">100%</span> free</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm text-gray-600"><span className="font-semibold text-gray-900">50+</span> visualizers</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Visual Elements */}
            <div className="relative lg:block hidden">
              <div className="relative w-full h-[500px]">
                {/* Floating Cards */}
                <div className="absolute top-0 right-0 w-64 p-6 bg-white rounded-2xl shadow-xl border border-gray-100 animate-float" style={{ animationDelay: '0s' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg">
                      🔍
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Binary Search</div>
                      <div className="text-xs text-gray-500">Algorithm</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                    </div>
                    <div className="text-xs text-gray-500">Complexity: O(log n)</div>
                  </div>
                </div>
                
                <div className="absolute top-32 left-0 w-56 p-5 bg-white rounded-2xl shadow-xl border border-gray-100 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white text-lg">
                      🌳
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Tree Traversal</div>
                      <div className="text-xs text-gray-500">Data Structure</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex-1 h-12 bg-gradient-to-t from-pink-500 to-rose-400 rounded" style={{ height: `${i * 10}px` }}></div>
                    ))}
                  </div>
                </div>
                
                <div className="absolute bottom-20 right-12 w-60 p-5 bg-white rounded-2xl shadow-xl border border-gray-100 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-gray-900">Quick Sort</div>
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Fast</div>
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {[40, 70, 30, 90, 50, 20, 80].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">Average: O(n log n)</div>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why choose AllVisualizer?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to master complex concepts through interactive visualization
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-all hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-200">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Visual Learning</h3>
                <p className="text-gray-600 leading-relaxed">
                  See algorithms and data structures come to life with interactive animations and step-by-step visualizations.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-purple-100 transition-all hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-purple-200">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Experience</h3>
                <p className="text-gray-600 leading-relaxed">
                  Control the pace, input your own data, and experiment with different scenarios to deepen understanding.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-pink-100 transition-all hover:shadow-xl hover:shadow-pink-100/50 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-pink-200">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Comprehensive Library</h3>
                <p className="text-gray-600 leading-relaxed">
                  From basic data structures to advanced algorithms, find visualizations for all your learning needs.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-emerald-100 transition-all hover:shadow-xl hover:shadow-emerald-100/50 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-200">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Step-by-Step Execution</h3>
                <p className="text-gray-600 leading-relaxed">
                  Watch algorithms execute one step at a time with detailed explanations for each operation.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-100 transition-all hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Complexity Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  Understand time and space complexity with visual representations and detailed breakdowns.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-orange-100 transition-all hover:shadow-xl hover:shadow-orange-100/50 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-orange-200">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Customizable Inputs</h3>
                <p className="text-gray-600 leading-relaxed">
                  Test with your own data sets and edge cases to truly understand algorithm behavior.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <Link
              href="/dsa-visualizer"
              className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all group"
            >
              Explore all features
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-24 md:py-32 bg-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Categories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Explore by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose your learning path and start mastering concepts through interactive visualization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* DSA - Active */}
            <Link href="/dsa-visualizer" className="group">
              <div className="relative h-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🔍</span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Data Structures & Algorithms
                  </h3>
                  <p className="text-indigo-100 mb-6 flex-grow leading-relaxed">
                    Master sorting, searching, trees, graphs, and more with step-by-step visualizations.
                  </p>
                  
                  {/* Badge & Arrow */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      Available Now
                    </div>
                    <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Mathematics - Coming Soon */}
            <div className="group cursor-not-allowed">
              <div className="relative h-full bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative z-10 flex flex-col h-full opacity-60">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gray-300 rounded-xl flex items-center justify-center mb-6">
                    <span className="text-3xl grayscale">📐</span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">
                    Mathematics
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    Visualize calculus, linear algebra, geometry, and mathematical concepts.
                  </p>
                  
                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-300 rounded-full text-gray-700 text-sm font-medium">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                      Coming Soon
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Physics - Coming Soon */}
            <div className="group cursor-not-allowed">
              <div className="relative h-full bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative z-10 flex flex-col h-full opacity-60">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gray-300 rounded-xl flex items-center justify-center mb-6">
                    <span className="text-3xl grayscale">⚡</span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">
                    Physics
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    Explore motion, forces, energy, waves, and fundamental physics principles.
                  </p>
                  
                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-300 rounded-full text-gray-700 text-sm font-medium">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                      Coming Soon
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI/ML - Coming Soon */}
            <div className="group cursor-not-allowed">
              <div className="relative h-full bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative z-10 flex flex-col h-full opacity-60">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gray-300 rounded-xl flex items-center justify-center mb-6">
                    <span className="text-3xl grayscale">🤖</span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">
                    AI & Machine Learning
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    Understand neural networks, deep learning, and AI algorithms visually.
                  </p>
                  
                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-300 rounded-full text-gray-700 text-sm font-medium">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                      Coming Soon
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Want to be notified when new categories launch?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-all hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Get Notified
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white py-20 md:py-24 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers mastering complex concepts through interactive visualization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dsa-visualizer"
              className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-indigo-600 rounded-xl font-semibold text-lg overflow-hidden transition-all hover:bg-gray-50 hover:shadow-2xl hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:bg-opacity-10 transition-all hover:-translate-y-1"
            >
              Contact Us
            </Link>
          </div>
          
          {/* Trust Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white border-opacity-20">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
              <div className="text-indigo-200 text-sm md:text-base">Active Learners</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-indigo-200 text-sm md:text-base">Visualizations</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">4.9★</div>
              <div className="text-indigo-200 text-sm md:text-base">User Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
