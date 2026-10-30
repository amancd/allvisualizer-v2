import {
  Brain, Sparkles, Eye, MessageSquare, Gamepad2, BarChart3,
  Rocket, Briefcase, Target, Puzzle, Palette, TrendingUp, Sliders,
} from 'lucide-react';
import type { Subject } from './types';

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
      itemBasePath: '/ai-ml-visualizer/visualizations',
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
        { slug: 'activation-functions', title: 'Activation Functions', description: 'Compare different activation functions and their properties', difficulty: 'Beginner', tags: ['Sigmoid', 'ReLU', 'Tanh', 'Softmax'], status: 'coming-soon' },
        { slug: 'mlp', title: 'Multi-Layer Perceptron', description: 'Build and train a complete feedforward neural network', difficulty: 'Intermediate', tags: ['Hidden Layers', 'Forward Pass', 'Training', 'Non-linearity'], status: 'coming-soon' },
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
        { slug: 'edge-detection', title: 'Edge Detection', description: 'Understand Sobel, Canny, and other edge detection algorithms', difficulty: 'Intermediate', tags: ['Sobel', 'Canny', 'Prewitt', 'Laplacian'], status: 'coming-soon' },
        { slug: 'object-detection', title: 'Object Detection', description: 'Learn how neural networks detect objects in images', difficulty: 'Advanced', tags: ['YOLO', 'R-CNN', 'Bounding Boxes', 'NMS'], status: 'coming-soon' },
        { slug: 'segmentation', title: 'Image Segmentation', description: 'Visualize semantic and instance segmentation techniques', difficulty: 'Advanced', tags: ['U-Net', 'Mask R-CNN', 'Semantic Segmentation', 'Instance Segmentation'], status: 'coming-soon' },
      ],
      discussion: true,
    },
    { slug: 'deep-learning', title: 'Deep Learning', icon: Sparkles, summary: 'Explore CNNs, RNNs, and advanced architectures', intro: 'Explore CNNs, RNNs, and advanced architectures.', itemBasePath: '/ai-ml-visualizer/visualizations', highlights: ['CNNs', 'RNNs', 'Transformers', 'Attention'], items: [], status: 'coming-soon' },
    { slug: 'nlp', title: 'Natural Language Processing', icon: MessageSquare, summary: 'Process and understand human language', intro: 'Process and understand human language.', itemBasePath: '/ai-ml-visualizer/visualizations', highlights: ['Tokenization', 'Embeddings', 'Sentiment Analysis', 'Language Models'], items: [], status: 'coming-soon' },
    { slug: 'reinforcement-learning', title: 'Reinforcement Learning', icon: Gamepad2, summary: 'Train agents to make decisions through rewards', intro: 'Train agents to make decisions through rewards.', itemBasePath: '/ai-ml-visualizer/visualizations', highlights: ['Q-Learning', 'Policy Gradient', 'DQN', 'Actor-Critic'], items: [], status: 'coming-soon' },
    { slug: 'classical-ml', title: 'Classical ML', icon: BarChart3, summary: 'Master traditional machine learning algorithms', intro: 'Master traditional machine learning algorithms.', itemBasePath: '/ai-ml-visualizer/visualizations', highlights: ['Linear Regression', 'Decision Trees', 'SVM', 'Clustering'], items: [], status: 'coming-soon' },
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
