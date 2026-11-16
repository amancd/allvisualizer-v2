import type { Metadata } from 'next';
import { AlertOctagon, EyeOff, Users, Zap } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import TypeErrorsVisualizer from './TypeErrorsVisualizer';

export const metadata: Metadata = {
  title: 'Type I & II Errors and Power - Statistics Visualizer | AllVisualizer',
  description:
    'See the sampling distributions under H₀ and H₁, shade α, β and power, and watch how effect size, σ, sample size and significance level trade off. Includes a power curve and sample-size calculator.',
  keywords: ['type I error', 'type II error', 'statistical power', 'beta', 'significance level', 'effect size', 'sample size calculation', 'false positive', 'false negative'],
};

const ideas = [
  {
    title: 'Type I error (α)',
    icon: AlertOctagon,
    description: 'Rejecting H₀ when it is actually true: a false alarm. You set its probability directly by choosing α.',
  },
  {
    title: 'Type II error (β)',
    icon: EyeOff,
    description: 'Failing to reject H₀ when it is false: a real effect goes unnoticed. Its probability depends on the effect, σ, n and α.',
  },
  {
    title: 'Power (1 − β)',
    icon: Zap,
    description: 'The chance the test detects an effect that really exists. Studies are usually designed for a power of at least 0.8.',
  },
  {
    title: 'Sample size is the lever',
    icon: Users,
    description: 'More data shrinks the standard error, pulls the two curves apart and raises power without touching α.',
  },
];

const powerTable = [
  { n: '10', se: '4.74', one: '0.352', two: '0.244', strict: '0.144' },
  { n: '25', se: '3.00', one: '0.639', two: '0.516', strict: '0.372' },
  { n: '50', se: '2.12', one: '0.882', two: '0.807', strict: '0.692' },
  { n: '100', se: '1.50', one: '0.991', two: '0.979', strict: '0.953' },
];

export default function TypeErrorsPage() {
  return (
    <DetailPage subject="statistics" item="type-i-ii-errors">
      <TypeErrorsVisualizer />

      <ContentSection title="Two ways to be wrong">
        <Prose>
          <p>
            A hypothesis test ends in one of two decisions, and the truth is one of two states, so there are four outcomes. Two of them are
            mistakes. A <strong>Type I error</strong> rejects a true null hypothesis; a <strong>Type II error</strong> keeps a false one.
          </p>
          <p>
            The chart shows both at once. The blue curve is how x̄ varies if H₀ is true, and the purple curve is how it varies if the true
            mean is μ₀ + δ. The critical value splits the axis into &quot;reject&quot; and &quot;fail to reject&quot;. The red area under the
            blue curve beyond it is α. The amber area under the purple curve on the wrong side is β, and the green rest of the purple curve is
            the <strong>power</strong>.
          </p>
          <p>
            Move the critical value to the right and α shrinks, but β grows: for a fixed sample you cannot reduce both. The way out is to
            make the curves narrower. Their spread is the standard error σ/√n, so a bigger sample (or less noisy measurements) separates the
            curves and lowers β at the same α.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Power of a one-sided z-test (H₁: μ > μ₀)">
            <Formula
              where={[
                { symbol: 'δ', meaning: 'true difference μ₁ − μ₀' },
                { symbol: 'z₁₋α', meaning: 'critical value, e.g. 1.645 for α = 0.05' },
                { symbol: 'Φ', meaning: 'standard normal CDF' },
              ]}
            >
              power = 1 − β = 1 − Φ(z₁₋α − δ / (σ/√n))
            </Formula>
          </Callout>
          <Callout tone="formula" title="Two-sided test (H₁: μ ≠ μ₀)">
            <Formula>power = 1 − Φ(z₁₋α/₂ − δ√n/σ) + Φ(−z₁₋α/₂ − δ√n/σ)</Formula>
          </Callout>
          <Callout tone="formula" title="Sample size for a target power">
            <Formula
              where={[
                { symbol: 'z₁₋β', meaning: '0.842 for power 0.8, 1.282 for 0.9' },
                { symbol: 'd = δ/σ', meaning: 'standardized effect size' },
              ]}
            >
              n = ((z₁₋α + z₁₋β) · σ / δ)², rounded up (use z₁₋α/₂ for a two-sided test)
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Power for δ = 6, σ = 15">
        <DataTable
          columns={[
            { header: 'n', cell: 'n', numeric: true },
            { header: 'SE = σ/√n', cell: 'se', numeric: true },
            { header: 'One-sided, α = 0.05', cell: 'one', numeric: true },
            { header: 'Two-sided, α = 0.05', cell: 'two', numeric: true },
            { header: 'One-sided, α = 0.01', cell: 'strict', numeric: true },
          ]}
          rows={powerTable}
          caption="The effect is d = 6/15 = 0.4 standard deviations. Power rises with n and falls when α is made stricter or the test is two-sided."
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Start with the defaults: δ = 6, σ = 15, n = 25, α = 0.05, one-sided. Read α, β and power from the tiles and the coloured areas.',
            'Drag on the chart to move the critical value. Watch the red area (α) and the amber area (β) trade off against each other.',
            'Increase n. Both curves get narrower, the overlap shrinks and power rises while α stays fixed.',
            'Increase σ or decrease δ. The curves overlap more and power drops. Set δ = 0 and power equals α.',
            'Switch the power curve between sample size and effect δ. Click on the curve to jump to a point.',
            'Use the sample size calculator to find the smallest n that reaches power 0.8, then press Set n to check it on the chart.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception">
        &quot;Fail to reject H₀&quot; does not mean &quot;there is no effect&quot;. With a small sample the power can be low: at δ = 6, σ = 15
        and n = 10, a one-sided test at α = 0.05 misses this real effect about 65% of the time. A non-significant result from an underpowered
        study is weak evidence either way.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Power of a one-sided test"
            question="Test H₀: μ = 100 against H₁: μ > 100 with σ = 15, n = 36 and α = 0.05. If the true mean is 106, what are the critical value for x̄, the power and β?"
            solution={
              <>
                <p>SE = 15/√36 = 2.5</p>
                <p>Critical x̄ = 100 + 1.645 × 2.5 = 104.11. Reject H₀ if x̄ ≥ 104.11.</p>
                <p>If μ = 106: z = (104.11 − 106)/2.5 = −0.755</p>
                <p>Power = P(Z ≥ −0.755) = Φ(0.755) ≈ 0.775, so β ≈ 0.225</p>
                <p className="font-semibold text-emerald-700">Critical x̄ ≈ 104.11; power ≈ 0.775; β ≈ 0.225</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Planning a study"
            question="You want a two-sided test at α = 0.05 to detect a difference of 4 units when σ = 10, with power 0.9. How many observations do you need?"
            solution={
              <>
                <p>z₁₋α/₂ = z₀.₉₇₅ = 1.960 and z₁₋β = z₀.₉₀ = 1.282</p>
                <p>n = ((1.960 + 1.282) × 10 / 4)² = (3.242 × 2.5)² = 8.104² ≈ 65.7</p>
                <p>Round up to 66. Check: with n = 66, SE = 10/√66 = 1.231, δ/SE = 3.250, power = 1 − Φ(1.960 − 3.250) + Φ(−5.210) ≈ 0.901.</p>
                <p className="font-semibold text-emerald-700">n = 66 observations</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="statistics"
          current="type-i-ii-errors"
          items={[
            { slug: 'confidence-intervals', note: 'The confidence level is 1 − α: each missed interval is a Type I error in disguise.' },
            { slug: 'bayes-theorem', note: 'False positives and base rates: why a significant result is not always a real effect.' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
