'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 slide-down">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold gradient-text transition-transform group-hover:scale-105">
              AllVisualizer
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-all hover:scale-105 transform">
              Home
            </Link>
            <Link href="/dsa-visualizer" className="text-gray-700 hover:text-indigo-600 transition-all hover:scale-105 transform">
              DSA Visualizer
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-indigo-600 transition-all flex items-center hover:scale-105 transform">
                Categories
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 scale-95 group-hover:scale-100">
                <div className="py-2">
                  <Link href="/dsa-visualizer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors">
                    DSA Visualizer
                  </Link>
                  <div className="px-4 py-2 text-sm text-gray-400">
                    More coming soon...
                  </div>
                </div>
              </div>
            </div>
            <Link href="/about" className="text-gray-700 hover:text-indigo-600 transition-all hover:scale-105 transform">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-indigo-600 transition-all hover:scale-105 transform">
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all hover:scale-105 transform"
          >
            <svg className="w-6 h-6 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 slide-down">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-all hover:translate-x-2 transform">
                Home
              </Link>
              <Link href="/dsa-visualizer" className="text-gray-700 hover:text-indigo-600 transition-all hover:translate-x-2 transform">
                DSA Visualizer
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600 transition-all hover:translate-x-2 transform">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-indigo-600 transition-all hover:translate-x-2 transform">
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
