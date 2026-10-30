import type { Metadata } from "next";
import Link from 'next/link';
import SimplePerceptronVisualizer from './SimplePerceptronVisualizer';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Simple Perceptron - AI/ML Visualizer | AllVisualizer",
    description: "Interactive visualization of a simple perceptron neural network. Learn how weights, bias, and training work in the most basic artificial neuron.",
    keywords: ["perceptron", "neural network", "machine learning", "weights", "bias", "activation function", "AI visualization"],
  };
}

export default function SimplePerceptronPage() {
  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
            <li>/</li>
            <li><Link href="/ai-ml-visualizer" className="hover:text-gray-900">AI & ML Visualizer</Link></li>
            <li>/</li>
            <li><Link href="/ai-ml-visualizer/neural-networks" className="hover:text-gray-900">Neural Networks</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Simple Perceptron</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🧠</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Simple Perceptron
            </h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
            The perceptron is the fundamental building block of neural networks. Watch it learn to classify 
            data points by adjusting its weights and bias.
          </p>
        </header>

        {/* Visualizer */}
        <SimplePerceptronVisualizer />

        {/* Educational Content */}
        <div className="mt-12 space-y-8">
          {/* Understanding Section */}
          <section className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding the Perceptron</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What is a Perceptron?</h3>
                <p className="text-gray-700 mb-3">
                  A perceptron is a simple artificial neuron that takes multiple inputs, applies weights to them, 
                  adds a bias, and produces a binary output (0 or 1). It was invented by Frank Rosenblatt in 1957 
                  and is the foundation of modern neural networks.
                </p>
              </div>

              <div className="bg-white rounded-lg p-5 border border-green-100">
                <h3 className="text-lg font-semibold text-green-900 mb-2">How Does It Learn?</h3>
                <p className="text-gray-700 mb-3">
                  The perceptron uses supervised learning. For each training example:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>It makes a prediction based on current weights</li>
                  <li>Compares the prediction with the actual label</li>
                  <li>Calculates the error (difference between prediction and actual)</li>
                  <li>Updates weights proportionally to the error and learning rate</li>
                </ol>
              </div>

              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Components</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Weights (w₁, w₂):</strong> Control how much each input influences the output</p>
                  <p><strong>Bias (b):</strong> Shifts the decision boundary, allowing the model to fit better</p>
                  <p><strong>Activation Function:</strong> Converts the weighted sum to a binary output (step function)</p>
                  <p><strong>Learning Rate:</strong> Controls how much weights change with each update</p>
                </div>
              </div>
            </div>
          </section>

          {/* Mathematical Details */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mathematical Formulation</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Forward Pass</h3>
                <div className="font-mono text-sm space-y-1 text-gray-800">
                  <p>z = w₁ × x + w₂ × y + b</p>
                  <p>output = activate(z) = {'{1 if z ≥ 0, 0 otherwise}'}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Weight Update Rule</h3>
                <div className="font-mono text-sm space-y-1 text-gray-800">
                  <p>error = actual_label - predicted_label</p>
                  <p>w₁ = w₁ + α × error × x</p>
                  <p>w₂ = w₂ + α × error × y</p>
                  <p>b = b + α × error</p>
                  <p className="text-xs text-gray-600 mt-2">(where α is the learning rate)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Limitations */}
          <section className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitations of the Perceptron</h2>
            
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-orange-600 text-xl">⚠️</span>
                <div>
                  <strong>Only Linearly Separable Data:</strong> A single perceptron can only classify data 
                  that can be separated by a straight line (or hyperplane in higher dimensions).
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-600 text-xl">⚠️</span>
                <div>
                  <strong>Cannot Solve XOR Problem:</strong> The famous XOR problem cannot be solved by a 
                  single perceptron, leading to the development of multi-layer networks.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✅</span>
                <div>
                  <strong>Solution - Multi-Layer Perceptrons:</strong> By stacking multiple layers of 
                  perceptrons with non-linear activations, we can solve complex non-linear problems.
                </div>
              </div>
            </div>
          </section>

          {/* Real World Applications */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Historical Significance</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>1957:</strong> Frank Rosenblatt invented the perceptron at the Cornell Aeronautical Laboratory.
              </p>
              <p>
                <strong>1958:</strong> The Mark I Perceptron was the first machine to recognize simple shapes and patterns, 
                sparking excitement about artificial intelligence.
              </p>
              <p>
                <strong>1969:</strong> Minsky and Papert's book "Perceptrons" highlighted limitations, causing the first "AI Winter."
              </p>
              <p>
                <strong>1980s:</strong> The development of backpropagation and multi-layer networks overcame these limitations, 
                leading to modern deep learning.
              </p>
            </div>
          </section>

          {/* Practice Tips */}
          <section className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Experiment Ideas</h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-gray-900 font-bold">1.</span>
                <p>Try different learning rates and observe how quickly the perceptron converges</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-900 font-bold">2.</span>
                <p>Generate new data and see how the perceptron adapts to different distributions</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-900 font-bold">3.</span>
                <p>Manually adjust weights to understand how they affect the decision boundary</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-900 font-bold">4.</span>
                <p>Watch how the bias parameter shifts the decision line up or down</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
