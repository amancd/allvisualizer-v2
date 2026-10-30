import type { Metadata } from "next";
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Settings, Zap, Waves, Flame, Microscope, Activity, Target, Lightbulb, Rocket, Sparkles, Gamepad2, LineChart, Calculator } from 'lucide-react';

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
      icon: <Settings className="w-6 h-6" />,
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
      icon: <Zap className="w-6 h-6" />,
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
      icon: <Waves className="w-6 h-6" />,
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
      icon: <Flame className="w-6 h-6" />,
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
      icon: <Microscope className="w-6 h-6" />,
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
      icon: <Activity className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-500',
      topics: ['SHM', 'Pendulum', 'Springs', 'Resonance'],
      slug: 'oscillations',
      isAvailable: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 hero-surface border-b border-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-ink leading-tight tracking-tight">
              Physics Visualizer
            </h1>
            
            <p className="text-xl text-ink-muted leading-relaxed">
              Master physics concepts through interactive visualizations. Watch simulations, experiment with parameters, and understand the laws that govern our universe.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/physics-visualizer/mechanics">
                <Button size="lg" rightIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                }>
                  Start Learning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-20 bg-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-ink mb-3 tracking-tight">
              Browse Topics
            </h2>
            <p className="text-lg text-ink-muted">
              Explore physics concepts organized by category
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
          {categories.map((category, index) => {
            const CardContent = (
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-gray-700">{category.icon}</div>
                    <h3 className="text-lg font-semibold text-ink group-hover:text-brand-700">
                      {category.title}
                    </h3>
                  </div>
                  {category.isAvailable ? (
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-brand-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-200 text-ink-muted rounded text-xs font-medium flex-shrink-0">
                      Coming Soon
                    </span>
                  )}
                </div>

                <p className="text-ink-muted text-sm mb-3">
                  {category.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {category.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-gray-100 text-ink-muted rounded text-xs"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {category.isAvailable && category.problems && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-ink font-medium">
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
                <div className="group p-6 bg-white border border-line rounded-lg hover:border-brand-300 hover:shadow-card-hover transition-all shadow-card">
                  {CardContent}
                </div>
              </Link>
            ) : (
              <div key={index} className="p-6 bg-white border border-line rounded-lg opacity-60 shadow-card">
                {CardContent}
              </div>
            );
          })}
        </div>
        </div>
      </section>

      {/* Why Physics Section */}
      <section className="py-16 md:py-20 border-t border-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-ink mb-3 tracking-tight">
              Why Study Physics?
            </h2>
            <p className="text-lg text-ink-muted">
              Understand the fundamental laws that govern our universe
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-1">Universal Laws</h3>
                <p className="text-sm text-ink-muted">
                  Understand the fundamental principles that govern everything from atoms to galaxies
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-1">Problem Solving</h3>
                <p className="text-sm text-ink-muted">
                  Develop analytical thinking and mathematical modeling skills
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-cyan-700" />
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-1">Technology</h3>
                <p className="text-sm text-ink-muted">
                  Foundation for engineering, electronics, computing, and modern innovation
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-1">Curiosity</h3>
                <p className="text-sm text-ink-muted">
                  Satisfy your curiosity about how the universe works at every scale
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 bg-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-ink mb-3 tracking-tight">
              Learning Features
            </h2>
            <p className="text-lg text-ink-muted">
              Everything you need to master physics concepts
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white border border-line rounded-lg p-6 shadow-card">
              <div className="mb-3">
                <Gamepad2 className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="font-semibold text-ink mb-2">Interactive Simulations</h3>
              <p className="text-sm text-ink-muted">
                Real-time physics engines with adjustable parameters
              </p>
            </div>
            
            <div className="bg-white border border-line rounded-lg p-6 shadow-card">
              <div className="mb-3">
                <LineChart className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="font-semibold text-ink mb-2">Live Graphs</h3>
              <p className="text-sm text-ink-muted">
                Visualize position, velocity, acceleration, and energy
              </p>
            </div>
            
            <div className="bg-white border border-line rounded-lg p-6 shadow-card">
              <div className="mb-3">
                <Calculator className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="font-semibold text-ink mb-2">Step-by-Step Math</h3>
              <p className="text-sm text-ink-muted">
                See equations and calculations behind each simulation
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
