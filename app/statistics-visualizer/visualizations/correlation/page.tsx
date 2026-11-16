import type { Metadata } from 'next';
import { Crosshair, Grid2x2, Ruler, Spline } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import CorrelationVisualizer from './CorrelationVisualizer';

export const metadata: Metadata = {
  title: 'Correlation - Statistics Visualizer | AllVisualizer',
  description:
    "Generate scatter plots with any Pearson correlation, drag points to see how one outlier changes r, follow the covariance calculation and explore Anscombe's quartet.",
  keywords: ['correlation', 'Pearson correlation coefficient', 'r', 'covariance', 'scatter plot', "Anscombe's quartet", 'correlation vs causation', 'statistics'],
};

const ideas = [
  {
    title: 'Deviations from the means',
    icon: Crosshair,
    description: 'Draw lines at x̄ and ȳ. Points in the top-right and bottom-left add positive products (x − x̄)(y − ȳ); the other two corners add negative ones.',
  },
  {
    title: 'Covariance has units',
    icon: Ruler,
    description: 'Covariance is the average of those products. Its size depends on the units, so 0.5 or 500 can mean the same thing.',
  },
  {
    title: 'r is unit-free',
    icon: Grid2x2,
    description: 'Dividing by both standard deviations rescales covariance to r, which always lies between −1 and 1.',
  },
  {
    title: 'Straight lines only',
    icon: Spline,
    description: 'r measures how tightly the points follow a straight line. A perfect curve can have r = 0.',
  },
];

const claims = [
  { claim: 'r = 0.9 means a strong straight-line pattern', verdict: 'Usually', why: 'Only if the scatter plot looks linear; check Anscombe II to IV' },
  { claim: 'r = 0 means x and y are unrelated', verdict: 'No', why: 'y = x² on a symmetric range has r = 0 and a perfect relationship' },
  { claim: 'r is the slope of the line', verdict: 'No', why: 'Slope = r × sᵧ / sₓ, so it depends on units; r does not' },
  { claim: 'Changing units changes r', verdict: 'No', why: 'r is unchanged by any positive linear rescaling of x or y' },
  { claim: 'Swapping x and y changes r', verdict: 'No', why: 'The formula is symmetric in x and y' },
  { claim: 'A strong r proves x causes y', verdict: 'No', why: 'A third variable, reverse causation or coincidence can produce the same r' },
];

export default function CorrelationPage() {
  return (
    <DetailPage subject="statistics" item="correlation">
      <CorrelationVisualizer />

      <ContentSection title="What r measures">
        <Prose>
          <p>
            The <strong>Pearson correlation coefficient</strong> r is a single number between −1 and 1 that describes how closely a scatter plot
            follows a straight line. Its sign gives the direction (up to the right or down to the right), and its size gives the strength: r = ±1
            means every point lies exactly on a line, and r near 0 means no straight-line trend.
          </p>
          <p>
            The idea behind the formula is simple. Measure each point&apos;s deviation from the mean in both directions and multiply. Points in the
            top-right or bottom-left of the mean crosshair give positive products; points in the other two corners give negative ones. Their sum,
            scaled by n − 1, is the <strong>covariance</strong>. Divide by the two standard deviations and you get r, which no longer depends on the
            units of measurement.
          </p>
          <p>
            Because r is built from squared-distance quantities, it is sensitive to outliers. With a small sample, one point dragged far from the
            cloud can turn a strong positive r into a weak or even negative one. Always look at the scatter plot before trusting the number.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Sample covariance">
            <Formula>cov(x, y) = Σ(x − x̄)(y − ȳ) / (n − 1)</Formula>
          </Callout>
          <Callout tone="formula" title="Pearson correlation">
            <Formula
              where={[
                { symbol: 'sₓ, sᵧ', meaning: 'sample standard deviations of x and y' },
                { symbol: 'zₓ, zᵧ', meaning: 'standardized values (x − x̄)/sₓ and (y − ȳ)/sᵧ' },
              ]}
            >
              r = cov(x, y) / (sₓ sᵧ) = Σ(x − x̄)(y − ȳ) / √(Σ(x − x̄)² · Σ(y − ȳ)²) = Σ zₓzᵧ / (n − 1)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Link to the regression line">
            <Formula>slope b = r × sᵧ / sₓ,&nbsp;&nbsp; r² = fraction of the variance in y explained by the least-squares line</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="What r does and does not tell you">
        <DataTable
          columns={[
            { header: 'Claim', cell: 'claim' },
            { header: 'True?', cell: 'verdict' },
            { header: 'Why', cell: 'why' },
          ]}
          rows={claims}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'In Generate & drag, set the target r and the number of points. The generator rescales a random cloud so the sample r matches the target exactly.',
            'Press New sample to draw a different cloud with the same r, and notice how varied the pictures for one value of r can be.',
            'Turn on the deviation rectangles. Each point draws a rectangle to the mean crosshair: green ones add to the covariance, red ones subtract.',
            'Drag one point into an empty corner, or press Add an outlier, and watch r change. Try it with n = 10 and again with n = 200.',
            "Open Anscombe's quartet: four datasets with the same r ≈ 0.82 and completely different shapes.",
            'Open Nonlinear: y = x² and slide the x range. A perfect curve gives r = 0 on a symmetric range and r near 1 on a one-sided range.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Correlation is not causation">
        Ice cream sales and drownings are positively correlated, but ice cream does not cause drowning: hot weather drives both. A strong r can come
        from a lurking third variable, from y causing x instead of the other way round, or from chance in a small sample. Only a controlled experiment
        or careful causal analysis can show that changing x changes y.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Compute r by hand"
            question="Find the covariance and the correlation r for the points (1, 2), (2, 4), (3, 5), (4, 4), (5, 5)."
            solution={
              <>
                <p>x̄ = 15 / 5 = 3; ȳ = 20 / 5 = 4</p>
                <p>x − x̄: −2, −1, 0, 1, 2;&nbsp; y − ȳ: −2, 0, 1, 0, 1</p>
                <p>Σ(x − x̄)(y − ȳ) = 4 + 0 + 0 + 0 + 2 = 6</p>
                <p>Σ(x − x̄)² = 4 + 1 + 0 + 1 + 4 = 10;&nbsp; Σ(y − ȳ)² = 4 + 0 + 1 + 0 + 1 = 6</p>
                <p>cov = 6 / 4 = 1.5;&nbsp; sₓ = √(10/4) ≈ 1.581;&nbsp; sᵧ = √(6/4) ≈ 1.225</p>
                <p>r = 1.5 / (1.581 × 1.225) = 6 / √60 ≈ 0.775</p>
                <p className="font-semibold text-emerald-700">cov = 1.5, r ≈ 0.775 (a fairly strong positive linear association)</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Zero correlation, perfect relationship"
            question="(a) Compute r for x = −2, −1, 0, 1, 2 with y = x². (b) In another study the correlation between height in cm and weight in kg is 0.6. What is r if height is converted to inches and weight to pounds? What if weight is replaced by 100 − weight?"
            solution={
              <>
                <p>(a) y = 4, 1, 0, 1, 4; x̄ = 0, ȳ = 10 / 5 = 2</p>
                <p>x − x̄: −2, −1, 0, 1, 2;&nbsp; y − ȳ: 2, −1, −2, −1, 2</p>
                <p>Σ products = −4 + 1 + 0 − 1 + 4 = 0, so r = 0</p>
                <p>(b) Inches and pounds are positive multiples of cm and kg, so r stays 0.6</p>
                <p>100 − weight multiplies the deviations by −1, so r flips sign</p>
                <p className="font-semibold text-emerald-700">(a) r = 0 although y is fixed by x; (b) r = 0.6 after unit changes, r = −0.6 for 100 − weight</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related visualizations">
        <RelatedItems
          subject="statistics"
          current="correlation"
          items={[
            { slug: 'mean-median-mode', note: 'Means and standard deviations, the building blocks of r' },
            { slug: 'conditional-probability', note: 'Independent variables have r = 0, but r = 0 does not imply independence' },
            { subject: 'math', slug: 'linear-regression', note: 'Fit the least-squares line and see r² and residuals' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
