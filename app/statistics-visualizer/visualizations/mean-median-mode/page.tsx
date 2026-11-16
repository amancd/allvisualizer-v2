import type { Metadata } from 'next';
import { BarChart3, ListOrdered, MoveHorizontal, Scale } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import MeanMedianModeVisualizer from './MeanMedianModeVisualizer';

export const metadata: Metadata = {
  title: 'Mean, Median & Mode - Statistics Visualizer | AllVisualizer',
  description:
    'Drag data points on a number line and watch the mean, median and mode respond. See why outliers pull the mean but not the median, and why the mean is the balance point.',
  keywords: ['mean', 'median', 'mode', 'measures of center', 'average', 'outliers', 'skewness', 'standard deviation', 'range', 'statistics'],
};

const ideas = [
  {
    title: 'Mean: the balance point',
    icon: Scale,
    description: 'Add the values and divide by how many there are. Put equal weights at each value on a beam and the mean is where it balances.',
  },
  {
    title: 'Median: the middle value',
    icon: ListOrdered,
    description: 'Sort the data and take the middle one, or the average of the two middle ones. Half the values are at or below it, half at or above.',
  },
  {
    title: 'Mode: the most common value',
    icon: BarChart3,
    description: 'The value that appears most often. A dataset can have one mode, several, or none when every value is equally common.',
  },
  {
    title: 'Spread: how far values scatter',
    icon: MoveHorizontal,
    description: 'Two datasets can share a mean and look nothing alike. The range and standard deviation measure how spread out the values are.',
  },
];

const presets = [
  { name: 'Symmetric', n: '11', mean: '10', median: '10', mode: '10', shape: 'Mean = median = mode' },
  { name: 'Right-skewed', n: '13', mean: '6.08', median: '5', mode: '3', shape: 'Mode < median < mean' },
  { name: 'With outlier', n: '8', mean: '15', median: '10.5', mode: '10', shape: 'One value of 47 lifts the mean' },
  { name: 'Bimodal', n: '14', mean: '10', median: '10', mode: '5 and 15', shape: 'Center falls where there is no data' },
  { name: 'Salaries ($k)', n: '11', mean: '56.36', median: '40', mode: '40', shape: 'One high earner lifts the mean' },
];

const choosing = [
  { measure: 'Mean', best: 'Symmetric data without outliers; when totals matter', weakness: 'Pulled toward outliers and long tails' },
  { measure: 'Median', best: 'Skewed data such as incomes and house prices', weakness: 'Ignores how far out the extreme values are' },
  { measure: 'Mode', best: 'Categories (most common shoe size or answer)', weakness: 'May not exist or may not be unique' },
];

export default function MeanMedianModePage() {
  return (
    <DetailPage subject="statistics" item="mean-median-mode">
      <MeanMedianModeVisualizer />

      <ContentSection title="Three ways to describe the center">
        <Prose>
          <p>
            When people say &quot;the average&quot; they usually mean the <strong>mean</strong>, but it is only one of three common measures of
            center. The <strong>median</strong> is the middle of the sorted data and the <strong>mode</strong> is the most frequent value. On a
            symmetric dataset all three agree. On a skewed one they separate, and the order they fall in tells you which way the data lean.
          </p>
          <p>
            The mean uses every value&apos;s size, so a single extreme value moves it. The median only cares about order: make the largest value a
            million times bigger and the median does not move. That is why the median is called <strong>resistant</strong> to outliers, and why
            reports on incomes and house prices quote medians.
          </p>
          <p>
            The mean has a physical meaning. Put an equal weight at every data value on a weightless beam. The beam balances on a fulcrum placed
            at the mean, because the deviations x − x̄ always add up to zero. Move the fulcrum to the median on a skewed dataset and the beam tips
            toward the long tail.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Mean">
            <Formula
              where={[
                { symbol: 'x̄', meaning: 'sample mean (μ for a whole population)' },
                { symbol: 'n', meaning: 'number of values' },
              ]}
            >
              x̄ = (x₁ + x₂ + … + xₙ) / n = Σx / n
            </Formula>
          </Callout>
          <Callout tone="formula" title="Median (sort the data first)">
            <Formula>n odd: value in position (n + 1) / 2;&nbsp;&nbsp; n even: mean of the values in positions n / 2 and n / 2 + 1</Formula>
          </Callout>
          <Callout tone="formula" title="Balance property">
            <Formula>Σ(x − x̄) = 0</Formula>
          </Callout>
          <Callout tone="formula" title="Spread">
            <Formula
              where={[
                { symbol: 'σ', meaning: 'population standard deviation (divide by n)' },
                { symbol: 's', meaning: 'sample standard deviation (divide by n − 1)' },
              ]}
            >
              range = max − min,&nbsp; σ = √(Σ(x − x̄)² / n),&nbsp; s = √(Σ(x − x̄)² / (n − 1))
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Datasets in the visualizer">
        <DataTable
          columns={[
            { header: 'Dataset', cell: 'name' },
            { header: 'n', cell: 'n', numeric: true },
            { header: 'Mean', cell: 'mean', numeric: true },
            { header: 'Median', cell: 'median', numeric: true },
            { header: 'Mode', cell: 'mode', numeric: true },
            { header: 'What to notice', cell: 'shape' },
          ]}
          rows={presets}
        />
      </ContentSection>

      <ContentSection title="Which measure should you use?">
        <DataTable
          columns={[
            { header: 'Measure', cell: 'measure' },
            { header: 'Best for', cell: 'best' },
            { header: 'Weakness', cell: 'weakness' },
          ]}
          rows={choosing}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick a dataset. The dot plot stacks equal values, and the red, blue and green lines mark the mean, median and mode(s).',
            'Drag any dot along the number line. Watch the mean slide with it while the median only moves when the dot crosses the middle.',
            'Tap empty space to add a value. Double-tap a dot, or switch the tap tool to Remove, to delete one.',
            'Load With outlier and drag the 47 back toward the others. The mean drops from 15 toward the median while the median stays put.',
            'In the balance panel, switch the fulcrum between the mean and the median. At the mean the beam is always level; at the median it tips toward the long tail.',
            'Read the sorted list below the charts: the highlighted cell (or pair of cells) is where the median comes from.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common mix-up">
        The median is the middle of the <em>sorted data</em>, not the middle of the <em>range</em>. For 1, 2, 3, 4, 100 the median is 3, while
        the midpoint of the range, (1 + 100) / 2 = 50.5, is nowhere near the data. Likewise, &quot;most people earn the average salary&quot; is
        false whenever salaries are right-skewed: most earn less than the mean.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: One value changes"
            question="Find the mean, median and mode of 4, 7, 7, 9, 13. Then replace the 13 with 63 and find them again. Which measures changed?"
            solution={
              <>
                <p>Sum = 4 + 7 + 7 + 9 + 13 = 40, n = 5</p>
                <p>Mean = 40 / 5 = 8; median = 3rd value = 7; mode = 7</p>
                <p>With 63: sum = 4 + 7 + 7 + 9 + 63 = 90</p>
                <p>Mean = 90 / 5 = 18; median = 7; mode = 7</p>
                <p className="font-semibold text-emerald-700">Only the mean changed (8 → 18). The median and mode are unaffected by how extreme the largest value is.</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: The missing value"
            question="Five numbers have a mean of 12. Four of them are 8, 10, 14 and 15. Find the fifth number, the median, and the sample standard deviation s."
            solution={
              <>
                <p>Total = 5 × 12 = 60; known sum = 8 + 10 + 14 + 15 = 47</p>
                <p>Fifth number = 60 − 47 = 13</p>
                <p>Sorted: 8, 10, 13, 14, 15, so median = 13</p>
                <p>Deviations from 12: −4, −2, 1, 2, 3 (they add to 0)</p>
                <p>Squares: 16 + 4 + 1 + 4 + 9 = 34</p>
                <p>s = √(34 / 4) = √8.5 ≈ 2.92</p>
                <p className="font-semibold text-emerald-700">Fifth value 13, median 13, s ≈ 2.92 (σ = √(34/5) ≈ 2.61 if these five are the whole population)</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related visualizations">
        <RelatedItems
          subject="statistics"
          current="mean-median-mode"
          items={[
            { slug: 'law-of-large-numbers', note: 'Watch the running mean of many random trials settle on the expected value' },
            { slug: 'pdf-and-cdf', note: 'Mean and median of whole distributions, not just datasets' },
            { subject: 'math', slug: 'normal-distribution', note: 'The bell curve, where mean, median and mode coincide' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
