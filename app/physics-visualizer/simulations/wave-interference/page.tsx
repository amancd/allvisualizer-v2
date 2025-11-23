import type { Metadata } from "next";
import Link from 'next/link';
import WaveInterferenceVisualizer from './WaveInterferenceVisualizer';
import GiscusComments from '@/components/ui/GiscusComments';

export const metadata: Metadata = {
  title: "Wave Interference - Waves & Optics | AllVisualizer",
  description: "Visualize constructive and destructive wave interference patterns. Learn about superposition, phase difference, and wave amplitude through interactive simulations.",
  keywords: ["wave interference", "superposition", "constructive interference", "destructive interference", "phase difference", "wave physics"],
};

export default function WaveInterferencePage() {
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
          <span className="text-gray-900">Wave Interference</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Wave Interference
            </h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
              Beginner
            </span>
          </div>
          <p className="text-lg text-gray-600">
            Explore how waves combine to create constructive and destructive interference patterns.
          </p>
        </header>

        {/* Visualizer */}
        <WaveInterferenceVisualizer />

        {/* Theory Section */}
        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory</h2>
          
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-teal-900 mb-3">Principle of Superposition</h3>
            <p className="text-teal-800 mb-4">
              When two or more waves overlap in space, the resulting displacement at any point is the 
              algebraic sum of the individual wave displacements.
            </p>
            <div className="bg-white rounded p-4 font-mono text-sm">
              <p className="mb-2">y<sub>total</sub> = y<sub>1</sub> + y<sub>2</sub></p>
              <p className="mb-2">y<sub>1</sub> = A<sub>1</sub> sin(k₁x - ω₁t + φ₁)</p>
              <p>y<sub>2</sub> = A<sub>2</sub> sin(k₂x - ω₂t + φ₂)</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Constructive Interference</h3>
          <p className="text-gray-700 mb-4">
            Occurs when two waves are <strong>in phase</strong> (phase difference = 0°, 360°, etc.). 
            The waves reinforce each other, creating a larger amplitude:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Maximum amplitude = A₁ + A₂</li>
            <li>Path difference = nλ (n = 0, 1, 2, ...)</li>
            <li>Phase difference = 2πn radians</li>
            <li>Bright fringes in interference patterns</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Destructive Interference</h3>
          <p className="text-gray-700 mb-4">
            Occurs when two waves are <strong>out of phase</strong> (phase difference = 180°, 540°, etc.). 
            The waves cancel each other:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Minimum amplitude = |A₁ - A₂|</li>
            <li>Path difference = (n + ½)λ (n = 0, 1, 2, ...)</li>
            <li>Phase difference = (2n + 1)π radians</li>
            <li>Dark fringes in interference patterns</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Parameters</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Wavelength (λ)</h4>
              <p className="text-sm text-gray-700">
                Distance between successive crests or troughs. Determines the spacing of interference patterns.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Frequency (f)</h4>
              <p className="text-sm text-gray-700">
                Number of wave cycles per second. Related to wavelength by v = fλ.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Amplitude (A)</h4>
              <p className="text-sm text-gray-700">
                Maximum displacement from equilibrium. Determines wave intensity.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Phase (φ)</h4>
              <p className="text-sm text-gray-700">
                Position within the wave cycle. Phase difference determines interference type.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-World Applications</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Noise-canceling headphones</strong> - Use destructive interference to reduce ambient noise</li>
            <li><strong>Thin film interference</strong> - Creates colors in soap bubbles and oil slicks</li>
            <li><strong>Radio astronomy</strong> - Interferometers combine signals for higher resolution</li>
            <li><strong>Holography</strong> - Records interference patterns to create 3D images</li>
            <li><strong>Seismic analysis</strong> - Understanding earthquake wave interactions</li>
            <li><strong>Acoustic engineering</strong> - Designing concert halls and reducing echoes</li>
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
