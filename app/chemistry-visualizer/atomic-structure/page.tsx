import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('chemistry', 'atomic-structure');

export default function AtomicStructurePage() {
  return <TopicPage subjectId="chemistry" topicSlug="atomic-structure" />;
}
