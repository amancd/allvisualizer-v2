import type { Metadata } from 'next';
import { Calculator, CircleDot, Link2, Repeat } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import LewisStructuresVisualizer from './LewisStructuresVisualizer';

export const metadata: Metadata = {
  title: 'Lewis Structures - Chemistry Visualizer | AllVisualizer',
  description:
    'Build Lewis dot structures step by step for molecules and ions like H₂O, CO₂, NO₃⁻ and XeF₄: count valence electrons, place bonds and lone pairs, form multiple bonds and check formal charges and resonance.',
  keywords: ['Lewis structure', 'Lewis dot structure', 'valence electrons', 'octet rule', 'lone pairs', 'formal charge', 'resonance', 'expanded octet', 'chemistry'],
};

const ideas = [
  {
    title: 'Valence electrons',
    icon: CircleDot,
    description: 'Only the outer-shell electrons take part in bonding. For main-group elements it is 1 or 2 in groups 1 and 2, and the group number minus 10 in groups 13 to 18.',
  },
  {
    title: 'Bonding pairs and lone pairs',
    icon: Link2,
    description: 'A line is a shared pair of electrons; a double bond shares two pairs, a triple bond three. Pairs that belong to only one atom are lone pairs, drawn as dots.',
  },
  {
    title: 'Formal charge',
    icon: Calculator,
    description: 'A bookkeeping charge that assumes bonding electrons are split evenly. The best structure keeps formal charges small and puts any negative charge on the more electronegative atom.',
  },
  {
    title: 'Resonance',
    icon: Repeat,
    description: 'When a double bond could sit in several equivalent places, no single drawing is correct. The real molecule is a blend (hybrid) of all of them.',
  },
];

const valenceTable = [
  { element: 'H', group: '1', valence: '1', usual: '1 bond, no lone pairs (duet)' },
  { element: 'B', group: '13', valence: '3', usual: '3 bonds, often only 6 electrons' },
  { element: 'C', group: '14', valence: '4', usual: '4 bonds, no lone pairs' },
  { element: 'N', group: '15', valence: '5', usual: '3 bonds + 1 lone pair' },
  { element: 'O', group: '16', valence: '6', usual: '2 bonds + 2 lone pairs' },
  { element: 'F, Cl, Br, I', group: '17', valence: '7', usual: '1 bond + 3 lone pairs' },
  { element: 'P, S, Cl, Xe (as central atoms)', group: '15–18', valence: '5–8', usual: 'can exceed 8 electrons (expanded octet)' },
];

export default function LewisStructuresPage() {
  return (
    <DetailPage subject="chemistry" item="lewis-structures">
      <LewisStructuresVisualizer />

      <ContentSection title="What a Lewis structure shows">
        <Prose>
          <p>
            A <strong>Lewis structure</strong> is a map of where a molecule&apos;s valence electrons are: which atoms share them in bonds and which atoms keep
            them as lone pairs. It is built on the <strong>octet rule</strong>: main-group atoms are most stable with eight electrons around them (hydrogen
            with two).
          </p>
          <p>
            The method in the visualizer works for almost every molecule with a single central atom. Count the electrons you have, connect the skeleton
            with single bonds, fill the outer atoms first, put leftovers on the central atom and, if the central atom is still short of an octet, turn
            outer lone pairs into double or triple bonds. Finally, check formal charges to confirm the structure is sensible.
          </p>
          <p>
            There are well-known exceptions. Boron is often happy with six electrons (BF₃). Elements from period 3 down, such as P, S, Cl and Xe, can
            hold more than eight (PCl₅, SF₆, XeF₄). And molecules with an odd number of electrons, like NO, must leave one atom with an unpaired electron.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Total valence electrons">
            <Formula where={[{ symbol: 'V', meaning: 'valence electrons of each atom' }, { symbol: 'q', meaning: 'overall charge of the ion (−1 for NO₃⁻, +1 for NH₄⁺)' }]}>
              total = Σ V − q
            </Formula>
          </Callout>
          <Callout tone="formula" title="Formal charge">
            <Formula
              where={[
                { symbol: 'V', meaning: 'valence electrons of the free atom' },
                { symbol: 'N', meaning: 'nonbonding electrons on the atom (2 per lone pair)' },
                { symbol: 'B', meaning: 'bonding electrons around the atom (2 per bond line)' },
              ]}
            >
              FC = V − N − B/2
            </Formula>
          </Callout>
          <Callout tone="formula" title="Counting bonds (N − A = S)">
            <Formula
              where={[
                { symbol: 'N', meaning: 'electrons needed: 8 per atom, 2 per H' },
                { symbol: 'A', meaning: 'electrons available (total valence electrons)' },
                { symbol: 'S', meaning: 'electrons shared; the number of bonds is S/2' },
              ]}
            >
              S = N − A,&nbsp;&nbsp; bonds = S / 2
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Valence electrons and typical bonding">
        <DataTable
          columns={[
            { header: 'Element', cell: 'element' },
            { header: 'Group', cell: 'group', numeric: true },
            { header: 'Valence e⁻', cell: 'valence', numeric: true },
            { header: 'Usual pattern (formal charge 0)', cell: 'usual' },
          ]}
          rows={valenceTable}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose a molecule or ion from the list. The drawing starts with the bare atoms and their valence electron counts.',
            'Press Next step (or Play) to run the algorithm. Anything added or changed in the current step is drawn in amber.',
            'Watch the electron pool: grey dots are already placed, amber dots are still to place. It should reach zero by the end.',
            'Read the bookkeeping table. Around shows how many electrons each atom has against its target (8, or 2 for H), and FC is the formal charge.',
            'On the last step, formal charges appear on the drawing. For SO₂, O₃, NO₃⁻ and CO₃²⁻, switch between the resonance forms.',
            'Compare BF₃ (incomplete octet) with PCl₅, SF₆ and XeF₄ (expanded octets), and CO with N₂ (same electron count, different formal charges).',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception: resonance is not flipping">
        Resonance forms are not different molecules that switch back and forth. In nitrate all three N–O bonds are identical, each with a bond order of 4/3,
        and they are shorter than a single bond but longer than a double bond. The separate drawings exist only because one Lewis structure cannot show
        electrons spread over several bonds at once.
      </Callout>

      <Callout tone="note" title="Limits of Lewis structures">
        Lewis structures show connectivity, not shape: water is drawn flat but is actually bent at 104.5°. They also predict O₂ to have all its electrons
        paired, yet O₂ is paramagnetic (it has two unpaired electrons), which needs molecular orbital theory to explain. For SO₂, some textbooks prefer
        an expanded-octet structure with two S=O double bonds, which gives every atom a formal charge of 0; the octet structure shown here is the other
        common convention.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: The nitrite ion"
            question="Draw the Lewis structure of the nitrite ion, NO₂⁻. Give the formal charge on each atom, the number of resonance forms and the average N–O bond order."
            solution={
              <>
                <p>Valence electrons: N 5 + 2 × O 6 + 1 (charge) = 18</p>
                <p>Two N–O single bonds use 4 → 14 left</p>
                <p>Each O gets 3 lone pairs (6 e⁻ each) → 12 used, 2 left</p>
                <p>The last 2 go on N as a lone pair; N now has 2 + 4 = 6 electrons</p>
                <p>Turn one O lone pair into a bond: O=N–O, N has 8</p>
                <p>FC(N) = 5 − 2 − 3 = 0</p>
                <p>FC(O, double) = 6 − 4 − 2 = 0;&nbsp; FC(O, single) = 6 − 6 − 1 = −1</p>
                <p>Sum = −1 ✓ (matches the charge)</p>
                <p className="font-semibold text-emerald-700">2 resonance forms; average N–O bond order = (2 + 1)/2 = 1.5</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Choosing a skeleton with formal charges"
            question="Nitrous oxide, N₂O, has 16 valence electrons. Compare the skeletons N–N–O and N–O–N using formal charges. Which skeleton is correct, and which resonance form of it is the best single picture?"
            solution={
              <>
                <p>Total: 2 × 5 + 6 = 16 electrons</p>
                <p>N–O–N, best octet form N=O=N:</p>
                <p>&nbsp;&nbsp;FC(N) = 5 − 4 − 2 = −1 (each);&nbsp; FC(O) = 6 − 0 − 4 = +2</p>
                <p>N–N–O, form N=N=O:</p>
                <p>&nbsp;&nbsp;FC = −1 (end N), +1 (middle N), 0 (O)</p>
                <p>N–N–O, form N≡N–O:</p>
                <p>&nbsp;&nbsp;FC(end N) = 5 − 2 − 3 = 0;&nbsp; FC(middle N) = 5 − 0 − 4 = +1;&nbsp; FC(O) = 6 − 6 − 1 = −1</p>
                <p>N–O–N puts +2 on O, the most electronegative atom: rejected</p>
                <p className="font-semibold text-emerald-700">
                  Skeleton N–N–O. N≡N–O is the best single form (its −1 sits on O, the more electronegative atom); N=N=O is a second resonance form.
                </p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="chemistry"
          current="lewis-structures"
          items={[
            { slug: 'vsepr-geometry', note: 'Turn a Lewis structure into a 3D shape' },
            { slug: 'bond-polarity', note: 'Why some shared electrons are not shared equally' },
            { slug: 'electron-configuration', note: 'Where the valence electrons come from' },
            { slug: 'periodic-trends', note: 'Electronegativity across the periodic table' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
