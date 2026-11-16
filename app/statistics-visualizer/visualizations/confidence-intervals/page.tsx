import type { Metadata } from 'next';
import { Crosshair, Repeat, Ruler, Scale } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import ConfidenceIntervalsVisualizer from './ConfidenceIntervalsVisualizer';

export const metadata: Metadata = {
  title: 'Confidence Intervals - Statistics Visualizer | AllVisualizer',
  description:
    'Draw repeated samples from a normal population, build a z or t confidence interval from each and watch how often the intervals capture the true mean.',
  keywords: ['confidence interval', 'margin of error', 'confidence level', 'standard error', 't interval', 'z interval', 'coverage', 'statistics'],
};

const ideas = [
  {
    title: 'Estimate ± margin',
    icon: Ruler,
    description: 'Every interval has the same shape: a point estimate (the sample mean) plus and minus a margin of error.',
  },
  {
    title: 'The method has the confidence',
    icon: Repeat,
    description: 'A 95% method captures μ in about 95% of repeated samples. Any single interval either contains μ or it does not.',
  },
  {
    title: 'Wider for more confidence',
    icon: Crosshair,
    description: 'A higher confidence level needs a larger critical value, so the interval gets wider. You trade precision for certainty.',
  },
  {
    title: 'Narrower with more data',
    icon: Scale,
    description: 'The margin shrinks like 1/√n. To halve it you need four times as many observations.',
  },
];

const criticalValues = [
  { level: '80%', z: '1.282', t4: '1.533', t9: '1.383', t29: '1.311' },
  { level: '90%', z: '1.645', t4: '2.132', t9: '1.833', t29: '1.699' },
  { level: '95%', z: '1.960', t4: '2.776', t9: '2.262', t29: '2.045' },
  { level: '99%', z: '2.576', t4: '4.604', t9: '3.250', t29: '2.756' },
];

export default function ConfidenceIntervalsPage() {
  return (
    <DetailPage subject="statistics" item="confidence-intervals">
      <ConfidenceIntervalsVisualizer />

      <ContentSection title="What a confidence interval is">
        <Prose>
          <p>
            You want the mean μ of a population, but you only have a sample of n values. The sample mean x̄ is your best single guess,
            yet it is almost never exactly right. A <strong>confidence interval</strong> adds a margin of error around x̄ to give a range of
            plausible values for μ.
          </p>
          <p>
            The margin is a <strong>critical value</strong> times the <strong>standard error</strong>. The standard error σ/√n measures how
            much x̄ varies from sample to sample. The critical value sets the confidence level: for 95%, z* = 1.960 because 95% of a
            standard normal lies between −1.960 and 1.960.
          </p>
          <p>
            When σ is unknown, which is the usual case, you replace it with the sample standard deviation s. That adds extra uncertainty,
            so the critical value comes from the <strong>t distribution</strong> with n − 1 degrees of freedom, whose heavier tails give a
            slightly wider interval. For large n the t and z critical values become almost the same.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="z interval (σ known)">
            <Formula
              where={[
                { symbol: 'x̄', meaning: 'sample mean' },
                { symbol: 'z*', meaning: 'standard normal critical value, e.g. 1.960 for 95%' },
                { symbol: 'σ / √n', meaning: 'standard error of the mean' },
              ]}
            >
              x̄ ± z* · σ / √n
            </Formula>
          </Callout>
          <Callout tone="formula" title="t interval (σ unknown)">
            <Formula
              where={[
                { symbol: 's', meaning: 'sample standard deviation' },
                { symbol: 't*', meaning: 't critical value with n − 1 degrees of freedom' },
              ]}
            >
              x̄ ± t*(n − 1) · s / √n
            </Formula>
          </Callout>
          <Callout tone="formula" title="Sample size for a target margin E">
            <Formula>n = (z* · σ / E)², rounded up</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Critical values">
        <DataTable
          columns={[
            { header: 'Confidence', cell: 'level' },
            { header: 'z*', cell: 'z', numeric: true },
            { header: 't*, n = 5', cell: 't4', numeric: true },
            { header: 't*, n = 10', cell: 't9', numeric: true },
            { header: 't*, n = 30', cell: 't29', numeric: true },
          ]}
          rows={criticalValues}
          caption="Two-sided critical values. The t columns use n − 1 = 4, 9 and 29 degrees of freedom."
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick a sample size n and a confidence level. The population is normal with μ = 100 and σ = 15, shown as the purple line.',
            'Press Draw 1 sample. The dot is the sample mean and the bar is its interval: blue if it captures μ, red if it misses.',
            'Press Draw 100 or Auto-draw and watch the running coverage settle near the nominal level (the dashed line).',
            'Move the confidence level slider. The same samples are rebuilt with a new critical value, so you can watch the intervals widen and the red ones turn blue.',
            'Switch to the t interval. Now each interval uses its own s, so the widths vary, but coverage still matches the nominal level.',
            'Try "z with s" at n = 3 or 5. Its intervals are too narrow and coverage drops well below the nominal level, which is why the t distribution exists.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception">
        A 95% confidence interval of [96.2, 104.1] does <em>not</em> mean there is a 95% probability that μ lies in it. μ is a fixed number
        and this particular interval either contains it or not. The 95% describes the method: if you repeated the sampling many times, about
        95% of the intervals built this way would contain μ. That is exactly what the coverage counter measures.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Bulb lifetimes"
            question="A sample of 36 bulbs has a mean lifetime of 1200 hours. The population standard deviation is known to be 90 hours. Build a 95% confidence interval for the mean lifetime. How many bulbs would you need for a margin of error of 10 hours?"
            solution={
              <>
                <p>SE = σ/√n = 90/√36 = 90/6 = 15 hours</p>
                <p>E = z* · SE = 1.960 × 15 = 29.4 hours</p>
                <p>Interval: 1200 ± 29.4 = [1170.6, 1229.4]</p>
                <p>For E = 10: n = (1.960 × 90 / 10)² = 17.64² = 311.2, round up to 312</p>
                <p className="font-semibold text-emerald-700">95% CI ≈ [1170.6, 1229.4] hours; n = 312 bulbs</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Reaction times with σ unknown"
            question="Sixteen people take a reaction test. Their mean time is 4.2 tenths of a second with sample standard deviation s = 0.8. Build a 95% t interval for the mean, and compare its margin with the one you would get by wrongly using z*."
            solution={
              <>
                <p>SE = s/√n = 0.8/√16 = 0.8/4 = 0.2</p>
                <p>Degrees of freedom: n − 1 = 15, so t* = 2.131</p>
                <p>E = 2.131 × 0.2 = 0.426, interval 4.2 ± 0.426 = [3.774, 4.626]</p>
                <p>With z* = 1.960: E = 1.960 × 0.2 = 0.392, which is about 8% too narrow</p>
                <p className="font-semibold text-emerald-700">95% CI ≈ [3.77, 4.63]; the z margin (0.392) understates the uncertainty</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="statistics"
          current="confidence-intervals"
          items={[
            { slug: 'pdf-and-cdf', note: 'Critical values like z* = 1.960 are quantiles: points where the CDF reaches 0.975.' },
            { slug: 'law-of-large-numbers', note: 'Why the running coverage settles on the confidence level as the number of samples grows.' },
            { slug: 'type-i-ii-errors', note: 'The misses in this visualizer are the same 5% that a test calls Type I errors.' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
