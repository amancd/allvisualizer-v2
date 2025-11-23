import type { Metadata } from "next";
import Link from 'next/link';
import StandingWavesVisualizer from './StandingWavesVisualizer';
import GiscusComments from '@/components/ui/GiscusComments';

export const metadata: Metadata = {
  title: "Standing Waves - Waves & Optics | AllVisualizer",
  description: "Visualize standing wave patterns in strings and pipes. Learn about nodes, antinodes, harmonics, and resonance through interactive simulations.",
  keywords: ["standing waves", "harmonics", "nodes", "antinodes", "resonance", "wave physics", "vibrations"],
};

export default function StandingWavesPage() {
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
          <span className="text-gray-900">Standing Waves</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Standing Waves
            </h1>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
              Intermediate
            </span>
          </div>
          <p className="text-lg text-gray-600">
            Explore standing wave patterns, nodes, antinodes, and harmonics in vibrating strings and air columns.
          </p>
        </header>

        {/* Visualizer */}
        <StandingWavesVisualizer />

        {/* Theory Section */}
        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory</h2>
          
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-teal-900 mb-3">Standing Waves Formation</h3>
            <p className="text-teal-800 mb-4">
              Standing waves form when two waves of the same frequency and amplitude traveling in opposite 
              directions interfere with each other, creating stationary patterns of nodes and antinodes.
            </p>
            <div className="bg-white rounded p-4 font-mono text-sm space-y-2">
              <p><strong>String (Both Ends Fixed):</strong> L = n(λ/2), n = 1, 2, 3, ...</p>
              <p><strong>Frequency:</strong> f<sub>n</sub> = nv / (2L)</p>
              <p><strong>Wavelength:</strong> λ<sub>n</sub> = 2L / n</p>
              <p><strong>Wave Speed:</strong> v = √(T/μ) for strings</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Nodes and Antinodes</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Nodes</h4>
              <p className="text-sm text-gray-700">
                Points of zero displacement where destructive interference always occurs. 
                The medium remains stationary at these points.
              </p>
              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                <li>• Always at fixed boundaries</li>
                <li>• Number of nodes = n + 1 for nth harmonic</li>
                <li>• Separated by λ/2</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Antinodes</h4>
              <p className="text-sm text-gray-700">
                Points of maximum displacement where constructive interference occurs. 
                The medium oscillates with maximum amplitude.
              </p>
              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                <li>• Located between nodes</li>
                <li>• Number of antinodes = n for nth harmonic</li>
                <li>• Separated by λ/2</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Harmonics</h3>
          <p className="text-gray-700 mb-4">
            Harmonics are the natural frequencies at which a system can vibrate. Each harmonic 
            corresponds to a specific standing wave pattern.
          </p>
          
          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 px-2">Harmonic</th>
                  <th className="text-left py-2 px-2">Nodes</th>
                  <th className="text-left py-2 px-2">Antinodes</th>
                  <th className="text-left py-2 px-2">Wavelength</th>
                  <th className="text-left py-2 px-2">Frequency</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-2">1st (Fundamental)</td>
                  <td className="py-2 px-2">2</td>
                  <td className="py-2 px-2">1</td>
                  <td className="py-2 px-2">2L</td>
                  <td className="py-2 px-2">f₁</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-2">2nd</td>
                  <td className="py-2 px-2">3</td>
                  <td className="py-2 px-2">2</td>
                  <td className="py-2 px-2">L</td>
                  <td className="py-2 px-2">2f₁</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-2">3rd</td>
                  <td className="py-2 px-2">4</td>
                  <td className="py-2 px-2">3</td>
                  <td className="py-2 px-2">2L/3</td>
                  <td className="py-2 px-2">3f₁</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">nth</td>
                  <td className="py-2 px-2">n+1</td>
                  <td className="py-2 px-2">n</td>
                  <td className="py-2 px-2">2L/n</td>
                  <td className="py-2 px-2">nf₁</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Boundary Conditions</h3>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>String (both ends fixed):</strong> Nodes at both ends, supports all harmonics</li>
            <li><strong>Pipe (both ends open):</strong> Antinodes at both ends, supports all harmonics</li>
            <li><strong>Pipe (one end closed):</strong> Node at closed end, antinode at open end, only odd harmonics</li>
            <li><strong>Free end:</strong> Antinode forms at free boundaries</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Resonance</h3>
          <p className="text-gray-700 mb-4">
            Resonance occurs when a system is driven at one of its natural frequencies (harmonics). 
            This causes a dramatic increase in amplitude as energy efficiently transfers to the system.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-World Applications</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Musical instruments:</strong> Guitar strings, violin, piano - all use standing waves to produce sound</li>
            <li><strong>Wind instruments:</strong> Flutes, organs, trumpets use standing waves in air columns</li>
            <li><strong>Microwave ovens:</strong> Standing electromagnetic waves heat food</li>
            <li><strong>Laser cavities:</strong> Standing light waves between mirrors</li>
            <li><strong>Radio antennas:</strong> Designed to resonate at specific frequencies</li>
            <li><strong>Earthquake engineering:</strong> Buildings can experience standing wave patterns during seismic events</li>
            <li><strong>Acoustic treatment:</strong> Understanding nodes helps in soundproofing and studio design</li>
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
