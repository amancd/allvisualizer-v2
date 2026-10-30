import Link from 'next/link';
import { Search, Github } from 'lucide-react';
import { PageHeader, buttonStyles } from '@/components/ui';
import CategoryCard from '@/components/catalog/CategoryCard';
import { categories } from '@/config/categories';

export default function CategoriesPage() {
  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Categories' }]}
        title="Browse all categories"
        description="Interactive visualizations and notes across computer science, math, physics and AI."
      >
        <Link
          href="/search"
          className="mx-auto mt-8 flex h-12 max-w-xl items-center gap-3 rounded-xl border border-line-strong bg-white px-4 text-left text-ink-faint shadow-card transition-colors hover:border-brand-300"
        >
          <Search className="h-5 w-5" />
          <span className="flex-1 text-sm">Search topics, visualizations and concepts…</span>
        </Link>
      </PageHeader>

      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-subtle py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">Can&apos;t find what you&apos;re looking for?</h2>
          <p className="mt-3 text-ink-muted">We add new categories and visualizations regularly. Request a topic or contribute one.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contact" className={buttonStyles({ size: 'lg' })}>Request a topic</Link>
            <a
              href="https://github.com/amancd/allvisualizer-v2"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: 'outline', size: 'lg' })}
            >
              <Github className="h-5 w-5" /> Contribute on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
