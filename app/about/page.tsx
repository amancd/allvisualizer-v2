import type { Metadata } from "next";
import { PageHeader } from '@/components/ui';

export const metadata: Metadata = {
  title: "About Us - AllVisualizer",
  description: "Learn about AllVisualizer's mission to make learning accessible through interactive visualizations for Data Structures, Algorithms, and more.",
  openGraph: {
    title: "About Us - AllVisualizer",
    description: "Making learning accessible through visualization",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        align="left"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
        title="About Us"
        description="Making learning accessible through visualization"
      />
      <section className="py-12 md:py-16">
        <div className="page-container">

          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-ink mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6">
              AllVisualizer is dedicated to transforming the way people learn complex concepts. We believe that 
              visualization is a powerful tool for understanding, and we're committed to creating interactive, 
              engaging learning experiences that make difficult topics accessible to everyone.
            </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-ink mb-4">
                What We Do
              </h2>
            <p className="text-lg text-gray-700 mb-6">
              We create interactive visualizations for various subjects including:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 mb-6 space-y-2">
              <li>Data Structures and Algorithms</li>
              <li>Mathematics (Coming Soon)</li>
              <li>Physics (Coming Soon)</li>
              <li>Artificial Intelligence and Machine Learning (Coming Soon)</li>
            </ul>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-ink mb-4">
                Why Visualization?
              </h2>
            <p className="text-lg text-gray-700 mb-6">
              Research shows that visual learning significantly improves comprehension and retention. 
              By seeing how algorithms work step-by-step, or how mathematical concepts unfold in real-time, 
              learners can build intuition and deep understanding that goes beyond memorization.
            </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-ink mb-4">
                Our Community
              </h2>
            <p className="text-lg text-gray-700 mb-6">
              Join thousands of learners, students, and professionals who use AllVisualizer to master 
              complex concepts. Share insights and learn together as part of our growing community.
            </p>

              <div className="border-l-4 border-brand-500 pl-6 mt-8">
                <p className="text-lg text-gray-700 italic">
                  "Learning should be engaging, interactive, and accessible to everyone. That's the vision 
                  behind AllVisualizer."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
