import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('statistics', 'inference');

export default function InferencePage() {
  return <TopicPage subjectId="statistics" topicSlug="inference" />;
}
