import type { LucideIcon } from 'lucide-react';

export interface CardGridItem {
  title: React.ReactNode;
  description: React.ReactNode;
  /** A Lucide icon. Emojis are intentionally not supported (see CLAUDE.md). */
  icon?: LucideIcon;
}

const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' } as const;

/**
 * Grid of small title + description cards. Used for key concepts, features,
 * real-world applications and similar lists.
 */
export default function CardGrid({ items, columns = 2 }: { items: CardGridItem[]; columns?: keyof typeof cols }) {
  return (
    <div className={`grid gap-4 ${cols[columns]}`}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="rounded-xl border border-line bg-white p-5 shadow-card">
            {Icon && (
              <span className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                <Icon className="h-[18px] w-[18px]" />
              </span>
            )}
            <h3 className="font-semibold text-ink">{item.title}</h3>
            <div className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.description}</div>
          </div>
        );
      })}
    </div>
  );
}
