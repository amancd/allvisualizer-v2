import type { Metadata } from 'next';
import { TopicPage, topicMetadata } from '@/components/content';
import { getSubject } from '@/config/content';

interface PageProps {
  params: Promise<{ category: string }>;
}

/** DSA topics share one route; each topic in config/content/dsa.ts gets a page. */
export function generateStaticParams() {
  return getSubject('dsa').topics.map((t) => ({ category: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  return topicMetadata('dsa', category);
}

export default async function DSATopicPage({ params }: PageProps) {
  const { category } = await params;
  return <TopicPage subjectId="dsa" topicSlug={category} />;
}
