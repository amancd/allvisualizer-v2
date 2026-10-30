import type { Metadata } from 'next';
import { Callout, CardGrid, type CardGridItem, ContentSection, DataTable, DetailPage, Formula, Prose } from '@/components/content';
import HeatTransferVisualizer from './HeatTransferVisualizer';

export const metadata: Metadata = {
  title: 'Heat Transfer - Thermodynamics | AllVisualizer',
  description:
    'Visualize the three modes of heat transfer: conduction, convection, and radiation. Understand thermal energy transfer mechanisms.',
  keywords: ['heat transfer', 'conduction', 'convection', 'radiation', 'thermal energy', 'thermodynamics'],
};

interface Mechanism {
  title: string;
  intro: string;
  law: string;
  formula: React.ReactNode;
  variables: React.ReactNode[];
  notes: { label: string; text: string }[];
}

const mechanisms: Mechanism[] = [
  {
    title: '1. Conduction',
    intro:
      'Heat transfer through direct contact between materials. Energy is transferred through molecular collisions and electron movement.',
    law: "Fourier's law",
    formula: 'Q = -kA(dT/dx)',
    variables: [
      'Q = heat transfer rate (W)',
      'k = thermal conductivity (W/(m·K))',
      'A = cross-sectional area (m²)',
      'dT/dx = temperature gradient',
    ],
    notes: [{ label: 'Examples', text: 'Touching a hot stove, heat spreading through a metal rod' }],
  },
  {
    title: '2. Convection',
    intro:
      'Heat transfer through fluid motion (liquids or gases). Warmer fluid rises while cooler fluid sinks, creating circulation patterns.',
    law: "Newton's law of cooling",
    formula: (
      <>
        Q = hA(T<sub>s</sub> - T<sub>∞</sub>)
      </>
    ),
    variables: [
      'h = convection heat transfer coefficient',
      'A = surface area',
      <>T<sub>s</sub> = surface temperature</>,
      <>T<sub>∞</sub> = fluid temperature</>,
    ],
    notes: [
      { label: 'Types', text: 'Natural (buoyancy-driven) and forced (external flow)' },
      { label: 'Examples', text: 'Boiling water, ocean currents, heating/cooling systems' },
    ],
  },
  {
    title: '3. Radiation',
    intro: 'Heat transfer through electromagnetic waves. Does not require a medium and can occur through vacuum.',
    law: 'Stefan-Boltzmann law',
    formula: 'Q = εσAT⁴',
    variables: [
      'ε = emissivity (0 to 1)',
      'σ = Stefan-Boltzmann constant (5.67×10⁻⁸ W/(m²·K⁴))',
      'A = surface area',
      'T = absolute temperature (K)',
    ],
    notes: [{ label: 'Examples', text: "Sun's heat, infrared heaters, thermal imaging" }],
  },
];

const conductivities = [
  { material: 'Diamond', k: '2300', type: 'Excellent conductor' },
  { material: 'Copper', k: '401', type: 'Good conductor' },
  { material: 'Aluminum', k: '237', type: 'Good conductor' },
  { material: 'Water', k: '0.6', type: 'Poor conductor' },
  { material: 'Wood', k: '0.1-0.2', type: 'Insulator' },
  { material: 'Air', k: '0.026', type: 'Good insulator' },
];

const applications: CardGridItem[] = [
  { title: 'Building insulation', description: 'Minimize heat loss/gain through walls and roofs.' },
  { title: 'Cooking', description: 'Conduction (pan), convection (oven), radiation (broiler).' },
  { title: 'Electronics cooling', description: 'Heat sinks use conduction and convection.' },
  { title: 'Climate control', description: 'HVAC systems use all three mechanisms.' },
  { title: 'Solar panels', description: 'Capture radiant energy from the sun.' },
  { title: 'Thermal protection', description: 'Spacecraft heat shields during re-entry.' },
  { title: 'Industrial processes', description: 'Heat exchangers, furnaces, refrigeration.' },
];

export default function HeatTransferPage() {
  return (
    <DetailPage
      subject="physics"
      item="heat-transfer"
      description="Explore the three mechanisms of heat transfer: conduction, convection, and radiation."
    >
      <HeatTransferVisualizer />

      <ContentSection title="Heat transfer fundamentals">
        <Prose>
          <p>
            Heat transfer is the movement of thermal energy from a region of higher temperature to a region of lower
            temperature. It occurs through three main mechanisms.
          </p>
        </Prose>
      </ContentSection>

      {mechanisms.map((m) => (
        <ContentSection key={m.title} title={m.title}>
          <Prose>
            <p>{m.intro}</p>
          </Prose>
          <Callout tone="formula" title={m.law} className="mt-4">
            <Formula>{m.formula}</Formula>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {m.variables.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
            {m.notes.map((note) => (
              <p key={note.label} className="mt-2">
                <strong>{note.label}:</strong> {note.text}
              </p>
            ))}
          </Callout>
        </ContentSection>
      ))}

      <ContentSection title="Thermal conductivity">
        <DataTable
          rows={conductivities}
          columns={[
            { header: 'Material', cell: 'material' },
            { header: 'k (W/(m·K))', cell: 'k', numeric: true },
            { header: 'Type', cell: 'type' },
          ]}
        />
      </ContentSection>

      <ContentSection title="Applications">
        <CardGrid items={applications} columns={3} />
      </ContentSection>
    </DetailPage>
  );
}
