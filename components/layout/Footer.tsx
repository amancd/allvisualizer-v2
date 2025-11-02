import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">AllVisualizer</h3>
            <p className="text-sm">
              Interactive visualizations for learning complex concepts in Data Structures, Algorithms, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-all hover:translate-x-1 inline-block transform">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dsa-visualizer" className="hover:text-white transition-all hover:translate-x-1 inline-block transform">
                  DSA Visualizer
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-all hover:translate-x-1 inline-block transform">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-all hover:translate-x-1 inline-block transform">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dsa-visualizer" className="hover:text-white transition-all hover:translate-x-1 inline-block transform">
                  Data Structures & Algorithms
                </Link>
              </li>
              <li className="text-gray-500 hover:text-gray-400 transition-colors cursor-not-allowed">Mathematics (Coming Soon)</li>
              <li className="text-gray-500 hover:text-gray-400 transition-colors cursor-not-allowed">Physics (Coming Soon)</li>
              <li className="text-gray-500 hover:text-gray-400 transition-colors cursor-not-allowed">AI/ML (Coming Soon)</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-all hover:translate-x-1 inline-block transform">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-all hover:translate-x-1 inline-block transform">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} AllVisualizer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
