import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { breadcrumbsFor, getSubject, getTopic, itemHref, type SubjectId } from '@/config/content';
import CardGrid from './CardGrid';
import ContentHeader from './ContentHeader';
import ContentSection from './ContentSection';
import Discussion from './Discussion';
import ItemCard from './ItemCard';
import AdSlot from '@/components/ads/AdSlot';

/** Metadata for a topic page, built from the registry. */
export function topicMetadata(subjectId: SubjectId, topicSlug: string): Metadata {
  const subject = getSubject(subjectId);
  const topic = getTopic(subjectId, topicSlug);
  if (!topic) return {};
  return {
    title: `${topic.title} - ${subject.title} Visualizer | AllVisualizer`,
    description: topic.intro,
    keywords: [topic.title, ...topic.highlights, subject.title],
  };
}

/**
 * Page for one topic (e.g. /physics-visualizer/mechanics): key concepts and the list of items.
 * Everything shown here comes from `config/content/<subject>.ts`.
 */
export default function TopicPage({ subjectId, topicSlug }: { subjectId: SubjectId; topicSlug: string }) {
  const subject = getSubject(subjectId);
  const topic = getTopic(subjectId, topicSlug);
  if (!topic) notFound();

  return (
    <div>
      <ContentHeader breadcrumbs={breadcrumbsFor(subjectId, topicSlug)} icon={topic.icon} title={topic.title} description={topic.intro} />

      <div className="page-container space-y-14 py-12">
        {topic.concepts && (
          <ContentSection title="Key concepts">
            <CardGrid items={topic.concepts} columns={topic.concepts.length === 3 ? 3 : 4} />
          </ContentSection>
        )}

        {topic.keyPoints && (
          <ContentSection title="Key points" variant="card">
            <ul className="grid gap-3 sm:grid-cols-2">
              {topic.keyPoints.map((point) => (
                <li key={point} className="flex gap-3 text-sm text-gray-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </ContentSection>
        )}

        <ContentSection title={subject.itemNoun.charAt(0).toUpperCase() + subject.itemNoun.slice(1)}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topic.items.map((item) => (
              <ItemCard key={item.slug} item={item} href={itemHref(topic, item)} />
            ))}
          </div>
        </ContentSection>

        <AdSlot placement="listing" />

        {topic.discussion && <Discussion />}
      </div>
    </div>
  );
}
