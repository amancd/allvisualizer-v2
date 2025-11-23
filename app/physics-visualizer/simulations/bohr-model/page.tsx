import type { Metadata } from 'next';
import BohrModelVisualizer from './BohrModelVisualizer';
import GiscusComments from '@/components/ui/GiscusComments';

export const metadata: Metadata = {
  title: 'Bohr Model Visualization | Physics Visualizer',
  description: 'Interactive visualization of the Bohr model of the hydrogen atom. Explore electron orbits, energy levels, and spectral line emission.',
  keywords: [
    'Bohr model',
    'hydrogen atom',
    'atomic physics',
    'energy levels',
    'spectral lines',
    'electron orbits',
    'quantum jumps',
    'Balmer series',
    'physics visualization',
    'quantum mechanics'
  ],
};

export default function BohrModelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <a href="/" className="hover:text-gray-900">Home</a>
          {' / '}
          <a href="/physics-visualizer" className="hover:text-gray-900">Physics Visualizer</a>
          {' / '}
          <a href="/physics-visualizer/modern-physics" className="hover:text-gray-900">Modern Physics</a>
          {' / '}
          <span className="text-gray-900">Bohr Model</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold text-gray-900">Bohr Model of Hydrogen</h1>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
              Medium
            </span>
          </div>
          <p className="text-lg text-gray-700">
            Visualize electron orbits, energy levels, and the emission of light when electrons transition between levels.
          </p>
        </div>

        {/* Interactive Visualizer */}
        <div className="mb-12">
          <BohrModelVisualizer />
        </div>

        {/* Theory Section */}
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚛️ The Bohr Model</h2>
            <p className="text-gray-700 mb-4">
              Proposed by Niels Bohr in 1913, the Bohr model was the first successful quantum model of the atom. 
              It explained the discrete spectral lines of hydrogen by postulating that electrons orbit the nucleus 
              in specific allowed energy levels.
            </p>
            <p className="text-gray-700 mb-4">
              While superseded by modern quantum mechanics, the Bohr model remains valuable for understanding 
              atomic structure and provides accurate predictions for hydrogen-like atoms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📐 Key Postulates</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Quantized Orbits</h3>
                <p className="text-gray-700">
                  Electrons can only occupy certain discrete orbits where angular momentum is quantized: 
                  L = nℏ, where n = 1, 2, 3, ... and ℏ = h/2π.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Stationary States</h3>
                <p className="text-gray-700">
                  Electrons in allowed orbits do not radiate energy. They maintain constant energy in 
                  these "stationary states" without spiraling into the nucleus.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Quantum Jumps</h3>
                <p className="text-gray-700">
                  When an electron transitions between orbits, it absorbs or emits a photon with energy 
                  exactly equal to the energy difference: ΔE = hf = E<sub>final</sub> - E<sub>initial</sub>.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚡ Energy Levels</h2>
            <p className="text-gray-700 mb-4">
              The energy of an electron in the nth orbit is given by:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-center text-xl font-mono">
                E<sub>n</sub> = -13.6 eV / n²
              </p>
            </div>
            <p className="text-gray-700 mb-2">
              The negative sign indicates that the electron is bound to the nucleus. Key features:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Ground State (n=1):</strong> E<sub>1</sub> = -13.6 eV (lowest energy, most stable)</li>
              <li><strong>Excited States (n≥2):</strong> Higher energy levels with less binding</li>
              <li><strong>Ionization (n=∞):</strong> E<sub>∞</sub> = 0 eV (electron completely removed)</li>
              <li>Energy levels converge as n increases</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🌈 Spectral Series</h2>
            <p className="text-gray-700 mb-4">
              When electrons transition between energy levels, they emit photons with specific wavelengths, 
              creating spectral lines grouped into series:
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Series</th>
                    <th className="px-4 py-2 border-b text-left">Transitions</th>
                    <th className="px-4 py-2 border-b text-left">Spectrum Region</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b">Lyman</td>
                    <td className="px-4 py-2 border-b">n → 1</td>
                    <td className="px-4 py-2 border-b">Ultraviolet</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Balmer</td>
                    <td className="px-4 py-2 border-b">n → 2</td>
                    <td className="px-4 py-2 border-b">Visible</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Paschen</td>
                    <td className="px-4 py-2 border-b">n → 3</td>
                    <td className="px-4 py-2 border-b">Infrared</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Brackett</td>
                    <td className="px-4 py-2 border-b">n → 4</td>
                    <td className="px-4 py-2 border-b">Infrared</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700">
              The Balmer series (transitions to n=2) produces visible light and was historically important 
              in discovering the structure of the hydrogen atom.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📏 Orbital Radii</h2>
            <p className="text-gray-700 mb-4">
              The radius of the nth orbit follows:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-center text-xl font-mono">
                r<sub>n</sub> = n² × a<sub>0</sub>
              </p>
            </div>
            <p className="text-gray-700">
              where a<sub>0</sub> = 0.529 Å (Bohr radius). The ground state has the smallest radius, 
              and orbital size increases quadratically with n.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🌍 Applications</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Spectroscopy:</strong> Identifying elements by their characteristic spectral lines</li>
              <li><strong>Astronomy:</strong> Analyzing light from stars and galaxies</li>
              <li><strong>Lasers:</strong> Understanding electron transitions in laser media</li>
              <li><strong>Quantum Chemistry:</strong> Foundation for understanding atomic bonding</li>
              <li><strong>Plasma Physics:</strong> Studying ionized gases and fusion reactions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Limitations</h2>
            <p className="text-gray-700 mb-4">
              While revolutionary, the Bohr model has limitations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Only accurately predicts hydrogen and hydrogen-like ions (single electron)</li>
              <li>Cannot explain fine structure or hyperfine splitting</li>
              <li>Doesn't account for electron spin</li>
              <li>Incompatible with the Heisenberg uncertainty principle</li>
              <li>Cannot predict intensity of spectral lines</li>
              <li>Replaced by the Schrödinger equation and quantum mechanics</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Despite these limitations, the Bohr model remains a valuable pedagogical tool and provides 
              qualitatively correct insights into atomic structure.
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
