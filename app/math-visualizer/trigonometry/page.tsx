import type { Metadata } from 'next';
import Link from 'next/link';
import { GiscusComments } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Trigonometry Visualizer | AllVisualizer',
  description: 'Learn trigonometry concepts through interactive visualizations. Master the unit circle, sine, cosine, tangent, and trigonometric identities.',
  keywords: ['trigonometry', 'unit circle', 'sine', 'cosine', 'tangent', 'trigonometric functions', 'identities'],
};

export default function TrigonometryPage() {
  const visualizations = [
    {
      title: 'Unit Circle Explorer',
      description: 'Interactive unit circle showing angles, coordinates, and all six trig functions',
      href: '/math-visualizer/trigonometry/unit-circle',
      difficulty: 'Beginner',
      topics: ['Unit Circle', 'Angles', 'Coordinates', 'Special Angles'],
      isAvailable: true,
    },
    {
      title: 'Trigonometric Functions',
      description: 'Visualize sin, cos, tan and their graphs with interactive controls',
      href: '/math-visualizer/trigonometry/trig-functions',
      difficulty: 'Beginner',
      topics: ['Sine', 'Cosine', 'Tangent', 'Amplitude', 'Period', 'Phase Shift'],
      isAvailable: true,
    },
    {
      title: 'Trigonometric Identities',
      description: 'Prove and visualize fundamental trig identities geometrically',
      href: '/math-visualizer/trigonometry/identities',
      difficulty: 'Intermediate',
      topics: ['Pythagorean Identity', 'Sum/Difference', 'Double Angle', 'Half Angle'],
      isAvailable: false,
    },
    {
      title: 'Wave Functions',
      description: 'Explore sine and cosine waves, harmonics, and interference',
      href: '/math-visualizer/trigonometry/waves',
      difficulty: 'Intermediate',
      topics: ['Sine Waves', 'Harmonics', 'Interference', 'Fourier Series'],
      isAvailable: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <nav className="pt-24 pb-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/math-visualizer" className="hover:text-gray-900">
                Math
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Trigonometry</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Trigonometry
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master trigonometric concepts through interactive visualizations. Explore the unit circle, wave functions, and fundamental identities.
            </p>
          </div>
        </div>
      </section>

      {/* Visualizations Grid */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Interactive Visualizations
            </h2>
            <p className="text-gray-600">
              Explore trigonometry concepts step by step
            </p>
          </div>

          <div className="grid gap-6">
            {visualizations.map((viz, index) => {
              const CardContent = (
                <div className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {viz.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          viz.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                          viz.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {viz.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {viz.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {viz.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    {viz.isAvailable ? (
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-900 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    ) : (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-md flex-shrink-0 ml-4 h-fit">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              );

              return viz.isAvailable ? (
                <Link key={index} href={viz.href} className="group">
                  {CardContent}
                </Link>
              ) : (
                <div key={index} className="opacity-60 cursor-not-allowed">
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Concepts */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Key Concepts
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                The Unit Circle
              </h3>
              <p className="text-gray-600 text-sm">
                A circle with radius 1 centered at the origin. Every angle corresponds to a point (cos θ, sin θ) on this circle, providing a geometric foundation for all trig functions.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Six Trigonometric Functions
              </h3>
              <p className="text-gray-600 text-sm">
                Sine, cosine, tangent, cosecant, secant, and cotangent each represent different ratios in a right triangle or coordinates on the unit circle.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Periodic Nature
              </h3>
              <p className="text-gray-600 text-sm">
                Trig functions repeat their values in regular intervals (periods). Sin and cos have period 2π, while tan has period π. This makes them perfect for modeling waves and cycles.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fundamental Identities
              </h3>
              <p className="text-gray-600 text-sm">
                Equations like sin²θ + cos²θ = 1 hold for all angles. These identities are essential tools for simplifying expressions and solving equations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comments */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Discussion
          </h2>
          <GiscusComments />
        </div>
      </section>
    </div>
  );
}
