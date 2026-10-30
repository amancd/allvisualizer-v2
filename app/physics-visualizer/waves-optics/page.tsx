import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('physics', 'waves-optics');

export default function WavesOpticsPage() {
  return <TopicPage subjectId="physics" topicSlug="waves-optics" />;
}
