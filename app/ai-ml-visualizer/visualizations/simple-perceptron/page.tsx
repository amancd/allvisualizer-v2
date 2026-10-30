import type { Metadata } from 'next';
import { Callout, CardGrid, ContentSection, DetailPage, Prose, StepList, type CardGridItem } from '@/components/content';
import SimplePerceptronVisualizer from './SimplePerceptronVisualizer';

export const metadata: Metadata = {
  title: 'Simple Perceptron - AI/ML Visualizer | AllVisualizer',
  description:
    'Interactive visualization of a simple perceptron neural network. Learn how weights, bias, and training work in the most basic artificial neuron.',
  keywords: ['perceptron', 'neural network', 'machine learning', 'weights', 'bias', 'activation function', 'AI visualization'],
};

const components: CardGridItem[] = [
  { title: 'Weights (w₁, w₂)', description: 'Control how much each input influences the output.' },
  { title: 'Bias (b)', description: 'Shifts the decision boundary, allowing the model to fit better.' },
  { title: 'Activation function', description: 'Converts the weighted sum to a binary output (step function).' },
  { title: 'Learning rate', description: 'Controls how much the weights change with each update.' },
];

const history = [
  { year: '1957', event: 'Frank Rosenblatt invented the perceptron at the Cornell Aeronautical Laboratory.' },
  { year: '1958', event: 'The Mark I Perceptron was the first machine to recognize simple shapes and patterns, sparking excitement about artificial intelligence.' },
  { year: '1969', event: 'Minsky and Papert\'s book "Perceptrons" highlighted its limitations, causing the first "AI Winter."' },
  { year: '1980s', event: 'The development of backpropagation and multi-layer networks overcame these limitations, leading to modern deep learning.' },
];

export default function SimplePerceptronPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="simple-perceptron"
      icon="🧠"
      description="The perceptron is the fundamental building block of neural networks. Watch it learn to classify data points by adjusting its weights and bias."
    >
      <SimplePerceptronVisualizer />

      <ContentSection title="Understanding the perceptron">
        <h3 className="mb-2 text-lg font-semibold text-ink">What is a perceptron?</h3>
        <Prose>
          <p>
            A perceptron is a simple artificial neuron that takes multiple inputs, applies weights to them, adds a bias, and
            produces a binary output (0 or 1). It was invented by Frank Rosenblatt in 1957 and is the foundation of modern
            neural networks.
          </p>
        </Prose>

        <h3 className="mb-2 mt-8 text-lg font-semibold text-ink">How does it learn?</h3>
        <Prose className="mb-4">
          <p>The perceptron uses supervised learning. For each training example:</p>
        </Prose>
        <StepList
          steps={[
            'It makes a prediction based on the current weights.',
            'It compares the prediction with the actual label.',
            'It calculates the error (the difference between prediction and actual).',
            'It updates the weights proportionally to the error and learning rate.',
          ]}
        />

        <h3 className="mb-3 mt-8 text-lg font-semibold text-ink">Key components</h3>
        <CardGrid items={components} />
      </ContentSection>

      <ContentSection title="Mathematical formulation">
        <div className="space-y-4">
          <Callout tone="formula" title="Forward pass">
            <pre className="whitespace-pre-wrap font-mono text-[13px]">{`z = w₁ × x + w₂ × y + b
output = activate(z) = { 1 if z ≥ 0, 0 otherwise }`}</pre>
          </Callout>
          <Callout tone="formula" title="Weight update rule">
            <pre className="whitespace-pre-wrap font-mono text-[13px]">{`error = actual_label - predicted_label
w₁ = w₁ + α × error × x
w₂ = w₂ + α × error × y
b  = b  + α × error`}</pre>
            <p className="mt-2 text-xs text-ink-muted">(where α is the learning rate)</p>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Limitations of the perceptron">
        <div className="space-y-4">
          <Callout tone="warning" title="Only linearly separable data">
            A single perceptron can only classify data that can be separated by a straight line (or a hyperplane in higher
            dimensions).
          </Callout>
          <Callout tone="warning" title="Cannot solve the XOR problem">
            The famous XOR problem cannot be solved by a single perceptron, which led to the development of multi-layer
            networks.
          </Callout>
          <Callout tone="tip" title="Solution: multi-layer perceptrons">
            By stacking multiple layers of perceptrons with non-linear activations, we can solve complex non-linear problems.
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Historical significance">
        <Prose>
          {history.map(({ year, event }) => (
            <p key={year}>
              <strong>{year}:</strong> {event}
            </p>
          ))}
        </Prose>
      </ContentSection>

      <ContentSection title="Experiment ideas">
        <StepList
          steps={[
            'Try different learning rates and observe how quickly the perceptron converges.',
            'Generate new data and see how the perceptron adapts to different distributions.',
            'Manually adjust weights to understand how they affect the decision boundary.',
            'Watch how the bias parameter shifts the decision line up or down.',
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
