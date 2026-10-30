import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('physics', 'mechanics');

export default function MechanicsPage() {
  return <TopicPage subjectId="physics" topicSlug="mechanics" />;
}
