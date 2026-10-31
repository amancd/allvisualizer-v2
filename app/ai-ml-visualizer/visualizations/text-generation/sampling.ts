/** Real decoding maths: temperature softmax, top-k, top-p (nucleus) and entropy. */

/** Softmax of logits / T. Subtracting the max keeps exp() from overflowing. */
export function softmax(logits: number[], temperature: number): number[] {
  const scaled = logits.map((z) => z / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map((z) => Math.exp(z - max));
  const sum = exps.reduce((s, x) => s + x, 0);
  return exps.map((x) => x / sum);
}

export type Cut = 'kept' | 'top-k' | 'top-p';

export interface Filtered {
  /** Why each token was kept or removed. */
  status: Cut[];
  /** Renormalised probabilities over the kept tokens (0 for removed ones). */
  final: number[];
}

/**
 * Applies top-k, then top-p, to a probability vector.
 * - top-k keeps the k most likely tokens (k = 0 disables it).
 * - top-p keeps the smallest set of most likely tokens whose total probability is at least p (p = 1 disables it).
 */
export function filterTopKTopP(probs: number[], k: number, p: number): Filtered {
  const order = probs.map((_, i) => i).sort((a, b) => probs[b] - probs[a]);
  const status: Cut[] = probs.map(() => 'kept');

  if (k > 0) order.slice(k).forEach((i) => (status[i] = 'top-k'));

  if (p < 1) {
    const survivors = order.filter((i) => status[i] === 'kept');
    const mass = survivors.reduce((s, i) => s + probs[i], 0);
    let cumulative = 0;
    let reached = false;
    for (const i of survivors) {
      if (reached) status[i] = 'top-p';
      cumulative += probs[i] / mass;
      if (cumulative >= p - 1e-12) reached = true;
    }
  }

  const keptMass = probs.reduce((s, x, i) => s + (status[i] === 'kept' ? x : 0), 0);
  const final = probs.map((x, i) => (status[i] === 'kept' ? x / keptMass : 0));
  return { status, final };
}

/** Shannon entropy in bits. 0 = certain, log2(n) = uniform over n tokens. */
export function entropyBits(probs: number[]): number {
  return -probs.reduce((s, x) => (x > 0 ? s + x * Math.log2(x) : s), 0);
}

/** Deterministic uniform number in [0, 1) for draw number `n` of a given seed (mulberry32). */
export function seededUniform(seed: number, n: number): number {
  let a = (Math.imul(seed | 0, 0x9e3779b1) + Math.imul(n + 1, 0x85ebca6b)) >>> 0;
  a = (a + 0x6d2b79f5) >>> 0;
  let t = a;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Picks the index whose cumulative-probability interval contains u. */
export function sampleIndex(probs: number[], u: number): number {
  let cumulative = 0;
  let last = -1;
  for (let i = 0; i < probs.length; i++) {
    if (probs[i] <= 0) continue;
    last = i;
    cumulative += probs[i];
    if (u < cumulative) return i;
  }
  return last;
}
