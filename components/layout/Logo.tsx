import Link from 'next/link';
import { BRAND_MARK_PATH } from './brand';

/** The logo mark and wordmark. In the header it links home; elsewhere pass asLink={false} to avoid a duplicate link. */
export default function Logo({ className = '', asLink = true }: { className?: string; asLink?: boolean }) {
  const content = (
    <>
      <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 via-violet-500 to-fuchsia-500 shadow-brand transition-transform group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d={BRAND_MARK_PATH} />
        </svg>
      </span>
      <span className="text-[17px] font-bold tracking-tight text-ink">AllVisualizer</span>
    </>
  );
  const classes = `inline-flex items-center gap-2.5 group ${className}`;

  return asLink ? (
    <Link href="/" className={classes} aria-label="AllVisualizer home">{content}</Link>
  ) : (
    <span className={classes}>{content}</span>
  );
}
