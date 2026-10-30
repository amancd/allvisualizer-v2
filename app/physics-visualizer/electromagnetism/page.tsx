import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('physics', 'electromagnetism');

export default function ElectromagnetismPage() {
  return <TopicPage subjectId="physics" topicSlug="electromagnetism" />;
}
