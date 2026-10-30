import Link from 'next/link';
import { ArrowRight, MousePointerClick, Layers, Github, Sparkles } from 'lucide-react';
import { PageHeader, SectionHeader, buttonStyles } from '@/components/ui';
import CategoryCard from '@/components/catalog/CategoryCard';
import { categories } from '@/config/categories';

const available = categories.filter((c) => c.status !== 'Coming Soon');

const stats = [
  { value: '43', label: 'DSA patterns' },
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
        eyebrow={<><Sparkles className="h-3.5 w-3.5" /> New: 43 DSA patterns with code templates</>}
        title={<>Learn hard concepts by <span className="text-gradient">seeing them move</span></>}
        description="Open-source interactive visualizations for algorithms, mathematics, physics and machine learning. Step through every idea instead of memorizing it."
        actions={
          <>
            <Link href="/categories" className={buttonStyles({ size: 'lg' })}>
              Browse categories <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dsa-patterns" className={buttonStyles({ variant: 'outline', size: 'lg' })}>
              Explore DSA Patterns
            </Link>
          </>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Pick a subject"
            description="Start with whatever you're studying right now."
            action={
              <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
                All categories <ArrowRight className="h-4 w-4" />
              </Link>
            }
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

      <section className="border-y border-line bg-subtle py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Why AllVisualizer" description="Built for the moment a concept finally clicks." />
          <div className="grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-card border border-line bg-white p-6 shadow-card">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{description}</p>
              </div>
            ))}
          </div>
          <figure className="mt-12 text-center">
            <blockquote className="text-lg italic text-ink-muted">&ldquo;Imagination is more important than knowledge.&rdquo;</blockquote>
            <figcaption className="mt-1 text-sm text-ink-faint">Albert Einstein</figcaption>
          </figure>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-fuchsia-50 px-6 py-14 text-center shadow-card sm:px-12">
            <div className="absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] opacity-70" aria-hidden />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">Start your learning journey today</h2>
              <p className="mx-auto mt-3 max-w-xl text-ink-muted">
                Pick a topic, press play and see the idea unfold step by step.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/categories" className={buttonStyles({ size: 'lg' })}>Explore all categories</Link>
                <Link href="/dsa-visualizer" className={buttonStyles({ variant: 'outline', size: 'lg' })}>
                  Start with DSA
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
