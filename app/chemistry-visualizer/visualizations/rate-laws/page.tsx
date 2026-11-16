import type { Metadata } from 'next';
import { FlaskConical, Hourglass, LineChart, TrendingDown } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import RateLawsVisualizer from './RateLawsVisualizer';

export const metadata: Metadata = {
  title: 'Rate Laws & Reaction Order - Chemistry Visualizer | AllVisualizer',
  description:
    'Compare zero, first and second order reactions. Plot [A], ln[A] and 1/[A] against time, mark successive half-lives, and work out the order of mystery data from the straight-line plot.',
  keywords: ['rate law', 'reaction order', 'integrated rate law', 'half-life', 'rate constant', 'first order', 'second order', 'zero order', 'kinetics', 'chemistry'],
};

const ideas = [
  {
    title: 'Rate law',
    icon: FlaskConical,
    description: 'rate = k[A]ⁿ says how the speed of the reaction depends on concentration. The order n is found by experiment, not read from the equation.',
  },
  {
    title: 'Integrated rate law',
    icon: TrendingDown,
    description: 'Integrating the rate law gives [A] as a function of time, so you can predict how much is left at any moment.',
  },
  {
    title: 'Straight-line test',
    icon: LineChart,
    description: 'Each order turns into a straight line on one kind of plot: [A], ln[A] or 1/[A] against t. The slope gives k.',
  },
  {
    title: 'Half-life pattern',
    icon: Hourglass,
    description: 'Successive half-lives get shorter (zero order), stay the same (first order) or get longer (second order).',
  },
];

const laws = [
  { order: '0', law: 'rate = k', integrated: '[A] = [A]₀ − kt', plot: '[A] vs t', slope: '−k', half: '[A]₀ / 2k', pattern: 'each one half as long', units: 'M s⁻¹' },
  { order: '1', law: 'rate = k[A]', integrated: 'ln[A] = ln[A]₀ − kt', plot: 'ln[A] vs t', slope: '−k', half: 'ln 2 / k', pattern: 'constant', units: 's⁻¹' },
  { order: '2', law: 'rate = k[A]²', integrated: '1/[A] = 1/[A]₀ + kt', plot: '1/[A] vs t', slope: '+k', half: '1 / (k[A]₀)', pattern: 'each one twice as long', units: 'M⁻¹ s⁻¹' },
];

export default function RateLawsPage() {
  return (
    <DetailPage subject="chemistry" item="rate-laws">
      <RateLawsVisualizer />

      <ContentSection title="From rate laws to concentration-time graphs">
        <Prose>
          <p>
            For a reaction A → products, the <strong>rate law</strong> rate = −d[A]/dt = k[A]ⁿ links how fast A is used up to how much A is
            left. The exponent n is the <strong>order</strong> with respect to A, and k is the <strong>rate constant</strong>. Its units depend on
            the order so that the rate always comes out in M s⁻¹.
          </p>
          <p>
            In a zero order reaction the rate does not depend on [A] at all, so [A] falls in a straight line until it runs out. This happens when
            something else limits the rate, such as a saturated enzyme or catalyst surface. In a first order reaction the rate is proportional
            to [A], which gives exponential decay, like radioactive decay. In a second order reaction the rate depends on [A]², so it is fast at
            first and slows down a lot as A is used up.
          </p>
          <p>
            The three curves can look alike, so chemists rearrange each integrated rate law into the form y = mx + b. Plot the data as [A], ln[A]
            and 1/[A] against time: whichever plot is straight tells you the order, and its slope gives k.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Rate law">
            <Formula
              where={[
                { symbol: 'k', meaning: 'rate constant (depends on temperature, not on concentration)' },
                { symbol: 'n', meaning: 'order with respect to A, found from experiment' },
              ]}
            >
              rate = −d[A]/dt = k[A]ⁿ
            </Formula>
          </Callout>
          <Callout tone="formula" title="Integrated rate laws">
            <Formula>
              n = 0:&nbsp; [A] = [A]₀ − kt
              <br />
              n = 1:&nbsp; ln[A] = ln[A]₀ − kt,&nbsp; so [A] = [A]₀e^(−kt)
              <br />
              n = 2:&nbsp; 1/[A] = 1/[A]₀ + kt
            </Formula>
          </Callout>
          <Callout tone="formula" title="Half-lives">
            <Formula>t½ = [A]₀/2k (n = 0),&nbsp;&nbsp; t½ = ln 2/k ≈ 0.693/k (n = 1),&nbsp;&nbsp; t½ = 1/(k[A]₀) (n = 2)</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Integrated rate laws at a glance">
        <DataTable
          columns={[
            { header: 'Order', cell: 'order', numeric: true },
            { header: 'Rate law', cell: 'law' },
            { header: 'Integrated form', cell: 'integrated' },
            { header: 'Straight plot', cell: 'plot' },
            { header: 'Slope', cell: 'slope' },
            { header: 'Half-life', cell: 'half' },
            { header: 'Successive half-lives', cell: 'pattern' },
            { header: 'Units of k', cell: 'units' },
          ]}
          rows={laws}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick an order. The big chart shows [A] against time, with orange markers where [A] reaches [A]₀/2, [A]₀/4, [A]₀/8 and so on.',
            'Compare the gaps between the half-life markers: shrinking for zero order, equal for first order, doubling for second order.',
            'Move the k and [A]₀ sliders. Notice that [A]₀ changes the half-life of zero and second order reactions but not of first order ones.',
            'Press Play or drag the time slider. The vessel shows the molecules of A turning into product, and the panel gives [A], the rate and the current half-life.',
            'Look at the three linearised plots below. The straight one is outlined in green, and its R² is 1.',
            'Switch to Mystery data. Study the table and the three plots, choose the order, then read off k from the slope. Press New mystery data for another set.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception">
        The order of a reaction is not the coefficient in the balanced equation. For 2N₂O₅ → 4NO₂ + O₂ the rate law is rate = k[N₂O₅], first
        order, even though the coefficient is 2. Orders come from experiments like the straight-line test, because they reflect the mechanism,
        not the overall stoichiometry.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: First order decay"
            question="A first order reaction has k = 4.0 × 10⁻³ s⁻¹ and [A]₀ = 0.80 M. (a) What is its half-life? (b) What is [A] after 10.0 minutes? (c) How long does it take for [A] to fall to 0.10 M?"
            solution={
              <>
                <p>(a) t½ = ln 2 / k = 0.6931 / 0.0040 = 173 s</p>
                <p>(b) t = 600 s, kt = 0.0040 × 600 = 2.40</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;[A] = 0.80 × e^(−2.40) = 0.80 × 0.0907 = 0.0726 M</p>
                <p>(c) ln([A]₀/[A]) = kt, so t = ln(0.80/0.10) / 0.0040 = ln 8 / 0.0040</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;t = 2.079 / 0.0040 = 520 s (exactly three half-lives)</p>
                <p className="font-semibold text-emerald-700">t½ ≈ 173 s; [A] ≈ 0.073 M; t ≈ 520 s</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Find the order from data"
            question="For A → products: at t = 0, 50, 100 and 150 s, [A] = 0.500, 0.250, 0.167 and 0.125 M. Find the order and k, then predict [A] at t = 300 s."
            solution={
              <>
                <p>[A] vs t: drops of 0.250, 0.083, 0.042, not straight</p>
                <p>ln[A]: −0.693, −1.386, −1.790, −2.079; drops of 0.693, 0.404, 0.289, not straight</p>
                <p>1/[A]: 2.00, 4.00, 5.99, 8.00; rises of 2.00 every 50 s, straight</p>
                <p>So second order, with k = slope = 2.00 / 50 = 0.0400 M⁻¹ s⁻¹</p>
                <p>Check: half-lives 0 → 50 s, then 50 → 150 s: the second is twice the first</p>
                <p>1/[A] at 300 s = 2.00 + 0.0400 × 300 = 14.0 M⁻¹, so [A] = 1/14.0 = 0.0714 M</p>
                <p className="font-semibold text-emerald-700">Second order, k = 0.040 M⁻¹ s⁻¹, [A](300 s) ≈ 0.071 M</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related visualizations">
        <RelatedItems
          subject="chemistry"
          current="rate-laws"
          items={[
            { slug: 'collision-theory', note: 'Where rate = k[A][B] comes from: counting molecular collisions' },
            { slug: 'activation-energy', note: 'How temperature and catalysts change the rate constant k' },
            { slug: 'le-chateliers-principle', note: 'Forward and reverse rates balancing at equilibrium' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
