import type { Metadata } from 'next';
import CarnotCycleVisualizer from './CarnotCycleVisualizer';
import GiscusComments from '@/components/ui/GiscusComments';

export const metadata: Metadata = {
  title: 'Carnot Cycle Visualization | Physics Visualizer',
  description: 'Interactive visualization of the Carnot cycle - the most efficient thermodynamic cycle. Explore isothermal and adiabatic processes, PV diagrams, and thermal efficiency.',
  keywords: [
    'Carnot cycle',
    'thermodynamic cycle',
    'heat engine',
    'PV diagram',
    'isothermal process',
    'adiabatic process',
    'thermal efficiency',
    'reversible process',
    'physics visualization',
    'thermodynamics'
  ],
};

export default function CarnotCyclePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <a href="/" className="hover:text-gray-900">Home</a>
          {' / '}
          <a href="/physics-visualizer" className="hover:text-gray-900">Physics Visualizer</a>
          {' / '}
          <a href="/physics-visualizer/thermodynamics" className="hover:text-gray-900">Thermodynamics</a>
          {' / '}
          <span className="text-gray-900">Carnot Cycle</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold text-gray-900">Carnot Cycle</h1>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
              Advanced
            </span>
          </div>
          <p className="text-lg text-gray-700">
            Visualize the most efficient theoretical heat engine cycle, consisting of four reversible processes.
          </p>
        </div>

        {/* Interactive Visualizer */}
        <div className="mb-12">
          <CarnotCycleVisualizer />
        </div>

        {/* Theory Section */}
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔄 What is the Carnot Cycle?</h2>
            <p className="text-gray-700 mb-4">
              The Carnot cycle is a theoretical thermodynamic cycle that provides an upper limit on the efficiency 
              that any classical thermodynamic engine can achieve during the conversion of heat into work. It consists 
              of four reversible processes: two isothermal (constant temperature) and two adiabatic (no heat exchange).
            </p>
            <p className="text-gray-700 mb-4">
              Named after French physicist Sadi Carnot who described it in 1824, the Carnot cycle demonstrates the 
              maximum possible efficiency of a heat engine operating between two temperature reservoirs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚙️ The Four Processes</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Isothermal Expansion (A → B)</h3>
                <p className="text-gray-700">
                  The gas expands at constant high temperature T<sub>H</sub> while in contact with the hot reservoir. 
                  The system absorbs heat Q<sub>H</sub> and does work on the surroundings.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  ΔU = 0, W = Q<sub>H</sub> = nRT<sub>H</sub>ln(V<sub>B</sub>/V<sub>A</sub>)
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Adiabatic Expansion (B → C)</h3>
                <p className="text-gray-700">
                  The gas continues to expand without heat exchange (thermally isolated). Temperature decreases 
                  from T<sub>H</sub> to T<sub>C</sub> as the gas does work using its internal energy.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Q = 0, W = nC<sub>V</sub>(T<sub>H</sub> - T<sub>C</sub>), PV<sup>γ</sup> = constant
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Isothermal Compression (C → D)</h3>
                <p className="text-gray-700">
                  The gas is compressed at constant low temperature T<sub>C</sub> while in contact with the cold reservoir. 
                  The system releases heat Q<sub>C</sub> and work is done on the gas.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  ΔU = 0, W = -Q<sub>C</sub> = nRT<sub>C</sub>ln(V<sub>D</sub>/V<sub>C</sub>)
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Adiabatic Compression (D → A)</h3>
                <p className="text-gray-700">
                  The gas is compressed without heat exchange. Temperature increases from T<sub>C</sub> back to 
                  T<sub>H</sub> as work is done on the gas, returning to the initial state.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Q = 0, W = -nC<sub>V</sub>(T<sub>H</sub> - T<sub>C</sub>), PV<sup>γ</sup> = constant
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Carnot Efficiency</h2>
            <p className="text-gray-700 mb-4">
              The thermal efficiency of a Carnot engine depends only on the temperatures of the hot and cold reservoirs:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-center text-xl font-mono">
                η = 1 - T<sub>C</sub>/T<sub>H</sub> = (T<sub>H</sub> - T<sub>C</sub>)/T<sub>H</sub>
              </p>
            </div>
            <p className="text-gray-700 mb-2">
              Where T<sub>H</sub> and T<sub>C</sub> are in Kelvin. This efficiency represents the maximum possible 
              efficiency for any heat engine operating between these two temperatures.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>η &lt; 1 always (100% efficiency is impossible)</li>
              <li>Higher T<sub>H</sub> or lower T<sub>C</sub> increases efficiency</li>
              <li>No real engine can achieve Carnot efficiency due to irreversibilities</li>
              <li>Carnot efficiency sets the theoretical upper limit</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔬 Key Principles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Reversibility</h3>
                <p className="text-sm text-gray-700">
                  All processes in the Carnot cycle are reversible, meaning they can proceed in either direction 
                  without any entropy increase. This is an idealization impossible to achieve in practice.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Maximum Efficiency</h3>
                <p className="text-sm text-gray-700">
                  The Carnot cycle establishes the maximum theoretical efficiency. All real heat engines have 
                  lower efficiency due to friction, heat losses, and other irreversibilities.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">PV Diagram</h3>
                <p className="text-sm text-gray-700">
                  The Carnot cycle forms a closed loop on a PV diagram. The area enclosed represents the net 
                  work output per cycle: W<sub>net</sub> = Q<sub>H</sub> - Q<sub>C</sub>.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Temperature Reservoirs</h3>
                <p className="text-sm text-gray-700">
                  The cycle requires two thermal reservoirs at constant temperatures T<sub>H</sub> and T<sub>C</sub>. 
                  The reservoirs are assumed to be so large that their temperatures remain constant.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🌍 Real-World Applications</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Steam Turbines:</strong> Power plants approach Carnot efficiency with high-temperature steam</li>
              <li><strong>Refrigerators:</strong> Reverse Carnot cycle used as theoretical model for cooling systems</li>
              <li><strong>Engine Design:</strong> Engineers use Carnot efficiency as benchmark for optimization</li>
              <li><strong>Geothermal Power:</strong> Efficiency limited by temperature difference between ground and surface</li>
              <li><strong>Thermodynamic Analysis:</strong> Foundation for understanding all heat engines and refrigerators</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Practical Limitations</h2>
            <p className="text-gray-700 mb-4">
              While the Carnot cycle is theoretically perfect, real engines cannot achieve it because:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Truly reversible processes would take infinite time</li>
              <li>Perfect thermal insulation for adiabatic processes is impossible</li>
              <li>Friction and other dissipative effects are unavoidable</li>
              <li>Maintaining constant temperature during heat transfer requires infinitesimal temperature differences</li>
              <li>Real working fluids have phase changes and non-ideal behavior</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Despite these limitations, the Carnot cycle remains fundamental to thermodynamics, providing a 
              theoretical benchmark against which all real engines are compared.
            </p>
          </section>
        </div>

        {/* Comments */}
        <div className="mt-12">
          <GiscusComments />
        </div>
      </div>
    </div>
  );
}
