import type { MetadataRoute } from 'next';
import { searchIndex } from '@/config/content';

const baseUrl = 'https://allvisualizer.com';

const staticPages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/categories', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/support', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms-and-conditions', priority: 0.3, changeFrequency: 'yearly' },
];

/** Static pages plus every live subject, topic and visualizer from the content registry. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    ...staticPages.map(({ path, priority, changeFrequency }) => ({ url: `${baseUrl}${path}`, lastModified, changeFrequency, priority })),
    ...searchIndex.map((entry) => ({ url: `${baseUrl}${entry.href}`, lastModified, changeFrequency: 'weekly' as const, priority: 0.8 })),
  ];
}
