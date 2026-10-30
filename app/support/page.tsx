import type { Metadata } from 'next';
import { Bug, Check, Code2, Github, Megaphone, MessageSquare } from 'lucide-react';
import { PageHeader, buttonStyles } from '@/components/ui';
import { Callout, CardGrid, ContentSection, type CardGridItem } from '@/components/content';

export const metadata: Metadata = {
  title: 'Support & Community | AllVisualizer',
  description:
    'Support AllVisualizer and join our community. Learn how we sustain the platform through ads and how you can contribute to keep this project alive.',
  keywords: ['support', 'community', 'contribute', 'allvisualizer', 'help'],
};

const repo = 'https://github.com/amancd/allvisualizer-v2';

const adsSupport = [
  { title: 'Server hosting', description: 'Reliable infrastructure to serve thousands of users' },
  { title: 'Domain costs', description: 'Maintaining our web presence' },
  { title: 'Development time', description: 'Creating new visualizations and features' },
  { title: 'Platform maintenance', description: 'Bug fixes, updates, and improvements' },
];

const waysToHelp: CardGridItem[] = [
  {
    icon: Code2,
    title: 'Code contributions',
    description: 'Help us build new features, fix bugs, and improve existing visualizations. Every contribution makes a difference.',
  },
  {
    icon: Bug,
    title: 'Report issues',
    description: (
      <>
        Found a bug or have a feature request?{' '}
        <a href={`${repo}/issues`} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:text-brand-800">
          Open an issue on GitHub
        </a>{' '}
        to help us improve the platform.
      </>
    ),
  },
  {
    icon: MessageSquare,
    title: 'Share feedback',
    description: "Your feedback helps us understand what works and what doesn't. Tell us about your learning experience.",
  },
  {
    icon: Megaphone,
    title: 'Spread the word',
    description: 'Share AllVisualizer with students, teachers, and fellow learners so it reaches more people who can benefit.',
  },
];

export default function SupportPage() {
  return (
    <div>
      <PageHeader
        align="left"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Support' }]}
        title="Support & Community"
        description="Help us keep AllVisualizer free and accessible for learners worldwide."
      />

      <div className="page-container space-y-14 py-12 md:py-16">
        <ContentSection title="How we sustain AllVisualizer">
          <Callout tone="note" title="Ad-supported platform">
            <p>
              <strong>We use non-intrusive advertisements to cover hosting and server costs.</strong> These ads keep the
              platform running smoothly and fund new features and visualizations.
            </p>
            <p className="mt-2">
              AllVisualizer is committed to staying <strong>completely free</strong> for all learners. By supporting our
              ads, you help sustain this resource for students and educators worldwide.
            </p>
          </Callout>

          <div className="mt-5 rounded-card border border-line bg-white p-6 shadow-card">
            <h3 className="font-semibold text-ink">What the ads support</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {adsSupport.map((item) => (
                <li key={item.title} className="flex gap-2.5 text-sm text-gray-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                  <span>
                    <strong className="text-ink">{item.title}</strong>: {item.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ContentSection>

        <ContentSection
          title="Contribute to keep this project alive"
          description="AllVisualizer is an open-source project built with passion for education. Your contributions help us keep building it for learners worldwide."
        >
          <CardGrid items={waysToHelp} />
        </ContentSection>

        <ContentSection title="Join our community">
          <div className="flex flex-col gap-5 rounded-card border border-line bg-white p-6 shadow-card sm:flex-row sm:items-center">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
              <Github className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <h3 className="font-semibold text-ink">Connect on GitHub</h3>
              <p className="mt-1 text-sm text-ink-muted">
                Join discussions, ask questions, share feedback, and connect with fellow learners. Contribute ideas and
                help shape the future of AllVisualizer.
              </p>
            </div>
            <a href={`${repo}/discussions`} target="_blank" rel="noopener noreferrer" className={buttonStyles()}>
              Join GitHub Discussions
            </a>
          </div>
        </ContentSection>

        <Callout tone="tip" title="Thank you for your support">
          Whether you&apos;re using AllVisualizer, contributing code, reporting issues, or simply sharing it with others,
          you&apos;re helping us build a better learning experience for everyone.
        </Callout>
      </div>
    </div>
  );
}
