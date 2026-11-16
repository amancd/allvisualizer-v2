import type { Metadata } from 'next';
import { ArrowRightLeft, Droplets, Magnet, Sigma } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import BondPolarityVisualizer from './BondPolarityVisualizer';

export const metadata: Metadata = {
  title: 'Bond Polarity - Chemistry Visualizer | AllVisualizer',
  description:
    'Pick two elements and see their electronegativity difference, whether the bond is nonpolar, polar covalent or ionic, its percent ionic character, and how bond dipoles add up to a molecular dipole in CO₂, H₂O, CCl₄, CHCl₃, BF₃ and NH₃.',
  keywords: ['bond polarity', 'electronegativity', 'Pauling scale', 'dipole moment', 'polar covalent', 'ionic bond', 'percent ionic character', 'molecular polarity', 'chemistry'],
};

const ideas = [
  {
    title: 'Electronegativity',
    icon: Magnet,
    description: 'How strongly an atom pulls shared electrons toward itself. On the Pauling scale fluorine is highest (3.98) and caesium among the lowest (0.79).',
  },
  {
    title: 'Partial charges',
    icon: ArrowRightLeft,
    description: 'In a polar bond the electron cloud leans toward the more electronegative atom, which becomes δ−; the other atom is left δ+.',
  },
  {
    title: 'A continuum, not boxes',
    icon: Droplets,
    description: 'Nonpolar, polar covalent and ionic are regions on one scale. Every heteronuclear bond has some ionic character; no bond is 100% ionic.',
  },
  {
    title: 'Dipoles are vectors',
    icon: Sigma,
    description: 'A molecule is polar only if its bond dipoles do not cancel. Shape matters as much as the bonds themselves.',
  },
];

const examples = [
  { bond: 'H–H', delta: '0.00', type: 'Nonpolar covalent', ionic: '0%' },
  { bond: 'C–H', delta: '0.35', type: 'Nonpolar covalent', ionic: '3.0%' },
  { bond: 'C–O', delta: '0.89', type: 'Polar covalent', ionic: '18.0%' },
  { bond: 'H–Cl', delta: '0.96', type: 'Polar covalent', ionic: '20.6%' },
  { bond: 'O–H', delta: '1.24', type: 'Polar covalent', ionic: '31.9%' },
  { bond: 'H–F', delta: '1.78', type: 'Polar covalent (borderline)', ionic: '54.7%' },
  { bond: 'Na–Cl', delta: '2.23', type: 'Ionic', ionic: '71.1%' },
  { bond: 'Cs–F', delta: '3.19', type: 'Ionic', ionic: '92.2%' },
];

export default function BondPolarityPage() {
  return (
    <DetailPage subject="chemistry" item="bond-polarity">
      <BondPolarityVisualizer />

      <ContentSection title="Why some bonds are polar">
        <Prose>
          <p>
            When two identical atoms bond, as in H₂ or Cl₂, they pull on the shared electrons equally and the bond is <strong>nonpolar</strong>. When the
            atoms differ, the more <strong>electronegative</strong> one pulls the bonding pair closer. The bond becomes <strong>polar</strong>: a partial
            negative charge (δ−) builds up on one end and a partial positive charge (δ+) on the other. This separation is a <strong>bond dipole</strong>,
            drawn as a crossed arrow pointing toward the negative end.
          </p>
          <p>
            The bigger the electronegativity difference ΔEN, the more lopsided the sharing. Past roughly 1.8 the electron is essentially handed over and
            the bond is best described as <strong>ionic</strong>, a pair of oppositely charged ions held together by electrostatic attraction.
          </p>
          <p>
            For a whole molecule, the bond dipoles add as vectors. In CO₂ and CCl₄ they point in symmetric directions and cancel, so the molecules are
            nonpolar even though every bond is polar. In H₂O, CHCl₃ and NH₃ they do not cancel, so the molecules have a permanent dipole moment.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Electronegativity difference">
            <Formula where={[{ symbol: 'χ', meaning: 'Pauling electronegativity of each atom' }]}>ΔEN = |χ<sub>A</sub> − χ<sub>B</sub>|</Formula>
          </Callout>
          <Callout tone="formula" title="Percent ionic character (Pauling)">
            <Formula>ionic character = 100% × (1 − e<sup>−(ΔEN)²/4</sup>)</Formula>
          </Callout>
          <Callout tone="formula" title="Dipole moment">
            <Formula
              where={[
                { symbol: 'q', meaning: 'size of the separated charge (C)' },
                { symbol: 'd', meaning: 'distance between the charges (m)' },
                { symbol: '1 D', meaning: 'one debye = 3.336 × 10⁻³⁰ C·m' },
              ]}
            >
              μ = q × d,&nbsp;&nbsp; μ<sub>molecule</sub> = Σ μ<sub>bond</sub> (vector sum)
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Example bonds">
        <DataTable
          columns={[
            { header: 'Bond', cell: 'bond' },
            { header: 'ΔEN', cell: 'delta', numeric: true },
            { header: 'Type', cell: 'type' },
            { header: 'Ionic character', cell: 'ionic', numeric: true },
          ]}
          rows={examples}
          caption="Pauling electronegativities; ionic character from 1 − e^(−ΔEN²/4)."
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose two elements from the menus (the number after each symbol is its Pauling electronegativity), or press one of the quick pairs.',
            'Watch the electron cloud slide toward the more electronegative atom. The δ+ and δ− labels and the crossed dipole arrow show which end is which.',
            'Read ΔEN and the bond type, and find the marker on the continuum bar. The dashed lines at 0.4 and 1.8 are approximate boundaries.',
            'Follow the purple point on the ionic-character curve. Notice that it rises smoothly: there is no sudden jump from covalent to ionic.',
            'In the second panel, compare each pair of molecules: CO₂ with H₂O, CCl₄ with CHCl₃ and BF₃ with NH₃. Drag to rotate them in 3D.',
            'Look for the red net-dipole arrow. When the amber bond dipoles cancel, it disappears and the molecule is nonpolar.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception: polar bonds mean a polar molecule">
        A molecule can be full of polar bonds and still be nonpolar. CO₂, BF₃ and CCl₄ all have strongly polar bonds, but their symmetric shapes make the
        bond dipoles cancel exactly. To decide whether a molecule is polar you need both the bond polarities and the 3D shape from VSEPR.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Classify two bonds"
            question="Using Pauling electronegativities (C 2.55, Cl 3.16, K 0.82, Br 2.96), classify the C–Cl and K–Br bonds and estimate the percent ionic character of each."
            solution={
              <>
                <p>C–Cl: ΔEN = 3.16 − 2.55 = 0.61 → between 0.4 and 1.8 → polar covalent</p>
                <p>ΔEN²/4 = 0.3721 / 4 = 0.0930;&nbsp; e^(−0.0930) = 0.9112</p>
                <p>ionic character = 1 − 0.9112 = 0.089 → 8.9%</p>
                <p>K–Br: ΔEN = 2.96 − 0.82 = 2.14 → above 1.8 → ionic</p>
                <p>ΔEN²/4 = 4.5796 / 4 = 1.1449;&nbsp; e^(−1.1449) = 0.3183</p>
                <p>ionic character = 1 − 0.3183 = 0.682 → 68.2%</p>
                <p className="font-semibold text-emerald-700">C–Cl: polar covalent, about 9% ionic. K–Br: ionic, about 68% ionic.</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: BCl₃ versus PCl₃"
            question="BCl₃ is trigonal planar and PCl₃ is trigonal pyramidal (Cl–P–Cl ≈ 100°). Using ΔEN as the size of each bond dipole (B 2.04, P 2.19, Cl 3.16), find the vector sum of the bond dipoles for each molecule. Which is polar?"
            solution={
              <>
                <p>BCl₃: each B–Cl dipole = 3.16 − 2.04 = 1.12, at 120° to each other in a plane</p>
                <p>Sum along any one bond: 1.12 × (1 + 2 cos 120°) = 1.12 × (1 − 1) = 0</p>
                <p>PCl₃: each P–Cl dipole = 3.16 − 2.19 = 0.97</p>
                <p>Angle θ between each bond and the 3-fold axis: cos θ = √((1 + 2 cos 100°)/3) = √(0.2176) ≈ 0.47</p>
                <p>Horizontal parts cancel; vertical parts add: 3 × 0.97 × 0.47 ≈ 1.36 (toward the Cl atoms)</p>
                <p>The P lone pair points the other way and offsets part of this, so the measured dipole is small (about 0.6 D) but not zero.</p>
                <p className="font-semibold text-emerald-700">BCl₃: net dipole 0, nonpolar. PCl₃: net dipole ≈ 1.36 ΔEN units, polar.</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="chemistry"
          current="bond-polarity"
          items={[
            { slug: 'periodic-trends', note: 'How electronegativity changes across the periodic table' },
            { slug: 'vsepr-geometry', note: 'The 3D shapes that decide whether dipoles cancel' },
            { slug: 'lewis-structures', note: 'Find the bonds and lone pairs first' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
