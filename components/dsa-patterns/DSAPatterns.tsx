'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui';
import { patternCategories, totalPatterns } from '@/config/dsa-patterns';
import PatternCard from './PatternCard';
import PatternSidebar, { shortName } from './PatternSidebar';

/** The /dsa-patterns page: sidebar of categories, and the patterns of the selected one. */
export default function DSAPatterns() {
  const [activeSlug, setActiveSlug] = useState(patternCategories[0].slug);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeIndex = patternCategories.findIndex((c) => c.slug === activeSlug);
  const active = patternCategories[activeIndex];
  const prev = patternCategories[activeIndex - 1];
  const next = patternCategories[activeIndex + 1];
  const problemCount = active.subPatterns.reduce((n, sp) => n + sp.problems.length, 0);

  const select = (slug: string) => {
    setActiveSlug(slug);
    setSidebarOpen(false);
  };

  // Start each category at the top.
  useEffect(() => {
    document.getElementById('main-content')?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [activeSlug]);

  return (
    <div className="min-h-screen bg-white pt-16">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-brand lg:hidden"
        aria-label="Toggle pattern list"
      >
        <Menu className="h-4 w-4" /> Patterns
      </button>

      <div className="flex">
        <PatternSidebar
          categories={patternCategories}
          activeSlug={activeSlug}
          totalPatterns={totalPatterns}
          open={sidebarOpen}
          onSelect={select}
          onClose={() => setSidebarOpen(false)}
        />

        <main id="main-content" className="min-w-0 flex-1 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <div className="hero-surface border-b border-line">
            <div className="mx-auto max-w-4xl px-4 pt-10 pb-8 sm:px-6 lg:px-10">
              <Breadcrumbs
                className="mb-5"
                items={[{ label: 'Home', href: '/' }, { label: 'DSA Patterns' }, { label: shortName(active) }]}
              />
              <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">{active.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <Pill>{active.subPatterns.length} patterns</Pill>
                <Pill>{problemCount} practice problems</Pill>
              </div>

              {active.subPatterns.length > 1 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {active.subPatterns.map((sp, i) => (
                    <a
                      key={sp.slug}
                      href={`#${sp.slug}`}
                      className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-muted shadow-card transition-colors hover:border-brand-300 hover:text-brand-700"
                    >
                      <span className="mr-1.5 font-mono text-ink-faint">{i + 1}</span>
                      {/* "Two Pointers - Converging (Sorted Array Target Sum)" -> "Converging" */}
                      {sp.title.split(' - ').pop()?.replace(/\s*\(.*\)$/, '')}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-10">
            <div className="space-y-8">
              {active.subPatterns.map((sp, i) => (
                <PatternCard key={sp.slug} pattern={sp} index={i} />
              ))}
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {prev ? <NavButton label="← Previous" title={prev.name} onClick={() => select(prev.slug)} /> : <span />}
              {next && <NavButton label="Next →" title={next.name} onClick={() => select(next.slug)} alignRight />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white px-2.5 py-0.5 text-ink-muted ring-1 ring-inset ring-line">{children}</span>;
}

function NavButton({ label, title, onClick, alignRight = false }: { label: string; title: string; onClick: () => void; alignRight?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-card border border-line bg-white p-4 shadow-card transition-all hover:border-brand-300 hover:shadow-card-hover ${alignRight ? 'text-right' : 'text-left'}`}
    >
      <span className="text-xs text-ink-faint">{label}</span>
      <span className="mt-0.5 block font-semibold text-ink">{title}</span>
    </button>
  );
}
