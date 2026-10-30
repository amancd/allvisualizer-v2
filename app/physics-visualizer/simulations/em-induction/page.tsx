import type { Metadata } from 'next';
import { Callout, CardGrid, type CardGridItem, ContentSection, DetailPage, Formula, Prose } from '@/components/content';
import EMInductionVisualizer from './EMInductionVisualizer';

export const metadata: Metadata = {
  title: 'Electromagnetic Induction - Physics Visualizer | AllVisualizer',
  description:
    "Visualize Faraday's law and Lenz's law with moving magnets and coils. Interactive simulation showing induced EMF and current.",
  keywords: ['electromagnetic induction', "Faraday's law", "Lenz's law", 'induced EMF', 'magnetic flux', 'physics simulation'],
  openGraph: {
    title: 'Electromagnetic Induction Visualizer - Interactive Physics',
    description: 'Master electromagnetic induction through interactive visualization',
  },
};

const concepts: CardGridItem[] = [
  {
    title: "Lenz's law",
    description:
      "The direction of the induced current is such that it opposes the change that caused it. If a north pole approaches the coil, the induced current creates a north pole facing the magnet to repel it. This is nature's way of conserving energy.",
  },
  {
    title: 'Flux linkage',
    description:
      'Total flux linkage = N × Φ, where N is the number of turns. Each turn contributes to the total induced EMF, which is why transformers and generators use many coil turns to increase voltage.',
  },
  {
    title: 'Rate of change matters',
    description:
      "It's not the magnetic field strength that matters, but how fast it changes. A weak field changing rapidly can induce more EMF than a strong field changing slowly. This is why generators need to spin quickly.",
  },
  {
    title: 'Energy conservation',
    description:
      'When current is induced, you feel resistance when moving the magnet. The mechanical work you do moving the magnet converts to electrical energy. This is how generators work: mechanical motion becomes electricity.',
  },
];

const applications: CardGridItem[] = [
  {
    title: 'Electric generators',
    description:
      'Power plants use rotating magnets in coils to convert mechanical energy (from turbines) into electricity.',
  },
  {
    title: 'Transformers',
    description: 'Change AC voltage levels using mutual induction between two coils sharing magnetic flux.',
  },
  {
    title: 'Induction cooktops',
    description: 'Rapidly changing magnetic fields induce currents in metal pots, heating them directly.',
  },
  {
    title: 'Electric guitar pickups',
    description: 'Vibrating metal strings change the magnetic flux through coils, creating electrical signals.',
  },
  {
    title: 'Wireless charging',
    description: 'Alternating current in a transmitter coil induces current in a receiver coil to charge devices.',
  },
  {
    title: 'Metal detectors',
    description: 'Detect metal objects by measuring changes in induced currents caused by nearby conductors.',
  },
];

export default function EMInductionPage() {
  return (
    <DetailPage
      subject="physics"
      item="em-induction"
      description="Explore Faraday's law and Lenz's law by moving a magnet through a coil of wire."
    >
      <ContentSection title="Electromagnetic induction theory" variant="card">
        <Prose>
          <p>
            <strong>Electromagnetic induction</strong> is the production of an electromotive force (EMF) across a
            conductor when it is exposed to a changing magnetic field. This fundamental principle is the basis for
            generators, transformers, and many other electrical devices.
          </p>

          <Callout tone="formula" title="Faraday's law">
            <Formula
              where={[
                { symbol: 'EMF', meaning: 'induced electromotive force (V)' },
                { symbol: 'N', meaning: 'number of turns in the coil' },
                { symbol: 'Φ', meaning: 'magnetic flux through the coil (Wb)' },
                { symbol: 'dΦ/dt', meaning: 'rate of change of magnetic flux' },
              ]}
            >
              EMF = −N × dΦ/dt
            </Formula>
            <p className="mt-2">
              The negative sign represents <strong>Lenz&apos;s law</strong>: the induced current opposes the change in
              flux.
            </p>
          </Callout>

          <Callout tone="formula" title="Magnetic flux">
            <Formula
              where={[
                { symbol: 'B', meaning: 'magnetic field strength (T)' },
                { symbol: 'A', meaning: 'area of the coil (m²)' },
                { symbol: 'θ', meaning: 'angle between the field and the normal to the coil' },
              ]}
            >
              Φ = B × A × cos(θ)
            </Formula>
          </Callout>

          <p><strong>Key principles:</strong></p>
          <ul>
            <li>EMF is induced only when magnetic flux is <em>changing</em></li>
            <li>Faster motion creates larger induced EMF and current</li>
            <li>More coil turns multiply the induced EMF (N times larger)</li>
            <li>Induced current creates its own magnetic field opposing the change</li>
            <li>Moving the magnet toward the coil induces current in one direction</li>
            <li>Moving the magnet away induces current in the opposite direction</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="Interactive simulation">
        <EMInductionVisualizer />
      </ContentSection>

      <ContentSection title="Key concepts">
        <CardGrid items={concepts} />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} columns={3} />
      </ContentSection>
    </DetailPage>
  );
}
