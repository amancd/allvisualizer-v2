import type { Metadata } from 'next';
import { DetailPage } from '@/components/content';
import UnitCircleVisualizer from './UnitCircleVisualizer';

export const metadata: Metadata = {
  title: 'Unit Circle Visualizer | Trigonometry | AllVisualizer',
  description: 'Interactive unit circle showing angles in degrees and radians, coordinates, and all six trigonometric functions in real-time.',
  keywords: ['unit circle', 'trigonometry', 'sine', 'cosine', 'tangent', 'radians', 'degrees'],
};

export default function UnitCirclePage() {
  return (
    <DetailPage
      subject="math"
      item="unit-circle"
      description="Explore the unit circle interactively. See how angles relate to coordinates and trigonometric functions in real-time."
    >
      <UnitCircleVisualizer />
    </DetailPage>
  );
}
