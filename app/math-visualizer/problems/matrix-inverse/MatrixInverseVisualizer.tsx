'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui';

/* ------------------------------------------------------------------ */
/* Exact fraction arithmetic, so every step shows clean values like 3/4 */
/* ------------------------------------------------------------------ */

interface Frac {
  n: number; // numerator
  d: number; // denominator, always > 0
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function frac(n: number, d = 1): Frac {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

const sub = (x: Frac, y: Frac) => frac(x.n * y.d - y.n * x.d, x.d * y.d);
const mul = (x: Frac, y: Frac) => frac(x.n * y.n, x.d * y.d);
const div = (x: Frac, y: Frac) => frac(x.n * y.d, x.d * y.n);
const isZero = (x: Frac) => x.n === 0;
const isOne = (x: Frac) => x.n === 1 && x.d === 1;

/** "3", "−3/4" (uses a real minus sign). */
function fmt(x: Frac): string {
  const sign = x.n < 0 ? '−' : '';
  const n = Math.abs(x.n);
  return x.d === 1 ? `${sign}${n}` : `${sign}${n}/${x.d}`;
}

/** Coefficient in front of a row name: "3", "(3/4)". */
function coef(x: Frac): string {
  return x.d === 1 ? fmt(x) : `(${fmt(x)})`;
}

/* ------------------------------------------------------------------ */
/* Gauss-Jordan elimination on [A | I], recording every row operation  */
/* ------------------------------------------------------------------ */

type StepKind = 'start' | 'swap' | 'scale' | 'eliminate' | 'singular' | 'done';

interface Step {
  kind: StepKind;
  /** Short operation, e.g. "R2 ← R2 − 3·R1". */
  label: string;
  /** One sentence explaining why. */
  detail: string;
  /** The augmented matrix after this step. */
  matrix: Frac[][];
  /** Row that was changed (0-based). */
  target?: number;
  /** Row that was used to change it. */
  source?: number;
  /** Column currently being cleared. */
  column?: number;
}

function gaussJordan(a: number[][]): { steps: Step[]; inverse: Frac[][] | null } {
  const n = a.length;
  const m: Frac[][] = a.map((row, i) => [...row.map((v) => frac(v)), ...row.map((_, j) => frac(i === j ? 1 : 0))]);
  const snapshot = () => m.map((row) => [...row]);
  const steps: Step[] = [
    {
      kind: 'start',
      label: 'Start with [A | I]',
      detail: 'Write A next to the identity matrix. Every row operation is applied to the whole row, both halves.',
      matrix: snapshot(),
    },
  ];

  for (let c = 0; c < n; c++) {
    // 1. Find a row (at or below c) with a non-zero entry in column c.
    let p = c;
    while (p < n && isZero(m[p][c])) p++;

    if (p === n) {
      steps.push({
        kind: 'singular',
        label: `No pivot in column ${c + 1}`,
        detail: `Every entry of column ${c + 1} on or below row ${c + 1} is 0, so the left side can never become I. The rows of A are linearly dependent: det(A) = 0 and A has no inverse.`,
        matrix: snapshot(),
        column: c,
      });
      return { steps, inverse: null };
    }

    // 2. Move the pivot row into place.
    if (p !== c) {
      [m[c], m[p]] = [m[p], m[c]];
      steps.push({
        kind: 'swap',
        label: `R${c + 1} ↔ R${p + 1}`,
        detail: `The entry in row ${c + 1}, column ${c + 1} is 0, so swap with row ${p + 1}, which has a non-zero entry there.`,
        matrix: snapshot(),
        target: c,
        source: p,
        column: c,
      });
    }

    // 3. Scale the pivot row so the pivot becomes 1.
    const pivot = m[c][c];
    if (!isOne(pivot)) {
      const factor = div(frac(1), pivot);
      m[c] = m[c].map((v) => mul(v, factor));
      steps.push({
        kind: 'scale',
        label: `R${c + 1} ← ${coef(factor)}·R${c + 1}`,
        detail: `Divide row ${c + 1} by its pivot ${fmt(pivot)} so the pivot becomes 1.`,
        matrix: snapshot(),
        target: c,
        column: c,
      });
    }

    // 4. Clear every other entry in column c.
    for (let r = 0; r < n; r++) {
      if (r === c || isZero(m[r][c])) continue;
      const f = m[r][c];
      m[r] = m[r].map((v, j) => sub(v, mul(f, m[c][j])));
      const op = f.n > 0 ? '−' : '+';
      const size = frac(Math.abs(f.n), f.d);
      steps.push({
        kind: 'eliminate',
        label: `R${r + 1} ← R${r + 1} ${op} ${isOne(size) ? '' : `${coef(size)}·`}R${c + 1}`,
        detail: `Row ${r + 1} has ${fmt(f)} in column ${c + 1}. ${f.n > 0 ? 'Subtract' : 'Add'} ${fmt(size)} times row ${c + 1} to make it 0.`,
        matrix: snapshot(),
        target: r,
        source: c,
        column: c,
      });
    }
  }

  steps.push({
    kind: 'done',
    label: 'Done: [I | A⁻¹]',
    detail: 'The left half is now the identity matrix, so the right half is the inverse of A.',
    matrix: snapshot(),
  });
  return { steps, inverse: m.map((row) => row.slice(n)) };
}

function determinant(a: number[][]): number {
  if (a.length === 2) return a[0][0] * a[1][1] - a[0][1] * a[1][0];
  return (
    a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) -
    a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) +
    a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0])
  );
}

/* ------------------------------------------------------------------ */
/* Presets                                                             */
/* ------------------------------------------------------------------ */

type Size = 2 | 3;

const presets: Record<Size, { name: string; values: number[][] }[]> = {
  2: [
    { name: 'Example', values: [[4, 7], [2, 6]] },
    { name: 'Needs a swap', values: [[0, 1], [2, 3]] },
    { name: 'Singular', values: [[2, 4], [1, 2]] },
  ],
  3: [
    { name: 'Example', values: [[2, 1, 1], [1, 3, 2], [1, 0, 0]] },
    { name: 'Needs a swap', values: [[0, 2, 1], [1, 1, 0], [2, 0, 1]] },
    { name: 'Singular', values: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
  ],
};

const toStrings = (values: number[][]) => values.map((row) => row.map(String));

/** Parses an entry; blanks and invalid input count as 0. Entries are integers so the fractions stay exact. */
function parseEntry(s: string): number {
  const v = Math.round(Number(s));
  return Number.isFinite(v) ? v : 0;
}

/* ------------------------------------------------------------------ */
/* Small display pieces                                                */
/* ------------------------------------------------------------------ */

/** A matrix with bracket borders. */
function Bracketed({ rows }: { rows: string[][] }) {
  return (
    <div
      className="inline-grid gap-x-4 gap-y-1 rounded-md border-x-2 border-ink px-3 py-1 font-mono text-sm text-ink"
      style={{ gridTemplateColumns: `repeat(${rows[0].length}, auto)` }}
    >
      {rows.flat().map((v, i) => (
        <span key={i} className="text-right tabular-nums">
          {v}
        </span>
      ))}
    </div>
  );
}

function AugmentedMatrix({ step, n }: { step: Step; n: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-subtle p-3">
      <div
        className="mx-auto grid w-max font-mono text-sm sm:text-base"
        style={{ gridTemplateColumns: `repeat(${2 * n}, minmax(3.5rem, auto))` }}
      >
        {step.matrix.map((row, r) =>
          row.map((v, c) => {
            const isTarget = r === step.target;
            const isSource = r === step.source && step.kind !== 'swap';
            const isPivot = step.column !== undefined && r === step.column && c === step.column && step.kind !== 'singular';
            const inBadColumn = step.kind === 'singular' && c === step.column && r >= step.column;
            const rowTint = isTarget ? 'bg-amber-100' : isSource ? 'bg-sky-100' : step.kind === 'swap' && r === step.source ? 'bg-amber-100' : '';
            return (
              <div
                key={`${r}-${c}`}
                className={`px-2 py-2 text-right tabular-nums ${rowTint} ${c === n ? 'border-l-2 border-ink-faint' : ''} ${
                  c >= n ? 'text-violet-700' : 'text-ink'
                }`}
              >
                <span
                  className={`inline-block min-w-[2rem] rounded px-1 ${isPivot ? 'ring-2 ring-brand-500' : ''} ${
                    inBadColumn ? 'bg-red-100 text-red-700 ring-2 ring-red-400' : ''
                  }`}
                >
                  {fmt(v)}
                </span>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Visualizer                                                          */
/* ------------------------------------------------------------------ */

export default function MatrixInverseVisualizer() {
  const [size, setSize] = useState<Size>(2);
  const [entries, setEntries] = useState<Record<Size, string[][]>>({
    2: toStrings(presets[2][0].values),
    3: toStrings(presets[3][0].values),
  });
  const [stepIndex, setStepIndex] = useState(0);

  const values = entries[size].map((row) => row.map(parseEntry));
  const det = determinant(values);
  const { steps, inverse } = gaussJordan(values);
  const current = Math.min(stepIndex, steps.length - 1);
  const step = steps[current];

  const changeSize = (next: Size) => {
    setSize(next);
    setStepIndex(0);
  };

  const editEntry = (r: number, c: number, text: string) => {
    setEntries((prev) => ({
      ...prev,
      [size]: prev[size].map((row, i) => (i === r ? row.map((v, j) => (j === c ? text : v)) : row)),
    }));
    setStepIndex(0);
  };

  const loadPreset = (preset: number[][]) => {
    setEntries((prev) => ({ ...prev, [size]: toStrings(preset) }));
    setStepIndex(0);
  };

  const [[a, b], [c, d]] = values;

  return (
    <div className="space-y-6 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-semibold text-ink">Size</span>
        {([2, 3] as const).map((s) => (
          <Button key={s} size="sm" variant={size === s ? 'primary' : 'outline'} onClick={() => changeSize(s)}>
            {s}×{s}
          </Button>
        ))}
        <span className="ml-2 mr-1 text-sm font-semibold text-ink">Load</span>
        {presets[size].map((p) => (
          <Button key={p.name} size="sm" variant="ghost" onClick={() => loadPreset(p.values)}>
            {p.name}
          </Button>
        ))}
      </div>

      {/* Matrix input and determinant */}
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Matrix A (integers)</p>
          <div className="inline-grid gap-2 rounded-md border-x-2 border-ink px-2 py-1" style={{ gridTemplateColumns: `repeat(${size}, 4rem)` }}>
            {entries[size].map((row, r) =>
              row.map((v, col) => (
                <input
                  key={`${r}-${col}`}
                  type="number"
                  step={1}
                  inputMode="numeric"
                  value={v}
                  aria-label={`Row ${r + 1}, column ${col + 1}`}
                  onChange={(e) => editEntry(r, col, e.target.value)}
                  className="h-10 w-16 rounded-control border border-line-strong bg-white text-center font-mono text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              )),
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="text-sm text-ink-muted">Determinant</p>
            <p className="font-mono text-2xl font-semibold text-ink">det(A) = {fmt(frac(det))}</p>
          </div>
          {det === 0 ? (
            <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
              <p>
                <strong>Singular matrix.</strong> Because det(A) = 0, A squashes space into a lower dimension and cannot be
                undone. Step through the elimination to see where it gets stuck.
              </p>
            </div>
          ) : (
            <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
              <p>det(A) ≠ 0, so A is invertible. Gauss-Jordan elimination will turn [A | I] into [I | A⁻¹].</p>
            </div>
          )}
        </div>
      </div>

      {/* Elimination steps */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-4">
          <div>
            <p className="text-sm text-ink-muted">
              Step {current + 1} of {steps.length}
            </p>
            <p className="font-mono text-lg font-semibold text-ink">{step.label}</p>
            <p className="mt-1 text-sm text-ink-muted">{step.detail}</p>
          </div>

          <AugmentedMatrix step={step} n={size} />

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-amber-100 ring-1 ring-amber-300" /> changed row
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-sky-100 ring-1 ring-sky-300" /> row used
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm ring-2 ring-brand-500" /> pivot
            </span>
            <span className="text-violet-700">right half: becomes A⁻¹</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setStepIndex(0)} disabled={current === 0} aria-label="First step">
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setStepIndex(current - 1)}
              disabled={current === 0}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Back
            </Button>
            <Button
              size="sm"
              onClick={() => setStepIndex(current + 1)}
              disabled={current === steps.length - 1}
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              Next step
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setStepIndex(steps.length - 1)}
              disabled={current === steps.length - 1}
              aria-label="Last step"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Row operations</p>
          <ol className="max-h-80 space-y-1 overflow-y-auto rounded-xl border border-line p-2">
            {steps.map((s, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setStepIndex(i)}
                  className={`w-full rounded-lg px-3 py-1.5 text-left font-mono text-sm transition-colors ${
                    i === current ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-200' : 'text-ink-muted hover:bg-subtle'
                  } ${s.kind === 'singular' ? 'text-red-700' : ''}`}
                >
                  {i + 1}. {s.label}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Result */}
      {current === steps.length - 1 && (
        <div className="overflow-x-auto rounded-xl border border-line bg-subtle p-4">
          {inverse ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-lg font-semibold text-ink">A⁻¹ =</span>
              <Bracketed rows={inverse.map((row) => row.map(fmt))} />
            </div>
          ) : (
            <p className="text-sm text-red-800">
              Elimination stopped: A has no inverse. Any system Ax = b either has no solution or infinitely many.
            </p>
          )}
        </div>
      )}

      {/* 2×2 shortcut */}
      {size === 2 && (
        <div className="space-y-3 rounded-xl border border-violet-200 bg-violet-50/60 p-4">
          <p className="font-semibold text-violet-900">2×2 shortcut: the adjugate formula</p>
          <p className="text-sm text-ink-muted">
            Swap the diagonal entries, negate the off-diagonal entries, then divide by the determinant.
          </p>
          <div className="overflow-x-auto">
            <div className="flex w-max flex-wrap items-center gap-3 font-mono text-sm text-ink">
              <span>A⁻¹ = 1/(ad − bc) ×</span>
              <Bracketed rows={[['d', '−b'], ['−c', 'a']]} />
              <span>= 1/{fmt(frac(det))} ×</span>
              <Bracketed rows={[[fmt(frac(d)), fmt(frac(-b))], [fmt(frac(-c)), fmt(frac(a))]]} />
              {det !== 0 ? (
                <>
                  <span>=</span>
                  <Bracketed
                    rows={[
                      [fmt(frac(d, det)), fmt(frac(-b, det))],
                      [fmt(frac(-c, det)), fmt(frac(a, det))],
                    ]}
                  />
                </>
              ) : (
                <span className="text-red-700">undefined (division by 0)</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
