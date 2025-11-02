export default function AboutPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-indigo-100">
            Making learning accessible through visualization
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              AllVisualizer is dedicated to transforming the way people learn complex concepts. We believe that 
              visualization is a powerful tool for understanding, and we're committed to creating interactive, 
              engaging learning experiences that make difficult topics accessible to everyone.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
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

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
              Why Visualization?
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Research shows that visual learning significantly improves comprehension and retention. 
              By seeing how algorithms work step-by-step, or how mathematical concepts unfold in real-time, 
              learners can build intuition and deep understanding that goes beyond memorization.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
              Our Community
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Join thousands of learners, students, and professionals who use AllVisualizer to master 
              complex concepts. Connect with fellow learners on our Discord community to discuss topics, 
              share insights, and learn together.
            </p>

            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 mt-8">
              <p className="text-lg text-gray-700 italic">
                "Learning should be engaging, interactive, and accessible to everyone. That's the vision 
                behind AllVisualizer."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
