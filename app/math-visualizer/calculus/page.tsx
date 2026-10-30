import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('math', 'calculus');

export default function CalculusPage() {
  return <TopicPage subjectId="math" topicSlug="calculus" />;
}
