import type { Metadata } from 'next';
import { Activity, Factory, GraduationCap, Ruler } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, StepList } from '@/components/content';
import NormalDistributionVisualizer from './NormalDistributionVisualizer';

export const metadata: Metadata = {
  title: 'Normal Distribution - Statistics Visualizer | AllVisualizer',
  description:
    'Interactive bell curve: adjust the mean and standard deviation, shade the area between two bounds, read off probabilities and z-scores, and see the 68-95-99.7 rule.',
  keywords: ['normal distribution', 'bell curve', 'gaussian', 'standard deviation', 'z-score', '68-95-99.7 rule', 'empirical rule', 'probability'],
};

const zTable = [
  { z: '0.00', below: '0.5000', within: '0.0000' },
  { z: '0.50', below: '0.6915', within: '0.3829' },
  { z: '1.00', below: '0.8413', within: '0.6827' },
  { z: '1.645', below: '0.9500', within: '0.9000' },
  { z: '1.96', below: '0.9750', within: '0.9500' },
  { z: '2.00', below: '0.9772', within: '0.9545' },
  { z: '2.576', below: '0.9950', within: '0.9900' },
  { z: '3.00', below: '0.9987', within: '0.9973' },
];

const applications = [
  { title: 'Measurement error', icon: Ruler, description: 'Repeated measurements of the same quantity scatter around the true value in a bell shape.' },
  { title: 'Test scores', icon: GraduationCap, description: 'Standardized tests are often scaled so scores are roughly normal, which makes percentiles easy to compute from z-scores.' },
  { title: 'Quality control', icon: Factory, description: 'Factories flag parts more than 3σ from the target. Under a normal model only 0.27% of good parts fall that far out.' },
  { title: 'Biology', icon: Activity, description: 'Traits influenced by many small independent factors, like adult height, are close to normal.' },
];

export default function NormalDistributionPage() {
  return (
    <DetailPage subject="math" item="normal-distribution">
      <NormalDistributionVisualizer />

      <ContentSection title="What is the normal distribution?">
        <Prose>
          <p>
            The normal (or Gaussian) distribution is the symmetric, bell-shaped distribution described by two numbers: the{' '}
            <strong>mean μ</strong>, which sets where the peak is, and the <strong>standard deviation σ</strong>, which sets how spread out
            it is. Changing μ slides the curve left or right; increasing σ makes it lower and wider.
          </p>
          <p>
            The curve is a probability <em>density</em>, so the height at a point is not a probability. Probabilities are{' '}
            <strong>areas</strong>: the chance that X lands between a and b is the area under the curve between them, and the total area
            is always 1. That is why the curve gets shorter when it gets wider.
          </p>
          <p>
            Every normal distribution is a stretched and shifted copy of the <strong>standard normal</strong> Z, which has μ = 0 and σ = 1.
            The z-score converts a value x into &quot;how many standard deviations from the mean&quot;, so one table of Φ(z) answers questions
            about any normal distribution.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Probability density">
            <Formula
              where={[
                { symbol: 'μ', meaning: 'mean (center of the curve)' },
                { symbol: 'σ', meaning: 'standard deviation (spread), σ > 0' },
              ]}
            >
              f(x) = (1 / (σ√(2π))) · e<sup>−(x − μ)² / (2σ²)</sup>
            </Formula>
          </Callout>
          <Callout tone="formula" title="z-score">
            <Formula>z = (x − μ) / σ</Formula>
          </Callout>
          <Callout tone="formula" title="Probabilities from the CDF">
            <Formula
              where={[
                { symbol: 'Φ(z)', meaning: 'standard normal CDF, P(Z ≤ z) = ½[1 + erf(z/√2)]' },
              ]}
            >
              P(a &lt; X &lt; b) = Φ((b − μ)/σ) − Φ((a − μ)/σ)
            </Formula>
            <p className="mt-2">
              Useful identities: P(X &gt; a) = 1 − Φ(z<sub>a</sub>) and, by symmetry, Φ(−z) = 1 − Φ(z).
            </p>
          </Callout>
          <Callout tone="formula" title="Empirical rule (68-95-99.7)">
            <Formula>P(|X − μ| &lt; σ) ≈ 68.27%,&nbsp; P(|X − μ| &lt; 2σ) ≈ 95.45%,&nbsp; P(|X − μ| &lt; 3σ) ≈ 99.73%</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Standard normal reference values">
        <DataTable
          columns={[
            { header: 'z', cell: 'z', numeric: true },
            { header: 'Φ(z) = P(Z < z)', cell: 'below', numeric: true },
            { header: 'P(−z < Z < z)', cell: 'within', numeric: true },
          ]}
          rows={zTable}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Move the μ slider and watch the whole curve slide without changing shape.',
            'Move the σ slider. The curve flattens as it widens because the total area must stay 1. The vertical scale is fixed so you can see this.',
            'Choose Between, Below or Above, then drag on the chart (or use the sliders) to move the bounds a and b. The shaded area is the probability.',
            'Read the z-score of each bound and the calculation Φ(z_b) − Φ(z_a) in the panels below the chart.',
            'Turn on the 68-95-99.7 bands. Set a = μ − σ and b = μ + σ and check that the probability is about 0.6827 for any μ and σ.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Where it shows up">
        <CardGrid items={applications} />
      </ContentSection>

      <Callout tone="tip" title="Why so common?">
        The central limit theorem says that the average of many independent random effects is approximately normal, almost whatever the
        individual effects look like. That is why the bell curve appears in so many unrelated places.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Area between two values"
            question="Adult heights in a population are normal with μ = 170 cm and σ = 8 cm. What fraction of people are between 162 cm and 186 cm tall?"
            solution={
              <>
                <p>z for 162: (162 − 170) / 8 = −1</p>
                <p>z for 186: (186 − 170) / 8 = 2</p>
                <p>P = Φ(2) − Φ(−1) = 0.9772 − 0.1587</p>
                <p className="font-semibold text-emerald-700">P ≈ 0.8186, about 81.9% of people</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Working backwards from a probability"
            question="Exam scores are normal with μ = 70 and σ = 10. What score do you need to be in the top 5%?"
            solution={
              <>
                <p>We need x with P(X &gt; x) = 0.05, i.e. Φ(z) = 0.95.</p>
                <p>From the table, Φ(1.645) = 0.95, so z = 1.645.</p>
                <p>x = μ + zσ = 70 + 1.645 × 10</p>
                <p className="font-semibold text-emerald-700">x ≈ 86.45, so a score of about 86.5 or higher</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
