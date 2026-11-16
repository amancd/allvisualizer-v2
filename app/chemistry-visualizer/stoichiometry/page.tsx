import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('chemistry', 'stoichiometry');

export default function StoichiometryPage() {
  return <TopicPage subjectId="chemistry" topicSlug="stoichiometry" />;
}
