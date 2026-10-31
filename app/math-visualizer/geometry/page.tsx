import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('math', 'geometry');

export default function GeometryPage() {
  return <TopicPage subjectId="math" topicSlug="geometry" />;
}
