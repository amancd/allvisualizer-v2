import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Learn Through Interactive Visualization
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Master complex concepts in Data Structures, Algorithms, and more with engaging visual learning
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/dsa-visualizer"
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition-all hover:shadow-xl hover:scale-105 transform"
              >
                Explore DSA Visualizer
              </Link>
              <Link
                href="/about"
                className="glass border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:bg-opacity-20 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why AllVisualizer?
            </h2>
            <p className="text-xl text-gray-600">
              Making complex concepts simple and engaging
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm card-hover">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 transition-transform hover:scale-110">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visual Learning</h3>
              <p className="text-gray-600">
                See algorithms and data structures come to life with interactive animations and step-by-step visualizations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm card-hover">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 transition-transform hover:scale-110">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Experience</h3>
              <p className="text-gray-600">
                Control the pace, input your own data, and experiment with different scenarios to deepen understanding.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm card-hover">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 transition-transform hover:scale-110">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Library</h3>
              <p className="text-gray-600">
                From basic data structures to advanced algorithms, find visualizations for all your learning needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-xl text-gray-600">
              Start your learning journey today
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* DSA - Active */}
            <Link href="/dsa-visualizer" className="group">
              <div className="gradient-bg p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="text-white relative z-10">
                  <div className="text-4xl mb-4 transition-transform group-hover:scale-110">🔍</div>
                  <h3 className="text-2xl font-bold mb-2">DSA</h3>
                  <p className="text-indigo-100">Data Structures & Algorithms</p>
                  <div className="mt-4 inline-block glass px-3 py-1 rounded-full text-sm">
                    Available Now
                  </div>
                </div>
              </div>
            </Link>

            {/* Mathematics - Coming Soon */}
            <div className="group cursor-not-allowed">
              <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-8 rounded-xl shadow-lg opacity-60 relative overflow-hidden">
                <div className="absolute inset-0 skeleton"></div>
                <div className="text-white relative z-10">
                  <div className="text-4xl mb-4">📐</div>
                  <h3 className="text-2xl font-bold mb-2">Mathematics</h3>
                  <p className="text-gray-100">Calculus, Geometry & More</p>
                  <div className="mt-4 inline-block glass px-3 py-1 rounded-full text-sm">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>

            {/* Physics - Coming Soon */}
            <div className="group cursor-not-allowed">
              <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-8 rounded-xl shadow-lg opacity-60 relative overflow-hidden">
                <div className="absolute inset-0 skeleton"></div>
                <div className="text-white relative z-10">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-2xl font-bold mb-2">Physics</h3>
                  <p className="text-gray-100">Motion, Forces & Energy</p>
                  <div className="mt-4 inline-block glass px-3 py-1 rounded-full text-sm">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>

            {/* AI/ML - Coming Soon */}
            <div className="group cursor-not-allowed">
              <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-8 rounded-xl shadow-lg opacity-60 relative overflow-hidden">
                <div className="absolute inset-0 skeleton"></div>
                <div className="text-white relative z-10">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-2xl font-bold mb-2">AI & ML</h3>
                  <p className="text-gray-100">Neural Networks & More</p>
                  <div className="mt-4 inline-block glass px-3 py-1 rounded-full text-sm">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of learners mastering complex concepts through visualization
          </p>
          <Link
            href="/dsa-visualizer"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition-all hover:shadow-xl hover:scale-105 transform"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
