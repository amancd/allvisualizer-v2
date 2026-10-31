import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('ai-ml', 'classical-ml');

export default function ClassicalMlPage() {
  return <TopicPage subjectId="ai-ml" topicSlug="classical-ml" />;
}
