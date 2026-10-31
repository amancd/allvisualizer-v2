import type { Metadata } from 'next';
import {
  Callout,
  CardGrid,
  type CodeSample,
  CodeTabs,
  ContentSection,
  DetailPage,
  Formula,
  PracticeProblem,
  Prose,
  StepList,
  type CardGridItem,
} from '@/components/content';
import ValueIterationVisualizer from './ValueIterationVisualizer';

export const metadata: Metadata = {
  title: 'Value Iteration - AI/ML Visualizer | AllVisualizer',
  description:
    'Interactive value iteration in an editable grid world. Watch the Bellman equation propagate state values sweep by sweep and the optimal policy emerge, with discount, step cost and slippery moves.',
  keywords: ['value iteration', 'policy iteration', 'Bellman equation', 'MDP', 'dynamic programming', 'reinforcement learning', 'discount factor'],
};

const concepts: CardGridItem[] = [
  { title: 'States and actions', description: 'Each open cell is a state. In every state the agent can try to move up, right, down or left.' },
  {
    title: 'Transition model',
    description: 'With slip probability p the move goes sideways instead (p/2 each way). Bumping into a wall or the edge leaves the agent in place.',
  },
  { title: 'Rewards', description: 'Every move costs the step cost. Entering the goal adds +1, entering a pit adds −1, and both end the episode.' },
  { title: 'Discount γ', description: 'A reward k steps away is worth γᵏ of a reward now. Smaller γ makes the agent short-sighted.' },
];

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `def value_iteration(states, actions, P, R, gamma=0.9, theta=1e-4):
    """P[s][a] -> list of (prob, next_state); R(s_next) -> reward."""
    V = {s: 0.0 for s in states}
    while True:
        delta, new_V = 0.0, {}
        for s in states:
            if is_terminal(s):
                new_V[s] = 0.0
                continue
            new_V[s] = max(
                sum(p * (R(s2) + gamma * V[s2]) for p, s2 in P[s][a])
                for a in actions
            )
            delta = max(delta, abs(new_V[s] - V[s]))
        V = new_V
        if delta < theta:
            break
    policy = {
        s: max(actions, key=lambda a: sum(p * (R(s2) + gamma * V[s2]) for p, s2 in P[s][a]))
        for s in states if not is_terminal(s)
    }
    return V, policy`,
  },
  {
    label: 'TypeScript',
    language: 'typescript',
    code: `function valueIteration(n: number, P: (s: number, a: number) => [number, number][],
                        R: (next: number) => number, terminal: (s: number) => boolean,
                        gamma = 0.9, theta = 1e-4): number[] {
  let V = new Array(n).fill(0);
  for (;;) {
    let delta = 0;
    const next = V.map((v, s) => {
      if (terminal(s)) return 0;
      let best = -Infinity;
      for (let a = 0; a < 4; a++) {
        const q = P(s, a).reduce((sum, [p, s2]) => sum + p * (R(s2) + gamma * V[s2]), 0);
        best = Math.max(best, q);
      }
      delta = Math.max(delta, Math.abs(best - v));
      return best;
    });
    V = next;
    if (delta < theta) return V;
  }
}`,
  },
];

export default function ValueIterationPage() {
  return (
    <DetailPage subject="ai-ml" item="value-iteration">
      <ValueIterationVisualizer />

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Press Run to sweep through every state repeatedly, or One sweep to go a step at a time. Cell colour and number show V(s); the arrow is the greedy action.',
            'Tap a cell (in "Tap to inspect" mode) to see its Bellman backup: the expected value of each of the four actions, and which one wins.',
            'Switch to "Tap to edit" and tap cells to cycle empty, wall, goal and pit. The algorithm restarts from V = 0 on every change.',
            'Raise the slip probability and watch the policy steer away from cells next to a pit. Raise the step cost and it prefers the shortest route, even past danger.',
            'Switch to policy iteration: it evaluates the current policy fully, then improves it. It needs far fewer iterations, but each one does more work.',
          ]}
        />
      </ContentSection>

      <ContentSection title="What value iteration does">
        <Prose>
          <p>
            A <strong>Markov decision process</strong> (MDP) describes a world where the next state depends only on the current state and the action. The
            value V(s) of a state is the total discounted reward an agent can expect from there if it acts optimally. Value iteration finds V by
            repeatedly applying the Bellman optimality equation to every state.
          </p>
          <p>
            Start with V = 0 everywhere. After one sweep, only cells next to the goal or a pit know about it. After two sweeps, cells two moves away
            do, and so on: information spreads outwards from the rewards one step per sweep. Because each sweep shrinks the error by at least a factor
            γ, the values converge, and acting greedily with respect to the converged values is an optimal policy.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={concepts} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Bellman optimality equation">
            <Formula
              where={[
                { symbol: "P(s' | s, a)", meaning: "probability of landing in s' after trying action a in s" },
                { symbol: "R(s, a, s')", meaning: 'reward for that transition (step cost, plus ±1 for a goal or pit)' },
                { symbol: 'γ', meaning: 'discount factor, 0 ≤ γ < 1' },
              ]}
            >
              V(s) = max<sub>a</sub> Σ<sub>s&apos;</sub> P(s&apos; | s, a) [ R(s, a, s&apos;) + γ V(s&apos;) ]
            </Formula>
          </Callout>
          <Callout tone="formula" title="Greedy policy from values">
            <Formula>
              π(s) = argmax<sub>a</sub> Σ<sub>s&apos;</sub> P(s&apos; | s, a) [ R(s, a, s&apos;) + γ V(s&apos;) ]
            </Formula>
          </Callout>
          <Callout tone="formula" title="Stopping rule">
            <Formula>
              stop when max<sub>s</sub> |V<sub>k+1</sub>(s) − V<sub>k</sub>(s)| &lt; θ
            </Formula>
            <p className="mt-2 text-ink-muted">The convergence chart plots this quantity on a log scale. It falls roughly like γᵏ, a straight line.</p>
          </Callout>
          <Callout tone="tip" title="Value iteration vs policy iteration">
            Value iteration does one cheap max-backup per state per sweep. Policy iteration alternates a full policy evaluation (solve V for a fixed
            policy) with a greedy improvement step, and usually stops after a handful of iterations because there are only finitely many policies.
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Code">
        <CodeTabs samples={samples} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: A three-cell corridor"
            question="A corridor has cells A, B and then a goal G (+1, terminal). Moves are deterministic, every move costs 0.04, γ = 0.9 and walls block the ends. Starting from V = 0, what are V(A) and V(B) after each sweep of value iteration?"
            solution={
              <>
                <p>Sweep 1: V(B) = −0.04 + 1 + 0.9 × 0 = 0.96 (move right into G).</p>
                <p>V(A): every action gives −0.04 + 0.9 × 0 = −0.04, so V(A) = −0.04.</p>
                <p>Sweep 2: V(A) = −0.04 + 0.9 × V(B) = −0.04 + 0.864 = 0.824. V(B) stays 0.96.</p>
                <p>Sweep 3: nothing changes, so max |ΔV| = 0 and the algorithm stops.</p>
                <p className="font-semibold text-emerald-700">V(B) = 0.96 and V(A) = 0.824, reached after two sweeps</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: One backup with slipping"
            question="Slip probability is 0.2, γ = 0.9 and the step reward is −0.04. From state s, moving Right lands in a cell with V = 0.8. The two sideways outcomes are Up (a wall, so the agent stays in s, where V(s) = 0.5) and Down (a cell with V = 0.3). What is Q(s, Right)?"
            solution={
              <>
                <p>Right succeeds with p = 0.8; each sideways slip has p = 0.1.</p>
                <p>0.8 × (−0.04 + 0.9 × 0.8) = 0.8 × 0.68 = 0.544</p>
                <p>0.1 × (−0.04 + 0.9 × 0.5) = 0.1 × 0.41 = 0.041</p>
                <p>0.1 × (−0.04 + 0.9 × 0.3) = 0.1 × 0.23 = 0.023</p>
                <p className="font-semibold text-emerald-700">Q(s, Right) = 0.544 + 0.041 + 0.023 = 0.608</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
