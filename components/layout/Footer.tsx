import Link from 'next/link';
import Logo from './Logo';

/**
 * Footer links are only for pages the header doesn't already link to,
 * so no destination appears twice on a page.
 */
const links = [
  { label: 'Support', href: '/support' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-subtle">
      <div className="page-container">
        <div className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo asLink={false} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              Open-source interactive visualizations for algorithms, math, physics, chemistry, statistics and machine learning, plus DSA pattern notes for interview prep.
            </p>

            {/* App store badges: hidden for now. Uncomment to show them again.
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href="https://play.google.com/store/apps/details?id=com.atomdyno.dsavisualizer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-lg bg-ink px-3.5 py-2 text-white transition-colors hover:bg-gray-800"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <span className="text-left">
                  <span className="block text-[10px] uppercase leading-none tracking-wide text-gray-300">Get it on</span>
                  <span className="block text-sm font-semibold leading-tight">Google Play</span>
                </span>
              </a>
              <a
                href="https://apps.apple.com/in/app/dsa-visualizer-pro/id6755734572"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-lg bg-ink px-3.5 py-2 text-white transition-colors hover:bg-gray-800"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                </svg>
                <span className="text-left">
                  <span className="block text-[10px] uppercase leading-none tracking-wide text-gray-300">Download on the</span>
                  <span className="block text-sm font-semibold leading-tight">App Store</span>
                </span>
              </a>
            </div>
            */}
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 md:pt-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-ink-muted transition-colors hover:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-line py-6 text-center sm:text-left">
          <p className="text-sm text-ink-muted">© {currentYear} AllVisualizer. Made for learners.</p>
        </div>
      </div>
    </footer>
  );
}
