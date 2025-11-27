import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-6">
            {/* Brand Section */}
            <div className="col-span-2 md:col-span-2">
              <Link href="/" className="inline-flex items-center space-x-2 mb-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-black rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  AllVisualizer
                </div>
              </Link>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-xs">
                Master complex concepts through interactive visualization. Learn Data Structures, Algorithms, and more.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/amancd/allvisualizer-v2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-200 hover:bg-gray-900 text-gray-600 hover:text-white rounded-lg flex items-center justify-center transition-all"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/all_visualizer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-200 hover:bg-gray-900 text-gray-600 hover:text-white rounded-lg flex items-center justify-center transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/dsa-visualizer" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Visualizers
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/categories" className="text-gray-600 hover:text-gray-900 transition-colors">
                    All Categories
                  </Link>
                </li>
                <li>
                  <Link href="/dsa-visualizer" className="text-gray-600 hover:text-gray-900 transition-colors">
                    DSA
                  </Link>
                </li>
                <li>
                  <Link href="/math-visualizer" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Mathematics
                  </Link>
                </li>
                <li>
                  <Link href="/physics-visualizer" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Physics
                  </Link>
                </li>
                <li>
                  <Link href="/ai-ml-visualizer" className="text-gray-600 hover:text-gray-900 transition-colors">
                    AI & ML
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="https://github.com/amancd/allvisualizer-v2" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https://github.com/amancd/allvisualizer-v2" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <Link href="/support" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {currentYear} AllVisualizer. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <span>Made with</span>
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>for learners</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
