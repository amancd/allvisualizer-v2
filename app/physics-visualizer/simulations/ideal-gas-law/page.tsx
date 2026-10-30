import type { Metadata } from 'next';
import { Callout, CardGrid, ContentSection, DetailPage, Prose, type CardGridItem } from '@/components/content';
import IdealGasLawVisualizer from './IdealGasLawVisualizer';

export const metadata: Metadata = {
  title: 'Ideal Gas Law - Thermodynamics | AllVisualizer',
  description:
    'Explore the ideal gas law PV=nRT. Visualize the relationship between pressure, volume, temperature, and number of moles through interactive simulations.',
  keywords: ['ideal gas law', 'PV=nRT', 'pressure', 'volume', 'temperature', 'gas laws', 'thermodynamics'],
};

const specialCases: CardGridItem[] = [
  {
    title: "Boyle's law (isothermal)",
    description: (
      <>
        <p>At constant temperature and amount: <strong>P₁V₁ = P₂V₂</strong></p>
        <p className="mt-1">Pressure and volume are inversely proportional.</p>
      </>
    ),
  },
  {
    title: "Charles's law (isobaric)",
    description: (
      <>
        <p>At constant pressure and amount: <strong>V₁/T₁ = V₂/T₂</strong></p>
        <p className="mt-1">Volume and temperature are directly proportional.</p>
      </>
    ),
  },
  {
    title: "Gay-Lussac's law (isochoric)",
    description: (
      <>
        <p>At constant volume and amount: <strong>P₁/T₁ = P₂/T₂</strong></p>
        <p className="mt-1">Pressure and temperature are directly proportional.</p>
      </>
    ),
  },
  {
    title: "Avogadro's law",
    description: (
      <>
        <p>At constant temperature and pressure: <strong>V₁/n₁ = V₂/n₂</strong></p>
        <p className="mt-1">Volume and moles are directly proportional.</p>
      </>
    ),
  },
];

const applications: CardGridItem[] = [
  { title: 'Weather balloons', description: 'Expansion with altitude (decreasing pressure).' },
  { title: 'Scuba diving', description: 'Air consumption and decompression calculations.' },
  { title: 'Internal combustion engines', description: 'Compression and expansion of gases.' },
  { title: 'Aerosol cans', description: 'Pressure-temperature relationships.' },
  { title: 'Hot air balloons', description: 'Volume changes with temperature.' },
  { title: 'Tire pressure', description: 'Temperature effects on pressure.' },
  { title: 'Breathing', description: 'Lung volume and pressure changes.' },
];

export default function IdealGasLawPage() {
  return (
    <DetailPage
      subject="physics"
      item="ideal-gas-law"
      description="Explore the fundamental relationship between pressure, volume, temperature, and amount of gas."
    >
      <IdealGasLawVisualizer />

      <ContentSection title="The ideal gas law">
        <Callout tone="formula" title="PV = nRT">
          <p className="mb-3">
            The ideal gas law describes the behavior of ideal gases by relating four fundamental properties: pressure
            (P), volume (V), temperature (T), and number of moles (n).
          </p>
          <ul className="list-disc space-y-1 pl-5 font-mono">
            <li>P = Pressure (Pa or atm)</li>
            <li>V = Volume (m³ or L)</li>
            <li>n = Number of moles</li>
            <li>R = Gas constant (8.314 J/(mol·K) or 0.0821 L·atm/(mol·K))</li>
            <li>T = Temperature (Kelvin)</li>
          </ul>
        </Callout>
      </ContentSection>

      <ContentSection title="Special cases">
        <CardGrid items={specialCases} />
      </ContentSection>

      <ContentSection title="Kinetic molecular theory">
        <Prose>
          <p>The ideal gas law emerges from the kinetic molecular theory, which makes the following assumptions:</p>
          <ul>
            <li>Gas particles are in constant, random motion</li>
            <li>Particles have negligible volume compared to container volume</li>
            <li>No intermolecular forces between particles</li>
            <li>Collisions between particles and walls are perfectly elastic</li>
            <li>Average kinetic energy is proportional to absolute temperature</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="Real vs ideal gases">
        <Prose>
          <p>Real gases deviate from ideal behavior under certain conditions:</p>
          <ul>
            <li><strong>High pressure:</strong> particle volume becomes significant</li>
            <li><strong>Low temperature:</strong> intermolecular forces become important</li>
            <li><strong>Near liquefaction:</strong> condensation effects appear</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="Applications">
        <CardGrid items={applications} columns={3} />
      </ContentSection>
    </DetailPage>
  );
}
