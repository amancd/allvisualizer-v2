import type { Metadata } from 'next';
import { Callout, CardGrid, type CardGridItem, ContentSection, DataTable, DetailPage, Prose } from '@/components/content';
import StandingWavesVisualizer from './StandingWavesVisualizer';

export const metadata: Metadata = {
  title: 'Standing Waves - Waves & Optics | AllVisualizer',
  description:
    'Visualize standing wave patterns in strings and pipes. Learn about nodes, antinodes, harmonics, and resonance through interactive simulations.',
  keywords: ['standing waves', 'harmonics', 'nodes', 'antinodes', 'resonance', 'wave physics', 'vibrations'],
};

const nodesAndAntinodes: CardGridItem[] = [
  {
    title: 'Nodes',
    description: (
      <>
        <p>
          Points of zero displacement where destructive interference always occurs. The medium remains stationary at
          these points.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Always at fixed boundaries</li>
          <li>Number of nodes = n + 1 for nth harmonic</li>
          <li>Separated by λ/2</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Antinodes',
    description: (
      <>
        <p>
          Points of maximum displacement where constructive interference occurs. The medium oscillates with maximum
          amplitude.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Located between nodes</li>
          <li>Number of antinodes = n for nth harmonic</li>
          <li>Separated by λ/2</li>
        </ul>
      </>
    ),
  },
];

const harmonics = [
  { name: '1st (Fundamental)', nodes: '2', antinodes: '1', wavelength: '2L', frequency: 'f₁' },
  { name: '2nd', nodes: '3', antinodes: '2', wavelength: 'L', frequency: '2f₁' },
  { name: '3rd', nodes: '4', antinodes: '3', wavelength: '2L/3', frequency: '3f₁' },
  { name: 'nth', nodes: 'n+1', antinodes: 'n', wavelength: '2L/n', frequency: 'nf₁' },
];

const applications: CardGridItem[] = [
  { title: 'Musical instruments', description: 'Guitar strings, violin, piano: all use standing waves to produce sound.' },
  { title: 'Wind instruments', description: 'Flutes, organs and trumpets use standing waves in air columns.' },
  { title: 'Microwave ovens', description: 'Standing electromagnetic waves heat food.' },
  { title: 'Laser cavities', description: 'Standing light waves form between mirrors.' },
  { title: 'Radio antennas', description: 'Designed to resonate at specific frequencies.' },
  { title: 'Earthquake engineering', description: 'Buildings can experience standing wave patterns during seismic events.' },
  { title: 'Acoustic treatment', description: 'Understanding nodes helps in soundproofing and studio design.' },
];

export default function StandingWavesPage() {
  return (
    <DetailPage
      subject="physics"
      item="standing-waves"
      description="Explore standing wave patterns, nodes, antinodes, and harmonics in vibrating strings and air columns."
    >
      <StandingWavesVisualizer />

      <ContentSection title="How standing waves form">
        <Callout tone="formula" title="Key formulas">
          <p className="mb-3">
            Standing waves form when two waves of the same frequency and amplitude traveling in opposite directions
            interfere with each other, creating stationary patterns of nodes and antinodes.
          </p>
          <div className="space-y-1 font-mono">
            <p><strong>String (both ends fixed):</strong> L = n(λ/2), n = 1, 2, 3, ...</p>
            <p><strong>Frequency:</strong> f<sub>n</sub> = nv / (2L)</p>
            <p><strong>Wavelength:</strong> λ<sub>n</sub> = 2L / n</p>
            <p><strong>Wave speed:</strong> v = √(T/μ) for strings</p>
          </div>
        </Callout>
      </ContentSection>

      <ContentSection title="Nodes and antinodes">
        <CardGrid items={nodesAndAntinodes} />
      </ContentSection>

      <ContentSection
        title="Harmonics"
        description="Harmonics are the natural frequencies at which a system can vibrate. Each harmonic corresponds to a specific standing wave pattern."
      >
        <DataTable
          rows={harmonics}
          columns={[
            { header: 'Harmonic', cell: 'name' },
            { header: 'Nodes', cell: 'nodes' },
            { header: 'Antinodes', cell: 'antinodes' },
            { header: 'Wavelength', cell: 'wavelength' },
            { header: 'Frequency', cell: 'frequency' },
          ]}
        />
      </ContentSection>

      <ContentSection title="Boundary conditions">
        <Prose>
          <ul>
            <li><strong>String (both ends fixed):</strong> nodes at both ends, supports all harmonics</li>
            <li><strong>Pipe (both ends open):</strong> antinodes at both ends, supports all harmonics</li>
            <li><strong>Pipe (one end closed):</strong> node at closed end, antinode at open end, only odd harmonics</li>
            <li><strong>Free end:</strong> an antinode forms at free boundaries</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="Resonance">
        <Prose>
          <p>
            Resonance occurs when a system is driven at one of its natural frequencies (harmonics). This causes a
            dramatic increase in amplitude as energy efficiently transfers to the system.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} columns={3} />
      </ContentSection>
    </DetailPage>
  );
}
