import type { Metadata } from "next";
import MagneticFieldVisualizer from './MagneticFieldVisualizer';
import GiscusComments from "@/components/ui/GiscusComments";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Magnetic Field Visualization - Physics Visualizer | AllVisualizer",
  description: "Visualize magnetic fields from current-carrying wires, loops, and magnetic dipoles. Interactive simulation with field lines and vectors.",
  keywords: ["magnetic field", "Biot-Savart law", "current loops", "magnetic dipole", "electromagnetism", "physics simulation"],
  openGraph: {
    title: "Magnetic Field Visualizer - Interactive Physics",
    description: "Master magnetic fields through interactive visualization",
  },
};

export default function MagneticFieldPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/physics-visualizer" className="hover:text-gray-900">Physics</Link>
          <span>/</span>
          <Link href="/physics-visualizer/electromagnetism" className="hover:text-gray-900">Electromagnetism</Link>
          <span>/</span>
          <span className="text-gray-900">Magnetic Field</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Magnetic Field Visualization
            </h1>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
              Intermediate
            </span>
          </div>
          <p className="text-lg text-gray-600">
            Visualize magnetic fields created by current-carrying wires, loops, and magnetic dipoles.
          </p>
        </header>

        {/* Theory */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Magnetic Field Theory</h2>
          
          <div className="space-y-4 text-gray-700">
            <p>
              A <strong>magnetic field</strong> is created by moving electric charges (currents) or magnetic materials. 
              Unlike electric fields, magnetic field lines form closed loops and have no isolated poles.
            </p>

            <div className="bg-white border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Biot-Savart Law (Current Element):</h3>
              <div className="font-mono text-sm bg-gray-100 p-3 rounded">
                dB = (μ₀/4π) × (I dl × r̂) / r²
              </div>
              <div className="mt-2 text-sm space-y-1">
                <p><strong>dB</strong> = Magnetic field element (T)</p>
                <p><strong>μ₀</strong> = Permeability of free space ≈ 4π × 10⁻⁷ T⋅m/A</p>
                <p><strong>I</strong> = Current (A)</p>
                <p><strong>dl</strong> = Length element of wire (m)</p>
                <p><strong>r</strong> = Distance from element (m)</p>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Straight Wire:</h3>
              <div className="font-mono text-sm bg-gray-100 p-3 rounded">
                B = (μ₀ I) / (2π r)
              </div>
              <p className="mt-2 text-sm">Circular field lines around the wire (right-hand rule)</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Magnetic Field Properties:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Magnetic field lines form closed loops (no magnetic monopoles)</li>
                <li>Field direction follows the right-hand rule for currents</li>
                <li>North and South poles always come in pairs</li>
                <li>Field lines are denser where the field is stronger</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Visualizer */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Interactive Simulation</h2>
          <MagneticFieldVisualizer />
        </section>

        {/* Key Concepts */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Key Concepts</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Right-Hand Rule:</h3>
              <p className="text-gray-700 text-sm">
                Point your right thumb in the direction of current flow. Your fingers curl in the direction 
                of the magnetic field lines around the wire.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Current Loop:</h3>
              <p className="text-gray-700 text-sm">
                A circular loop of current creates a magnetic dipole similar to a bar magnet. Field lines 
                emerge from one face (North) and enter the other (South).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Magnetic Dipole:</h3>
              <p className="text-gray-700 text-sm">
                A bar magnet or current loop creates a dipole field pattern. Field lines emerge from the 
                North pole and return to the South pole, forming closed loops.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Field Configurations:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li><strong>Straight wire:</strong> Concentric circular field lines</li>
                <li><strong>Current loop:</strong> Dipole pattern similar to bar magnet</li>
                <li><strong>Solenoid:</strong> Uniform field inside, dipole field outside</li>
                <li><strong>Bar magnet:</strong> Classic dipole with N and S poles</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Real-World Applications</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Electromagnets</h3>
              <p className="text-sm text-gray-600">
                Current-carrying coils create controllable magnetic fields for motors, generators, and MRI machines
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Electric Motors</h3>
              <p className="text-sm text-gray-600">
                Magnetic fields from coils interact with permanent magnets to create rotational motion
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Magnetic Levitation</h3>
              <p className="text-sm text-gray-600">
                Repulsive magnetic forces enable high-speed maglev trains and frictionless bearings
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Data Storage</h3>
              <p className="text-sm text-gray-600">
                Magnetic domains in hard drives store digital information using tiny magnetic fields
              </p>
            </div>
          </div>
        </section>

        {/* Discussion */}
        <section className="mb-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Discussion</h2>
          <p className="text-gray-600 mb-6">
            Have questions or want to discuss magnetic fields? Join the conversation below.
          </p>
          <GiscusComments />
        </section>

        {/* Back Link */}
        <div className="pt-8 border-t border-gray-200">
          <Link
            href="/physics-visualizer/electromagnetism"
            className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Electromagnetism
          </Link>
        </div>
      </div>
    </div>
  );
}
