import type { Metadata } from "next";
import Link from 'next/link';
import NewtonsLawsVisualizer from './NewtonsLawsVisualizer';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Newton's Laws - Physics Visualizer | AllVisualizer",
    description: "Interactive visualization of Newton's three laws of motion. Explore force, mass, acceleration, friction, and the fundamental principles of classical mechanics.",
    keywords: ["Newton's laws", "F=ma", "force", "mass", "acceleration", "friction", "classical mechanics", "physics simulation"],
  };
}

export default function NewtonsLawsPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-indigo-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/physics-visualizer" className="hover:text-indigo-600">Physics Visualizer</Link></li>
            <li>/</li>
            <li><Link href="/physics-visualizer/mechanics" className="hover:text-indigo-600">Classical Mechanics</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Newton's Laws</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⚖️</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Newton's Laws of Motion
            </h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
            Explore the fundamental laws that govern motion and forces. Visualize how force, 
            mass, and acceleration interact through Newton's revolutionary principles.
          </p>
        </header>

        {/* Visualizer */}
        <NewtonsLawsVisualizer />

        {/* Educational Content */}
        <div className="mt-12 space-y-8">
          {/* Understanding Section */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Newton's Laws</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-5 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">1️⃣</span>
                  First Law - Law of Inertia
                </h3>
                <p className="text-gray-700 mb-3">
                  An object at rest stays at rest, and an object in motion stays in motion with constant velocity, 
                  unless acted upon by a net external force.
                </p>
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="text-sm text-gray-700">
                    <strong>Example:</strong> A book on a table remains stationary until you push it. 
                    A hockey puck on ice keeps sliding until friction stops it.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5 border border-green-100">
                <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">2️⃣</span>
                  Second Law - F = ma
                </h3>
                <p className="text-gray-700 mb-3">
                  The acceleration of an object is directly proportional to the net force acting on it and 
                  inversely proportional to its mass.
                </p>
                <div className="bg-green-50 p-3 rounded border border-green-200 space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Formula:</strong> F<sub>net</sub> = m × a
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Example:</strong> Pushing a shopping cart - the harder you push (more force), 
                    the faster it accelerates. A heavier cart (more mass) accelerates less with the same force.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5 border border-purple-100">
                <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">3️⃣</span>
                  Third Law - Action-Reaction
                </h3>
                <p className="text-gray-700 mb-3">
                  For every action, there is an equal and opposite reaction. Forces always occur in pairs.
                </p>
                <div className="bg-purple-50 p-3 rounded border border-purple-200">
                  <p className="text-sm text-gray-700">
                    <strong>Example:</strong> When you jump, you push down on the ground (action), 
                    and the ground pushes you up (reaction). When a rocket expels gas downward, 
                    the gas pushes the rocket upward.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Demo Guide */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use This Visualizer</h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold">1.</span>
                <p>Adjust the mass of the object to see how it affects acceleration (Second Law)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold">2.</span>
                <p>Change the applied force to observe different accelerations</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold">3.</span>
                <p>Modify friction coefficient to see how resistance affects motion</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold">4.</span>
                <p>Watch the force arrows (vectors) showing applied force, friction, weight, and normal force</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold">5.</span>
                <p>Observe how net force determines acceleration: F<sub>net</sub> = F<sub>applied</sub> - f<sub>friction</sub></p>
              </div>
            </div>
          </section>

          {/* Real World Applications */}
          <section className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Real-World Applications</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <h3 className="font-semibold text-green-900 mb-2">🚗 Vehicle Safety</h3>
                <p className="text-sm text-gray-700">
                  Seatbelts and airbags work based on the first law - your body wants to keep moving 
                  when the car stops suddenly.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <h3 className="font-semibold text-green-900 mb-2">🚀 Rocket Propulsion</h3>
                <p className="text-sm text-gray-700">
                  Rockets use the third law - expelling gas backward creates a reaction force that 
                  propels the rocket forward.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <h3 className="font-semibold text-green-900 mb-2">⚽ Sports</h3>
                <p className="text-sm text-gray-700">
                  Kicking a soccer ball demonstrates the second law - the force you apply determines 
                  how fast the ball accelerates.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <h3 className="font-semibold text-green-900 mb-2">🛹 Friction Control</h3>
                <p className="text-sm text-gray-700">
                  Ice skating and car brakes both manipulate friction - low friction for gliding, 
                  high friction for stopping.
                </p>
              </div>
            </div>
          </section>

          {/* Practice Problems */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Practice Problems</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Problem 1: Calculate Acceleration</h3>
                <p className="text-sm text-gray-700 mb-2">
                  A 5 kg box is pushed with a force of 20 N on a frictionless surface. What is its acceleration?
                </p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium">
                    Show Solution
                  </summary>
                  <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                    <p className="mb-2">Using F = ma:</p>
                    <p className="mb-1">20 N = 5 kg × a</p>
                    <p className="mb-1">a = 20 N / 5 kg</p>
                    <p className="font-semibold text-green-600">a = 4 m/s²</p>
                  </div>
                </details>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Problem 2: Net Force with Friction</h3>
                <p className="text-sm text-gray-700 mb-2">
                  A 10 kg object is pushed with 50 N. Friction force is 20 N. What is the net force and acceleration?
                </p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium">
                    Show Solution
                  </summary>
                  <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                    <p className="mb-2">Net Force = Applied Force - Friction</p>
                    <p className="mb-1">F<sub>net</sub> = 50 N - 20 N = 30 N</p>
                    <p className="mb-2">Using F = ma:</p>
                    <p className="mb-1">30 N = 10 kg × a</p>
                    <p className="font-semibold text-green-600">a = 3 m/s²</p>
                  </div>
                </details>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
