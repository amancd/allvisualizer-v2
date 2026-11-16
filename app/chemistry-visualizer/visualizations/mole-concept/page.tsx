import type { Metadata } from 'next';
import { Boxes, Hash, PieChart, Weight } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import MoleConceptVisualizer from './MoleConceptVisualizer';

export const metadata: Metadata = {
  title: 'The Mole Concept - Chemistry Visualizer | AllVisualizer',
  description:
    "Calculate molar mass and percent composition for any formula, convert between grams, moles, particles and atoms with the conversion chain shown, and get a feel for the size of Avogadro's number.",
  keywords: ['mole concept', "Avogadro's number", 'molar mass', 'percent composition', 'grams to moles', 'moles to particles', 'stoichiometry'],
};

const ideas = [
  {
    title: 'A counting unit',
    icon: Hash,
    description: 'A mole is a number, like a dozen, only far larger: exactly 6.02214076 × 10²³ particles. Chemists use it because atoms are too small to count one by one.',
  },
  {
    title: 'Molar mass',
    icon: Weight,
    description: 'The mass of one mole of a substance in grams equals its formula mass in atomic mass units. Water is 18.015 u per molecule, so 18.015 g per mole.',
  },
  {
    title: 'Particles and atoms',
    icon: Boxes,
    description: 'One mole of H₂O contains 6.022 × 10²³ molecules, but twice as many hydrogen atoms. The subscripts tell you how many atoms of each element are in each particle.',
  },
  {
    title: 'Percent composition',
    icon: PieChart,
    description: 'The share of a compound’s mass that comes from each element. Water is 11.19% hydrogen and 88.81% oxygen by mass, even though two thirds of its atoms are hydrogen.',
  },
];

const molarMasses = [
  { name: 'Water', formula: 'H₂O', mass: '18.015' },
  { name: 'Carbon dioxide', formula: 'CO₂', mass: '44.009' },
  { name: 'Sodium chloride', formula: 'NaCl', mass: '58.440' },
  { name: 'Ammonia', formula: 'NH₃', mass: '17.031' },
  { name: 'Ethanol', formula: 'C₂H₅OH', mass: '46.069' },
  { name: 'Sulfuric acid', formula: 'H₂SO₄', mass: '98.072' },
  { name: 'Calcium carbonate', formula: 'CaCO₃', mass: '100.086' },
  { name: 'Glucose', formula: 'C₆H₁₂O₆', mass: '180.156' },
  { name: 'Caffeine', formula: 'C₈H₁₀N₄O₂', mass: '194.194' },
  { name: 'Copper(II) sulfate pentahydrate', formula: 'CuSO₄·5H₂O', mass: '249.677' },
];

export default function MoleConceptPage() {
  return (
    <DetailPage subject="chemistry" item="mole-concept">
      <MoleConceptVisualizer />

      <ContentSection title="What a mole is">
        <Prose>
          <p>
            Atoms and molecules are so small that any amount you can weigh contains an enormous number of them. The{' '}
            <strong>mole</strong> (symbol mol) groups them into a convenient package: one mole is exactly{' '}
            <strong>6.02214076 × 10²³</strong> particles. This number is the <strong>Avogadro constant</strong>, N<sub>A</sub>. Since
            2019 it has been fixed by definition in the SI.
          </p>
          <p>
            The value is chosen so that the mass of one mole in grams matches the mass of one particle in atomic mass units (u). A
            carbon-12 atom has a mass of 12 u, and a mole of carbon-12 has a mass of 12 g (to within about one part in a billion). So the
            atomic masses on the periodic table double as <strong>molar masses</strong> in g/mol, and the molar mass of a compound is the
            sum over its formula.
          </p>
          <p>
            Moles are the hub of almost every chemistry calculation. You cannot count particles and balances do not measure moles, so you
            go from grams to moles with the molar mass, then from moles to particles with N<sub>A</sub>, and from particles to atoms with
            the subscripts in the formula.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Moles from mass">
            <Formula
              where={[
                { symbol: 'n', meaning: 'amount of substance (mol)' },
                { symbol: 'm', meaning: 'mass (g)' },
                { symbol: 'M', meaning: 'molar mass (g/mol)' },
              ]}
            >
              n = m / M
            </Formula>
          </Callout>
          <Callout tone="formula" title="Particles from moles">
            <Formula where={[{ symbol: 'N', meaning: 'number of particles' }, { symbol: <>N<sub>A</sub></>, meaning: '6.02214076 × 10²³ mol⁻¹' }]}>
              N = n × N<sub>A</sub>
            </Formula>
          </Callout>
          <Callout tone="formula" title="Molar mass and percent composition">
            <Formula where={[{ symbol: 'kₑ', meaning: 'number of atoms of element e in the formula' }, { symbol: 'Aₑ', meaning: 'atomic mass of element e (g/mol)' }]}>
              M = Σ kₑ · Aₑ,&nbsp;&nbsp; mass % of e = kₑ · Aₑ / M × 100%
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Common molar masses">
        <DataTable
          columns={[
            { header: 'Substance', cell: 'name' },
            { header: 'Formula', cell: 'formula' },
            { header: 'M (g/mol)', cell: 'mass', numeric: true },
          ]}
          rows={molarMasses}
          caption="Calculated from IUPAC standard atomic weights (H 1.008, C 12.011, N 14.007, O 15.999, Na 22.990, S 32.06, Cl 35.45, Ca 40.078, Cu 63.546)."
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick a compound or type any formula. Parentheses (Ca3(PO4)2), square brackets and hydrates (CuSO4·5H2O or CuSO4.5H2O) are supported.',
            'Read the molar mass breakdown: each element’s atom count times its atomic mass, the subtotal, and its share of the total mass in the donut chart.',
            'In the conversion chain, type a value into any box: grams, moles, particles or atoms of a particular element. Every other box updates through the factors shown on the arrows.',
            'Watch the blue marker on the logarithmic ruler to compare your number of particles with people on Earth, cells in your body and one mole.',
            'Try 18.015 g of water and check that it gives exactly 1 mol and 6.022 × 10²³ molecules.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common mix-up: molecules vs atoms">
        One mole of O₂ is 6.022 × 10²³ <em>molecules</em> but 1.204 × 10²⁴ oxygen <em>atoms</em>, and its mass is 31.998 g, not 15.999 g.
        Always ask whether a question counts molecules (or formula units) or atoms of an element, and multiply by the subscript when you
        need atoms.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Grams to molecules"
            question="How many CO₂ molecules, and how many oxygen atoms, are in 25.0 g of carbon dioxide? (C = 12.011, O = 15.999 g/mol)"
            solution={
              <>
                <p>M(CO₂) = 12.011 + 2 × 15.999 = 44.009 g/mol</p>
                <p>n = 25.0 g ÷ 44.009 g/mol = 0.5681 mol</p>
                <p>N = 0.5681 mol × 6.022 × 10²³ /mol = 3.421 × 10²³ molecules</p>
                <p>Each molecule has 2 O atoms: 2 × 3.421 × 10²³ = 6.842 × 10²³ O atoms</p>
                <p className="font-semibold text-emerald-700">3.42 × 10²³ CO₂ molecules and 6.84 × 10²³ O atoms</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Glucose"
            question="What is the mass percent of carbon in glucose, C₆H₁₂O₆? What mass of glucose contains 1.00 × 10²⁴ molecules? (H = 1.008, C = 12.011, O = 15.999 g/mol)"
            solution={
              <>
                <p>M = 6 × 12.011 + 12 × 1.008 + 6 × 15.999 = 72.066 + 12.096 + 95.994 = 180.156 g/mol</p>
                <p>Carbon: 72.066 ÷ 180.156 × 100% = 40.00%</p>
                <p>n = 1.00 × 10²⁴ ÷ 6.022 × 10²³ /mol = 1.661 mol</p>
                <p>m = 1.661 mol × 180.156 g/mol = 299.2 g</p>
                <p className="font-semibold text-emerald-700">40.0% carbon by mass; about 299 g of glucose</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related visualizations">
        <RelatedItems
          subject="chemistry"
          current="mole-concept"
          items={[
            { slug: 'balancing-equations', note: 'Get the mole ratios from a balanced equation' },
            { slug: 'limiting-reagent', note: 'Use moles to find which reactant runs out first' },
            { slug: 'periodic-trends', note: 'See where the atomic masses come from on the periodic table' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
