import type { Metadata } from 'next';
import { Callout, type CodeSample, CodeTabs, Complexity, ContentSection, DetailPage, Prose, type RelatedEntry, RelatedItems } from '@/components/content';
import DerivativeVisualizer from './DerivativeVisualizer';

export const metadata: Metadata = {
  title: 'Understanding Derivatives - Math Visualizer | AllVisualizer',
  description:
    'Learn derivatives through interactive visualizations. Master instantaneous rate of change, tangent lines, and differentiation with step-by-step examples.',
  keywords: ['derivatives', 'calculus', 'differentiation', 'tangent line', 'rate of change', 'power rule'],
  openGraph: {
    title: 'Understanding Derivatives - Interactive Learning | AllVisualizer',
    description: 'Master derivatives with interactive visualizations and examples',
  },
};

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `import numpy as np
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
  },
  {
    label: 'JavaScript',
    language: 'javascript',
    code: `// Calculate derivative using numerical differentiation
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
  },
  {
    label: 'Math',
    language: 'text',
    code: `DERIVATIVE DEFINITION
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
f(x) = cos(x)   →  f'(x) = -sin(x)`,
  },
];
const relatedTopics: RelatedEntry[] = [
  { slug: 'chain-rule', note: 'Derivatives of composite functions' },
  { slug: 'integration-basics', note: 'The inverse operation of differentiation' },
  { slug: 'optimization', note: 'Finding maxima and minima using derivatives' },
  { title: 'Taylor Series', note: 'Approximating functions using derivatives' },
];

export default function DerivativesPage() {
  return (
    <DetailPage
      subject="math"
      item="derivatives"
      description="Learn how derivatives measure instantaneous rate of change and visualize tangent lines to understand the geometric interpretation of differentiation."
    >
      <ContentSection title="Problem statement">
        <Prose>
          <p>
            Given a function <code>f(x) = x²</code>, find the derivative at a point <code>x = a</code> and visualize the
            tangent line at that point.
          </p>
        </Prose>
        <Callout tone="example" title="Example" className="mt-5">
          <p><strong>Input:</strong> f(x) = x², a = 2</p>
          <p><strong>Output:</strong> f&apos;(2) = 4</p>
          <p>Tangent line: y = 4x − 4</p>
        </Callout>
      </ContentSection>

      <ContentSection title="Intuition">
        <Prose>
          <p>
            The derivative represents the <strong>instantaneous rate of change</strong> of a function. Geometrically,
            it&apos;s the slope of the tangent line to the curve at a specific point.
          </p>
        </Prose>
        <Callout tone="note" title="Key concept" className="my-5">
          While the average rate of change uses two points, the derivative captures the rate of change at a single
          instant by taking the limit as the interval approaches zero.
        </Callout>
        <Prose>
          <p>
            For <code>f(x) = x²</code>, the derivative is <code>f&apos;(x) = 2x</code>. At x = 2, the slope is 4, meaning
            the function is increasing at a rate of 4 units vertically for every 1 unit horizontally.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection
        title="Interactive visualization"
        description="Drag the point along the curve to see how the derivative (tangent line slope) changes."
      >
        <DerivativeVisualizer />
      </ContentSection>

      <ContentSection title="Implementation">
        <CodeTabs samples={samples} />
      </ContentSection>

      <ContentSection title="Computational complexity">
        <Complexity
          time="O(1)"
          timeNote="Analytical derivative: using calculus rules, the derivative is computed instantly."
          space="O(1)"
          spaceNote="Constant space: only stores the result value."
        />
        <Callout tone="warning" title="Note" className="mt-5">
          Numerical differentiation (as shown in the code) requires O(1) function evaluations but may have precision
          errors. Symbolic differentiation using calculus rules is exact.
        </Callout>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems subject="math" current="derivatives" items={relatedTopics} />
      </ContentSection>
    </DetailPage>
  );
}
