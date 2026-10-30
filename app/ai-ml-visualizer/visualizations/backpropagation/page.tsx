import type { Metadata } from "next";
import Link from 'next/link';
import BackpropagationVisualizer from './BackpropagationVisualizer';
import GiscusComments from '@/components/ui/GiscusComments';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Backpropagation Visualizer - AI/ML | AllVisualizer',
    description: 'Interactive backpropagation algorithm visualization. Watch how neural networks learn through gradient descent and weight updates.',
    keywords: ['backpropagation', 'neural network', 'gradient descent', 'machine learning', 'deep learning', 'AI visualization'],
    openGraph: {
      title: 'Backpropagation Visualizer | AllVisualizer',
      description: 'Visualize how neural networks learn through backpropagation',
      type: 'article',
    },
  };
}

export default function BackpropagationPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-ink">Home</Link></li>
            <li>/</li>
            <li><Link href="/ai-ml-visualizer" className="hover:text-ink">AI/ML</Link></li>
            <li>/</li>
            <li><Link href="/ai-ml-visualizer/neural-networks" className="hover:text-ink">Neural Networks</Link></li>
            <li>/</li>
            <li className="text-ink font-medium">Backpropagation</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12 space-y-4">
          <div className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold border border-purple-300">
            Intermediate
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight">
            Backpropagation Algorithm
          </h1>
          <p className="text-xl text-ink-muted leading-relaxed">
            Discover how neural networks learn by propagating errors backward and updating weights through gradient descent.
          </p>
        </header>

        {/* Topics */}
        <div className="mb-8 flex flex-wrap gap-2">
          {['Gradient Descent', 'Weight Updates', 'Error Propagation', 'Neural Network Training'].map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-line-strong"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Visualizer */}
        <BackpropagationVisualizer />

        {/* Learning Objectives */}
        <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Learning Objectives</h2>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Understand the forward and backward passes in neural networks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Observe how errors propagate from output to input layers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>See how weights are updated using gradient descent</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Learn the role of learning rate in network training</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Visualize loss minimization over training epochs</span>
            </li>
          </ul>
        </div>

        {/* Algorithm Steps */}
        <div className="mt-8 bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">🔄 Algorithm Steps</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Forward Pass
              </h3>
              <p className="text-sm text-purple-800">
                Compute activations from input to output layer. Each neuron applies weights, adds bias, and passes through activation function (sigmoid).
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Calculate Error
              </h3>
              <p className="text-sm text-purple-800">
                Compare network output with target value. Compute loss (Mean Squared Error) to measure how far off the prediction is.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                Backward Pass
              </h3>
              <p className="text-sm text-purple-800">
                Calculate deltas (δ) for each neuron from output to input. Delta represents how much that neuron contributed to the error.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                Update Weights
              </h3>
              <p className="text-sm text-purple-800">
                Adjust all weights and biases using gradient descent. Move in direction that reduces error, scaled by learning rate.
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-yellow-900 mb-4">💡 Experimentation Tips</h2>
          <ul className="space-y-2 text-yellow-800">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Learning Rate:</strong> Try high values (1.5+) to see oscillation, low values (0.1) for slow convergence</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Watch Deltas:</strong> Enable gradient display to see error signals propagating backward</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Weight Colors:</strong> Green = excitatory (positive), Red = inhibitory (negative)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Training Speed:</strong> Adjust animation speed to observe individual updates or fast convergence</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span><strong>Different Targets:</strong> Change target output to see network adapt to new goals</span>
            </li>
          </ul>
        </div>

        {/* Real World Applications */}
        <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-green-900 mb-4">🌍 Real-World Applications</h2>
          <div className="grid md:grid-cols-2 gap-4 text-green-800">
            <div>
              <h3 className="font-semibold mb-2">Image Recognition</h3>
              <p className="text-sm">Deep neural networks use backprop to learn features from millions of images for classification tasks.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Natural Language Processing</h3>
              <p className="text-sm">Language models like GPT use backpropagation to learn word patterns and generate human-like text.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Speech Recognition</h3>
              <p className="text-sm">Voice assistants train neural networks with backprop to convert speech to text accurately.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Autonomous Vehicles</h3>
              <p className="text-sm">Self-driving cars use neural networks trained with backprop to detect objects and make driving decisions.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Medical Diagnosis</h3>
              <p className="text-sm">AI systems learn to detect diseases from medical images using backpropagation-trained networks.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Game AI</h3>
              <p className="text-sm">AlphaGo and other game-playing AIs use backprop to learn winning strategies from experience.</p>
            </div>
          </div>
        </div>

        {/* Key Concepts */}
        <div className="mt-8 bg-subtle border-2 border-line-strong rounded-lg p-6">
          <h2 className="text-2xl font-bold text-ink mb-4">📚 Key Concepts Explained</h2>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded border border-line-strong">
              <h3 className="font-semibold text-ink mb-1">Activation Function (Sigmoid)</h3>
              <p className="text-sm text-gray-700">Squashes neuron outputs to range (0,1). Formula: σ(x) = 1/(1 + e^(-x))</p>
            </div>
            <div className="bg-white p-3 rounded border border-line-strong">
              <h3 className="font-semibold text-ink mb-1">Delta (δ)</h3>
              <p className="text-sm text-gray-700">Error signal for each neuron. Shows how much it contributed to total error.</p>
            </div>
            <div className="bg-white p-3 rounded border border-line-strong">
              <h3 className="font-semibold text-ink mb-1">Gradient</h3>
              <p className="text-sm text-gray-700">Direction and magnitude of steepest descent. Used to update weights toward lower error.</p>
            </div>
            <div className="bg-white p-3 rounded border border-line-strong">
              <h3 className="font-semibold text-ink mb-1">Learning Rate (η)</h3>
              <p className="text-sm text-gray-700">Step size for weight updates. Too high causes oscillation, too low slows convergence.</p>
            </div>
            <div className="bg-white p-3 rounded border border-line-strong">
              <h3 className="font-semibold text-ink mb-1">Loss Function (MSE)</h3>
              <p className="text-sm text-gray-700">Mean Squared Error: ½(target - output)². Measures prediction accuracy.</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            href="/ai-ml-visualizer/neural-networks"
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-ink rounded-lg hover:bg-gray-200 transition-colors border-2 border-line-strong"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Neural Networks</span>
          </Link>
          
          <Link
            href="/ai-ml-visualizer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium shadow-brand"
          >
            <span>Back to AI/ML Home</span>
          </Link>
        </div>

        {/* Comments */}
        <div className="mt-16">
          <GiscusComments />
        </div>
      </div>
    </div>
  );
}
