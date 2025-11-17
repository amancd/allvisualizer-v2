'use client';

import { useState } from 'react';
import Link from 'next/link';
import GiscusComments from '@/components/ui/GiscusComments';
import IntegrationVisualizer from './IntegrationVisualizer';

export default function IntegrationBasicsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'mathematical'>('python');

  const codeExamples = {
    python: `import numpy as np
import matplotlib.pyplot as plt
from scipy import integrate

def numerical_integration(f, a, b, n=1000):
    """
    Calculate definite integral using Riemann sum (midpoint rule)
    ∫ₐᵇ f(x) dx ≈ Σ f(xᵢ) · Δx
    
    Args:
        f: Function to integrate
        a: Lower bound
        b: Upper bound
        n: Number of subdivisions
    
    Returns:
        Approximate value of the integral
    """
    dx = (b - a) / n
    total = 0
    
    for i in range(n):
        x_mid = a + (i + 0.5) * dx
        total += f(x_mid) * dx
    
    return total

# Example: ∫₀² x² dx
f = lambda x: x**2
a, b = 0, 2

# Numerical integration
result_numerical = numerical_integration(f, a, b)
print(f"Numerical: ∫₀² x² dx ≈ {result_numerical:.4f}")

# Analytical solution: F(x) = x³/3
# ∫₀² x² dx = [x³/3]₀² = 8/3 - 0 = 2.6667
F = lambda x: x**3 / 3
result_analytical = F(b) - F(a)
print(f"Analytical: ∫₀² x² dx = {result_analytical:.4f}")

# Using scipy for verification
result_scipy, error = integrate.quad(f, a, b)
print(f"SciPy: {result_scipy:.4f}")

# Visualize
x = np.linspace(0, 2, 100)
y = f(x)

plt.fill_between(x, 0, y, alpha=0.3, label=f'Area = {result_analytical:.4f}')
plt.plot(x, y, 'b-', linewidth=2, label='f(x) = x²')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Integration: Area Under Curve')
plt.legend()
plt.grid(True)
plt.show()`,

    javascript: `// Numerical integration using Riemann sum (midpoint rule)
function numericalIntegration(f, a, b, n = 1000) {
  // ∫ₐᵇ f(x) dx ≈ Σ f(xᵢ) · Δx
  
  const dx = (b - a) / n;
  let total = 0;
  
  for (let i = 0; i < n; i++) {
    const xMid = a + (i + 0.5) * dx;
    total += f(xMid) * dx;
  }
  
  return total;
}

// Analytical integration (antiderivative)
function analyticalIntegration(F, a, b) {
  // Fundamental Theorem of Calculus
  // ∫ₐᵇ f(x) dx = F(b) - F(a)
  return F(b) - F(a);
}

// Example: ∫₀² x² dx
const f = (x) => x * x;           // Function
const F = (x) => (x * x * x) / 3; // Antiderivative

const a = 0;  // Lower bound
const b = 2;  // Upper bound

// Numerical approach
const numericalResult = numericalIntegration(f, a, b);
console.log(\`Numerical: ∫₀² x² dx ≈ \${numericalResult.toFixed(4)}\`);

// Analytical approach
const analyticalResult = analyticalIntegration(F, a, b);
console.log(\`Analytical: ∫₀² x² dx = \${analyticalResult.toFixed(4)}\`);

// Result: 2.6667 (or 8/3)

// Riemann sum visualization (rectangles)
function riemannSum(f, a, b, n = 20) {
  const dx = (b - a) / n;
  const rectangles = [];
  
  for (let i = 0; i < n; i++) {
    const x = a + i * dx;
    const height = f(x);
    const area = height * dx;
    
    rectangles.push({
      x: x,
      width: dx,
      height: height,
      area: area
    });
  }
  
  const totalArea = rectangles.reduce((sum, rect) => sum + rect.area, 0);
  return { rectangles, totalArea };
}

const riemann = riemannSum(f, 0, 2, 20);
console.log(\`Riemann sum (20 rectangles): \${riemann.totalArea.toFixed(4)}\`);`,

    mathematical: `INTEGRATION BASICS
━━━━━━━━━━━━━━━━━━

Integration is the inverse of differentiation.


INDEFINITE INTEGRAL (Antiderivative)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ∫ f(x) dx = F(x) + C

where F'(x) = f(x) and C is the constant of integration.

Example: ∫ x² dx = x³/3 + C


DEFINITE INTEGRAL (Area Under Curve)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ∫ₐᵇ f(x) dx = F(b) - F(a)

Represents the signed area between the curve and x-axis 
from x = a to x = b.


FUNDAMENTAL THEOREM OF CALCULUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Part 1: If F(x) = ∫ₐˣ f(t) dt, then F'(x) = f(x)

Part 2: If F'(x) = f(x), then ∫ₐᵇ f(x) dx = F(b) - F(a)

This connects differentiation and integration!


EXAMPLE: ∫₀² x² dx
━━━━━━━━━━━━━━━━━━

Step 1: Find antiderivative
    F(x) = x³/3

Step 2: Apply fundamental theorem
    ∫₀² x² dx = F(2) - F(0)
              = 2³/3 - 0³/3
              = 8/3 - 0
              = 8/3
              ≈ 2.6667


POWER RULE FOR INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━

    ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C    (n ≠ -1)

Examples:
    ∫ x dx = x²/2 + C
    ∫ x² dx = x³/3 + C
    ∫ x³ dx = x⁴/4 + C


COMMON INTEGRALS
━━━━━━━━━━━━━━━━

∫ k dx = kx + C                (constant)
∫ x dx = x²/2 + C
∫ xⁿ dx = xⁿ⁺¹/(n+1) + C
∫ 1/x dx = ln|x| + C
∫ eˣ dx = eˣ + C
∫ sin(x) dx = -cos(x) + C
∫ cos(x) dx = sin(x) + C


RIEMANN SUM APPROXIMATION
━━━━━━━━━━━━━━━━━━━━━━━━

    ∫ₐᵇ f(x) dx ≈ Σⁿᵢ₌₁ f(xᵢ) · Δx

where Δx = (b-a)/n and xᵢ are sample points.

As n → ∞, the approximation becomes exact.`
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-indigo-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/math-visualizer" className="hover:text-indigo-600">Math Visualizer</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Integration Basics</li>
          </ol>
        </nav>

        <article className="space-y-8">
          <header className="space-y-4 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">Calculus</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">Beginner</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Integration Basics
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Learn about antiderivatives and the area under curves. Master the Fundamental Theorem of Calculus and understand how integration reverses differentiation.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Problem Statement</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
              <p className="text-gray-700">
                Given a function <code className="px-2 py-0.5 bg-white border border-gray-200 rounded text-sm">f(x) = x²</code>, 
                find the area under the curve from <code className="px-2 py-0.5 bg-white border border-gray-200 rounded text-sm">x = 0</code> to 
                <code className="px-2 py-0.5 bg-white border border-gray-200 rounded text-sm">x = b</code> using integration.
              </p>
              
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">Example:</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Input:</span> f(x) = x², bounds [0, 2]</p>
                  <p><span className="font-medium">Output:</span> ∫₀² x² dx = 8/3 ≈ 2.667</p>
                  <p className="text-gray-600">Method: F(x) = x³/3, so F(2) - F(0) = 8/3</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Intuition</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Integration calculates the <strong>area under a curve</strong>. While derivatives measure rates of change, 
                integrals measure accumulation. The definite integral ∫ₐᵇ f(x) dx represents the total area between the 
                function f(x) and the x-axis from a to b.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <p className="text-sm text-blue-900">
                  <strong>Key Concept:</strong> The Fundamental Theorem of Calculus connects differentiation and integration. 
                  If F'(x) = f(x), then ∫ₐᵇ f(x) dx = F(b) - F(a). This means we can find areas by finding antiderivatives!
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed">
                For f(x) = x², the antiderivative is F(x) = x³/3 (since d/dx[x³/3] = x²). To find the area from 0 to 2, 
                we evaluate F(2) - F(0) = 8/3 - 0 = 8/3 ≈ 2.667.
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 my-4">
                <h4 className="font-semibold text-purple-900 mb-2">Riemann Sums:</h4>
                <p className="text-sm text-purple-800">
                  We can approximate the area using rectangles (Riemann sums). As we use more rectangles, 
                  the approximation gets closer to the exact integral value.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Interactive Visualization</h2>
            <p className="text-gray-600">
              Drag the upper bound to see how the area under the curve changes. Notice the Riemann rectangles approximating the integral.
            </p>
            <IntegrationVisualizer />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Implementation</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLanguage('python')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedLanguage === 'python'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setSelectedLanguage('javascript')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedLanguage === 'javascript'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  JavaScript
                </button>
                <button
                  onClick={() => setSelectedLanguage('mathematical')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedLanguage === 'mathematical'
                      ? 'bg-indigo-600 text-white'
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
                  {selectedLanguage === 'mathematical' ? 'Mathematical Notation' : selectedLanguage === 'python' ? 'integration.py' : 'integration.js'}
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
            <h2 className="text-2xl font-bold text-gray-900">Key Properties</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Linearity</h3>
                <p className="text-blue-800 text-sm mb-2">
                  ∫[af(x) + bg(x)]dx = a∫f(x)dx + b∫g(x)dx
                </p>
                <p className="text-blue-700 text-xs">
                  Constants and sums can be separated
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Reverses Differentiation</h3>
                <p className="text-green-800 text-sm mb-2">
                  d/dx[∫f(x)dx] = f(x)
                </p>
                <p className="text-green-700 text-xs">
                  Integration undoes differentiation
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Additivity</h3>
                <p className="text-purple-800 text-sm mb-2">
                  ∫ₐᶜf(x)dx = ∫ₐᵇf(x)dx + ∫ᵇᶜf(x)dx
                </p>
                <p className="text-purple-700 text-xs">
                  Areas can be split and combined
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Zero Width</h3>
                <p className="text-orange-800 text-sm mb-2">
                  ∫ₐᵃf(x)dx = 0
                </p>
                <p className="text-orange-700 text-xs">
                  No area when bounds are equal
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Related Topics</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/math-visualizer/problems/derivatives" className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors group">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600">
                  Derivatives
                </h3>
                <p className="text-sm text-gray-600">The inverse operation of integration</p>
              </Link>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Substitution Rule
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Integration technique for composite functions</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Integration by Parts
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Integration technique for products</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Applications
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Volume, work, and physics applications</p>
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Discussion</h2>
            <GiscusComments
              repo="amancd/allvisualizer-v2"
              repoId="YOUR_REPO_ID"
              category="General"
              categoryId="YOUR_CATEGORY_ID"
            />
          </section>
        </article>
      </div>
    </div>
  );
}
