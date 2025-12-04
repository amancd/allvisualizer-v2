import type { Metadata } from 'next';
import ImageFiltersVisualizer from './ImageFiltersVisualizer';

export const metadata: Metadata = {
  title: 'Image Filters Visualizer | Computer Vision | AllVisualizer',
  description: 'Learn how convolution filters work in computer vision. Apply blur, sharpen, edge detection, and custom kernels in real-time.',
  keywords: ['image filters', 'convolution', 'gaussian blur', 'sharpen', 'edge detection', 'kernel', 'computer vision'],
};

export default function ImageFiltersPage() {
  return <ImageFiltersVisualizer />;
}
