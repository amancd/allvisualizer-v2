import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getItem, isAvailable, itemHref, type SubjectId } from '@/config/content';
import Tag from './Tag';

/**
 * A related page. Use `slug` for anything in the content registry: its title,
 * link and live/coming-soon state are read from there, so they never go stale.
 * Use `title` for ideas that don't have a registry entry yet; they show as "Coming soon".
 */
export type RelatedEntry = { slug: string; note?: string } | { title: string; note: string };

interface RelatedItemsProps {
  subject: SubjectId;
  items: RelatedEntry[];
}

export default function RelatedItems({ subject, items }: RelatedItemsProps) {
  const cards = items.map((entry) => {
    if ('slug' in entry) {
      const { topic, item } = getItem(subject, entry.slug);
      return {
        title: item.title,
        note: entry.note ?? item.description,
        href: isAvailable(item) ? itemHref(topic, item) : undefined,
      };
    }
    return { title: entry.title, note: entry.note, href: undefined };
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) =>
        card.href ? (
          <Link
            key={card.title}
            href={card.href}
            className="group flex items-start justify-between gap-3 rounded-xl border border-line bg-white p-4 shadow-card transition-all hover:border-brand-200 hover:shadow-card-hover"
          >
            <div>
              <p className="font-semibold text-ink group-hover:text-brand-700">{card.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{card.note}</p>
            </div>
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" />
          </Link>
        ) : (
          <div key={card.title} className="rounded-xl border border-dashed border-line-strong bg-subtle p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-ink-muted">{card.title}</p>
              <Tag>Coming soon</Tag>
            </div>
            <p className="mt-1 text-sm text-ink-faint">{card.note}</p>
          </div>
        ),
      )}
    </div>
  );
}
