import type { Metadata } from 'next';
import { Callout, CardGrid, ContentSection, DetailPage, Prose, type CardGridItem } from '@/components/content';
import DoubleSlitVisualizer from './DoubleSlitVisualizer';

export const metadata: Metadata = {
  title: 'Double-Slit Experiment - Waves & Optics | AllVisualizer',
  description:
    'Experience the famous double-slit experiment that demonstrates wave-particle duality. Visualize interference patterns, diffraction, and the wave nature of light.',
  keywords: ['double slit experiment', 'wave particle duality', 'interference pattern', 'diffraction', 'quantum mechanics', "Young's experiment"],
};

const concepts: CardGridItem[] = [
  {
    title: 'Coherent sources',
    description:
      'The two slits act as coherent sources: they maintain a constant phase relationship because they come from the same light source.',
  },
  {
    title: 'Interference pattern',
    description:
      'Alternating bright and dark fringes appear due to constructive and destructive interference of waves from the two slits.',
  },
  {
    title: 'Path difference',
    description:
      'The difference in distance traveled by light from each slit determines whether interference is constructive or destructive.',
  },
  {
    title: 'Central maximum',
    description: 'The brightest fringe, at the center, where the path difference is zero and waves arrive in phase.',
  },
];

const parameters: CardGridItem[] = [
  { title: 'Wavelength (λ)', description: 'Smaller wavelengths (blue) create tighter fringe spacing.' },
  { title: 'Slit separation (d)', description: 'Larger separation creates tighter fringes.' },
  { title: 'Screen distance (L)', description: 'Greater distance spreads out the pattern.' },
  { title: 'Slit width', description: 'Affects the single-slit diffraction envelope.' },
];

const applications: CardGridItem[] = [
  { title: 'Wavelength measurement', description: 'Precisely determine the wavelength of light sources.' },
  { title: 'Optical testing', description: 'Check the quality of lenses and mirrors using interferometry.' },
  {
    title: 'Spectroscopy',
    description: 'Diffraction gratings (many slits) separate light by wavelength.',
  },
  { title: 'Holography', description: 'Creates 3D images using interference patterns.' },
  {
    title: 'Quantum mechanics',
    description: 'Demonstrates wave-particle duality with electrons and photons.',
  },
  { title: 'Laser characterization', description: 'Measure coherence length and beam quality.' },
];

export default function DoubleSlitPage() {
  return (
    <DetailPage
      subject="physics"
      item="double-slit"
      description="One of the most famous experiments in physics, demonstrating the wave nature of light."
    >
      <DoubleSlitVisualizer />

      <ContentSection title="Theory">
        <Callout tone="formula" title="Young's double-slit experiment">
          <p>
            When coherent light passes through two narrow slits, it creates an interference pattern of bright and dark
            fringes on a screen. This demonstrates that light behaves as a wave.
          </p>
          <div className="mt-3 space-y-1 font-mono">
            <p><strong>Path difference:</strong> δ = d sin(θ)</p>
            <p><strong>Bright fringes:</strong> δ = nλ (n = 0, ±1, ±2, ...)</p>
            <p><strong>Dark fringes:</strong> δ = (n + ½)λ</p>
            <p><strong>Fringe spacing:</strong> Δy = λL / d</p>
          </div>
        </Callout>
      </ContentSection>

      <ContentSection title="Key concepts">
        <CardGrid items={concepts} />
      </ContentSection>

      <ContentSection title="Parameters explained">
        <CardGrid items={parameters} />
      </ContentSection>

      <ContentSection title="Historical significance">
        <Prose>
          <p>
            Thomas Young performed this experiment in 1801, providing compelling evidence for the wave theory of light.
            It challenged Newton&apos;s particle theory and revolutionized our understanding of light. Later, the
            experiment would play a crucial role in quantum mechanics by demonstrating wave-particle duality.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Applications">
        <CardGrid items={applications} columns={3} />
      </ContentSection>
    </DetailPage>
  );
}
