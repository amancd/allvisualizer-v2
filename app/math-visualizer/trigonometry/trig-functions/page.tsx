import type { Metadata } from 'next';
import TrigFunctionsVisualizer from './TrigFunctionsVisualizer';

export const metadata: Metadata = {
  title: 'Trigonometric Functions Visualizer | Trigonometry | AllVisualizer',
  description: 'Interactive graphs of sine, cosine, and tangent functions. Adjust amplitude, period, phase shift, and vertical shift in real-time.',
  keywords: ['trigonometric functions', 'sine wave', 'cosine wave', 'tangent', 'amplitude', 'period', 'phase shift', 'frequency'],
};

export default function TrigFunctionsPage() {
  return <TrigFunctionsVisualizer />;
}
