import type { Metadata } from "next";
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Neural Networks - AI/ML Visualizer | AllVisualizer',
    description: 'Interactive visualizations of neural networks: perceptrons, backpropagation, activation functions, and network architectures.',
    keywords: ['neural networks', 'perceptron', 'backpropagation', 'activation functions', 'deep learning', 'AI visualization'],
  };
}

export default function NeuralNetworksPage() {
  const problems = [
    {
      title: 'Simple Perceptron',
      description: 'Understand the building block of neural networks',
      difficulty: 'Beginner',
      slug: 'simple-perceptron',
      topics: ['Weights', 'Bias', 'Activation', 'Linear Classification'],
      comingSoon: false
    },
    {
      title: 'Backpropagation',
      description: 'See how neural networks learn through gradient descent',
      difficulty: 'Intermediate',
      slug: 'backpropagation',
      topics: ['Chain Rule', 'Gradients', 'Weight Updates', 'Learning'],
      comingSoon: false
    },
    {
      title: 'Activation Functions',
      description: 'Compare different activation functions and their properties',
      difficulty: 'Beginner',
      slug: 'activation-functions',
      topics: ['Sigmoid', 'ReLU', 'Tanh', 'Softmax'],
      comingSoon: true
    },
    {
      title: 'Multi-Layer Perceptron',
      description: 'Build and train a complete feedforward neural network',
      difficulty: 'Intermediate',
      slug: 'mlp',
      topics: ['Hidden Layers', 'Forward Pass', 'Training', 'Non-linearity'],
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
            <li>/</li>
            <li><Link href="/ai-ml-visualizer" className="hover:text-gray-900">AI & ML Visualizer</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Neural Networks</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🧠</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Neural Networks
            </h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Understand how artificial neural networks learn and make predictions. Visualize neurons, 
            weights, activations, and the learning process.
          </p>
        </header>

        {/* Key Concepts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Concepts</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Neurons & Weights</h3>
              <p className="text-sm text-gray-900">
                Understand how artificial neurons process inputs with learned weights
              </p>
            </div>
            
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Activation Functions</h3>
              <p className="text-sm text-gray-900">
                See how non-linear functions enable networks to learn complex patterns
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Backpropagation</h3>
              <p className="text-sm text-green-800">
                Watch gradients flow backward to update weights and minimize error
              </p>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">Network Architectures</h3>
              <p className="text-sm text-orange-800">
                Explore different layer configurations and their capabilities
              </p>
            </div>
          </div>
        </section>

        {/* Problems List */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Visualizations</h2>
          <div className="space-y-4">
            {problems.map((problem, index) => {
              const bgColor = problem.difficulty === 'Beginner' ? 'bg-green-100' : 
                             problem.difficulty === 'Intermediate' ? 'bg-yellow-100' : 'bg-red-100';
              const textColor = problem.difficulty === 'Beginner' ? 'text-green-700' : 
                               problem.difficulty === 'Intermediate' ? 'text-yellow-700' : 'text-red-700';

              const CardContent = (
                <div className="p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900">
                          {problem.title}
                        </h3>
                        <span className={`px-2 py-0.5 ${bgColor} ${textColor} rounded text-xs font-medium`}>
                          {problem.difficulty}
                        </span>
                        {problem.comingSoon && (
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs font-medium">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {problem.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {problem.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    {!problem.comingSoon && (
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </div>
                </div>
              );

              return problem.comingSoon ? (
                <div key={index} className="opacity-60">
                  {CardContent}
                </div>
              ) : (
                <Link
                  key={index}
                  href={`/ai-ml-visualizer/visualizations/${problem.slug}`}
                  className="block group"
                >
                  {CardContent}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Learning Path */}
        <section className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended Learning Path</h2>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">1</span>
              <div>
                <h3 className="font-semibold text-gray-900">Start with Simple Perceptron</h3>
                <p className="text-sm text-gray-600">Learn the basic building block and understand weights and bias</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">2</span>
              <div>
                <h3 className="font-semibold text-gray-900">Explore Activation Functions</h3>
                <p className="text-sm text-gray-600">See how different functions affect network behavior</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">3</span>
              <div>
                <h3 className="font-semibold text-gray-900">Understand Backpropagation</h3>
                <p className="text-sm text-gray-600">Watch how networks learn by propagating errors backward</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">4</span>
              <div>
                <h3 className="font-semibold text-gray-900">Build Multi-Layer Networks</h3>
                <p className="text-sm text-gray-600">Combine concepts to create powerful deep networks</p>
              </div>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
