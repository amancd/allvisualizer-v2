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
import RnnVisualizer from './RnnVisualizer';

export const metadata: Metadata = {
  title: 'Recurrent Neural Networks Visualizer - AI/ML | AllVisualizer',
  description:
    'Unroll a recurrent neural network over a word, watch the hidden state change step by step, see why gradients vanish or explode, and look inside an LSTM cell.',
  keywords: ['RNN', 'recurrent neural network', 'hidden state', 'unrolling', 'vanishing gradient', 'exploding gradient', 'LSTM', 'deep learning'],
};

const tags = ['Hidden State', 'Unrolling', 'Vanishing Gradients', 'LSTM'];

const concepts: CardGridItem[] = [
  {
    title: 'Hidden state',
    description: 'A vector that summarises everything the network has seen so far. It is the only thing passed from one step to the next.',
  },
  {
    title: 'Weight sharing',
    description: 'W_h, W_x and b are the same at every time step, so one small cell can read sequences of any length.',
  },
  {
    title: 'Backpropagation through time',
    description: 'Training unrolls the loop into a deep chain and backpropagates through it, multiplying one Jacobian per step.',
  },
  {
    title: 'Vanishing gradients',
    description: 'If those per-step factors are below 1 the product shrinks exponentially, and early inputs stop influencing learning.',
  },
  {
    title: 'Exploding gradients',
    description: 'If they are above 1 the product blows up. Gradient clipping caps the norm so a single update cannot wreck the weights.',
  },
  {
    title: 'LSTM gates',
    description: 'Sigmoid gates between 0 and 1 control what to forget, what to write and what to output, keeping an additive path for the cell state.',
  },
];

const numpyCode = `import numpy as np

def rnn_forward(xs, W_h, W_x, b):
    h = np.zeros(W_h.shape[0])
    hs = []
    for x in xs:                                  # one step per input
        h = np.tanh(W_h @ h + W_x @ x + b)        # same weights every step
        hs.append(h)
    return hs

def lstm_step(x, h, c, W, b):
    z = np.concatenate([h, x])
    f = sigmoid(W["f"] @ z + b["f"])   # forget gate
    i = sigmoid(W["i"] @ z + b["i"])   # input gate
    g = np.tanh(W["g"] @ z + b["g"])   # candidate values
    o = sigmoid(W["o"] @ z + b["o"])   # output gate
    c = f * c + i * g                  # additive cell-state update
    h = o * np.tanh(c)
    return h, c`;

const pytorchCode = `import torch
import torch.nn as nn

rnn = nn.RNN(input_size=3, hidden_size=4, batch_first=True)    # tanh by default
lstm = nn.LSTM(input_size=3, hidden_size=4, batch_first=True)

x = torch.randn(1, 5, 3)          # batch of 1, 5 time steps, 3 features
out, h_T = rnn(x)                 # out: every hidden state, h_T: the last one
out, (h_T, c_T) = lstm(x)

# Keep exploding gradients in check during training
torch.nn.utils.clip_grad_norm_(lstm.parameters(), max_norm=1.0)`;

export default function RnnPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="rnn"
      meta={tags.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    >
      <RnnVisualizer />

      <ContentSection title="How a recurrent network reads a sequence">
        <Prose>
          <p>
            A recurrent neural network processes a sequence one element at a time. At every step it combines the new
            input <code>x(t)</code> with its previous <strong>hidden state</strong> <code>h(t−1)</code> and squashes the
            result with <code>tanh</code>. Drawing each step side by side, called <strong>unrolling</strong>, shows that an
            RNN is really a very deep network whose layers all share the same weights.
          </p>
          <p>
            That depth is also the problem. Training multiplies one factor per step on the way back, so the gradient from
            a distant step either fades towards zero or grows without bound. LSTMs fix most of this with a separate cell
            state that is updated by addition and controlled by gates.
          </p>
          <p>
            Everything here runs in your browser on a toy model: each letter is mapped to three fixed numbers, the RNN
            weights are hand-picked and the LSTM weights come from a seeded random generator. The values are illustrative,
            but every number is computed exactly as the formulas below describe.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Vanilla RNN step">
            <Formula
              where={[
                { symbol: 'h(t)', meaning: 'hidden state after step t (h(0) = 0)' },
                { symbol: 'x(t)', meaning: 'input at step t' },
                { symbol: 'W_h, W_x, b', meaning: 'recurrent weights, input weights and bias, shared across steps' },
              ]}
            >
              h(t) = tanh(W<sub>h</sub> h(t−1) + W<sub>x</sub> x(t) + b)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Gradient through k steps">
            <Formula>
              ∂h(T) / ∂h(T−k) = ∏<sub>t=T−k+1…T</sub> diag(1 − h(t)²) · W<sub>h</sub>
            </Formula>
            <p className="mt-2">
              For a single unit this is ∏ w·(1 − h²), which behaves like |w|<sup>k</sup>: it vanishes when |w| &lt; 1 and
              explodes when |w| &gt; 1.
            </p>
          </Callout>
          <Callout tone="formula" title="LSTM cell">
            <Formula>f = σ(W<sub>f</sub>[h(t−1), x(t)] + b<sub>f</sub>), and likewise i, o; g = tanh(W<sub>g</sub>[h(t−1), x(t)] + b<sub>g</sub>)</Formula>
            <Formula>c(t) = f ⊙ c(t−1) + i ⊙ g, h(t) = o ⊙ tanh(c(t))</Formula>
            <p className="mt-2">Along the cell state the gradient is multiplied by f at each step, which the network can keep close to 1.</p>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Type a short word. Each letter becomes one time step.',
            'Press Step to process one letter at a time, or Play to run through the whole word. The highlighted cell is the current step.',
            'Read the vanilla RNN table to see W_h·h(t−1), W_x·x(t) and b added together before tanh produces the new hidden state.',
            'Compare with the LSTM cell for the same step: green gate cells near 1 are open, white cells near 0 are closed.',
            'In the gradient panel, move the recurrent weight w above and below 1 and lengthen the sequence. Then raise the forget gate towards 1 and see how the LSTM path keeps the gradient alive.',
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
            title="Problem 1: Two steps by hand"
            question="A one-unit RNN has h(t) = tanh(0.5·h(t−1) + 1·x(t)), with no bias and h(0) = 0. The input sequence is x = [1, 0]. Compute h(1) and h(2)."
            solution={
              <>
                <p>h(1) = tanh(0.5·0 + 1·1) = tanh(1) ≈ 0.762</p>
                <p>h(2) = tanh(0.5·0.762 + 1·0) = tanh(0.381) ≈ 0.363</p>
                <p className="font-semibold text-emerald-700">h(1) ≈ 0.762, h(2) ≈ 0.363: with no new input the memory decays</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: How fast do gradients vanish?"
            question="Ignoring the tanh derivative, a gradient travelling back 50 steps is multiplied by w each step. What factor survives for w = 0.9 and w = 1.1? What about an LSTM cell path whose forget gate stays at 0.99?"
            solution={
              <>
                <p>w = 0.9: 0.9^50 ≈ 0.0052 (the signal almost disappears)</p>
                <p>w = 1.1: 1.1^50 ≈ 117 (the signal explodes)</p>
                <p>LSTM: 0.99^50 ≈ 0.61 (most of the signal survives)</p>
                <p className="font-semibold text-emerald-700">A small change around 1 makes a huge difference over long sequences</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
