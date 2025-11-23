import type { Metadata } from "next";
import ElectricFieldLinesVisualizer from './ElectricFieldLinesVisualizer';
import GiscusComments from "@/components/ui/GiscusComments";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Electric Field Lines - Physics Visualizer | AllVisualizer",
  description: "Visualize electric fields from point charges. Interactive simulation with field lines, vectors, and Coulomb's law.",
  keywords: ["electric field", "Coulomb's law", "point charges", "field lines", "electromagnetism", "physics simulation"],
  openGraph: {
    title: "Electric Field Lines Visualizer - Interactive Physics",
    description: "Master electric fields through interactive visualization",
  },
};

export default function ElectricFieldLinesPage() {
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
          <span className="text-gray-900">Electric Field Lines</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Electric Field Lines
            </h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
              Beginner
            </span>
          </div>
          <p className="text-lg text-gray-600">
            Visualize electric fields created by point charges using field lines and vectors.
          </p>
        </header>

        {/* Theory */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Electric Field Theory</h2>
          
          <div className="space-y-4 text-gray-700">
            <p>
              An <strong>electric field</strong> is a region around a charged particle where other charges experience a force. 
              The field is represented by field lines that point in the direction a positive test charge would move.
            </p>

            <div className="bg-white border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Coulomb's Law:</h3>
              <div className="font-mono text-sm bg-gray-100 p-3 rounded">
                E = k × q / r²
              </div>
              <div className="mt-2 text-sm space-y-1">
                <p><strong>E</strong> = Electric field magnitude (N/C)</p>
                <p><strong>k</strong> = Coulomb's constant ≈ 8.99 × 10⁹ N⋅m²/C²</p>
                <p><strong>q</strong> = Source charge (C)</p>
                <p><strong>r</strong> = Distance from charge (m)</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Field Line Properties:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Field lines originate from positive charges and terminate at negative charges</li>
                <li>The density of lines indicates field strength</li>
                <li>Field lines never cross each other</li>
                <li>Lines are perpendicular to the surface of conductors</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Visualizer */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Interactive Simulation</h2>
          <ElectricFieldLinesVisualizer />
        </section>

        {/* Key Concepts */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Key Concepts</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Superposition Principle:</h3>
              <p className="text-gray-700 text-sm">
                The total electric field from multiple charges is the vector sum of individual fields. 
                Each charge contributes independently to the total field at any point.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Field Direction:</h3>
              <p className="text-gray-700 text-sm">
                The electric field points <strong>away</strong> from positive charges and <strong>toward</strong> negative charges. 
                This is the direction of force on a positive test charge.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Inverse Square Law:</h3>
              <p className="text-gray-700 text-sm">
                Electric field strength decreases with the square of distance. Doubling the distance reduces 
                the field to 1/4 of its original strength.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Common Configurations:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li><strong>Single charge:</strong> Radial field lines (spherical symmetry)</li>
                <li><strong>Dipole:</strong> +/- charges create characteristic curved pattern</li>
                <li><strong>Like charges:</strong> Field lines repel from each other</li>
                <li><strong>Opposite charges:</strong> Field lines connect the charges</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Real-World Applications</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Capacitors</h3>
              <p className="text-sm text-gray-600">
                Energy storage devices using electric fields between charged plates
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Particle Accelerators</h3>
              <p className="text-sm text-gray-600">
                Use strong electric fields to accelerate charged particles
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Lightning</h3>
              <p className="text-sm text-gray-600">
                Natural discharge when electric field exceeds air's breakdown limit
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Electrostatic Precipitators</h3>
              <p className="text-sm text-gray-600">
                Remove particles from air using electric fields in pollution control
              </p>
            </div>
          </div>
        </section>

        {/* Discussion */}
        <section className="mb-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Discussion</h2>
          <p className="text-gray-600 mb-6">
            Have questions or want to discuss electric fields? Join the conversation below.
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
