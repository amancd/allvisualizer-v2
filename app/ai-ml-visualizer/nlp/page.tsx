import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('ai-ml', 'nlp');

export default function NlpPage() {
  return <TopicPage subjectId="ai-ml" topicSlug="nlp" />;
}
