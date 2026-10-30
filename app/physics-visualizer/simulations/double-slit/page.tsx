import type { Metadata } from "next";
import Link from 'next/link';
import DoubleSlitVisualizer from './DoubleSlitVisualizer';
import GiscusComments from '@/components/ui/GiscusComments';

export const metadata: Metadata = {
  title: "Double-Slit Experiment - Waves & Optics | AllVisualizer",
  description: "Experience the famous double-slit experiment that demonstrates wave-particle duality. Visualize interference patterns, diffraction, and the wave nature of light.",
  keywords: ["double slit experiment", "wave particle duality", "interference pattern", "diffraction", "quantum mechanics", "Young's experiment"],
};

export default function DoubleSlitPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/physics-visualizer" className="hover:text-gray-900">Physics</Link>
          <span>/</span>
          <Link href="/physics-visualizer/waves-optics" className="hover:text-gray-900">Waves & Optics</Link>
          <span>/</span>
          <span className="text-gray-900">Double-Slit Experiment</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Double-Slit Experiment
            </h1>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
              Intermediate
            </span>
          </div>
          <p className="text-lg text-gray-600">
            One of the most famous experiments in physics, demonstrating the wave nature of light.
          </p>
        </header>

        {/* Visualizer */}
        <DoubleSlitVisualizer />

        {/* Theory Section */}
        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory</h2>
          
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-teal-900 mb-3">Young's Double-Slit Experiment</h3>
            <p className="text-teal-800 mb-4">
              When coherent light passes through two narrow slits, it creates an interference pattern of bright 
              and dark fringes on a screen. This demonstrates that light behaves as a wave.
            </p>
            <div className="bg-white rounded p-4 font-mono text-sm space-y-2">
              <p><strong>Path Difference:</strong> δ = d sin(θ)</p>
              <p><strong>Bright Fringes:</strong> δ = nλ (n = 0, ±1, ±2, ...)</p>
              <p><strong>Dark Fringes:</strong> δ = (n + ½)λ</p>
              <p><strong>Fringe Spacing:</strong> Δy = λL / d</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Concepts</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Coherent Sources</h4>
              <p className="text-sm text-gray-700">
                The two slits act as coherent sources - they maintain a constant phase relationship 
                because they come from the same light source.
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Interference Pattern</h4>
              <p className="text-sm text-gray-700">
                Alternating bright and dark fringes appear due to constructive and destructive interference 
                of waves from the two slits.
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Path Difference</h4>
              <p className="text-sm text-gray-700">
                The difference in distance traveled by light from each slit determines whether 
                interference is constructive or destructive.
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Central Maximum</h4>
              <p className="text-sm text-gray-700">
                The brightest fringe at the center where path difference is zero and waves arrive in phase.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Parameters Explained</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
            <li><strong>Wavelength (λ):</strong> Smaller wavelengths (blue) create tighter fringe spacing</li>
            <li><strong>Slit Separation (d):</strong> Larger separation creates tighter fringes</li>
            <li><strong>Screen Distance (L):</strong> Greater distance spreads out the pattern</li>
            <li><strong>Slit Width:</strong> Affects the single-slit diffraction envelope</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Historical Significance</h3>
          <p className="text-gray-700 mb-4">
            Thomas Young performed this experiment in 1801, providing compelling evidence for the wave 
            theory of light. It challenged Newton's particle theory and revolutionized our understanding 
            of light. Later, the experiment would play a crucial role in quantum mechanics by demonstrating 
            wave-particle duality.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Applications</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Wavelength measurement</strong> - Precisely determine wavelength of light sources</li>
            <li><strong>Optical testing</strong> - Check quality of lenses and mirrors using interferometry</li>
            <li><strong>Spectroscopy</strong> - Diffraction gratings (many slits) separate light by wavelength</li>
            <li><strong>Holography</strong> - Creates 3D images using interference patterns</li>
            <li><strong>Quantum mechanics</strong> - Demonstrates wave-particle duality with electrons and photons</li>
            <li><strong>Laser characterization</strong> - Measure coherence length and beam quality</li>
          </ul>
        </div>

        {/* Discussion Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Discussion</h2>
          <GiscusComments />
        </div>
      </div>
    </div>
  );
}
