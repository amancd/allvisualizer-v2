import type { Metadata } from 'next';
import { Gavel, Gauge, Scale, Sigma } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import HypothesisTestingVisualizer from './HypothesisTestingVisualizer';

export const metadata: Metadata = {
  title: 'Hypothesis Testing - Statistics Visualizer | AllVisualizer',
  description:
    'Run a one-sample z-test or t-test step by step: state H₀ and H₁, compute the test statistic, shade the rejection region and p-value, and simulate repeated inspections.',
  keywords: ['hypothesis testing', 'null hypothesis', 'p-value', 'significance level', 'z-test', 't-test', 'rejection region', 'statistics'],
};

const ideas = [
  {
    title: 'Null hypothesis H₀',
    icon: Scale,
    description: 'The "nothing is going on" claim, such as "the machine fills 500 ml on average". The test assumes it is true and looks for evidence against it.',
  },
  {
    title: 'Test statistic',
    icon: Sigma,
    description: 'How many standard errors the sample mean is from the value claimed by H₀. Large values in the direction of H₁ count against H₀.',
  },
  {
    title: 'p-value',
    icon: Gauge,
    description: 'The probability, if H₀ were true, of a test statistic at least as extreme as the one observed. Small p means the data would be surprising under H₀.',
  },
  {
    title: 'Decision at level α',
    icon: Gavel,
    description: 'Reject H₀ when p ≤ α. The significance level α is chosen before looking at the data and is the false-alarm rate you accept.',
  },
];

const rules = [
  { alt: 'Two-sided', h1: 'μ ≠ μ₀', p: '2 · P(Z ≥ |z|)', region: '|z| ≥ 1.960' },
  { alt: 'Left-tailed', h1: 'μ < μ₀', p: 'P(Z ≤ z)', region: 'z ≤ −1.645' },
  { alt: 'Right-tailed', h1: 'μ > μ₀', p: 'P(Z ≥ z)', region: 'z ≥ 1.645' },
];

export default function HypothesisTestingPage() {
  return (
    <DetailPage subject="statistics" item="hypothesis-testing">
      <HypothesisTestingVisualizer />

      <ContentSection title="How a hypothesis test works">
        <Prose>
          <p>
            A hypothesis test is a proof by contradiction with uncertainty. You start from a <strong>null hypothesis</strong> H₀ that pins down
            the population mean, say μ = 500 ml, and an <strong>alternative</strong> H₁ that says what you suspect instead: the mean is
            different, lower or higher.
          </p>
          <p>
            Assuming H₀ is true, the sample mean x̄ should land near μ₀, with a spread given by the standard error. The{' '}
            <strong>test statistic</strong> z = (x̄ − μ₀)/(σ/√n) measures how far away it actually landed, in standard errors. Under H₀ it
            follows a standard normal distribution, so you can ask how unusual the observed value is. That probability is the{' '}
            <strong>p-value</strong>.
          </p>
          <p>
            If the p-value is at most the significance level α, the data would be rare under H₀, so you reject H₀. Otherwise you fail to
            reject it, which is not the same as showing it is true. When σ is unknown you use the sample standard deviation s instead, and
            the statistic follows a t distribution with n − 1 degrees of freedom.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="One-sample z statistic (σ known)">
            <Formula
              where={[
                { symbol: 'x̄', meaning: 'sample mean' },
                { symbol: 'μ₀', meaning: 'mean claimed by H₀' },
                { symbol: 'σ / √n', meaning: 'standard error of x̄' },
              ]}
            >
              z = (x̄ − μ₀) / (σ / √n)
            </Formula>
          </Callout>
          <Callout tone="formula" title="One-sample t statistic (σ unknown)">
            <Formula where={[{ symbol: 's', meaning: 'sample standard deviation; compare with a t distribution with n − 1 df' }]}>
              t = (x̄ − μ₀) / (s / √n)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Decision rule">
            <Formula>reject H₀ if p-value ≤ α&nbsp;&nbsp; (equivalently, if the statistic falls in the rejection region)</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="p-values and rejection regions">
        <DataTable
          columns={[
            { header: 'Test', cell: 'alt' },
            { header: 'H₁', cell: 'h1' },
            { header: 'p-value', cell: 'p' },
            { header: 'Reject at α = 0.05', cell: 'region' },
          ]}
          rows={rules}
          caption="For a t-test, replace Z with T on n − 1 degrees of freedom and use t critical values."
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose the test (z if σ is known, t if not), the alternative hypothesis and the significance level α.',
            'Move the sample mean slider. The black line is the observed statistic, the orange area is its p-value and the red area is the rejection region.',
            'Read the step-by-step panel: it fills in the standard error, the statistic, the p-value and the decision with the current numbers.',
            'Increase n with the same x̄. The standard error shrinks, the statistic grows and a small difference becomes significant.',
            'In the simulation panel, set the true mean to 500 ml (H₀ true) and run 1,000 tests. About α of them reject H₀: these are Type I errors.',
            'Move the true mean away from 500 and run again. Now the rejection rate is the power of the test, and the misses are Type II errors.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception">
        The p-value is <em>not</em> the probability that H₀ is true. It is computed assuming H₀ is true, and tells you how surprising the data
        would be in that case. A p-value of 0.03 means &quot;data this extreme would happen 3% of the time if H₀ held&quot;, not &quot;there is
        a 3% chance H₀ is right&quot;. Likewise, a large p-value only says the data are compatible with H₀, not that H₀ has been proven.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Is the filling machine on target?"
            question="A machine should fill bottles with 500 ml; σ = 4 ml is known. A sample of 36 bottles has mean 498.6 ml. Test H₀: μ = 500 against H₁: μ ≠ 500 at α = 0.05. Would the decision change at α = 0.01?"
            solution={
              <>
                <p>SE = σ/√n = 4/√36 = 4/6 = 0.667 ml</p>
                <p>z = (498.6 − 500)/0.667 = −1.4/0.667 = −2.10</p>
                <p>p = 2 · P(Z ≤ −2.10) = 2 × 0.0179 = 0.0357</p>
                <p>At α = 0.05: 0.0357 ≤ 0.05, so reject H₀. At α = 0.01: 0.0357 &gt; 0.01, so fail to reject.</p>
                <p className="font-semibold text-emerald-700">z = −2.10, p ≈ 0.036: reject at α = 0.05, but not at α = 0.01</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Battery life claim"
            question="A maker claims its batteries last at least 20 hours. Ten batteries last a mean of 19.1 hours with s = 1.5 hours. Test H₀: μ = 20 against H₁: μ < 20 at α = 0.05."
            solution={
              <>
                <p>σ is unknown, so use a t-test with n − 1 = 9 degrees of freedom.</p>
                <p>SE = s/√n = 1.5/√10 = 0.474 hours</p>
                <p>t = (19.1 − 20)/0.474 = −1.897</p>
                <p>Critical value: t₀.₀₅(9) = −1.833. Since −1.897 ≤ −1.833, the statistic is in the rejection region.</p>
                <p>p = P(T₉ ≤ −1.897) ≈ 0.045 ≤ 0.05</p>
                <p className="font-semibold text-emerald-700">t ≈ −1.90, p ≈ 0.045: reject H₀; the data suggest the batteries last less than 20 hours</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="statistics"
          current="hypothesis-testing"
          items={[
            { slug: 'pdf-and-cdf', note: 'A p-value is an area under the density, read off the CDF.' },
            { slug: 'bayes-theorem', note: 'Turning "how surprising is the data under H₀" into "how likely is H₀" needs a prior.' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
