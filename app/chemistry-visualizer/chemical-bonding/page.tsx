import { TopicPage, topicMetadata } from '@/components/content';

export const metadata = topicMetadata('chemistry', 'chemical-bonding');

export default function ChemicalBondingPage() {
  return <TopicPage subjectId="chemistry" topicSlug="chemical-bonding" />;
}
