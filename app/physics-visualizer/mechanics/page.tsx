import type { Metadata } from "next";
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Classical Mechanics - Physics Visualizer | AllVisualizer',
    description: 'Interactive simulations of classical mechanics: projectile motion, Newton\'s laws, collisions, and energy conservation.',
    keywords: ['classical mechanics', 'Newton\'s laws', 'projectile motion', 'kinematics', 'dynamics', 'physics simulation'],
  };
}

export default function MechanicsPage() {
  const problems = [
    {
      title: 'Projectile Motion',
      description: 'Simulate 2D motion under gravity with customizable parameters',
      difficulty: 'Beginner',
      slug: 'projectile-motion',
      topics: ['Kinematics', 'Parabolic Trajectory', 'Range', 'Max Height'],
      comingSoon: false
    },
    {
      title: 'Newton\'s Laws',
      description: 'Explore force, mass, and acceleration relationships',
      difficulty: 'Beginner',
      slug: 'newtons-laws',
      topics: ['F=ma', 'Friction', 'Normal Force', 'Free Body'],
      comingSoon: false
    },
    {
      title: 'Elastic Collisions',
      description: 'Analyze momentum and energy conservation in collisions',
      difficulty: 'Intermediate',
      slug: 'elastic-collisions',
      topics: ['Momentum', 'Energy', '1D Collisions', '2D Collisions'],
      comingSoon: false
    },
    {
      title: 'Energy Conservation',
      description: 'Visualize potential and kinetic energy transformations',
      difficulty: 'Beginner',
      slug: 'energy-conservation',
      topics: ['KE', 'PE', 'Work', 'Power'],
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
            <li className="text-gray-900 font-medium">Classical Mechanics</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⚙️</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Classical Mechanics
            </h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Master the physics of motion and forces. Explore Newton's laws, projectile motion, 
            collisions, and energy conservation through interactive simulations.
          </p>
        </header>

        {/* Key Concepts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Concepts</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Kinematics</h3>
              <p className="text-sm text-gray-900">
                Describe motion with position, velocity, and acceleration
              </p>
            </div>
            
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <h3 className="font-semibold text-cyan-900 mb-2">Dynamics</h3>
              <p className="text-sm text-cyan-800">
                Understand forces and their effects on motion (F = ma)
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Energy</h3>
              <p className="text-sm text-green-800">
                Track kinetic and potential energy transformations
              </p>
            </div>
            
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Momentum</h3>
              <p className="text-sm text-gray-900">
                Analyze collisions and conservation laws
              </p>
            </div>
          </div>
        </section>

        {/* Problems */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Simulations</h2>
          <div className="space-y-4">
            {problems.map((problem, index) => {
              const ProblemCard = (
                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-400 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900">
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
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  href={`/physics-visualizer/simulations/${problem.slug}`}
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
