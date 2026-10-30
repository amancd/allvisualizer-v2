import Link from 'next/link';
import { ArrowRight, MousePointerClick, Layers, Github, Sparkles } from 'lucide-react';
import { PageHeader, SectionHeader, buttonStyles } from '@/components/ui';
import { CardGrid } from '@/components/content';
import CategoryCard from '@/components/catalog/CategoryCard';
import { categories } from '@/config/categories';
import { totalPatterns } from '@/config/dsa-patterns';

const available = categories.filter((c) => c.status !== 'Coming Soon');

const stats = [
  { value: String(totalPatterns), label: 'DSA patterns' },
  { value: `${available.filter((c) => c.id !== 'dsa-patterns').reduce((n, c) => n + c.count, 0)}+`, label: 'interactive visualizers' },
  { value: '4', label: 'subjects' },
  { value: '100%', label: 'free & open source' },
];

const features = [
  {
    icon: MousePointerClick,
    title: 'Interactive, not passive',
    description: 'Change inputs, step through each operation and watch state update in real time.',
  },
  {
    icon: Layers,
    title: 'Theory next to the visual',
    description: 'Every visualizer pairs the animation with the explanation, complexity and code.',
  },
  {
    icon: Github,
    title: 'Open source',
    description: 'Built in the open. Suggest topics, report issues or contribute a visualizer on GitHub.',
  },
];

export default function Home() {
  const [featured, ...rest] = available;

  return (
    <div>
      <PageHeader
        eyebrow={<><Sparkles className="h-3.5 w-3.5" /> New: {totalPatterns} DSA patterns with code templates</>}
        title={<>Learn hard concepts by <span className="text-gradient">seeing them move</span></>}
        description="Open-source interactive visualizations for algorithms, mathematics, physics and machine learning. Step through every idea instead of memorizing it."
        actions={
          <Link href="/categories" className={buttonStyles({ size: 'lg' })}>
            Browse categories <ArrowRight className="h-4 w-4" />
          </Link>
        }
      >
        <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line shadow-card sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/90 px-4 py-5 backdrop-blur">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-2xl font-bold tracking-tight text-ink">{s.value}</dd>
              <dd className="mt-0.5 text-xs text-ink-muted">{s.label}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <section className="py-16 md:py-24">
        <div className="page-container">
          <SectionHeader
            title="Pick a subject"
            description="Start with whatever you're studying right now."
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2">
              <CategoryCard category={featured} featured />
            </div>
            {rest.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-subtle py-16 md:py-24">
        <div className="page-container">
          <SectionHeader title="Why AllVisualizer" description="Built for the moment a concept finally clicks." />
          <CardGrid items={features} columns={3} />
          <figure className="mt-12 text-center">
            <blockquote className="text-lg italic text-ink-muted">&ldquo;Imagination is more important than knowledge.&rdquo;</blockquote>
            <figcaption className="mt-1 text-sm text-ink-faint">Albert Einstein</figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
