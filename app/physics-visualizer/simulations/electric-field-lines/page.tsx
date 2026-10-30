import type { Metadata } from 'next';
import { Callout, CardGrid, type CardGridItem, ContentSection, DetailPage, Formula, Prose } from '@/components/content';
import ElectricFieldLinesVisualizer from './ElectricFieldLinesVisualizer';

export const metadata: Metadata = {
  title: 'Electric Field Lines - Physics Visualizer | AllVisualizer',
  description:
    "Visualize electric fields from point charges. Interactive simulation with field lines, vectors, and Coulomb's law.",
  keywords: ['electric field', "Coulomb's law", 'point charges', 'field lines', 'electromagnetism', 'physics simulation'],
  openGraph: {
    title: 'Electric Field Lines Visualizer - Interactive Physics',
    description: 'Master electric fields through interactive visualization',
  },
};

const concepts: CardGridItem[] = [
  {
    title: 'Superposition principle',
    description:
      'The total electric field from multiple charges is the vector sum of the individual fields. Each charge contributes independently to the total field at any point.',
  },
  {
    title: 'Field direction',
    description: (
      <>
        The electric field points <strong>away</strong> from positive charges and <strong>toward</strong> negative
        charges. This is the direction of the force on a positive test charge.
      </>
    ),
  },
  {
    title: 'Inverse square law',
    description:
      'Electric field strength decreases with the square of distance. Doubling the distance reduces the field to 1/4 of its original strength.',
  },
  {
    title: 'Common configurations',
    description: (
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>Single charge:</strong> radial field lines (spherical symmetry)</li>
        <li><strong>Dipole:</strong> +/− charges create a characteristic curved pattern</li>
        <li><strong>Like charges:</strong> field lines repel from each other</li>
        <li><strong>Opposite charges:</strong> field lines connect the charges</li>
      </ul>
    ),
  },
];

const applications: CardGridItem[] = [
  { title: 'Capacitors', description: 'Energy storage devices using electric fields between charged plates.' },
  { title: 'Particle accelerators', description: 'Use strong electric fields to accelerate charged particles.' },
  { title: 'Lightning', description: "Natural discharge when the electric field exceeds air's breakdown limit." },
  {
    title: 'Electrostatic precipitators',
    description: 'Remove particles from air using electric fields in pollution control.',
  },
];

export default function ElectricFieldLinesPage() {
  return (
    <DetailPage
      subject="physics"
      item="electric-field-lines"
      description="Visualize electric fields created by point charges using field lines and vectors."
    >
      <ContentSection title="Electric field theory" variant="card">
        <Prose>
          <p>
            An <strong>electric field</strong> is a region around a charged particle where other charges experience a
            force. The field is represented by field lines that point in the direction a positive test charge would move.
          </p>

          <Callout tone="formula" title="Coulomb's law">
            <Formula
              where={[
                { symbol: 'E', meaning: 'electric field magnitude (N/C)' },
                { symbol: 'k', meaning: <>Coulomb&apos;s constant ≈ 8.99 × 10⁹ N⋅m²/C²</> },
                { symbol: 'q', meaning: 'source charge (C)' },
                { symbol: 'r', meaning: 'distance from the charge (m)' },
              ]}
            >
              E = k × q / r²
            </Formula>
          </Callout>

          <p><strong>Field line properties:</strong></p>
          <ul>
            <li>Field lines originate from positive charges and terminate at negative charges</li>
            <li>The density of lines indicates field strength</li>
            <li>Field lines never cross each other</li>
            <li>Lines are perpendicular to the surface of conductors</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="Interactive simulation">
        <ElectricFieldLinesVisualizer />
      </ContentSection>

      <ContentSection title="Key concepts">
        <CardGrid items={concepts} />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} />
      </ContentSection>
    </DetailPage>
  );
}
