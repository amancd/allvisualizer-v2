import type { Metadata } from 'next';
import { Callout, CardGrid, type CardGridItem, type CodeSample, CodeTabs, ContentSection, DetailPage, Prose, type RelatedEntry, RelatedItems } from '@/components/content';
import ChainRuleVisualizer from './ChainRuleVisualizer';

export const metadata: Metadata = {
  title: 'Chain Rule - Calculus | AllVisualizer',
  description:
    'Master the chain rule for composite functions. Learn to differentiate complex functions with interactive visualizations and step-by-step examples.',
  keywords: ['chain rule', 'composite functions', 'calculus', 'derivatives', 'differentiation'],
  openGraph: {
    title: 'Chain Rule - Interactive Calculus | AllVisualizer',
    description: 'Master composite function derivatives with the chain rule',
  },
};

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `import numpy as np
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
  },
  {
    label: 'JavaScript',
    language: 'javascript',
    code: `// Chain Rule implementation
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
  },
  {
    label: 'Math',
    language: 'text',
    code: `CHAIN RULE
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
ln(f(x))       →  f'(x)/f(x)`,
  },
];
const applications: CardGridItem[] = [
  { title: 'Polynomial compositions', description: <><p>h(x) = (x² + 3x)⁵</p><p>h&apos;(x) = 5(x² + 3x)⁴ · (2x + 3)</p></> },
  { title: 'Trigonometric functions', description: <><p>h(x) = sin(x²)</p><p>h&apos;(x) = cos(x²) · 2x</p></> },
  { title: 'Exponential functions', description: <><p>h(x) = e<sup>x²</sup></p><p>h&apos;(x) = e<sup>x²</sup> · 2x</p></> },
  { title: 'Logarithmic functions', description: <><p>h(x) = ln(x² + 1)</p><p>h&apos;(x) = 2x / (x² + 1)</p></> },
];

const relatedTopics: RelatedEntry[] = [
  { slug: 'derivatives', note: 'Review fundamental derivative rules' },
  { title: 'Product Rule', note: 'Derivatives of products of functions' },
  { title: 'Implicit Differentiation', note: 'Chain rule with implicit functions' },
  { title: 'Related Rates', note: 'Apply the chain rule to real-world problems' },
];

export default function ChainRulePage() {
  return (
    <DetailPage
      subject="math"
      item="chain-rule"
      title="The Chain Rule"
      description="Master the chain rule to find derivatives of composite functions. Learn how to break down complex functions and apply differentiation step by step."
    >
      <ContentSection title="Problem statement">
        <Prose>
          <p>
            Given a composite function <code>h(x) = f(g(x))</code>, find its derivative using the chain rule.
          </p>
        </Prose>
        <Callout tone="example" title="Example" className="mt-5">
          <p><strong>Given:</strong> h(x) = x² + 1, where g(x) = x² and f(u) = u + 1</p>
          <p><strong>Find:</strong> h&apos;(x) using the chain rule</p>
          <p>Solution: h&apos;(x) = f&apos;(g(x)) · g&apos;(x) = 1 · 2x = 2x</p>
        </Callout>
      </ContentSection>

      <ContentSection title="Intuition">
        <Prose>
          <p>
            The chain rule handles <strong>composite functions</strong>: functions within functions. Think of it as
            unwrapping layers: differentiate the outer function, then multiply by the derivative of the inner function.
          </p>
        </Prose>
        <Callout tone="formula" title="Key concept" className="my-5">
          If h(x) = f(g(x)), then h&apos;(x) = f&apos;(g(x)) · g&apos;(x). You evaluate the outer derivative <em>at</em> the
          inner function, then multiply by the inner derivative.
        </Callout>
        <Prose>
          <p>
            For our example h(x) = x² + 1, we identify g(x) = x² (inner) and f(u) = u + 1 (outer). Then g&apos;(x) = 2x and
            f&apos;(u) = 1, so h&apos;(x) = 1 · 2x = 2x.
          </p>
        </Prose>
        <Callout tone="tip" title="Why it works" className="mt-5">
          The chain rule accounts for how changes in x affect g(x), which in turn affects f(g(x)). It&apos;s the rate of
          change &quot;chained&quot; through multiple layers.
        </Callout>
      </ContentSection>

      <ContentSection
        title="Interactive visualization"
        description="Drag the point to see how the chain rule computes the derivative of the composite function."
      >
        <ChainRuleVisualizer />
      </ContentSection>

      <ContentSection title="Implementation">
        <CodeTabs samples={samples} />
      </ContentSection>

      <ContentSection title="Common applications">
        <CardGrid items={applications} />
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems subject="math" current="chain-rule" items={relatedTopics} />
      </ContentSection>
    </DetailPage>
  );
}
