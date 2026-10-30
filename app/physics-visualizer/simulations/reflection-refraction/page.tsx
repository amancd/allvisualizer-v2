import type { Metadata } from 'next';
import { Callout, CardGrid, type CardGridItem, ContentSection, DataTable, DetailPage, Prose } from '@/components/content';
import ReflectionRefractionVisualizer from './ReflectionRefractionVisualizer';

export const metadata: Metadata = {
  title: 'Reflection & Refraction - Waves & Optics | AllVisualizer',
  description:
    "Explore how light behaves at interfaces between different media. Learn about Snell's law, total internal reflection, and the critical angle through interactive simulations.",
  keywords: ['reflection', 'refraction', "Snell's law", 'total internal reflection', 'critical angle', 'refractive index', 'optics'],
};

const totalInternalReflection: CardGridItem[] = [
  {
    title: 'Conditions required',
    description: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Light traveling from denser to less dense medium</li>
        <li>Angle of incidence &gt; critical angle</li>
        <li>100% of light is reflected internally</li>
      </ul>
    ),
  },
  {
    title: 'Applications',
    description: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Optical fibers for data transmission</li>
        <li>Binoculars and periscopes (prisms)</li>
        <li>Diamond brilliance</li>
      </ul>
    ),
  },
];

const refractiveIndices = [
  { material: 'Vacuum', n: '1.00', speed: '3.0 × 10⁸ m/s' },
  { material: 'Air', n: '1.0003', speed: '≈ 3.0 × 10⁸ m/s' },
  { material: 'Water', n: '1.33', speed: '2.25 × 10⁸ m/s' },
  { material: 'Glass (typical)', n: '1.5', speed: '2.0 × 10⁸ m/s' },
  { material: 'Diamond', n: '2.42', speed: '1.24 × 10⁸ m/s' },
];

const applications: CardGridItem[] = [
  { title: 'Optical fibers', description: 'Use total internal reflection to transmit data over long distances.' },
  { title: 'Lenses', description: 'Cameras, eyeglasses and microscopes all rely on refraction.' },
  { title: 'Rainbows', description: 'Refraction and reflection inside water droplets.' },
  { title: 'Mirages', description: 'Refraction in air layers of different temperatures.' },
  { title: 'Prisms', description: 'Separate white light into colors due to wavelength-dependent refraction.' },
  { title: 'Underwater vision', description: 'Why things look distorted when viewed from different media.' },
  { title: 'Diamonds', description: 'A high refractive index creates brilliance through total internal reflection.' },
];

export default function ReflectionRefractionPage() {
  return (
    <DetailPage subject="physics" item="reflection-refraction">
      <ReflectionRefractionVisualizer />

      <ContentSection title="Snell's law of refraction">
        <Callout tone="formula" title="Key formulas">
          <p className="mb-3">
            When light passes from one medium to another, it changes direction according to the refractive indices of
            the two media.
          </p>
          <div className="space-y-1 font-mono">
            <p><strong>Snell&apos;s law:</strong> n₁ sin(θ₁) = n₂ sin(θ₂)</p>
            <p><strong>Refractive index:</strong> n = c / v</p>
            <p><strong>Critical angle:</strong> θ<sub>c</sub> = sin⁻¹(n₂ / n₁) when n₁ &gt; n₂</p>
            <p><strong>Total internal reflection:</strong> occurs when θ₁ &gt; θ<sub>c</sub></p>
          </div>
        </Callout>
      </ContentSection>

      <ContentSection title="Law of reflection">
        <Prose>
          <p>When light reflects off a surface, the angle of incidence equals the angle of reflection:</p>
          <ul>
            <li>θ<sub>incident</sub> = θ<sub>reflected</sub></li>
            <li>Incident ray, reflected ray, and normal all lie in the same plane</li>
            <li>Works for all types of surfaces (mirrors, water, glass, etc.)</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="Refraction principles">
        <Prose>
          <p>When light enters a different medium, it bends according to the refractive indices:</p>
          <ul>
            <li><strong>Into denser medium (n₂ &gt; n₁):</strong> light bends toward the normal</li>
            <li><strong>Into less dense medium (n₂ &lt; n₁):</strong> light bends away from the normal</li>
            <li><strong>Same refractive index:</strong> no bending, light continues straight</li>
            <li><strong>Speed changes:</strong> light slows down in denser media (higher n)</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection
        title="Total internal reflection"
        description="A special phenomenon that occurs when light travels from a denser to a less dense medium."
      >
        <CardGrid items={totalInternalReflection} />
      </ContentSection>

      <ContentSection title="Common refractive indices">
        <DataTable
          rows={refractiveIndices}
          columns={[
            { header: 'Material', cell: 'material' },
            { header: 'Refractive index (n)', cell: 'n', numeric: true },
            { header: 'Speed of light', cell: 'speed' },
          ]}
        />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} columns={3} />
      </ContentSection>
    </DetailPage>
  );
}
