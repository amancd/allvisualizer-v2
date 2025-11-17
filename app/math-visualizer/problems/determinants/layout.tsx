import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Determinants - Linear Algebra | AllVisualizer",
  description: "Learn to calculate and interpret determinants for 2×2 and 3×3 matrices. Understand invertibility, volume scaling, and geometric meaning with interactive visualizations.",
  keywords: ["determinants", "linear algebra", "matrix determinant", "cofactor expansion", "invertibility", "2x2 determinant", "3x3 determinant"],
  openGraph: {
    title: "Determinants - Interactive Linear Algebra | AllVisualizer",
    description: "Master determinant calculations with step-by-step visualizations",
  },
};

export default function DeterminantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
