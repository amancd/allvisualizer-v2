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
import MLPVisualizer from './MLPVisualizer';

export const metadata: Metadata = {
  title: 'Multi-Layer Perceptron - AI/ML Visualizer | AllVisualizer',
  description:
    'Train a small multi-layer perceptron in your browser on XOR, circles, spirals and blobs. Watch the decision boundary, network weights and loss curve change as backpropagation runs.',
  keywords: ['multi-layer perceptron', 'MLP', 'neural network', 'backpropagation', 'decision boundary', 'hidden layers', 'SGD'],
};

const observations: CardGridItem[] = [
  { title: 'Zero hidden layers', description: 'The network is logistic regression. It can only draw a straight line, so XOR and circles stay at about 50% accuracy.' },
  { title: 'One small hidden layer', description: 'A handful of tanh or ReLU units is enough for XOR and circles: each unit contributes one bend in the boundary.' },
  { title: 'Spirals need depth', description: 'Try 3 layers of 8 ReLU units. Deeper networks compose simple bends into the winding spiral boundary.' },
  { title: 'Learning rate and batch size', description: 'Too high a learning rate makes the loss jump around or blow up; batch size 1 is noisy, full batch is smooth but slow per epoch.' },
];

const code = [
  {
    label: 'Python',
    language: 'python',
    code: `import numpy as np

def train_step(Ws, bs, X, y, lr):
    # Forward pass: tanh hidden layers, sigmoid output
    acts = [X]
    for W, b in zip(Ws[:-1], bs[:-1]):
        acts.append(np.tanh(acts[-1] @ W + b))
    p = 1 / (1 + np.exp(-(acts[-1] @ Ws[-1] + bs[-1])))

    # Backward pass: sigmoid + cross-entropy gives delta = p - y
    delta = (p - y) / len(X)
    for l in reversed(range(len(Ws))):
        gW, gb = acts[l].T @ delta, delta.sum(axis=0)
        if l > 0:
            delta = (delta @ Ws[l].T) * (1 - acts[l] ** 2)   # tanh'
        Ws[l] -= lr * gW
        bs[l] -= lr * gb`,
  },
];

export default function MLPPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="mlp"
      description="A multi-layer perceptron stacks layers of neurons with non-linear activations. Configure one, train it with backpropagation right here, and watch it learn boundaries a single perceptron never could."
    >
      <MLPVisualizer />

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick a dataset. Orange points are class 0, blue points are class 1.',
            'Choose 0 to 3 hidden layers and drag each slider to set its width (1 to 8 neurons). Changing the architecture re-initialises the weights from the seed.',
            'Choose the hidden activation, learning rate and batch size.',
            'Press Train to run one epoch per frame, or Step to run a single epoch. Watch the background colour (the predicted probability) reshape itself around the data.',
            'Press New seed to start from different random weights and see how the result depends on initialisation.',
          ]}
        />
      </ContentSection>

      <ContentSection title="How an MLP learns">
        <Prose>
          <p>
            Each layer computes <code>a = f(W·a_prev + b)</code>. The first layer sees the raw coordinates (x, y); every later
            layer sees the previous layer&apos;s outputs. The last neuron uses a sigmoid, so its output is the probability that
            the point is class 1. The background colour of the plot is exactly this probability evaluated on a grid.
          </p>
          <p>
            Training minimises the binary cross-entropy loss. For every minibatch, the forward pass computes predictions, the
            backward pass uses the chain rule to get the gradient of the loss with respect to every weight, and stochastic
            gradient descent moves each weight a small step against its gradient. One epoch is one pass over all 200 points
            in shuffled minibatches.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={observations} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Forward pass">
            <Formula
              where={[
                { symbol: 'W⁽ˡ⁾, b⁽ˡ⁾', meaning: 'weights and biases of layer l' },
                { symbol: 'f', meaning: 'hidden activation (tanh, ReLU or sigmoid)' },
                { symbol: 'σ', meaning: 'sigmoid on the output neuron' },
              ]}
            >
              z<sup>(l)</sup> = W<sup>(l)</sup>a<sup>(l−1)</sup> + b<sup>(l)</sup>,   a<sup>(l)</sup> = f(z<sup>(l)</sup>),   ŷ = σ(z<sup>(L)</sup>)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Loss and backpropagation">
            <Formula>L = −[y·ln ŷ + (1 − y)·ln(1 − ŷ)]</Formula>
            <Formula>δ<sup>(L)</sup> = ŷ − y,   δ<sup>(l)</sup> = (W<sup>(l+1)</sup>)<sup>T</sup>δ<sup>(l+1)</sup> ⊙ f′(z<sup>(l)</sup>)</Formula>
            <Formula>∂L/∂W<sup>(l)</sup> = δ<sup>(l)</sup>(a<sup>(l−1)</sup>)<sup>T</sup>,   ∂L/∂b<sup>(l)</sup> = δ<sup>(l)</sup></Formula>
          </Callout>
          <Callout tone="formula" title="Minibatch SGD update">
            <Formula
              where={[
                { symbol: 'η', meaning: 'learning rate' },
                { symbol: 'B', meaning: 'minibatch of examples' },
              ]}
            >
              W ← W − (η / |B|) Σ<sub>i∈B</sub> ∂L<sub>i</sub>/∂W
            </Formula>
          </Callout>
          <Callout tone="tip" title="Why initialisation matters">
            Weights start as small Gaussian values: He initialisation (variance 2 / fan-in) for ReLU and Glorot initialisation
            (variance 2 / (fan-in + fan-out)) for tanh and sigmoid. This keeps activations and gradients at a sensible scale
            from layer to layer. If every weight started at the same value, every neuron in a layer would receive the same
            gradient and they would never become different.
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="In code">
        <CodeTabs samples={code} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Counting parameters"
            question="How many trainable parameters (weights plus biases) does a network with 2 inputs, hidden layers of 4 and 4 neurons, and 1 output have?"
            solution={
              <>
                <p>Input to hidden 1: 2 × 4 weights + 4 biases = 12</p>
                <p>Hidden 1 to hidden 2: 4 × 4 weights + 4 biases = 20</p>
                <p>Hidden 2 to output: 4 × 1 weights + 1 bias = 5</p>
                <p className="font-semibold text-emerald-700">Total = 12 + 20 + 5 = 37 parameters</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: One backprop step by hand"
            question="A network has one tanh hidden unit and a sigmoid output: h = tanh(w₁x), ŷ = σ(w₂h), with no biases. With x = 1, w₁ = 0.5, w₂ = 1 and target y = 1, compute ∂L/∂w₂ and ∂L/∂w₁ for the cross-entropy loss."
            solution={
              <>
                <p>h = tanh(0.5) = 0.4621</p>
                <p>ŷ = σ(1 × 0.4621) = 0.6135</p>
                <p>Output delta: δ₂ = ŷ − y = −0.3865</p>
                <p>∂L/∂w₂ = δ₂ × h = −0.3865 × 0.4621 = −0.1786</p>
                <p>Hidden delta: δ₁ = w₂ × δ₂ × (1 − h²) = 1 × (−0.3865) × 0.7864 = −0.3040</p>
                <p>∂L/∂w₁ = δ₁ × x = −0.3040</p>
                <p className="font-semibold text-emerald-700">
                  Both gradients are negative, so gradient descent increases w₁ and w₂, pushing ŷ towards 1.
                </p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
