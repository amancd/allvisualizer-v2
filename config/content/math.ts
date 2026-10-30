import { Sigma, Grid3x3, Triangle, Shapes, BarChart3, Binary } from 'lucide-react';
import type { Subject } from './types';

const problems = '/math-visualizer/problems';

export const math: Subject = {
  id: 'math',
  title: 'Mathematics',
  shortTitle: 'Math',
  href: '/math-visualizer',
  accent: 'sky',
  intro:
    'Master math concepts through interactive visualizations. See calculus, linear algebra, and trigonometry come to life with step-by-step animations.',
  itemNoun: 'visualizations',
  topics: [
    {
      slug: 'calculus',
      title: 'Calculus',
      icon: Sigma,
      summary: 'Visualize derivatives, integrals, and limits',
      intro:
        'Master the fundamentals of calculus through interactive visualizations. Learn derivatives, integrals, and limits with step-by-step animations.',
      itemBasePath: problems,
      highlights: ['Derivatives', 'Integrals', 'Limits', 'Series'],
      concepts: [
        { title: 'Derivatives', description: 'Measure instantaneous rate of change and find slopes of tangent lines' },
        { title: 'Integrals', description: 'Calculate area under curves and solve accumulation problems' },
        { title: 'Limits', description: 'Understand function behavior as inputs approach specific values' },
        { title: 'Applications', description: 'Apply calculus to optimization, physics, and real-world problems' },
      ],
      items: [
        { slug: 'derivatives', title: 'Understanding Derivatives', description: 'Visualize tangent lines and the idea of instantaneous rate of change', difficulty: 'Beginner', tags: ['Differentiation', 'Tangent Lines', 'Rate of Change'] },
        { slug: 'chain-rule', title: 'Chain Rule', description: 'Master derivatives of composite functions', difficulty: 'Intermediate', tags: ['Composite Functions', 'Differentiation Rules'] },
        { slug: 'integration-basics', title: 'Integration Basics', description: 'Learn about antiderivatives and the area under curves', difficulty: 'Beginner', tags: ['Antiderivatives', 'Area Under Curve', 'Fundamental Theorem'] },
        { slug: 'optimization', title: 'Optimization Problems', description: 'Find maxima and minima using derivatives', difficulty: 'Intermediate', tags: ['Critical Points', 'Max/Min', 'Applications'] },
      ],
    },
    {
      slug: 'linear-algebra',
      title: 'Linear Algebra',
      icon: Grid3x3,
      summary: 'Understand matrices, vectors, and transformations',
      intro:
        'Master matrices, vectors, and linear transformations through interactive visualizations. Essential for computer graphics, machine learning, and scientific computing.',
      itemBasePath: problems,
      highlights: ['Matrix Operations', 'Vectors', 'Eigenvalues', 'Transformations'],
      concepts: [
        { title: 'Matrices', description: 'Rectangular arrays of numbers representing linear transformations' },
        { title: 'Vectors', description: 'Quantities with magnitude and direction in n-dimensional space' },
        { title: 'Eigenvalues', description: 'Special scalars that characterize matrix transformations' },
        { title: 'Transformations', description: 'Linear mappings that rotate, scale, and shear space' },
      ],
      items: [
        { slug: 'matrix-operations', title: 'Matrix Operations', description: 'Learn matrix addition, multiplication, and scalar operations', difficulty: 'Beginner', tags: ['Addition', 'Multiplication', 'Scalar Operations'] },
        { slug: 'determinants', title: 'Determinants', description: 'Calculate and understand matrix determinants', difficulty: 'Intermediate', tags: ['2×2 Determinant', '3×3 Determinant', 'Properties'] },
        { slug: 'matrix-inverse', title: 'Matrix Inverse', description: 'Find inverse matrices and solve linear systems', difficulty: 'Intermediate', tags: ['Inverse', 'Gauss-Jordan', 'Applications'], status: 'coming-soon' },
        { slug: 'vector-operations', title: 'Vector Operations', description: 'Explore dot product, cross product, and vector magnitude', difficulty: 'Beginner', tags: ['Dot Product', 'Cross Product', 'Magnitude'], status: 'coming-soon' },
      ],
    },
    {
      slug: 'trigonometry',
      title: 'Trigonometry',
      icon: Triangle,
      summary: 'Explore angles, circles, and wave functions',
      intro:
        'Master trigonometric concepts through interactive visualizations. Explore the unit circle, wave functions, and fundamental identities.',
      itemBasePath: '/math-visualizer/trigonometry',
      highlights: ['Unit Circle', 'Trigonometric Functions', 'Identities', 'Waves'],
      concepts: [
        { title: 'The Unit Circle', description: 'Every angle corresponds to a point (cos θ, sin θ) on a circle of radius 1, the geometric foundation for all trig functions.' },
        { title: 'Six Trigonometric Functions', description: 'Sine, cosine, tangent, cosecant, secant, and cotangent are ratios in a right triangle or coordinates on the unit circle.' },
        { title: 'Periodic Nature', description: 'Sin and cos repeat every 2π and tan every π, which makes them ideal for modelling waves and cycles.' },
        { title: 'Fundamental Identities', description: 'Equations like sin²θ + cos²θ = 1 hold for all angles and are essential for simplifying expressions.' },
      ],
      items: [
        { slug: 'unit-circle', title: 'Unit Circle Explorer', description: 'Interactive unit circle showing angles, coordinates, and all six trig functions', difficulty: 'Beginner', tags: ['Unit Circle', 'Angles', 'Coordinates', 'Special Angles'] },
        { slug: 'trig-functions', title: 'Trigonometric Functions', description: 'Visualize sin, cos, tan and their graphs with interactive controls', difficulty: 'Beginner', tags: ['Sine', 'Cosine', 'Tangent', 'Amplitude', 'Period', 'Phase Shift'] },
        { slug: 'identities', title: 'Trigonometric Identities', description: 'Prove and visualize fundamental trig identities geometrically', difficulty: 'Intermediate', tags: ['Pythagorean Identity', 'Sum/Difference', 'Double Angle', 'Half Angle'], status: 'coming-soon' },
        { slug: 'waves', title: 'Wave Functions', description: 'Explore sine and cosine waves, harmonics, and interference', difficulty: 'Intermediate', tags: ['Sine Waves', 'Harmonics', 'Interference', 'Fourier Series'], status: 'coming-soon' },
      ],
      discussion: true,
    },
    { slug: 'geometry', title: 'Geometry', icon: Shapes, summary: 'Visualize shapes, transformations, and proofs', intro: 'Visualize shapes, transformations, and proofs.', itemBasePath: problems, highlights: ['Euclidean Geometry', 'Transformations', 'Proofs', 'Coordinate Geometry'], items: [], status: 'coming-soon' },
    { slug: 'statistics', title: 'Statistics', icon: BarChart3, summary: 'Learn probability distributions and data analysis', intro: 'Learn probability distributions and data analysis.', itemBasePath: problems, highlights: ['Distributions', 'Hypothesis Testing', 'Regression', 'Probability'], items: [], status: 'coming-soon' },
    { slug: 'number-theory', title: 'Number Theory', icon: Binary, summary: 'Explore prime numbers and mathematical patterns', intro: 'Explore prime numbers and mathematical patterns.', itemBasePath: problems, highlights: ['Prime Numbers', 'GCD/LCM', 'Modular Arithmetic', 'Sequences'], items: [], status: 'coming-soon' },
  ],
};
