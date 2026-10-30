'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import Logo from './Logo';

const navLinks = [
  { href: '/categories', label: 'Categories', match: ['/categories', '/dsa-visualizer', '/math-visualizer', '/physics-visualizer', '/ai-ml-visualizer'] },
  { href: '/dsa-patterns', label: 'DSA Patterns', match: ['/dsa-patterns'] },
  { href: '/support', label: 'Support', match: ['/support'] },
  { href: '/contact', label: 'Contact', match: ['/contact'] },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (match: string[]) => match.some((m) => pathname === m || pathname.startsWith(`${m}/`));

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b transition-all duration-200 ${
        isScrolled || isMenuOpen
          ? 'bg-white/85 backdrop-blur-xl border-line shadow-[0_1px_0_rgb(16_24_40/0.02)]'
          : 'bg-white/60 backdrop-blur-md border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <Logo />

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.match);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? 'text-ink bg-subtle' : 'text-ink-muted hover:text-ink hover:bg-subtle'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/search"
              className="flex h-9 w-56 items-center gap-2 rounded-lg border border-line bg-subtle px-3 text-sm text-ink-faint transition-colors hover:border-line-strong hover:text-ink-muted"
            >
              <Search className="h-4 w-4" />
              <span>Search topics…</span>
            </Link>
            <a
              href="https://github.com/amancd/allvisualizer-v2"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
              aria-label="GitHub"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <Link href="/search" className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted hover:bg-subtle" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted hover:bg-subtle"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden slide-down border-t border-line py-3">
            <div className="flex flex-col gap-1">
              {[{ href: '/', label: 'Home', match: ['/'] }, ...navLinks].map((link) => {
                const active = link.href === '/' ? pathname === '/' : isActive(link.match);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium ${active ? 'bg-brand-50 text-brand-700' : 'text-ink-muted hover:bg-subtle hover:text-ink'}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href="https://github.com/amancd/allvisualizer-v2"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-subtle hover:text-ink"
              >
                GitHub
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
