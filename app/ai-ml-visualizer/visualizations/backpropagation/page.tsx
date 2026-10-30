import type { Metadata } from 'next';
import { CardGrid, ContentSection, DetailPage, Prose, StepList, Tag, type CardGridItem } from '@/components/content';
import BackpropagationVisualizer from './BackpropagationVisualizer';

export const metadata: Metadata = {
  title: 'Backpropagation Visualizer - AI/ML | AllVisualizer',
  description:
    'Interactive backpropagation algorithm visualization. Watch how neural networks learn through gradient descent and weight updates.',
  keywords: ['backpropagation', 'neural network', 'gradient descent', 'machine learning', 'deep learning', 'AI visualization'],
  openGraph: {
    title: 'Backpropagation Visualizer | AllVisualizer',
    description: 'Visualize how neural networks learn through backpropagation',
    type: 'article',
  },
};

const topics = ['Gradient Descent', 'Weight Updates', 'Error Propagation', 'Neural Network Training'];

const tips: CardGridItem[] = [
  { title: 'Learning rate', description: 'Try high values (1.5+) to see oscillation, and low values (0.1) for slow convergence.' },
  { title: 'Watch deltas', description: 'Enable the gradient display to see error signals propagating backward.' },
  { title: 'Weight colors', description: 'Green = excitatory (positive), red = inhibitory (negative).' },
  { title: 'Training speed', description: 'Adjust the animation speed to observe individual updates or fast convergence.' },
  { title: 'Different targets', description: 'Change the target output to see the network adapt to new goals.' },
];

const applications: CardGridItem[] = [
  { title: 'Image recognition', description: 'Deep neural networks use backprop to learn features from millions of images for classification tasks.' },
  { title: 'Natural language processing', description: 'Language models like GPT use backpropagation to learn word patterns and generate human-like text.' },
  { title: 'Speech recognition', description: 'Voice assistants train neural networks with backprop to convert speech to text accurately.' },
  { title: 'Autonomous vehicles', description: 'Self-driving cars use neural networks trained with backprop to detect objects and make driving decisions.' },
  { title: 'Medical diagnosis', description: 'AI systems learn to detect diseases from medical images using backpropagation-trained networks.' },
  { title: 'Game AI', description: 'AlphaGo and other game-playing AIs use backprop to learn winning strategies from experience.' },
];

const concepts: CardGridItem[] = [
  { title: 'Activation function (sigmoid)', description: <>Squashes neuron outputs to the range (0, 1). Formula: <span className="font-mono">σ(x) = 1 / (1 + e^(−x))</span></> },
  { title: 'Delta (δ)', description: 'Error signal for each neuron. Shows how much it contributed to the total error.' },
  { title: 'Gradient', description: 'Direction and magnitude of steepest descent. Used to update weights toward lower error.' },
  { title: 'Learning rate (η)', description: 'Step size for weight updates. Too high causes oscillation, too low slows convergence.' },
  { title: 'Loss function (MSE)', description: <>Mean Squared Error: <span className="font-mono">½(target − output)²</span>. Measures prediction accuracy.</> },
];

export default function BackpropagationPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="backpropagation"
      title="Backpropagation Algorithm"
      description="Discover how neural networks learn by propagating errors backward and updating weights through gradient descent."
      meta={topics.map((topic) => (
        <Tag key={topic}>{topic}</Tag>
      ))}
    >
      <BackpropagationVisualizer />

      <ContentSection title="Learning objectives">
        <Prose>
          <ul>
            <li>Understand the forward and backward passes in neural networks</li>
            <li>Observe how errors propagate from output to input layers</li>
            <li>See how weights are updated using gradient descent</li>
            <li>Learn the role of learning rate in network training</li>
            <li>Visualize loss minimization over training epochs</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="Algorithm steps">
        <StepList
          steps={[
            <>
              <strong className="text-ink">Forward pass.</strong> Compute activations from the input to the output layer.
              Each neuron applies weights, adds a bias, and passes the result through an activation function (sigmoid).
            </>,
            <>
              <strong className="text-ink">Calculate error.</strong> Compare the network output with the target value.
              Compute the loss (Mean Squared Error) to measure how far off the prediction is.
            </>,
            <>
              <strong className="text-ink">Backward pass.</strong> Calculate deltas (δ) for each neuron from output to input.
              A delta represents how much that neuron contributed to the error.
            </>,
            <>
              <strong className="text-ink">Update weights.</strong> Adjust all weights and biases using gradient descent:
              move in the direction that reduces error, scaled by the learning rate.
            </>,
          ]}
        />
      </ContentSection>

      <ContentSection title="Experimentation tips">
        <CardGrid items={tips} columns={3} />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} columns={3} />
      </ContentSection>

      <ContentSection title="Key concepts explained">
        <CardGrid items={concepts} />
      </ContentSection>
    </DetailPage>
  );
}
