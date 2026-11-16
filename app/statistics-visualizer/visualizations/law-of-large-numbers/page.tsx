import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, Dices, Scale, TrendingDown } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import LawOfLargeNumbersVisualizer from './LawOfLargeNumbersVisualizer';

export const metadata: Metadata = {
  title: 'Law of Large Numbers - Statistics Visualizer | AllVisualizer',
  description:
    'Flip coins and roll dice thousands of times and watch the running relative frequency settle on the true probability, with a shrinking 1/√n error band.',
  keywords: ['law of large numbers', 'relative frequency', 'coin flip simulation', 'dice simulation', 'probability', 'convergence', 'gambler\'s fallacy'],
};

const ideas = [
  {
    title: 'Relative frequency',
    icon: Activity,
    description: 'After n trials, the relative frequency of an event is the number of times it happened divided by n. It is a random number that changes with every trial.',
  },
  {
    title: 'Convergence',
    icon: TrendingDown,
    description: 'As n grows, the relative frequency gets closer and closer to the true probability p. The typical error shrinks like 1/√n.',
  },
  {
    title: 'Proportions, not counts',
    icon: Scale,
    description: 'The gap between the count and its expected value p × n usually grows (like √n). Only the proportion settles down.',
  },
  {
    title: 'No memory',
    icon: Dices,
    description: 'Coins and dice do not remember past outcomes. Early streaks are not corrected; they are diluted by the many trials that follow.',
  },
];

const errors = [
  { n: '10', se: '0.158', band: '0.18 to 0.82' },
  { n: '100', se: '0.050', band: '0.40 to 0.60' },
  { n: '1,000', se: '0.0158', band: '0.468 to 0.532' },
  { n: '10,000', se: '0.0050', band: '0.490 to 0.510' },
  { n: '100,000', se: '0.00158', band: '0.4968 to 0.5032' },
];

export default function LawOfLargeNumbersPage() {
  return (
    <DetailPage subject="statistics" item="law-of-large-numbers">
      <LawOfLargeNumbersVisualizer />

      <ContentSection title="What the law says">
        <Prose>
          <p>
            Repeat a random experiment many times, independently and under the same conditions, and count how often an event happens. The{' '}
            <strong>law of large numbers</strong> says that the relative frequency of the event approaches its true probability p as the number of
            trials n grows. More generally, the average of n independent values from the same distribution approaches the distribution&apos;s mean.
          </p>
          <p>
            This is what connects probability to the real world. A probability of 1/6 for rolling a six does not predict any single roll, but it does
            predict that in 6,000 rolls you will see close to 1,000 sixes, and the larger the number of rolls the closer the proportion gets.
          </p>
          <p>
            The law says nothing about how fast that happens. For that you need the spread of the relative frequency, √(p(1 − p)/n), and its shape,
            which the{' '}
            <Link href="/math-visualizer/problems/central-limit-theorem" className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800">
              central limit theorem
            </Link>{' '}
            says is approximately normal for large n.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Relative frequency">
            <Formula
              where={[
                { symbol: 'X', meaning: 'number of times the event happened in n trials' },
                { symbol: 'f', meaning: 'relative frequency after n trials' },
              ]}
            >
              f<sub>n</sub> = X / n
            </Formula>
          </Callout>
          <Callout tone="formula" title="Mean and spread of the relative frequency">
            <Formula where={[{ symbol: 'p', meaning: 'true probability of the event on each trial' }]}>
              E[f<sub>n</sub>] = p,&nbsp;&nbsp; SD(f<sub>n</sub>) = √(p(1 − p) / n) ≤ 1 / (2√n)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Weak law of large numbers">
            <Formula>for every ε &gt; 0:&nbsp; P(|f<sub>n</sub> − p| &gt; ε) → 0&nbsp; as n → ∞</Formula>
          </Callout>
          <Callout tone="formula" title="Rough 95% band">
            <Formula>p ± 2√(p(1 − p) / n),&nbsp; which is never wider than p ± 1/√n</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How fast does a fair coin settle?">
        <DataTable
          caption="For p = 0.5 the standard deviation of the proportion is 0.5/√n. About 95% of runs end inside the band p ± 2 SD."
          columns={[
            { header: 'Flips n', cell: 'n', numeric: true },
            { header: 'SD of proportion', cell: 'se', numeric: true },
            { header: 'About 95% of runs end between', cell: 'band', numeric: true },
          ]}
          rows={errors}
        />
        <Prose className="mt-4">
          <p>Each extra digit of accuracy costs 100 times as many trials, because the error shrinks with √n, not n.</p>
        </Prose>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick an experiment. For the biased coin set P(heads) with the slider; for the die choose which face to track. Two dice tracks a sum of 7, which has probability 6/36.',
            'Press +1 a few times and watch the running frequency jump around. Then press +100 or +1000, or Auto-run, and watch the line settle on the dashed true probability.',
            'Switch the log scale on and off. On a linear axis the early chaos is squeezed into the left edge; the log scale gives every factor of 10 the same width.',
            'Turn on Overlay 5 independent runs. Each run wanders differently at first, but all of them end up inside the shrinking blue band.',
            'Compare the bars of observed outcome shares with the black true-probability lines below the chart. With more trials the bars line up with the lines.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="The gambler's fallacy">
        The law of large numbers does not mean that a run of heads makes tails &quot;due&quot;. Each flip is still 50/50. The proportion returns
        toward 0.5 because the early streak becomes a smaller and smaller part of a growing total, not because later flips make up for it.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: How many flips?"
            question="A fair coin is flipped 100 times. Between which two proportions of heads will about 95% of such experiments land? How many flips would you need for the standard deviation of the proportion to be 0.01?"
            solution={
              <>
                <p>SD of the proportion: √(p(1 − p)/n) = √(0.25 / 100) = 0.5 / 10 = 0.05</p>
                <p>95% band: 0.5 ± 2 × 0.05 = 0.40 to 0.60</p>
                <p>For SD = 0.01: √(0.25 / n) = 0.01, so 0.25 / n = 0.0001 and n = 2,500</p>
                <p className="font-semibold text-emerald-700">Between 0.40 and 0.60 heads; n = 2,500 flips</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: A streak gets diluted"
            question="A fair coin lands heads on each of its first 10 flips. You then flip it 990 more times. What is the probability of heads on flip 11, and what is the expected proportion of heads after all 1,000 flips?"
            solution={
              <>
                <p>The coin has no memory, so P(heads on flip 11) = 0.5.</p>
                <p>Expected heads in the remaining 990 flips: 0.5 × 990 = 495</p>
                <p>Expected total: 10 + 495 = 505 heads out of 1,000</p>
                <p>Expected proportion: 505 / 1000 = 0.505. The streak is not cancelled out; its effect on the proportion is just diluted, from 1.0 to about 0.505.</p>
                <p className="font-semibold text-emerald-700">P(heads on flip 11) = 0.5; expected proportion ≈ 0.505</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="statistics"
          current="law-of-large-numbers"
          items={[
            { slug: 'binomial-distribution', note: 'The exact distribution of the number of heads in n flips' },
            { slug: 'confidence-intervals', note: 'Turn an observed proportion into a range for the true probability' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
