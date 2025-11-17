import type { Metadata } from "next";
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Linear Algebra - Math Visualizer | AllVisualizer',
    description: 'Master linear algebra with interactive visualizations. Learn matrices, vectors, transformations, and more.',
    keywords: ['linear algebra', 'matrices', 'vectors', 'eigenvalues', 'linear transformations'],
  };
}

export default function LinearAlgebraPage() {
  const problems = [
    {
      title: 'Matrix Operations',
      description: 'Learn matrix addition, multiplication, and scalar operations',
      difficulty: 'Beginner',
      slug: 'matrix-operations',
      topics: ['Addition', 'Multiplication', 'Scalar Operations'],
      comingSoon: false
    },
    {
      title: 'Determinants',
      description: 'Calculate and understand matrix determinants',
      difficulty: 'Intermediate',
      slug: 'determinants',
      topics: ['2×2 Determinant', '3×3 Determinant', 'Properties'],
      comingSoon: false
    },
    {
      title: 'Matrix Inverse',
      description: 'Find inverse matrices and solve linear systems',
      difficulty: 'Intermediate',
      slug: 'matrix-inverse',
      topics: ['Inverse', 'Gauss-Jordan', 'Applications'],
      comingSoon: true
    },
    {
      title: 'Vector Operations',
      description: 'Explore dot product, cross product, and vector magnitude',
      difficulty: 'Beginner',
      slug: 'vector-operations',
      topics: ['Dot Product', 'Cross Product', 'Magnitude'],
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-indigo-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/math-visualizer" className="hover:text-indigo-600">Math Visualizer</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Linear Algebra</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⊞</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Linear Algebra
            </h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Master matrices, vectors, and linear transformations through interactive visualizations. Essential for computer graphics, machine learning, and scientific computing.
          </p>
        </header>

        {/* Key Concepts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Concepts</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Matrices</h3>
              <p className="text-sm text-purple-800">
                Rectangular arrays of numbers representing linear transformations
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Vectors</h3>
              <p className="text-sm text-blue-800">
                Quantities with magnitude and direction in n-dimensional space
              </p>
            </div>
            
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <h3 className="font-semibold text-pink-900 mb-2">Eigenvalues</h3>
              <p className="text-sm text-pink-800">
                Special scalars that characterize matrix transformations
              </p>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-900 mb-2">Transformations</h3>
              <p className="text-sm text-indigo-800">
                Linear mappings that rotate, scale, and shear space
              </p>
            </div>
          </div>
        </section>

        {/* Problems */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Problems</h2>
          <div className="space-y-4">
            {problems.map((problem, index) => {
              const ProblemCard = (
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-indigo-300 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                          {problem.title}
                        </h3>
                        {problem.comingSoon && (
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs font-medium">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {problem.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {problem.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        problem.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                        problem.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {problem.difficulty}
                      </span>
                      {!problem.comingSoon && (
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );

              return problem.comingSoon ? (
                <div key={index} className="opacity-60 cursor-not-allowed">
                  {ProblemCard}
                </div>
              ) : (
                <Link
                  key={index}
                  href={`/math-visualizer/problems/${problem.slug}`}
                  className="block group"
                >
                  {ProblemCard}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
