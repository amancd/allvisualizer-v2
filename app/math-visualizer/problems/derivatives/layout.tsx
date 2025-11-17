import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Understanding Derivatives - Math Visualizer | AllVisualizer",
  description: "Learn derivatives through interactive visualizations. Master instantaneous rate of change, tangent lines, and differentiation with step-by-step examples.",
  keywords: ["derivatives", "calculus", "differentiation", "tangent line", "rate of change", "power rule"],
  openGraph: {
    title: "Understanding Derivatives - Interactive Learning | AllVisualizer",
    description: "Master derivatives with interactive visualizations and examples",
  },
};

export default function DerivativesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
