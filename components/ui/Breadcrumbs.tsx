import Link from 'next/link';

export interface Crumb {
  label: string;
  /** Omit for the current page. */
  href?: string;
}

/** "Home / Physics / Mechanics" trail. The last crumb is the current page. */
export default function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 text-sm text-ink-muted ${className}`}>
      {items.map((crumb, i) => (
        <span key={crumb.label} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-ink-faint" aria-hidden>/</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="transition-colors hover:text-ink">{crumb.label}</Link>
          ) : (
            <span className="font-medium text-ink" aria-current="page">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
