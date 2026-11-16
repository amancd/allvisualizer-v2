import type { LucideIcon } from 'lucide-react';
import { Code2, Calculator, Atom, Brain, TestTube, BarChart3, BookOpen } from 'lucide-react';
import type { Accent } from '@/components/ui/accents';
import { countAvailable, getSubject } from '@/config/content';
import { totalPatterns } from '@/config/dsa-patterns';

export type CategoryStatus = 'Available' | 'New' | 'Preview' | 'Coming Soon';

export interface Category {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: Accent;
  status: CategoryStatus;
  topics: string[];
  count: number;
  countLabel: string;
}

export const categories: Category[] = [
  {
    id: 'dsa-patterns',
    title: 'DSA Patterns',
    shortDescription: `${totalPatterns} interview patterns with notes and ready-to-use code templates.`,
    description: 'Notes, theory, diagrams and ready-to-use Python code templates for every common coding interview pattern.',
    href: '/dsa-patterns',
    icon: BookOpen,
    accent: 'amber',
    status: 'New',
    topics: ['Two Pointers', 'Sliding Window', 'Binary Search', 'Trees', 'Graphs', 'Dynamic Programming'],
    count: totalPatterns,
    countLabel: 'patterns',
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    shortDescription: 'Watch sorting, searching, trees and graphs run step by step.',
    description: 'Master essential computer science concepts with interactive visualizations of sorting, searching, trees, graphs, and more.',
    href: '/dsa-visualizer',
    icon: Code2,
    accent: 'brand',
    status: 'Available',
    topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting', 'Searching', 'Dynamic Programming'],
    count: countAvailable(getSubject('dsa')),
    countLabel: 'visualized problems',
  },
  {
    id: 'math',
    title: 'Mathematics',
    shortDescription: 'Calculus, linear algebra, geometry, statistics and more you can play with.',
    description: 'Explore calculus, linear algebra, trigonometry, geometry, statistics and number theory through dynamic, interactive visual representations.',
    href: '/math-visualizer',
    icon: Calculator,
    accent: 'sky',
    status: 'Available',
    topics: ['Calculus', 'Linear Algebra', 'Trigonometry', 'Geometry', 'Statistics', 'Number Theory'],
    count: countAvailable(getSubject('math')),
    countLabel: 'visualizations',
  },
  {
    id: 'physics',
    title: 'Physics',
    shortDescription: 'Simulate mechanics, oscillations, waves, thermodynamics and modern physics.',
    description: 'Simulate and understand classical mechanics, oscillations, waves, optics, thermodynamics, and modern physics phenomena.',
    href: '/physics-visualizer',
    icon: Atom,
    accent: 'emerald',
    status: 'Available',
    topics: ['Mechanics', 'Oscillations', 'Waves & Optics', 'Thermodynamics', 'Electromagnetism', 'Modern Physics'],
    count: countAvailable(getSubject('physics')),
    countLabel: 'simulations',
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    shortDescription: 'See how neural networks, transformers, RL agents and classic ML really work.',
    description: 'Visualize neural networks, computer vision, deep learning, NLP, reinforcement learning and classical ML to understand how machines learn.',
    href: '/ai-ml-visualizer',
    icon: Brain,
    accent: 'violet',
    status: 'Available',
    topics: ['Neural Networks', 'Computer Vision', 'Deep Learning', 'NLP', 'Reinforcement Learning', 'Classical ML'],
    count: countAvailable(getSubject('ai-ml')),
    countLabel: 'visualizations',
  },
  {
    id: 'chemistry',
    title: 'Chemistry',
    shortDescription: 'Orbitals, bonding, stoichiometry, kinetics and equilibrium you can experiment with.',
    description: 'Explore atomic structure, chemical bonding, stoichiometry, reaction kinetics, equilibrium and acids through interactive visualizations.',
    href: '/chemistry-visualizer',
    icon: TestTube,
    accent: 'rose',
    status: 'New',
    topics: ['Atomic Structure', 'Bonding', 'Stoichiometry', 'Kinetics', 'Equilibrium', 'Acids & Bases'],
    count: countAvailable(getSubject('chemistry')),
    countLabel: 'visualizations',
  },
  {
    id: 'statistics',
    title: 'Statistics & Probability',
    shortDescription: 'Probability, distributions, descriptive statistics and hypothesis tests by simulation.',
    description: 'Understand probability, distributions, descriptive statistics, confidence intervals and hypothesis testing through interactive simulations.',
    href: '/statistics-visualizer',
    icon: BarChart3,
    accent: 'amber',
    status: 'New',
    topics: ['Probability', 'Bayes\' Theorem', 'Distributions', 'Box Plots', 'Confidence Intervals', 'Hypothesis Testing'],
    count: countAvailable(getSubject('statistics')),
    countLabel: 'visualizations',
  },
];
