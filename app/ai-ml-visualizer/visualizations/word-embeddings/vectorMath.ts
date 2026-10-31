/** Small vector helpers and an in-browser PCA (power iteration with deflation). */

export const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
export const norm = (a: number[]) => Math.sqrt(dot(a, a));
export const add = (a: number[], b: number[]) => a.map((x, i) => x + b[i]);
export const sub = (a: number[], b: number[]) => a.map((x, i) => x - b[i]);

export function cosine(a: number[], b: number[]): number {
  const d = norm(a) * norm(b);
  return d === 0 ? 0 : dot(a, b) / d;
}

export interface PCAResult {
  mean: number[];
  /** Unit-length principal directions, largest variance first. */
  components: number[][];
  /** Variance captured by each component. */
  variances: number[];
  totalVariance: number;
}

/**
 * Principal component analysis.
 * 1. Centre the data.  2. Build the covariance matrix C = XᵀX / n.
 * 3. Power iteration: v ← Cv / |Cv| converges to the top eigenvector.
 * 4. Deflate C ← C − λvvᵀ and repeat for the next component.
 */
export function pca(data: number[][], k: number, iterations = 200): PCAResult {
  const n = data.length;
  const d = data[0].length;
  const mean = Array.from({ length: d }, (_, j) => data.reduce((s, row) => s + row[j], 0) / n);
  const X = data.map((row) => sub(row, mean));

  const C = Array.from({ length: d }, (_, i) =>
    Array.from({ length: d }, (_, j) => X.reduce((s, row) => s + row[i] * row[j], 0) / n),
  );
  const totalVariance = C.reduce((s, row, i) => s + row[i], 0);

  const components: number[][] = [];
  const variances: number[] = [];
  for (let c = 0; c < k; c++) {
    // Deterministic, non-symmetric start vector so iteration never starts orthogonal to the answer.
    let v = Array.from({ length: d }, (_, i) => 1 + 0.1 * i + 0.01 * c);
    v = v.map((x) => x / norm(v));
    for (let it = 0; it < iterations; it++) {
      const w = C.map((row) => dot(row, v));
      const len = norm(w);
      if (len < 1e-12) break;
      v = w.map((x) => x / len);
    }
    const lambda = dot(v, C.map((row) => dot(row, v)));
    // Fix the sign so the picture does not flip between runs.
    const pivot = v.reduce((best, x, i) => (Math.abs(x) > Math.abs(v[best]) ? i : best), 0);
    if (v[pivot] < 0) v = v.map((x) => -x);
    components.push(v);
    variances.push(lambda);
    for (let i = 0; i < d; i++) for (let j = 0; j < d; j++) C[i][j] -= lambda * v[i] * v[j];
  }

  return { mean, components, variances, totalVariance };
}

/** Projects a vector onto two principal components. Linear, so it preserves vector arithmetic. */
export function project(v: number[], p: PCAResult, cx: number, cy: number): [number, number] {
  const centred = sub(v, p.mean);
  return [dot(centred, p.components[cx]), dot(centred, p.components[cy])];
}
