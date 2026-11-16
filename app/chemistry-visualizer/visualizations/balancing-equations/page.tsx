import type { Metadata } from 'next';
import { Atom, Hash, Scale, Sigma } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import BalancingEquationsVisualizer from './BalancingEquationsVisualizer';

export const metadata: Metadata = {
  title: 'Balancing Equations - Chemistry Visualizer | AllVisualizer',
  description:
    'Balance chemical equations interactively: adjust coefficients, watch per-element atom counts and molecule pictures on each side, and see an exact solver find the smallest whole-number coefficients.',
  keywords: ['balancing chemical equations', 'coefficients', 'conservation of mass', 'atom count', 'stoichiometry', 'chemistry', 'combustion'],
};

const ideas = [
  {
    title: 'Atoms are conserved',
    icon: Atom,
    description: 'A reaction only rearranges atoms into new molecules. Every atom on the left must reappear on the right, so each element has the same count on both sides.',
  },
  {
    title: 'Coefficients, not subscripts',
    icon: Hash,
    description: 'A coefficient counts whole molecules (2H₂O is two water molecules). Subscripts define which substance it is; changing them changes the chemical, not the amount.',
  },
  {
    title: 'Mass follows automatically',
    icon: Scale,
    description: 'Each atom keeps its mass, so once the atoms balance, the total mass of reactants equals the total mass of products (Lavoisier’s law).',
  },
  {
    title: 'It is a linear system',
    icon: Sigma,
    description: 'One equation per element, one unknown per species. A single reaction has a one-dimensional family of solutions; the answer is the one with the smallest whole numbers.',
  },
];

const examples = [
  { reaction: 'H₂ + O₂ → H₂O', balanced: '2H₂ + O₂ → 2H₂O', type: 'Synthesis' },
  { reaction: 'N₂ + H₂ → NH₃', balanced: 'N₂ + 3H₂ → 2NH₃', type: 'Synthesis (Haber process)' },
  { reaction: 'CH₄ + O₂ → CO₂ + H₂O', balanced: 'CH₄ + 2O₂ → CO₂ + 2H₂O', type: 'Combustion' },
  { reaction: 'C₃H₈ + O₂ → CO₂ + H₂O', balanced: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O', type: 'Combustion' },
  { reaction: 'Fe + O₂ → Fe₂O₃', balanced: '4Fe + 3O₂ → 2Fe₂O₃', type: 'Synthesis (rusting)' },
  { reaction: 'Al + HCl → AlCl₃ + H₂', balanced: '2Al + 6HCl → 2AlCl₃ + 3H₂', type: 'Single displacement' },
  { reaction: 'KClO₃ → KCl + O₂', balanced: '2KClO₃ → 2KCl + 3O₂', type: 'Decomposition' },
  { reaction: 'CO₂ + H₂O → C₆H₁₂O₆ + O₂', balanced: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', type: 'Photosynthesis' },
  { reaction: 'Ca(OH)₂ + H₃PO₄ → Ca₃(PO₄)₂ + H₂O', balanced: '3Ca(OH)₂ + 2H₃PO₄ → Ca₃(PO₄)₂ + 6H₂O', type: 'Neutralisation' },
];

export default function BalancingEquationsPage() {
  return (
    <DetailPage subject="chemistry" item="balancing-equations">
      <BalancingEquationsVisualizer />

      <ContentSection title="Why equations must balance">
        <Prose>
          <p>
            A chemical equation is a bookkeeping statement. In a reaction, bonds break and new bonds form, but the atoms themselves are
            neither created nor destroyed. If four hydrogen atoms go in, four hydrogen atoms must come out, just arranged into different
            molecules. An equation is <strong>balanced</strong> when every element has the same number of atoms on the reactant side as
            on the product side.
          </p>
          <p>
            You balance an equation by choosing <strong>coefficients</strong>, the numbers in front of each formula. The coefficient
            multiplies every atom in that formula: 3H₂O contains 6 hydrogen atoms and 3 oxygen atoms. You never change a subscript,
            because H₂O₂ is hydrogen peroxide, not &quot;more water&quot;.
          </p>
          <p>
            By convention the coefficients are the smallest whole numbers that work. 4H₂ + 2O₂ → 4H₂O is balanced, but every
            coefficient shares a factor of 2, so it is written 2H₂ + O₂ → 2H₂O. The balanced coefficients are also the{' '}
            <strong>mole ratios</strong> you use in every later stoichiometry calculation.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Atom balance, one equation per element">
            <Formula
              where={[
                { symbol: 'νᵢ', meaning: 'coefficient of species i' },
                { symbol: 'nₑ,ᵢ', meaning: 'number of atoms of element e in one formula unit of species i' },
              ]}
            >
              Σ<sub>reactants</sub> νᵢ · nₑ,ᵢ = Σ<sub>products</sub> νⱼ · nₑ,ⱼ&nbsp;&nbsp; for every element e
            </Formula>
          </Callout>
          <Callout tone="formula" title="Conservation of mass">
            <Formula where={[{ symbol: 'Mᵢ', meaning: 'molar mass of species i (g/mol)' }]}>
              Σ<sub>reactants</sub> νᵢ · Mᵢ = Σ<sub>products</sub> νⱼ · Mⱼ
            </Formula>
          </Callout>
          <Callout tone="formula" title="Example: methane combustion">
            <Formula>
              a CH₄ + b O₂ → c CO₂ + d H₂O&nbsp;&nbsp;⇒&nbsp;&nbsp; C: a = c,&nbsp; H: 4a = 2d,&nbsp; O: 2b = 2c + d&nbsp;&nbsp;⇒&nbsp;&nbsp; a = 1, b = 2, c = 1, d = 2
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Balanced presets">
        <DataTable
          columns={[
            { header: 'Unbalanced', cell: 'reaction' },
            { header: 'Balanced', cell: 'balanced' },
            { header: 'Reaction type', cell: 'type' },
          ]}
          rows={examples}
        />
      </ContentSection>

      <ContentSection title="A reliable method by hand">
        <Prose>
          <ol>
            <li>Write the correct formula for every reactant and product. Never change these again.</li>
            <li>Balance elements that appear in only one species on each side first (usually metals, then carbon).</li>
            <li>Balance hydrogen next, then oxygen last, because oxygen often appears in several species (O₂, CO₂ and H₂O).</li>
            <li>Treat a polyatomic ion that stays intact, like SO₄ or PO₄, as a single unit.</li>
            <li>If you end up needing a half (for example 7/2 O₂), multiply every coefficient by 2.</li>
            <li>Finish by counting every element on both sides, and divide out any common factor.</li>
          </ol>
        </Prose>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick a preset reaction, or type your own equation using -> or = for the arrow (parentheses, square brackets and hydrate dots such as CuSO4·5H2O are understood).',
            'Use the + and − buttons above each formula to change its coefficient. The equation, the atom-count bars and the molecule pictures update immediately.',
            'Compare the blue (reactant) and violet (product) bars for each element. A green tick means that element is balanced.',
            'When every element balances, the banner turns green and shows that the mass of reactants equals the mass of products.',
            'Stuck? Press Show solution to see the system of element equations and the smallest whole-number coefficients that solve it.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common mistake: changing subscripts">
        To balance H₂ + O₂ → H₂O it is tempting to write H₂O₂ on the right, since that has two oxygens. But H₂O₂ is hydrogen peroxide, a
        different substance. Only coefficients may change: 2H₂ + O₂ → 2H₂O.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Butane combustion"
            question="Balance the combustion of butane: C₄H₁₀ + O₂ → CO₂ + H₂O."
            solution={
              <>
                <p>Carbon: 4 C on the left, so 4CO₂ on the right.</p>
                <p>Hydrogen: 10 H on the left, so 5H₂O on the right.</p>
                <p>Oxygen on the right: 4 × 2 + 5 × 1 = 13 O, so 13/2 O₂ on the left.</p>
                <p>C₄H₁₀ + 13/2 O₂ → 4CO₂ + 5H₂O; multiply everything by 2 to clear the fraction.</p>
                <p>Check: C 8 = 8, H 20 = 20, O 26 = 16 + 10.</p>
                <p className="font-semibold text-emerald-700">2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Blast furnace"
            question="In a blast furnace, iron(III) oxide is reduced by carbon monoxide: Fe₂O₃ + CO → Fe + CO₂. Balance it, then check that mass is conserved using Fe = 55.845, C = 12.011 and O = 15.999 g/mol."
            solution={
              <>
                <p>Iron: 2 Fe on the left, so 2Fe on the right.</p>
                <p>Each CO takes one O to become CO₂, and Fe₂O₃ gives up 3 O, so 3CO → 3CO₂.</p>
                <p>Check: Fe 2 = 2, C 3 = 3, O 3 + 3 = 6 = 3 × 2.</p>
                <p>Left: 159.687 + 3 × 28.010 = 159.687 + 84.030 = 243.717 g</p>
                <p>Right: 2 × 55.845 + 3 × 44.009 = 111.690 + 132.027 = 243.717 g</p>
                <p className="font-semibold text-emerald-700">Fe₂O₃ + 3CO → 2Fe + 3CO₂ (243.717 g on each side)</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related visualizations">
        <RelatedItems
          subject="chemistry"
          current="balancing-equations"
          items={[
            { slug: 'mole-concept', note: 'Turn balanced coefficients into grams with molar masses' },
            { slug: 'limiting-reagent', note: 'Use the mole ratios to find which reactant runs out first' },
            { slug: 'lewis-structures', note: 'See how the atoms in each molecule are bonded' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
