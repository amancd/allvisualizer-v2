import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('chemistry', 'equilibrium');

export default function EquilibriumPage() {
  return <TopicPage subjectId="chemistry" topicSlug="equilibrium" />;
}
