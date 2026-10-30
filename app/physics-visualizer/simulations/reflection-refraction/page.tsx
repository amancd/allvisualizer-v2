import type { Metadata } from "next";
import Link from 'next/link';
import ReflectionRefractionVisualizer from './ReflectionRefractionVisualizer';
import GiscusComments from '@/components/ui/GiscusComments';

export const metadata: Metadata = {
  title: "Reflection & Refraction - Waves & Optics | AllVisualizer",
  description: "Explore how light behaves at interfaces between different media. Learn about Snell's law, total internal reflection, and the critical angle through interactive simulations.",
  keywords: ["reflection", "refraction", "Snell's law", "total internal reflection", "critical angle", "refractive index", "optics"],
};

export default function ReflectionRefractionPage() {
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
          <span className="text-gray-900">Reflection & Refraction</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Reflection & Refraction
            </h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
              Beginner
            </span>
          </div>
          <p className="text-lg text-gray-600">
            Understand how light behaves when it encounters boundaries between different materials.
          </p>
        </header>

        {/* Visualizer */}
        <ReflectionRefractionVisualizer />

        {/* Theory Section */}
        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Theory</h2>
          
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-teal-900 mb-3">Snell's Law of Refraction</h3>
            <p className="text-teal-800 mb-4">
              When light passes from one medium to another, it changes direction according to the refractive 
              indices of the two media.
            </p>
            <div className="bg-white rounded p-4 font-mono text-sm space-y-2">
              <p><strong>Snell's Law:</strong> n₁ sin(θ₁) = n₂ sin(θ₂)</p>
              <p><strong>Refractive Index:</strong> n = c / v</p>
              <p><strong>Critical Angle:</strong> θ<sub>c</sub> = sin⁻¹(n₂ / n₁) when n₁ &gt; n₂</p>
              <p><strong>Total Internal Reflection:</strong> Occurs when θ₁ &gt; θ<sub>c</sub></p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Law of Reflection</h3>
          <p className="text-gray-700 mb-4">
            When light reflects off a surface, the angle of incidence equals the angle of reflection:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>θ<sub>incident</sub> = θ<sub>reflected</sub></li>
            <li>Incident ray, reflected ray, and normal all lie in the same plane</li>
            <li>Works for all types of surfaces (mirrors, water, glass, etc.)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Refraction Principles</h3>
          <p className="text-gray-700 mb-4">
            When light enters a different medium, it bends according to the refractive indices:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Into denser medium (n₂ &gt; n₁):</strong> Light bends toward the normal</li>
            <li><strong>Into less dense medium (n₂ &lt; n₁):</strong> Light bends away from the normal</li>
            <li><strong>Same refractive index:</strong> No bending, light continues straight</li>
            <li><strong>Speed changes:</strong> Light slows down in denser media (higher n)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Total Internal Reflection</h3>
          <p className="text-gray-700 mb-4">
            A special phenomenon that occurs when light travels from a denser to a less dense medium:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Conditions Required</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Light traveling from denser to less dense medium</li>
                <li>• Angle of incidence &gt; critical angle</li>
                <li>• 100% of light is reflected internally</li>
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Applications</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Optical fibers for data transmission</li>
                <li>• Binoculars and periscopes (prisms)</li>
                <li>• Diamond brilliance</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Common Refractive Indices</h3>
          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 px-2">Material</th>
                  <th className="text-left py-2 px-2">Refractive Index (n)</th>
                  <th className="text-left py-2 px-2">Speed of Light</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-2">Vacuum</td>
                  <td className="py-2 px-2">1.00</td>
                  <td className="py-2 px-2">3.0 × 10⁸ m/s</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-2">Air</td>
                  <td className="py-2 px-2">1.0003</td>
                  <td className="py-2 px-2">≈ 3.0 × 10⁸ m/s</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-2">Water</td>
                  <td className="py-2 px-2">1.33</td>
                  <td className="py-2 px-2">2.25 × 10⁸ m/s</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-2">Glass (typical)</td>
                  <td className="py-2 px-2">1.5</td>
                  <td className="py-2 px-2">2.0 × 10⁸ m/s</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">Diamond</td>
                  <td className="py-2 px-2">2.42</td>
                  <td className="py-2 px-2">1.24 × 10⁸ m/s</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-World Applications</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Optical fibers:</strong> Use total internal reflection to transmit data over long distances</li>
            <li><strong>Lenses:</strong> Cameras, eyeglasses, microscopes all rely on refraction</li>
            <li><strong>Rainbows:</strong> Refraction and reflection inside water droplets</li>
            <li><strong>Mirages:</strong> Refraction in air layers of different temperatures</li>
            <li><strong>Prisms:</strong> Separate white light into colors due to wavelength-dependent refraction</li>
            <li><strong>Underwater vision:</strong> Why things look distorted when viewed from different media</li>
            <li><strong>Diamonds:</strong> High refractive index creates brilliance through total internal reflection</li>
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
