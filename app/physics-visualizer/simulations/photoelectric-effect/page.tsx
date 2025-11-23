import type { Metadata } from 'next';
import PhotoelectricEffectVisualizer from './PhotoelectricEffectVisualizer';
import GiscusComments from '@/components/ui/GiscusComments';

export const metadata: Metadata = {
  title: 'Photoelectric Effect Visualization | Physics Visualizer',
  description: 'Interactive visualization of the photoelectric effect. Explore how light frequency and intensity affect electron emission, demonstrating the quantum nature of light.',
  keywords: [
    'photoelectric effect',
    'quantum mechanics',
    'photons',
    'Einstein',
    'work function',
    'kinetic energy',
    'frequency',
    'wavelength',
    'physics visualization',
    'quantum physics'
  ],
};

export default function PhotoelectricEffectPage() {
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
          <span className="text-gray-900">Photoelectric Effect</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold text-gray-900">Photoelectric Effect</h1>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
              Medium
            </span>
          </div>
          <p className="text-lg text-gray-700">
            Discover how light ejects electrons from metal surfaces, proving that light behaves as particles (photons).
          </p>
        </div>

        {/* Interactive Visualizer */}
        <div className="mb-12">
          <PhotoelectricEffectVisualizer />
        </div>

        {/* Theory Section */}
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 What is the Photoelectric Effect?</h2>
            <p className="text-gray-700 mb-4">
              The photoelectric effect is the emission of electrons from a metal surface when light shines on it. 
              Discovered by Heinrich Hertz in 1887 and explained by Albert Einstein in 1905, this phenomenon 
              provided crucial evidence for the quantum nature of light.
            </p>
            <p className="text-gray-700 mb-4">
              Classical wave theory predicted that any frequency of light should eventually eject electrons if 
              the intensity is high enough. However, experiments showed that only light above a certain threshold 
              frequency can cause electron emission, regardless of intensity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📐 Einstein's Equation</h2>
            <p className="text-gray-700 mb-4">
              Einstein explained the photoelectric effect by proposing that light consists of discrete energy 
              packets called photons. When a photon hits an electron, it transfers all its energy:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-center text-xl font-mono mb-2">
                E<sub>photon</sub> = hf
              </p>
              <p className="text-center text-xl font-mono">
                KE<sub>max</sub> = hf - φ
              </p>
            </div>
            <p className="text-gray-700 mb-2">Where:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>h</strong> = Planck's constant (6.626 × 10<sup>-34</sup> J·s)</li>
              <li><strong>f</strong> = Frequency of incident light</li>
              <li><strong>φ</strong> = Work function (minimum energy to eject electron)</li>
              <li><strong>KE<sub>max</sub></strong> = Maximum kinetic energy of ejected electron</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔍 Key Observations</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Threshold Frequency</h3>
                <p className="text-sm text-gray-700">
                  Below the threshold frequency f<sub>0</sub> = φ/h, no electrons are emitted regardless 
                  of light intensity. This was unexplainable by classical wave theory.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Instantaneous Emission</h3>
                <p className="text-sm text-gray-700">
                  Electrons are emitted immediately when light above threshold frequency hits the surface. 
                  There's no time delay, even at low intensities.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Intensity Effect</h3>
                <p className="text-sm text-gray-700">
                  Higher intensity means more photons, resulting in more electrons ejected per second, 
                  but doesn't change the maximum kinetic energy of individual electrons.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Frequency Dependence</h3>
                <p className="text-sm text-gray-700">
                  Higher frequency light (shorter wavelength) produces electrons with higher kinetic energy. 
                  The relationship is linear: KE increases linearly with frequency.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚡ Work Function Values</h2>
            <p className="text-gray-700 mb-4">
              Different metals have different work functions (energy needed to remove an electron):
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Metal</th>
                    <th className="px-4 py-2 border-b text-left">Work Function (eV)</th>
                    <th className="px-4 py-2 border-b text-left">Threshold Wavelength (nm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b">Sodium</td>
                    <td className="px-4 py-2 border-b">2.28</td>
                    <td className="px-4 py-2 border-b">544</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Potassium</td>
                    <td className="px-4 py-2 border-b">2.30</td>
                    <td className="px-4 py-2 border-b">539</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Calcium</td>
                    <td className="px-4 py-2 border-b">2.87</td>
                    <td className="px-4 py-2 border-b">432</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Zinc</td>
                    <td className="px-4 py-2 border-b">4.33</td>
                    <td className="px-4 py-2 border-b">286</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Copper</td>
                    <td className="px-4 py-2 border-b">4.65</td>
                    <td className="px-4 py-2 border-b">267</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🌍 Real-World Applications</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Solar Panels:</strong> Photovoltaic cells convert light energy directly to electricity</li>
              <li><strong>Night Vision Devices:</strong> Image intensifiers amplify low light using photoelectric emission</li>
              <li><strong>Photodetectors:</strong> Light sensors in cameras, barcode scanners, and optical communications</li>
              <li><strong>X-ray Photoelectron Spectroscopy:</strong> Surface analysis technique in materials science</li>
              <li><strong>Photoelectron Microscopy:</strong> Imaging surfaces at nanometer resolution</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🏆 Historical Significance</h2>
            <p className="text-gray-700 mb-4">
              Albert Einstein received the 1921 Nobel Prize in Physics for his explanation of the photoelectric 
              effect, not for his more famous theory of relativity. This work was crucial because:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>It provided strong evidence for the particle nature of light (photons)</li>
              <li>It helped establish quantum mechanics as a valid theory</li>
              <li>It showed that light has both wave and particle properties (wave-particle duality)</li>
              <li>It demonstrated that energy is quantized at the microscopic level</li>
            </ul>
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
