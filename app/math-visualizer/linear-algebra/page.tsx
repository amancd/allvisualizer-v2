import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('math', 'linear-algebra');

export default function LinearAlgebraPage() {
  return <TopicPage subjectId="math" topicSlug="linear-algebra" />;
}
