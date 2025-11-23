import type { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Physics Visualizer - Interactive Physics Simulations | AllVisualizer",
  description: "Master physics concepts through interactive visualizations. Learn Classical Mechanics, Electromagnetism, Waves, Thermodynamics, and Modern Physics with step-by-step simulations.",
  keywords: ["physics visualizer", "physics simulator", "mechanics", "electromagnetism", "waves", "thermodynamics", "quantum physics", "interactive physics"],
  openGraph: {
    title: "Physics Visualizer - Interactive Learning | AllVisualizer",
    description: "Master physics concepts through interactive visualizations",
  },
};

export default function PhysicsVisualizerPage() {
  const categories = [
    {
      title: 'Classical Mechanics',
      description: 'Motion, forces, energy, and momentum',
      icon: '⚙️',
      color: 'from-blue-500 to-cyan-500',
      topics: ['Projectile Motion', 'Newton\'s Laws', 'Collisions', 'Energy Conservation'],
      slug: 'mechanics',
      isAvailable: true,
      problems: [
        { title: 'Projectile Motion', slug: 'projectile-motion' }
      ]
    },
    {
      title: 'Electromagnetism',
      description: 'Electric and magnetic fields and forces',
      icon: '⚡',
      color: 'from-yellow-500 to-orange-500',
      topics: ['Electric Fields', 'Magnetic Fields', 'Circuits', 'EM Waves'],
      slug: 'electromagnetism',
      isAvailable: true,
      problems: [
        { title: 'Electric Field Lines', slug: 'electric-field-lines' }
      ]
    },
    {
      title: 'Waves & Optics',
      description: 'Wave behavior, interference, and light',
      icon: '🌊',
      color: 'from-teal-500 to-green-500',
      topics: ['Wave Motion', 'Interference', 'Diffraction', 'Refraction'],
      slug: 'waves-optics',
      isAvailable: true,
      problems: [
        { title: 'Wave Interference', slug: 'wave-interference' }
      ]
    },
    {
      title: 'Thermodynamics',
      description: 'Heat, temperature, and energy transfer',
      icon: '🔥',
      color: 'from-red-500 to-pink-500',
      topics: ['Heat Transfer', 'Gas Laws', 'Entropy', 'Engines'],
      slug: 'thermodynamics',
      isAvailable: true,
      problems: [
        { title: 'Ideal Gas Law', slug: 'ideal-gas-law' }
      ]
    },
    {
      title: 'Modern Physics',
      description: 'Relativity and quantum mechanics',
      icon: '⚛️',
      color: 'from-purple-500 to-indigo-500',
      topics: ['Relativity', 'Quantum', 'Atomic', 'Nuclear'],
      slug: 'modern-physics',
      isAvailable: true,
      problems: [
        { title: 'Photoelectric Effect', slug: 'photoelectric-effect' }
      ]
    },
    {
      title: 'Oscillations',
      description: 'Periodic motion and simple harmonic motion',
      icon: '〰️',
      color: 'from-pink-500 to-rose-500',
      topics: ['SHM', 'Pendulum', 'Springs', 'Resonance'],
      slug: 'oscillations',
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
              Physics Visualizer
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Master physics concepts through interactive visualizations. Watch simulations, experiment with parameters, and understand the laws that govern our universe.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/physics-visualizer/mechanics"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Start Learning
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="https://discord.gg/z4TgSrJQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Join Community
              </a>
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
              Explore physics concepts organized by category
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
          {categories.map((category, index) => {
            const CardContent = (
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
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

                <p className="text-gray-600 text-sm mb-3">
                  {category.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {category.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {category.isAvailable && category.problems && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-900 font-medium">
                      {category.problems.length} {category.problems.length === 1 ? 'simulation' : 'simulations'} available
                    </div>
                  </div>
                )}
              </div>
            );

            return category.isAvailable ? (
              <Link
                key={index}
                href={`/physics-visualizer/${category.slug}`}
              >
                <div className="group p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all">
                  {CardContent}
                </div>
              </Link>
            ) : (
              <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg opacity-60">
                {CardContent}
              </div>
            );
          })}
        </div>
        </div>
      </section>

      {/* Why Physics Section */}
      <section className="py-16 md:py-20 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why Study Physics?
            </h2>
            <p className="text-lg text-gray-600">
              Understand the fundamental laws that govern our universe
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xl">
                🎯
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Universal Laws</h3>
                <p className="text-sm text-gray-600">
                  Understand the fundamental principles that govern everything from atoms to galaxies
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xl">
                💡
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Problem Solving</h3>
                <p className="text-sm text-gray-600">
                  Develop analytical thinking and mathematical modeling skills
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center text-xl">
                🚀
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Technology</h3>
                <p className="text-sm text-gray-600">
                  Foundation for engineering, electronics, computing, and modern innovation
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xl">
                🌌
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Curiosity</h3>
                <p className="text-sm text-gray-600">
                  Satisfy your curiosity about how the universe works at every scale
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Learning Features
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to master physics concepts
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="font-semibold text-gray-900 mb-2">Interactive Simulations</h3>
              <p className="text-sm text-gray-600">
                Real-time physics engines with adjustable parameters
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Graphs</h3>
              <p className="text-sm text-gray-600">
                Visualize position, velocity, acceleration, and energy
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-3xl mb-3">🧮</div>
              <h3 className="font-semibold text-gray-900 mb-2">Step-by-Step Math</h3>
              <p className="text-sm text-gray-600">
                See equations and calculations behind each simulation
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
