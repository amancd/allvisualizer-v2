import type { Metadata } from 'next';
import { Callout, CardGrid, type CardGridItem, type CodeSample, CodeTabs, ContentSection, DetailPage, Prose, type RelatedEntry, RelatedItems } from '@/components/content';
import IntegrationVisualizer from './IntegrationVisualizer';

export const metadata: Metadata = {
  title: 'Integration Basics - Calculus | AllVisualizer',
  description:
    'Learn integration through interactive visualizations. Master antiderivatives, the Fundamental Theorem of Calculus, and area under curves with step-by-step examples.',
  keywords: ['integration', 'calculus', 'antiderivatives', 'definite integral', 'fundamental theorem', 'area under curve'],
  openGraph: {
    title: 'Integration Basics - Interactive Calculus | AllVisualizer',
    description: 'Master integration and antiderivatives with interactive visualizations',
  },
};

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `import numpy as np
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
  },
  {
    label: 'JavaScript',
    language: 'javascript',
    code: `// Numerical integration using Riemann sum (midpoint rule)
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
  },
  {
    label: 'Math',
    language: 'text',
    code: `INTEGRATION BASICS
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

As n → ∞, the approximation becomes exact.`,
  },
];
const properties: CardGridItem[] = [
  { title: 'Linearity', description: <><p>∫[af(x) + bg(x)]dx = a∫f(x)dx + b∫g(x)dx</p><p>Constants and sums can be separated.</p></> },
  { title: 'Reverses differentiation', description: <><p>d/dx[∫f(x)dx] = f(x)</p><p>Integration undoes differentiation.</p></> },
  { title: 'Additivity', description: <><p>∫ₐᶜf(x)dx = ∫ₐᵇf(x)dx + ∫ᵇᶜf(x)dx</p><p>Areas can be split and combined.</p></> },
  { title: 'Zero width', description: <><p>∫ₐᵃf(x)dx = 0</p><p>No area when the bounds are equal.</p></> },
];

const relatedTopics: RelatedEntry[] = [
  { slug: 'derivatives', note: 'The inverse operation of integration' },
  { title: 'Substitution Rule', note: 'Integration technique for composite functions' },
  { title: 'Integration by Parts', note: 'Integration technique for products' },
  { title: 'Applications of Integration', note: 'Volume, work, and physics applications' },
];

export default function IntegrationBasicsPage() {
  return (
    <DetailPage
      subject="math"
      item="integration-basics"
      description="Learn about antiderivatives and the area under curves. Master the Fundamental Theorem of Calculus and understand how integration reverses differentiation."
    >
      <ContentSection title="Problem statement">
        <Prose>
          <p>
            Given a function <code>f(x) = x²</code>, find the area under the curve from <code>x = 0</code> to{' '}
            <code>x = b</code> using integration.
          </p>
        </Prose>
        <Callout tone="example" title="Example" className="mt-5">
          <p><strong>Input:</strong> f(x) = x², bounds [0, 2]</p>
          <p><strong>Output:</strong> ∫₀² x² dx = 8/3 ≈ 2.667</p>
          <p>Method: F(x) = x³/3, so F(2) − F(0) = 8/3</p>
        </Callout>
      </ContentSection>

      <ContentSection title="Intuition">
        <Prose>
          <p>
            Integration calculates the <strong>area under a curve</strong>. While derivatives measure rates of change,
            integrals measure accumulation. The definite integral ∫ₐᵇ f(x) dx represents the total area between the
            function f(x) and the x-axis from a to b.
          </p>
        </Prose>
        <Callout tone="formula" title="Key concept" className="my-5">
          The Fundamental Theorem of Calculus connects differentiation and integration. If F&apos;(x) = f(x), then
          ∫ₐᵇ f(x) dx = F(b) − F(a). This means we can find areas by finding antiderivatives!
        </Callout>
        <Prose>
          <p>
            For f(x) = x², the antiderivative is F(x) = x³/3 (since d/dx[x³/3] = x²). To find the area from 0 to 2, we
            evaluate F(2) − F(0) = 8/3 − 0 = 8/3 ≈ 2.667.
          </p>
        </Prose>
        <Callout tone="tip" title="Riemann sums" className="mt-5">
          We can approximate the area using rectangles (Riemann sums). As we use more rectangles, the approximation gets
          closer to the exact integral value.
        </Callout>
      </ContentSection>

      <ContentSection
        title="Interactive visualization"
        description="Drag the upper bound to see how the area under the curve changes. Notice the Riemann rectangles approximating the integral."
      >
        <IntegrationVisualizer />
      </ContentSection>

      <ContentSection title="Implementation">
        <CodeTabs samples={samples} />
      </ContentSection>

      <ContentSection title="Key properties">
        <CardGrid items={properties} />
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems subject="math" current="integration-basics" items={relatedTopics} />
      </ContentSection>
    </DetailPage>
  );
}
