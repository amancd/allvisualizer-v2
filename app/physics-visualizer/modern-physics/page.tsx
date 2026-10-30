import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('physics', 'modern-physics');

export default function ModernPhysicsPage() {
  return <TopicPage subjectId="physics" topicSlug="modern-physics" />;
}
