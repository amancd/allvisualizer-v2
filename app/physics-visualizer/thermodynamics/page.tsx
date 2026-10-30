import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('physics', 'thermodynamics');

export default function ThermodynamicsPage() {
  return <TopicPage subjectId="physics" topicSlug="thermodynamics" />;
}
