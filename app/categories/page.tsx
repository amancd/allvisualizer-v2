import Link from 'next/link';
import { Code2, Calculator, Atom, Brain, TestTube, BarChart3 } from 'lucide-react';
import { Button, Card } from '@/components/ui';

// Icon mapping
const iconComponents = {
  'code': Code2,
  'calculator': Calculator,
  'atom': Atom,
  'brain': Brain,
  'flask': TestTube,
  'chart': BarChart3,
};

const categories = [
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Master essential computer science concepts with interactive visualizations of sorting, searching, trees, graphs, and more.',
    href: '/dsa-visualizer',
    icon: 'code',
    status: 'Available',
    statusColor: 'bg-green-100 text-green-800 border-green-300',
    topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting', 'Searching', 'Dynamic Programming'],
    visualizations: 12,
  },
  {
    id: 'math',
    title: 'Mathematics',
    description: 'Explore calculus, linear algebra, and mathematical concepts through dynamic, interactive visual representations.',
    href: '/math-visualizer',
    icon: 'calculator',
    status: 'Available',
    statusColor: 'bg-green-100 text-green-800 border-green-300',
    topics: ['Calculus', 'Linear Algebra', 'Derivatives', 'Integration', 'Matrix Operations', 'Optimization'],
    visualizations: 8,
  },
  {
    id: 'physics',
    title: 'Physics',
    description: 'Simulate and understand classical mechanics, waves, optics, thermodynamics, and modern physics phenomena.',
    href: '/physics-visualizer',
    icon: 'atom',
    status: 'Available',
    statusColor: 'bg-green-100 text-green-800 border-green-300',
    topics: ['Mechanics', 'Waves & Optics', 'Thermodynamics', 'Modern Physics', 'Energy', 'Forces'],
    visualizations: 15,
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'Visualize neural networks, backpropagation, and AI algorithms to understand how machines learn.',
    href: '/ai-ml-visualizer',
    icon: 'brain',
    status: 'Preview',
    statusColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    topics: ['Neural Networks', 'Backpropagation', 'Perceptrons', 'Deep Learning'],
    visualizations: 4,
  },
  {
    id: 'chemistry',
    title: 'Chemistry',
    description: 'Coming soon: Explore molecular structures, chemical reactions, and bonding through 3D visualizations.',
    href: '#',
    icon: 'flask',
    status: 'Coming Soon',
    statusColor: 'bg-gray-200 text-gray-700 border-gray-300',
    topics: ['Molecular Structure', 'Reactions', 'Bonding', 'Periodic Table'],
    visualizations: 0,
  },
  {
    id: 'statistics',
    title: 'Statistics & Probability',
    description: 'Coming soon: Understand distributions, hypothesis testing, and probability through interactive examples.',
    href: '#',
    icon: 'chart',
    status: 'Coming Soon',
    statusColor: 'bg-gray-200 text-gray-700 border-gray-300',
    topics: ['Distributions', 'Hypothesis Testing', 'Regression', 'Probability'],
    visualizations: 0,
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Browse All Categories
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Explore interactive visualizations across multiple disciplines
            </p>

            {/* Search Link */}
            <div className="max-w-2xl mx-auto pt-6">
              <Link href="/search" className="block">
                <div className="relative group cursor-pointer">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="w-full pl-12 pr-4 py-4 text-gray-500 bg-white border-2 border-gray-200 rounded-xl group-hover:border-gray-400 transition-colors">
                    Search all topics, visualizations, and concepts...
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.href}
                    className={`group block ${category.status === 'Coming Soon' ? 'pointer-events-none' : ''}`}
                  >
                    <Card hover padding="md" className="h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {(() => {
                            const IconComponent = iconComponents[category.icon as keyof typeof iconComponents];
                            return IconComponent ? <IconComponent className="w-6 h-6 text-gray-700" /> : null;
                          })()}
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${category.statusColor}`}>
                          {category.status}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-900 transition-colors">
                        {category.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {category.description}
                      </p>

                      {/* Visualizations Count */}
                      {category.visualizations > 0 && (
                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          {category.visualizations} interactive visualizations
                        </div>
                      )}

                      {/* Topics */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {category.topics.slice(0, 4).map((topic, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {topic}
                          </span>
                        ))}
                        {category.topics.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                            +{category.topics.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Action */}
                      {category.status !== 'Coming Soon' && (
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 group-hover:text-gray-900 group-hover:gap-3 transition-all">
                          <span>Explore now</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      )}
                    </Card>
                  </Link>
              ))}
          </div>
        </div>
      </section>      {/* CTA Section */}
      <section className="border-t border-gray-200 bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We're constantly adding new categories and visualizations. Request a topic or contribute!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                Request a Topic
              </Button>
            </Link>
            <a
              href="https://github.com/amancd/allvisualizer-v2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" leftIcon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              }
              >
                Contribute on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
