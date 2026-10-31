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
  Tag,
  type CardGridItem,
} from '@/components/content';
import AttentionVisualizer from './AttentionVisualizer';

export const metadata: Metadata = {
  title: 'Self-Attention & Transformers Visualizer - AI/ML | AllVisualizer',
  description:
    'Type a sentence and see queries, keys and values, scaled dot-product scores and the softmax attention heatmap. Toggle causal masking and multiple heads, and explore the Transformer block and positional encoding.',
  keywords: ['self-attention', 'transformer', 'query key value', 'scaled dot-product attention', 'softmax', 'multi-head attention', 'positional encoding', 'causal mask'],
};

const tags = ['Self-Attention', 'Query/Key/Value', 'Softmax', 'Multi-Head'];

const concepts: CardGridItem[] = [
  {
    title: 'Query, key, value',
    description: 'Each token asks a question (query), advertises what it contains (key) and offers content to share (value). All three are linear projections of the same embedding.',
  },
  {
    title: 'Scaling by √d_k',
    description: 'Dot products grow with the vector length. Dividing by √d_k keeps the scores in a range where softmax does not saturate and gradients still flow.',
  },
  {
    title: 'Causal mask',
    description: 'Language models must not peek at future tokens, so scores above the diagonal are set to −∞ and get zero weight after softmax.',
  },
  {
    title: 'Multi-head attention',
    description: 'Several smaller heads run in parallel with their own weights. One might track the previous word, another the subject of the sentence.',
  },
  {
    title: 'Residual connections',
    description: 'Each sub-layer adds its output to its input (Add & Norm), which keeps deep stacks of blocks trainable.',
  },
  {
    title: 'Positional encoding',
    description: 'Attention treats the input as a set. Adding a position-dependent signal to each embedding lets the model use word order.',
  },
];

const numpyCode = `import numpy as np

def softmax(x, axis=-1):
    x = x - x.max(axis=axis, keepdims=True)        # numerical stability
    e = np.exp(x)
    return e / e.sum(axis=axis, keepdims=True)

def self_attention(X, W_q, W_k, W_v, causal=False):
    Q, K, V = X @ W_q, X @ W_k, X @ W_v            # (n, d_k) each
    scores = Q @ K.T / np.sqrt(K.shape[-1])         # (n, n)
    if causal:
        n = scores.shape[0]
        scores[np.triu_indices(n, k=1)] = -np.inf    # hide future tokens
    A = softmax(scores, axis=-1)                    # rows sum to 1
    return A @ V, A                                 # outputs and weights

def positional_encoding(n, d):
    pos = np.arange(n)[:, None]
    i = np.arange(0, d, 2)[None, :]
    angle = pos / 10000 ** (i / d)
    pe = np.zeros((n, d))
    pe[:, 0::2], pe[:, 1::2] = np.sin(angle), np.cos(angle)
    return pe`;

const pytorchCode = `import torch
import torch.nn as nn

d_model, heads, n = 8, 2, 6
attn = nn.MultiheadAttention(d_model, heads, batch_first=True)

x = torch.randn(1, n, d_model)                       # embeddings + positions
mask = torch.triu(torch.ones(n, n, dtype=torch.bool), diagonal=1)  # True = blocked

out, weights = attn(x, x, x, attn_mask=mask)         # self-attention: Q, K, V from x
print(weights.shape)                                 # (1, n, n), averaged over heads

block = nn.TransformerEncoderLayer(d_model, heads, dim_feedforward=32, batch_first=True)`;

export default function AttentionPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="attention"
      meta={tags.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    >
      <AttentionVisualizer />

      <ContentSection title="How self-attention works">
        <Prose>
          <p>
            In self-attention every token looks at every other token in the same sentence and decides how much of each to
            mix into its own representation. Each token&apos;s embedding is projected three ways: a <strong>query</strong>{' '}
            (what am I looking for?), a <strong>key</strong> (what do I contain?) and a <strong>value</strong> (what do I
            pass on?).
          </p>
          <p>
            The match between a query and a key is their dot product. Dividing by √d<sub>k</sub> and applying softmax
            turns a row of scores into weights that sum to 1, and the token&apos;s output is the weighted sum of all value
            vectors. A Transformer stacks this with a small feed-forward network, residual connections and layer
            normalisation, and repeats the block many times.
          </p>
          <p>
            The weights in this demo are random but seeded, so the patterns will not look like a trained model&apos;s
            (which might link &quot;sat&quot; strongly to &quot;cat&quot;). What is real is the computation: every number on
            screen follows the formulas below.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Scaled dot-product attention">
            <Formula
              where={[
                { symbol: 'Q, K, V', meaning: 'X·W_Q, X·W_K, X·W_V, one row per token' },
                { symbol: 'd_k', meaning: 'length of each query and key vector' },
                { symbol: 'M', meaning: 'mask: 0 where allowed, −∞ for future tokens when causal' },
              ]}
            >
              Attention(Q, K, V) = softmax(QKᵀ / √d<sub>k</sub> + M) · V
            </Formula>
          </Callout>
          <Callout tone="formula" title="Softmax over one row">
            <Formula>
              a<sub>ij</sub> = exp(s<sub>ij</sub>) / Σ<sub>m</sub> exp(s<sub>im</sub>)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Multi-head attention">
            <Formula>
              MultiHead(X) = Concat(head<sub>1</sub>, …, head<sub>h</sub>) · W<sub>O</sub>, with d<sub>k</sub> = d<sub>model</sub> / h
            </Formula>
          </Callout>
          <Callout tone="formula" title="Sinusoidal positional encoding">
            <Formula>
              PE(pos, 2i) = sin(pos / 10000<sup>2i/d</sup>), PE(pos, 2i+1) = cos(pos / 10000<sup>2i/d</sup>)
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Type a sentence of up to 8 words. Each word becomes a token with an 8-number embedding.',
            'Click a token (or a heatmap row) to make it the query. Its row is highlighted in Q, in the scores and in the heatmap.',
            'Follow the pipeline: Q, K and V, then the scaled scores, then the softmax weights, then the lines and the weighted sum that form the output.',
            'Turn on the causal mask and watch the upper triangle drop to zero: each token can only attend to itself and earlier tokens.',
            'Switch to 2 or 4 heads. Each head gets a smaller d_k and its own weights, so the small heatmaps show different patterns.',
            'Turn positional encoding off with a repeated word (like "the" twice) and notice the two rows become identical.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Key concepts">
        <CardGrid items={concepts} columns={3} />
      </ContentSection>

      <ContentSection title="Code">
        <CodeTabs
          samples={[
            { label: 'NumPy', language: 'python', code: numpyCode },
            { label: 'PyTorch', language: 'python', code: pytorchCode },
          ]}
        />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Attention by hand"
            question="With d_k = 2, a query q = [1, 0] attends to two keys k₁ = [1, 1] and k₂ = [0, 2] with values v₁ = [1, 0] and v₂ = [0, 1]. Compute the scaled scores, the attention weights and the output."
            solution={
              <>
                <p>Raw scores: q·k₁ = 1, q·k₂ = 0</p>
                <p>Scaled by √2 ≈ 1.414: s = [0.707, 0]</p>
                <p>exp: [2.028, 1.000], sum = 3.028</p>
                <p>weights a = [0.670, 0.330]</p>
                <p>output = 0.670·[1, 0] + 0.330·[0, 1]</p>
                <p className="font-semibold text-emerald-700">z = [0.67, 0.33]</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Causal mask and heads"
            question="In a causal decoder the second token (index 1) of a three-token sequence has scaled scores [2, 1, 3]. What are its attention weights? Separately, a model with d_model = 512 uses 8 heads: what is d_k and what are the scores divided by?"
            solution={
              <>
                <p>The third token is in the future, so its score becomes −∞: [2, 1, −∞]</p>
                <p>exp: [7.389, 2.718, 0], sum = 10.107</p>
                <p>weights = [0.731, 0.269, 0]</p>
                <p>d_k = 512 / 8 = 64, so scores are divided by √64 = 8</p>
                <p className="font-semibold text-emerald-700">[0.731, 0.269, 0]; d_k = 64, scale 8</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
