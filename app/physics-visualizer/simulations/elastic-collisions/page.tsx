import type { Metadata } from 'next';
import { CardGrid, ContentSection, DetailPage, Prose, Tag, type CardGridItem } from '@/components/content';
import ElasticCollisionsVisualizer from './ElasticCollisionsVisualizer';

export const metadata: Metadata = {
  title: 'Elastic Collisions Simulator - Physics Visualizer | AllVisualizer',
  description:
    'Interactive elastic collision simulation. Explore momentum and energy conservation with customizable masses and velocities.',
  keywords: ['elastic collision', 'momentum conservation', 'energy conservation', 'physics simulation', 'collision physics'],
  openGraph: {
    title: 'Elastic Collisions Simulator | AllVisualizer',
    description: 'Visualize momentum and energy conservation in elastic collisions',
    type: 'article',
  },
};

const topics = ['Momentum Conservation', 'Energy Conservation', '1D Collisions', 'Physics Simulation'];

const objectives = [
  'Understand conservation of momentum in isolated systems',
  'Observe conservation of kinetic energy in elastic collisions',
  'Analyze how mass ratios affect collision outcomes',
  'Apply collision formulas to predict final velocities',
  'Explore special cases: equal masses, stationary targets',
];

const tips: CardGridItem[] = [
  { title: 'Equal masses', description: 'Set both masses to the same value and observe velocity exchange.' },
  { title: 'Heavy vs light', description: 'Try m₁ = 5 kg, m₂ = 0.5 kg to see dramatic effects.' },
  { title: 'Head-on collision', description: 'Set opposite velocities for the classic collision scenario.' },
  { title: 'Add gravity', description: 'Enable gravity to see parabolic trajectories after the collision.' },
  { title: 'Watch conservation', description: 'Monitor total momentum and KE: they should stay constant!' },
];

const applications: CardGridItem[] = [
  {
    title: 'Billiards and pool',
    description: 'Ball collisions approximate elastic collisions, allowing players to predict ball trajectories.',
  },
  {
    title: 'Particle physics',
    description: 'Collision experiments in particle accelerators use these principles to study subatomic particles.',
  },
  {
    title: 'Molecular dynamics',
    description: 'Gas molecules collide elastically, helping explain temperature and pressure in thermodynamics.',
  },
  {
    title: 'Vehicle safety',
    description: 'Understanding collision physics helps design safer cars and predict crash outcomes.',
  },
];

export default function ElasticCollisionsPage() {
  return (
    <DetailPage
      subject="physics"
      item="elastic-collisions"
      description="Explore the fundamental principles of momentum and energy conservation through interactive collision simulations."
      meta={topics.map((topic) => (
        <Tag key={topic}>{topic}</Tag>
      ))}
    >
      <ElasticCollisionsVisualizer />

      <ContentSection title="Learning objectives" variant="card">
        <Prose>
          <ul>
            {objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="Experimentation tips">
        <CardGrid items={tips} columns={3} />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} />
      </ContentSection>
    </DetailPage>
  );
}
