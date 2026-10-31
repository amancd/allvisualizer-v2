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
import TokenizationVisualizer from './TokenizationVisualizer';

export const metadata: Metadata = {
  title: 'Tokenization (BPE) - AI/ML Visualizer | AllVisualizer',
  description:
    'Train a byte-pair encoding tokenizer merge by merge in your browser. See pair counts, the growing vocabulary and how new text is split into subword tokens.',
  keywords: ['tokenization', 'BPE', 'byte-pair encoding', 'subword', 'vocabulary', 'merges', 'LLM', 'NLP'],
};

const granularity = [
  { level: 'Character', vocab: 'Tiny (about 100)', length: 'Very long', unknown: 'None', note: 'Model must learn spelling from scratch' },
  { level: 'Word', vocab: 'Huge (100k+)', length: 'Short', unknown: 'Common', note: 'Every typo or new word is out of vocabulary' },
  { level: 'Subword (BPE)', vocab: 'Chosen (30k to 200k)', length: 'Medium', unknown: 'Rare', note: 'Frequent words stay whole, rare words split into pieces' },
];

const ideas: CardGridItem[] = [
  { title: 'Frequent words become one token', description: 'After enough merges, words like "the" or "running" are a single vocabulary entry.' },
  { title: 'Rare words still work', description: 'An unseen word such as "jogging" is spelled out of smaller known pieces instead of becoming unknown.' },
  { title: 'Merges are ordered', description: 'Encoding replays the merges in the order they were learned, so the tokenizer is fully deterministic.' },
  { title: 'Vocabulary size is a dial', description: 'More merges give shorter sequences but a larger embedding table. Real models stop at a fixed vocabulary size.' },
];

const code: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `from collections import Counter

def train_bpe(words: Counter, num_merges: int):
    # each word starts as a tuple of characters
    vocab = {tuple(w): c for w, c in words.items()}
    merges = []
    for _ in range(num_merges):
        pairs = Counter()
        for symbols, count in vocab.items():
            for a, b in zip(symbols, symbols[1:]):
                pairs[(a, b)] += count
        if not pairs:
            break
        (a, b), freq = pairs.most_common(1)[0]
        if freq < 2:
            break
        merges.append((a, b))
        vocab = {merge(s, a, b): c for s, c in vocab.items()}
    return merges

def merge(symbols, a, b):
    out, i = [], 0
    while i < len(symbols):
        if i + 1 < len(symbols) and symbols[i] == a and symbols[i + 1] == b:
            out.append(a + b); i += 2
        else:
            out.append(symbols[i]); i += 1
    return tuple(out)`,
  },
  {
    label: 'TypeScript',
    language: 'typescript',
    code: `// Encode one word with learned merges (earliest-learned merge wins).
function encodeWord(word: string, merges: [string, string][]): string[] {
  const rank = new Map(merges.map(([a, b], i) => [a + '\\u0000' + b, i]));
  let symbols = Array.from(word);
  while (symbols.length > 1) {
    let best = -1, bestRank = Infinity;
    for (let i = 0; i < symbols.length - 1; i++) {
      const r = rank.get(symbols[i] + '\\u0000' + symbols[i + 1]);
      if (r !== undefined && r < bestRank) { bestRank = r; best = i; }
    }
    if (best < 0) break;
    const [a, b] = [symbols[best], symbols[best + 1]];
    const out: string[] = [];
    for (let i = 0; i < symbols.length; i++) {
      if (symbols[i] === a && symbols[i + 1] === b) { out.push(a + b); i++; }
      else out.push(symbols[i]);
    }
    symbols = out;
  }
  return symbols;
}`,
  },
];

export default function TokenizationPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="tokenization"
      description="Language models never see letters or words directly. Train a byte-pair encoding tokenizer one merge at a time and watch characters fuse into subword tokens."
    >
      <TokenizationVisualizer />

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick a preset corpus or type your own text into the training box. Training restarts whenever the corpus changes.',
            'Press Step to perform one merge. The highlighted row in the pair table is the pair that gets merged.',
            'Press Play to run merges automatically, or drag the Merges slider to jump to any point in training.',
            'Watch the coloured corpus: neighbouring boxes fuse as their pair is merged, and the vocabulary list grows.',
            'Type into the encode box to tokenize new text with the merges learned so far, and compare the token count with character-level and word-level splitting.',
          ]}
        />
      </ContentSection>

      <ContentSection title="What is tokenization?">
        <Prose>
          <p>
            A neural network works on numbers, so text has to be cut into pieces called <strong>tokens</strong>, and each token
            is replaced by an integer id from a fixed <strong>vocabulary</strong>. The choice of pieces matters: whole words make
            the vocabulary enormous and fail on new words, while single characters make every sentence very long.
          </p>
          <p>
            <strong>Byte-pair encoding (BPE)</strong> finds a middle ground. It starts from single characters and repeatedly
            merges the most frequent adjacent pair into a new token. Common words end up as one token, and rare words are
            spelled out of a few familiar subwords. GPT models, Llama and many others use a variant of this algorithm (usually
            on raw bytes rather than characters, so no input is ever unknown).
          </p>
        </Prose>
        <div className="mt-6">
          <DataTable
            columns={[
              { header: 'Granularity', cell: 'level' },
              { header: 'Vocabulary', cell: 'vocab' },
              { header: 'Sequence length', cell: 'length' },
              { header: 'Unknown words', cell: 'unknown' },
              { header: 'Trade-off', cell: 'note' },
            ]}
            rows={granularity}
          />
        </div>
      </ContentSection>

      <ContentSection title="The algorithm">
        <StepList
          steps={[
            'Split the corpus into words (pre-tokens) and count how often each word occurs.',
            'Write every word as a sequence of single characters. The set of characters is the starting vocabulary.',
            'Count every adjacent pair of symbols across the corpus, weighting each pair by the frequency of its word.',
            'Merge the most frequent pair everywhere it occurs and add the merged symbol to the vocabulary.',
            'Repeat from step 3 until the vocabulary reaches the target size (or no pair repeats).',
          ]}
        />
        <div className="mt-6 space-y-4">
          <Callout tone="formula" title="Choosing the next merge">
            <Formula
              where={[
                { symbol: 'f(w)', meaning: 'how many times word w occurs in the corpus' },
                { symbol: 'count(w, a b)', meaning: 'how many times symbol a is directly followed by b inside w' },
              ]}
            >
              (a, b)* = argmax<sub>(a, b)</sub> Σ<sub>w</sub> f(w) · count(w, a b)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Vocabulary size">
            <Formula>|V| = |base characters| + number of merges</Formula>
          </Callout>
          <Callout tone="note" title="About the ▁ marker">
            This visualizer prefixes words that follow a space with <code>▁</code>, the SentencePiece convention. It lets the
            tokenizer learn that <code>▁run</code> at the start of a word is different from <code>run</code> in the middle of
            &quot;overrun&quot;. GPT-2 does the same thing with a leading space character.
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Why subwords work well">
        <CardGrid items={ideas} />
      </ContentSection>

      <ContentSection title="Code">
        <CodeTabs samples={code} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: The first three merges"
            question={
              <p>
                A corpus has the word counts hug ×10, pug ×5, pun ×12, bun ×4, hugs ×5. Every word starts as single characters.
                Which three merges does BPE learn first? (Count words separately, without the ▁ word-start marker the
                visualizer adds, so the answer differs if you paste this corpus above.)
              </p>
            }
            solution={
              <>
                <p>Pair counts: h u = 10+5 = 15, u g = 10+5+5 = 20, p u = 5+12 = 17, u n = 12+4 = 16, b u = 4, g s = 5.</p>
                <p className="font-semibold text-emerald-700">Merge 1: u + g → ug (20)</p>
                <p>Now: h ug, p ug, p u n, b u n, h ug s. Pairs: h ug = 15, p ug = 5, p u = 12, u n = 16, b u = 4, ug s = 5.</p>
                <p className="font-semibold text-emerald-700">Merge 2: u + n → un (16)</p>
                <p>Now: h ug, p ug, p un, b un, h ug s. Pairs: h ug = 15, p un = 12, p ug = 5, ug s = 5, b un = 4.</p>
                <p className="font-semibold text-emerald-700">Merge 3: h + ug → hug (15)</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Encoding unseen words"
            question={
              <p>
                Using only the three merges from problem 1 (u+g, u+n, h+ug) and the base vocabulary {'{b, g, h, n, p, s, u}'},
                how are &quot;bug&quot; and &quot;thugs&quot; tokenized?
              </p>
            }
            solution={
              <>
                <p>bug: b u g → the only applicable merge is u+g → [b, ug]. No merge joins b and ug.</p>
                <p className="font-semibold text-emerald-700">bug = [b, ug], 2 tokens</p>
                <p>thugs: t is not in the base vocabulary, so it is unknown. h u g s → u+g gives h ug s, then h+ug gives hug s.</p>
                <p className="font-semibold text-emerald-700">thugs = [UNK, hug, s], 3 tokens</p>
                <p>Byte-level BPE avoids the UNK by starting from the 256 possible byte values instead of characters.</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
