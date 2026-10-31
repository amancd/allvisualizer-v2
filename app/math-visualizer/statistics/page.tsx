import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('math', 'statistics');

export default function StatisticsPage() {
  return <TopicPage subjectId="math" topicSlug="statistics" />;
}
