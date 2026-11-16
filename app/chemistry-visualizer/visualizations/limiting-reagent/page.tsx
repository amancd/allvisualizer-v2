import type { Metadata } from 'next';
import { Divide, Gauge, PackageCheck, Recycle } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import LimitingReagentVisualizer from './LimitingReagentVisualizer';

export const metadata: Metadata = {
  title: 'Limiting Reagent - Chemistry Visualizer | AllVisualizer',
  description:
    'Mix reactant molecules and watch them combine until one runs out. Find the limiting and excess reactant, theoretical yield and percent yield with the full mole calculation shown.',
  keywords: ['limiting reagent', 'limiting reactant', 'excess reactant', 'theoretical yield', 'percent yield', 'stoichiometry', 'mole ratio'],
};

const ideas = [
  {
    title: 'Limiting reagent',
    icon: Gauge,
    description: 'The reactant that is used up first. Once it is gone the reaction stops, so it alone decides how much product can form.',
  },
  {
    title: 'Excess reagent',
    icon: Recycle,
    description: 'Every other reactant. Some of it is left over at the end, unreacted, because there was nothing left for it to react with.',
  },
  {
    title: 'Divide by the coefficient',
    icon: Divide,
    description: 'Comparing raw moles is not enough. Divide each reactant’s moles by its coefficient to get how many “reaction sets” it can supply; the smallest wins.',
  },
  {
    title: 'Theoretical vs actual yield',
    icon: PackageCheck,
    description: 'The theoretical yield is the most product the limiting reagent allows. Real experiments recover less, and percent yield measures how close they got.',
  },
];

const reactions = [
  { equation: '2H₂ + O₂ → 2H₂O', masses: 'H₂ 2.016, O₂ 31.998, H₂O 18.015', ratio: '2 : 1 : 2' },
  { equation: 'N₂ + 3H₂ → 2NH₃', masses: 'N₂ 28.014, H₂ 2.016, NH₃ 17.031', ratio: '1 : 3 : 2' },
  { equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O', masses: 'CH₄ 16.043, O₂ 31.998, CO₂ 44.009, H₂O 18.015', ratio: '1 : 2 : 1 : 2' },
  { equation: '2Al + 3Cl₂ → 2AlCl₃', masses: 'Al 26.982, Cl₂ 70.900, AlCl₃ 133.332', ratio: '2 : 3 : 2' },
  { equation: '2Na + Cl₂ → 2NaCl', masses: 'Na 22.990, Cl₂ 70.900, NaCl 58.440', ratio: '2 : 1 : 2' },
];

export default function LimitingReagentPage() {
  return (
    <DetailPage subject="chemistry" item="limiting-reagent">
      <LimitingReagentVisualizer />

      <ContentSection title="Which reactant runs out first?">
        <Prose>
          <p>
            Think of making sandwiches with 2 slices of bread and 1 slice of cheese each. With 10 slices of bread and 3 slices of cheese
            you can make only 3 sandwiches: the cheese runs out first, and 4 slices of bread are left over. The cheese is the{' '}
            <strong>limiting reagent</strong> and the bread is in <strong>excess</strong>, even though you started with more bread.
          </p>
          <p>
            Chemical reactions work the same way. The balanced equation is the recipe: 2H₂ + O₂ → 2H₂O needs two hydrogen molecules for
            every oxygen molecule. Divide the amount of each reactant by its coefficient to see how many times the recipe could run on that
            reactant alone. The smallest number is how many times it actually runs.
          </p>
          <p>
            Counting molecules only works in the particle picture. In the lab you weigh reactants, so you first convert grams to moles with
            each molar mass. This is why a lighter reactant can still be in excess: 10 g of hydrogen is almost 5 mol, while 64 g of oxygen
            is only 2 mol.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Find the limiting reagent">
            <Formula
              where={[
                { symbol: 'nᵢ', meaning: 'moles of reactant i available (n = m / M)' },
                { symbol: 'aᵢ', meaning: 'coefficient of reactant i in the balanced equation' },
                { symbol: 'ξ', meaning: 'extent of reaction: how many times the equation runs, in mol' },
              ]}
            >
              ξ = min(nᵢ / aᵢ); the reactant giving the minimum is limiting
            </Formula>
          </Callout>
          <Callout tone="formula" title="Theoretical yield and excess left over">
            <Formula where={[{ symbol: 'bⱼ, Mⱼ', meaning: 'coefficient and molar mass of product j' }]}>
              n<sub>product</sub> = bⱼ · ξ,&nbsp;&nbsp; m<sub>product</sub> = bⱼ · ξ · Mⱼ,&nbsp;&nbsp; n<sub>left</sub> = nᵢ − aᵢ · ξ
            </Formula>
          </Callout>
          <Callout tone="formula" title="Percent yield">
            <Formula>percent yield = actual yield / theoretical yield × 100%</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Reactions in the visualizer">
        <DataTable
          columns={[
            { header: 'Balanced equation', cell: 'equation' },
            { header: 'Molar masses (g/mol)', cell: 'masses' },
            { header: 'Mole ratio', cell: 'ratio' },
          ]}
          rows={reactions}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose a reaction. The balanced equation is shown above the controls.',
            'In Particle picture mode, set how many molecules of each reactant you start with, then press React. Each reaction set is outlined in amber before it combines into products on the right.',
            'Use One reaction to go a single step at a time. When nothing more can react, the leftover molecules are outlined in blue and the limiting reactant card turns amber.',
            'Switch to Grams and moles to enter real amounts in grams or moles. The table divides each reactant’s moles by its coefficient and highlights the smallest.',
            'Read the step-by-step calculation, then type an actual yield to get the percent yield for any product.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common mistake: the smaller amount is not always limiting">
        The limiting reagent is not simply the reactant with the smaller mass, or even the smaller number of moles. In N₂ + 3H₂ → 2NH₃,
        1.0 mol of N₂ and 2.4 mol of H₂ makes H₂ limiting, because 2.4 ÷ 3 = 0.8 is smaller than 1.0 ÷ 1 = 1.0. Always divide by the
        coefficients.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Making ammonia"
            question="14.0 g of N₂ reacts with 4.00 g of H₂: N₂ + 3H₂ → 2NH₃. Which reactant is limiting, what mass of NH₃ can form, and how much of the excess reactant is left? (N₂ 28.014, H₂ 2.016, NH₃ 17.031 g/mol)"
            solution={
              <>
                <p>N₂: 14.0 ÷ 28.014 = 0.4998 mol; ÷ 1 = 0.4998</p>
                <p>H₂: 4.00 ÷ 2.016 = 1.984 mol; ÷ 3 = 0.6614</p>
                <p>0.4998 &lt; 0.6614, so N₂ is limiting and ξ = 0.4998 mol</p>
                <p>NH₃: 2 × 0.4998 = 0.9995 mol × 17.031 g/mol = 17.02 g</p>
                <p>H₂ used: 3 × 0.4998 = 1.499 mol × 2.016 = 3.022 g; left: 4.00 − 3.022 = 0.978 g</p>
                <p className="font-semibold text-emerald-700">N₂ is limiting; 17.0 g NH₃ forms; 0.978 g H₂ is left over</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Percent yield"
            question="5.40 g of aluminium reacts with 15.0 g of chlorine gas: 2Al + 3Cl₂ → 2AlCl₃. The student collects 15.2 g of AlCl₃. What is the percent yield? (Al 26.982, Cl₂ 70.90, AlCl₃ 133.332 g/mol)"
            solution={
              <>
                <p>Al: 5.40 ÷ 26.982 = 0.2001 mol; ÷ 2 = 0.1001</p>
                <p>Cl₂: 15.0 ÷ 70.90 = 0.2116 mol; ÷ 3 = 0.07052</p>
                <p>Cl₂ is limiting, ξ = 0.07052 mol</p>
                <p>Theoretical AlCl₃: 2 × 0.07052 = 0.1410 mol × 133.332 g/mol = 18.81 g</p>
                <p>Percent yield = 15.2 ÷ 18.81 × 100% = 80.8%</p>
                <p className="font-semibold text-emerald-700">Percent yield ≈ 80.8% (Cl₂ limiting, 1.59 g Al left over)</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related visualizations">
        <RelatedItems
          subject="chemistry"
          current="limiting-reagent"
          items={[
            { slug: 'balancing-equations', note: 'Get the coefficients the limiting reagent calculation depends on' },
            { slug: 'mole-concept', note: 'Practise converting grams to moles with molar masses' },
            { slug: 'collision-theory', note: 'See how reacting molecules actually meet' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
