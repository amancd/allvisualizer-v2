import React from 'react';
import Breadcrumbs, { type Crumb } from './Breadcrumbs';

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
  align?: 'left' | 'center';
  children?: React.ReactNode;
}

/** Top-of-page hero used by every landing page so spacing and type stay consistent. */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  eyebrow,
  breadcrumbs,
  actions,
  align = 'center',
  children,
}) => {
  const centered = align === 'center';
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" aria-hidden />
      <div className="absolute inset-0 hero-glow" aria-hidden />
      <div className={`relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-14 md:pb-20 ${centered ? 'text-center' : ''}`}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} className={`mb-6 ${centered ? 'justify-center' : ''}`} />
        )}
        {eyebrow && (
          <div className={`mb-5 flex ${centered ? 'justify-center' : ''}`}>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-xs font-medium text-brand-700 shadow-card backdrop-blur">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink leading-[1.08] ${centered ? 'max-w-3xl mx-auto' : 'max-w-3xl'}`}>
          {title}
        </h1>
        {description && (
          <p className={`mt-5 text-lg md:text-xl text-ink-muted leading-relaxed ${centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
            {description}
          </p>
        )}
        {actions && (
          <div className={`mt-8 flex flex-col sm:flex-row gap-3 ${centered ? 'justify-center' : ''}`}>{actions}</div>
        )}
        {children}
      </div>
    </section>
  );
};

interface SectionHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, action, className = '' }) => (
  <div className={`mb-8 md:mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}>
    <div>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">{title}</h2>
      {description && <p className="mt-2 text-base md:text-lg text-ink-muted">{description}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);
