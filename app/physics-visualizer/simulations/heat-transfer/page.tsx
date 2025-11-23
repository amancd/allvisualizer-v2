import type { Metadata } from "next";
import Link from 'next/link';
import HeatTransferVisualizer from './HeatTransferVisualizer';
import GiscusComments from '@/components/ui/GiscusComments';

export const metadata: Metadata = {
  title: "Heat Transfer - Thermodynamics | AllVisualizer",
  description: "Visualize the three modes of heat transfer: conduction, convection, and radiation. Understand thermal energy transfer mechanisms.",
  keywords: ["heat transfer", "conduction", "convection", "radiation", "thermal energy", "thermodynamics"],
};

export default function HeatTransferPage() {
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
          <span className="text-gray-900">Heat Transfer</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Heat Transfer
            </h1>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
              Intermediate
            </span>
          </div>
          <p className="text-lg text-gray-600">
            Explore the three mechanisms of heat transfer: conduction, convection, and radiation.
          </p>
        </header>

        {/* Visualizer */}
        <HeatTransferVisualizer />

        {/* Theory Section */}
        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory</h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-900 mb-3">Heat Transfer Fundamentals</h3>
            <p className="text-red-800 mb-4">
              Heat transfer is the movement of thermal energy from a region of higher temperature to 
              a region of lower temperature. It occurs through three main mechanisms.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Conduction</h3>
          <p className="text-gray-700 mb-4">
            Heat transfer through direct contact between materials. Energy is transferred through 
            molecular collisions and electron movement.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
            <p className="font-mono text-sm mb-2"><strong>Fourier's Law:</strong></p>
            <p className="font-mono text-sm">Q = -kA(dT/dx)</p>
            <ul className="text-sm text-gray-700 mt-3 space-y-1">
              <li>• Q = heat transfer rate (W)</li>
              <li>• k = thermal conductivity (W/(m·K))</li>
              <li>• A = cross-sectional area (m²)</li>
              <li>• dT/dx = temperature gradient</li>
            </ul>
            <p className="text-xs text-gray-600 mt-3">
              <strong>Examples:</strong> Touching a hot stove, heat spreading through a metal rod
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Convection</h3>
          <p className="text-gray-700 mb-4">
            Heat transfer through fluid motion (liquids or gases). Warmer fluid rises while 
            cooler fluid sinks, creating circulation patterns.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
            <p className="font-mono text-sm mb-2"><strong>Newton's Law of Cooling:</strong></p>
            <p className="font-mono text-sm">Q = hA(T<sub>s</sub> - T<sub>∞</sub>)</p>
            <ul className="text-sm text-gray-700 mt-3 space-y-1">
              <li>• h = convection heat transfer coefficient</li>
              <li>• A = surface area</li>
              <li>• T<sub>s</sub> = surface temperature</li>
              <li>• T<sub>∞</sub> = fluid temperature</li>
            </ul>
            <p className="text-xs text-gray-600 mt-3">
              <strong>Types:</strong> Natural (buoyancy-driven) and Forced (external flow)
            </p>
            <p className="text-xs text-gray-600">
              <strong>Examples:</strong> Boiling water, ocean currents, heating/cooling systems
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Radiation</h3>
          <p className="text-gray-700 mb-4">
            Heat transfer through electromagnetic waves. Does not require a medium and can 
            occur through vacuum.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
            <p className="font-mono text-sm mb-2"><strong>Stefan-Boltzmann Law:</strong></p>
            <p className="font-mono text-sm">Q = εσAT⁴</p>
            <ul className="text-sm text-gray-700 mt-3 space-y-1">
              <li>• ε = emissivity (0 to 1)</li>
              <li>• σ = Stefan-Boltzmann constant (5.67×10⁻⁸ W/(m²·K⁴))</li>
              <li>• A = surface area</li>
              <li>• T = absolute temperature (K)</li>
            </ul>
            <p className="text-xs text-gray-600 mt-3">
              <strong>Examples:</strong> Sun's heat, infrared heaters, thermal imaging
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Thermal Conductivity</h3>
          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2">Material</th>
                  <th className="text-left py-2">k (W/(m·K))</th>
                  <th className="text-left py-2">Type</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-200">
                  <td className="py-2">Diamond</td>
                  <td className="py-2">2300</td>
                  <td className="py-2">Excellent conductor</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">Copper</td>
                  <td className="py-2">401</td>
                  <td className="py-2">Good conductor</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">Aluminum</td>
                  <td className="py-2">237</td>
                  <td className="py-2">Good conductor</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">Water</td>
                  <td className="py-2">0.6</td>
                  <td className="py-2">Poor conductor</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">Wood</td>
                  <td className="py-2">0.1-0.2</td>
                  <td className="py-2">Insulator</td>
                </tr>
                <tr>
                  <td className="py-2">Air</td>
                  <td className="py-2">0.026</td>
                  <td className="py-2">Good insulator</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Applications</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Building insulation:</strong> Minimize heat loss/gain through walls and roofs</li>
            <li><strong>Cooking:</strong> Conduction (pan), convection (oven), radiation (broiler)</li>
            <li><strong>Electronics cooling:</strong> Heat sinks use conduction and convection</li>
            <li><strong>Climate control:</strong> HVAC systems use all three mechanisms</li>
            <li><strong>Solar panels:</strong> Capture radiant energy from the sun</li>
            <li><strong>Thermal protection:</strong> Spacecraft heat shields during re-entry</li>
            <li><strong>Industrial processes:</strong> Heat exchangers, furnaces, refrigeration</li>
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
