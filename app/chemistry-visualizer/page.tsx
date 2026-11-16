import type { Metadata } from 'next';
import { SubjectPage } from '@/components/content';

export const metadata: Metadata = {
  title: 'Chemistry Visualizer - Interactive Chemistry | AllVisualizer',
  description: 'Learn chemistry through interactive visualizations. Explore atomic structure, chemical bonding, stoichiometry, reaction kinetics, equilibrium, pH and titrations.',
  keywords: ['chemistry visualizer', 'electron configuration', 'VSEPR', 'balancing equations', 'stoichiometry', 'reaction kinetics', 'equilibrium', 'titration', 'pH'],
  openGraph: {
    title: 'Chemistry Visualizer - Interactive Learning | AllVisualizer',
    description: 'Master chemistry concepts through interactive visualizations',
  },
};

export default function ChemistryVisualizerPage() {
  return <SubjectPage subjectId="chemistry" />;
}
