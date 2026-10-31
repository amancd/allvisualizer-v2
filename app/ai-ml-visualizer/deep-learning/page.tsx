import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('ai-ml', 'deep-learning');

export default function DeepLearningPage() {
  return <TopicPage subjectId="ai-ml" topicSlug="deep-learning" />;
}
