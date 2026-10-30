import type { Metadata } from "next";
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Electromagnetism - Physics Visualizer | AllVisualizer',
    description: 'Interactive simulations of electromagnetism: electric fields, magnetic fields, circuits, and electromagnetic waves.',
    keywords: ['electromagnetism', 'electric field', 'magnetic field', 'Maxwell equations', 'circuits', 'physics simulation'],
  };
}

export default function ElectromagnetismPage() {
  const problems = [
    {
      title: 'Electric Field Lines',
      description: 'Visualize electric fields from point charges and charge distributions',
      difficulty: 'Beginner',
      slug: 'electric-field-lines',
      topics: ['Coulomb\'s Law', 'Field Lines', 'Superposition', 'Point Charges'],
      comingSoon: false
    },
    {
      title: 'Magnetic Field Visualization',
      description: 'Explore magnetic fields from currents and magnets',
      difficulty: 'Intermediate',
      slug: 'magnetic-field',
      topics: ['Biot-Savart', 'Magnetic Dipole', 'Current Loops', 'Solenoids'],
      comingSoon: false
    },
    {
      title: 'Capacitors & RC Circuits',
      description: 'Analyze charging and discharging of capacitors',
      difficulty: 'Intermediate',
      slug: 'rc-circuits',
      topics: ['Capacitance', 'Time Constant', 'Exponential Decay', 'Energy Storage'],
      comingSoon: false
    },
    {
      title: 'Electromagnetic Induction',
      description: 'Visualize Faraday\'s law and induced currents',
      difficulty: 'Advanced',
      slug: 'em-induction',
      topics: ['Faraday\'s Law', 'Lenz\'s Law', 'Induced EMF', 'Transformers'],
      comingSoon: false
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
            <li>/</li>
            <li><Link href="/physics-visualizer" className="hover:text-gray-900">Physics Visualizer</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Electromagnetism</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⚡</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Electromagnetism
            </h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Explore the fascinating world of electric and magnetic fields. Learn Coulomb's law, 
            Maxwell's equations, circuits, and electromagnetic waves through interactive simulations.
          </p>
        </header>

        {/* Key Concepts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Concepts</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Electric Fields</h3>
              <p className="text-sm text-yellow-800">
                Understand electric forces and fields from charged particles
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Magnetic Fields</h3>
              <p className="text-sm text-blue-800">
                Explore magnetic forces from currents and permanent magnets
              </p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Maxwell's Equations</h3>
              <p className="text-sm text-purple-800">
                Master the fundamental equations of electromagnetism
              </p>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">EM Waves</h3>
              <p className="text-sm text-orange-800">
                Study propagating electromagnetic waves and radiation
              </p>
            </div>
          </div>
        </section>

        {/* Simulations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Simulations</h2>
          <div className="space-y-4">
            {problems.map((problem, index) => (
              <div
                key={index}
                className={`border border-gray-200 rounded-lg p-6 ${
                  !problem.comingSoon ? 'hover:border-gray-400 hover:shadow-md' : 'opacity-60'
                } transition-all`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {!problem.comingSoon ? (
                        <Link
                          href={`/physics-visualizer/simulations/${problem.slug}`}
                          className="text-lg font-semibold text-gray-900 hover:text-gray-700"
                        >
                          {problem.title}
                        </Link>
                      ) : (
                        <h3 className="text-lg font-semibold text-gray-600">
                          {problem.title}
                        </h3>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        problem.difficulty === 'Beginner' 
                          ? 'bg-green-100 text-green-700'
                          : problem.difficulty === 'Intermediate'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {problem.difficulty}
                      </span>
                      {problem.comingSoon && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs font-medium">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{problem.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {problem.topics.map((topic, i) => (
                        <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  {!problem.comingSoon && (
                    <Link
                      href={`/physics-visualizer/simulations/${problem.slug}`}
                      className="text-gray-900 hover:text-gray-700 flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Back Link */}
        <div className="pt-8 border-t border-gray-200">
          <Link
            href="/physics-visualizer"
            className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Physics Visualizer
          </Link>
        </div>
      </div>
    </div>
  );
}
