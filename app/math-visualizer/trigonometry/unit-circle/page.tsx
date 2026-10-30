import type { Metadata } from 'next';
import UnitCircleVisualizer from './UnitCircleVisualizer';

export const metadata: Metadata = {
  title: 'Unit Circle Visualizer | Trigonometry | AllVisualizer',
  description: 'Interactive unit circle showing angles in degrees and radians, coordinates, and all six trigonometric functions in real-time.',
  keywords: ['unit circle', 'trigonometry', 'sine', 'cosine', 'tangent', 'radians', 'degrees'],
};

export default function UnitCirclePage() {
  return <UnitCircleVisualizer />;
}
