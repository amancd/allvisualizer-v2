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
        { slug: 'matrix-inverse', title: 'Matrix Inverse', description: 'Find inverse matrices and solve linear systems', difficulty: 'Intermediate', tags: ['Inverse', 'Gauss-Jordan', 'Applications'] },
        { slug: 'vector-operations', title: 'Vector Operations', description: 'Explore dot product, cross product, and vector magnitude', difficulty: 'Beginner', tags: ['Dot Product', 'Cross Product', 'Magnitude'] },
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
        { slug: 'identities', title: 'Trigonometric Identities', description: 'Prove and visualize fundamental trig identities geometrically', difficulty: 'Intermediate', tags: ['Pythagorean Identity', 'Sum/Difference', 'Double Angle', 'Half Angle'] },
        { slug: 'waves', title: 'Wave Functions', description: 'Explore sine and cosine waves, harmonics, and interference', difficulty: 'Intermediate', tags: ['Sine Waves', 'Harmonics', 'Interference', 'Fourier Series'] },
      ],
      discussion: true,
    },
    {
      slug: 'geometry',
      title: 'Geometry',
      icon: Shapes,
      summary: 'Visualize shapes, transformations, and proofs',
      intro:
        'See classic geometry come alive. Drag points to test theorems, watch proofs rearrange themselves, and apply transformations to shapes on the coordinate plane.',
      itemBasePath: problems,
      highlights: ['Pythagorean Theorem', 'Transformations', 'Triangle Centers', 'Coordinate Geometry'],
      concepts: [
        { title: 'Euclidean Geometry', description: 'Points, lines, angles and shapes, and the relationships that always hold between them' },
        { title: 'Proofs', description: 'Show why a statement is true for every case, often by rearranging areas or using congruence' },
        { title: 'Transformations', description: 'Translations, rotations, reflections and dilations that move or resize figures' },
        { title: 'Coordinate Geometry', description: 'Describe shapes with coordinates so geometry can be done with algebra' },
      ],
      items: [
        { slug: 'pythagorean-theorem', title: 'Pythagorean Theorem', description: 'Watch a² + b² = c² proved visually with squares on the sides of a right triangle', difficulty: 'Beginner', tags: ['Right Triangles', 'Visual Proof', 'Distance Formula'] },
        { slug: 'geometric-transformations', title: 'Geometric Transformations', description: 'Translate, rotate, reflect and dilate shapes on the coordinate plane', difficulty: 'Beginner', tags: ['Translation', 'Rotation', 'Reflection', 'Dilation'] },
        { slug: 'triangle-centers', title: 'Triangle Centers', description: 'Drag the vertices of a triangle to explore its centroid, circumcenter, incenter and orthocenter', difficulty: 'Intermediate', tags: ['Centroid', 'Circumcenter', 'Incenter', 'Euler Line'] },
      ],
    },
    {
      slug: 'statistics',
      title: 'Statistics',
      icon: BarChart3,
      summary: 'Learn probability distributions and data analysis',
      intro:
        'Build intuition for randomness and data. Shape distributions, watch sample means converge, and fit lines to scattered points.',
      itemBasePath: problems,
      highlights: ['Distributions', 'Sampling', 'Regression', 'Probability'],
      concepts: [
        { title: 'Distributions', description: 'Describe how likely each value of a random quantity is' },
        { title: 'Center and Spread', description: 'Mean, median and standard deviation summarize where data sits and how much it varies' },
        { title: 'Sampling', description: 'Averages of random samples behave predictably even when the population does not' },
        { title: 'Regression', description: 'Model the relationship between variables with a best-fit line' },
      ],
      items: [
        { slug: 'normal-distribution', title: 'Normal Distribution', description: 'Adjust the mean and standard deviation of the bell curve and measure the area under it', difficulty: 'Beginner', tags: ['Bell Curve', 'Standard Deviation', 'Z-Scores', '68-95-99.7 Rule'] },
        { slug: 'central-limit-theorem', title: 'Central Limit Theorem', description: 'Draw repeated samples and watch the distribution of sample means become normal', difficulty: 'Intermediate', tags: ['Sampling', 'Sample Mean', 'Standard Error'] },
        { slug: 'linear-regression', title: 'Linear Regression', description: 'Place points and see the least-squares line, residuals and R² update live', difficulty: 'Intermediate', tags: ['Least Squares', 'Residuals', 'Correlation', 'R²'] },
      ],
    },
    {
      slug: 'number-theory',
      title: 'Number Theory',
      icon: Binary,
      summary: 'Explore prime numbers and mathematical patterns',
      intro:
        'Explore the properties of whole numbers. Sieve out the primes, step through the Euclidean algorithm, and see modular arithmetic as a clock.',
      itemBasePath: problems,
      highlights: ['Prime Numbers', 'GCD/LCM', 'Modular Arithmetic', 'Divisibility'],
      concepts: [
        { title: 'Primes', description: 'Numbers greater than 1 whose only divisors are 1 and themselves, the building blocks of every integer' },
        { title: 'Divisibility', description: 'When one integer divides another exactly, and how to find common divisors' },
        { title: 'Modular Arithmetic', description: 'Arithmetic that wraps around after reaching a modulus, like the hours on a clock' },
        { title: 'Applications', description: 'Cryptography, hashing and checksums all rely on number theory' },
      ],
      items: [
        { slug: 'sieve-of-eratosthenes', title: 'Sieve of Eratosthenes', description: 'Find every prime up to n by crossing out multiples step by step', difficulty: 'Beginner', tags: ['Primes', 'Multiples', 'Sieve'] },
        { slug: 'euclidean-algorithm', title: 'Euclidean Algorithm', description: 'Compute the GCD with repeated division, shown as tiling a rectangle with squares', difficulty: 'Beginner', tags: ['GCD', 'LCM', 'Division Algorithm'] },
        { slug: 'modular-arithmetic', title: 'Modular Arithmetic', description: 'Visualize addition and multiplication mod n on a clock and as times-table patterns', difficulty: 'Intermediate', tags: ['Congruence', 'Remainders', 'Clock Arithmetic'] },
      ],
    },
  ],
};
