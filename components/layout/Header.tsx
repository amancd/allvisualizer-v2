'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-orange-500 ${
      isScrolled
        ? 'shadow-md'
        : ''
    }`}>
      <nav className="w-full px-4 sm:px-6">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="text-base font-bold text-white hover:text-orange-100 transition-colors">
            AllVisualizer
          </Link>

          <div className="hidden sm:flex items-center gap-1 text-sm">
            <Link href="/dsa-patterns" className="px-3 py-1.5 text-orange-100 hover:text-white rounded-md hover:bg-orange-600 transition-all">
              DSA Patterns
            </Link>
            <Link href="/chess-support" className="px-3 py-1.5 text-orange-100 hover:text-white rounded-md hover:bg-orange-600 transition-all">
              Chess
            </Link>
            <a
              href="https://github.com/amancd/allvisualizer-v2"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-orange-100 hover:text-white rounded-md hover:bg-orange-600 transition-all"
            >
              GitHub
            </a>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-1.5 rounded-md text-orange-100 hover:bg-orange-600 transition-all"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden pb-4 pt-2 border-t border-orange-400 bg-orange-500">
            <div className="flex flex-col space-y-1 text-sm">
              <Link href="/dsa-patterns" className="px-3 py-2 text-orange-100 hover:text-white rounded-md hover:bg-orange-600" onClick={() => setIsMenuOpen(false)}>
                DSA Patterns
              </Link>
              <Link href="/chess-support" className="px-3 py-2 text-orange-100 hover:text-white rounded-md hover:bg-orange-600" onClick={() => setIsMenuOpen(false)}>
                Chess
              </Link>
              <a href="https://github.com/amancd/allvisualizer-v2" target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-orange-100 hover:text-white rounded-md hover:bg-orange-600">
                GitHub
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
