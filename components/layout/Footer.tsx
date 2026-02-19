import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between gap-6 text-sm text-gray-500">
          <div className="space-y-1">
            <p className="font-medium text-gray-900">AllVisualizer</p>
            <p>&copy; {currentYear} All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/dsa-patterns" className="hover:text-gray-900 transition-colors">DSA Patterns</Link>
            <Link href="/chess-support" className="hover:text-gray-900 transition-colors">Chess Support</Link>
            <a href="https://github.com/amancd/allvisualizer-v2" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">GitHub</a>
            <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-gray-900 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
