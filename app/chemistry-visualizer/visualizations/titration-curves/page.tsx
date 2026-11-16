import type { Metadata } from 'next';
import { Droplet, FlaskConical, Palette, Target } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import TitrationCurvesVisualizer from './TitrationCurvesVisualizer';

export const metadata: Metadata = {
  title: 'Titration Curves - Chemistry Visualizer | AllVisualizer',
  description:
    'Titrate strong and weak acids and bases drop by drop. Trace the exact pH curve, find the equivalence and half-equivalence points, see the buffer region and choose the right indicator.',
  keywords: ['titration curve', 'equivalence point', 'half-equivalence point', 'buffer region', 'Henderson-Hasselbalch', 'acid-base indicator', 'phenolphthalein', 'pKa'],
};

const ideas = [
  {
    title: 'Equivalence point',
    icon: Target,
    description: 'The moment the moles of titrant added exactly match the moles of analyte. The pH changes fastest here, so the curve is almost vertical.',
  },
  {
    title: 'Buffer region',
    icon: FlaskConical,
    description: 'With a weak acid, the flask holds both HA and its conjugate base A⁻ before equivalence. The pair soaks up added OH⁻, so the curve is flat.',
  },
  {
    title: 'Half-equivalence',
    icon: Droplet,
    description: 'Halfway to equivalence, half the HA has become A⁻, so [HA] = [A⁻] and pH = pKa. This is how Ka is measured in the lab.',
  },
  {
    title: 'Indicators',
    icon: Palette,
    description: 'An indicator is itself a weak acid whose two forms have different colours. Pick one whose colour change range sits on the steep part of the curve.',
  },
];

const indicators = [
  { name: 'Methyl orange', range: '3.1 – 4.4', change: 'red → yellow', use: 'Strong acid with weak base' },
  { name: 'Bromothymol blue', range: '6.0 – 7.6', change: 'yellow → blue', use: 'Strong acid with strong base' },
  { name: 'Phenolphthalein', range: '8.2 – 10.0', change: 'colourless → pink', use: 'Weak acid with strong base' },
];

const shapes = [
  { type: 'Strong acid + strong base', start: 'Low (pH = −log C)', eq: '7.00', jump: 'Large, about pH 4 to 10 at 0.1 M' },
  { type: 'Weak acid + strong base', start: 'Higher, weak acid only', eq: 'Above 7 (A⁻ is basic)', jump: 'Smaller, starts higher' },
  { type: 'Weak base + strong acid', start: 'Above 7, weak base only', eq: 'Below 7 (BH⁺ is acidic)', jump: 'Smaller, falling' },
];

export default function TitrationCurvesPage() {
  return (
    <DetailPage subject="chemistry" item="titration-curves">
      <TitrationCurvesVisualizer />

      <ContentSection title="Reading a titration curve">
        <Prose>
          <p>
            In a titration a solution of known concentration (the <strong>titrant</strong>, in the burette) is added to a measured volume of
            the <strong>analyte</strong> in the flask until they have exactly reacted. Plotting pH against the volume added gives a titration
            curve, and its shape tells you a lot about the acid or base you started with.
          </p>
          <p>
            For a strong acid and strong base the curve is flat at first, then jumps by about six pH units within a few drops around the
            equivalence point, which sits at pH 7. With a weak acid the start is higher, there is a gently sloping <strong>buffer region</strong>,
            and the equivalence point lies above 7 because the conjugate base A⁻ reacts with water to make OH⁻. A weak base titrated with a
            strong acid is the mirror image, with an acidic equivalence point.
          </p>
          <p>
            The visualizer computes every point exactly from the charge balance, including water&apos;s own ions and the dilution caused by the
            added titrant, instead of switching between separate formulas for each region.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Equivalence volume">
            <Formula where={[{ symbol: 'Cₐ, Vₐ', meaning: 'analyte concentration and volume' }, { symbol: 'Cₜ', meaning: 'titrant concentration' }]}>
              Cₐ × Vₐ = Cₜ × V_eq&nbsp;&nbsp; (1 : 1 reaction)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Henderson-Hasselbalch (buffer region)">
            <Formula>pH = pKa + log([A⁻] / [HA]);&nbsp; at half-equivalence [A⁻] = [HA], so pH = pKa</Formula>
          </Callout>
          <Callout tone="formula" title="pH at the equivalence point of a weak acid">
            <Formula where={[{ symbol: 'C', meaning: 'concentration of A⁻ in the total volume Vₐ + V_eq' }]}>
              Kb = Kw / Ka,&nbsp; [OH⁻] ≈ √(Kb × C)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Exact charge balance (weak acid + NaOH)">
            <Formula>[H₃O⁺] + [Na⁺] = [A⁻] + [OH⁻],&nbsp; with [A⁻] = C_HA × Ka / (Ka + [H₃O⁺])</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Curve shapes and indicators">
        <DataTable
          columns={[
            { header: 'Titration', cell: 'type' },
            { header: 'Starting pH', cell: 'start' },
            { header: 'pH at equivalence', cell: 'eq' },
            { header: 'Jump', cell: 'jump' },
          ]}
          rows={shapes}
        />
        <div className="mt-6">
          <DataTable
            caption="Indicators in the visualizer"
            columns={[
              { header: 'Indicator', cell: 'name' },
              { header: 'pH range', cell: 'range', numeric: true },
              { header: 'Colour change', cell: 'change' },
              { header: 'Typical use', cell: 'use' },
            ]}
            rows={indicators}
          />
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose the type of titration, then set the concentrations, the flask volume and (for a weak acid or base) pKa or pKb.',
            'Press Add 1 drop (0.05 mL) or Add 1 mL, or open the stopcock to add titrant continuously. It slows down near the equivalence point, as a careful chemist would.',
            'Drag on the chart to scrub to any volume. The dashed grey line is the full curve; the blue line is what you have added so far.',
            'Find the purple equivalence marker and, for weak acids and bases, the green half-equivalence point where pH = pKa, inside the shaded buffer region.',
            'Pick an indicator. Its colour change range is shaded on the chart, the flask takes on its colour, and the side panel says how close its colour change is to the equivalence point.',
            'Try methyl orange with acetic acid to see an indicator that changes colour far too early.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception">
        The equivalence point is not always at pH 7. It is only neutral for a strong acid with a strong base. Titrating acetic acid with
        NaOH leaves sodium acetate, which is basic, and titrating ammonia with HCl leaves ammonium chloride, which is acidic. Equivalence
        means equal moles, not neutral pH.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Acetic acid with NaOH"
            question="25.0 mL of 0.100 M acetic acid (Ka = 1.8 × 10⁻⁵) is titrated with 0.100 M NaOH. Find the equivalence volume, the pH at half-equivalence, the pH at equivalence and the pH after 30.0 mL of NaOH."
            solution={
              <>
                <p>Moles of acid: 0.0250 L × 0.100 M = 2.50 mmol, so V_eq = 2.50 mmol / 0.100 M = 25.0 mL</p>
                <p>Half-equivalence (12.5 mL): [HA] = [A⁻], so pH = pKa = −log(1.8 × 10⁻⁵) = 4.74</p>
                <p>Equivalence: 2.50 mmol A⁻ in 50.0 mL, so [A⁻] = 0.0500 M; Kb = 1.0 × 10⁻¹⁴ / 1.8 × 10⁻⁵ = 5.56 × 10⁻¹⁰</p>
                <p>[OH⁻] = √(5.56 × 10⁻¹⁰ × 0.0500) = 5.27 × 10⁻⁶ M, pOH = 5.28, pH = 8.72</p>
                <p>After 30.0 mL: excess OH⁻ = 3.00 − 2.50 = 0.50 mmol in 55.0 mL = 9.09 × 10⁻³ M, pOH = 2.04, pH = 11.96</p>
                <p className="font-semibold text-emerald-700">V_eq = 25.0 mL; pH 4.74 at half-equivalence, 8.72 at equivalence and 11.96 after 30.0 mL</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Ammonia with HCl"
            question="20.0 mL of 0.150 M NH₃ (Kb = 1.8 × 10⁻⁵) is titrated with 0.100 M HCl. Find the pH after 10.0 mL of HCl and at the equivalence point. Which indicator in the table fits best?"
            solution={
              <>
                <p>NH₃: 20.0 mL × 0.150 M = 3.00 mmol, so V_eq = 3.00 / 0.100 = 30.0 mL</p>
                <p>After 10.0 mL: 1.00 mmol HCl makes 1.00 mmol NH₄⁺ and leaves 2.00 mmol NH₃ (a buffer)</p>
                <p>pKa(NH₄⁺) = 14.00 − 4.74 = 9.26;&nbsp; pH = 9.26 + log(2.00 / 1.00) = 9.56</p>
                <p>Equivalence: 3.00 mmol NH₄⁺ in 50.0 mL = 0.0600 M; Ka = 1.0 × 10⁻¹⁴ / 1.8 × 10⁻⁵ = 5.56 × 10⁻¹⁰</p>
                <p>[H₃O⁺] = √(5.56 × 10⁻¹⁰ × 0.0600) = 5.77 × 10⁻⁶ M, pH = 5.24</p>
                <p className="font-semibold text-emerald-700">
                  pH 9.56 after 10.0 mL and 5.24 at equivalence. Methyl orange (3.1–4.4) changes just after equivalence, on the lower part
                  of the steep drop, so it works; phenolphthalein would change far too early.
                </p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="chemistry"
          current="titration-curves"
          items={[
            { slug: 'le-chateliers-principle', note: 'Why a buffer pushes back when acid or base is added' },
            { slug: 'limiting-reagent', note: 'Before equivalence the analyte is in excess; after it, the titrant is' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
