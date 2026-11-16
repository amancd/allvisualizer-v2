import type { Metadata } from 'next';
import { SubjectPage } from '@/components/content';

export const metadata: Metadata = {
  title: 'Statistics & Probability Visualizer - Interactive Statistics | AllVisualizer',
  description: 'Learn statistics and probability through interactive simulations. Explore Bayes\' theorem, binomial and Poisson distributions, box plots, correlation, confidence intervals and hypothesis testing.',
  keywords: ['statistics visualizer', 'probability', 'bayes theorem', 'binomial distribution', 'poisson distribution', 'box plot', 'confidence interval', 'hypothesis testing', 'p-value'],
  openGraph: {
    title: 'Statistics & Probability Visualizer - Interactive Learning | AllVisualizer',
    description: 'Master statistics and probability through interactive simulations',
  },
};

export default function StatisticsVisualizerPage() {
  return <SubjectPage subjectId="statistics" />;
}
