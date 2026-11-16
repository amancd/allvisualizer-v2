import type { Metadata } from 'next';
import { Compass, Flame, Thermometer, Zap } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import CollisionTheoryVisualizer from './CollisionTheoryVisualizer';

export const metadata: Metadata = {
  title: 'Collision Theory - Chemistry Visualizer | AllVisualizer',
  description:
    'Simulate A + B → C + D in a box of moving particles. Change temperature, concentration, activation energy and orientation, and compare the live reaction rate with the Maxwell-Boltzmann distribution.',
  keywords: ['collision theory', 'reaction rate', 'activation energy', 'Maxwell-Boltzmann distribution', 'steric factor', 'temperature', 'concentration', 'catalyst', 'chemistry'],
};

const requirements = [
  {
    title: 'They must collide',
    icon: Zap,
    description: 'Molecules can only react when they meet. More particles in the same volume means more collisions per second, so the rate rises with concentration.',
  },
  {
    title: 'With enough energy',
    icon: Flame,
    description: 'The collision must be violent enough to break the old bonds. Only the part of the kinetic energy along the line joining the two centres counts, and it must be at least Ea.',
  },
  {
    title: 'In the right orientation',
    icon: Compass,
    description: 'The reacting atoms have to meet. The steric factor p is the fraction of collisions that are lined up correctly; in the simulation it is 1/3.',
  },
  {
    title: 'Temperature matters most',
    icon: Thermometer,
    description: 'Heating speeds every molecule up a little, but it grows the high-energy tail of the distribution a lot. That tail is what decides the rate.',
  },
];

const factors = [
  { factor: 'Higher concentration', frequency: 'Up, ∝ [A][B]', fraction: 'Unchanged', rate: 'Up in proportion' },
  { factor: 'Higher temperature', frequency: 'Up a little, ∝ √T', fraction: 'Up sharply, e^(−Ea/RT)', rate: 'Up sharply' },
  { factor: 'Catalyst', frequency: 'Unchanged', fraction: 'Up (lower Ea)', rate: 'Up' },
  { factor: 'Larger surface area (solids)', frequency: 'Up', fraction: 'Unchanged', rate: 'Up' },
];

const boltzmannRows = [
  { T: '300', f: '1.97 × 10⁻⁹', ratio: '1' },
  { T: '310', f: '3.76 × 10⁻⁹', ratio: '1.91' },
  { T: '350', f: '3.45 × 10⁻⁸', ratio: '17.5' },
  { T: '400', f: '2.95 × 10⁻⁷', ratio: '150' },
  { T: '500', f: '5.98 × 10⁻⁶', ratio: '3040' },
];

export default function CollisionTheoryPage() {
  return (
    <DetailPage subject="chemistry" item="collision-theory">
      <CollisionTheoryVisualizer />

      <ContentSection title="Why reactions happen at the rate they do">
        <Prose>
          <p>
            <strong>Collision theory</strong> pictures a gas-phase reaction such as A + B → C + D as a crowd of molecules flying around and
            bumping into each other. Most collisions are just bounces: the molecules exchange energy and fly apart unchanged. Only a small
            share of collisions are both hard enough and correctly lined up to rearrange the bonds and make products.
          </p>
          <p>
            So the rate is the number of collisions per second multiplied by the fraction that succeed. The collision frequency grows with the
            concentration of each reactant, which is where rate laws like rate = k[A][B] come from. The successful fraction depends on the
            activation energy Ea and the temperature through the Boltzmann factor e^(−Ea/RT), and on the steric factor p.
          </p>
          <p>
            In the simulation each A–B collision is tested the same way: the relative kinetic energy along the line of centres is compared with
            Ea, and, if orientation is switched on, the dark reactive side of A must face B. The panel on the right counts how many collisions
            pass each test, so you can check the observed shares against the predictions.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={requirements} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Collision theory rate">
            <Formula
              where={[
                { symbol: 'Z_AB', meaning: 'A–B collisions per unit volume per second, proportional to [A][B]√T' },
                { symbol: 'p', meaning: 'steric (orientation) factor, between 0 and 1' },
                { symbol: 'Ea', meaning: 'activation energy (J/mol)' },
                { symbol: 'R', meaning: 'gas constant, 8.314 J/(mol·K)' },
              ]}
            >
              rate = Z_AB × p × e^(−Ea/RT)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Fraction of collisions with enough energy">
            <Formula where={[{ symbol: 'f', meaning: 'share of collisions whose line-of-centres energy is at least Ea' }]}>f = e^(−Ea/RT)</Formula>
          </Callout>
          <Callout tone="formula" title="Fraction of molecules with E ≥ Ea (Maxwell-Boltzmann, 3D)">
            <Formula where={[{ symbol: 'x', meaning: 'Ea / RT' }]}>F = erfc(√x) + 2√(x/π) e^(−x)&nbsp;&nbsp; (the shaded area in the distribution chart)</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="What changes the rate, and how">
        <DataTable
          columns={[
            { header: 'Change', cell: 'factor' },
            { header: 'Collision frequency', cell: 'frequency' },
            { header: 'Fraction with E ≥ Ea', cell: 'fraction' },
            { header: 'Rate', cell: 'rate' },
          ]}
          rows={factors}
        />
        <div className="mt-6">
          <DataTable
            caption="Boltzmann factor e^(−Ea/RT) for Ea = 50 kJ/mol"
            columns={[
              { header: 'T (K)', cell: 'T', numeric: true },
              { header: 'e^(−Ea/RT)', cell: 'f', numeric: true },
              { header: 'Relative to 300 K', cell: 'ratio', numeric: true },
            ]}
            rows={boltzmannRows}
          />
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Watch the box: blue A and orange B particles bounce around. A red ring marks every successful collision, which turns A into green C and B into purple D.',
            'Raise the temperature. The particles speed up, the shaded tail of the Maxwell-Boltzmann chart grows, and the reaction rate jumps.',
            'Change the number of A or B particles (this restarts the run). More particles give more collisions per second and a faster start.',
            'Raise Ea and watch the energetic share of collisions fall. Compare it with the predicted e^(−Ea/RT) in the side panel.',
            'Switch on the catalyst. Ea is halved, the red line moves left, and many more collisions succeed even though the collision count is unchanged.',
            'Switch on orientation. Now A has a reactive side, and only about a third of the energetic collisions succeed: the steric factor p = 1/3.',
            'Use the particles-vs-time chart to see the rate slow down as the reactants are used up.',
          ]}
        />
      </ContentSection>

      <Callout tone="note" title="How the simulation is simplified">
        The particles move in two dimensions, all have the same mass, and the walls are held at the chosen temperature, so the gas stays at T
        even when you change it. Products keep their velocities, so the reaction releases or absorbs no heat. Speeds are scaled to be visible,
        but every energy test uses the real ratio Ea/RT. The distribution chart shows the usual three-dimensional Maxwell-Boltzmann curve for a
        gas, as drawn in textbooks.
      </Callout>

      <Callout tone="warning" title="Common misconception">
        Heating does not speed reactions up mainly by making molecules collide more often. Collision frequency only grows as √T: from 300 K to
        310 K that is about 1.7% more collisions. For Ea = 50 kJ/mol the fraction of collisions with enough energy almost doubles over the
        same 10 K. Nearly all of the temperature effect comes from the energy tail.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: A 10 K rise"
            question="A gas-phase reaction has Ea = 50 kJ/mol. By what factor does the fraction of collisions with enough energy, e^(−Ea/RT), increase when the temperature rises from 300 K to 310 K? Including the change in collision frequency (∝ √T), by what factor does the rate increase?"
            solution={
              <>
                <p>ratio = e^(−Ea/R·310) / e^(−Ea/R·300) = exp[(Ea/R)(1/300 − 1/310)]</p>
                <p>Ea/R = 50 000 / 8.314 = 6014 K</p>
                <p>1/300 − 1/310 = 1.0753 × 10⁻⁴ K⁻¹</p>
                <p>exponent = 6014 × 1.0753 × 10⁻⁴ = 0.6467, so ratio = e^0.6467 ≈ 1.91</p>
                <p>collision frequency factor = √(310/300) = 1.017</p>
                <p className="font-semibold text-emerald-700">Energetic fraction × 1.91; rate × 1.91 × 1.017 ≈ 1.94</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Predict the simulation"
            question="Set the visualizer to T = 500 K and Ea = 10 kJ/mol with orientation switched on (p = 1/3). What share of A–B collisions should succeed? If the box has 120 A–B collisions per second, about how many reactions per second do you expect?"
            solution={
              <>
                <p>Ea/RT = 10 000 / (8.314 × 500) = 2.406</p>
                <p>e^(−2.406) = 0.0902, so 9.0% of collisions have enough energy</p>
                <p>success share = p × 0.0902 = 0.0902 / 3 = 0.0301</p>
                <p>reactions per second = 120 × 0.0301 ≈ 3.6</p>
                <p className="font-semibold text-emerald-700">About 3.0% of A–B collisions succeed, roughly 3.6 reactions per second</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related visualizations">
        <RelatedItems
          subject="chemistry"
          current="collision-theory"
          items={[
            { slug: 'rate-laws', note: 'Turn collision rates into rate laws and concentration-time graphs' },
            { slug: 'activation-energy', note: 'Energy profiles, the Arrhenius equation and catalysed pathways' },
            { slug: 'le-chateliers-principle', note: 'What happens when the reverse reaction can collide too' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
