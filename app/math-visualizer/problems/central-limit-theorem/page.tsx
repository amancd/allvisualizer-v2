import type { Metadata } from 'next';
import { BarChart3, ClipboardCheck, Shuffle, Target } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, StepList } from '@/components/content';
import CentralLimitTheoremVisualizer from './CentralLimitTheoremVisualizer';

export const metadata: Metadata = {
  title: 'Central Limit Theorem - Statistics Visualizer | AllVisualizer',
  description:
    'Draw repeated samples from uniform, exponential, bimodal or dice populations and watch the distribution of sample means become normal, with spread σ/√n.',
  keywords: ['central limit theorem', 'CLT', 'sampling distribution', 'sample mean', 'standard error', 'normal approximation', 'statistics'],
};

const ideas = [
  {
    title: 'Population vs sample',
    icon: Shuffle,
    description: 'The population is the distribution you draw from. A sample is n values drawn from it, and its mean is a random number that changes every time you draw.',
  },
  {
    title: 'Sampling distribution',
    icon: BarChart3,
    description: 'Draw many samples and record each mean. The histogram of those means is the sampling distribution of the mean.',
  },
  {
    title: 'Center stays at μ',
    icon: Target,
    description: 'Sample means are unbiased: on average they equal the population mean μ, for any n.',
  },
  {
    title: 'Spread shrinks as σ/√n',
    icon: ClipboardCheck,
    description: 'Averaging cancels out noise. Quadrupling the sample size halves the spread of the sample means.',
  },
];

const populations = [
  { name: 'Uniform on [0, 10]', mean: '5', sd: '10/√12 ≈ 2.887', shape: 'Flat, symmetric' },
  { name: 'Exponential, λ = 0.5', mean: '2', sd: '2', shape: 'Strongly right-skewed' },
  { name: 'Bimodal (U[0, 3] or U[7, 10])', mean: '5', sd: '√13 ≈ 3.606', shape: 'Two humps, nothing in the middle' },
  { name: 'Fair die', mean: '3.5', sd: '√(35/12) ≈ 1.708', shape: 'Discrete, flat' },
  { name: 'Loaded die (0.40, 0.25, 0.15, 0.10, 0.06, 0.04)', mean: '2.29', sd: '≈ 1.430', shape: 'Discrete, right-skewed' },
];

export default function CentralLimitTheoremPage() {
  return (
    <DetailPage subject="math" item="central-limit-theorem">
      <CentralLimitTheoremVisualizer />

      <ContentSection title="What the theorem says">
        <Prose>
          <p>
            Take a population with mean μ and finite standard deviation σ. Draw a random sample of n independent values and compute its
            mean x̄. The <strong>central limit theorem</strong> says that, as n grows, the distribution of x̄ gets closer and closer to a
            normal distribution with mean μ and standard deviation σ/√n, <strong>whatever the shape of the population</strong>.
          </p>
          <p>
            That last part is the surprise. A flat, skewed or two-humped population all give bell-shaped sample means once n is large
            enough. How large depends on the population: symmetric ones like the uniform look normal by n ≈ 5, while a strongly skewed one
            like the exponential needs n ≈ 30 or more before the skew disappears.
          </p>
          <p>
            The theorem is why so many statistical methods (confidence intervals, z-tests, t-tests) use the normal distribution even when
            the raw data are not normal: they are about averages, and averages are approximately normal.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Sampling distribution of the mean">
            <Formula
              where={[
                { symbol: 'x̄', meaning: 'mean of a sample of n independent values' },
                { symbol: 'μ, σ', meaning: 'population mean and standard deviation' },
              ]}
            >
              E[x̄] = μ,&nbsp;&nbsp; SD(x̄) = σ / √n
            </Formula>
          </Callout>
          <Callout tone="formula" title="Central limit theorem">
            <Formula>for large n:&nbsp; x̄ ≈ N(μ, σ/√n),&nbsp; so&nbsp; z = (x̄ − μ) / (σ/√n) ≈ N(0, 1)</Formula>
          </Callout>
          <Callout tone="formula" title="Standard error">
            <Formula where={[{ symbol: 's', meaning: 'sample standard deviation, used when σ is unknown' }]}>SE = σ / √n&nbsp; (estimated by s / √n)</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Populations in the visualizer">
        <DataTable
          columns={[
            { header: 'Population', cell: 'name' },
            { header: 'μ', cell: 'mean', numeric: true },
            { header: 'σ', cell: 'sd', numeric: true },
            { header: 'Shape', cell: 'shape' },
          ]}
          rows={populations}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick a population. The top chart shows its shape and its mean μ.',
            'Pick a sample size n. Changing either setting clears the histogram.',
            'Press Draw 1 sample a few times. The orange dots are the n values drawn, and the red marker is their mean, which is added to the histogram below.',
            'Press Draw 1000 (or Auto-draw) to build up the histogram of sample means, and compare it with the red predicted normal curve.',
            'Compare the observed SD of the means with σ/√n in the side panel. They agree more closely the more samples you draw.',
            'Try the exponential population with n = 1, 5 and 30, and watch the skewed shape turn into a bell.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common mix-up">
        The CLT is about the distribution of the <em>sample mean</em>, not the data. Drawing a bigger sample from an exponential population
        does not make the individual values normal; it makes their average normal.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Average of dice rolls"
            question="A fair die is rolled 36 times. Using the CLT, estimate the probability that the average roll is greater than 4."
            solution={
              <>
                <p>For one roll: μ = 3.5, σ = √(35/12) ≈ 1.708</p>
                <p>SD of the mean: σ/√n = 1.708 / √36 = 1.708 / 6 ≈ 0.2846</p>
                <p>z = (4 − 3.5) / 0.2846 ≈ 1.76</p>
                <p>P(x̄ &gt; 4) ≈ 1 − Φ(1.76) ≈ 1 − 0.9608</p>
                <p className="font-semibold text-emerald-700">P ≈ 0.039, about a 4% chance</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Waiting times"
            question="Waiting times at a help desk are exponential with mean 2 minutes (so σ = 2 minutes). For a random sample of 100 customers, what is the probability that the average wait is between 1.6 and 2.4 minutes? How many customers would you need for the standard error to be 0.1 minutes?"
            solution={
              <>
                <p>SE = σ/√n = 2 / √100 = 0.2 minutes</p>
                <p>z for 1.6: (1.6 − 2) / 0.2 = −2;&nbsp; z for 2.4: (2.4 − 2) / 0.2 = 2</p>
                <p>P(−2 &lt; Z &lt; 2) = Φ(2) − Φ(−2) ≈ 0.9772 − 0.0228 = 0.9545</p>
                <p>For SE = 0.1: 2 / √n = 0.1, so √n = 20 and n = 400</p>
                <p className="font-semibold text-emerald-700">P ≈ 0.954; n = 400 customers (4× the sample halves the SE)</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
