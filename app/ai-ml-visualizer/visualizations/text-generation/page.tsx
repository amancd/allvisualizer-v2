import type { Metadata } from 'next';
import {
  Callout,
  CardGrid,
  CodeTabs,
  ContentSection,
  DataTable,
  DetailPage,
  Formula,
  PracticeProblem,
  Prose,
  StepList,
  type CardGridItem,
  type CodeSample,
} from '@/components/content';
import TextGenerationVisualizer from './TextGenerationVisualizer';

export const metadata: Metadata = {
  title: 'Text Generation & Sampling - AI/ML Visualizer | AllVisualizer',
  description:
    'See how temperature, top-k and top-p reshape next-token probabilities. Sample or greedy-decode a sentence token by token and watch the entropy change.',
  keywords: ['text generation', 'temperature', 'top-k', 'top-p', 'nucleus sampling', 'softmax', 'greedy decoding', 'entropy', 'LLM'],
};

const strategies = [
  { name: 'Greedy', how: 'Always take the most likely token', effect: 'Deterministic; can get repetitive or bland' },
  { name: 'Temperature', how: 'Divide logits by T before softmax', effect: 'T < 1 sharper, T > 1 flatter, T → 0 is greedy' },
  { name: 'Top-k', how: 'Keep only the k most likely tokens', effect: 'Removes the long tail, but k is the same for confident and uncertain steps' },
  { name: 'Top-p (nucleus)', how: 'Keep the smallest set whose probability sums to p', effect: 'Adapts: few tokens when confident, many when uncertain' },
];

const ideas: CardGridItem[] = [
  { title: 'One token at a time', description: 'The model outputs a score for every token in its vocabulary; one is picked, appended to the text, and the process repeats.' },
  { title: 'Logits become probabilities', description: 'Softmax turns raw scores into a probability distribution that sums to 1.' },
  { title: 'Entropy measures uncertainty', description: 'A confident prediction (the capital of France) has low entropy; an open question (a favourite colour) has high entropy.' },
  { title: 'Seeds make sampling repeatable', description: 'Sampling uses random numbers. Fixing the seed reproduces the same choices, which is how this page stays deterministic.' },
];

const code: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `import numpy as np

def sample_next(logits, temperature=1.0, top_k=0, top_p=1.0, rng=np.random.default_rng(42)):
    if temperature == 0:
        return int(np.argmax(logits))                 # greedy
    z = np.asarray(logits) / temperature
    probs = np.exp(z - z.max())
    probs /= probs.sum()

    order = np.argsort(-probs)
    keep = np.ones_like(probs, dtype=bool)
    if top_k > 0:
        keep[order[top_k:]] = False
    if top_p < 1.0:
        cum = np.cumsum(probs[order] * keep[order]) / probs[keep].sum()
        cutoff = np.searchsorted(cum, top_p) + 1      # smallest set reaching p
        keep[order[cutoff:]] = False

    probs = np.where(keep, probs, 0)
    probs /= probs.sum()
    return int(rng.choice(len(probs), p=probs))`,
  },
  {
    label: 'TypeScript',
    language: 'typescript',
    code: `function softmax(logits: number[], T: number): number[] {
  const z = logits.map((x) => x / T);
  const max = Math.max(...z);
  const e = z.map((x) => Math.exp(x - max));
  const sum = e.reduce((a, b) => a + b, 0);
  return e.map((x) => x / sum);
}

const entropyBits = (p: number[]) =>
  -p.reduce((s, x) => (x > 0 ? s + x * Math.log2(x) : s), 0);

// Pick the token whose cumulative interval contains u in [0, 1).
function sample(probs: number[], u: number): number {
  let c = 0;
  for (let i = 0; i < probs.length; i++) {
    c += probs[i];
    if (u < c) return i;
  }
  return probs.length - 1;
}`,
  },
];

export default function TextGenerationPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="text-generation"
      description="A language model only ever predicts the next token. Temperature, top-k and top-p decide how that prediction becomes a choice. Adjust them and generate text one token at a time."
    >
      <TextGenerationVisualizer />

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose a prompt. "The capital of France is" is confident; "My favourite colour is" is open-ended.',
            'Drag the temperature slider and watch the bars sharpen or flatten, and the orange dot move along the entropy curve.',
            'Turn on top-k or top-p: hatched bars are removed and the remaining probabilities are rescaled to sum to 1.',
            'Press Sample next token to draw a token using the seeded random number u, or Greedy next token to take the most likely one.',
            'Keep going until the branch ends. Use Undo to step back, or change the seed and reset to get a different sample.',
          ]}
        />
      </ContentSection>

      <ContentSection title="How text generation works">
        <Prose>
          <p>
            Given the text so far, a language model produces one <strong>logit</strong> (a raw score) for every token in its
            vocabulary. Softmax turns the logits into probabilities. A <strong>decoding strategy</strong> then picks one token,
            appends it to the text, and runs the model again. Everything a chatbot writes is produced this way, one token at a
            time.
          </p>
          <p>
            Always taking the most likely token (greedy decoding) tends to produce safe, repetitive text. Sampling adds variety,
            but sampling from the full distribution occasionally picks a very unlikely token and derails the sentence. Temperature,
            top-k and top-p are the standard dials for balancing the two.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Softmax with temperature">
            <Formula
              where={[
                { symbol: 'zᵢ', meaning: 'logit of token i' },
                { symbol: 'T', meaning: 'temperature (T > 0); T = 1 leaves the model distribution unchanged' },
              ]}
            >
              pᵢ = exp(zᵢ / T) / Σ<sub>j</sub> exp(z<sub>j</sub> / T)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Top-p (nucleus) set">
            <Formula>V<sub>p</sub> = smallest set of most likely tokens with Σ<sub>i ∈ V<sub>p</sub></sub> pᵢ ≥ p, then pᵢ′ = pᵢ / Σ<sub>j ∈ V<sub>p</sub></sub> p<sub>j</sub></Formula>
          </Callout>
          <Callout tone="formula" title="Entropy">
            <Formula
              where={[
                { symbol: 'H = 0', meaning: 'one token has probability 1' },
                { symbol: 'H = log₂ n', meaning: 'all n tokens are equally likely' },
              ]}
            >
              H(p) = −Σ<sub>i</sub> pᵢ log₂ pᵢ
            </Formula>
          </Callout>
        </div>
        <div className="mt-6">
          <DataTable
            columns={[
              { header: 'Strategy', cell: 'name' },
              { header: 'How it works', cell: 'how' },
              { header: 'Effect', cell: 'effect' },
            ]}
            rows={strategies}
          />
        </div>
      </ContentSection>

      <ContentSection title="Code">
        <CodeTabs samples={code} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Temperature by hand"
            question={<p>Three tokens have logits (2, 1, 0). Compute their probabilities at T = 1 and at T = 0.5.</p>}
            solution={
              <>
                <p>T = 1: e² = 7.389, e¹ = 2.718, e⁰ = 1, sum = 11.107</p>
                <p className="font-semibold text-emerald-700">p = (0.665, 0.245, 0.090)</p>
                <p>T = 0.5: logits become (4, 2, 0). e⁴ = 54.598, e² = 7.389, e⁰ = 1, sum = 62.987</p>
                <p className="font-semibold text-emerald-700">p = (0.867, 0.117, 0.016)</p>
                <p>Halving the temperature doubled the gaps between logits, so the top token became much more likely.</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Top-k versus top-p"
            question={
              <p>
                Five tokens have probabilities (0.50, 0.20, 0.15, 0.10, 0.05). Which tokens survive top-p with p = 0.8, and what
                are their renormalised probabilities? Compare with top-k, k = 2.
              </p>
            }
            solution={
              <>
                <p>Cumulative sums: 0.50, 0.70, 0.85. The third token is the first to reach 0.8, so three tokens are kept.</p>
                <p>Kept mass = 0.85. Renormalised: 0.50/0.85, 0.20/0.85, 0.15/0.85</p>
                <p className="font-semibold text-emerald-700">top-p: (0.588, 0.235, 0.176)</p>
                <p>Top-k with k = 2 keeps the first two: mass 0.70, so 0.50/0.70 and 0.20/0.70.</p>
                <p className="font-semibold text-emerald-700">top-k: (0.714, 0.286)</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
