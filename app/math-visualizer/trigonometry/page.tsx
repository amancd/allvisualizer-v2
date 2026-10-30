import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('math', 'trigonometry');

export default function TrigonometryPage() {
  return <TopicPage subjectId="math" topicSlug="trigonometry" />;
}
