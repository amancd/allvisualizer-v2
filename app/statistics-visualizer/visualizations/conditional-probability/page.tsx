import type { Metadata } from 'next';
import { Filter, GitBranch, Link2Off, Table2 } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import ConditionalProbabilityVisualizer from './ConditionalProbabilityVisualizer';

export const metadata: Metadata = {
  title: 'Conditional Probability - Statistics Visualizer | AllVisualizer',
  description:
    'Explore P(A | B) with an area-proportional Venn diagram, a probability tree and a contingency table that stay in sync, and test whether two events are independent.',
  keywords: ['conditional probability', 'P(A|B)', 'Venn diagram', 'probability tree', 'contingency table', 'independent events', 'multiplication rule'],
};

const ideas = [
  {
    title: 'Shrink the universe',
    icon: Filter,
    description: 'Conditioning on B throws away every outcome outside B. P(A | B) is the share of B that is also in A.',
  },
  {
    title: 'Multiplication rule',
    icon: GitBranch,
    description: 'Multiply along the branches of a tree: P(A ∩ B) = P(A) × P(B | A). Add the leaves you need to get P(B).',
  },
  {
    title: 'Independence',
    icon: Link2Off,
    description: 'A and B are independent when P(A | B) = P(A), which is the same as P(A ∩ B) = P(A) × P(B).',
  },
  {
    title: 'Counts make it concrete',
    icon: Table2,
    description: 'A table of 100 or 1,000 people turns every probability into a count, and every conditional probability into a fraction of a row or column.',
  },
];

const rules = [
  { rule: 'Conditional probability', formula: 'P(A | B) = P(A ∩ B) / P(B)', note: 'Needs P(B) > 0' },
  { rule: 'Multiplication rule', formula: 'P(A ∩ B) = P(A) P(B | A)', note: 'Multiply along tree branches' },
  { rule: 'Addition rule', formula: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', note: 'Subtract the overlap counted twice' },
  { rule: 'Complement', formula: 'P(A′ | B) = 1 − P(A | B)', note: 'Conditioning keeps total probability 1' },
  { rule: 'Total probability', formula: 'P(B) = P(B | A) P(A) + P(B | A′) P(A′)', note: 'Add the leaves of the tree that end in B' },
  { rule: 'Independence', formula: 'P(A ∩ B) = P(A) P(B)', note: 'Equivalent to P(A | B) = P(A)' },
];

export default function ConditionalProbabilityPage() {
  return (
    <DetailPage subject="statistics" item="conditional-probability">
      <ConditionalProbabilityVisualizer />

      <ContentSection title="What conditioning means">
        <Prose>
          <p>
            The <strong>conditional probability</strong> P(A | B), read &quot;the probability of A given B&quot;, is the chance that A happens once you
            know that B has happened. Knowing B rules out every outcome outside B, so B becomes the new universe. Within it, the outcomes where A
            also happens are exactly A ∩ B, so P(A | B) = P(A ∩ B) / P(B).
          </p>
          <p>
            The order matters. P(A | B) and P(B | A) share a numerator, P(A ∩ B), but divide it by different things. If 30% of people are in both A
            and B, 50% are in B and 40% are in A, then P(A | B) = 0.30 / 0.50 = 0.6 while P(B | A) = 0.30 / 0.40 = 0.75. Mixing the two up is one
            of the most common errors in reasoning about chance.
          </p>
          <p>
            Two events are <strong>independent</strong> when learning one tells you nothing about the other: P(A | B) = P(A). Independence is not the
            same as being disjoint. Disjoint events with positive probabilities are strongly dependent, because if one happens the other cannot.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Definition">
            <Formula
              where={[
                { symbol: 'A ∩ B', meaning: 'both A and B happen' },
                { symbol: 'P(B)', meaning: 'probability of the condition, must be greater than 0' },
              ]}
            >
              P(A | B) = P(A ∩ B) / P(B)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Multiplication rule and total probability">
            <Formula where={[{ symbol: 'A′', meaning: 'the complement of A, “not A”' }]}>
              P(A ∩ B) = P(A) P(B | A),&nbsp;&nbsp; P(B) = P(A) P(B | A) + P(A′) P(B | A′)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Valid overlap">
            <Formula>max(0, P(A) + P(B) − 1) ≤ P(A ∩ B) ≤ min(P(A), P(B))</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Rules at a glance">
        <DataTable
          columns={[
            { header: 'Rule', cell: 'rule' },
            { header: 'Formula', cell: (row) => <span className="font-mono">{row.formula}</span> },
            { header: 'Note', cell: 'note' },
          ]}
          rows={rules}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Set P(A) and P(B) with the sliders. The P(A ∩ B) slider only allows values that can actually happen: the overlap cannot exceed the smaller event, and it must be at least P(A) + P(B) − 1.',
            'Click circle B (or press Given B). Everything outside B fades out and the read-out below the diagram explains P(A | B) as a fraction of B. Click A to condition on A instead, or outside both circles to undo.',
            'Follow the same numbers through the probability tree: multiply P(A) by P(B | A) along the branches to reach P(A ∩ B) at the leaf.',
            'Read the contingency table as counts out of 100 or 1,000 people. The highlighted column or row is the population you are conditioning on.',
            'Use the independence panel to compare P(A ∩ B) with P(A) × P(B), and try the presets to see disjoint, nested and independent events.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common mistake: confusing P(A | B) with P(B | A)">
        Most professional basketball players are tall, so P(tall | plays in the NBA) is close to 1. That does not make P(plays in the NBA | tall)
        large: there are millions of tall people and only a few hundred NBA players. Swapping the condition and the event is called the
        confusion of the inverse, and Bayes&apos; theorem is the tool that converts one into the other correctly.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Students and subjects"
            question="In a class of 200 students, 120 take math, 80 take physics and 50 take both. A student is picked at random. Find P(physics | math), P(math | physics) and P(neither). Are taking math and taking physics independent?"
            solution={
              <>
                <p>P(M) = 120/200 = 0.6, P(Ph) = 80/200 = 0.4, P(M ∩ Ph) = 50/200 = 0.25</p>
                <p>P(Ph | M) = 50 / 120 ≈ 0.417</p>
                <p>P(M | Ph) = 50 / 80 = 0.625</p>
                <p>P(M ∪ Ph) = 0.6 + 0.4 − 0.25 = 0.75, so P(neither) = 1 − 0.75 = 0.25 (50 students)</p>
                <p>P(M) × P(Ph) = 0.6 × 0.4 = 0.24, which is not equal to 0.25, so they are not independent (slightly positively associated).</p>
                <p className="font-semibold text-emerald-700">P(Ph | M) ≈ 0.417, P(M | Ph) = 0.625, P(neither) = 0.25; not independent</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Two aces"
            question="Two cards are drawn from a standard 52-card deck without replacement. Find the probability that both are aces, the probability that the second card is an ace, and the probability that the first card was an ace given that the second one is."
            solution={
              <>
                <p>P(both aces) = P(1st ace) × P(2nd ace | 1st ace) = 4/52 × 3/51 = 12/2652 = 1/221 ≈ 0.00452</p>
                <p>P(2nd ace) = 4/52 × 3/51 + 48/52 × 4/51 = (12 + 192)/2652 = 204/2652 = 1/13 ≈ 0.0769</p>
                <p>P(1st ace | 2nd ace) = (1/221) / (1/13) = 13/221 = 1/17 ≈ 0.0588</p>
                <p>The second card on its own is just as likely to be an ace as the first; only knowing the first card changes it.</p>
                <p className="font-semibold text-emerald-700">1/221 ≈ 0.0045; 1/13 ≈ 0.077; 1/17 ≈ 0.059</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="statistics"
          current="conditional-probability"
          items={[
            { slug: 'bayes-theorem', note: 'Flip P(evidence | cause) into P(cause | evidence)' },
            { slug: 'binomial-distribution', note: 'Independent trials multiplied together give the binomial formula' },
            { slug: 'type-i-ii-errors', note: 'Error rates of a test are conditional probabilities given the truth' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
