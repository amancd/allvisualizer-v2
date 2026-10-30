import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('ai-ml', 'neural-networks');

export default function NeuralNetworksPage() {
  return <TopicPage subjectId="ai-ml" topicSlug="neural-networks" />;
}
