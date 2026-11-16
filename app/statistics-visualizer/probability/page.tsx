import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('statistics', 'probability');

export default function ProbabilityPage() {
  return <TopicPage subjectId="statistics" topicSlug="probability" />;
}
