import type { PatternCategory } from '@/config/dsa-patterns';

interface PatternSidebarProps {
  categories: PatternCategory[];
  activeSlug: string;
  totalPatterns: number;
  open: boolean;
  onSelect: (slug: string) => void;
  onClose: () => void;
}

/** Category list. Sticky on desktop, a slide-in drawer on mobile. */
export default function PatternSidebar({ categories, activeSlug, totalPatterns, open, onSelect, onClose }: PatternSidebarProps) {
  return (
    <aside
      className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-line bg-subtle transition-transform lg:translate-x-0 ${
        open ? 'translate-x-0 shadow-card-hover' : '-translate-x-full'
      }`}
    >
      {open && <div className="fixed inset-0 -z-10 bg-ink/30 backdrop-blur-[1px] lg:hidden" onClick={onClose} />}

      <div className="p-4">
        <div className="mb-4 rounded-xl border border-line bg-white p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Pattern library</p>
          <p className="mt-1 text-sm text-ink-muted">
            <span className="font-semibold text-ink">{totalPatterns}</span> patterns in {categories.length} topics
          </p>
        </div>

        <nav className="space-y-0.5">
          {categories.map((cat, i) => {
            const active = activeSlug === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => onSelect(cat.slug)}
                className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  active ? 'bg-white font-semibold text-ink shadow-card ring-1 ring-line' : 'text-ink-muted hover:bg-white/70 hover:text-ink'
                }`}
              >
                {active && <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-brand-600" />}
                <span className={`w-5 font-mono text-[11px] ${active ? 'text-brand-600' : 'text-ink-faint'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 truncate">{shortName(cat)}</span>
                <span className={`rounded-full px-1.5 text-[11px] tabular-nums ${active ? 'bg-brand-50 text-brand-700' : 'text-ink-faint'}`}>
                  {cat.subPatterns.length}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

/** "Two Pointer Patterns" -> "Two Pointer" */
export const shortName = (cat: PatternCategory) => cat.name.replace(/ Patterns$/, '');
