import type { Metadata } from 'next';
import { SubjectPage } from '@/components/content';

export const metadata: Metadata = {
  title: "Math Visualizer - Interactive Mathematics | AllVisualizer",
  description: "Master mathematics through interactive visualizations. Learn Calculus, Linear Algebra, Trigonometry, and more with step-by-step visual representations.",
  keywords: ["math visualizer", "calculus", "linear algebra", "trigonometry", "matrix operations", "derivatives", "integrals"],
  openGraph: {
    title: "Math Visualizer - Interactive Learning | AllVisualizer",
    description: "Master math concepts through interactive visualizations",
  },
};

export default function MathVisualizerPage() {
  return <SubjectPage subjectId="math" />;
}
