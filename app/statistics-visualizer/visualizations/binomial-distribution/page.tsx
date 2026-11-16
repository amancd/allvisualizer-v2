import type { Metadata } from 'next';
import { Coins, GitFork, Repeat, Sigma } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import BinomialDistributionVisualizer from './BinomialDistributionVisualizer';

export const metadata: Metadata = {
  title: 'Binomial Distribution - Statistics Visualizer | AllVisualizer',
  description:
    'Change n and p and watch the binomial PMF, its mean and standard deviation respond. Compute P(a ≤ X ≤ b) exactly, compare it with the normal approximation and build the distribution with an animated Galton board.',
  keywords: ['binomial distribution', 'Galton board', 'Bernoulli trials', 'n choose k', 'binomial PMF', 'normal approximation', 'continuity correction', 'probability'],
};

const ideas = [
  {
    title: 'Bernoulli trials',
    icon: Coins,
    description: 'Each trial has two outcomes, success with probability p and failure with probability 1 − p. A coin flip, a free throw or a yes/no survey answer.',
  },
  {
    title: 'Fixed n, independent, same p',
    icon: Repeat,
    description: 'The binomial model needs a fixed number of trials n, trials that do not influence each other, and the same success probability p every time.',
  },
  {
    title: 'Counting paths',
    icon: GitFork,
    description: 'There are C(n, k) different orders in which k successes can appear among n trials. Each order has probability pᵏ(1 − p)ⁿ⁻ᵏ, so the PMF multiplies the two.',
  },
  {
    title: 'Sum of simple pieces',
    icon: Sigma,
    description: 'X is a sum of n independent 0/1 variables. Means and variances of independent pieces add, which gives E[X] = np and Var(X) = np(1 − p) straight away.',
  },
];

const shapes = [
  { setting: 'p = 0.5', shape: 'Symmetric about n/2', example: 'Heads in fair coin flips' },
  { setting: 'p < 0.5', shape: 'Skewed right (long tail toward n)', example: 'Defective parts with p = 0.05' },
  { setting: 'p > 0.5', shape: 'Skewed left (long tail toward 0)', example: 'Free throws made by a 90% shooter' },
  { setting: 'np ≥ 10 and n(1 − p) ≥ 10', shape: 'Close to a normal curve', example: 'Votes for a candidate in a poll of 1000' },
  { setting: 'n large, p small, np moderate', shape: 'Close to Poisson(np)', example: 'Typos in a 500-page book' },
];

export default function BinomialDistributionPage() {
  return (
    <DetailPage subject="statistics" item="binomial-distribution">
      <BinomialDistributionVisualizer />

      <ContentSection title="What the binomial distribution counts">
        <Prose>
          <p>
            Repeat the same yes/no experiment n times, independently, with success probability p each time. The number of successes X is a
            random variable that can be 0, 1, 2, …, n. Its distribution is the <strong>binomial distribution</strong>, written X ~ Binomial(n, p)
            or B(n, p).
          </p>
          <p>
            A Galton board makes this physical. A ball falls through n rows of pegs and at each peg bounces right (a success) with probability p or
            left with probability 1 − p. The bin it lands in is the number of rights, so one ball is one draw of X. Drop thousands of balls and the
            pile in the bins takes the shape of the binomial PMF.
          </p>
          <p>
            The number of paths matters as much as the probability of each path. With n = 10 and p = 0.5 there is only one path to bin 0 but 252
            paths to bin 5, which is why the middle bins fill up and the edges stay almost empty.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Probability mass function">
            <Formula
              where={[
                { symbol: 'n', meaning: 'number of independent trials' },
                { symbol: 'p', meaning: 'probability of success on each trial' },
                { symbol: 'C(n, k)', meaning: 'n! / (k! (n − k)!), the number of ways to place k successes among n trials' },
              ]}
            >
              P(X = k) = C(n, k) · p<sup>k</sup> · (1 − p)<sup>n − k</sup>,&nbsp; k = 0, 1, …, n
            </Formula>
          </Callout>
          <Callout tone="formula" title="Mean, variance and mode">
            <Formula>
              E[X] = np,&nbsp;&nbsp; Var(X) = np(1 − p),&nbsp;&nbsp; σ = √(np(1 − p)),&nbsp;&nbsp; mode = ⌊(n + 1)p⌋
            </Formula>
          </Callout>
          <Callout tone="formula" title="Range probability and its normal approximation">
            <Formula where={[{ symbol: 'Φ', meaning: 'standard normal CDF' }, { symbol: '± 0.5', meaning: 'continuity correction: bar k covers [k − 0.5, k + 0.5]' }]}>
              P(a ≤ X ≤ b) = Σ<sub>k=a</sub><sup>b</sup> P(X = k) ≈ Φ((b + 0.5 − np)/σ) − Φ((a − 0.5 − np)/σ)
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How the shape depends on n and p">
        <DataTable
          columns={[
            { header: 'Setting', cell: 'setting' },
            { header: 'Shape', cell: 'shape' },
            { header: 'Example', cell: 'example' },
          ]}
          rows={shapes}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Set the number of trials n and the success probability p. The bar chart shows P(X = k) for every k, with the mean as a dashed line and μ ± σ as a bracket above.',
            'Choose a range with the a and b sliders, or tap a bar to move the nearest end. The shaded bars add up to the exact P(a ≤ X ≤ b) shown in the side panel.',
            'Turn on Normal approximation to overlay the bell curve N(np, np(1 − p)) and compare its continuity-corrected answer with the exact one. Try p = 0.05 with n = 20 to see it fail.',
            'In the Galton board, press Drop 1 to follow a single ball, Drop 50 or Play for a stream, and Add 1000 instantly to fill the bins fast.',
            'Watch the blue bars settle onto the red PMF lines, and the sample mean and variance approach np and np(1 − p). Changing n or p clears the board.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception">
        Not every count of successes is binomial. Drawing 5 cards from a deck and counting hearts is not, because the draws are made without
        replacement: each card changes the chance for the next one (that count is hypergeometric). The binomial model needs independent trials with
        the same p, which holds for sampling with replacement or, approximately, when the sample is a tiny fraction of a large population.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Guessing on a quiz"
            question="A quiz has 10 multiple-choice questions with 4 options each. A student guesses every answer at random. Find the probability of exactly 3 correct answers, the probability of passing with at least 5 correct, and the mean and standard deviation of the number correct."
            solution={
              <>
                <p>X ~ Binomial(n = 10, p = 0.25)</p>
                <p>P(X = 3) = C(10, 3) · 0.25³ · 0.75⁷ = 120 × 0.015625 × 0.133484 ≈ 0.2503</p>
                <p>P(X ≤ 4) = 0.05631 + 0.18771 + 0.28157 + 0.25028 + 0.14600 = 0.92187</p>
                <p>P(X ≥ 5) = 1 − 0.92187 = 0.07813</p>
                <p>μ = np = 10 × 0.25 = 2.5</p>
                <p>σ = √(np(1 − p)) = √(10 × 0.25 × 0.75) = √1.875 ≈ 1.369</p>
                <p className="font-semibold text-emerald-700">P(X = 3) ≈ 0.250, P(X ≥ 5) ≈ 0.078, μ = 2.5, σ ≈ 1.37</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Normal approximation for coin flips"
            question="A fair coin is flipped 100 times. The exact probability of getting between 45 and 55 heads (inclusive) is 0.7287. Estimate it with the normal approximation, first with and then without the continuity correction."
            solution={
              <>
                <p>μ = np = 50,&nbsp; σ = √(100 × 0.5 × 0.5) = 5</p>
                <p>np = n(1 − p) = 50 ≥ 10, so the approximation is reasonable</p>
                <p>With correction: P(44.5 ≤ Y ≤ 55.5), z = (44.5 − 50)/5 = −1.1 and z = (55.5 − 50)/5 = 1.1</p>
                <p>Φ(1.1) − Φ(−1.1) = 0.86433 − 0.13567 = 0.7287</p>
                <p>Without correction: z = ±1, so Φ(1) − Φ(−1) = 0.6827</p>
                <p className="font-semibold text-emerald-700">0.7287 with the correction (matches the exact value), 0.6827 without (too low by 0.046)</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="statistics"
          current="binomial-distribution"
          items={[
            { slug: 'poisson-distribution', note: 'The limit of Binomial(n, λ/n) as n grows: counts of rare events' },
            { slug: 'law-of-large-numbers', note: 'Why the Galton board histogram settles onto the PMF' },
            { slug: 'pdf-and-cdf', note: 'From probability masses to continuous densities and cumulative curves' },
            { subject: 'math', slug: 'normal-distribution', note: 'The bell curve that a binomial with large np and n(1 − p) approaches' },
            { subject: 'math', slug: 'central-limit-theorem', note: 'A binomial is a sum of n Bernoulli trials, so the CLT explains its bell shape' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
