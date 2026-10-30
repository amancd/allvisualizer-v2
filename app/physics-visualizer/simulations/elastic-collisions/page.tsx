import type { Metadata } from "next";
import Link from 'next/link';
import ElasticCollisionsVisualizer from './ElasticCollisionsVisualizer';
import GiscusComments from '@/components/ui/GiscusComments';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Elastic Collisions Simulator - Physics Visualizer | AllVisualizer',
    description: 'Interactive elastic collision simulation. Explore momentum and energy conservation with customizable masses and velocities.',
    keywords: ['elastic collision', 'momentum conservation', 'energy conservation', 'physics simulation', 'collision physics'],
    openGraph: {
      title: 'Elastic Collisions Simulator | AllVisualizer',
      description: 'Visualize momentum and energy conservation in elastic collisions',
      type: 'article',
    },
  };
}

export default function ElasticCollisionsPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
            <li>/</li>
            <li><Link href="/physics-visualizer" className="hover:text-gray-900">Physics</Link></li>
            <li>/</li>
            <li><Link href="/physics-visualizer/mechanics" className="hover:text-gray-900">Mechanics</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Elastic Collisions</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12 space-y-4">
          <div className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold border border-orange-300">
            Intermediate
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Elastic Collisions
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Explore the fundamental principles of momentum and energy conservation through interactive collision simulations.
          </p>
        </header>

        {/* Topics */}
        <div className="mb-8 flex flex-wrap gap-2">
          {['Momentum Conservation', 'Energy Conservation', '1D Collisions', 'Physics Simulation'].map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-300"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Visualizer */}
        <ElasticCollisionsVisualizer />

        {/* Learning Objectives */}
        <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Learning Objectives</h2>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Understand conservation of momentum in isolated systems</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Observe conservation of kinetic energy in elastic collisions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Analyze how mass ratios affect collision outcomes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Apply collision formulas to predict final velocities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Explore special cases: equal masses, stationary targets</span>
            </li>
          </ul>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-yellow-900 mb-4">💡 Experimentation Tips</h2>
          <ul className="space-y-2 text-yellow-800">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Equal Masses:</strong> Set both masses to the same value and observe velocity exchange</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Heavy vs Light:</strong> Try m₁ = 5kg, m₂ = 0.5kg to see dramatic effects</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Head-on Collision:</strong> Set opposite velocities for classic collision scenario</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Add Gravity:</strong> Enable gravity to see parabolic trajectories after collision</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Watch Conservation:</strong> Monitor total momentum and KE - they should stay constant!</span>
            </li>
          </ul>
        </div>

        {/* Real World Applications */}
        <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-green-900 mb-4">🌍 Real-World Applications</h2>
          <div className="grid md:grid-cols-2 gap-4 text-green-800">
            <div>
              <h3 className="font-semibold mb-2">Billiards & Pool</h3>
              <p className="text-sm">Ball collisions approximate elastic collisions, allowing players to predict ball trajectories.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Particle Physics</h3>
              <p className="text-sm">Collision experiments in particle accelerators use these principles to study subatomic particles.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Molecular Dynamics</h3>
              <p className="text-sm">Gas molecules collide elastically, helping explain temperature and pressure in thermodynamics.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Vehicle Safety</h3>
              <p className="text-sm">Understanding collision physics helps design safer cars and predict crash outcomes.</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            href="/physics-visualizer/simulations/newtons-laws"
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors border-2 border-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Newton's Laws</span>
          </Link>
          
          <Link
            href="/physics-visualizer/mechanics"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            <span>Back to Mechanics</span>
          </Link>
        </div>

        {/* Comments */}
        <div className="mt-16">
          <GiscusComments />
        </div>
      </div>
    </div>
  );
}
