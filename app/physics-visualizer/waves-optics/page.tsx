import type { Metadata } from "next";
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Waves & Optics - Physics Visualizer | AllVisualizer',
    description: 'Interactive simulations of wave physics and optics: interference, diffraction, refraction, and the double-slit experiment.',
    keywords: ['waves', 'optics', 'interference', 'diffraction', 'refraction', 'double slit', 'physics simulation'],
  };
}

export default function WavesOpticsPage() {
  const problems = [
    {
      title: 'Wave Interference',
      description: 'Explore constructive and destructive interference patterns from two wave sources',
      difficulty: 'Beginner',
      topics: ['Superposition', 'Phase Difference', 'Amplitude', 'Frequency'],
      slug: 'wave-interference',
      comingSoon: false,
      estimatedTime: '15 min'
    },
    {
      title: 'Double-Slit Experiment',
      description: 'Observe the classic interference pattern that demonstrates wave nature of light',
      difficulty: 'Intermediate',
      topics: ['Interference', 'Diffraction', 'Wavelength', 'Path Difference'],
      slug: 'double-slit',
      comingSoon: false,
      estimatedTime: '20 min'
    },
    {
      title: 'Reflection & Refraction',
      description: 'Understand how light behaves at interfaces between different media',
      difficulty: 'Beginner',
      topics: ['Snell\'s Law', 'Total Internal Reflection', 'Critical Angle', 'Refractive Index'],
      slug: 'reflection-refraction',
      comingSoon: false,
      estimatedTime: '15 min'
    },
    {
      title: 'Standing Waves',
      description: 'Visualize standing wave patterns in strings and pipes',
      difficulty: 'Intermediate',
      topics: ['Nodes', 'Antinodes', 'Harmonics', 'Resonance'],
      slug: 'standing-waves',
      comingSoon: false,
      estimatedTime: '20 min'
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
            <li className="text-gray-900 font-medium">Waves & Optics</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🌊</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Waves & Optics
            </h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Explore the fascinating world of wave physics and optics. Learn about wave interference, diffraction, 
            refraction, and the wave nature of light through interactive simulations.
          </p>
        </header>

        {/* Key Concepts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Concepts</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Wave Interference</h3>
              <p className="text-sm text-gray-700">
                Superposition of waves creates constructive and destructive interference patterns.
              </p>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Refraction</h3>
              <p className="text-sm text-gray-700">
                Light bends when passing between media with different refractive indices.
              </p>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Diffraction</h3>
              <p className="text-sm text-gray-700">
                Waves bend around obstacles and spread through openings.
              </p>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Wave-Particle Duality</h3>
              <p className="text-sm text-gray-700">
                Light exhibits both wave and particle properties in quantum mechanics.
              </p>
            </div>
          </div>
        </section>

        {/* Problems Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Simulations</h2>
          <div className="space-y-4">
            {problems.map((simulation) => (
              <div
                key={simulation.slug}
                className={`border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow ${
                  simulation.comingSoon ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{simulation.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded shrink-0 ${
                    simulation.difficulty === 'Beginner' 
                      ? 'bg-green-100 text-green-700'
                      : simulation.difficulty === 'Intermediate'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {simulation.difficulty}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">
                  {simulation.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {simulation.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {!simulation.comingSoon ? (
                  <Link
                    href={`/physics-visualizer/simulations/${simulation.slug}`}
                    className="inline-block w-full px-4 py-2 bg-transparent text-black border border-black text-center rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Start Simulation →
                  </Link>
                ) : (
                  <div className="px-4 py-2 bg-gray-100 text-gray-500 text-center rounded-lg">
                    Coming Soon
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
