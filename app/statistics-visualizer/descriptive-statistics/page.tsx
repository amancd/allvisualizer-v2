import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('statistics', 'descriptive-statistics');

export default function DescriptiveStatisticsPage() {
  return <TopicPage subjectId="statistics" topicSlug="descriptive-statistics" />;
}
