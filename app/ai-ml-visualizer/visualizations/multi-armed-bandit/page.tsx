import type { Metadata } from 'next';
import {
  Callout,
  CardGrid,
  type CodeSample,
  CodeTabs,
  ContentSection,
  DataTable,
  DetailPage,
  Formula,
  PracticeProblem,
  Prose,
  StepList,
  type CardGridItem,
} from '@/components/content';
import MultiArmedBanditVisualizer from './MultiArmedBanditVisualizer';

export const metadata: Metadata = {
  title: 'Multi-Armed Bandit - AI/ML Visualizer | AllVisualizer',
  description:
    'Compare ε-greedy, UCB1 and Thompson sampling on slot machines with hidden payout rates. Watch pull counts, value estimates, Beta posteriors and cumulative regret side by side.',
  keywords: ['multi-armed bandit', 'epsilon greedy', 'UCB', 'Thompson sampling', 'regret', 'exploration exploitation', 'reinforcement learning'],
};

const ideas: CardGridItem[] = [
  { title: 'Exploration', description: 'Pull arms you know little about, in case one of them is better than your current favourite.' },
  { title: 'Exploitation', description: 'Pull the arm that looks best so far, to collect reward now.' },
  { title: 'Regret', description: 'Reward lost compared with always pulling the best arm. Good strategies keep it growing slowly.' },
  { title: 'Uncertainty', description: 'An arm pulled 3 times has a much less reliable estimate than one pulled 300 times. UCB and Thompson sampling use this.' },
];

const strategies = [
  { name: 'ε-greedy', idea: 'Exploit the best estimate, but explore a random arm with probability ε', regret: 'Linear (keeps exploring forever at rate ε)' },
  { name: 'UCB1', idea: 'Pick the arm with the highest optimistic upper bound on its value', regret: 'Logarithmic, O(log T)' },
  { name: 'Thompson sampling', idea: 'Sample a plausible rate from each posterior and pick the highest sample', regret: 'Logarithmic, often lowest in practice' },
];

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `import math, random

def epsilon_greedy(counts, wins, eps):
    if random.random() < eps:
        return random.randrange(len(counts))
    return max(range(len(counts)), key=lambda k: wins[k] / counts[k] if counts[k] else 0)

def ucb1(counts, wins, c=math.sqrt(2)):
    for k, n in enumerate(counts):
        if n == 0:
            return k                      # try every arm once
    t = sum(counts)
    return max(range(len(counts)),
               key=lambda k: wins[k] / counts[k] + c * math.sqrt(math.log(t) / counts[k]))

def thompson(counts, wins):
    samples = [random.betavariate(1 + wins[k], 1 + counts[k] - wins[k]) for k in range(len(counts))]
    return max(range(len(counts)), key=lambda k: samples[k])

# After pulling arm k and seeing reward r (0 or 1):
#   counts[k] += 1; wins[k] += r`,
  },
  {
    label: 'TypeScript',
    language: 'typescript',
    code: `function ucb1(counts: number[], wins: number[], c = Math.SQRT2): number {
  const untried = counts.indexOf(0);
  if (untried !== -1) return untried;
  const t = counts.reduce((a, b) => a + b, 0);
  let best = 0, bestScore = -Infinity;
  counts.forEach((n, k) => {
    const score = wins[k] / n + c * Math.sqrt(Math.log(t) / n);
    if (score > bestScore) { bestScore = score; best = k; }
  });
  return best;
}`,
  },
];

export default function MultiArmedBanditPage() {
  return (
    <DetailPage subject="ai-ml" item="multi-armed-bandit">
      <MultiArmedBanditVisualizer />

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Press Run. Every step, each of the three strategies pulls one arm of its own copy of the machines.',
            'Watch the pull counts: a good strategy ends up pulling the best arm most of the time. The highlighted row is the arm just pulled.',
            'Compare the cumulative regret curves. ε-greedy grows in a straight line; UCB1 and Thompson sampling bend over and flatten.',
            'Watch the Thompson posteriors sharpen. Click Reveal payout rates to see where the true rates lie.',
            'Change ε and c mid-run. UCB1\'s theory uses c = √2, but that explores cautiously; on these machines c around 0.5 to 1 usually earns less regret.',
            'Press New machines for a fresh set of payout rates; sets where two arms are close are the hardest.',
          ]}
        />
      </ContentSection>

      <ContentSection title="The explore-exploit dilemma">
        <Prose>
          <p>
            Picture a row of slot machines, each paying out with a different unknown probability. Every pull you must choose: play the machine that has
            paid best so far, or try another one that might be better. Too little exploring and you can get stuck on a mediocre arm. Too much and you
            waste pulls on arms you already know are poor.
          </p>
          <p>
            The multi-armed bandit is reinforcement learning with a single state: there is no future to plan for, only the trade-off between learning
            and earning. The same trade-off appears in A/B testing, ad selection, clinical trials and recommendation systems.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
        <div className="mt-6">
          <DataTable
            columns={[
              { header: 'Strategy', cell: 'name' },
              { header: 'Idea', cell: 'idea' },
              { header: 'Regret growth', cell: 'regret' },
            ]}
            rows={strategies}
          />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Sample-average estimate">
            <Formula
              where={[
                { symbol: 'Q(a)', meaning: 'estimated payout rate of arm a' },
                { symbol: 'N(a)', meaning: 'number of times arm a has been pulled' },
              ]}
            >
              Q(a) = (total reward from a) / N(a)
            </Formula>
          </Callout>
          <Callout tone="formula" title="UCB1">
            <Formula
              where={[
                { symbol: 't', meaning: 'total pulls so far' },
                { symbol: 'c', meaning: 'exploration strength; c = √2 is the classic UCB1 choice' },
              ]}
            >
              a<sub>t</sub> = argmax<sub>a</sub> [ Q(a) + c √( ln t / N(a) ) ]
            </Formula>
          </Callout>
          <Callout tone="formula" title="Thompson sampling with a Beta posterior">
            <Formula
              where={[
                { symbol: 'S(a), F(a)', meaning: 'wins and losses of arm a so far' },
                { symbol: 'Beta(1, 1)', meaning: 'the uniform prior we start from' },
              ]}
            >
              θ<sub>a</sub> ~ Beta(1 + S(a), 1 + F(a)), then play argmax<sub>a</sub> θ<sub>a</sub>
            </Formula>
          </Callout>
          <Callout tone="formula" title="Cumulative regret">
            <Formula>
              Regret(T) = Σ<sub>t=1..T</sub> ( p* − p<sub>a<sub>t</sub></sub> )
            </Formula>
            <p className="mt-2 text-ink-muted">p* is the best arm&apos;s true rate. This is the expected regret, so luck on individual pulls does not add noise.</p>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Code">
        <CodeTabs samples={samples} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Which arm does UCB1 pull?"
            question="After t = 100 pulls, arm A has been pulled 40 times with average reward 0.60, and arm B 10 times with average 0.50. Using c = √2 ≈ 1.414, which arm does UCB1 pull next?"
            solution={
              <>
                <p>ln 100 ≈ 4.605</p>
                <p>A: 0.60 + 1.414 × √(4.605 / 40) = 0.60 + 1.414 × 0.339 ≈ 1.080</p>
                <p>B: 0.50 + 1.414 × √(4.605 / 10) = 0.50 + 1.414 × 0.679 ≈ 1.460</p>
                <p>B has the lower estimate but far more uncertainty, so its upper bound is higher.</p>
                <p className="font-semibold text-emerald-700">UCB1 pulls arm B</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Same mean, different certainty"
            question="Under Thompson sampling, arm A has 7 wins in 10 pulls and arm B has 1 win in 1 pull. What are their posteriors and posterior means, and what is the chance that B's sample exceeds 0.9?"
            solution={
              <>
                <p>A: Beta(1 + 7, 1 + 3) = Beta(8, 4), mean 8 / 12 ≈ 0.667</p>
                <p>B: Beta(1 + 1, 1 + 0) = Beta(2, 1), mean 2 / 3 ≈ 0.667</p>
                <p>Beta(2, 1) has density 2x and CDF x², so P(θ &gt; 0.9) = 1 − 0.9² = 0.19</p>
                <p>For Beta(8, 4) the same probability is only about 0.02, because its posterior is much narrower.</p>
                <p className="font-semibold text-emerald-700">Equal means, but B is sampled above 0.9 about 19% of the time, so it still gets explored</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
