import type { Metadata } from "next";
import RCCircuitVisualizer from './RCCircuitVisualizer';
import GiscusComments from "@/components/ui/GiscusComments";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Capacitors & RC Circuits - Physics Visualizer | AllVisualizer",
  description: "Visualize capacitor charging and discharging in RC circuits. Interactive simulation with voltage, current, and charge graphs.",
  keywords: ["capacitor", "RC circuit", "time constant", "exponential decay", "charging", "discharging", "physics simulation"],
  openGraph: {
    title: "RC Circuit Visualizer - Interactive Physics",
    description: "Master capacitors and RC circuits through interactive visualization",
  },
};

export default function RCCircuitPage() {
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
          <span className="text-gray-900">RC Circuits</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Capacitors & RC Circuits
            </h1>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
              Intermediate
            </span>
          </div>
          <p className="text-lg text-gray-600">
            Visualize how capacitors charge and discharge in RC circuits with exponential behavior.
          </p>
        </header>

        {/* Theory */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">RC Circuit Theory</h2>
          
          <div className="space-y-4 text-gray-700">
            <p>
              An <strong>RC circuit</strong> consists of a resistor (R) and capacitor (C) connected in series. 
              When connected to a voltage source, the capacitor charges exponentially, and when disconnected, 
              it discharges exponentially through the resistor.
            </p>

            <div className="bg-white border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Charging Equations:</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="bg-gray-100 p-2 rounded">Q(t) = Q₀(1 - e^(-t/τ))</div>
                <div className="bg-gray-100 p-2 rounded">V(t) = V₀(1 - e^(-t/τ))</div>
                <div className="bg-gray-100 p-2 rounded">I(t) = (V₀/R)e^(-t/τ)</div>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Discharging Equations:</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="bg-gray-100 p-2 rounded">Q(t) = Q₀e^(-t/τ)</div>
                <div className="bg-gray-100 p-2 rounded">V(t) = V₀e^(-t/τ)</div>
                <div className="bg-gray-100 p-2 rounded">I(t) = -(V₀/R)e^(-t/τ)</div>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Time Constant (τ):</h3>
              <div className="font-mono text-sm bg-gray-100 p-3 rounded mb-2">
                τ = R × C
              </div>
              <ul className="text-sm space-y-1">
                <li>• At t = τ: 63.2% charged/discharged</li>
                <li>• At t = 2τ: 86.5% charged/discharged</li>
                <li>• At t = 3τ: 95.0% charged/discharged</li>
                <li>• At t = 5τ: 99.3% charged/discharged (effectively complete)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Key Properties:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Capacitance (C) measures charge storage ability (Farads)</li>
                <li>Larger τ means slower charging/discharging</li>
                <li>Current is maximum at t=0, decreases exponentially</li>
                <li>Energy stored: E = ½CV²</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Visualizer */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Interactive Simulation</h2>
          <RCCircuitVisualizer />
        </section>

        {/* Key Concepts */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Key Concepts</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Exponential Behavior:</h3>
              <p className="text-gray-700 text-sm">
                Both charging and discharging follow exponential curves, not linear. The rate of change 
                is fastest at the beginning and slows down as the capacitor approaches its final state.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Time Constant Significance:</h3>
              <p className="text-gray-700 text-sm">
                The time constant τ = RC determines how fast the circuit responds. A larger resistance 
                or capacitance increases τ, making the process slower. After 5τ, the process is 
                essentially complete (99.3%).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Current Direction:</h3>
              <p className="text-gray-700 text-sm">
                During charging, current flows into the capacitor (positive). During discharging, 
                current flows out of the capacitor (negative). The magnitude decreases exponentially 
                in both cases.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Energy Conservation:</h3>
              <p className="text-gray-700 text-sm">
                Energy is stored in the electric field between capacitor plates. During discharge, 
                this energy is dissipated as heat in the resistor. Half the energy from the battery 
                is always lost to the resistor during charging.
              </p>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Real-World Applications</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Timing Circuits</h3>
              <p className="text-sm text-gray-600">
                RC circuits create precise time delays in electronics, from simple timers to computer clock circuits
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Filters</h3>
              <p className="text-sm text-gray-600">
                Low-pass and high-pass filters use RC circuits to block or pass specific frequencies
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Flash Photography</h3>
              <p className="text-sm text-gray-600">
                Camera flashes use capacitors to store energy and release it quickly for bright light
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Power Supplies</h3>
              <p className="text-sm text-gray-600">
                Smoothing capacitors in power supplies filter out voltage ripples for stable DC output
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Touchscreens</h3>
              <p className="text-sm text-gray-600">
                Capacitive touchscreens detect finger position by measuring capacitance changes
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3">
              <h3 className="font-semibold text-gray-900 mb-1">Defibrillators</h3>
              <p className="text-sm text-gray-600">
                Medical defibrillators charge capacitors to deliver controlled electric shocks to the heart
              </p>
            </div>
          </div>
        </section>

        {/* Discussion */}
        <section className="mb-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Discussion</h2>
          <p className="text-gray-600 mb-6">
            Have questions about RC circuits? Join the conversation below.
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
