'use client';

import { useState } from 'react';
import Link from 'next/link';
import GiscusComments from '@/components/ui/GiscusComments';
import ChainRuleVisualizer from './ChainRuleVisualizer';
import type { Metadata } from 'next';

// Note: Client components cannot export metadata in Next.js
// Metadata will fall back to parent layout
// export const metadata: Metadata = {
//   title: "Chain Rule - Calculus | AllVisualizer",
//   description: "Master the chain rule for composite functions. Learn to differentiate complex functions with interactive visualizations and step-by-step examples.",
//   keywords: ["chain rule", "composite functions", "calculus", "derivatives", "differentiation"],
// };

export default function ChainRulePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'mathematical'>('python');

  const codeExamples = {
    python: `import numpy as np
import matplotlib.pyplot as plt

def chain_rule_derivative(f, g, f_prime, g_prime, x):
    """
    Calculate derivative using chain rule: (f∘g)'(x) = f'(g(x)) · g'(x)
    
    Args:
        f: Outer function
        g: Inner function
        f_prime: Derivative of outer function
        g_prime: Derivative of inner function
        x: Point at which to evaluate
    
    Returns:
        Derivative of composite function at x
    """
    # Evaluate g(x)
    g_x = g(x)
    
    # Apply chain rule: f'(g(x)) · g'(x)
    derivative = f_prime(g_x) * g_prime(x)
    
    return derivative

# Example: h(x) = (x² + 1)
# Let g(x) = x² and f(u) = u + 1
# Then h(x) = f(g(x)) = x² + 1

# Define functions
g = lambda x: x**2        # Inner function
f = lambda u: u + 1       # Outer function
h = lambda x: f(g(x))     # Composite function

# Define derivatives
g_prime = lambda x: 2*x   # g'(x) = 2x
f_prime = lambda u: 1     # f'(u) = 1

# Calculate derivative at x = 2
x_point = 2
h_prime = chain_rule_derivative(f, g, f_prime, g_prime, x_point)
print(f"h'({x_point}) = {h_prime}")  # Output: 4

# Verify: h(x) = x² + 1, so h'(x) = 2x
# At x = 2: h'(2) = 2(2) = 4 ✓`,

    javascript: `// Chain Rule implementation
function chainRuleDerivative(f, g, fPrime, gPrime, x) {
  // Calculate derivative: (f∘g)'(x) = f'(g(x)) · g'(x)
  
  // Step 1: Evaluate inner function at x
  const gx = g(x);
  
  // Step 2: Evaluate outer derivative at g(x)
  const fPrimeAtGx = fPrime(gx);
  
  // Step 3: Evaluate inner derivative at x
  const gPrimeAtX = gPrime(x);
  
  // Step 4: Multiply (Chain Rule)
  const derivative = fPrimeAtGx * gPrimeAtX;
  
  return derivative;
}

// Example: h(x) = x² + 1
// Decompose as: g(x) = x², f(u) = u + 1

const g = (x) => x * x;           // Inner: g(x) = x²
const f = (u) => u + 1;           // Outer: f(u) = u + 1
const h = (x) => f(g(x));         // Composite: h(x) = x² + 1

const gPrime = (x) => 2 * x;      // g'(x) = 2x
const fPrime = (u) => 1;          // f'(u) = 1

// Calculate derivative at x = 2
const xPoint = 2;
const hPrime = chainRuleDerivative(f, g, fPrime, gPrime, xPoint);

console.log(\`h'(\${xPoint}) = \${hPrime}\`);  // Output: h'(2) = 4

// Verification: h'(x) = 2x, so h'(2) = 4 ✓`,

    mathematical: `CHAIN RULE
━━━━━━━━━━

For composite function h(x) = f(g(x)):

    h'(x) = f'(g(x)) · g'(x)

"Derivative of outer (at inner) times derivative of inner"


EXAMPLE: h(x) = (x² + 1)
━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Identify inner and outer functions
    g(x) = x²       (inner)
    f(u) = u + 1    (outer)
    h(x) = f(g(x))  (composite)

Step 2: Find derivatives
    g'(x) = 2x
    f'(u) = 1

Step 3: Apply chain rule
    h'(x) = f'(g(x)) · g'(x)
          = f'(x²) · 2x
          = 1 · 2x
          = 2x

Step 4: Verify at x = 2
    h'(2) = 2(2) = 4 ✓


MORE COMPLEX EXAMPLE: h(x) = sin(x²)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    g(x) = x²           →  g'(x) = 2x
    f(u) = sin(u)       →  f'(u) = cos(u)
    
    h'(x) = f'(g(x)) · g'(x)
          = cos(x²) · 2x
          = 2x·cos(x²)


NESTED CHAIN RULE: h(x) = (sin(x²) + 1)³
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Let u = sin(x²) + 1, then h = u³

    dh/dx = dh/du · du/dx
    
    dh/du = 3u²
    du/dx = cos(x²) · 2x  (chain rule again!)
    
    dh/dx = 3(sin(x²) + 1)² · 2x·cos(x²)


COMMON PATTERNS
━━━━━━━━━━━━━━━

(f(x))ⁿ        →  n·(f(x))ⁿ⁻¹ · f'(x)
sin(f(x))      →  cos(f(x)) · f'(x)
eᶠ⁽ˣ⁾          →  eᶠ⁽ˣ⁾ · f'(x)
ln(f(x))       →  f'(x)/f(x)`
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
            <li className="text-gray-900 font-medium">Chain Rule</li>
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
              The Chain Rule
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Master the chain rule to find derivatives of composite functions. Learn how to break down complex functions and apply differentiation step by step.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Problem Statement</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
              <p className="text-gray-700">
                Given a composite function <code className="px-2 py-0.5 bg-white border border-gray-200 rounded text-sm">h(x) = f(g(x))</code>, 
                find its derivative using the chain rule.
              </p>
              
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">Example:</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Given:</span> h(x) = (x²) + 1, where g(x) = x² and f(u) = u + 1</p>
                  <p><span className="font-medium">Find:</span> h'(x) using the chain rule</p>
                  <p className="text-gray-600">Solution: h'(x) = f'(g(x)) · g'(x) = 1 · 2x = 2x</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Intuition</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                The chain rule handles <strong>composite functions</strong> - functions within functions. Think of it as 
                unwrapping layers: differentiate the outer function, then multiply by the derivative of the inner function.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <p className="text-sm text-blue-900">
                  <strong>Key Concept:</strong> If h(x) = f(g(x)), then h'(x) = f'(g(x)) · g'(x). 
                  You evaluate the outer derivative <em>at</em> the inner function, then multiply by the inner derivative.
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed">
                For our example h(x) = x² + 1, we identify g(x) = x² (inner) and f(u) = u + 1 (outer). 
                Then g'(x) = 2x and f'(u) = 1, so h'(x) = 1 · 2x = 2x.
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 my-4">
                <h4 className="font-semibold text-purple-900 mb-2">Why it works:</h4>
                <p className="text-sm text-purple-800">
                  The chain rule accounts for how changes in x affect g(x), which in turn affects f(g(x)). 
                  It's the rate of change "chained" through multiple layers.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Interactive Visualization</h2>
            <p className="text-gray-600">
              Drag the point to see how the chain rule computes the derivative of the composite function.
            </p>
            <ChainRuleVisualizer />
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
                  {selectedLanguage === 'mathematical' ? 'Mathematical Notation' : selectedLanguage === 'python' ? 'chain_rule.py' : 'chain_rule.js'}
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
            <h2 className="text-2xl font-bold text-gray-900">Common Applications</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Polynomial Compositions</h3>
                <p className="text-purple-800 text-sm mb-2">
                  h(x) = (x² + 3x)⁵
                </p>
                <p className="text-purple-700 text-xs">
                  h'(x) = 5(x² + 3x)⁴ · (2x + 3)
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Trigonometric Functions</h3>
                <p className="text-blue-800 text-sm mb-2">
                  h(x) = sin(x²)
                </p>
                <p className="text-blue-700 text-xs">
                  h'(x) = cos(x²) · 2x
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Exponential Functions</h3>
                <p className="text-green-800 text-sm mb-2">
                  h(x) = e^(x²)
                </p>
                <p className="text-green-700 text-xs">
                  h'(x) = e^(x²) · 2x
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Logarithmic Functions</h3>
                <p className="text-orange-800 text-sm mb-2">
                  h(x) = ln(x² + 1)
                </p>
                <p className="text-orange-700 text-xs">
                  h'(x) = 2x/(x² + 1)
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Related Topics</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/math-visualizer/problems/derivatives" className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors group">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600">
                  Basic Derivatives
                </h3>
                <p className="text-sm text-gray-600">Review fundamental derivative rules</p>
              </Link>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Product Rule
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Derivatives of products of functions</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Implicit Differentiation
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Chain rule with implicit functions</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Related Rates
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Apply chain rule to real-world problems</p>
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
