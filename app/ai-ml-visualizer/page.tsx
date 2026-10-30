import type { Metadata } from 'next';
import { SubjectPage } from '@/components/content';

export const metadata: Metadata = {
  title: "AI & Machine Learning Visualizer | AllVisualizer",
  description: "Master AI and Machine Learning concepts through interactive visualizations. Learn Neural Networks, Deep Learning, Computer Vision, NLP, and more with step-by-step animations.",
  keywords: ["AI visualizer", "machine learning", "neural networks", "deep learning", "computer vision", "NLP", "AI algorithms", "ML visualization"],
  openGraph: {
    title: "AI & ML Visualizer - Interactive Learning | AllVisualizer",
    description: "Master AI and ML concepts through interactive visualizations",
  },
};

export default function AIMLVisualizerPage() {
  return <SubjectPage subjectId="ai-ml" />;
}
