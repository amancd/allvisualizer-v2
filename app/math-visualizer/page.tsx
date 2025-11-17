import type { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Math Visualizer - Interactive Mathematics | AllVisualizer",
  description: "Master mathematics through interactive visualizations. Learn Calculus, Linear Algebra, Trigonometry, and more with step-by-step visual representations.",
  keywords: ["math visualizer", "calculus", "linear algebra", "trigonometry", "matrix operations", "derivatives", "integrals"],
  openGraph: {
    title: "Math Visualizer - Interactive Learning | AllVisualizer",
    description: "Master math concepts through interactive visualizations",
  },
};

export default function MathVisualizer() {
  const mathCategories = [
    {
      title: 'Calculus',
      description: 'Visualize derivatives, integrals, and limits',
      icon: '∫',
      color: 'from-blue-500 to-cyan-500',
      topics: ['Derivatives', 'Integrals', 'Limits', 'Series'],
      slug: 'calculus',
      isAvailable: true,
      problems: [
        { title: 'Derivatives', slug: 'derivatives' }
      ]
    },
    {
      title: 'Linear Algebra',
      description: 'Understand matrices, vectors, and transformations',
      icon: '⊞',
      color: 'from-purple-500 to-pink-500',
      topics: ['Matrix Operations', 'Vectors', 'Eigenvalues', 'Transformations'],
      slug: 'linear-algebra',
      isAvailable: true,
      problems: [
        { title: 'Matrix Operations', slug: 'matrix-operations' }
      ]
    },
    {
      title: 'Trigonometry',
      description: 'Explore angles, circles, and wave functions',
      icon: '○',
      color: 'from-emerald-500 to-teal-500',
      topics: ['Unit Circle', 'Trigonometric Functions', 'Identities', 'Waves'],
      slug: 'trigonometry',
      isAvailable: false
    },
    {
      title: 'Geometry',
      description: 'Visualize shapes, transformations, and proofs',
      icon: '△',
      color: 'from-orange-500 to-amber-500',
      topics: ['Euclidean Geometry', 'Transformations', 'Proofs', 'Coordinate Geometry'],
      slug: 'geometry',
      isAvailable: false
    },
    {
      title: 'Statistics',
      description: 'Learn probability distributions and data analysis',
      icon: '📊',
      color: 'from-green-500 to-lime-500',
      topics: ['Distributions', 'Hypothesis Testing', 'Regression', 'Probability'],
      slug: 'statistics',
      isAvailable: false
    },
    {
      title: 'Number Theory',
      description: 'Explore prime numbers and mathematical patterns',
      icon: '№',
      color: 'from-indigo-500 to-purple-500',
      topics: ['Prime Numbers', 'GCD/LCM', 'Modular Arithmetic', 'Sequences'],
      slug: 'number-theory',
      isAvailable: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Mathematics Visualizer
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Master math concepts through interactive visualizations. See calculus, algebra, and geometry come to life with step-by-step animations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/math-visualizer/calculus"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Start Learning
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="https://discord.gg/z4TgSrJQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
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

      {/* Categories Grid */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Browse Topics
            </h2>
            <p className="text-lg text-gray-600">
              Explore mathematics concepts organized by category
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {mathCategories.map((category, index) => {
              const CardContent = (
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                        {category.title}
                      </h3>
                    </div>
                    {category.isAvailable ? (
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  href={`/math-visualizer/${category.slug}`}
                  className="group block p-5 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
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
