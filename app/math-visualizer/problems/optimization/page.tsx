import type { Metadata } from 'next';
import { Callout, CardGrid, type CardGridItem, type CodeSample, CodeTabs, ContentSection, DetailPage, Prose, type RelatedEntry, RelatedItems, StepList } from '@/components/content';
import OptimizationVisualizer from './OptimizationVisualizer';

export const metadata: Metadata = {
  title: 'Optimization Problems - Calculus | AllVisualizer',
  description:
    'Master optimization using derivatives. Learn to find maximum and minimum values, critical points, and solve real-world optimization problems with interactive visualizations.',
  keywords: ['optimization', 'calculus', 'maximum', 'minimum', 'critical points', 'second derivative test', 'applied calculus'],
  openGraph: {
    title: 'Optimization Problems - Interactive Calculus | AllVisualizer',
    description: 'Master optimization with derivatives and critical points',
  },
};

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `import numpy as np
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
  },
  {
    label: 'JavaScript',
    language: 'javascript',
    code: `// Optimization Problem: Maximize rectangle area with fixed perimeter

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
  },
  {
    label: 'Math',
    language: 'text',
    code: `OPTIMIZATION PROBLEM
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
6. Check endpoints if domain is bounded`,
  },
];
const strategy = [
  'Identify the constraint and the objective function.',
  'Express the objective in terms of one variable.',
  'Find the derivative and set it equal to zero.',
  'Solve for the critical points.',
  'Verify max/min using the second derivative test.',
  'Check boundary points if applicable.',
];

const classicProblems: CardGridItem[] = [
  { title: 'Box volume', description: <><p>Maximize volume by cutting corners from a square sheet.</p><p>V(x) = x(a − 2x)², find the optimal cut size x.</p></> },
  { title: 'Fence enclosure', description: <><p>Maximize area with a fixed amount of fencing.</p><p>Similar to the rectangle problem: the optimal shape is a square.</p></> },
  { title: 'Can design', description: <><p>Minimize surface area for a fixed volume (cylinder).</p><p>A = 2πr² + 2πrh with V = πr²h constant.</p></> },
  { title: 'Shortest distance', description: <><p>Find the point on a curve closest to a given point.</p><p>Minimize D² = (x − a)² + (f(x) − b)².</p></> },
];

const relatedTopics: RelatedEntry[] = [
  { slug: 'derivatives', note: 'Foundation for finding critical points' },
  { slug: 'chain-rule', note: 'Useful for complex optimization problems' },
  { title: 'Lagrange Multipliers', note: 'Optimization with multiple constraints' },
  { title: 'Linear Programming', note: 'Optimization for linear systems' },
];

export default function OptimizationPage() {
  return (
    <DetailPage
      subject="math"
      item="optimization"
      width="narrow"
      description="Learn to find maximum and minimum values using derivatives. Master critical points, the second derivative test, and real-world optimization applications."
    >
      <ContentSection title="Problem statement">
        <Prose>
          <p>
            Find the dimensions of a rectangle with a <strong>fixed perimeter of 16 units</strong> that maximize the area.
          </p>
        </Prose>
        <Callout tone="example" title="Analysis" className="mt-5">
          <p><strong>Constraint:</strong> 2w + 2h = 16, so h = 8 − w</p>
          <p><strong>Objective:</strong> Maximize A(w) = w · h = w(8 − w) = 8w − w²</p>
          <p><strong>Method:</strong> Find where A&apos;(w) = 0</p>
          <p><strong>Solution:</strong> w = 4, h = 4 (square), max area = 16</p>
        </Callout>
      </ContentSection>

      <ContentSection title="Intuition">
        <Prose>
          <p>
            Optimization problems use derivatives to find <strong>maximum</strong> or <strong>minimum</strong> values. At
            these optimal points, the derivative equals zero (horizontal tangent), making them{' '}
            <strong>critical points</strong>.
          </p>
        </Prose>
        <Callout tone="formula" title="Key concept" className="my-5">
          To optimize f(x), find where f&apos;(x) = 0 (critical points), then use the second derivative test: if
          f&apos;&apos;(x) &lt; 0, it&apos;s a maximum; if f&apos;&apos;(x) &gt; 0, it&apos;s a minimum.
        </Callout>
        <Prose>
          <p>
            For our rectangle problem, A(w) = 8w − w² gives A&apos;(w) = 8 − 2w. Setting this to zero: 8 − 2w = 0, so
            w = 4. Since A&apos;&apos;(w) = −2 &lt; 0, this is indeed a maximum. Interestingly, the optimal shape is a{' '}
            <strong>square</strong>!
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="General strategy" variant="card">
        <StepList steps={strategy} />
      </ContentSection>

      <ContentSection
        title="Interactive visualization"
        description="Adjust the rectangle width to see how the area changes. Notice the area is maximized when the rectangle becomes a square (w = h = 4)."
      >
        <OptimizationVisualizer />
      </ContentSection>

      <ContentSection title="Implementation">
        <CodeTabs samples={samples} />
      </ContentSection>

      <ContentSection title="Classic optimization problems">
        <CardGrid items={classicProblems} />
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems subject="math" items={relatedTopics} />
      </ContentSection>
    </DetailPage>
  );
}
