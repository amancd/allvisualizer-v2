import type { Metadata } from 'next';
import Link from 'next/link';
import { GiscusComments } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Computer Vision Visualizer | AllVisualizer',
  description: 'Learn Computer Vision concepts through interactive visualizations. Master image processing, edge detection, object detection, and segmentation.',
  keywords: ['computer vision', 'image processing', 'edge detection', 'object detection', 'CNN', 'image segmentation'],
};

export default function ComputerVisionPage() {
  const visualizations = [
    {
      title: 'Image Filters',
      description: 'Apply various filters to images and see real-time results',
      href: '/ai-ml-visualizer/computer-vision/image-filters',
      difficulty: 'Beginner',
      topics: ['Convolution', 'Gaussian Blur', 'Sharpen', 'Edge Detection'],
      isAvailable: true,
    },
    {
      title: 'Edge Detection',
      description: 'Understand Sobel, Canny, and other edge detection algorithms',
      href: '/ai-ml-visualizer/computer-vision/edge-detection',
      difficulty: 'Intermediate',
      topics: ['Sobel', 'Canny', 'Prewitt', 'Laplacian'],
      isAvailable: false,
    },
    {
      title: 'Object Detection',
      description: 'Learn how neural networks detect objects in images',
      href: '/ai-ml-visualizer/computer-vision/object-detection',
      difficulty: 'Advanced',
      topics: ['YOLO', 'R-CNN', 'Bounding Boxes', 'NMS'],
      isAvailable: false,
    },
    {
      title: 'Image Segmentation',
      description: 'Visualize semantic and instance segmentation techniques',
      href: '/ai-ml-visualizer/computer-vision/segmentation',
      difficulty: 'Advanced',
      topics: ['U-Net', 'Mask R-CNN', 'Semantic Segmentation', 'Instance Segmentation'],
      isAvailable: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <nav className="pt-24 pb-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/ai-ml-visualizer" className="hover:text-gray-900">
                AI & ML
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Computer Vision</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Computer Vision
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master computer vision concepts through interactive visualizations. Learn how computers see and understand images.
            </p>
          </div>
        </div>
      </section>

      {/* Visualizations Grid */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Interactive Visualizations
            </h2>
            <p className="text-gray-600">
              Explore computer vision algorithms step by step
            </p>
          </div>

          <div className="grid gap-6">
            {visualizations.map((viz, index) => {
              const CardContent = (
                <div className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {viz.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          viz.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                          viz.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {viz.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {viz.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {viz.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    {viz.isAvailable ? (
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-900 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    ) : (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-md flex-shrink-0 ml-4 h-fit">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              );

              return viz.isAvailable ? (
                <Link key={index} href={viz.href} className="group">
                  {CardContent}
                </Link>
              ) : (
                <div key={index} className="opacity-60 cursor-not-allowed">
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Concepts */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Key Concepts
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Convolution Operations
              </h3>
              <p className="text-gray-600 text-sm">
                Learn how convolution kernels extract features from images through sliding windows and mathematical operations.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Feature Extraction
              </h3>
              <p className="text-gray-600 text-sm">
                Understand how neural networks identify patterns, edges, and complex features in visual data.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Object Recognition
              </h3>
              <p className="text-gray-600 text-sm">
                Explore how models detect and classify objects using bounding boxes and confidence scores.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Image Segmentation
              </h3>
              <p className="text-gray-600 text-sm">
                Discover techniques for pixel-level classification and separating objects from backgrounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comments */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Discussion
          </h2>
          <GiscusComments />
        </div>
      </section>
    </div>
  );
}
