'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';

// Comprehensive search data
const searchData = [
  // DSA - Arrays
  { title: 'Two Sum', category: 'DSA', subcategory: 'Arrays', href: '/dsa-visualizer/problems/two-sum', description: 'Find two numbers that add up to a target', tags: ['array', 'hash map', 'easy'] },
  { title: 'Best Time to Buy and Sell Stock', category: 'DSA', subcategory: 'Arrays', href: '/dsa-visualizer/problems/best-time-to-buy-sell-stock', description: 'Find maximum profit from stock prices', tags: ['array', 'greedy', 'easy'] },
  
  // DSA - Linked Lists
  { title: 'Reverse Linked List', category: 'DSA', subcategory: 'Linked Lists', href: '/dsa-visualizer/problems/reverse-linked-list', description: 'Reverse a singly linked list', tags: ['linked list', 'recursion', 'easy'] },
  
  // Mathematics - Calculus
  { title: 'Derivatives', category: 'Mathematics', subcategory: 'Calculus', href: '/math-visualizer/problems/derivatives', description: 'Visualize derivative calculations and rules', tags: ['calculus', 'derivatives', 'rate of change'] },
  { title: 'Chain Rule', category: 'Mathematics', subcategory: 'Calculus', href: '/math-visualizer/problems/chain-rule', description: 'Understand composite function differentiation', tags: ['calculus', 'chain rule', 'derivatives'] },
  { title: 'Integration Basics', category: 'Mathematics', subcategory: 'Calculus', href: '/math-visualizer/problems/integration-basics', description: 'Learn fundamental integration techniques', tags: ['calculus', 'integration', 'antiderivatives'] },
  { title: 'Optimization', category: 'Mathematics', subcategory: 'Calculus', href: '/math-visualizer/problems/optimization', description: 'Find maxima and minima of functions', tags: ['calculus', 'optimization', 'critical points'] },
  
  // Mathematics - Linear Algebra
  { title: 'Matrix Operations', category: 'Mathematics', subcategory: 'Linear Algebra', href: '/math-visualizer/problems/matrix-operations', description: 'Addition, multiplication, and transformations', tags: ['linear algebra', 'matrices', 'operations'] },
  { title: 'Determinants', category: 'Mathematics', subcategory: 'Linear Algebra', href: '/math-visualizer/problems/determinants', description: 'Calculate and understand matrix determinants', tags: ['linear algebra', 'determinants', 'matrices'] },
  
  // Physics - Mechanics
  { title: 'Projectile Motion', category: 'Physics', subcategory: 'Mechanics', href: '/physics-visualizer/simulations/projectile-motion', description: 'Simulate motion under gravity', tags: ['mechanics', 'kinematics', 'projectile'] },
  { title: 'Newton\'s Laws', category: 'Physics', subcategory: 'Mechanics', href: '/physics-visualizer/simulations/newtons-laws', description: 'Explore the three laws of motion', tags: ['mechanics', 'forces', 'newton'] },
  { title: 'Elastic Collisions', category: 'Physics', subcategory: 'Mechanics', href: '/physics-visualizer/simulations/elastic-collisions', description: 'Simulate momentum and energy conservation', tags: ['mechanics', 'collisions', 'momentum'] },
  { title: 'Energy Conservation', category: 'Physics', subcategory: 'Mechanics', href: '/physics-visualizer/simulations/energy-conservation', description: 'Visualize kinetic and potential energy', tags: ['mechanics', 'energy', 'conservation'] },
  
  // Physics - Waves & Optics
  { title: 'Wave Interference', category: 'Physics', subcategory: 'Waves & Optics', href: '/physics-visualizer/simulations/wave-interference', description: 'Constructive and destructive interference', tags: ['waves', 'interference', 'optics'] },
  { title: 'Double-Slit Experiment', category: 'Physics', subcategory: 'Waves & Optics', href: '/physics-visualizer/simulations/double-slit', description: 'Quantum wave-particle duality', tags: ['waves', 'quantum', 'optics'] },
  { title: 'Reflection & Refraction', category: 'Physics', subcategory: 'Waves & Optics', href: '/physics-visualizer/simulations/reflection-refraction', description: 'Light behavior at boundaries', tags: ['optics', 'reflection', 'refraction'] },
  { title: 'Standing Waves', category: 'Physics', subcategory: 'Waves & Optics', href: '/physics-visualizer/simulations/standing-waves', description: 'Visualize wave resonance patterns', tags: ['waves', 'resonance', 'harmonics'] },
  
  // Physics - Thermodynamics
  { title: 'Ideal Gas Law', category: 'Physics', subcategory: 'Thermodynamics', href: '/physics-visualizer/simulations/ideal-gas-law', description: 'PV = nRT relationships', tags: ['thermodynamics', 'gas law', 'temperature'] },
  { title: 'Heat Transfer', category: 'Physics', subcategory: 'Thermodynamics', href: '/physics-visualizer/simulations/heat-transfer', description: 'Conduction, convection, and radiation', tags: ['thermodynamics', 'heat', 'transfer'] },
  { title: 'Carnot Cycle', category: 'Physics', subcategory: 'Thermodynamics', href: '/physics-visualizer/simulations/carnot-cycle', description: 'Ideal heat engine efficiency', tags: ['thermodynamics', 'carnot', 'efficiency'] },
  
  // Physics - Modern Physics
  { title: 'Photoelectric Effect', category: 'Physics', subcategory: 'Modern Physics', href: '/physics-visualizer/simulations/photoelectric-effect', description: 'Light-matter interaction', tags: ['modern physics', 'quantum', 'photons'] },
  { title: 'Bohr Model', category: 'Physics', subcategory: 'Modern Physics', href: '/physics-visualizer/simulations/bohr-model', description: 'Atomic structure and energy levels', tags: ['modern physics', 'atom', 'quantum'] },
  { title: 'Time Dilation', category: 'Physics', subcategory: 'Modern Physics', href: '/physics-visualizer/simulations/time-dilation', description: 'Special relativity effects', tags: ['modern physics', 'relativity', 'time'] },
  
  // AI/ML
  { title: 'Simple Perceptron', category: 'AI & ML', subcategory: 'Neural Networks', href: '/ai-ml-visualizer/visualizations/simple-perceptron', description: 'Basic neural network building block', tags: ['neural networks', 'perceptron', 'machine learning'] },
  { title: 'Backpropagation', category: 'AI & ML', subcategory: 'Neural Networks', href: '/ai-ml-visualizer/visualizations/backpropagation', description: 'Neural network training algorithm', tags: ['neural networks', 'backpropagation', 'training'] },
  
  // Category Pages
  { title: 'DSA Visualizer', category: 'Category', subcategory: 'Main', href: '/dsa-visualizer', description: 'Data Structures & Algorithms visualizations', tags: ['dsa', 'algorithms', 'data structures'] },
  { title: 'Math Visualizer', category: 'Category', subcategory: 'Main', href: '/math-visualizer', description: 'Mathematics visualizations', tags: ['math', 'calculus', 'linear algebra'] },
  { title: 'Physics Visualizer', category: 'Category', subcategory: 'Main', href: '/physics-visualizer', description: 'Physics simulations', tags: ['physics', 'mechanics', 'waves'] },
  { title: 'AI & ML Visualizer', category: 'Category', subcategory: 'Main', href: '/ai-ml-visualizer', description: 'Artificial Intelligence & Machine Learning', tags: ['ai', 'ml', 'neural networks'] },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(searchData);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'DSA', 'Mathematics', 'Physics', 'AI & ML'];

  useEffect(() => {
    const searchQuery = query.toLowerCase().trim();
    
    let filtered = searchData;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(searchQuery);
        const descMatch = item.description.toLowerCase().includes(searchQuery);
        const categoryMatch = item.category.toLowerCase().includes(searchQuery);
        const subcategoryMatch = item.subcategory.toLowerCase().includes(searchQuery);
        const tagsMatch = item.tags.some(tag => tag.includes(searchQuery));
        
        return titleMatch || descMatch || categoryMatch || subcategoryMatch || tagsMatch;
      });
    }

    setResults(filtered);
  }, [query, selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Search AllVisualizer
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Find topics, visualizations, and concepts across all categories
            </p>

            {/* Search Bar */}
            <div className="pt-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for topics, algorithms, concepts..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-14 pr-4 py-5 text-lg text-gray-900 placeholder-gray-500 bg-white border-2 border-gray-300 rounded-xl focus:border-gray-600 focus:outline-none transition-colors"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center pt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {results.length} {results.length === 1 ? 'result' : 'results'} found
              {query && ` for "${query}"`}
            </h2>
            {selectedCategory !== 'All' && (
              <p className="text-gray-600">
                Filtered by: <span className="font-semibold">{selectedCategory}</span>
              </p>
            )}
          </div>

          {/* Results List */}
          {results.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                Try different keywords or browse our categories
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    setQuery('');
                    setSelectedCategory('All');
                  }}
                >
                  Clear Filters
                </Button>
                <Link href="/categories">
                  <Button variant="outline">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <Link
                  key={index}
                  href={result.href}
                  className="block group"
                >
                  <Card hover padding="md">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Category Badge */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                            {result.category}
                          </span>
                          {result.subcategory !== 'Main' && (
                            <span className="text-gray-400 text-xs">
                              • {result.subcategory}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-900 transition-colors">
                          {result.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 mb-3">
                          {result.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {result.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="flex-shrink-0">
                        <svg 
                          className="w-6 h-6 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Searches */}
      {!query && (
        <section className="border-t border-gray-200 bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Popular Topics
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {['sorting', 'calculus', 'waves', 'neural networks', 'matrices', 'mechanics', 'integration', 'linked list'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setQuery(topic)}
                  className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-400 hover:shadow-md transition-all"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
