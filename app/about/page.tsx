import type { Metadata } from "next";

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
      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-xl text-gray-600 mb-12">
            Making learning accessible through visualization
          </p>

          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6">
              AllVisualizer is dedicated to transforming the way people learn complex concepts. We believe that 
              visualization is a powerful tool for understanding, and we're committed to creating interactive, 
              engaging learning experiences that make difficult topics accessible to everyone.
            </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why Visualization?
              </h2>
            <p className="text-lg text-gray-700 mb-6">
              Research shows that visual learning significantly improves comprehension and retention. 
              By seeing how algorithms work step-by-step, or how mathematical concepts unfold in real-time, 
              learners can build intuition and deep understanding that goes beyond memorization.
            </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Community
              </h2>
            <p className="text-lg text-gray-700 mb-6">
              Join thousands of learners, students, and professionals who use AllVisualizer to master 
              complex concepts. Connect with fellow learners on our Discord community to discuss topics, 
              share insights, and learn together.
            </p>

              <div className="border-l-4 border-indigo-600 pl-6 mt-8">
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
