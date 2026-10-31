import {
  Brain, Sparkles, Eye, MessageSquare, Gamepad2, BarChart3,
  Rocket, Briefcase, Target, Puzzle, Palette, TrendingUp, Sliders,
} from 'lucide-react';
import type { Subject } from './types';

const viz = '/ai-ml-visualizer/visualizations';

export const aiMl: Subject = {
  id: 'ai-ml',
  title: 'AI & Machine Learning',
  shortTitle: 'AI & ML',
  href: '/ai-ml-visualizer',
  accent: 'violet',
  intro:
    'Master AI and ML concepts through interactive visualizations. Watch neural networks learn, see algorithms in action, and build intuition for complex ideas.',
  itemNoun: 'visualizations',
  topics: [
    {
      slug: 'neural-networks',
      title: 'Neural Networks',
      icon: Brain,
      summary: 'Understand how neural networks learn and make predictions',
      intro:
        'Understand how artificial neural networks learn and make predictions. Visualize neurons, weights, activations, and the learning process.',
      itemBasePath: viz,
      highlights: ['Perceptron', 'Backpropagation', 'Activation Functions', 'Architectures'],
      concepts: [
        { title: 'Neurons & Weights', description: 'How artificial neurons process inputs with learned weights' },
        { title: 'Activation Functions', description: 'How non-linear functions let networks learn complex patterns' },
        { title: 'Backpropagation', description: 'Watch gradients flow backward to update weights and minimize error' },
        { title: 'Network Architectures', description: 'Different layer configurations and what they can learn' },
      ],
      items: [
        { slug: 'simple-perceptron', title: 'Simple Perceptron', description: 'Understand the building block of neural networks', difficulty: 'Beginner', tags: ['Weights', 'Bias', 'Activation', 'Linear Classification'] },
        { slug: 'backpropagation', title: 'Backpropagation', description: 'See how neural networks learn through gradient descent', difficulty: 'Intermediate', tags: ['Chain Rule', 'Gradients', 'Weight Updates', 'Learning'] },
        { slug: 'activation-functions', title: 'Activation Functions', description: 'Compare different activation functions and their properties', difficulty: 'Beginner', tags: ['Sigmoid', 'ReLU', 'Tanh', 'Softmax'] },
        { slug: 'mlp', title: 'Multi-Layer Perceptron', description: 'Build and train a complete feedforward neural network', difficulty: 'Intermediate', tags: ['Hidden Layers', 'Forward Pass', 'Training', 'Non-linearity'] },
      ],
    },
    {
      slug: 'computer-vision',
      title: 'Computer Vision',
      icon: Eye,
      summary: 'Learn image processing and object detection',
      intro:
        'Master computer vision concepts through interactive visualizations. Learn how computers see and understand images.',
      itemBasePath: '/ai-ml-visualizer/computer-vision',
      highlights: ['Image Filters', 'Edge Detection', 'Object Detection', 'Segmentation'],
      concepts: [
        { title: 'Convolution Operations', description: 'How convolution kernels extract features from images with sliding windows' },
        { title: 'Feature Extraction', description: 'How networks identify patterns, edges, and complex features in visual data' },
        { title: 'Object Recognition', description: 'How models detect and classify objects using bounding boxes and confidence scores' },
        { title: 'Image Segmentation', description: 'Pixel-level classification that separates objects from backgrounds' },
      ],
      items: [
        { slug: 'image-filters', title: 'Image Filters', description: 'Apply various filters to images and see real-time results', difficulty: 'Beginner', tags: ['Convolution', 'Gaussian Blur', 'Sharpen', 'Edge Detection'] },
        { slug: 'edge-detection', title: 'Edge Detection', description: 'Understand Sobel, Canny, and other edge detection algorithms', difficulty: 'Intermediate', tags: ['Sobel', 'Canny', 'Prewitt', 'Laplacian'] },
        { slug: 'object-detection', title: 'Object Detection', description: 'Learn how neural networks detect objects in images', difficulty: 'Advanced', tags: ['YOLO', 'R-CNN', 'Bounding Boxes', 'NMS'] },
        { slug: 'segmentation', title: 'Image Segmentation', description: 'Visualize semantic and instance segmentation techniques', difficulty: 'Advanced', tags: ['U-Net', 'Mask R-CNN', 'Semantic Segmentation', 'Instance Segmentation'] },
      ],
      discussion: true,
    },
    {
      slug: 'deep-learning',
      title: 'Deep Learning',
      icon: Sparkles,
      summary: 'Explore CNNs, RNNs, and advanced architectures',
      intro:
        'Look inside the architectures behind modern AI. Slide convolution kernels over images, unroll recurrent networks through time, and watch attention decide which words matter.',
      itemBasePath: viz,
      highlights: ['CNNs', 'RNNs', 'Transformers', 'Attention'],
      concepts: [
        { title: 'Convolutional Networks', description: 'Shared kernels slide over images to detect local patterns, building up from edges to objects' },
        { title: 'Recurrent Networks', description: 'A hidden state carries information from one step of a sequence to the next' },
        { title: 'Attention', description: 'Each token builds its representation as a weighted mix of every other token' },
        { title: 'Depth', description: 'Stacking layers lets networks build complex features out of simple ones' },
      ],
      items: [
        { slug: 'cnn', title: 'Convolutional Neural Networks', description: 'Step a kernel across an image to build feature maps, then pool and stack layers', difficulty: 'Intermediate', tags: ['Convolution', 'Feature Maps', 'Pooling', 'Stride & Padding'] },
        { slug: 'rnn', title: 'Recurrent Neural Networks', description: 'Unroll an RNN through time and watch the hidden state and vanishing gradients', difficulty: 'Intermediate', tags: ['Hidden State', 'Unrolling', 'Vanishing Gradients', 'LSTM'] },
        { slug: 'attention', title: 'Self-Attention & Transformers', description: 'See queries, keys and values combine into an attention heatmap for a sentence', difficulty: 'Advanced', tags: ['Self-Attention', 'Query/Key/Value', 'Softmax', 'Multi-Head'] },
      ],
    },
    {
      slug: 'nlp',
      title: 'Natural Language Processing',
      icon: MessageSquare,
      summary: 'Process and understand human language',
      intro:
        'Follow text on its way through a language model: split into tokens, mapped to vectors, and turned back into words one sampled token at a time.',
      itemBasePath: viz,
      highlights: ['Tokenization', 'Embeddings', 'Sampling', 'Language Models'],
      concepts: [
        { title: 'Tokenization', description: 'Text is split into subword pieces from a learned vocabulary before a model sees it' },
        { title: 'Embeddings', description: 'Each token becomes a vector, and similar meanings end up close together' },
        { title: 'Language Models', description: 'Predict a probability for every possible next token' },
        { title: 'Decoding', description: 'Temperature, top-k and top-p decide how the next token is picked from those probabilities' },
      ],
      items: [
        { slug: 'tokenization', title: 'Tokenization (BPE)', description: 'Watch byte-pair encoding merge characters into subword tokens step by step', difficulty: 'Beginner', tags: ['BPE', 'Subwords', 'Vocabulary', 'Merges'] },
        { slug: 'word-embeddings', title: 'Word Embeddings', description: 'Explore words as vectors, cosine similarity and analogies like king − man + woman', difficulty: 'Intermediate', tags: ['Word2Vec', 'Cosine Similarity', 'Analogies', 'Vector Space'] },
        { slug: 'text-generation', title: 'Text Generation & Sampling', description: 'Adjust temperature, top-k and top-p and see how they reshape next-token probabilities', difficulty: 'Intermediate', tags: ['Temperature', 'Top-k', 'Top-p', 'Softmax'] },
      ],
    },
    {
      slug: 'reinforcement-learning',
      title: 'Reinforcement Learning',
      icon: Gamepad2,
      summary: 'Train agents to make decisions through rewards',
      intro:
        'Watch agents learn by trial and error. Balance exploration and exploitation, compute values with dynamic programming, and train a Q-learning agent in a grid world.',
      itemBasePath: viz,
      highlights: ['Bandits', 'Value Iteration', 'Q-Learning', 'Exploration'],
      concepts: [
        { title: 'Agent and Environment', description: 'The agent acts, the environment responds with a new state and a reward' },
        { title: 'Rewards and Returns', description: 'The goal is to maximize total discounted reward, not just the next one' },
        { title: 'Value Functions', description: 'How good it is to be in a state, or to take an action in a state' },
        { title: 'Exploration vs Exploitation', description: 'Try new actions to learn more, or use what already works' },
      ],
      items: [
        { slug: 'multi-armed-bandit', title: 'Multi-Armed Bandit', description: 'Compare ε-greedy, UCB and Thompson sampling on slot machines with hidden payouts', difficulty: 'Beginner', tags: ['Exploration', 'ε-Greedy', 'UCB', 'Regret'] },
        { slug: 'value-iteration', title: 'Value Iteration', description: 'Watch state values and the optimal policy emerge in a grid world with the Bellman equation', difficulty: 'Intermediate', tags: ['Bellman Equation', 'MDP', 'Discount Factor', 'Policy'] },
        { slug: 'q-learning', title: 'Q-Learning', description: 'Train an agent to reach a goal by trial and error and watch its Q-table fill in', difficulty: 'Intermediate', tags: ['Q-Table', 'Temporal Difference', 'Learning Rate', 'Episodes'] },
      ],
    },
    {
      slug: 'classical-ml',
      title: 'Classical ML',
      icon: BarChart3,
      summary: 'Master traditional machine learning algorithms',
      intro:
        'The algorithms that still power much of real-world machine learning. Drop points on a plane and watch clusters form, neighbours vote, and trees carve up the space.',
      itemBasePath: viz,
      highlights: ['K-Means', 'K-Nearest Neighbors', 'Decision Trees', 'Gradient Descent'],
      concepts: [
        { title: 'Supervised Learning', description: 'Learn a mapping from inputs to known labels' },
        { title: 'Unsupervised Learning', description: 'Find structure, such as clusters, in data without labels' },
        { title: 'Decision Boundaries', description: 'Every classifier splits the input space into regions, one per class' },
        { title: 'Overfitting', description: 'A model that fits training noise does worse on new data' },
      ],
      items: [
        { slug: 'k-means', title: 'K-Means Clustering', description: 'Step through assigning points to centroids and moving centroids to the mean', difficulty: 'Beginner', tags: ['Clustering', 'Centroids', 'Elbow Method', 'Unsupervised'] },
        { slug: 'knn', title: 'K-Nearest Neighbors', description: 'Classify a point by majority vote of its neighbours and see the decision boundary change with k', difficulty: 'Beginner', tags: ['Classification', 'Distance Metrics', 'Decision Boundary', 'Overfitting'] },
        { slug: 'decision-tree', title: 'Decision Trees', description: 'Grow a tree split by split using Gini impurity and see how it partitions the plane', difficulty: 'Intermediate', tags: ['Gini Impurity', 'Information Gain', 'Depth', 'Overfitting'] },
        { slug: 'gradient-descent', title: 'Gradient Descent', description: 'Roll down a loss surface and compare learning rates, momentum and Adam', difficulty: 'Intermediate', tags: ['Learning Rate', 'Momentum', 'Adam', 'Loss Surface'] },
      ],
    },
  ],
  whyLearn: {
    title: 'Why learn AI & ML?',
    description: 'Master the technology shaping our future.',
    items: [
      { icon: Rocket, title: 'Future of technology', description: 'AI is changing every industry, from healthcare and finance to autonomous vehicles and research.' },
      { icon: Briefcase, title: 'High-demand career', description: 'AI/ML engineers are among the most sought-after professionals.' },
      { icon: Target, title: 'Solve real problems', description: 'Build systems that diagnose diseases, predict trends, and automate complex tasks.' },
      { icon: Puzzle, title: 'Interdisciplinary', description: 'Combines mathematics, statistics, computer science, and domain expertise.' },
    ],
  },
  features: {
    title: 'Learning features',
    description: 'Everything you need to master AI and ML concepts.',
    items: [
      { icon: Palette, title: 'Visual neural networks', description: 'See neurons activate and backpropagation update weights in real time.' },
      { icon: TrendingUp, title: 'Live training', description: 'Watch models learn with loss curves, accuracy metrics, and gradient flows.' },
      { icon: Sliders, title: 'Interactive parameters', description: 'Adjust learning rates, architectures, and hyperparameters and see the effect.' },
    ],
  },
};
