import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge, accents } from '@/components/ui';
import type { Category, CategoryStatus } from '@/config/categories';

const statusVariant: Record<CategoryStatus, 'success' | 'warning' | 'info' | 'default'> = {
  Available: 'success',
  New: 'warning',
  Preview: 'info',
  'Coming Soon': 'default',
};

export default function CategoryCard({ category, featured = false }: { category: Category; featured?: boolean }) {
  const Icon = category.icon;
  const accent = accents[category.accent];
  const disabled = category.status === 'Coming Soon';

  const body = (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white p-6 shadow-card transition-all duration-200 ${
        disabled ? 'opacity-70' : 'group-hover:-translate-y-0.5 group-hover:border-brand-200 group-hover:shadow-card-hover'
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${accent.bar} opacity-0 transition-opacity ${disabled ? '' : 'group-hover:opacity-100'}`} />
      <div className="flex items-start justify-between gap-4">
        <span className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ring-inset ${accent.icon}`}>
          <Icon className="h-5 w-5" />
        </span>
        <Badge variant={statusVariant[category.status]}>{category.status}</Badge>
      </div>

      <h3 className={`mt-5 font-semibold tracking-tight text-ink ${featured ? 'text-2xl' : 'text-lg'}`}>{category.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{featured ? category.description : category.shortDescription}</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {category.topics.slice(0, featured ? 6 : 3).map((topic) => (
          <span key={topic} className="rounded-md bg-subtle px-2 py-1 text-xs text-ink-muted ring-1 ring-inset ring-line">
            {topic}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-6 text-sm">
        <span className="text-ink-faint">
          {category.count > 0 ? (
            <>
              <span className="font-semibold text-ink">{category.count}</span> {category.countLabel}
            </>
          ) : (
            'In the works'
          )}
        </span>
        {!disabled && (
          <span className={`inline-flex items-center gap-1 font-semibold ${accent.text}`}>
            Explore
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </div>
  );

  return disabled ? (
    <div className="group h-full" aria-disabled>{body}</div>
  ) : (
    <Link href={category.href} className="group block h-full">{body}</Link>
  );
}
