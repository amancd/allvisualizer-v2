import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('statistics', 'distributions');

export default function DistributionsPage() {
  return <TopicPage subjectId="statistics" topicSlug="distributions" />;
}
