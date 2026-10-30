import type { Metadata } from 'next';
import { Callout, CardGrid, ContentSection, DetailPage, Prose, Tag, type CardGridItem } from '@/components/content';
import EnergyConservationVisualizer from './EnergyConservationVisualizer';

export const metadata: Metadata = {
  title: 'Energy Conservation Simulator - Physics Visualizer | AllVisualizer',
  description:
    'Interactive energy conservation simulation. Explore kinetic, potential, and spring energy transformations across multiple scenarios.',
  keywords: ['energy conservation', 'kinetic energy', 'potential energy', 'physics simulation', 'pendulum', 'spring energy'],
  openGraph: {
    title: 'Energy Conservation Simulator | AllVisualizer',
    description: 'Visualize energy transformations in pendulums, free fall, ramps, and springs',
    type: 'article',
  },
};

const topics = ['Kinetic Energy', 'Potential Energy', 'Spring Energy', 'Energy Transformation'];

const objectives = [
  'Understand the law of conservation of energy',
  'Observe energy transformations between kinetic and potential forms',
  'Calculate energy in different scenarios (pendulum, free fall, ramp, spring)',
  'Recognize how damping affects total mechanical energy',
  'Apply energy conservation to predict motion outcomes',
];

const scenarios: CardGridItem[] = [
  {
    title: 'Pendulum',
    description:
      'Watch energy oscillate between maximum potential (at the peaks) and maximum kinetic (at the bottom). A perfect demonstration of PE ↔ KE transformation.',
  },
  {
    title: 'Free fall',
    description:
      'Observe gravitational PE converting entirely to KE as the object falls. After bouncing, energy gradually dissipates.',
  },
  {
    title: 'Ramp',
    description:
      'See how PE converts to KE as the ball rolls down the incline. The angle affects acceleration but not the final energy.',
  },
  {
    title: 'Spring',
    description:
      'A three-way energy exchange: gravitational PE, kinetic energy, and elastic spring energy all interact.',
  },
];

const tips: CardGridItem[] = [
  {
    title: 'Watch the energy bars',
    description: 'The sum of all energy bars should stay constant (when damping = 100%).',
  },
  { title: 'Adjust mass', description: 'Heavier objects have more total energy for the same height or speed.' },
  {
    title: 'Change gravity',
    description: 'Try different gravitational strengths (Moon: 1.6 m/s², Earth: 9.8 m/s², Jupiter: 24.8 m/s²).',
  },
  { title: 'Damping effect', description: 'Set damping below 100% to see energy gradually lost to friction.' },
  {
    title: 'Compare scenarios',
    description: 'Notice how the same initial energy manifests differently in each scenario.',
  },
];

const applications: CardGridItem[] = [
  {
    title: 'Roller coasters',
    description: 'Designed using energy conservation: PE at the top converts to KE at the bottom, creating thrilling speeds.',
  },
  {
    title: 'Hydroelectric dams',
    description: "Water's gravitational PE is converted to electrical energy through turbines.",
  },
  {
    title: 'Pendulum clocks',
    description: 'Rely on consistent energy oscillation between PE and KE for accurate timekeeping.',
  },
  {
    title: 'Regenerative braking',
    description: 'Electric vehicles convert kinetic energy back to stored electrical energy when braking.',
  },
  {
    title: 'Bungee jumping',
    description: 'Gravitational PE converts to elastic PE in the cord, then back again.',
  },
  {
    title: 'Satellite orbits',
    description: 'Satellites constantly exchange KE and PE as they orbit Earth.',
  },
];

const equations = [
  { title: 'Total mechanical energy', formula: 'E = KE + PE (+ SE for springs)' },
  { title: 'Kinetic energy', formula: 'KE = ½mv², where m = mass, v = velocity' },
  { title: 'Gravitational potential energy', formula: 'PE = mgh, where g = gravity, h = height' },
  { title: 'Spring potential energy', formula: 'SE = ½kx², where k = spring constant, x = compression' },
];

export default function EnergyConservationPage() {
  return (
    <DetailPage
      subject="physics"
      item="energy-conservation"
      description="Discover how energy transforms between kinetic, potential, and spring forms while total energy remains constant."
      meta={topics.map((topic) => (
        <Tag key={topic}>{topic}</Tag>
      ))}
    >
      <EnergyConservationVisualizer />

      <ContentSection title="Learning objectives" variant="card">
        <Prose>
          <ul>
            {objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="Scenario guide">
        <CardGrid items={scenarios} />
      </ContentSection>

      <ContentSection title="Experimentation tips">
        <CardGrid items={tips} columns={3} />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} columns={3} />
      </ContentSection>

      <ContentSection title="Energy equations reference">
        <div className="grid gap-4 sm:grid-cols-2">
          {equations.map((eq) => (
            <Callout key={eq.title} tone="formula" title={eq.title}>
              <p className="font-mono">{eq.formula}</p>
            </Callout>
          ))}
        </div>
      </ContentSection>
    </DetailPage>
  );
}
