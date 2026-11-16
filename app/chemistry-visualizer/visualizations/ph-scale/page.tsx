import type { Metadata } from 'next';
import { Droplet, Droplets, FlaskConical, Scale } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import PhScaleVisualizer from './PhScaleVisualizer';

export const metadata: Metadata = {
  title: 'pH Scale - Chemistry Visualizer | AllVisualizer',
  description:
    'Compute the exact pH, pOH, [H₃O⁺], [OH⁻] and percent ionization of strong and weak acids and bases at any concentration, and compare with everyday substances on the pH scale.',
  keywords: ['pH scale', 'pOH', 'strong acid', 'weak acid', 'Ka', 'Kb', 'percent ionization', 'autoionization of water', 'Kw'],
};

const ideas = [
  {
    title: 'A logarithmic scale',
    icon: Scale,
    description: 'pH = −log[H₃O⁺]. Each step of one pH unit is a tenfold change in hydronium concentration, so pH 3 is 1000 times more acidic than pH 6.',
  },
  {
    title: 'Water ionizes too',
    icon: Droplet,
    description: 'Pure water contains 1.0 × 10⁻⁷ M each of H₃O⁺ and OH⁻ at 25 °C. Their product Kw = 1.0 × 10⁻¹⁴ holds in every aqueous solution.',
  },
  {
    title: 'Strong means fully ionized',
    icon: FlaskConical,
    description: 'HCl, HNO₃, NaOH and KOH ionize completely. Strength is about how much ionizes, not about how concentrated the solution is.',
  },
  {
    title: 'Weak means partly ionized',
    icon: Droplets,
    description: 'Acetic acid and ammonia set up an equilibrium. Ka or Kb tells you how far it goes, and the percent ionized rises as the solution is diluted.',
  },
];

const constants = [
  { name: 'Acetic acid, CH₃COOH', k: 'Ka = 1.8 × 10⁻⁵', pk: '4.74' },
  { name: 'Formic acid, HCOOH', k: 'Ka = 1.8 × 10⁻⁴', pk: '3.74' },
  { name: 'Hydrofluoric acid, HF', k: 'Ka = 6.8 × 10⁻⁴', pk: '3.17' },
  { name: 'Hypochlorous acid, HOCl', k: 'Ka = 3.0 × 10⁻⁸', pk: '7.52' },
  { name: 'Hydrocyanic acid, HCN', k: 'Ka = 4.9 × 10⁻¹⁰', pk: '9.31' },
  { name: 'Ammonia, NH₃', k: 'Kb = 1.8 × 10⁻⁵', pk: '4.74 (pKb)' },
  { name: 'Methylamine, CH₃NH₂', k: 'Kb = 4.4 × 10⁻⁴', pk: '3.36 (pKb)' },
  { name: 'Pyridine, C₅H₅N', k: 'Kb = 1.7 × 10⁻⁹', pk: '8.77 (pKb)' },
];

export default function PhScalePage() {
  return (
    <DetailPage subject="chemistry" item="ph-scale">
      <PhScaleVisualizer />

      <ContentSection title="What pH measures">
        <Prose>
          <p>
            Acidity in water comes from hydronium ions, H₃O⁺ (often written H⁺). Their concentration ranges over many powers of ten, from
            about 1 M in strong acid to 10⁻¹⁴ M in strong base, so chemists use a logarithm: <strong>pH = −log[H₃O⁺]</strong>. Below 7 is
            acidic, 7 is neutral and above 7 is basic, at 25 °C.
          </p>
          <p>
            A <strong>strong acid</strong> gives up all of its protons, so 0.010 M HCl has [H₃O⁺] = 0.010 M and pH 2. A <strong>weak acid</strong>{' '}
            only partly ionizes: HA + H₂O ⇌ H₃O⁺ + A⁻, with the extent set by Ka. Bases work the same way with OH⁻, pOH and Kb.
          </p>
          <p>
            The visualizer does not use the usual shortcuts. It solves the full <strong>charge balance</strong>, which includes the H₃O⁺ and
            OH⁻ that water makes by itself. That is why a very dilute acid approaches pH 7 from below instead of crossing into basic values,
            and why a weak acid at low concentration is almost completely ionized.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="pH, pOH and water">
            <Formula where={[{ symbol: 'Kw', meaning: 'ion product of water, 1.0 × 10⁻¹⁴ at 25 °C' }]}>
              pH = −log[H₃O⁺],&nbsp; pOH = −log[OH⁻],&nbsp; [H₃O⁺][OH⁻] = Kw,&nbsp; pH + pOH = 14.00
            </Formula>
          </Callout>
          <Callout tone="formula" title="Weak acid equilibrium">
            <Formula where={[{ symbol: 'C', meaning: 'total (analytical) acid concentration' }]}>
              Ka = [H₃O⁺][A⁻] / [HA];&nbsp; if x ≪ C: [H₃O⁺] ≈ √(Ka × C)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Exact charge balance (what the visualizer solves)">
            <Formula
              where={[
                { symbol: '[A⁻]', meaning: 'C × Ka / (Ka + [H₃O⁺])' },
                { symbol: '[BH⁺]', meaning: 'C × [H₃O⁺] / ([H₃O⁺] + Kw/Kb)' },
              ]}
            >
              weak acid: [H₃O⁺] = [A⁻] + Kw/[H₃O⁺];&nbsp; weak base: [H₃O⁺] + [BH⁺] = Kw/[H₃O⁺]
            </Formula>
          </Callout>
          <Callout tone="formula" title="Percent ionization">
            <Formula>% ionized = [A⁻] / C × 100</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Weak acids and bases in the visualizer">
        <DataTable
          caption="Values at 25 °C"
          columns={[
            { header: 'Compound', cell: 'name' },
            { header: 'Constant', cell: 'k', numeric: true },
            { header: 'pKa or pKb', cell: 'pk', numeric: true },
          ]}
          rows={constants}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose strong acid, weak acid, strong base or weak base, then pick a compound.',
            'Drag the concentration slider. It is logarithmic, from 10⁻⁸ M to 1 M, and the marker under the pH bar moves as you go.',
            'For a weak acid or base, drag the Ka (or Kb) slider to see how strength changes the pH at a fixed concentration.',
            'Watch the beaker: each pair of separate ions is one ionized unit. A strong acid splits completely; a weak acid keeps most of its molecules intact.',
            'Compare the exact pH with the simple estimate in the side panel. Try 10⁻⁸ M HCl, or very dilute acetic acid, to see where the shortcut fails.',
            'Hover over (or tab to) an everyday substance to find it on the scale.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception">
        Strong and concentrated are different ideas. 10⁻⁵ M HCl is strong but very dilute (pH 5.00), while 1 M acetic acid is weak but
        concentrated (pH 2.37). And diluting an acid never makes it basic: 10⁻⁸ M HCl has pH 6.98, not 8, because water itself supplies
        about 10⁻⁷ M H₃O⁺.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Vinegar-strength acetic acid"
            question="Find the pH and percent ionization of 0.10 M acetic acid (Ka = 1.8 × 10⁻⁵)."
            solution={
              <>
                <p>CH₃COOH + H₂O ⇌ H₃O⁺ + CH₃COO⁻, with x = [H₃O⁺] = [CH₃COO⁻]</p>
                <p>x² / (0.10 − x) = 1.8 × 10⁻⁵</p>
                <p>x² + 1.8 × 10⁻⁵ x − 1.8 × 10⁻⁶ = 0, so x = 1.33 × 10⁻³ M</p>
                <p>(The shortcut √(1.8 × 10⁻⁶) = 1.34 × 10⁻³ M is close, because only about 1% ionizes.)</p>
                <p>pH = −log(1.33 × 10⁻³) = 2.88;&nbsp; % ionized = 1.33 × 10⁻³ / 0.10 × 100 = 1.33%</p>
                <p className="font-semibold text-emerald-700">pH ≈ 2.88, about 1.3% ionized</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: A very dilute strong acid"
            question="What is the pH of 1.0 × 10⁻⁸ M HCl? Explain why the answer is not 8.00."
            solution={
              <>
                <p>HCl gives 1.0 × 10⁻⁸ M Cl⁻, and water also ionizes. Charge balance: [H₃O⁺] = [Cl⁻] + [OH⁻]</p>
                <p>With [OH⁻] = Kw/[H₃O⁺]: h² − (1.0 × 10⁻⁸)h − 1.0 × 10⁻¹⁴ = 0</p>
                <p>h = (1.0 × 10⁻⁸ + √(1.0 × 10⁻¹⁶ + 4.0 × 10⁻¹⁴)) / 2 = (1.0 × 10⁻⁸ + 2.0025 × 10⁻⁷) / 2 = 1.05 × 10⁻⁷ M</p>
                <p className="font-semibold text-emerald-700">
                  pH ≈ 6.98. −log(10⁻⁸) = 8 would ignore water, which already supplies about 10⁻⁷ M H₃O⁺; adding any acid can only lower
                  the pH below 7.
                </p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="chemistry"
          current="ph-scale"
          items={[
            { slug: 'mole-concept', note: 'Moles and molar mass, the basis of every concentration in mol/L' },
            { slug: 'bond-polarity', note: 'Bond polarity helps explain why some acids give up protons more easily' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
