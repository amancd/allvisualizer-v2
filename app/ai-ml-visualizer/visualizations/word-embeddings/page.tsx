import type { Metadata } from 'next';
import {
  Callout,
  CardGrid,
  CodeTabs,
  ContentSection,
  DetailPage,
  Formula,
  PracticeProblem,
  Prose,
  StepList,
  type CardGridItem,
  type CodeSample,
} from '@/components/content';
import WordEmbeddingsVisualizer from './WordEmbeddingsVisualizer';

export const metadata: Metadata = {
  title: 'Word Embeddings - AI/ML Visualizer | AllVisualizer',
  description:
    'Explore words as vectors: a PCA projection computed in your browser, nearest neighbours by cosine similarity, and analogies like king − man + woman = queen.',
  keywords: ['word embeddings', 'word2vec', 'GloVe', 'cosine similarity', 'word analogies', 'PCA', 'vector space', 'NLP'],
};

const ideas: CardGridItem[] = [
  { title: 'Distributional hypothesis', description: 'Words used in similar contexts get similar vectors. "cat" and "kitten" appear near the same words, so they end up close.' },
  { title: 'Directions carry meaning', description: 'Consistent offsets such as male to female or present to past tense let simple vector arithmetic answer analogies.' },
  { title: 'Cosine, not distance', description: 'Similarity is usually measured by the angle between vectors, so a frequent word with a long vector is not penalised.' },
  { title: 'Projection loses detail', description: 'PCA keeps the directions of largest variance. Words that look close in 2-D can be far apart in the full space.' },
];

const code: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `import numpy as np

def cosine(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

def analogy(E, vocab, a, b, c, k=3):
    """Return the k words closest to E[a] - E[b] + E[c]."""
    target = E[vocab[a]] - E[vocab[b]] + E[vocab[c]]
    sims = E @ target / (np.linalg.norm(E, axis=1) * np.linalg.norm(target))
    words = [w for w in sorted(vocab, key=lambda w: -sims[vocab[w]])
             if w not in (a, b, c)]
    return words[:k]

# 2-D projection with PCA
X = E - E.mean(axis=0)
_, _, Vt = np.linalg.svd(X, full_matrices=False)
coords = X @ Vt[:2].T`,
  },
  {
    label: 'TypeScript',
    language: 'typescript',
    code: `const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
const norm = (a: number[]) => Math.sqrt(dot(a, a));
const cosine = (a: number[], b: number[]) => dot(a, b) / (norm(a) * norm(b));

// Top principal component of a covariance matrix C by power iteration.
function topComponent(C: number[][], iterations = 200): number[] {
  let v = C.map(() => 1);
  for (let i = 0; i < iterations; i++) {
    const w = C.map((row) => dot(row, v));
    const len = norm(w);
    v = w.map((x) => x / len);
  }
  return v;
}`,
  },
];

export default function WordEmbeddingsPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="word-embeddings"
      description="Every word becomes a point in a high-dimensional space where similar meanings sit close together and directions encode relationships. Explore neighbours, analogies and cosine similarity."
    >
      <WordEmbeddingsVisualizer />

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Look at the projection: the four colours (people, animals, places, verbs) form separate clusters.',
            'Click any word to list its nearest neighbours by cosine similarity. Lines connect it to its three closest words.',
            'Pick an analogy preset such as paris − france + italy. The plot re-fits to that group and draws the offset from b to a, then the same offset starting at c.',
            'Choose your own a, b and c in the analogy tool and see which word lands nearest to the result.',
            'Use the cosine panel to compare two words dimension by dimension: green bars add to the similarity, red bars subtract from it.',
            'Switch the PCA fit and axes to see how much a 2-D view hides.',
          ]}
        />
      </ContentSection>

      <ContentSection title="What are word embeddings?">
        <Prose>
          <p>
            A language model cannot do arithmetic on the string &quot;cat&quot;. Instead, each token in the vocabulary gets a
            row in an <strong>embedding matrix</strong>: a list of numbers (a vector) that the model learns during training.
            Models like word2vec and GloVe learn these vectors by predicting which words appear near each other, and modern
            transformers learn them as their very first layer.
          </p>
          <p>
            Training pushes words that appear in similar contexts towards similar vectors. A side effect is that relationships
            become <strong>directions</strong>: the step from &quot;man&quot; to &quot;king&quot; is roughly the same as the step
            from &quot;woman&quot; to &quot;queen&quot;. That is why vector arithmetic can solve analogies.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Cosine similarity">
            <Formula
              where={[
                { symbol: 'x · y', meaning: 'dot product, Σ xᵢyᵢ' },
                { symbol: '|x|', meaning: 'length of x, √(Σ xᵢ²)' },
                { symbol: 'θ', meaning: 'angle between the vectors; cos θ ranges from −1 (opposite) to 1 (same direction)' },
              ]}
            >
              cos θ = (x · y) / (|x| |y|)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Analogy by vector arithmetic">
            <Formula>answer = argmax<sub>w ∉ {'{a, b, c}'}</sub> cos(v<sub>w</sub>, v<sub>a</sub> − v<sub>b</sub> + v<sub>c</sub>)</Formula>
          </Callout>
          <Callout tone="formula" title="PCA projection">
            <Formula
              where={[
                { symbol: 'μ', meaning: 'mean vector of the fitted words' },
                { symbol: 'u₁, u₂', meaning: 'top eigenvectors of the covariance matrix C = (1/n) Σ (v − μ)(v − μ)ᵀ' },
              ]}
            >
              (p₁, p₂) = ((v − μ) · u₁, (v − μ) · u₂)
            </Formula>
          </Callout>
          <Callout tone="note" title="Why the arrows form a parallelogram">
            PCA is a linear map, so projecting a − b + c gives exactly proj(a) − proj(b) + proj(c). The two arrows on the plot
            are the same offset drawn twice, and the open circle marks where the target vector lands.
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Code">
        <CodeTabs samples={code} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Compute a cosine similarity"
            question={<p>Find the cosine similarity and the angle between x = (1, 2, 2) and y = (2, 0, 1).</p>}
            solution={
              <>
                <p>x · y = 1×2 + 2×0 + 2×1 = 4</p>
                <p>|x| = √(1 + 4 + 4) = 3, |y| = √(4 + 0 + 1) = √5 ≈ 2.236</p>
                <p>cos θ = 4 / (3 × 2.236) ≈ 0.596</p>
                <p className="font-semibold text-emerald-700">cos θ ≈ 0.596, θ ≈ 53.4°</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Solve an analogy"
            question={
              <p>
                With dimensions (royalty, gender, person): king = (1, 1, 1), man = (0, 1, 1), woman = (0, −1, 1), queen = (1, −1,
                1), girl = (0, −1, 0.8). Compute king − man + woman and decide whether queen or girl is the better answer.
              </p>
            }
            solution={
              <>
                <p>king − man + woman = (1−0+0, 1−1−1, 1−1+1) = (1, −1, 1)</p>
                <p>cos(target, queen) = 3 / (√3 × √3) = 1.000</p>
                <p>cos(target, girl) = (0 + 1 + 0.8) / (√3 × √1.64) = 1.8 / 2.218 ≈ 0.811</p>
                <p className="font-semibold text-emerald-700">queen (cosine 1.0) is the answer</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
