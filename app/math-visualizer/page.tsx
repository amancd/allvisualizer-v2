import type { Metadata } from "next";
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Sigma, Grid3x3, Circle, Triangle, BarChart3, Hash } from 'lucide-react';

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
      icon: Sigma,
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
      icon: Grid3x3,
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
      icon: Circle,
      color: 'from-emerald-500 to-teal-500',
      topics: ['Unit Circle', 'Trigonometric Functions', 'Identities', 'Waves'],
      slug: 'trigonometry',
      isAvailable: true
    },
    {
      title: 'Geometry',
      description: 'Visualize shapes, transformations, and proofs',
      icon: Triangle,
      color: 'from-orange-500 to-amber-500',
      topics: ['Euclidean Geometry', 'Transformations', 'Proofs', 'Coordinate Geometry'],
      slug: 'geometry',
      isAvailable: false
    },
    {
      title: 'Statistics',
      description: 'Learn probability distributions and data analysis',
      icon: BarChart3,
      color: 'from-green-500 to-lime-500',
      topics: ['Distributions', 'Hypothesis Testing', 'Regression', 'Probability'],
      slug: 'statistics',
      isAvailable: false
    },
    {
      title: 'Number Theory',
      description: 'Explore prime numbers and mathematical patterns',
      icon: Hash,
      color: 'from-indigo-500 to-purple-500',
      topics: ['Prime Numbers', 'GCD/LCM', 'Modular Arithmetic', 'Sequences'],
      slug: 'number-theory',
      isAvailable: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Mathematics Visualizer
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Master math concepts through interactive visualizations. See calculus, algebra, and geometry come to life with step-by-step animations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/math-visualizer/calculus">
                <Button size="lg" rightIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                }>
                  Start Learning
                </Button>
              </Link>
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
                      <category.icon className="w-6 h-6 text-gray-700" />
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
                  href={`/math-visualizer/${category.slug}`}
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
