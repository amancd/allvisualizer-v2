import type { LucideIcon } from 'lucide-react';
import { Breadcrumbs, type Crumb } from '@/components/ui';

interface ContentHeaderProps {
  breadcrumbs: Crumb[];
  title: React.ReactNode;
  description?: React.ReactNode;
  /** A Lucide icon. Emojis are intentionally not supported (see CLAUDE.md). */
  icon?: LucideIcon;
  /** Badges or metadata shown under the description, e.g. difficulty and complexity. */
  meta?: React.ReactNode;
}

/** Header for topic and detail pages: breadcrumbs, icon, title, description. */
export default function ContentHeader({ breadcrumbs, title, description, icon: Icon, meta }: ContentHeaderProps) {
  return (
    <header className="hero-surface border-b border-line">
      <div className="page-container pt-24 md:pt-28 pb-10">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />
        <div className="flex items-start gap-4">
          {Icon && (
            <span className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-card ring-1 ring-line">
              <Icon className="h-6 w-6" />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">{title}</h1>
            {description && <p className="mt-3 max-w-3xl text-lg leading-relaxed text-ink-muted">{description}</p>}
            {meta && <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink-muted">{meta}</div>}
          </div>
        </div>
      </div>
    </header>
  );
}
