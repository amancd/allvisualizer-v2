import type { Metadata } from "next";
import Link from 'next/link';
import EnergyConservationVisualizer from './EnergyConservationVisualizer';
import GiscusComments from '@/components/ui/GiscusComments';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Energy Conservation Simulator - Physics Visualizer | AllVisualizer',
    description: 'Interactive energy conservation simulation. Explore kinetic, potential, and spring energy transformations across multiple scenarios.',
    keywords: ['energy conservation', 'kinetic energy', 'potential energy', 'physics simulation', 'pendulum', 'spring energy'],
    openGraph: {
      title: 'Energy Conservation Simulator | AllVisualizer',
      description: 'Visualize energy transformations in pendulums, free fall, ramps, and springs',
      type: 'article',
    },
  };
}

export default function EnergyConservationPage() {
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
            <li className="text-gray-900 font-medium">Energy Conservation</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12 space-y-4">
          <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold border border-green-300">
            Beginner
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Energy Conservation
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Discover how energy transforms between kinetic, potential, and spring forms while total energy remains constant.
          </p>
        </header>

        {/* Topics */}
        <div className="mb-8 flex flex-wrap gap-2">
          {['Kinetic Energy', 'Potential Energy', 'Spring Energy', 'Energy Transformation'].map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-300"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Visualizer */}
        <EnergyConservationVisualizer />

        {/* Learning Objectives */}
        <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Learning Objectives</h2>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Understand the law of conservation of energy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Observe energy transformations between kinetic and potential forms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Calculate energy in different scenarios (pendulum, free fall, ramp, spring)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Recognize how damping affects total mechanical energy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Apply energy conservation to predict motion outcomes</span>
            </li>
          </ul>
        </div>

        {/* Scenario Guide */}
        <div className="mt-8 bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">📚 Scenario Guide</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">🎯 Pendulum</h3>
              <p className="text-sm text-purple-800">
                Watch energy oscillate between maximum potential (at peaks) and maximum kinetic (at bottom). 
                Perfect demonstration of PE ↔ KE transformation.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">⬇️ Free Fall</h3>
              <p className="text-sm text-purple-800">
                Observe gravitational PE converting entirely to KE as the object falls. 
                After bouncing, energy gradually dissipates.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">Ramp</h3>
              <p className="text-sm text-purple-800">
                See how PE converts to KE as the ball rolls down the incline. 
                The angle affects acceleration but not final energy.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">🔄 Spring</h3>
              <p className="text-sm text-purple-800">
                Complex three-way energy exchange: gravitational PE, kinetic energy, and elastic spring energy all interact.
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-yellow-900 mb-4">💡 Experimentation Tips</h2>
          <ul className="space-y-2 text-yellow-800">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Watch the Energy Bars:</strong> The sum of all energy bars should stay constant (when damping = 100%)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Adjust Mass:</strong> Heavier objects have more total energy for the same height/speed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Change Gravity:</strong> Try different gravitational strengths (Moon: 1.6 m/s², Earth: 9.8 m/s², Jupiter: 24.8 m/s²)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Damping Effect:</strong> Set damping below 100% to see energy gradually lost to friction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Compare Scenarios:</strong> Notice how the same initial energy manifests differently in each scenario</span>
            </li>
          </ul>
        </div>

        {/* Real World Applications */}
        <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-green-900 mb-4">🌍 Real-World Applications</h2>
          <div className="grid md:grid-cols-2 gap-4 text-green-800">
            <div>
              <h3 className="font-semibold mb-2">Roller Coasters</h3>
              <p className="text-sm">Designed using energy conservation: PE at the top converts to KE at the bottom, creating thrilling speeds.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Hydroelectric Dams</h3>
              <p className="text-sm">Water's gravitational PE is converted to electrical energy through turbines.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Pendulum Clocks</h3>
              <p className="text-sm">Rely on consistent energy oscillation between PE and KE for accurate timekeeping.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Regenerative Braking</h3>
              <p className="text-sm">Electric vehicles convert kinetic energy back to stored electrical energy when braking.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bungee Jumping</h3>
              <p className="text-sm">Gravitational PE converts to elastic PE in the cord, then back again.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Satellite Orbits</h3>
              <p className="text-sm">Satellites constantly exchange KE and PE as they orbit Earth.</p>
            </div>
          </div>
        </div>

        {/* Energy Equations Reference */}
        <div className="mt-8 bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Energy Equations Reference</h2>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded border border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-1">Total Mechanical Energy</h3>
              <p className="font-mono text-sm">E = KE + PE (+ SE for springs)</p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-1">Kinetic Energy</h3>
              <p className="font-mono text-sm">KE = ½mv² where m = mass, v = velocity</p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-1">Gravitational Potential Energy</h3>
              <p className="font-mono text-sm">PE = mgh where g = gravity, h = height</p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-1">Spring Potential Energy</h3>
              <p className="font-mono text-sm">SE = ½kx² where k = spring constant, x = compression</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            href="/physics-visualizer/simulations/elastic-collisions"
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors border-2 border-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Elastic Collisions</span>
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
