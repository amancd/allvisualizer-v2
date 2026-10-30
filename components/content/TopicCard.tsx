import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { accents } from '@/components/ui';
import { countAvailable, isAvailable, topicHref, type Subject, type Topic } from '@/config/content';
import Tag from './Tag';

/** A topic tile on a subject landing page. */
export default function TopicCard({ subject, topic }: { subject: Subject; topic: Topic }) {
  const live = isAvailable(topic);
  const Icon = topic.icon;
  const count = countAvailable(topic);
  const accent = accents[subject.accent];

  const body = (
    <div
      className={`flex h-full flex-col rounded-card border border-line bg-white p-5 shadow-card transition-all ${
        live ? 'group-hover:-translate-y-0.5 group-hover:border-brand-200 group-hover:shadow-card-hover' : 'opacity-60'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-lg ring-1 ring-inset ${live ? accent.icon : accents.gray.icon}`}>
          <Icon className="h-5 w-5" />
        </span>
        {!live && <Tag>Coming soon</Tag>}
      </div>
      <h3 className="mt-4 font-semibold text-ink">{topic.title}</h3>
      <p className="mt-1.5 text-sm text-ink-muted">{topic.summary}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {topic.highlights.slice(0, 4).map((h) => <Tag key={h}>{h}</Tag>)}
      </div>
      {live && (
        <div className="mt-auto flex items-center justify-between pt-5 text-sm">
          <span className="text-ink-faint">
            <span className="font-semibold text-ink">{count}</span> {subject.itemNoun}
          </span>
          <span className={`inline-flex items-center gap-1 font-semibold ${accent.text}`}>
            Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      )}
    </div>
  );

  return live ? (
    <Link href={topicHref(subject, topic)} className="group block h-full">{body}</Link>
  ) : (
    <div className="h-full" aria-disabled>{body}</div>
  );
}
