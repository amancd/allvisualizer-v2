import type { Metadata } from 'next';
import { Callout, CardGrid, ContentSection, DetailPage, PracticeProblem, StepList } from '@/components/content';
import NewtonsLawsVisualizer from './NewtonsLawsVisualizer';

export const metadata: Metadata = {
  title: "Newton's Laws - Physics Visualizer | AllVisualizer",
  description:
    "Interactive visualization of Newton's three laws of motion. Explore force, mass, acceleration, friction, and the fundamental principles of classical mechanics.",
  keywords: ["Newton's laws", 'F=ma', 'force', 'mass', 'acceleration', 'friction', 'classical mechanics', 'physics simulation'],
};

const laws = [
  {
    title: 'First Law: Inertia',
    description:
      'An object at rest stays at rest, and an object in motion keeps moving at constant velocity, unless a net external force acts on it.',
    example: 'A book on a table stays put until you push it. A hockey puck on ice keeps sliding until friction stops it.',
  },
  {
    title: 'Second Law: F = ma',
    description:
      'Acceleration is directly proportional to the net force on an object and inversely proportional to its mass.',
    example:
      'Push a shopping cart harder and it accelerates faster. A heavier cart accelerates less for the same push.',
  },
  {
    title: 'Third Law: Action and reaction',
    description: 'For every action there is an equal and opposite reaction. Forces always come in pairs.',
    example:
      'When you jump you push down on the ground and the ground pushes you up. A rocket pushes gas down and the gas pushes the rocket up.',
  },
];

const applications = [
  { icon: '🚗', title: 'Vehicle safety', description: 'Seatbelts and airbags rely on the first law: your body keeps moving when the car stops suddenly.' },
  { icon: '🚀', title: 'Rocket propulsion', description: 'Expelling gas backward creates a reaction force that pushes the rocket forward (third law).' },
  { icon: '⚽', title: 'Sports', description: 'How hard you kick a ball sets how fast it accelerates (second law).' },
  { icon: '🛹', title: 'Friction control', description: 'Ice skates reduce friction for gliding; brakes increase it for stopping.' },
];

export default function NewtonsLawsPage() {
  return (
    <DetailPage
      subject="physics"
      item="newtons-laws"
      icon="⚖️"
      title="Newton's Laws of Motion"
      description="Explore the laws that govern motion and forces. See how force, mass, and acceleration interact."
    >
      <NewtonsLawsVisualizer />

      <ContentSection title="Understanding Newton's laws">
        <div className="space-y-4">
          {laws.map((law) => (
            <div key={law.title} className="rounded-card border border-line bg-white p-5 shadow-card">
              <h3 className="text-lg font-semibold text-ink">{law.title}</h3>
              <p className="mt-2 text-gray-700">{law.description}</p>
              <Callout tone="example" title="Example" className="mt-4">
                {law.example}
              </Callout>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Adjust the mass of the object to see how it affects acceleration (second law).',
            'Change the applied force to observe different accelerations.',
            'Modify the friction coefficient to see how resistance affects motion.',
            'Watch the force arrows: applied force, friction, weight, and normal force.',
            <>
              Net force determines acceleration: F<sub>net</sub> = F<sub>applied</sub> − f<sub>friction</sub>.
            </>,
          ]}
        />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Calculate acceleration"
            question="A 5 kg box is pushed with a force of 20 N on a frictionless surface. What is its acceleration?"
            solution={
              <>
                <p>Using F = ma:</p>
                <p>20 N = 5 kg × a</p>
                <p>a = 20 N / 5 kg</p>
                <p className="font-semibold text-emerald-700">a = 4 m/s²</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Net force with friction"
            question="A 10 kg object is pushed with 50 N. Friction is 20 N. What are the net force and acceleration?"
            solution={
              <>
                <p>F<sub>net</sub> = 50 N − 20 N = 30 N</p>
                <p>30 N = 10 kg × a</p>
                <p className="font-semibold text-emerald-700">a = 3 m/s²</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
