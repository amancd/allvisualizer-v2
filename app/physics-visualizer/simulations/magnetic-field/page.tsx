import type { Metadata } from 'next';
import { Callout, CardGrid, type CardGridItem, ContentSection, DetailPage, Formula, Prose } from '@/components/content';
import MagneticFieldVisualizer from './MagneticFieldVisualizer';

export const metadata: Metadata = {
  title: 'Magnetic Field Visualization - Physics Visualizer | AllVisualizer',
  description:
    'Visualize magnetic fields from current-carrying wires, loops, and magnetic dipoles. Interactive simulation with field lines and vectors.',
  keywords: ['magnetic field', 'Biot-Savart law', 'current loops', 'magnetic dipole', 'electromagnetism', 'physics simulation'],
  openGraph: {
    title: 'Magnetic Field Visualizer - Interactive Physics',
    description: 'Master magnetic fields through interactive visualization',
  },
};

const concepts: CardGridItem[] = [
  {
    title: 'Right-hand rule',
    description:
      'Point your right thumb in the direction of current flow. Your fingers curl in the direction of the magnetic field lines around the wire.',
  },
  {
    title: 'Current loop',
    description:
      'A circular loop of current creates a magnetic dipole similar to a bar magnet. Field lines emerge from one face (North) and enter the other (South).',
  },
  {
    title: 'Magnetic dipole',
    description:
      'A bar magnet or current loop creates a dipole field pattern. Field lines emerge from the North pole and return to the South pole, forming closed loops.',
  },
  {
    title: 'Field configurations',
    description: (
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>Straight wire:</strong> concentric circular field lines</li>
        <li><strong>Current loop:</strong> dipole pattern similar to a bar magnet</li>
        <li><strong>Solenoid:</strong> uniform field inside, dipole field outside</li>
        <li><strong>Bar magnet:</strong> classic dipole with N and S poles</li>
      </ul>
    ),
  },
];

const applications: CardGridItem[] = [
  {
    title: 'Electromagnets',
    description:
      'Current-carrying coils create controllable magnetic fields for motors, generators, and MRI machines.',
  },
  {
    title: 'Electric motors',
    description: 'Magnetic fields from coils interact with permanent magnets to create rotational motion.',
  },
  {
    title: 'Magnetic levitation',
    description: 'Repulsive magnetic forces enable high-speed maglev trains and frictionless bearings.',
  },
  {
    title: 'Data storage',
    description: 'Magnetic domains in hard drives store digital information using tiny magnetic fields.',
  },
];

export default function MagneticFieldPage() {
  return (
    <DetailPage
      subject="physics"
      item="magnetic-field"
      description="Visualize magnetic fields created by current-carrying wires, loops, and magnetic dipoles."
    >
      <ContentSection title="Magnetic field theory" variant="card">
        <Prose>
          <p>
            A <strong>magnetic field</strong> is created by moving electric charges (currents) or magnetic materials.
            Unlike electric fields, magnetic field lines form closed loops and have no isolated poles.
          </p>

          <Callout tone="formula" title="Biot-Savart law (current element)">
            <Formula
              where={[
                { symbol: 'dB', meaning: 'magnetic field element (T)' },
                { symbol: 'μ₀', meaning: 'permeability of free space ≈ 4π × 10⁻⁷ T⋅m/A' },
                { symbol: 'I', meaning: 'current (A)' },
                { symbol: 'dl', meaning: 'length element of wire (m)' },
                { symbol: 'r', meaning: 'distance from the element (m)' },
              ]}
            >
              dB = (μ₀/4π) × (I dl × r̂) / r²
            </Formula>
          </Callout>

          <Callout tone="formula" title="Straight wire">
            <Formula>B = (μ₀ I) / (2π r)</Formula>
            <p className="mt-2">Circular field lines around the wire (right-hand rule).</p>
          </Callout>

          <p><strong>Magnetic field properties:</strong></p>
          <ul>
            <li>Magnetic field lines form closed loops (no magnetic monopoles)</li>
            <li>Field direction follows the right-hand rule for currents</li>
            <li>North and South poles always come in pairs</li>
            <li>Field lines are denser where the field is stronger</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="Interactive simulation">
        <MagneticFieldVisualizer />
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
