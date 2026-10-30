import type { Metadata } from 'next';
import { Callout, CardGrid, type CardGridItem, ContentSection, DataTable, DetailPage, Prose } from '@/components/content';
import PhotoelectricEffectVisualizer from './PhotoelectricEffectVisualizer';

export const metadata: Metadata = {
  title: 'Photoelectric Effect Visualization | Physics Visualizer',
  description:
    'Interactive visualization of the photoelectric effect. Explore how light frequency and intensity affect electron emission, demonstrating the quantum nature of light.',
  keywords: [
    'photoelectric effect',
    'quantum mechanics',
    'photons',
    'Einstein',
    'work function',
    'kinetic energy',
    'frequency',
    'wavelength',
    'physics visualization',
    'quantum physics',
  ],
};

const observations: CardGridItem[] = [
  {
    title: 'Threshold frequency',
    description: (
      <>
        Below the threshold frequency f<sub>0</sub> = φ/h, no electrons are emitted regardless of light intensity. This
        was unexplainable by classical wave theory.
      </>
    ),
  },
  {
    title: 'Instantaneous emission',
    description:
      "Electrons are emitted immediately when light above threshold frequency hits the surface. There's no time delay, even at low intensities.",
  },
  {
    title: 'Intensity effect',
    description:
      "Higher intensity means more photons, resulting in more electrons ejected per second, but doesn't change the maximum kinetic energy of individual electrons.",
  },
  {
    title: 'Frequency dependence',
    description:
      'Higher frequency light (shorter wavelength) produces electrons with higher kinetic energy. The relationship is linear: KE increases linearly with frequency.',
  },
];

const workFunctions = [
  { metal: 'Sodium', phi: '2.28', threshold: '544' },
  { metal: 'Potassium', phi: '2.30', threshold: '539' },
  { metal: 'Calcium', phi: '2.87', threshold: '432' },
  { metal: 'Zinc', phi: '4.33', threshold: '286' },
  { metal: 'Copper', phi: '4.65', threshold: '267' },
];

const applications: CardGridItem[] = [
  { title: 'Solar panels', description: 'Photovoltaic cells convert light energy directly to electricity.' },
  { title: 'Night vision devices', description: 'Image intensifiers amplify low light using photoelectric emission.' },
  { title: 'Photodetectors', description: 'Light sensors in cameras, barcode scanners, and optical communications.' },
  { title: 'X-ray photoelectron spectroscopy', description: 'A surface analysis technique in materials science.' },
  { title: 'Photoelectron microscopy', description: 'Imaging surfaces at nanometer resolution.' },
];

export default function PhotoelectricEffectPage() {
  return (
    <DetailPage subject="physics" item="photoelectric-effect">
      <PhotoelectricEffectVisualizer />

      <ContentSection title="What is the photoelectric effect?">
        <Prose>
          <p>
            The photoelectric effect is the emission of electrons from a metal surface when light shines on it.
            Discovered by Heinrich Hertz in 1887 and explained by Albert Einstein in 1905, this phenomenon provided
            crucial evidence for the quantum nature of light.
          </p>
          <p>
            Classical wave theory predicted that any frequency of light should eventually eject electrons if the
            intensity is high enough. However, experiments showed that only light above a certain threshold frequency can
            cause electron emission, regardless of intensity.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Einstein's equation">
        <Prose>
          <p>
            Einstein explained the photoelectric effect by proposing that light consists of discrete energy packets
            called photons. When a photon hits an electron, it transfers all its energy:
          </p>
        </Prose>
        <Callout tone="formula" title="Photon energy and maximum kinetic energy" className="my-4">
          <div className="space-y-1 font-mono text-base">
            <p>E<sub>photon</sub> = hf</p>
            <p>KE<sub>max</sub> = hf - φ</p>
          </div>
        </Callout>
        <Prose>
          <p>Where:</p>
          <ul>
            <li><strong>h</strong> = Planck&apos;s constant (6.626 × 10<sup>-34</sup> J·s)</li>
            <li><strong>f</strong> = frequency of incident light</li>
            <li><strong>φ</strong> = work function (minimum energy to eject an electron)</li>
            <li><strong>KE<sub>max</sub></strong> = maximum kinetic energy of the ejected electron</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="Key observations">
        <CardGrid items={observations} />
      </ContentSection>

      <ContentSection
        title="Work function values"
        description="Different metals have different work functions (energy needed to remove an electron):"
      >
        <DataTable
          rows={workFunctions}
          columns={[
            { header: 'Metal', cell: 'metal' },
            { header: 'Work function (eV)', cell: 'phi', numeric: true },
            { header: 'Threshold wavelength (nm)', cell: 'threshold', numeric: true },
          ]}
        />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} columns={3} />
      </ContentSection>

      <ContentSection title="Historical significance">
        <Prose>
          <p>
            Albert Einstein received the 1921 Nobel Prize in Physics for his explanation of the photoelectric effect, not
            for his more famous theory of relativity. This work was crucial because:
          </p>
          <ul>
            <li>It provided strong evidence for the particle nature of light (photons)</li>
            <li>It helped establish quantum mechanics as a valid theory</li>
            <li>It showed that light has both wave and particle properties (wave-particle duality)</li>
            <li>It demonstrated that energy is quantized at the microscopic level</li>
          </ul>
        </Prose>
      </ContentSection>
    </DetailPage>
  );
}
