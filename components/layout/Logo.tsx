import Link from 'next/link';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`} aria-label="AllVisualizer home">
      <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 via-violet-500 to-fuchsia-500 shadow-brand transition-transform group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 19 L10 5 L14 14 L16.5 10 L20 19" />
        </svg>
      </span>
      <span className="text-[17px] font-bold tracking-tight text-ink">AllVisualizer</span>
    </Link>
  );
}
