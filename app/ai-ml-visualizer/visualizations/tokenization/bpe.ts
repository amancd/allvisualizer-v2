/**
 * A small, real byte-pair encoding (BPE) trainer and encoder.
 *
 * Text is first split into "pre-tokens" (words and punctuation). A word that
 * starts the text or follows whitespace gets a leading "▁" marker, the same
 * convention SentencePiece uses, so the model can tell "▁low" (a word start)
 * from "low" inside "slow". Each pre-token starts as a list of characters, and
 * training repeatedly merges the most frequent adjacent pair of symbols.
 */

export const SPACE_MARK = '▁';

export interface WordType {
  /** The pre-token, e.g. "▁lower". */
  word: string;
  /** How many times it appears in the corpus. */
  count: number;
}

export interface Merge {
  left: string;
  right: string;
  /** left + right */
  token: string;
  /** Pair frequency at the moment it was chosen. */
  count: number;
}

export interface PairCount {
  left: string;
  right: string;
  count: number;
}

export interface TrainingResult {
  types: WordType[];
  /** Pre-tokens of the corpus in reading order. */
  sequence: string[];
  /** Single characters seen in the corpus, sorted. */
  baseVocab: string[];
  merges: Merge[];
  /** snapshots[n] = segmentation of every word type after n merges. */
  snapshots: string[][][];
}

/** Splits text into pre-tokens: runs of letters/digits/apostrophes, or single punctuation marks. */
export function preTokenize(text: string): string[] {
  const out: string[] = [];
  const re = /(\s*)([A-Za-z0-9']+|[^\sA-Za-z0-9'])/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const [, space, piece] = match;
    const isWord = /^[A-Za-z0-9']/.test(piece);
    const atStart = match.index === 0;
    const marked = space.length > 0 || (atStart && isWord);
    out.push(marked ? SPACE_MARK + piece : piece);
  }
  return out;
}

const key = (a: string, b: string) => `${a}\u0000${b}`;

/** Counts every adjacent symbol pair, weighted by how often each word occurs. */
export function countPairs(segmentation: string[][], types: WordType[]): PairCount[] {
  const counts = new Map<string, PairCount>();
  segmentation.forEach((symbols, i) => {
    for (let j = 0; j < symbols.length - 1; j++) {
      const k = key(symbols[j], symbols[j + 1]);
      const entry = counts.get(k);
      if (entry) entry.count += types[i].count;
      else counts.set(k, { left: symbols[j], right: symbols[j + 1], count: types[i].count });
    }
  });
  // Highest count first; ties broken alphabetically so training is deterministic.
  return [...counts.values()].sort(
    (p, q) => q.count - p.count || (p.left + ' ' + p.right).localeCompare(q.left + ' ' + q.right),
  );
}

/** Replaces every occurrence of the adjacent pair (left, right) with one merged symbol. */
export function applyMerge(symbols: string[], left: string, right: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < symbols.length) {
    if (i < symbols.length - 1 && symbols[i] === left && symbols[i + 1] === right) {
      out.push(left + right);
      i += 2;
    } else {
      out.push(symbols[i]);
      i += 1;
    }
  }
  return out;
}

/** Learns up to maxMerges merges. Stops early when no pair occurs at least twice. */
export function trainBPE(corpus: string, maxMerges: number): TrainingResult {
  const sequence = preTokenize(corpus);
  const countMap = new Map<string, number>();
  for (const w of sequence) countMap.set(w, (countMap.get(w) ?? 0) + 1);
  const types: WordType[] = [...countMap.entries()].map(([word, count]) => ({ word, count }));

  const baseVocab = [...new Set(types.flatMap((t) => Array.from(t.word)))].sort();
  let segmentation = types.map((t) => Array.from(t.word));
  const snapshots: string[][][] = [segmentation];
  const merges: Merge[] = [];

  while (merges.length < maxMerges) {
    const pairs = countPairs(segmentation, types);
    if (pairs.length === 0 || pairs[0].count < 2) break;
    const best = pairs[0];
    merges.push({ left: best.left, right: best.right, token: best.left + best.right, count: best.count });
    segmentation = segmentation.map((s) => applyMerge(s, best.left, best.right));
    snapshots.push(segmentation);
  }

  return { types, sequence, baseVocab, merges, snapshots };
}

/** Token string -> id. Base characters come first (sorted), then merged tokens in the order they were learned. */
export function buildVocab(baseVocab: string[], merges: Merge[], mergeCount: number): Map<string, number> {
  const vocab = new Map<string, number>();
  baseVocab.forEach((ch) => vocab.set(ch, vocab.size));
  for (const m of merges.slice(0, mergeCount)) {
    if (!vocab.has(m.token)) vocab.set(m.token, vocab.size);
  }
  return vocab;
}

/**
 * Encodes one pre-token with the first mergeCount merges. Like GPT-2, it
 * repeatedly applies the earliest-learned merge that is still possible.
 */
export function encodeWord(word: string, merges: Merge[], mergeCount: number): string[] {
  const rank = new Map<string, number>();
  merges.slice(0, mergeCount).forEach((m, i) => {
    const k = key(m.left, m.right);
    if (!rank.has(k)) rank.set(k, i);
  });

  let symbols = Array.from(word);
  while (symbols.length > 1) {
    let bestRank = Infinity;
    let bestIndex = -1;
    for (let j = 0; j < symbols.length - 1; j++) {
      const r = rank.get(key(symbols[j], symbols[j + 1]));
      if (r !== undefined && r < bestRank) {
        bestRank = r;
        bestIndex = j;
      }
    }
    if (bestIndex < 0) break;
    symbols = applyMerge(symbols, symbols[bestIndex], symbols[bestIndex + 1]);
  }
  return symbols;
}
