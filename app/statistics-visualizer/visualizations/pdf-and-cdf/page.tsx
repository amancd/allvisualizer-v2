import type { Metadata } from 'next';
import { AreaChart, ArrowUpRight, Percent, Ruler } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import PdfCdfVisualizer from './PdfCdfVisualizer';

export const metadata: Metadata = {
  title: 'PDF and CDF - Statistics Visualizer | AllVisualizer',
  description:
    'Compare probability density and cumulative distribution functions for uniform, exponential, normal, beta and gamma distributions. Drag markers to see that the area under the PDF equals the rise of the CDF, and find quantiles with the inverse CDF.',
  keywords: ['PDF', 'CDF', 'probability density function', 'cumulative distribution function', 'quantile', 'inverse CDF', 'percentile', 'exponential distribution', 'beta distribution', 'gamma distribution'],
};

const ideas = [
  {
    title: 'Density, not probability',
    icon: AreaChart,
    description: 'For a continuous X, P(X = x) is 0 for every single x. The PDF f(x) is probability per unit length, so only areas under it are probabilities, and f(x) itself can be larger than 1.',
  },
  {
    title: 'CDF is the running total',
    icon: ArrowUpRight,
    description: 'F(x) = P(X ≤ x) adds up all the area to the left of x. It climbs from 0 to 1, never decreases, and is steepest where the density is highest.',
  },
  {
    title: 'Two views of one thing',
    icon: Ruler,
    description: 'The PDF is the slope of the CDF, and the CDF is the area under the PDF. The probability of an interval is an area on one chart and a height difference on the other.',
  },
  {
    title: 'Quantiles invert the CDF',
    icon: Percent,
    description: 'The p-quantile is the x where F(x) = p. The median is the 0.5 quantile, and the 90th percentile is the 0.9 quantile.',
  },
];

const summaries = [
  { name: 'Uniform(a, b)', support: '[a, b]', mean: '(a + b) / 2', variance: '(b − a)² / 12', median: '(a + b) / 2' },
  { name: 'Exponential(λ)', support: '[0, ∞)', mean: '1 / λ', variance: '1 / λ²', median: 'ln 2 / λ' },
  { name: 'Normal(μ, σ)', support: '(−∞, ∞)', mean: 'μ', variance: 'σ²', median: 'μ' },
  { name: 'Beta(α, β)', support: '[0, 1]', mean: 'α / (α + β)', variance: 'αβ / ((α + β)²(α + β + 1))', median: 'no closed form' },
  { name: 'Gamma(k, θ)', support: '[0, ∞)', mean: 'kθ', variance: 'kθ²', median: 'no closed form' },
];

export default function PdfAndCdfPage() {
  return (
    <DetailPage subject="statistics" item="pdf-and-cdf">
      <PdfCdfVisualizer />

      <ContentSection title="Density and cumulative probability">
        <Prose>
          <p>
            A continuous random variable, like a waiting time or a measurement, can take any value in an interval. There are infinitely many such
            values, so the chance of hitting any one of them exactly is zero. Instead of listing probabilities, we describe X with a{' '}
            <strong>probability density function</strong> f(x): the probability that X lands in an interval is the area under f over that interval.
          </p>
          <p>
            The <strong>cumulative distribution function</strong> F(x) = P(X ≤ x) records that area as a running total from the left. It answers
            every interval question with a subtraction: P(a ≤ X ≤ b) = F(b) − F(a). The visualizer shows this side by side: the shaded area on the PDF
            and the highlighted rise on the CDF are always the same number.
          </p>
          <p>
            Going the other way, from a probability to a value, is the job of the <strong>quantile function</strong> F⁻¹(p). It gives medians,
            percentiles and the critical values used in confidence intervals and hypothesis tests. For the uniform and exponential it has a simple
            formula; for the normal, beta and gamma it is computed numerically, here by bisection on an accurate CDF.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="From density to probability">
            <Formula where={[{ symbol: 'f(x)', meaning: 'probability density function, f(x) ≥ 0 and total area 1' }]}>
              P(a ≤ X ≤ b) = ∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a)
            </Formula>
          </Callout>
          <Callout tone="formula" title="CDF and PDF are linked by calculus">
            <Formula>
              F(x) = ∫<sub>−∞</sub><sup>x</sup> f(t) dt,&nbsp;&nbsp; f(x) = F′(x)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Mean, variance and quantiles">
            <Formula where={[{ symbol: 'x_p', meaning: 'the p-quantile; x_0.5 is the median' }]}>
              E[X] = ∫ x f(x) dx,&nbsp;&nbsp; Var(X) = ∫ (x − E[X])² f(x) dx,&nbsp;&nbsp; x<sub>p</sub> = F⁻¹(p)
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="The distributions in the visualizer">
        <DataTable
          columns={[
            { header: 'Distribution', cell: 'name' },
            { header: 'Support', cell: 'support' },
            { header: 'Mean', cell: 'mean' },
            { header: 'Variance', cell: 'variance' },
            { header: 'Median', cell: 'median' },
          ]}
          rows={summaries}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick a distribution and move its parameter sliders. Both charts and the summary (mean, median, variance) update together.',
            'Choose which probability to show: P(X ≤ a), P(a ≤ X ≤ b) or P(X ≥ a).',
            'Drag on either chart to move the nearest marker. The shaded area on the PDF and the highlighted bar on the CDF axis always show the same probability.',
            'Compare the density f(a) with the probabilities. Squeeze a normal to σ = 0.3 or a beta to α = β = 10 and the density rises well above 1, while every probability stays between 0 and 1.',
            'Type a probability p into the quantile box to find the x with F(x) = p (the purple point on the CDF), then press Move a to this quantile to check that the area to its left is p.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception">
        The height of a PDF is not a probability. A Uniform(0, 0.5) density equals 2 everywhere on its support, and a Beta(0.5, 0.5) density is
        infinite at both ends, yet both have total area exactly 1. To get a probability you always need a width: an area under the PDF, or a
        difference of two CDF values.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Waiting for a bus"
            question="The time X (in minutes) until the next bus is exponential with mean 2 minutes. Find P(1 ≤ X ≤ 3), the median wait, and the 90th percentile of the wait."
            solution={
              <>
                <p>Mean 1/λ = 2, so λ = 0.5 and F(x) = 1 − e^(−0.5x)</p>
                <p>P(1 ≤ X ≤ 3) = F(3) − F(1) = e^(−0.5) − e^(−1.5) = 0.60653 − 0.22313 = 0.38340</p>
                <p>Median: 1 − e^(−0.5m) = 0.5, so m = ln 2 / 0.5 ≈ 1.386 minutes</p>
                <p>90th percentile: 1 − e^(−0.5x) = 0.9, so x = −ln(0.1) / 0.5 = 2 ln 10 ≈ 4.605 minutes</p>
                <p className="font-semibold text-emerald-700">P ≈ 0.383, median ≈ 1.39 min, 90th percentile ≈ 4.61 min</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: A beta density"
            question="X has density f(x) = 6x(1 − x) on [0, 1], which is Beta(2, 2). Find the CDF, P(X ≤ 0.25), P(0.25 ≤ X ≤ 0.75), the mean and the variance. What is the largest value of f?"
            solution={
              <>
                <p>F(x) = ∫₀ˣ 6t(1 − t) dt = 3x² − 2x³ for 0 ≤ x ≤ 1</p>
                <p>P(X ≤ 0.25) = 3(0.0625) − 2(0.015625) = 0.1875 − 0.03125 = 0.15625</p>
                <p>By symmetry F(0.75) = 1 − 0.15625 = 0.84375</p>
                <p>P(0.25 ≤ X ≤ 0.75) = 0.84375 − 0.15625 = 0.6875</p>
                <p>Mean = α/(α + β) = 2/4 = 0.5</p>
                <p>Variance = αβ/((α + β)²(α + β + 1)) = 4/(16 × 5) = 0.05</p>
                <p>Largest density: f(0.5) = 6 × 0.5 × 0.5 = 1.5, which is more than 1</p>
                <p className="font-semibold text-emerald-700">F(x) = 3x² − 2x³; 0.15625; 0.6875; mean 0.5; variance 0.05; max f = 1.5</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="statistics"
          current="pdf-and-cdf"
          items={[
            { slug: 'binomial-distribution', note: 'A discrete distribution, where probabilities are bar heights rather than areas' },
            { slug: 'poisson-distribution', note: 'Counts of events whose waiting times are exponential' },
            { slug: 'confidence-intervals', note: 'Normal and t quantiles set the width of every interval' },
            { subject: 'math', slug: 'normal-distribution', note: 'A closer look at the bell curve, z-scores and the 68-95-99.7 rule' },
            { subject: 'math', slug: 'integration-basics', note: 'Areas under curves, the calculus behind every CDF' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
