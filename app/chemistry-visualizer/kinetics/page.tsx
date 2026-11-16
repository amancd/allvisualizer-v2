import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('chemistry', 'kinetics');

export default function KineticsPage() {
  return <TopicPage subjectId="chemistry" topicSlug="kinetics" />;
}
