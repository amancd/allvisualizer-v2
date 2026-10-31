import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('ai-ml', 'reinforcement-learning');

export default function ReinforcementLearningPage() {
  return <TopicPage subjectId="ai-ml" topicSlug="reinforcement-learning" />;
}
