import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Integration Basics - Calculus | AllVisualizer",
  description: "Learn integration through interactive visualizations. Master antiderivatives, the Fundamental Theorem of Calculus, and area under curves with step-by-step examples.",
  keywords: ["integration", "calculus", "antiderivatives", "definite integral", "fundamental theorem", "area under curve"],
  openGraph: {
    title: "Integration Basics - Interactive Calculus | AllVisualizer",
    description: "Master integration and antiderivatives with interactive visualizations",
  },
};

export default function IntegrationBasicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
