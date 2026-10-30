import type { Metadata } from 'next';
import { SubjectPage } from '@/components/content';

export const metadata: Metadata = {
  title: "Physics Visualizer - Interactive Physics Simulations | AllVisualizer",
  description: "Master physics concepts through interactive visualizations. Learn Classical Mechanics, Electromagnetism, Waves, Thermodynamics, and Modern Physics with step-by-step simulations.",
  keywords: ["physics visualizer", "physics simulator", "mechanics", "electromagnetism", "waves", "thermodynamics", "quantum physics", "interactive physics"],
  openGraph: {
    title: "Physics Visualizer - Interactive Learning | AllVisualizer",
    description: "Master physics concepts through interactive visualizations",
  },
};

export default function PhysicsVisualizerPage() {
  return <SubjectPage subjectId="physics" />;
}
