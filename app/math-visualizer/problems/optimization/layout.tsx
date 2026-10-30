import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Optimization Problems - Calculus | AllVisualizer",
  description: "Master optimization using derivatives. Learn to find maximum and minimum values, critical points, and solve real-world optimization problems with interactive visualizations.",
  keywords: ["optimization", "calculus", "maximum", "minimum", "critical points", "second derivative test", "applied calculus"],
  openGraph: {
    title: "Optimization Problems - Interactive Calculus | AllVisualizer",
    description: "Master optimization with derivatives and critical points",
  },
};

export default function OptimizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
