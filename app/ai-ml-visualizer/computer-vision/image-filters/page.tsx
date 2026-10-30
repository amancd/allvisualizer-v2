import type { Metadata } from 'next';
import { DetailPage } from '@/components/content';
import ImageFiltersVisualizer from './ImageFiltersVisualizer';

export const metadata: Metadata = {
  title: 'Image Filters Visualizer | Computer Vision | AllVisualizer',
  description: 'Learn how convolution filters work in computer vision. Apply blur, sharpen, edge detection, and custom kernels in real-time.',
  keywords: ['image filters', 'convolution', 'gaussian blur', 'sharpen', 'edge detection', 'kernel', 'computer vision'],
};

export default function ImageFiltersPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="image-filters"
      title="Image Filters & Convolution"
      description="Explore how convolution kernels transform images. Apply different filters and see the mathematical operations in action."
    >
      <ImageFiltersVisualizer />
    </DetailPage>
  );
}
