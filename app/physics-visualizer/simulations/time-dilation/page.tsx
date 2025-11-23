import type { Metadata } from 'next';
import TimeDilationVisualizer from './TimeDilationVisualizer';
import GiscusComments from '@/components/ui/GiscusComments';

export const metadata: Metadata = {
  title: 'Time Dilation Visualization | Physics Visualizer',
  description: 'Interactive visualization of time dilation from special relativity. Explore how time passes differently for observers in relative motion and the twin paradox.',
  keywords: [
    'time dilation',
    'special relativity',
    'Einstein',
    'Lorentz factor',
    'twin paradox',
    'relativity',
    'spacetime',
    'speed of light',
    'physics visualization',
    'modern physics'
  ],
};

export default function TimeDilationPage() {
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
          <span className="text-gray-900">Time Dilation</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold text-gray-900">Time Dilation</h1>
            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
              Advanced
            </span>
          </div>
          <p className="text-lg text-gray-700">
            Discover how time passes at different rates for observers in relative motion, one of Einstein's most remarkable predictions.
          </p>
        </div>

        {/* Interactive Visualizer */}
        <div className="mb-12">
          <TimeDilationVisualizer />
        </div>

        {/* Theory Section */}
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⏱️ What is Time Dilation?</h2>
            <p className="text-gray-700 mb-4">
              Time dilation is a difference in elapsed time measured by two clocks, either due to relative velocity 
              (special relativity) or gravitational potential (general relativity). Moving clocks run slower compared 
              to stationary ones—a prediction that has been confirmed by countless experiments.
            </p>
            <p className="text-gray-700 mb-4">
              This isn't just a clock malfunction or measurement error—time itself actually passes at different rates. 
              This counterintuitive result emerges from Einstein's postulate that the speed of light is constant in 
              all reference frames.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📐 The Time Dilation Formula</h2>
            <p className="text-gray-700 mb-4">
              The relationship between time measured by a stationary observer (Δt) and a moving observer (Δt₀) is:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-center text-xl font-mono mb-2">
                Δt = γΔt₀
              </p>
              <p className="text-center text-xl font-mono">
                γ = 1/√(1 - v²/c²)
              </p>
            </div>
            <p className="text-gray-700 mb-2">Where:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>γ</strong> (gamma) = Lorentz factor</li>
              <li><strong>v</strong> = Relative velocity between observers</li>
              <li><strong>c</strong> = Speed of light (299,792,458 m/s)</li>
              <li><strong>Δt₀</strong> = Proper time (time in moving frame)</li>
              <li><strong>Δt</strong> = Dilated time (time in stationary frame)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 The Twin Paradox</h2>
            <p className="text-gray-700 mb-4">
              One of the most famous thought experiments in relativity involves identical twins. One twin stays on 
              Earth while the other travels on a high-speed rocket to a distant star and returns. When they reunite:
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">The Traveling Twin Ages Less</h3>
              <p className="text-gray-700 mb-2">
                Due to time dilation, less time passes for the traveling twin. At 90% the speed of light, only 
                4.4 years pass for the traveler while 10 years pass on Earth.
              </p>
              <p className="text-gray-700">
                This is not a paradox but a real physical effect. The asymmetry comes from the fact that the 
                traveling twin must accelerate to turn around, breaking the symmetry between the twins.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔬 Experimental Evidence</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Muon Decay</h3>
                <p className="text-sm text-gray-700">
                  Cosmic ray muons created in the upper atmosphere reach Earth's surface more often than expected. 
                  Time dilation extends their lifetime from our perspective, allowing them to travel farther before decaying.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Atomic Clocks</h3>
                <p className="text-sm text-gray-700">
                  In 1971, Hafele and Keating flew atomic clocks around the world on commercial flights. The traveling 
                  clocks showed measurable time differences matching relativistic predictions to within experimental error.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Particle Accelerators</h3>
                <p className="text-sm text-gray-700">
                  Particles in accelerators like the LHC travel at 99.9999% of light speed. Their measured lifetimes 
                  are thousands of times longer than when at rest, exactly as relativity predicts.
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">GPS Satellites</h3>
                <p className="text-sm text-gray-700">
                  GPS satellites must account for both special and general relativistic time dilation. Without these 
                  corrections, GPS would accumulate errors of about 10 kilometers per day.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚡ Key Insights</h2>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                <h3 className="font-semibold text-gray-900 mb-1">Low Speeds (v &lt;&lt; c)</h3>
                <p className="text-sm text-gray-700">
                  At everyday speeds, γ ≈ 1 and time dilation is negligible. For a car at 100 km/h, the effect is 
                  only about 1 part in 10¹⁶.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                <h3 className="font-semibold text-gray-900 mb-1">High Speeds (v → c)</h3>
                <p className="text-sm text-gray-700">
                  As velocity approaches light speed, γ increases dramatically. At 99.99% of c, γ ≈ 70.7, meaning 
                  time passes 70 times slower for the moving object.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50">
                <h3 className="font-semibold text-gray-900 mb-1">Speed of Light Limit</h3>
                <p className="text-sm text-gray-700">
                  As v approaches c, γ approaches infinity. This is why nothing with mass can reach or exceed light 
                  speed—it would require infinite energy.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🌍 Practical Applications</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>GPS Navigation:</strong> Requires relativistic corrections for accurate positioning</li>
              <li><strong>Particle Physics:</strong> Understanding decay rates and collision dynamics</li>
              <li><strong>Astronomy:</strong> Explaining cosmic ray observations and stellar phenomena</li>
              <li><strong>Fundamental Research:</strong> Testing the limits of special relativity</li>
              <li><strong>Future Space Travel:</strong> Enabling interstellar journeys through time dilation effects</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎓 Common Misconceptions</h2>
            <div className="space-y-3">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">❌ "It's just the clocks that slow down"</h3>
                <p className="text-sm text-gray-700">
                  No—time itself passes at different rates. All physical processes slow down, including aging, 
                  radioactive decay, and chemical reactions.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">❌ "The moving observer feels time slow down"</h3>
                <p className="text-sm text-gray-700">
                  No—from the moving observer's perspective, their own time passes normally. It's only when comparing 
                  with the stationary observer that the difference appears.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">❌ "You can travel backward in time"</h3>
                <p className="text-sm text-gray-700">
                  No—time dilation only causes time to pass slower, never backward. The arrow of time always points 
                  forward in all reference frames.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Interstellar Travel</h2>
            <p className="text-gray-700 mb-4">
              Time dilation offers a potential solution to interstellar travel. At high relativistic speeds:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>A trip to Alpha Centauri (4.3 light-years) at 99.9% light speed takes 4.3 years on Earth but only 
                  2 months for the traveler</li>
              <li>At 99.99% light speed, travelers could reach the center of our galaxy (27,000 light-years) in about 
                  380 years of their own time</li>
              <li>The challenge is achieving such speeds—it requires enormous energy and technology we don't yet possess</li>
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
