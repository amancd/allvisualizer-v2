import type { Metadata } from 'next';
import { ArrowUpDown, Layers, ListOrdered, Magnet } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import ElectronConfigurationVisualizer from './ElectronConfigurationVisualizer';

export const metadata: Metadata = {
  title: 'Electron Configuration - Chemistry Visualizer | AllVisualizer',
  description:
    'Pick any element from hydrogen to oganesson and fill its orbitals electron by electron with the Aufbau principle, Hund\'s rule and the Pauli exclusion principle. See orbital box diagrams, noble-gas shorthand and the exceptions such as Cr and Cu.',
  keywords: ['electron configuration', 'Aufbau principle', 'Hund\'s rule', 'Pauli exclusion principle', 'orbital diagram', 'Madelung rule', 'noble gas shorthand', 'chemistry'],
};

const rules = [
  {
    title: 'Aufbau principle',
    icon: ListOrdered,
    description: 'Electrons occupy the lowest-energy subshell available. The Madelung rule gives the order: lower n + l first, and for equal n + l, lower n first.',
  },
  {
    title: 'Pauli exclusion principle',
    icon: ArrowUpDown,
    description: 'No two electrons in an atom share all four quantum numbers, so one orbital holds at most two electrons, with opposite spins (↑↓).',
  },
  {
    title: "Hund's rule",
    icon: Magnet,
    description: 'Within a subshell, electrons spread out into empty orbitals with parallel spins before any of them pair up. This keeps them apart and lowers repulsion.',
  },
  {
    title: 'Shells and subshells',
    icon: Layers,
    description: 'Shell n contains n subshells (s, p, d, f for l = 0, 1, 2, 3). A subshell has 2l + 1 orbitals, so s, p, d and f hold 2, 6, 10 and 14 electrons.',
  },
];

const exceptions = [
  { element: 'Chromium (24)', predicted: '[Ar] 4s² 3d⁴', actual: '[Ar] 4s¹ 3d⁵', reason: 'Half-filled 3d' },
  { element: 'Copper (29)', predicted: '[Ar] 4s² 3d⁹', actual: '[Ar] 4s¹ 3d¹⁰', reason: 'Filled 3d' },
  { element: 'Niobium (41)', predicted: '[Kr] 5s² 4d³', actual: '[Kr] 5s¹ 4d⁴', reason: 'Close 5s/4d energies' },
  { element: 'Molybdenum (42)', predicted: '[Kr] 5s² 4d⁴', actual: '[Kr] 5s¹ 4d⁵', reason: 'Half-filled 4d' },
  { element: 'Ruthenium (44)', predicted: '[Kr] 5s² 4d⁶', actual: '[Kr] 5s¹ 4d⁷', reason: 'Close 5s/4d energies' },
  { element: 'Rhodium (45)', predicted: '[Kr] 5s² 4d⁷', actual: '[Kr] 5s¹ 4d⁸', reason: 'Close 5s/4d energies' },
  { element: 'Palladium (46)', predicted: '[Kr] 5s² 4d⁸', actual: '[Kr] 4d¹⁰', reason: 'Filled 4d, empty 5s' },
  { element: 'Silver (47)', predicted: '[Kr] 5s² 4d⁹', actual: '[Kr] 5s¹ 4d¹⁰', reason: 'Filled 4d' },
  { element: 'Platinum (78)', predicted: '[Xe] 6s² 4f¹⁴ 5d⁸', actual: '[Xe] 6s¹ 4f¹⁴ 5d⁹', reason: 'Close 6s/5d energies' },
  { element: 'Gold (79)', predicted: '[Xe] 6s² 4f¹⁴ 5d⁹', actual: '[Xe] 6s¹ 4f¹⁴ 5d¹⁰', reason: 'Filled 5d' },
  { element: 'La, Ce, Gd, Ac, Th, Pa, U, Np, Cm', predicted: 'all electrons in f', actual: 'one or two electrons in d', reason: 'f and d nearly degenerate' },
  { element: 'Lawrencium (103)', predicted: '[Rn] 7s² 5f¹⁴ 6d¹', actual: '[Rn] 7s² 5f¹⁴ 7p¹', reason: 'Relativistic 7p stabilisation' },
];

export default function ElectronConfigurationPage() {
  return (
    <DetailPage subject="chemistry" item="electron-configuration">
      <ElectronConfigurationVisualizer />

      <ContentSection title="How electrons fill an atom">
        <Prose>
          <p>
            An <strong>electron configuration</strong> lists how an atom&apos;s electrons are spread over its subshells. Oxygen, with eight
            electrons, is 1s² 2s² 2p⁴: two in 1s, two in 2s and four in 2p. The superscripts always add up to the number of electrons, which
            for a neutral atom equals the atomic number Z.
          </p>
          <p>
            Three rules build the ground state. The <strong>Aufbau principle</strong> fills the lowest-energy subshell first, in the order
            1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p, 7s, 5f, 6d, 7p. The <strong>Pauli exclusion principle</strong> limits
            each orbital to two electrons of opposite spin. <strong>Hund&apos;s rule</strong> says electrons in a subshell first occupy separate
            orbitals with parallel spins, which is why nitrogen has three unpaired 2p electrons rather than one pair and one single.
          </p>
          <p>
            Notice that 4s fills before 3d. In a many-electron atom, s electrons penetrate close to the nucleus and feel more of its charge,
            so 4s ends up lower in energy than 3d while it is being filled. The ladder on the right of the visualizer shows this zig-zag
            order. Writing out the inner shells gets long, so chemists use <strong>noble-gas shorthand</strong>: iron is [Ar] 4s² 3d⁶, where
            [Ar] stands for argon&apos;s 18 core electrons.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={rules} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Capacity of subshells and shells">
            <Formula
              where={[
                { symbol: 'l', meaning: 'angular momentum quantum number (s = 0, p = 1, d = 2, f = 3)' },
                { symbol: 'n', meaning: 'principal quantum number (shell)' },
              ]}
            >
              orbitals per subshell = 2l + 1,&nbsp;&nbsp; electrons per subshell = 2(2l + 1),&nbsp;&nbsp; electrons per shell = 2n²
            </Formula>
          </Callout>
          <Callout tone="formula" title="Madelung (n + l) rule">
            <Formula>fill in order of increasing n + l;&nbsp; if n + l is equal, the smaller n fills first</Formula>
          </Callout>
          <Callout tone="formula" title="Unpaired electrons in a subshell">
            <Formula where={[{ symbol: 'k', meaning: 'electrons in the subshell' }, { symbol: 'm', meaning: 'number of orbitals, 2l + 1' }]}>
              unpaired = k if k ≤ m,&nbsp; otherwise 2m − k
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Exceptions to the Aufbau order" description="Measured ground states that differ from the Madelung prediction. The visualizer flags each one.">
        <DataTable
          columns={[
            { header: 'Element (Z)', cell: 'element' },
            { header: 'Madelung prediction', cell: 'predicted' },
            { header: 'Actual ground state', cell: 'actual' },
            { header: 'Main reason', cell: 'reason' },
          ]}
          rows={exceptions}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose an element with the dropdown, the Z slider or the Prev and Next buttons. Elements marked "exception" break the Aufbau order.',
            'In Ground state view, read the full configuration, the orbital box diagram and the noble-gas shorthand, valence and unpaired-electron counts.',
            'Switch to Build up electron by electron and press Next electron (or Play). The newest electron is drawn in amber, and the message explains which rule placed it.',
            'Watch the energy-level ladder: the dashed path shows the filling order, and each rung fills from left to right with spin-up arrows before any spin-down arrows.',
            'Pick Cr, Cu, Pd or Au and build to the end. One extra step shows electrons moving from the Madelung prediction into the real ground state.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception: 4s is always below 3d">
        4s fills before 3d, but that does not mean 4s electrons are the innermost. Once 3d holds electrons it drops below 4s, which is why
        transition metals lose their 4s electrons first when they form ions: Fe is [Ar] 4s² 3d⁶, but Fe²⁺ is [Ar] 3d⁶, not [Ar] 4s² 3d⁴.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Iron and its ions"
            question="Write the noble-gas configuration of Fe (Z = 26) and of Fe³⁺. How many unpaired electrons does each have?"
            solution={
              <>
                <p>Fe has 26 electrons. After [Ar] (18 electrons), 8 remain: 4s takes 2, then 3d takes 6. Fe = [Ar] 4s² 3d⁶.</p>
                <p>3d⁶ in five orbitals: five electrons go in singly (Hund), the sixth pairs. Unpaired = 2 × 5 − 6 = 4.</p>
                <p>Fe³⁺ loses three electrons, the two 4s electrons first and then one 3d electron: Fe³⁺ = [Ar] 3d⁵.</p>
                <p>3d⁵ puts one electron in each orbital: unpaired = 5.</p>
                <p className="font-semibold text-emerald-700">Fe: [Ar] 4s² 3d⁶ with 4 unpaired; Fe³⁺: [Ar] 3d⁵ with 5 unpaired</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Identify the element"
            question="An atom has the ground state [Kr] 5s² 4d¹⁰ 5p³. Which element is it, how many valence electrons does it have, and how many are unpaired? Then compare chromium's Madelung prediction with its real configuration: how many unpaired electrons does each have?"
            solution={
              <>
                <p>Electrons: 36 (Kr) + 2 + 10 + 3 = 51, so Z = 51, antimony (Sb).</p>
                <p>Valence electrons are those in the outer shell n = 5: 5s² 5p³ gives 2 + 3 = 5 (the filled 4d¹⁰ is not counted for a p-block element).</p>
                <p>5p³ puts one electron in each of the three 5p orbitals, so 3 unpaired.</p>
                <p>Chromium: Madelung predicts [Ar] 4s² 3d⁴ with 4 unpaired (all in 3d). Actual [Ar] 4s¹ 3d⁵ has 1 + 5 = 6 unpaired.</p>
                <p className="font-semibold text-emerald-700">Sb, 5 valence electrons, 3 unpaired; Cr: 4 unpaired predicted, 6 actual</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related visualizations">
        <RelatedItems
          subject="chemistry"
          current="electron-configuration"
          items={[
            { slug: 'periodic-trends', note: 'See how configurations explain the shape of the periodic table and its trends' },
            { slug: 'lewis-structures', note: 'Use valence electrons to draw bonds and lone pairs' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
