import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Modern Physics Simulations | Physics Visualizer',
    description: 'Interactive visualizations of modern physics concepts including quantum mechanics, special relativity, photoelectric effect, and the Bohr model.',
    keywords: [
      'modern physics',
      'quantum mechanics',
      'special relativity',
      'photoelectric effect',
      'Bohr model',
      'physics visualization',
      'quantum physics',
      'atomic physics',
      'Einstein',
      'Planck'
    ],
  };
}

export default function ModernPhysicsPage() {
  const simulations = [
    {
      title: 'Photoelectric Effect',
      description: 'Demonstrate how light ejects electrons from metal surfaces, proving the particle nature of light',
      href: '/physics-visualizer/simulations/photoelectric-effect',
      difficulty: 'Medium',
      topics: ['Quantum Mechanics', 'Photons', 'Work Function'],
    },
    {
      title: 'Bohr Model',
      description: 'Visualize electron orbits and energy levels in the hydrogen atom',
      href: '/physics-visualizer/simulations/bohr-model',
      difficulty: 'Medium',
      topics: ['Atomic Physics', 'Energy Levels', 'Spectral Lines'],
    },
    {
      title: 'Time Dilation',
      description: 'Explore how time passes differently for observers in relative motion',
      href: '/physics-visualizer/simulations/time-dilation',
      difficulty: 'Advanced',
      topics: ['Special Relativity', 'Lorentz Factor', 'Twin Paradox'],
    },
    {
      title: 'Wave-Particle Duality',
      description: 'Demonstrate the dual wave and particle nature of matter and light',
      href: '/physics-visualizer/simulations/wave-particle-duality',
      difficulty: 'Easy',
      topics: ['Quantum Mechanics', 'de Broglie', 'Uncertainty'],
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-ink-muted">
          <a href="/" className="hover:text-ink">Home</a>
          {' / '}
          <a href="/physics-visualizer" className="hover:text-ink">Physics Visualizer</a>
          {' / '}
          <span className="text-ink">Modern Physics</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">⚛️</span>
            <h1 className="text-4xl font-bold text-ink tracking-tight">Modern Physics</h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl">
            Explore the revolutionary discoveries of 20th-century physics that changed our understanding 
            of space, time, matter, and energy at fundamental scales.
          </p>
        </div>

        {/* Key Concepts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-ink mb-6">Key Concepts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl mb-2">🌊</div>
              <h3 className="font-semibold text-ink mb-1">Quantum Mechanics</h3>
              <p className="text-sm text-ink-muted">Wave-particle duality, quantization, and uncertainty principle</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-ink mb-1">Special Relativity</h3>
              <p className="text-sm text-ink-muted">Time dilation, length contraction, and mass-energy equivalence</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="font-semibold text-ink mb-1">Photoelectric Effect</h3>
              <p className="text-sm text-ink-muted">Photons, work function, and particle nature of light</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-ink mb-1">Atomic Structure</h3>
              <p className="text-sm text-ink-muted">Bohr model, energy levels, and spectral emission</p>
            </div>
          </div>
        </div>

        {/* Simulations Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-ink mb-6">Interactive Simulations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {simulations.map((sim, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-line p-6 hover:shadow-card-hover transition-shadow shadow-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-ink">{sim.title}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    sim.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    sim.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {sim.difficulty}
                  </span>
                </div>
                <p className="text-ink-muted mb-4">{sim.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {sim.topics.map((topic, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {topic}
                    </span>
                  ))}
                </div>
                {sim.comingSoon ? (
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                ) : (
                  <Link
                    href={sim.href}
                    className="block w-full px-4 py-2 bg-white border border-brand-200 text-brand-700 shadow-card text-center rounded-lg text-sm font-medium hover:bg-subtle transition-colors"
                  >
                    Explore Simulation →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div>
          <Link
            href="/physics-visualizer"
            className="inline-flex items-center text-ink-muted hover:text-ink"
          >
            ← Back to Physics Visualizer
          </Link>
        </div>
      </div>
    </div>
  );
}
