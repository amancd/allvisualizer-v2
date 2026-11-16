import type { Metadata } from 'next';
import { Box, Fence, GitCompare, Split } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import BoxPlotsVisualizer from './BoxPlotsVisualizer';

export const metadata: Metadata = {
  title: 'Box Plots & Quartiles - Statistics Visualizer | AllVisualizer',
  description:
    'Build a box plot step by step: sort the data, find the median and quartiles, compute the IQR and 1.5 × IQR fences, flag outliers and compare two groups.',
  keywords: ['box plot', 'box and whisker plot', 'quartiles', 'IQR', 'interquartile range', 'five-number summary', 'outliers', '1.5 IQR rule', 'statistics'],
};

const ideas = [
  {
    title: 'Quartiles split the data in four',
    icon: Split,
    description: 'Q1, the median (Q2) and Q3 cut the sorted data into four groups with about a quarter of the values in each.',
  },
  {
    title: 'The box is the middle half',
    icon: Box,
    description: 'The box runs from Q1 to Q3, so its width is the interquartile range (IQR): the spread of the middle 50% of the data.',
  },
  {
    title: 'Fences catch outliers',
    icon: Fence,
    description: 'Values more than 1.5 × IQR below Q1 or above Q3 are flagged as outliers and drawn as separate points.',
  },
  {
    title: 'Built for comparison',
    icon: GitCompare,
    description: 'Stack box plots on one axis to compare the centers, spreads and skew of several groups at a glance.',
  },
];

const presets = [
  { name: 'Exam scores', n: '15', min: '52', q1: '64', med: '72', q3: '81', max: '95', iqr: '17', out: 'none' },
  { name: 'Commute times (min)', n: '12', min: '8', q1: '12', med: '16', q3: '22', max: '55', iqr: '10', out: '55' },
  { name: 'Outliers on both sides', n: '11', min: '2', q1: '23', med: '26', q3: '29', max: '49', iqr: '6', out: '2, 49' },
  { name: 'Plant heights: fertilizer', n: '11', min: '18', q1: '21', med: '24', q3: '26', max: '29', iqr: '5', out: 'none' },
  { name: 'Plant heights: control', n: '11', min: '12', q1: '15', med: '17', q3: '21', max: '31', iqr: '6', out: '31' },
];

export default function BoxPlotsPage() {
  return (
    <DetailPage subject="statistics" item="box-plots">
      <BoxPlotsVisualizer />

      <ContentSection title="From five numbers to a picture">
        <Prose>
          <p>
            A box plot (box-and-whisker plot) draws the <strong>five-number summary</strong>: minimum, first quartile Q1, median, third quartile Q3
            and maximum. The box spans Q1 to Q3 with a line at the median, and the whiskers reach out to the most extreme values that are not
            outliers.
          </p>
          <p>
            <strong>Method used here (median of halves):</strong> sort the data and find the median. Split the data into a lower half and an upper
            half. When n is odd, the median itself belongs to neither half. Q1 is the median of the lower half and Q3 is the median of the upper half.
            This is the method taught in most introductory courses and used by TI graphing calculators. Other methods exist: Tukey&apos;s hinges
            include the median in both halves when n is odd, and spreadsheet functions such as QUARTILE.INC interpolate between values, so software
            can give slightly different quartiles for the same small dataset.
          </p>
          <p>
            Because quartiles only depend on the order of the values, the box is <strong>resistant</strong> to outliers in the same way the median
            is. That makes the IQR a better measure of spread than the range when the data contain a few extreme values.
          </p>
          <p>
            The 1.5 × IQR rule is a convention, not a law. For data that really are normal, the fences sit about 2.7 standard deviations from the
            mean and flag only about 0.7% of values, so a flagged point is worth checking, not automatically deleting.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Interquartile range">
            <Formula>IQR = Q3 − Q1</Formula>
          </Callout>
          <Callout tone="formula" title="Outlier fences (Tukey's rule)">
            <Formula
              where={[
                { symbol: 'LF, UF', meaning: 'lower and upper fence' },
                { symbol: 'outlier', meaning: 'any value with x < LF or x > UF' },
              ]}
            >
              LF = Q1 − 1.5 × IQR,&nbsp;&nbsp; UF = Q3 + 1.5 × IQR
            </Formula>
          </Callout>
          <Callout tone="formula" title="Whiskers">
            <Formula>lower whisker = smallest value ≥ LF,&nbsp;&nbsp; upper whisker = largest value ≤ UF</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Datasets in the visualizer">
        <DataTable
          columns={[
            { header: 'Dataset', cell: 'name' },
            { header: 'n', cell: 'n', numeric: true },
            { header: 'Min', cell: 'min', numeric: true },
            { header: 'Q1', cell: 'q1', numeric: true },
            { header: 'Median', cell: 'med', numeric: true },
            { header: 'Q3', cell: 'q3', numeric: true },
            { header: 'Max', cell: 'max', numeric: true },
            { header: 'IQR', cell: 'iqr', numeric: true },
            { header: 'Outliers', cell: 'out', numeric: true },
          ]}
          rows={presets}
        />
      </ContentSection>

      <ContentSection title="Reading a box plot">
        <Prose>
          <ul>
            <li>
              <strong>Center:</strong> compare the median lines. In the plant data the fertilizer median (24 cm) is above the whole control box
              (Q3 = 21 cm), which is a large difference.
            </li>
            <li>
              <strong>Spread:</strong> a wider box means a larger IQR. Long whiskers mean the outer quarters are spread out, not that they contain
              more values.
            </li>
            <li>
              <strong>Skew:</strong> if the median sits near the left of the box and the right whisker is long, the data are right-skewed, like the
              commute times.
            </li>
            <li>
              <strong>What it hides:</strong> a box plot cannot show gaps or two separate clusters. That is why the visualizer draws a dot plot or
              histogram of the same data underneath.
            </li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick a dataset, or type your own numbers into the data box and press Apply.',
            'Use Back and Next (or the numbered step chips) to build the box plot one stage at a time. The sorted list shows the halves and the values each quartile comes from.',
            'Drag any dot sideways to change that value. The quartiles, fences and outlier flags update as you drag.',
            'Drag a value just past a fence and watch it turn red and leave the whisker.',
            'Switch Below each box to Histogram to see the same data as bars.',
            'Choose Compare two to stack a second group on the same axis, then compare the medians, boxes and whiskers.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common mix-up">
        Each of the four sections of a box plot (lower whisker, left part of the box, right part of the box, upper whisker) holds about a quarter of
        the data. A longer section does <em>not</em> contain more values; it means those values are more spread out.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Odd number of values"
            question="Find the five-number summary, IQR, fences and any outliers for: 3, 5, 7, 8, 9, 11, 13, 15, 40."
            solution={
              <>
                <p>n = 9 (odd), already sorted. Median = 5th value = 9</p>
                <p>Lower half (median left out): 3, 5, 7, 8 → Q1 = (5 + 7) / 2 = 6</p>
                <p>Upper half: 11, 13, 15, 40 → Q3 = (13 + 15) / 2 = 14</p>
                <p>IQR = 14 − 6 = 8; 1.5 × IQR = 12</p>
                <p>LF = 6 − 12 = −6; UF = 14 + 12 = 26</p>
                <p>40 &gt; 26, so 40 is an outlier. Whiskers run from 3 to 15.</p>
                <p className="font-semibold text-emerald-700">Min 3, Q1 6, median 9, Q3 14, max 40; IQR 8; outlier: 40</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Even number of values"
            question="Daily deliveries over 10 days were 12, 15, 18, 20, 21, 23, 25, 26, 30, 45. Find Q1, the median, Q3, the fences and the whisker ends. Is 12 an outlier?"
            solution={
              <>
                <p>n = 10 (even). Median = (5th + 6th) / 2 = (21 + 23) / 2 = 22</p>
                <p>Lower half: 12, 15, 18, 20, 21 → Q1 = 18</p>
                <p>Upper half: 23, 25, 26, 30, 45 → Q3 = 26</p>
                <p>IQR = 26 − 18 = 8; 1.5 × IQR = 12</p>
                <p>LF = 18 − 12 = 6; UF = 26 + 12 = 38</p>
                <p>45 &gt; 38 is an outlier; 12 ≥ 6 is not</p>
                <p className="font-semibold text-emerald-700">Q1 18, median 22, Q3 26; fences 6 and 38; whiskers 12 to 30; only 45 is an outlier</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related visualizations">
        <RelatedItems
          subject="statistics"
          current="box-plots"
          items={[
            { slug: 'pdf-and-cdf', note: 'Quartiles of a distribution are where its CDF reaches 0.25, 0.5 and 0.75' },
            { subject: 'math', slug: 'normal-distribution', note: 'For normal data the IQR is about 1.35 standard deviations' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
