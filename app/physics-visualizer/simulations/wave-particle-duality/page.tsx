import type { Metadata } from 'next';
import {
  Callout,
  CardGrid,
  ContentSection,
  DataTable,
  DetailPage,
  Formula,
  PracticeProblem,
  Prose,
  StepList,
  type CardGridItem,
} from '@/components/content';
import WaveParticleDualityVisualizer from './WaveParticleDualityVisualizer';

export const metadata: Metadata = {
  title: 'Wave-Particle Duality - Physics Visualizer | AllVisualizer',
  description:
    'Fire electrons or photons one at a time through a double slit and watch an interference pattern build up from single dots. Add a which-path detector, and calculate de Broglie wavelengths.',
  keywords: ['wave-particle duality', 'double slit', 'de Broglie wavelength', 'quantum mechanics', 'uncertainty principle', 'electron interference', 'which-path'],
};

const evidence: CardGridItem[] = [
  { title: 'Light as a wave', description: 'Young’s double slit (1801): light interferes, producing bright and dark fringes.' },
  { title: 'Light as particles', description: 'Photoelectric effect (Einstein, 1905): light delivers energy in lumps of E = hf.' },
  { title: 'Matter as a wave', description: 'Davisson and Germer (1927): electrons diffract off a nickel crystal exactly as de Broglie predicted.' },
  { title: 'One at a time', description: 'Tonomura (1989): single electrons sent through a biprism build up fringes dot by dot, as in this simulation.' },
];

const wavelengths = [
  { object: 'Electron at 10⁶ m/s', mass: '9.11 × 10⁻³¹ kg', lambda: '7.3 × 10⁻¹⁰ m', note: 'Atom-sized, diffracts off crystals' },
  { object: 'Thermal neutron, 2200 m/s', mass: '1.67 × 10⁻²⁷ kg', lambda: '1.8 × 10⁻¹⁰ m', note: 'Used to probe crystal structure' },
  { object: 'C60 molecule, 200 m/s', mass: '1.20 × 10⁻²⁴ kg', lambda: '2.8 × 10⁻¹² m', note: 'Interference seen in 1999' },
  { object: 'Baseball, 40 m/s', mass: '0.145 kg', lambda: '1.1 × 10⁻³⁴ m', note: 'Far too small to ever detect' },
];

export default function WaveParticleDualityPage() {
  return (
    <DetailPage
      subject="physics"
      item="wave-particle-duality"
      description="Light and matter travel like waves but arrive like particles. Fire them through a double slit one at a time and watch both behaviours at once."
    >
      <WaveParticleDualityVisualizer />

      <ContentSection title="Waves that arrive as particles">
        <Prose>
          <p>
            Send electrons through two slits so slowly that only one is in the apparatus at a time. Each electron makes a
            single sharp dot on the screen, just like a particle would. Yet after thousands of dots the screen shows
            bright and dark stripes, an interference pattern that only waves make.
          </p>
          <p>
            Quantum mechanics describes each electron by a <strong>wavefunction ψ</strong>. The wave passes through both
            slits and interferes with itself. The probability of detecting the electron at a point is
            <strong> |ψ|²</strong>, so each individual landing spot is random, but the overall pattern is fixed. Bright
            fringes are places where the two parts of ψ arrive in step; dark fringes are where they cancel.
          </p>
          <p>
            Add a detector that records which slit the electron used and the fringes disappear, leaving two plain bands.
            Knowing the path means only one part of ψ reaches the screen, so there is nothing to interfere with. You can
            see a wave pattern or which-path information, never both.
          </p>
          <p>
            This trade-off is tied to the <strong>Heisenberg uncertainty principle</strong>: position and momentum cannot
            both be known exactly, Δx · Δp ≥ ħ/2. Pinning down which slit (Δx small) disturbs the sideways momentum by
            enough to wash out the fringes.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="grid gap-4 lg:grid-cols-2">
          <Callout tone="formula" title="de Broglie wavelength">
            <Formula
              where={[
                { symbol: 'h', meaning: 'Planck constant, 6.626 × 10⁻³⁴ J·s' },
                { symbol: 'p = m v', meaning: 'momentum of the particle' },
              ]}
            >
              λ = h / p = h / (m v)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Photon energy and momentum">
            <Formula where={[{ symbol: 'f', meaning: 'frequency; c = speed of light' }]}>
              E = h f, p = h / λ = E / c
            </Formula>
          </Callout>
          <Callout tone="formula" title="Double-slit fringe spacing">
            <Formula
              where={[
                { symbol: 'L', meaning: 'distance from slits to screen' },
                { symbol: 'd', meaning: 'slit separation' },
              ]}
            >
              Δy = λ L / d
            </Formula>
          </Callout>
          <Callout tone="formula" title="Uncertainty principle">
            <Formula where={[{ symbol: 'ħ', meaning: 'h / 2π = 1.055 × 10⁻³⁴ J·s' }]}>Δx · Δp ≥ ħ / 2</Formula>
          </Callout>
        </div>
        <Callout tone="note" title="About the model" className="mt-4">
          The simulation uses a simplified screen pattern: each slit alone gives a broad band, and with both slits open the
          two amplitudes interfere with fringe spacing proportional to λ / d. Real patterns have the same structure.
        </Callout>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Watch the side view: without a detector each particle spreads out as a wave from the source and then from both slits.',
            'Look at the screen. Early on the dots look random; after a few hundred hits the stripes appear. Raise the rate to speed things up.',
            'Compare the bars (counted hits) with the pink line (predicted |ψ|²). They match better the more particles you collect.',
            'Change the wavelength or slit separation. Longer λ or smaller d spreads the fringes apart.',
            'Turn on the which-path detector. Each particle now takes one definite slit, a lamp flashes, and the pattern becomes two bands.',
            'Use the calculator to compare wavelengths of an electron, a neutron and a baseball.',
          ]}
        />
      </ContentSection>

      <ContentSection title="How big are matter waves?">
        <DataTable
          columns={[
            { header: 'Object', cell: 'object' },
            { header: 'Mass', cell: 'mass' },
            { header: 'λ = h / (m v)', cell: 'lambda', numeric: true },
            { header: 'What it means', cell: 'note' },
          ]}
          rows={wavelengths}
        />
      </ContentSection>

      <ContentSection title="The evidence">
        <CardGrid items={evidence} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Electron wavelength"
            question="An electron (m = 9.11 × 10⁻³¹ kg) moves at 2.0 × 10⁶ m/s. What is its de Broglie wavelength, and could it be diffracted by a crystal with atomic spacing 0.3 nm?"
            solution={
              <>
                <p>p = m v = 9.11 × 10⁻³¹ × 2.0 × 10⁶ = 1.82 × 10⁻²⁴ kg·m/s</p>
                <p>λ = h / p = 6.626 × 10⁻³⁴ / 1.82 × 10⁻²⁴</p>
                <p>λ = 3.6 × 10⁻¹⁰ m = 0.36 nm</p>
                <p className="font-semibold text-emerald-700">λ ≈ 0.36 nm, comparable to 0.3 nm, so yes, it diffracts</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Why baseballs do not interfere"
            question="A 0.145 kg baseball is thrown at 40 m/s through a 1 m wide doorway. Estimate its wavelength and the angle of the first diffraction minimum, sin θ ≈ λ / a."
            solution={
              <>
                <p>p = 0.145 × 40 = 5.8 kg·m/s</p>
                <p>λ = 6.626 × 10⁻³⁴ / 5.8 = 1.14 × 10⁻³⁴ m</p>
                <p>sin θ ≈ λ / a = 1.14 × 10⁻³⁴ / 1 m</p>
                <p className="font-semibold text-emerald-700">θ ≈ 10⁻³⁴ rad, utterly undetectable</p>
                <p>The wave nature is still there, but for everyday masses the wavelength is about 10¹⁹ times smaller than a proton.</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
