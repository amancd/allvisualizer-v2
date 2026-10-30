import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Github } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Support & Community | AllVisualizer',
  description: 'Support AllVisualizer and join our community. Learn how we sustain the platform through ads and how you can contribute to keep this project alive.',
  keywords: ['support', 'community', 'contribute', 'allvisualizer', 'help'],
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Support & Community
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Help us keep AllVisualizer free and accessible for learners worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            
            {/* How We Sustain */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                How We Sustain AllVisualizer
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Ad-Supported Platform</h3>
                    <p className="text-gray-700 mb-3">
                      <strong>We use non-intrusive advertisements to cover hosting charges and server costs.</strong> 
                      These ads help us maintain the platform, keep it running smoothly, and continue developing 
                      new features and visualizations.
                    </p>
                    <p className="text-gray-700">
                      AllVisualizer is committed to remaining <strong>completely free</strong> for all learners. 
                      By supporting our ads, you're helping us sustain this educational resource for students 
                      and educators worldwide.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What the Ads Support:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Server hosting</strong> - Reliable infrastructure to serve thousands of users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Domain costs</strong> - Maintaining our web presence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Development time</strong> - Creating new visualizations and features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Platform maintenance</strong> - Bug fixes, updates, and improvements</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contribute Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Contribute to Keep This Project Alive
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                AllVisualizer is an open-source project built with passion for education. Your contributions 
                help us continue building and maintaining this platform for learners worldwide.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Code Contributions */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Code Contributions</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Help us build new features, fix bugs, and improve existing visualizations. 
                    Every contribution makes a difference!
                  </p>
                  <a
                    href="https://github.com/amancd/allvisualizer-v2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    View on GitHub
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                {/* Report Issues */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
                      🐛
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Report Issues</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Found a bug or have a feature request? Report it on GitHub to help us improve 
                    the platform.
                  </p>
                  <a
                    href="https://github.com/amancd/allvisualizer-v2/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                  >
                    Report Issue
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                {/* Share Feedback */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                      💬
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Share Feedback</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Your feedback helps us understand what works and what doesn't. Share your 
                    learning experience with us.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    Contact Us
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>

                {/* Spread the Word */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                      📢
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Spread the Word</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Share AllVisualizer with students, teachers, and fellow learners. Help us reach 
                    more people who can benefit.
                  </p>
                </div>
              </div>
            </div>

            {/* Community */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Join Our Community
              </h2>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0 w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Connect on GitHub</h3>
                    <p className="text-gray-700 mb-4">
                      Join discussions, ask questions, share feedback, and connect with fellow learners 
                      in our GitHub Discussions. Contribute ideas and help shape the future of AllVisualizer.
                    </p>
                    <a
                      href="https://github.com/amancd/allvisualizer-v2/discussions"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="lg" leftIcon={<Github className="w-5 h-5" />}>
                        Join GitHub Discussions
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Thank You */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Your Support</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Whether you're using AllVisualizer, contributing code, reporting issues, or simply 
                sharing it with others, you're helping us build a better learning experience for 
                everyone. Together, we can make education more accessible and engaging.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
