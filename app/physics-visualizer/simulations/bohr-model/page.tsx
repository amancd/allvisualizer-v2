import type { Metadata } from 'next';
import { Callout, CardGrid, type CardGridItem, ContentSection, DataTable, DetailPage, Prose } from '@/components/content';
import BohrModelVisualizer from './BohrModelVisualizer';

export const metadata: Metadata = {
  title: 'Bohr Model Visualization | Physics Visualizer',
  description:
    'Interactive visualization of the Bohr model of the hydrogen atom. Explore electron orbits, energy levels, and spectral line emission.',
  keywords: [
    'Bohr model',
    'hydrogen atom',
    'atomic physics',
    'energy levels',
    'spectral lines',
    'electron orbits',
    'quantum jumps',
    'Balmer series',
    'physics visualization',
    'quantum mechanics',
  ],
};

const postulates: CardGridItem[] = [
  {
    icon: '🔵',
    title: '1. Quantized orbits',
    description:
      'Electrons can only occupy certain discrete orbits where angular momentum is quantized: L = nℏ, where n = 1, 2, 3, ... and ℏ = h/2π.',
  },
  {
    icon: '🟢',
    title: '2. Stationary states',
    description:
      'Electrons in allowed orbits do not radiate energy. They maintain constant energy in these "stationary states" without spiraling into the nucleus.',
  },
  {
    icon: '🟣',
    title: '3. Quantum jumps',
    description: (
      <>
        When an electron transitions between orbits, it absorbs or emits a photon with energy exactly equal to the
        energy difference: ΔE = hf = E<sub>final</sub> - E<sub>initial</sub>.
      </>
    ),
  },
];

const spectralSeries = [
  { series: 'Lyman', transitions: 'n → 1', region: 'Ultraviolet' },
  { series: 'Balmer', transitions: 'n → 2', region: 'Visible' },
  { series: 'Paschen', transitions: 'n → 3', region: 'Infrared' },
  { series: 'Brackett', transitions: 'n → 4', region: 'Infrared' },
];

const applications: CardGridItem[] = [
  { icon: '🌈', title: 'Spectroscopy', description: 'Identifying elements by their characteristic spectral lines.' },
  { icon: '🔭', title: 'Astronomy', description: 'Analyzing light from stars and galaxies.' },
  { icon: '🔦', title: 'Lasers', description: 'Understanding electron transitions in laser media.' },
  { icon: '🧪', title: 'Quantum chemistry', description: 'Foundation for understanding atomic bonding.' },
  { icon: '☀️', title: 'Plasma physics', description: 'Studying ionized gases and fusion reactions.' },
];

export default function BohrModelPage() {
  return (
    <DetailPage
      subject="physics"
      item="bohr-model"
      title="Bohr Model of Hydrogen"
      description="Visualize electron orbits, energy levels, and the emission of light when electrons transition between levels."
    >
      <BohrModelVisualizer />

      <ContentSection title="The Bohr model">
        <Prose>
          <p>
            Proposed by Niels Bohr in 1913, the Bohr model was the first successful quantum model of the atom. It
            explained the discrete spectral lines of hydrogen by postulating that electrons orbit the nucleus in specific
            allowed energy levels.
          </p>
          <p>
            While superseded by modern quantum mechanics, the Bohr model remains valuable for understanding atomic
            structure and provides accurate predictions for hydrogen-like atoms.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key postulates">
        <CardGrid items={postulates} columns={3} />
      </ContentSection>

      <ContentSection title="Energy levels">
        <Prose>
          <p>The energy of an electron in the nth orbit is given by:</p>
        </Prose>
        <Callout tone="formula" title="Energy of the nth level" className="my-4">
          <p className="font-mono text-base">E<sub>n</sub> = -13.6 eV / n²</p>
        </Callout>
        <Prose>
          <p>The negative sign indicates that the electron is bound to the nucleus. Key features:</p>
          <ul>
            <li><strong>Ground state (n=1):</strong> E<sub>1</sub> = -13.6 eV (lowest energy, most stable)</li>
            <li><strong>Excited states (n≥2):</strong> higher energy levels with less binding</li>
            <li><strong>Ionization (n=∞):</strong> E<sub>∞</sub> = 0 eV (electron completely removed)</li>
            <li>Energy levels converge as n increases</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection
        title="Spectral series"
        description="When electrons transition between energy levels, they emit photons with specific wavelengths, creating spectral lines grouped into series:"
      >
        <DataTable
          rows={spectralSeries}
          columns={[
            { header: 'Series', cell: 'series' },
            { header: 'Transitions', cell: 'transitions' },
            { header: 'Spectrum region', cell: 'region' },
          ]}
        />
        <Prose className="mt-4">
          <p>
            The Balmer series (transitions to n=2) produces visible light and was historically important in discovering
            the structure of the hydrogen atom.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Orbital radii">
        <Prose>
          <p>The radius of the nth orbit follows:</p>
        </Prose>
        <Callout tone="formula" title="Radius of the nth orbit" className="my-4">
          <p className="font-mono text-base">r<sub>n</sub> = n² × a<sub>0</sub></p>
        </Callout>
        <Prose>
          <p>
            where a<sub>0</sub> = 0.529 Å (Bohr radius). The ground state has the smallest radius, and orbital size
            increases quadratically with n.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Applications">
        <CardGrid items={applications} columns={3} />
      </ContentSection>

      <ContentSection title="Limitations">
        <Callout tone="warning" title="While revolutionary, the Bohr model has limitations:">
          <ul className="list-disc space-y-1 pl-5">
            <li>Only accurately predicts hydrogen and hydrogen-like ions (single electron)</li>
            <li>Cannot explain fine structure or hyperfine splitting</li>
            <li>Doesn&apos;t account for electron spin</li>
            <li>Incompatible with the Heisenberg uncertainty principle</li>
            <li>Cannot predict intensity of spectral lines</li>
            <li>Replaced by the Schrödinger equation and quantum mechanics</li>
          </ul>
        </Callout>
        <Prose className="mt-4">
          <p>
            Despite these limitations, the Bohr model remains a valuable pedagogical tool and provides qualitatively
            correct insights into atomic structure.
          </p>
        </Prose>
      </ContentSection>
    </DetailPage>
  );
}
