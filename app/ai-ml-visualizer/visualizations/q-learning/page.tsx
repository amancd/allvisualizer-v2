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
import QLearningVisualizer from './QLearningVisualizer';

export const metadata: Metadata = {
  title: 'Q-Learning - AI/ML Visualizer | AllVisualizer',
  description:
    'Train a Q-learning agent in a grid world and watch its Q-table fill in. Tune the learning rate, discount and ε-greedy exploration, inspect each temporal-difference update, and compare with SARSA on the cliff walk.',
  keywords: ['Q-learning', 'SARSA', 'temporal difference', 'Q-table', 'epsilon greedy', 'reinforcement learning', 'cliff walking'],
};

const params: CardGridItem[] = [
  { title: 'Learning rate α', description: 'How far each update moves Q(s, a) toward the new target. Large α learns fast but is noisy; small α is smooth but slow.' },
  { title: 'Discount γ', description: 'How much future reward counts. With γ near 1 the agent plans for the long run; with small γ it grabs nearby reward.' },
  { title: 'Exploration ε', description: 'The chance of taking a random action instead of the best known one. Decaying ε explores early and exploits later.' },
  { title: 'Episodes', description: 'One run from the start until the agent reaches a goal or pit, or hits the step limit. Learning happens across many of them.' },
];

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `import random
from collections import defaultdict

def q_learning(env, episodes=500, alpha=0.5, gamma=0.9, eps=0.3):
    Q = defaultdict(lambda: [0.0] * 4)   # Q[state][action]
    for _ in range(episodes):
        s, done = env.reset(), False
        while not done:
            if random.random() < eps:
                a = random.randrange(4)                 # explore
            else:
                a = max(range(4), key=lambda i: Q[s][i])  # exploit
            s2, r, done = env.step(a)
            target = r if done else r + gamma * max(Q[s2])
            Q[s][a] += alpha * (target - Q[s][a])       # TD update
            s = s2
        eps = max(0.01, eps * 0.99)
    return Q`,
  },
  {
    label: 'TypeScript',
    language: 'typescript',
    code: `// One Q-learning step. Q is a flat array: Q[s * 4 + a].
function qLearningStep(Q: Float64Array, s: number, a: number, r: number,
                       s2: number, done: boolean, alpha: number, gamma: number) {
  const best = Math.max(Q[s2 * 4], Q[s2 * 4 + 1], Q[s2 * 4 + 2], Q[s2 * 4 + 3]);
  const target = done ? r : r + gamma * best;
  Q[s * 4 + a] += alpha * (target - Q[s * 4 + a]);
}

// SARSA differs in one place: it bootstraps from the action it will actually take.
//   const target = done ? r : r + gamma * Q[s2 * 4 + a2];`,
  },
];

export default function QLearningPage() {
  return (
    <DetailPage subject="ai-ml" item="q-learning">
      <QLearningVisualizer />

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Press Run at Watch speed to follow the agent (the blue dot) one move at a time. The amber outline marks the Q-value that was just updated.',
            'Each cell is split into four triangles, one per action. Colour shows Q(s, a): green for good, red for bad. The arrow is the greedy action.',
            'Switch speed to Fast or Max, or press +100 episodes, to train quickly. Watch reward per episode climb and steps per episode fall.',
            'Read the last temporal-difference update panel to follow the exact arithmetic behind each change.',
            'Choose Cliff walk, train Q-learning for a few hundred episodes, then switch to SARSA and train again. The reward chart keeps the previous run so you can compare.',
            'Turn on Edit map and tap cells to add walls, goals or pits. Editing resets the agent.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Learning by trial and error">
        <Prose>
          <p>
            Value iteration needs a full model of the world: every transition probability and reward. Q-learning needs none of that. The agent just
            acts, sees what happens, and nudges its estimate of Q(s, a), the expected return of taking action a in state s and acting well afterwards.
          </p>
          <p>
            Each update compares the old estimate with a <strong>target</strong> built from one real step: the reward received plus the discounted
            value of the best action in the next state. The difference is the <strong>temporal-difference (TD) error</strong>. Repeat this enough times,
            while still exploring, and the Q-table converges to the optimal action values. Good values spread backwards from the goal, one episode at a
            time.
          </p>
          <p>
            Q-learning is <strong>off-policy</strong>: it learns the value of acting greedily even while it behaves ε-greedily. SARSA is{' '}
            <strong>on-policy</strong>: it learns the value of the ε-greedy behaviour it actually follows. On the cliff walk that difference matters.
            Q-learning learns the shortest path right along the cliff edge and keeps falling off during exploration; SARSA accounts for its own random
            moves and learns a safer path one row up, earning more reward while it trains.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={params} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Q-learning update">
            <Formula
              where={[
                { symbol: 'α', meaning: 'learning rate' },
                { symbol: 'γ', meaning: 'discount factor' },
                { symbol: "r + γ max Q(s', a')", meaning: 'the TD target; just r when s′ is terminal' },
              ]}
            >
              Q(s, a) ← Q(s, a) + α [ r + γ max<sub>a&apos;</sub> Q(s&apos;, a&apos;) − Q(s, a) ]
            </Formula>
          </Callout>
          <Callout tone="formula" title="SARSA update">
            <Formula>
              Q(s, a) ← Q(s, a) + α [ r + γ Q(s&apos;, a&apos;) − Q(s, a) ], where a&apos; is the action actually chosen in s&apos;
            </Formula>
          </Callout>
          <Callout tone="formula" title="ε-greedy action selection">
            <Formula>a = random action with probability ε, otherwise argmax<sub>a</sub> Q(s, a)</Formula>
          </Callout>
          <Callout tone="warning" title="Exploration is not optional">
            With ε = 0 the agent repeats whatever first worked and may never find a better route. Try it on the maze: set ε to 0 before training and
            compare with ε = 0.3.
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Code">
        <CodeTabs samples={samples} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: One Q-learning update"
            question="Q(s, Right) = 0.50. The agent moves Right, receives r = −0.04 and lands in s′ whose Q-values are 0.80, 0.20, 0.10 and 0.30. With α = 0.1 and γ = 0.9, what is the new Q(s, Right)?"
            solution={
              <>
                <p>max Q(s′, ·) = 0.80</p>
                <p>target = −0.04 + 0.9 × 0.80 = 0.68</p>
                <p>δ = 0.68 − 0.50 = 0.18</p>
                <p>Q(s, Right) ← 0.50 + 0.1 × 0.18 = 0.518</p>
                <p className="font-semibold text-emerald-700">Q(s, Right) = 0.518</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: The same step under SARSA"
            question="Repeat Problem 1 with SARSA. In s′ the ε-greedy policy happens to explore and picks the action whose value is 0.20. What is the new Q(s, Right), and why does this make SARSA more cautious near a cliff?"
            solution={
              <>
                <p>SARSA uses Q(s′, a′) for the action actually taken: 0.20.</p>
                <p>target = −0.04 + 0.9 × 0.20 = 0.14</p>
                <p>δ = 0.14 − 0.50 = −0.36</p>
                <p>Q(s, Right) ← 0.50 + 0.1 × (−0.36) = 0.464</p>
                <p>
                  SARSA folds the cost of its own exploratory moves into its values. Next to a cliff, those random moves sometimes fall off, so cells along
                  the edge get low values and SARSA learns to keep its distance.
                </p>
                <p className="font-semibold text-emerald-700">Q(s, Right) = 0.464 (Q-learning gave 0.518)</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
