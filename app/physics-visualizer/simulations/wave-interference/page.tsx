import type { Metadata } from 'next';
import { Callout, CardGrid, ContentSection, DetailPage, type CardGridItem } from '@/components/content';
import WaveInterferenceVisualizer from './WaveInterferenceVisualizer';

export const metadata: Metadata = {
  title: 'Wave Interference - Waves & Optics | AllVisualizer',
  description:
    'Visualize constructive and destructive wave interference patterns. Learn about superposition, phase difference, and wave amplitude through interactive simulations.',
  keywords: ['wave interference', 'superposition', 'constructive interference', 'destructive interference', 'phase difference', 'wave physics'],
};

const interferenceTypes: CardGridItem[] = [
  {
    title: 'Constructive interference',
    description: (
      <>
        <p>
          Occurs when two waves are <strong>in phase</strong> (phase difference = 0°, 360°, etc.). The waves reinforce
          each other, creating a larger amplitude:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Maximum amplitude = A₁ + A₂</li>
          <li>Path difference = nλ (n = 0, 1, 2, ...)</li>
          <li>Phase difference = 2πn radians</li>
          <li>Bright fringes in interference patterns</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Destructive interference',
    description: (
      <>
        <p>
          Occurs when two waves are <strong>out of phase</strong> (phase difference = 180°, 540°, etc.). The waves
          cancel each other:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Minimum amplitude = |A₁ − A₂|</li>
          <li>Path difference = (n + ½)λ (n = 0, 1, 2, ...)</li>
          <li>Phase difference = (2n + 1)π radians</li>
          <li>Dark fringes in interference patterns</li>
        </ul>
      </>
    ),
  },
];

const parameters: CardGridItem[] = [
  {
    title: 'Wavelength (λ)',
    description: 'Distance between successive crests or troughs. Determines the spacing of interference patterns.',
  },
  { title: 'Frequency (f)', description: 'Number of wave cycles per second. Related to wavelength by v = fλ.' },
  { title: 'Amplitude (A)', description: 'Maximum displacement from equilibrium. Determines wave intensity.' },
  { title: 'Phase (φ)', description: 'Position within the wave cycle. Phase difference determines the interference type.' },
];

const applications: CardGridItem[] = [
  {
    title: 'Noise-canceling headphones',
    description: 'Use destructive interference to reduce ambient noise.',
  },
  { title: 'Thin film interference', description: 'Creates colors in soap bubbles and oil slicks.' },
  { title: 'Radio astronomy', description: 'Interferometers combine signals for higher resolution.' },
  { title: 'Holography', description: 'Records interference patterns to create 3D images.' },
  { title: 'Seismic analysis', description: 'Understanding how earthquake waves interact.' },
  { title: 'Acoustic engineering', description: 'Designing concert halls and reducing echoes.' },
];

export default function WaveInterferencePage() {
  return (
    <DetailPage
      subject="physics"
      item="wave-interference"
      description="Explore how waves combine to create constructive and destructive interference patterns."
    >
      <WaveInterferenceVisualizer />

      <ContentSection title="Theory">
        <div className="space-y-6">
          <Callout tone="formula" title="Principle of superposition">
            <p>
              When two or more waves overlap in space, the resulting displacement at any point is the algebraic sum of
              the individual wave displacements.
            </p>
            <div className="mt-3 space-y-1 font-mono">
              <p>y<sub>total</sub> = y<sub>1</sub> + y<sub>2</sub></p>
              <p>y<sub>1</sub> = A<sub>1</sub> sin(k₁x − ω₁t + φ₁)</p>
              <p>y<sub>2</sub> = A<sub>2</sub> sin(k₂x − ω₂t + φ₂)</p>
            </div>
          </Callout>

          <CardGrid items={interferenceTypes} />
        </div>
      </ContentSection>

      <ContentSection title="Key parameters">
        <CardGrid items={parameters} />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} columns={3} />
      </ContentSection>
    </DetailPage>
  );
}
