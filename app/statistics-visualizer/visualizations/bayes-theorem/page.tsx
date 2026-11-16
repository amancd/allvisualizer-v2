import type { Metadata } from 'next';
import { Microscope, RefreshCw, Scale, Users } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import BayesTheoremVisualizer from './BayesTheoremVisualizer';

export const metadata: Metadata = {
  title: 'Bayes\' Theorem - Statistics Visualizer | AllVisualizer',
  description:
    'See why a positive result from an accurate medical test can still be unlikely to be right. Adjust prevalence, sensitivity and specificity and watch 1,000 people sort into true and false positives.',
  keywords: ['Bayes theorem', 'base rate fallacy', 'false positive', 'positive predictive value', 'sensitivity', 'specificity', 'prior', 'posterior'],
};

const ideas = [
  {
    title: 'Prior',
    icon: Users,
    description: 'What you believed before the evidence. For a screening test, the prior is the prevalence: the share of tested people who have the disease.',
  },
  {
    title: 'Likelihood',
    icon: Microscope,
    description: 'How likely the evidence is under each explanation: P(+ | disease) is the sensitivity and P(+ | healthy) is 1 − specificity.',
  },
  {
    title: 'Posterior',
    icon: Scale,
    description: 'What you should believe after the evidence: P(disease | +). It weighs the likelihoods by how common each explanation was to begin with.',
  },
  {
    title: 'Updating',
    icon: RefreshCw,
    description: 'Today’s posterior is tomorrow’s prior. Each new independent piece of evidence updates the belief again.',
  },
];

const ppvTable = [
  { prevalence: '0.1%', ppv: '1.0%', npv: '99.99%', note: 'About 99 of every 100 positives are false' },
  { prevalence: '1%', ppv: '9.2%', npv: '99.89%', note: 'About 9 of every 10 positives are false' },
  { prevalence: '10%', ppv: '52.6%', npv: '98.79%', note: 'A positive is roughly a coin flip' },
  { prevalence: '50%', ppv: '90.9%', npv: '90.10%', note: 'Now a positive is usually right' },
];

export default function BayesTheoremPage() {
  return (
    <DetailPage subject="statistics" item="bayes-theorem">
      <BayesTheoremVisualizer />

      <ContentSection title="Turning P(evidence | cause) into P(cause | evidence)">
        <Prose>
          <p>
            Tests are described by how they behave when you already know the truth. <strong>Sensitivity</strong> is P(+ | disease), the share of
            sick people who test positive. <strong>Specificity</strong> is P(− | healthy), the share of healthy people who test negative. But a
            patient holding a positive result wants the reverse: P(disease | +). <strong>Bayes&apos; theorem</strong> is the rule that converts one
            into the other.
          </p>
          <p>
            The conversion depends on the <strong>base rate</strong>. Take a test with 90% sensitivity and 91% specificity, used on a population where
            1% have the disease. Out of 1,000 people, 10 are sick and 9 of them test positive. Of the 990 healthy people, 9% (about 89) also test
            positive. So 98 people test positive and only 9 of them are sick: P(disease | +) = 9/98 ≈ 9.2%, even though the test is &quot;90%
            accurate&quot;.
          </p>
          <p>
            Thinking in counts of people like this, called <strong>natural frequencies</strong>, makes Bayes&apos; theorem almost obvious. The
            formula does the same calculation with probabilities instead of people.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Bayes' theorem">
            <Formula
              where={[
                { symbol: 'P(D)', meaning: 'prior: prevalence of the disease' },
                { symbol: 'P(+ | D)', meaning: 'sensitivity' },
                { symbol: 'P(+ | D′)', meaning: '1 − specificity, the false positive rate' },
                { symbol: 'P(D | +)', meaning: 'posterior, also called the positive predictive value' },
              ]}
            >
              P(D | +) = P(+ | D) P(D) / [P(+ | D) P(D) + P(+ | D′) P(D′)]
            </Formula>
          </Callout>
          <Callout tone="formula" title="Negative result">
            <Formula>P(D′ | −) = P(− | D′) P(D′) / [P(− | D′) P(D′) + P(− | D) P(D)]</Formula>
          </Callout>
          <Callout tone="formula" title="Odds form">
            <Formula where={[{ symbol: 'LR+', meaning: 'positive likelihood ratio = sensitivity / (1 − specificity)' }]}>
              posterior odds = prior odds × LR+
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Same test, different base rates">
        <DataTable
          caption="A test with 90% sensitivity and 91% specificity. Only the prevalence changes."
          columns={[
            { header: 'Prevalence', cell: 'prevalence', numeric: true },
            { header: 'P(disease | +)', cell: 'ppv', numeric: true },
            { header: 'P(healthy | −)', cell: 'npv', numeric: true },
            { header: 'What it means', cell: 'note' },
          ]}
          rows={ppvTable}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Set the prevalence, sensitivity and specificity, or pick a preset. The grid sorts 1,000 people: circles have the disease, squares do not, and filled shapes tested positive.',
            'Tick Show only positive tests. Compare the filled circles (true positives) with the filled squares (false positives): P(disease | +) is the share of circles.',
            'Follow the natural frequency tree from 1,000 people down to the four groups, and check that the panel on the right gives the same answer from the formula.',
            'Lower the prevalence and watch false positives swamp the true ones, even with sensitivity and specificity at 99%.',
            'Press Positive again to retest the same person. The posterior becomes the new prior, and a second positive usually raises the probability a lot.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="The base-rate fallacy">
        It is tempting to read &quot;90% sensitive&quot; as &quot;a positive means a 90% chance of disease&quot;. That ignores the base rate: when
        the disease is rare, the healthy group is so large that even a small false positive rate produces more false alarms than there are sick
        people. Always ask how common the condition is among the people being tested.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: A screening test"
            question="A disease affects 2% of the people screened. The test has 95% sensitivity and 90% specificity. What is the probability that someone who tests positive has the disease? What is the probability that someone who tests negative has it?"
            solution={
              <>
                <p>Out of 1,000 people: 20 sick, 980 healthy.</p>
                <p>True positives: 95% of 20 = 19. False negatives: 1.</p>
                <p>False positives: 10% of 980 = 98. True negatives: 882.</p>
                <p>P(D | +) = 19 / (19 + 98) = 19 / 117 ≈ 0.162</p>
                <p>With the formula: 0.95 × 0.02 / (0.95 × 0.02 + 0.10 × 0.98) = 0.019 / 0.117 ≈ 0.162</p>
                <p>P(D | −) = 1 / (1 + 882) = 1 / 883 ≈ 0.00113</p>
                <p className="font-semibold text-emerald-700">P(disease | +) ≈ 16.2%; P(disease | −) ≈ 0.11%</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Testing again"
            question="The person from Problem 1 who tested positive takes the same test again, and it is positive again. Assuming the two results are independent given the person's true status, what is the new probability that they have the disease?"
            solution={
              <>
                <p>New prior: P(D) = 19/117 ≈ 0.1624</p>
                <p>Numerator: 0.95 × 0.1624 ≈ 0.1543</p>
                <p>Denominator: 0.1543 + 0.10 × 0.8376 ≈ 0.1543 + 0.0838 = 0.2381</p>
                <p>P(D | +, +) ≈ 0.1543 / 0.2381 ≈ 0.648</p>
                <p>Check with odds: prior odds 19/98 ≈ 0.194, LR+ = 0.95 / 0.10 = 9.5, posterior odds ≈ 1.842, probability = 1.842 / 2.842 ≈ 0.648</p>
                <p className="font-semibold text-emerald-700">About 64.8%, up from 16.2% after one positive and 2% before testing</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="statistics"
          current="bayes-theorem"
          items={[
            { slug: 'conditional-probability', note: 'The definition of P(A | B) that Bayes’ theorem is built on' },
            { slug: 'type-i-ii-errors', note: 'False positives and false negatives in hypothesis testing' },
            { slug: 'hypothesis-testing', note: 'Why a small p-value is not the probability that the null hypothesis is true' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
