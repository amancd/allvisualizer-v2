'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';
import { Button, PageHeader, buttonStyles } from '@/components/ui';
import { Tag } from '@/components/content';
import { searchIndex, subjects } from '@/config/content';

const filters = ['All', 'DSA', ...subjects.filter((s) => s.id !== 'dsa').map((s) => s.shortTitle)];
const popular = ['two pointers', 'calculus', 'waves', 'neural networks', 'matrices', 'mechanics', 'integration', 'linked list'];

function matches(entry: (typeof searchIndex)[number], q: string) {
  return [entry.title, entry.description, entry.subject, entry.topic, ...entry.tags].some((field) =>
    field.toLowerCase().includes(q),
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return searchIndex.filter((e) => (filter === 'All' || e.subject === filter) && (!q || matches(e, q)));
  }, [query, filter]);

  const reset = () => {
    setQuery('');
    setFilter('All');
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Search' }]}
        title="Search AllVisualizer"
        description="Find topics, visualizations and concepts across every subject."
      >
        <div className="relative mx-auto mt-8 max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            placeholder="Search for topics, algorithms, concepts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="h-14 w-full rounded-xl border border-line-strong bg-white pl-12 pr-12 text-base text-ink shadow-card placeholder:text-ink-faint focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === f ? 'bg-brand-600 text-white shadow-brand' : 'bg-white text-ink-muted ring-1 ring-inset ring-line hover:text-ink'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </PageHeader>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-sm text-ink-muted">
            <span className="font-semibold text-ink">{results.length}</span> {results.length === 1 ? 'result' : 'results'}
            {query && <> for &ldquo;{query}&rdquo;</>}
          </p>

          {results.length === 0 ? (
            <div className="rounded-card border border-dashed border-line-strong py-16 text-center">
              <h2 className="text-xl font-semibold text-ink">No results found</h2>
              <p className="mt-2 text-ink-muted">Try different keywords or browse the categories.</p>
              <div className="mt-6 flex justify-center gap-3">
                <Button onClick={reset}>Clear filters</Button>
                <Link href="/categories" className={buttonStyles({ variant: 'outline' })}>Browse categories</Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {results.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="group flex items-start gap-4 rounded-card border border-line bg-white p-5 shadow-card transition-all hover:border-brand-200 hover:shadow-card-hover"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-ink-faint">
                        {r.subject} · {r.topic}
                      </p>
                      <h3 className="mt-1 font-semibold text-ink group-hover:text-brand-700">{r.title}</h3>
                      <p className="mt-1 text-sm text-ink-muted">{r.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {r.tags.slice(0, 5).map((t) => <Tag key={t}>{t}</Tag>)}
                      </div>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {!query && (
        <section className="border-t border-line bg-subtle py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl font-semibold text-ink">Popular topics</h2>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {popular.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setQuery(topic)}
                  className="rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink-muted shadow-card transition-colors hover:border-brand-300 hover:text-ink"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
