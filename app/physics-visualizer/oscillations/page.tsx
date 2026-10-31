import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('physics', 'oscillations');

export default function OscillationsPage() {
  return <TopicPage subjectId="physics" topicSlug="oscillations" />;
}
