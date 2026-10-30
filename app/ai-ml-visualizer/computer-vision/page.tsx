import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('ai-ml', 'computer-vision');

export default function ComputerVisionPage() {
  return <TopicPage subjectId="ai-ml" topicSlug="computer-vision" />;
}
