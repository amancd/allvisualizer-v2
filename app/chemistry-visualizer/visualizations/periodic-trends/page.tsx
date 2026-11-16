import type { Metadata } from 'next';
import { Magnet, Maximize2, Shield, Zap } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import PeriodicTrendsVisualizer from './PeriodicTrendsVisualizer';

export const metadata: Metadata = {
  title: 'Periodic Trends - Chemistry Visualizer | AllVisualizer',
  description:
    'Colour the periodic table by atomic radius, first ionization energy, Pauling electronegativity or electron affinity, tap any element for its data, and plot each property against atomic number to see periodicity.',
  keywords: ['periodic trends', 'atomic radius', 'ionization energy', 'electronegativity', 'electron affinity', 'effective nuclear charge', 'periodic table', 'chemistry'],
};

const drivers = [
  {
    title: 'Effective nuclear charge',
    icon: Zap,
    description: 'Across a period the nuclear charge rises by one each step, but electrons in the same shell shield each other poorly, so the outer electrons feel a stronger pull.',
  },
  {
    title: 'Shielding by inner shells',
    icon: Shield,
    description: 'Core electrons sit between the nucleus and the valence electrons and cancel much of the nuclear charge. Each new period adds another full layer of shielding.',
  },
  {
    title: 'Distance from the nucleus',
    icon: Maximize2,
    description: 'Moving down a group puts the outer electrons in a higher shell, farther out. Electrostatic attraction falls with distance, so they are easier to remove.',
  },
  {
    title: 'Attraction for bonding electrons',
    icon: Magnet,
    description: 'Electronegativity and electron affinity both follow from how strongly the nucleus pulls on electrons near the outside of the atom.',
  },
];

const period3 = [
  { el: 'Na', radius: 166, ie: '495.8', en: '0.93' },
  { el: 'Mg', radius: 141, ie: '737.7', en: '1.31' },
  { el: 'Al', radius: 121, ie: '577.5', en: '1.61' },
  { el: 'Si', radius: 111, ie: '786.5', en: '1.90' },
  { el: 'P', radius: 107, ie: '1011.8', en: '2.19' },
  { el: 'S', radius: 105, ie: '999.6', en: '2.58' },
  { el: 'Cl', radius: 102, ie: '1251.2', en: '3.16' },
  { el: 'Ar', radius: 106, ie: '1520.6', en: '–' },
];

export default function PeriodicTrendsPage() {
  return (
    <DetailPage subject="chemistry" item="periodic-trends">
      <PeriodicTrendsVisualizer />

      <ContentSection title="Why properties repeat">
        <Prose>
          <p>
            Elements in the same group have the same arrangement of outer electrons: every alkali metal ends in ns¹, every halogen in ns² np⁵.
            Because chemistry is mostly about those outer electrons, properties repeat each time a new shell starts. That repetition is
            <strong> periodicity</strong>, and the line chart under the table shows it as a sawtooth: sharp peaks at the noble gases and
            deep valleys at the alkali metals for ionization energy, and the reverse for atomic radius.
          </p>
          <p>
            Two competing effects explain nearly every trend. Moving <strong>across a period</strong>, protons are added to the nucleus while
            electrons go into the same shell, which shields poorly, so the effective nuclear charge felt by the outer electrons rises. Atoms
            shrink, hold their electrons more tightly (higher ionization energy) and pull harder on bonding electrons (higher electronegativity).
            Moving <strong>down a group</strong>, each new shell sits farther out and is screened by more core electrons, so atoms grow and
            their outer electrons are easier to remove.
          </p>
          <p>
            The trends are not perfectly smooth. Ionization energy dips from group 2 to 13 and from group 15 to 16, the d-block changes only
            slowly because d electrons shield the outer s electrons, and the lanthanide contraction makes the 5d metals almost the same size as
            the 4d metals above them.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={drivers} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Effective nuclear charge">
            <Formula where={[{ symbol: 'Z', meaning: 'atomic number (protons)' }, { symbol: 'S', meaning: 'shielding constant from the other electrons (Slater’s rules)' }]}>
              Z<sub>eff</sub> = Z − S
            </Formula>
          </Callout>
          <Callout tone="formula" title="First ionization energy">
            <Formula>X(g) → X⁺(g) + e⁻,&nbsp;&nbsp; ΔH = IE₁ &gt; 0;&nbsp;&nbsp; 1 eV per atom = 96.485 kJ/mol</Formula>
          </Callout>
          <Callout tone="formula" title="Pauling electronegativity difference">
            <Formula where={[{ symbol: 'Eₓ', meaning: 'bond dissociation energies in eV' }]}>
              |χ<sub>A</sub> − χ<sub>B</sub>| = √(E<sub>AB</sub> − (E<sub>AA</sub> + E<sub>BB</sub>)/2)
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Period 3 across the table" description="Radius in pm, ionization energy in kJ/mol. Argon forms no bonds, so it has no Pauling electronegativity.">
        <DataTable
          columns={[
            { header: 'Element', cell: 'el' },
            { header: 'Covalent radius', cell: 'radius', numeric: true },
            { header: 'First IE', cell: 'ie', numeric: true },
            { header: 'Electronegativity', cell: 'en', numeric: true },
          ]}
          rows={period3}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose a property. The table recolours from dark purple (lowest) to yellow (highest); grey cells have no reliable data.',
            'Hover or tap an element to see all four of its values, its rank and its category. Its period and group are outlined so you can follow the trend.',
            'On a phone, scroll the table sideways inside its box. Values appear inside each cell on wider screens.',
            'Use the line chart to see periodicity: tap anywhere on it to select the element at that atomic number.',
            'Compare B with Be and O with N under ionization energy to find the two dips, and compare F with Cl under electron affinity.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception: fluorine has the highest electron affinity">
        Fluorine is the most electronegative element, but chlorine releases more energy when it gains an electron (349 vs 328 kJ/mol).
        The fluorine atom is so small that an extra electron is squeezed close to the seven already in its 2s and 2p orbitals, and the
        extra repulsion cancels part of the gain. Electronegativity describes atoms in bonds; electron affinity describes isolated atoms.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Ordering ionization energies"
            question="Put Na, Mg, Al and Si in order of increasing first ionization energy and explain why the order is not simply the order across the period."
            solution={
              <>
                <p>Data: Na 495.8, Mg 737.7, Al 577.5, Si 786.5 kJ/mol.</p>
                <p>Na is lowest: its single 3s electron sits outside a full shell and feels Z<sub>eff</sub> ≈ 2.2.</p>
                <p>Al (577.5) is below Mg (737.7) because aluminium loses a 3p electron, which is higher in energy and better shielded than Mg&apos;s paired 3s electrons.</p>
                <p>Si is highest: it adds a second 3p electron with a larger nuclear charge.</p>
                <p className="font-semibold text-emerald-700">Na &lt; Al &lt; Mg &lt; Si</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Effective nuclear charge and bond type"
            question="Use Slater's rules to estimate Z_eff for the outer electron of Na and of Cl. Then use Pauling electronegativities to classify the bonds in NaCl and HCl (take a difference above about 1.7 as mainly ionic)."
            solution={
              <>
                <p>Na (1s² 2s² 2p⁶ 3s¹): S = 8 × 0.85 + 2 × 1.00 = 8.8, so Z<sub>eff</sub> = 11 − 8.8 = 2.2.</p>
                <p>Cl (… 3s² 3p⁵): S = 6 × 0.35 + 8 × 0.85 + 2 × 1.00 = 10.9, so Z<sub>eff</sub> = 17 − 10.9 = 6.1.</p>
                <p>The much larger Z<sub>eff</sub> explains why Cl (102 pm) is smaller than Na (166 pm) and holds electrons far more tightly.</p>
                <p>NaCl: Δχ = 3.16 − 0.93 = 2.23, ionic. HCl: Δχ = 3.16 − 2.20 = 0.96, polar covalent.</p>
                <p className="font-semibold text-emerald-700">Z<sub>eff</sub>(Na) ≈ 2.2, Z<sub>eff</sub>(Cl) ≈ 6.1; NaCl ionic (2.23), HCl polar covalent (0.96)</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related visualizations">
        <RelatedItems
          subject="chemistry"
          current="periodic-trends"
          items={[
            { slug: 'bond-polarity', note: 'Turn electronegativity differences into nonpolar, polar and ionic bonds' },
            { slug: 'lewis-structures', note: 'Group numbers give the valence electrons you place in a Lewis structure' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
