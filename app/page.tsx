import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AllVisualizer – DSA Patterns & Chess',
  description: 'DSA pattern notes with code templates, and chess tips & tricks.',
};

export default function Home() {
  return (
    <div className="bg-white min-h-screen pt-14">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AllVisualizer</h1>
        <p className="text-gray-600 text-sm mb-10">DSA patterns, notes, and code templates for coding interviews.</p>

        <div className="space-y-3">
          <Link
            href="/dsa-patterns"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div>
              <h2 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">DSA Patterns</h2>
              <p className="text-xs text-gray-500 mt-0.5">93 patterns &middot; Notes &middot; Code templates</p>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/chess-support"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div>
              <h2 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">Chess Tips & Tricks</h2>
              <p className="text-xs text-gray-500 mt-0.5">Support &middot; App info</p>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
