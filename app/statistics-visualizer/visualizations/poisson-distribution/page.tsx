import type { Metadata } from 'next';
import { Clock, Gauge, Scaling, Split } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import PoissonDistributionVisualizer from './PoissonDistributionVisualizer';

export const metadata: Metadata = {
  title: 'Poisson Distribution - Statistics Visualizer | AllVisualizer',
  description:
    'Slide the rate λ and read P(X = k) and P(X ≤ k) from the Poisson PMF, simulate random arrivals with exponential gaps, and watch Binomial(n, λ/n) converge to Poisson(λ).',
  keywords: ['Poisson distribution', 'rate lambda', 'random arrivals', 'Poisson process', 'exponential waiting time', 'Poisson approximation to binomial', 'rare events'],
};

const ideas = [
  {
    title: 'Counts in a fixed window',
    icon: Clock,
    description: 'X counts events in a fixed stretch of time, length, area or volume: emails per hour, typos per page, raindrops per tile.',
  },
  {
    title: 'One parameter, λ',
    icon: Gauge,
    description: 'λ is the average number of events per window. It is both the mean and the variance of the count, so the spread grows like √λ.',
  },
  {
    title: 'Independent, one at a time',
    icon: Split,
    description: 'Events happen independently at a constant average rate, and two events never land at exactly the same instant.',
  },
  {
    title: 'Rescaling the window',
    icon: Scaling,
    description: 'If a 1-hour window has rate λ, a t-hour window has rate λt. Counts in non-overlapping windows are independent.',
  },
];

const examples = [
  { situation: 'Calls to a help line', window: 'per hour', lambda: '≈ 4' },
  { situation: 'Radioactive decays detected by a Geiger counter', window: 'per second', lambda: 'depends on the source, often 1 to 100' },
  { situation: 'Goals in a soccer match', window: 'per team per match', lambda: '≈ 1.3' },
  { situation: 'Typos in a book', window: 'per page', lambda: '≈ 0.2' },
  { situation: 'Meteors in a meteor shower', window: 'per minute', lambda: '≈ 1' },
];

export default function PoissonDistributionPage() {
  return (
    <DetailPage subject="statistics" item="poisson-distribution">
      <PoissonDistributionVisualizer />

      <ContentSection title="When counts are Poisson">
        <Prose>
          <p>
            The <strong>Poisson distribution</strong> models how many times an event happens in a fixed window when events occur independently at a
            steady average rate λ. Unlike the binomial, there is no fixed number of trials and no upper limit: X can be 0, 1, 2, 3, … without end,
            although large counts quickly become very unlikely.
          </p>
          <p>
            The link to the binomial explains where the formula comes from. Cut the window into n tiny slots, each so short that it holds at most one
            event, with probability λ/n. The count is then Binomial(n, λ/n). Letting n → ∞ gives the Poisson PMF, because C(n, k)(λ/n)ᵏ → λᵏ/k! and
            (1 − λ/n)ⁿ⁻ᵏ → e<sup>−λ</sup>. That is why the Poisson is also called the law of rare events.
          </p>
          <p>
            Seen in time, the same process has a second description: the gaps between events are independent exponential random variables with mean
            1/λ. The timeline in the visualizer generates arrivals that way and then counts them interval by interval.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Probability mass function">
            <Formula where={[{ symbol: 'λ', meaning: 'average number of events per window (λ > 0)' }, { symbol: 'k', meaning: 'number of events, 0, 1, 2, …' }]}>
              P(X = k) = e<sup>−λ</sup> λ<sup>k</sup> / k!
            </Formula>
          </Callout>
          <Callout tone="formula" title="Mean, variance and cumulative probability">
            <Formula>
              E[X] = λ,&nbsp;&nbsp; Var(X) = λ,&nbsp;&nbsp; P(X ≤ k) = e<sup>−λ</sup> Σ<sub>i=0</sub><sup>k</sup> λ<sup>i</sup> / i!
            </Formula>
          </Callout>
          <Callout tone="formula" title="Poisson approximation to the binomial">
            <Formula where={[{ symbol: 'd_TV', meaning: 'total variation distance: the largest possible difference in the probability of any event' }]}>
              Binomial(n, p) ≈ Poisson(np) when n is large and p is small;&nbsp; d<sub>TV</sub> ≤ np²
            </Formula>
          </Callout>
          <Callout tone="formula" title="Waiting times">
            <Formula>gap between events ~ Exponential(λ),&nbsp;&nbsp; P(no event in time t) = e<sup>−λt</sup></Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Typical Poisson counts">
        <DataTable
          columns={[
            { header: 'Situation', cell: 'situation' },
            { header: 'Window', cell: 'window' },
            { header: 'Typical λ', cell: 'lambda' },
          ]}
          rows={examples}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Set the rate λ. The PMF updates, and the side panel shows that the mean and variance are both λ.',
            'Pick a count k with the slider or by tapping a bar. The panel shows P(X = k), the cumulative P(X ≤ k) and the tail P(X > k).',
            'Press Play in the arrivals section. Orange dots are events; when the red cursor crosses an interval boundary, that interval’s count is added to the histogram.',
            'Press Add 1000 intervals and compare the blue bars with the red PMF lines, and the sample mean and variance with λ.',
            'In the last section, step n from small to large. The binomial bars close in on the Poisson bars and the total variation distance shrinks roughly like 1/n.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception">
        Random does not mean evenly spaced. In a Poisson process events cluster and leave long gaps purely by chance, so seeing three calls in a
        minute and then none for ten minutes is not evidence that something changed. Over-dispersed data, where the variance is clearly larger than
        the mean, is the real sign that a plain Poisson model does not fit.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Calls to a help line"
            question="A help line receives on average 4 calls per hour, and calls arrive as a Poisson process. Find the probability of exactly 2 calls in an hour, of at most 2 calls in an hour, and of no calls at all in a 30-minute break."
            solution={
              <>
                <p>X ~ Poisson(λ = 4) for one hour</p>
                <p>P(X = 2) = e⁻⁴ · 4² / 2! = 8e⁻⁴ = 8 × 0.018316 ≈ 0.1465</p>
                <p>P(X ≤ 2) = e⁻⁴ (1 + 4 + 8) = 13e⁻⁴ ≈ 0.2381</p>
                <p>For 30 minutes the rate is λt = 4 × 0.5 = 2</p>
                <p>P(no calls) = e⁻² ≈ 0.1353</p>
                <p className="font-semibold text-emerald-700">0.1465, 0.2381 and 0.1353</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Defective items"
            question="A machine makes defective items with probability 1/500, independently. In a batch of 1000 items, use the Poisson approximation to find the probability of at most 1 defective item, and compare it with the exact binomial answer."
            solution={
              <>
                <p>Exact model: X ~ Binomial(1000, 0.002), so λ = np = 2</p>
                <p>Poisson: P(X ≤ 1) ≈ e⁻² (1 + 2) = 3e⁻² ≈ 0.40601</p>
                <p>Exact: P(X = 0) = 0.998¹⁰⁰⁰ ≈ 0.13506</p>
                <p>P(X = 1) = 1000 × 0.002 × 0.998⁹⁹⁹ ≈ 0.27067</p>
                <p>P(X ≤ 1) ≈ 0.40573</p>
                <p>Difference ≈ 0.0003, well within the bound np² = 1000 × 0.002² = 0.004</p>
                <p className="font-semibold text-emerald-700">Poisson 0.4060 vs exact 0.4057</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="statistics"
          current="poisson-distribution"
          items={[
            { slug: 'binomial-distribution', note: 'Fixed number of trials; the Poisson is its limit for rare events' },
            { slug: 'pdf-and-cdf', note: 'The exponential distribution of the gaps between Poisson events, as a density and a CDF' },
            { slug: 'law-of-large-numbers', note: 'Why the simulated histogram settles onto the PMF' },
            { subject: 'math', slug: 'normal-distribution', note: 'For large λ the Poisson is close to a normal curve with mean λ and variance λ' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
