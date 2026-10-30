import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { neighboursOf, type SubjectId } from '@/config/content';

/** "Previous / Next" links between items of the same topic, in registry order. */
export default function ItemNav({ subject, item }: { subject: SubjectId; item: string }) {
  const { prev, next } = neighboursOf(subject, item);
  if (!prev && !next) return null;

  const card = 'group rounded-card border border-line bg-white p-4 shadow-card transition-all hover:border-brand-300 hover:shadow-card-hover';
  return (
    <nav aria-label="More in this topic" className="grid gap-3 sm:grid-cols-2">
      {prev ? (
        <Link href={prev.href} className={card}>
          <span className="flex items-center gap-1 text-xs text-ink-faint"><ArrowLeft className="h-3.5 w-3.5" /> Previous</span>
          <span className="mt-0.5 block font-semibold text-ink group-hover:text-brand-700">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={next.href} className={`${card} text-right`}>
          <span className="flex items-center justify-end gap-1 text-xs text-ink-faint">Next <ArrowRight className="h-3.5 w-3.5" /></span>
          <span className="mt-0.5 block font-semibold text-ink group-hover:text-brand-700">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
