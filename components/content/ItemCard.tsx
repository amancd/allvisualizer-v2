import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { isAvailable, type ContentItem } from '@/config/content';
import DifficultyBadge from './DifficultyBadge';
import Tag from './Tag';

/** One visualizer/problem in a topic list. Coming-soon items render greyed out and unlinked. */
export default function ItemCard({ item, href }: { item: ContentItem; href: string }) {
  const live = isAvailable(item);

  const body = (
    <div
      className={`flex h-full flex-col rounded-card border border-line bg-white p-5 shadow-card transition-all ${
        live ? 'group-hover:-translate-y-0.5 group-hover:border-brand-200 group-hover:shadow-card-hover' : 'opacity-60'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-ink group-hover:text-brand-700">{item.title}</h3>
        {live ? <DifficultyBadge level={item.difficulty} /> : <Tag>Coming soon</Tag>}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {item.tags.slice(0, 4).map((t) => <Tag key={t}>{t}</Tag>)}
      </div>
      {live && (
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-700">
          Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      )}
    </div>
  );

  return live ? (
    <Link href={href} className="group block h-full">{body}</Link>
  ) : (
    <div className="h-full" aria-disabled>{body}</div>
  );
}
