import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Matrix Operations - Linear Algebra | AllVisualizer",
  description: "Learn matrix operations with interactive visualizations. Master matrix addition, multiplication, scalar multiplication, and understand their properties with step-by-step examples.",
  keywords: ["matrix operations", "linear algebra", "matrix multiplication", "matrix addition", "scalar multiplication", "linear transformations"],
  openGraph: {
    title: "Matrix Operations - Interactive Linear Algebra | AllVisualizer",
    description: "Master matrix operations with interactive visualizations",
  },
};

export default function MatrixOperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
