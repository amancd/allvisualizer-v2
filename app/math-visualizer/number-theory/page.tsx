import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('math', 'number-theory');

export default function NumberTheoryPage() {
  return <TopicPage subjectId="math" topicSlug="number-theory" />;
}
