import type { Metadata } from 'next';
import {
  Callout,
  CardGrid,
  CodeTabs,
  ContentSection,
  DetailPage,
  Formula,
  PracticeProblem,
  Prose,
  StepList,
  type CardGridItem,
} from '@/components/content';
import GradientDescentVisualizer from './GradientDescentVisualizer';

export const metadata: Metadata = {
  title: 'Gradient Descent - AI/ML Visualizer | AllVisualizer',
  description:
    'Compare plain gradient descent, momentum and Adam on 2D loss surfaces: a bowl, an elongated valley, the Rosenbrock function and a surface with several minima. See how the learning rate causes divergence.',
  keywords: ['gradient descent', 'learning rate', 'momentum', 'Adam optimizer', 'loss surface', 'Rosenbrock', 'optimization'],
};

const lessons: CardGridItem[] = [
  { title: 'Learning rate too small', description: 'Every step is safe but tiny. On the Rosenbrock surface plain GD is still far from (1, 1) after 2000 steps.' },
  { title: 'Learning rate too large', description: 'On the valley, raise η past 0.5 and GD overshoots further each step along y until it flies off the plot.' },
  { title: 'Momentum', description: 'Accumulates velocity along directions where the gradient keeps pointing the same way, and cancels zig-zags across a valley.' },
  { title: 'Adam', description: 'Divides each coordinate by a running RMS of its gradient, so steep and flat directions both take steps of about α.' },
];

const code = [
  {
    label: 'Python',
    language: 'python',
    code: `import numpy as np

def grad(p):                        # elongated valley f = 0.1x² + 2y²
    return np.array([0.2 * p[0], 4 * p[1]])

def gd(p, lr=0.4, steps=100):
    for _ in range(steps):
        p = p - lr * grad(p)
    return p

def momentum(p, lr=0.4, beta=0.9, steps=100):
    v = np.zeros_like(p)
    for _ in range(steps):
        v = beta * v - lr * grad(p)
        p = p + v
    return p

def adam(p, lr=0.1, b1=0.9, b2=0.999, eps=1e-8, steps=100):
    m, s = np.zeros_like(p), np.zeros_like(p)
    for t in range(1, steps + 1):
        g = grad(p)
        m = b1 * m + (1 - b1) * g
        s = b2 * s + (1 - b2) * g * g
        m_hat, s_hat = m / (1 - b1 ** t), s / (1 - b2 ** t)
        p = p - lr * m_hat / (np.sqrt(s_hat) + eps)
    return p`,
  },
];

export default function GradientDescentPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="gradient-descent"
      description="Training a model means walking downhill on its loss surface. Drop three optimizers at the same point and watch how plain gradient descent, momentum and Adam find their way to a minimum, or fail to."
    >
      <GradientDescentVisualizer />

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose a loss surface. Dark regions have low loss; white crosses mark the minima.',
            'Click or tap anywhere on the contour plot to start all three optimizers from that point.',
            'Press Run (or Step) and compare the red (GD), blue (momentum) and green (Adam) trails.',
            'Drag the learning-rate slider. On the bowl and the valley, push η beyond 2 divided by the curvature and watch GD diverge.',
            'Read the loss chart: it shows log₁₀(f − f*), so a straight downward line means the error shrinks by a constant factor every step.',
          ]}
        />
      </ContentSection>

      <ContentSection title="What gradient descent does">
        <Prose>
          <p>
            The gradient <code>∇f</code> points in the direction in which the loss increases fastest. Gradient descent takes a
            step of size proportional to the learning rate in the opposite direction, then repeats. On a smooth bowl this
            always reaches the minimum, provided the steps are small enough.
          </p>
          <p>
            Real loss surfaces are rarely round bowls. They have long narrow valleys, where the gradient points mostly across
            the valley instead of along it, and several minima of different quality. Momentum and Adam are two widely used
            fixes: momentum remembers past gradients, and Adam rescales each parameter&apos;s step by how large its gradients
            have been.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={lessons} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Plain gradient descent">
            <Formula
              where={[
                { symbol: 'θ', meaning: 'parameters (here the point (x, y))' },
                { symbol: 'η', meaning: 'learning rate' },
              ]}
            >
              θ<sub>t+1</sub> = θ<sub>t</sub> − η ∇f(θ<sub>t</sub>)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Momentum (heavy ball)">
            <Formula where={[{ symbol: 'β', meaning: 'momentum coefficient, 0.9 here' }]}>
              v<sub>t+1</sub> = β v<sub>t</sub> − η ∇f(θ<sub>t</sub>),   θ<sub>t+1</sub> = θ<sub>t</sub> + v<sub>t+1</sub>
            </Formula>
          </Callout>
          <Callout tone="formula" title="Adam">
            <Formula>
              m<sub>t</sub> = β<sub>1</sub>m<sub>t−1</sub> + (1 − β<sub>1</sub>)g<sub>t</sub>,   s<sub>t</sub> = β<sub>2</sub>s
              <sub>t−1</sub> + (1 − β<sub>2</sub>)g<sub>t</sub>
              <sup>2</sup>
            </Formula>
            <Formula
              where={[
                { symbol: 'β₁, β₂', meaning: '0.9 and 0.999' },
                { symbol: 'm̂, ŝ', meaning: 'bias-corrected moments: m / (1 − β₁ᵗ), s / (1 − β₂ᵗ)' },
                { symbol: 'ε', meaning: '10⁻⁸, avoids division by zero' },
              ]}
            >
              θ<sub>t+1</sub> = θ<sub>t</sub> − α m̂<sub>t</sub> / (√ŝ<sub>t</sub> + ε)
            </Formula>
          </Callout>
          <Callout tone="warning" title="When does gradient descent diverge?">
            On a quadratic with curvatures λ<sub>1</sub>, …, λ<sub>n</sub> (the eigenvalues of the Hessian), each step
            multiplies the error along direction i by (1 − ηλ<sub>i</sub>). GD converges only if |1 − ηλ<sub>i</sub>| &lt; 1 for
            every i, that is η &lt; 2 / λ<sub>max</sub>. The steepest direction sets the limit, and the flattest direction then
            converges slowly: the ratio λ<sub>max</sub> / λ<sub>min</sub> (the condition number) measures how hard the problem is.
          </Callout>
          <Callout tone="note" title="Why Adam has its own step size">
            Adam&apos;s update is roughly α in each coordinate regardless of how steep the surface is, while GD&apos;s step is η
            times the gradient. The same number means very different step lengths for the two, so the visualizer gives Adam a
            separate slider.
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="In code">
        <CodeTabs samples={code} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Two steps by hand"
            question="Minimise f(x, y) = x² + y² with plain gradient descent, starting at (2, −1) with η = 0.1. Where are you after two steps, and by what factor does f shrink per step?"
            solution={
              <>
                <p>∇f = (2x, 2y), so θ ← θ − 0.1 × 2θ = 0.8 θ</p>
                <p>Step 1: (2, −1) × 0.8 = (1.6, −0.8)</p>
                <p>Step 2: (1.6, −0.8) × 0.8 = (1.28, −0.64)</p>
                <p>f scales with the square of the distance: 0.8² = 0.64 per step</p>
                <p className="font-semibold text-emerald-700">θ₂ = (1.28, −0.64); f drops from 5 to 2.048 (5 × 0.64²)</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: The largest stable learning rate"
            question="For f(x, y) = 0.1x² + 2y², what is the largest learning rate for which plain gradient descent converges? At that limit, roughly how many steps does it take to shrink the x-error by a factor of 10?"
            solution={
              <>
                <p>Hessian = diag(0.2, 4), so λ<sub>max</sub> = 4 and λ<sub>min</sub> = 0.2</p>
                <p>Stable when η &lt; 2 / λ<sub>max</sub> = 2 / 4 = 0.5</p>
                <p>Along x each step multiplies the error by 1 − ηλ<sub>min</sub> = 1 − 0.5 × 0.2 = 0.9</p>
                <p>0.9<sup>n</sup> = 0.1 gives n = ln 0.1 / ln 0.9 ≈ 21.9</p>
                <p className="font-semibold text-emerald-700">η &lt; 0.5; about 22 steps per factor of 10 along x</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
