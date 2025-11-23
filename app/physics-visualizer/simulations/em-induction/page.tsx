import type { Metadata } from "next";
import EMInductionVisualizer from './EMInductionVisualizer';
import GiscusComments from "@/components/ui/GiscusComments";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Electromagnetic Induction - Physics Visualizer | AllVisualizer",
  description: "Visualize Faraday's law and Lenz's law with moving magnets and coils. Interactive simulation showing induced EMF and current.",
  keywords: ["electromagnetic induction", "Faraday's law", "Lenz's law", "induced EMF", "magnetic flux", "physics simulation"],
  openGraph: {
    title: "Electromagnetic Induction Visualizer - Interactive Physics",
    description: "Master electromagnetic induction through interactive visualization",
  },
};

export default function EMInductionPage() {
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
          <span className="text-gray-900">EM Induction</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Electromagnetic Induction
            </h1>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
              Advanced
            </span>
          </div>
          <p className="text-lg text-gray-600">
            Explore Faraday's law and Lenz's law by moving a magnet through a coil of wire.
          </p>
        </header>

        {/* Theory */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Electromagnetic Induction Theory</h2>
          
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Electromagnetic induction</strong> is the production of an electromotive force (EMF) across 
              a conductor when it is exposed to a changing magnetic field. This fundamental principle is the basis 
              for generators, transformers, and many other electrical devices.
            </p>

            <div className="bg-white border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Faraday's Law:</h3>
              <div className="font-mono text-sm bg-gray-100 p-3 rounded mb-2">
                EMF = -N × dΦ/dt
              </div>
              <div className="text-sm space-y-1">
                <p><strong>EMF</strong> = Induced electromotive force (V)</p>
                <p><strong>N</strong> = Number of turns in the coil</p>
                <p><strong>Φ</strong> = Magnetic flux through the coil (Wb)</p>
                <p><strong>dΦ/dt</strong> = Rate of change of magnetic flux</p>
              </div>
              <p className="text-sm mt-2">
                The negative sign represents <strong>Lenz's Law</strong>: the induced current opposes the change in flux.
              </p>
            </div>

            <div className="bg-white border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Magnetic Flux:</h3>
              <div className="font-mono text-sm bg-gray-100 p-3 rounded mb-2">
                Φ = B × A × cos(θ)
              </div>
              <div className="text-sm space-y-1">
                <p><strong>B</strong> = Magnetic field strength (T)</p>
                <p><strong>A</strong> = Area of the coil (m²)</p>
                <p><strong>θ</strong> = Angle between field and normal to coil</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Key Principles:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>EMF is induced only when magnetic flux is <em>changing</em></li>
                <li>Faster motion creates larger induced EMF and current</li>
                <li>More coil turns multiply the induced EMF (N times larger)</li>
                <li>Induced current creates its own magnetic field opposing the change</li>
                <li>Moving magnet toward coil induces current in one direction</li>
                <li>Moving magnet away induces current in opposite direction</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Visualizer */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Interactive Simulation</h2>
          <EMInductionVisualizer />
        </section>

        {/* Key Concepts */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Key Concepts</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Lenz's Law:</h3>
              <p className="text-gray-700 text-sm">
                The direction of induced current is such that it opposes the change that caused it. If a north 
                pole approaches the coil, the induced current creates a north pole facing the magnet to repel it. 
                This is nature's way of conserving energy.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Flux Linkage:</h3>
              <p className="text-gray-700 text-sm">
                Total flux linkage = N × Φ, where N is the number of turns. Each turn contributes to the total 
                induced EMF, which is why transformers and generators use many coil turns to increase voltage.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Rate of Change Matters:</h3>
              <p className="text-gray-700 text-sm">
                It's not the magnetic field strength that matters, but how fast it changes. A weak field changing 
                rapidly can induce more EMF than a strong field changing slowly. This is why generators need to 
                spin quickly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Energy Conservation:</h3>
              <p className="text-gray-700 text-sm">
                When current is induced, you feel resistance when moving the magnet. The mechanical work you do 
                moving the magnet converts to electrical energy. This is how generators work - mechanical motion 
                becomes electricity.
              </p>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Real-World Applications</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Electric Generators</h3>
              <p className="text-sm text-gray-600">
                Power plants use rotating magnets in coils to convert mechanical energy (from turbines) into electricity
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Transformers</h3>
              <p className="text-sm text-gray-600">
                Change AC voltage levels using mutual induction between two coils sharing magnetic flux
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Induction Cooktops</h3>
              <p className="text-sm text-gray-600">
                Rapidly changing magnetic fields induce currents in metal pots, heating them directly
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Electric Guitar Pickups</h3>
              <p className="text-sm text-gray-600">
                Vibrating metal strings change magnetic flux through coils, creating electrical signals
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Wireless Charging</h3>
              <p className="text-sm text-gray-600">
                Alternating current in transmitter coil induces current in receiver coil to charge devices
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Metal Detectors</h3>
              <p className="text-sm text-gray-600">
                Detect metal objects by measuring changes in induced currents caused by nearby conductors
              </p>
            </div>
          </div>
        </section>

        {/* Discussion */}
        <section className="mb-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Discussion</h2>
          <p className="text-gray-600 mb-6">
            Have questions about electromagnetic induction? Join the conversation below.
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
