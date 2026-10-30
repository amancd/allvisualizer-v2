'use client';

import { useState } from 'react';
import Link from 'next/link';
import GiscusComments from '@/components/ui/GiscusComments';
import DerivativeVisualizer from './DerivativeVisualizer';
import type { Metadata } from 'next';

export default function DerivativesPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'mathematical'>('python');

  const codeExamples = {
    python: `import numpy as np
import matplotlib.pyplot as plt

def derivative(f, x, h=1e-5):
    """
    Calculate derivative using numerical differentiation
    f'(x) ≈ (f(x + h) - f(x - h)) / (2h)
    """
    return (f(x + h) - f(x - h)) / (2 * h)

def visualize_derivative(f, x_point):
    # Create x values
    x = np.linspace(x_point - 2, x_point + 2, 100)
    y = f(x)
    
    # Calculate derivative at point
    slope = derivative(f, x_point)
    
    # Tangent line: y = slope * (x - x_point) + f(x_point)
    tangent_y = slope * (x - x_point) + f(x_point)
    
    # Plot
    plt.plot(x, y, label='f(x)')
    plt.plot(x, tangent_y, label=f'Tangent (slope={slope:.2f})')
    plt.scatter([x_point], [f(x_point)], color='red', zorder=5)
    plt.legend()
    plt.grid(True)
    plt.show()

# Example: f(x) = x²
f = lambda x: x**2
visualize_derivative(f, x_point=2)  # Derivative at x=2 is 4`,

    javascript: `// Calculate derivative using numerical differentiation
function derivative(f, x, h = 1e-5) {
  // f'(x) ≈ (f(x + h) - f(x - h)) / (2h)
  return (f(x + h) - f(x - h)) / (2 * h);
}

// Visualize derivative with tangent line
function visualizeDerivative(f, xPoint) {
  const points = [];
  const tangentPoints = [];
  
  // Generate points for the function
  for (let x = xPoint - 2; x <= xPoint + 2; x += 0.1) {
    points.push({ x, y: f(x) });
  }
  
  // Calculate derivative (slope) at the point
  const slope = derivative(f, xPoint);
  const yPoint = f(xPoint);
  
  // Generate tangent line points
  // Tangent: y = slope * (x - xPoint) + yPoint
  for (let x = xPoint - 2; x <= xPoint + 2; x += 0.1) {
    const y = slope * (x - xPoint) + yPoint;
    tangentPoints.push({ x, y });
  }
  
  return {
    function: points,
    tangent: tangentPoints,
    slope: slope,
    point: { x: xPoint, y: yPoint }
  };
}

// Example: f(x) = x²
const f = (x) => x * x;
const result = visualizeDerivative(f, 2);
console.log(\`Derivative at x=2: \${result.slope}\`); // Output: 4`,

    mathematical: `DERIVATIVE DEFINITION
━━━━━━━━━━━━━━━━━━━━

The derivative measures the instantaneous rate of change:

                f(x + h) - f(x)
    f'(x) = lim ───────────────
            h→0        h


POWER RULE
━━━━━━━━━━

For f(x) = xⁿ:
    f'(x) = n·xⁿ⁻¹

Example: f(x) = x²
    f'(x) = 2x¹ = 2x
    f'(2) = 2(2) = 4


GEOMETRIC INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━

The derivative f'(a) represents:
• Slope of the tangent line at x = a
• Instantaneous rate of change at x = a

Tangent line equation:
    y - f(a) = f'(a)(x - a)
    
For f(x) = x² at x = 2:
    • f(2) = 4
    • f'(2) = 4
    • Tangent: y - 4 = 4(x - 2)
              y = 4x - 4


COMMON DERIVATIVES
━━━━━━━━━━━━━━━━━━

f(x) = c        →  f'(x) = 0
f(x) = x        →  f'(x) = 1
f(x) = xⁿ       →  f'(x) = nxⁿ⁻¹
f(x) = eˣ       →  f'(x) = eˣ
f(x) = ln(x)    →  f'(x) = 1/x
f(x) = sin(x)   →  f'(x) = cos(x)
f(x) = cos(x)   →  f'(x) = -sin(x)`
  };

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
            <li>/</li>
            <li><Link href="/math-visualizer" className="hover:text-gray-900">Math Visualizer</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Derivatives</li>
          </ol>
        </nav>

        <article className="space-y-8">
          <header className="space-y-4 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-gray-200 text-gray-900 rounded font-medium">Calculus</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">Beginner</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Understanding Derivatives
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Learn how derivatives measure instantaneous rate of change and visualize tangent lines to understand the geometric interpretation of differentiation.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Problem Statement</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
              <p className="text-gray-700">
                Given a function <code className="px-2 py-0.5 bg-white border border-gray-200 rounded text-sm">f(x) = x²</code>, 
                find the derivative at a point <code className="px-2 py-0.5 bg-white border border-gray-200 rounded text-sm">x = a</code> and 
                visualize the tangent line at that point.
              </p>
              
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">Example:</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Input:</span> f(x) = x², a = 2</p>
                  <p><span className="font-medium">Output:</span> f'(2) = 4</p>
                  <p className="text-gray-600">Tangent line: y = 4x - 4</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Intuition</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                The derivative represents the <strong>instantaneous rate of change</strong> of a function. Geometrically, 
                it's the slope of the tangent line to the curve at a specific point.
              </p>
              
              <div className="bg-gray-100 border-l-4 border-gray-900 p-4 my-4">
                <p className="text-sm text-gray-900">
                  <strong>Key Concept:</strong> While the average rate of change uses two points, the derivative 
                  captures the rate of change at a single instant by taking the limit as the interval approaches zero.
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed">
                For <code className="px-2 py-0.5 bg-gray-100 rounded text-sm">f(x) = x²</code>, the derivative is 
                <code className="px-2 py-0.5 bg-gray-100 rounded text-sm">f'(x) = 2x</code>. At x = 2, the slope is 4, 
                meaning the function is increasing at a rate of 4 units vertically for every 1 unit horizontally.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Interactive Visualization</h2>
            <p className="text-gray-600">
              Drag the point along the curve to see how the derivative (tangent line slope) changes.
            </p>
            <DerivativeVisualizer />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Implementation</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLanguage('python')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedLanguage === 'python'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setSelectedLanguage('javascript')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedLanguage === 'javascript'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  JavaScript
                </button>
                <button
                  onClick={() => setSelectedLanguage('mathematical')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedLanguage === 'mathematical'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Math
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                <span className="text-sm text-gray-300 font-medium">
                  {selectedLanguage === 'mathematical' ? 'Mathematical Notation' : selectedLanguage === 'python' ? 'derivative.py' : 'derivative.js'}
                </span>
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-gray-100 whitespace-pre-wrap break-words">
                  {codeExamples[selectedLanguage]}
                </code>
              </pre>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Computational Complexity</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Time Complexity</h3>
                <p className="text-green-800 text-sm">
                  <code className="px-2 py-0.5 bg-white border border-green-300 rounded">O(1)</code> - Analytical derivative
                </p>
                <p className="text-green-700 text-xs mt-2">
                  Using calculus rules, derivative is computed instantly
                </p>
              </div>
              
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Space Complexity</h3>
                <p className="text-gray-900 text-sm">
                  <code className="px-2 py-0.5 bg-white border border-gray-300 rounded">O(1)</code> - Constant space
                </p>
                <p className="text-gray-900 text-xs mt-2">
                  Only stores the result value
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <p className="text-sm text-yellow-900">
                <strong>Note:</strong> Numerical differentiation (as shown in code) requires O(1) function evaluations 
                but may have precision errors. Symbolic differentiation using calculus rules is exact.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Related Topics</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Chain Rule
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Derivatives of composite functions</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Integration
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">The inverse operation of differentiation</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Optimization
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Finding maxima and minima using derivatives</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Taylor Series
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Approximating functions using derivatives</p>
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Discussion</h2>
            <GiscusComments />
          </section>
        </article>
      </div>
    </div>
  );
}
