import type { Metadata } from "next";
import Link from 'next/link';
import IdealGasLawVisualizer from './IdealGasLawVisualizer';
import GiscusComments from '@/components/ui/GiscusComments';

export const metadata: Metadata = {
  title: "Ideal Gas Law - Thermodynamics | AllVisualizer",
  description: "Explore the ideal gas law PV=nRT. Visualize the relationship between pressure, volume, temperature, and number of moles through interactive simulations.",
  keywords: ["ideal gas law", "PV=nRT", "pressure", "volume", "temperature", "gas laws", "thermodynamics"],
};

export default function IdealGasLawPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/physics-visualizer" className="hover:text-gray-900">Physics</Link>
          <span>/</span>
          <Link href="/physics-visualizer/thermodynamics" className="hover:text-gray-900">Thermodynamics</Link>
          <span>/</span>
          <span className="text-gray-900">Ideal Gas Law</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Ideal Gas Law
            </h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
              Beginner
            </span>
          </div>
          <p className="text-lg text-gray-600">
            Explore the fundamental relationship between pressure, volume, temperature, and amount of gas.
          </p>
        </header>

        {/* Visualizer */}
        <IdealGasLawVisualizer />

        {/* Theory Section */}
        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory</h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-900 mb-3">The Ideal Gas Law</h3>
            <p className="text-red-800 mb-4">
              The ideal gas law describes the behavior of ideal gases by relating four fundamental properties: 
              pressure (P), volume (V), temperature (T), and number of moles (n).
            </p>
            <div className="bg-white rounded p-4 font-mono text-sm space-y-2">
              <p><strong>Ideal Gas Law:</strong> PV = nRT</p>
              <p><strong>Where:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>P = Pressure (Pa or atm)</li>
                <li>V = Volume (m³ or L)</li>
                <li>n = Number of moles</li>
                <li>R = Gas constant (8.314 J/(mol·K) or 0.0821 L·atm/(mol·K))</li>
                <li>T = Temperature (Kelvin)</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Special Cases</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Boyle's Law (Isothermal)</h4>
              <p className="text-sm text-gray-700 mb-2">
                At constant temperature and amount: <strong>P₁V₁ = P₂V₂</strong>
              </p>
              <p className="text-xs text-gray-600">
                Pressure and volume are inversely proportional.
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Charles's Law (Isobaric)</h4>
              <p className="text-sm text-gray-700 mb-2">
                At constant pressure and amount: <strong>V₁/T₁ = V₂/T₂</strong>
              </p>
              <p className="text-xs text-gray-600">
                Volume and temperature are directly proportional.
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Gay-Lussac's Law (Isochoric)</h4>
              <p className="text-sm text-gray-700 mb-2">
                At constant volume and amount: <strong>P₁/T₁ = P₂/T₂</strong>
              </p>
              <p className="text-xs text-gray-600">
                Pressure and temperature are directly proportional.
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Avogadro's Law</h4>
              <p className="text-sm text-gray-700 mb-2">
                At constant temperature and pressure: <strong>V₁/n₁ = V₂/n₂</strong>
              </p>
              <p className="text-xs text-gray-600">
                Volume and moles are directly proportional.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Kinetic Molecular Theory</h3>
          <p className="text-gray-700 mb-4">
            The ideal gas law emerges from the kinetic molecular theory, which makes the following assumptions:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Gas particles are in constant, random motion</li>
            <li>Particles have negligible volume compared to container volume</li>
            <li>No intermolecular forces between particles</li>
            <li>Collisions between particles and walls are perfectly elastic</li>
            <li>Average kinetic energy is proportional to absolute temperature</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Real vs Ideal Gases</h3>
          <p className="text-gray-700 mb-4">
            Real gases deviate from ideal behavior under certain conditions:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>High pressure:</strong> Particle volume becomes significant</li>
            <li><strong>Low temperature:</strong> Intermolecular forces become important</li>
            <li><strong>Near liquefaction:</strong> Condensation effects appear</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Applications</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Weather balloons:</strong> Expansion with altitude (decreasing pressure)</li>
            <li><strong>Scuba diving:</strong> Air consumption and decompression calculations</li>
            <li><strong>Internal combustion engines:</strong> Compression and expansion of gases</li>
            <li><strong>Aerosol cans:</strong> Pressure-temperature relationships</li>
            <li><strong>Hot air balloons:</strong> Volume changes with temperature</li>
            <li><strong>Tire pressure:</strong> Temperature effects on pressure</li>
            <li><strong>Breathing:</strong> Lung volume and pressure changes</li>
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
