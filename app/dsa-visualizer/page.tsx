import type { Metadata } from 'next';
import { SubjectPage } from '@/components/content';

export const metadata: Metadata = {
  title: "DSA Visualizer - Data Structures & Algorithms | AllVisualizer",
  description: "Master Data Structures and Algorithms through interactive visualizations. Learn Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, and more with step-by-step execution.",
  keywords: ["DSA visualizer", "data structures", "algorithms", "sorting algorithms", "graph algorithms", "tree traversal", "dynamic programming"],
  openGraph: {
    title: "DSA Visualizer - Interactive Learning | AllVisualizer",
    description: "Master DSA concepts through interactive visualizations",
  },
};

export default function DSAVisualizerPage() {
  return <SubjectPage subjectId="dsa" />;
}
