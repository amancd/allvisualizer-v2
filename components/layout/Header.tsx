'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100' 
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-black rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-10 h-10 bg-black rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">A</span>
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900">
              AllVisualizer
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link 
              href="/" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all"
            >
              Home
            </Link>
            <Link 
              href="/categories" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all"
            >
              Categories
            </Link>
            <Link 
              href="/search" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-1"
              title="Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Link>
            <Link 
              href="/support" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all"
            >
              Support
            </Link>
            <Link 
              href="/contact" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all"
            >
              Contact
            </Link>
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <a
              href="https://play.google.com/store/apps/details?id=com.atomdyno.dsavisualizer"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-lg transition-all hover:bg-gray-800"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <div className="text-left">
                <div className="text-xs leading-none">GET IT ON</div>
                <div className="text-sm font-bold leading-tight">Google Play</div>
              </div>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
            aria-label="Toggle menu"
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
          <div className="lg:hidden pb-6 pt-4 border-t border-gray-100 mt-2 slide-down bg-white">
            <div className="flex flex-col space-y-1">
              <Link 
                href="/" 
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/categories" 
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/search" 
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </Link>
              <Link 
                href="/support" 
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <Link 
                href="/contact" 
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 mt-2 border-t border-gray-100">
                <Link href="/categories">
                  <Button fullWidth size="md">
                    Explore Categories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
