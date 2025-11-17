'use client';

import { useState } from 'react';
import Link from 'next/link';
import GiscusComments from '@/components/ui/GiscusComments';
import OptimizationVisualizer from './OptimizationVisualizer';

export default function OptimizationPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'mathematical'>('python');

  const codeExamples = {
    python: `import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize_scalar

def optimization_problem():
    """
    Problem: Maximize area of rectangle with fixed perimeter
    
    Given: Perimeter = 16
    Find: Dimensions (width, height) that maximize area
    
    Constraint: 2w + 2h = 16  =>  h = 8 - w
    Objective: A(w) = w * h = w(8 - w) = 8w - w²
    """
    
    # Define area function (to maximize)
    def area(w):
        return w * (8 - w)
    
    # Define negative area (to minimize, equivalent to maximizing area)
    def neg_area(w):
        return -area(w)
    
    # Method 1: Using calculus (derivative = 0)
    # A(w) = 8w - w²
    # A'(w) = 8 - 2w
    # Critical point: 8 - 2w = 0  =>  w = 4
    
    w_critical = 4
    h_critical = 8 - w_critical
    max_area_analytical = area(w_critical)
    
    print("=== Analytical Solution (Calculus) ===")
    print(f"Critical point: w = {w_critical}, h = {h_critical}")
    print(f"Maximum area: {max_area_analytical}")
    
    # Verify it's a maximum (second derivative test)
    # A''(w) = -2 < 0, so it's a maximum ✓
    print(f"Second derivative: A''(w) = -2 (< 0, confirms maximum)")
    
    # Method 2: Using numerical optimization
    result = minimize_scalar(neg_area, bounds=(0, 8), method='bounded')
    w_optimal = result.x
    h_optimal = 8 - w_optimal
    max_area_numerical = -result.fun
    
    print("\\n=== Numerical Solution (scipy) ===")
    print(f"Optimal width: {w_optimal:.4f}")
    print(f"Optimal height: {h_optimal:.4f}")
    print(f"Maximum area: {max_area_numerical:.4f}")
    
    # Visualize
    w_values = np.linspace(0, 8, 100)
    area_values = [area(w) for w in w_values]
    
    plt.figure(figsize=(10, 6))
    plt.plot(w_values, area_values, 'b-', linewidth=2, label='A(w) = w(8-w)')
    plt.plot(w_critical, max_area_analytical, 'ro', markersize=10, 
             label=f'Maximum: ({w_critical}, {max_area_analytical})')
    plt.axvline(w_critical, color='r', linestyle='--', alpha=0.5)
    plt.xlabel('Width (w)')
    plt.ylabel('Area (A)')
    plt.title('Optimization: Maximize Rectangle Area')
    plt.legend()
    plt.grid(True)
    plt.show()
    
    return w_critical, h_critical, max_area_analytical

# Run optimization
width, height, area = optimization_problem()
print(f"\\nResult: {width} × {height} rectangle with area {area}")`,

    javascript: `// Optimization Problem: Maximize rectangle area with fixed perimeter

function findOptimalRectangle(perimeter) {
  // Problem Setup
  // Constraint: 2w + 2h = perimeter  =>  h = perimeter/2 - w
  // Objective: A(w) = w * h = w(perimeter/2 - w)
  
  const area = (w) => w * (perimeter / 2 - w);
  const derivative = (w) => perimeter / 2 - 2 * w;
  const secondDerivative = () => -2;
  
  console.log("=== Optimization Problem ===");
  console.log(\`Maximize area of rectangle with perimeter = \${perimeter}\`);
  
  // Method 1: Analytical (Calculus)
  // Find critical points: A'(w) = 0
  // perimeter/2 - 2w = 0
  // w = perimeter/4
  
  const wCritical = perimeter / 4;
  const hCritical = perimeter / 2 - wCritical;
  const maxArea = area(wCritical);
  
  console.log("\\n=== Analytical Solution ===");
  console.log(\`A(w) = w(\${perimeter/2} - w)\`);
  console.log(\`A'(w) = \${perimeter/2} - 2w\`);
  console.log(\`Critical point: w = \${wCritical}\`);
  
  // Verify it's a maximum (second derivative test)
  const a2 = secondDerivative();
  console.log(\`A''(w) = \${a2}\`);
  console.log(\`Since A''(w) < 0, w = \${wCritical} is a maximum ✓\`);
  
  console.log("\\n=== Optimal Solution ===");
  console.log(\`Width: \${wCritical}\`);
  console.log(\`Height: \${hCritical}\`);
  console.log(\`Maximum Area: \${maxArea}\`);
  console.log(\`Shape: \${wCritical === hCritical ? 'Square' : 'Rectangle'}\`);
  
  // Method 2: Numerical (Grid Search)
  let maxAreaNumerical = 0;
  let optimalW = 0;
  
  for (let w = 0; w <= perimeter / 2; w += 0.01) {
    const a = area(w);
    if (a > maxAreaNumerical) {
      maxAreaNumerical = a;
      optimalW = w;
    }
  }
  
  console.log("\\n=== Numerical Verification ===");
  console.log(\`Optimal w (grid search): \${optimalW.toFixed(4)}\`);
  console.log(\`Maximum area: \${maxAreaNumerical.toFixed(4)}\`);
  
  // Test different widths
  console.log("\\n=== Area at Different Widths ===");
  [1, 2, 3, 4, 5, 6, 7].forEach(w => {
    console.log(\`w = \${w}: A = \${area(w).toFixed(2)}, A' = \${derivative(w).toFixed(2)}\`);
  });
  
  return {
    width: wCritical,
    height: hCritical,
    area: maxArea,
    isSquare: wCritical === hCritical
  };
}

// Solve for perimeter = 16
const result = findOptimalRectangle(16);
console.log(\`\\nFinal Answer: \${result.width} × \${result.height} with area \${result.area}\`);`,

    mathematical: `OPTIMIZATION PROBLEM
━━━━━━━━━━━━━━━━━━━━

Problem: Find dimensions of rectangle with perimeter 16 
that maximize the area.


STEP 1: SET UP THE PROBLEM
━━━━━━━━━━━━━━━━━━━━━━━━━

Given:
• Perimeter P = 16
• Variables: width w, height h

Constraint:
    2w + 2h = 16
    h = 8 - w

Objective Function (to maximize):
    A(w) = w · h
         = w(8 - w)
         = 8w - w²


STEP 2: FIND CRITICAL POINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Take derivative and set to zero:
    
    A'(w) = d/dw[8w - w²]
          = 8 - 2w
    
    Set A'(w) = 0:
        8 - 2w = 0
        2w = 8
        w = 4

When w = 4:
    h = 8 - 4 = 4


STEP 3: VERIFY IT'S A MAXIMUM
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Second Derivative Test:
    
    A''(w) = d/dw[8 - 2w]
           = -2
    
    Since A''(4) = -2 < 0, w = 4 is a MAXIMUM ✓


STEP 4: CALCULATE MAXIMUM AREA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    A(4) = 4 × 4 = 16 square units


SOLUTION
━━━━━━━━

Optimal Dimensions:
    Width: w = 4 units
    Height: h = 4 units
    Shape: SQUARE

Maximum Area:
    A = 16 square units

Interpretation:
    Among all rectangles with perimeter 16,
    the square (4×4) has the largest area.


WHY IS IT A SQUARE?
━━━━━━━━━━━━━━━━━━━

For fixed perimeter, area is maximized when w = h.

Proof: Since h = 8 - w, we have:
    A(w) = w(8 - w) = 8w - w²

This is a downward parabola with vertex at:
    w = -b/2a = -8/(2·(-1)) = 4

At w = 4: h = 8 - 4 = 4, so w = h (square!)


GENERAL PRINCIPLE
━━━━━━━━━━━━━━━━━

Optimization Steps:
1. Identify constraint and objective
2. Express objective as function of one variable
3. Find derivative, set = 0
4. Solve for critical points
5. Verify max/min with second derivative
6. Check endpoints if domain is bounded`
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
            <li className="text-gray-900 font-medium">Optimization</li>
          </ol>
        </nav>

        <article className="space-y-8">
          <header className="space-y-4 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">Calculus</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">Intermediate</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Optimization Problems
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Learn to find maximum and minimum values using derivatives. Master critical points, the second derivative test, and real-world optimization applications.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Problem Statement</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
              <p className="text-gray-700">
                Find the dimensions of a rectangle with a <strong>fixed perimeter of 16 units</strong> that maximize the area.
              </p>
              
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">Analysis:</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Constraint:</span> 2w + 2h = 16, so h = 8 - w</p>
                  <p><span className="font-medium">Objective:</span> Maximize A(w) = w · h = w(8 - w) = 8w - w²</p>
                  <p><span className="font-medium">Method:</span> Find where A'(w) = 0</p>
                  <p className="text-gray-600"><span className="font-medium">Solution:</span> w = 4, h = 4 (square), Max Area = 16</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Intuition</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Optimization problems use derivatives to find <strong>maximum</strong> or <strong>minimum</strong> values. 
                At these optimal points, the derivative equals zero (horizontal tangent), making them <strong>critical points</strong>.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <p className="text-sm text-blue-900">
                  <strong>Key Concept:</strong> To optimize f(x), find where f'(x) = 0 (critical points), then use the 
                  second derivative test: if f''(x) &lt; 0, it's a maximum; if f''(x) &gt; 0, it's a minimum.
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed">
                For our rectangle problem, A(w) = 8w - w² gives A'(w) = 8 - 2w. Setting this to zero: 8 - 2w = 0, so w = 4. 
                Since A''(w) = -2 &lt; 0, this is indeed a maximum. Interestingly, the optimal shape is a <strong>square</strong>!
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 my-4">
                <h4 className="font-semibold text-purple-900 mb-2">General Strategy:</h4>
                <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
                  <li>Identify constraint and objective function</li>
                  <li>Express objective in terms of one variable</li>
                  <li>Find derivative and set equal to zero</li>
                  <li>Solve for critical points</li>
                  <li>Verify max/min using second derivative test</li>
                  <li>Check boundary points if applicable</li>
                </ol>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Interactive Visualization</h2>
            <p className="text-gray-600">
              Adjust the rectangle width to see how the area changes. Notice the area is maximized when the rectangle becomes a square (w = h = 4).
            </p>
            <OptimizationVisualizer />
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
                  {selectedLanguage === 'mathematical' ? 'Mathematical Solution' : selectedLanguage === 'python' ? 'optimization.py' : 'optimization.js'}
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
            <h2 className="text-2xl font-bold text-gray-900">Classic Optimization Problems</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Box Volume</h3>
                <p className="text-blue-800 text-sm mb-2">
                  Maximize volume by cutting corners from a square sheet
                </p>
                <p className="text-blue-700 text-xs">
                  V(x) = x(a-2x)², find optimal cut size x
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Fence Enclosure</h3>
                <p className="text-green-800 text-sm mb-2">
                  Maximize area with fixed amount of fencing
                </p>
                <p className="text-green-700 text-xs">
                  Similar to rectangle problem, optimal is square
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Can Design</h3>
                <p className="text-purple-800 text-sm mb-2">
                  Minimize surface area for fixed volume (cylinder)
                </p>
                <p className="text-purple-700 text-xs">
                  A = 2πr² + 2πrh with V = πr²h constant
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Shortest Distance</h3>
                <p className="text-orange-800 text-sm mb-2">
                  Find point on curve closest to a given point
                </p>
                <p className="text-orange-700 text-xs">
                  Minimize D² = (x-a)² + (f(x)-b)²
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
                <p className="text-sm text-gray-600">Foundation for finding critical points</p>
              </Link>
              
              <Link href="/math-visualizer/problems/chain-rule" className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors group">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600">
                  Chain Rule
                </h3>
                <p className="text-sm text-gray-600">Useful for complex optimization problems</p>
              </Link>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Lagrange Multipliers
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Optimization with multiple constraints</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Linear Programming
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Optimization for linear systems</p>
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
