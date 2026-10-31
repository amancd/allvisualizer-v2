import type { Metadata } from 'next';
import {
  Callout,
  CardGrid,
  CodeTabs,
  ContentSection,
  DataTable,
  DetailPage,
  Formula,
  PracticeProblem,
  Prose,
  StepList,
  type CardGridItem,
} from '@/components/content';
import ActivationFunctionsVisualizer from './ActivationFunctionsVisualizer';

export const metadata: Metadata = {
  title: 'Activation Functions - AI/ML Visualizer | AllVisualizer',
  description:
    'Compare sigmoid, tanh, ReLU, Leaky ReLU, GELU and softplus with their derivatives, see where they saturate and cause vanishing gradients, and explore softmax with temperature.',
  keywords: ['activation function', 'sigmoid', 'tanh', 'ReLU', 'GELU', 'softplus', 'softmax', 'vanishing gradient', 'neural network'],
};

const properties = [
  { name: 'Sigmoid', range: '(0, 1)', maxGrad: '0.25', zeroCentered: 'No', saturates: 'Both sides' },
  { name: 'Tanh', range: '(−1, 1)', maxGrad: '1', zeroCentered: 'Yes', saturates: 'Both sides' },
  { name: 'ReLU', range: '[0, ∞)', maxGrad: '1', zeroCentered: 'No', saturates: 'x < 0 (gradient is exactly 0)' },
  { name: 'Leaky ReLU', range: '(−∞, ∞)', maxGrad: '1', zeroCentered: 'Roughly', saturates: 'Never' },
  { name: 'GELU', range: '≈ [−0.17, ∞)', maxGrad: '≈ 1.13', zeroCentered: 'Roughly', saturates: 'Far negative x' },
  { name: 'Softplus', range: '(0, ∞)', maxGrad: '1 (limit)', zeroCentered: 'No', saturates: 'Far negative x' },
];

const whenToUse: CardGridItem[] = [
  { title: 'Hidden layers (default)', description: 'ReLU or one of its relatives. Cheap to compute and the gradient is exactly 1 for positive inputs.' },
  { title: 'Transformers', description: 'GELU is the standard choice in BERT and GPT-style models: a smooth ReLU that lets small negative values through.' },
  { title: 'Binary output', description: 'Sigmoid on the final layer turns a score into a probability, paired with binary cross-entropy.' },
  { title: 'Multi-class output', description: 'Softmax turns a vector of scores into a probability distribution, paired with cross-entropy.' },
];

const code = [
  {
    label: 'Python',
    language: 'python',
    code: `import numpy as np
from scipy.special import erf

def sigmoid(x):  return 1 / (1 + np.exp(-x))
def d_sigmoid(x): s = sigmoid(x); return s * (1 - s)

def relu(x):     return np.maximum(0, x)
def d_relu(x):   return (x > 0).astype(float)

def gelu(x):     return x * 0.5 * (1 + erf(x / np.sqrt(2)))

def softmax(z, T=1.0):
    z = np.asarray(z) / T
    e = np.exp(z - z.max())        # subtract the max for numerical stability
    return e / e.sum()

print(softmax([2, 1, 0.1]))        # [0.659 0.242 0.099]`,
  },
  {
    label: 'TypeScript',
    language: 'typescript',
    code: `const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const dSigmoid = (x: number) => sigmoid(x) * (1 - sigmoid(x));

const relu = (x: number) => Math.max(0, x);
const dRelu = (x: number) => (x > 0 ? 1 : 0);

function softmax(z: number[], T = 1): number[] {
  const scaled = z.map((v) => v / T);
  const max = Math.max(...scaled);              // numerical stability
  const exps = scaled.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}`,
  },
];

export default function ActivationFunctionsPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="activation-functions"
      description="Activation functions give neural networks their non-linearity. Compare the common ones side by side, read off their derivatives, and see why some of them make deep networks hard to train."
    >
      <ActivationFunctionsVisualizer />

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Toggle functions on and off with the coloured chips above the plot. Solid lines are f(x), dashed lines are the derivatives f′(x).',
            'Hover or drag across the plot (or use the marker slider) to read f(x) and f′(x) for every visible function in the table.',
            'Pick a function to highlight. The amber bands show where its derivative is below 0.1: the saturated regions.',
            'Raise the network depth and watch f′(x) raised to that power collapse towards zero for sigmoid and tanh.',
            'In the softmax panel, drag the logits and the temperature, and add or remove classes, to see how scores become probabilities.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Why networks need activation functions">
        <Prose>
          <p>
            A neuron computes a weighted sum <code>z = w·x + b</code> and then applies an activation <code>a = f(z)</code>.
            Without <code>f</code>, stacking layers gains nothing: a composition of linear maps is still a single linear map,
            so a 100-layer network could only draw straight decision boundaries. A non-linear <code>f</code> is what lets the
            network bend its boundary to fit curved data.
          </p>
          <p>
            During training, backpropagation multiplies the error signal by <code>f′(z)</code> at every layer it passes
            through. That is why the derivative matters as much as the function itself: if <code>f′(z)</code> is small, the
            signal shrinks; if it is small at many layers, it vanishes and the early layers stop learning.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Sigmoid and tanh">
            <Formula>σ(x) = 1 / (1 + e<sup>−x</sup>),   σ′(x) = σ(x)(1 − σ(x)) ≤ 0.25</Formula>
            <Formula>tanh(x) = 2σ(2x) − 1,   tanh′(x) = 1 − tanh<sup>2</sup>(x) ≤ 1</Formula>
          </Callout>
          <Callout tone="formula" title="ReLU family">
            <Formula>ReLU(x) = max(0, x),   LeakyReLU(x) = max(αx, x)</Formula>
            <Formula
              where={[
                { symbol: 'Φ(x)', meaning: 'standard normal CDF' },
                { symbol: 'φ(x)', meaning: 'standard normal density' },
              ]}
            >
              GELU(x) = x·Φ(x),   softplus(x) = ln(1 + e<sup>x</sup>)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Softmax with temperature">
            <Formula
              where={[
                { symbol: 'z_i', meaning: 'logit (raw score) of class i' },
                { symbol: 'T', meaning: 'temperature; T = 1 is the standard softmax' },
              ]}
            >
              p<sub>i</sub> = e<sup>z<sub>i</sub>/T</sup> / Σ<sub>j</sub> e<sup>z<sub>j</sub>/T</sup>
            </Formula>
          </Callout>
          <Callout tone="warning" title="Vanishing gradients">
            The gradient reaching layer 1 of an n-layer network contains a product of n derivatives f′(z). With sigmoid each
            factor is at most 0.25, so after 10 layers the signal is at most 0.25<sup>10</sup> ≈ 10<sup>−6</sup> of its
            original size. ReLU passes a gradient of exactly 1 for positive inputs, which is a large part of why it made deep
            networks practical. Its own weakness is the opposite side: a unit whose input is always negative gets zero
            gradient forever (a &quot;dead ReLU&quot;), which Leaky ReLU and GELU avoid.
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Comparison">
        <DataTable
          columns={[
            { header: 'Function', cell: 'name' },
            { header: 'Output range', cell: 'range' },
            { header: 'Max f′', cell: 'maxGrad' },
            { header: 'Zero-centred', cell: 'zeroCentered' },
            { header: 'Saturates', cell: 'saturates' },
          ]}
          rows={properties}
        />
        <div className="mt-6">
          <CardGrid items={whenToUse} />
        </div>
      </ContentSection>

      <ContentSection title="In code">
        <CodeTabs samples={code} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Gradient through a sigmoid stack"
            question="A 10-layer network uses sigmoid everywhere. Ignoring the weights, what is the largest possible factor by which the gradient can shrink between the output and the first layer? How does this compare with ReLU units that are all active?"
            solution={
              <>
                <p>σ′(x) = σ(x)(1 − σ(x)) is largest at x = 0, where σ(0) = 0.5.</p>
                <p>σ′(0) = 0.5 × 0.5 = 0.25</p>
                <p>Best case after 10 layers: 0.25<sup>10</sup> = 1 / 1,048,576 ≈ 9.5 × 10<sup>−7</sup></p>
                <p>Active ReLU units have f′ = 1, so 1<sup>10</sup> = 1: no shrinkage from the activations.</p>
                <p className="font-semibold text-emerald-700">Sigmoid: at least a million-fold shrinkage; ReLU: none.</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Softmax and temperature"
            question="Compute the softmax of the logits [2, 1, 0] at T = 1 and at T = 0.5."
            solution={
              <>
                <p>T = 1: e<sup>2</sup> = 7.389, e<sup>1</sup> = 2.718, e<sup>0</sup> = 1; sum = 11.107</p>
                <p>p = [7.389, 2.718, 1] / 11.107 = [0.665, 0.245, 0.090]</p>
                <p>T = 0.5: divide the logits by 0.5 to get [4, 2, 0]</p>
                <p>e<sup>4</sup> = 54.598, e<sup>2</sup> = 7.389, e<sup>0</sup> = 1; sum = 62.987</p>
                <p>p = [0.867, 0.117, 0.016]</p>
                <p className="font-semibold text-emerald-700">Halving T makes the top class go from 66.5% to 86.7%.</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
