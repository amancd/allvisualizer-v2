import type { Metadata } from "next";
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Thermodynamics - Physics Visualizer | AllVisualizer',
    description: 'Interactive simulations of thermodynamics: ideal gas law, heat transfer, entropy, and thermodynamic cycles.',
    keywords: ['thermodynamics', 'heat transfer', 'gas laws', 'entropy', 'temperature', 'physics simulation'],
  };
}

export default function ThermodynamicsPage() {
  const problems = [
    {
      title: 'Ideal Gas Law',
      description: 'Explore the relationship between pressure, volume, and temperature in gases',
      difficulty: 'Beginner',
      slug: 'ideal-gas-law',
      topics: ['PV=nRT', 'Pressure', 'Volume', 'Temperature'],
      comingSoon: false
    },
    {
      title: 'Heat Transfer',
      description: 'Visualize conduction, convection, and radiation',
      difficulty: 'Intermediate',
      slug: 'heat-transfer',
      topics: ['Conduction', 'Convection', 'Radiation', 'Thermal Energy'],
      comingSoon: false
    },
    {
      title: 'Carnot Cycle',
      description: 'Understand the most efficient heat engine cycle',
      difficulty: 'Advanced',
      slug: 'carnot-cycle',
      topics: ['Heat Engine', 'Efficiency', 'PV Diagram', 'Reversible Process'],
      comingSoon: false
    },
    {
      title: 'Entropy & Second Law',
      description: 'Explore entropy and the direction of thermodynamic processes',
      difficulty: 'Advanced',
      slug: 'entropy',
      topics: ['Entropy', 'Second Law', 'Disorder', 'Irreversibility'],
      comingSoon: true
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
            <li className="text-gray-900 font-medium">Thermodynamics</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🔥</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Thermodynamics
            </h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Explore heat, temperature, and energy transfer. Learn about gas laws, 
            thermodynamic processes, heat engines, and the laws of thermodynamics through interactive simulations.
          </p>
        </header>

        {/* Key Concepts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Concepts</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Laws of Thermodynamics</h3>
              <p className="text-sm text-gray-700">
                Four fundamental laws governing energy, heat, and entropy in physical systems.
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Ideal Gas Law</h3>
              <p className="text-sm text-gray-700">
                PV = nRT describes the behavior of gases under various conditions of pressure, volume, and temperature.
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Heat Transfer</h3>
              <p className="text-sm text-gray-700">
                Energy transfer through conduction, convection, and radiation mechanisms.
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Entropy</h3>
              <p className="text-sm text-gray-700">
                Measure of disorder and the irreversibility of natural processes.
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
                      className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded"
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
