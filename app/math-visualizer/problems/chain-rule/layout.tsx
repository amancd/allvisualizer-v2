import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chain Rule - Calculus | AllVisualizer",
  description: "Master the chain rule for composite functions. Learn to differentiate complex functions with interactive visualizations and step-by-step examples.",
  keywords: ["chain rule", "composite functions", "calculus", "derivatives", "differentiation"],
  openGraph: {
    title: "Chain Rule - Interactive Calculus | AllVisualizer",
    description: "Master composite function derivatives with the chain rule",
  },
};

export default function ChainRuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
