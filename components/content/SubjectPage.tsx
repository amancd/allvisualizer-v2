import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader, SectionHeader, buttonStyles } from '@/components/ui';
import { breadcrumbsFor, getSubject, isAvailable, itemHref, topicHref, type SubjectId } from '@/config/content';
import CardGrid from './CardGrid';
import ItemCard from './ItemCard';
import TopicCard from './TopicCard';

/**
 * Landing page for a subject (e.g. /physics-visualizer).
 * Everything shown here comes from `config/content/<subject>.ts`.
 */
export default function SubjectPage({ subjectId }: { subjectId: SubjectId }) {
  const subject = getSubject(subjectId);
  const firstTopic = subject.topics.find(isAvailable);
  const items = subject.topics.filter(isAvailable).flatMap((topic) =>
    topic.items.filter(isAvailable).map((item) => ({ item, href: itemHref(topic, item) })),
  );

  return (
    <div>
      <PageHeader
        breadcrumbs={breadcrumbsFor(subjectId)}
        title={`${subject.title} Visualizer`}
        description={subject.intro}
        actions={
          firstTopic && (
            <Link href={topicHref(subject, firstTopic)} className={buttonStyles({ size: 'lg' })}>
              Start with {firstTopic.title} <ArrowRight className="h-4 w-4" />
            </Link>
          )
        }
      />

      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Browse topics" description={`${subject.title} concepts, organized by topic.`} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subject.topics.map((topic) => (
              <TopicCard key={topic.slug} subject={subject} topic={topic} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-subtle py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={`All ${subject.itemNoun}`}
            description={`Every interactive ${subject.itemNoun.replace(/s$/, '')} in ${subject.title}.`}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ item, href }) => (
              <ItemCard key={href} item={item} href={href} />
            ))}
          </div>
        </div>
      </section>

      {[subject.whyLearn, subject.features].filter(Boolean).map((block) => (
        <section key={block!.title} className="border-t border-line py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title={block!.title} description={block!.description} />
            <CardGrid items={block!.items} columns={block!.items.length === 3 ? 3 : 4} />
          </div>
        </section>
      ))}
    </div>
  );
}
