'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ListChecks, RotateCcw } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';

const WIDTH = 800;
const HEIGHT = 480;
const MARGIN = 20;
const MAX_VALUE = 1000;

/** One colour per division step, used in both the table and the tiling. */
const STEP_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#0ea5e9', '#8b5cf6', '#ef4444', '#14b8a6', '#84cc16', '#f97316'];
const colorFor = (step: number) => STEP_COLORS[step % STEP_COLORS.length];

const presets: [number, number][] = [
  [1071, 462],
  [48, 18],
  [89, 55],
  [120, 84],
  [35, 64],
];

interface DivisionStep {
  a: number;
  b: number;
  q: number;
  r: number;
}

/** a = q·b + r, repeated with (a, b) ← (b, r) until the remainder is 0. */
function euclidSteps(a: number, b: number): DivisionStep[] {
  const steps: DivisionStep[] = [];
  while (b !== 0) {
    const q = Math.floor(a / b);
    const r = a - q * b;
    steps.push({ a, b, q, r });
    [a, b] = [b, r];
  }
  return steps;
}

interface ExtendedRow {
  r: number;
  q: number | null;
  s: number;
  t: number;
}

/** Extended Euclid as a table where every row satisfies r = s·a + t·b. */
function extendedRows(a: number, b: number): ExtendedRow[] {
  const rows: ExtendedRow[] = [
    { r: a, q: null, s: 1, t: 0 },
    { r: b, q: null, s: 0, t: 1 },
  ];
  while (rows[rows.length - 1].r !== 0) {
    const prev = rows[rows.length - 2];
    const cur = rows[rows.length - 1];
    const q = Math.floor(prev.r / cur.r);
    cur.q = q;
    rows.push({ r: prev.r - q * cur.r, q: null, s: prev.s - q * cur.s, t: prev.t - q * cur.t });
  }
  return rows;
}

interface Square {
  x: number;
  y: number;
  size: number;
  step: number;
}

/**
 * Tiles a w×h rectangle with the largest squares that fit, one division step at a time.
 * Each step lays q squares of side = shorter edge along the longer edge, leaving an r × shorter-edge strip.
 */
function tile(w: number, h: number): Square[] {
  const squares: Square[] = [];
  let x = 0;
  let y = 0;
  let step = 0;
  while (w > 0 && h > 0) {
    if (w >= h) {
      const count = Math.floor(w / h);
      for (let i = 0; i < count; i++) squares.push({ x: x + i * h, y, size: h, step });
      x += count * h;
      w -= count * h;
    } else {
      const count = Math.floor(h / w);
      for (let i = 0; i < count; i++) squares.push({ x, y: y + i * w, size: w, step });
      y += count * w;
      h -= count * w;
    }
    step++;
  }
  return squares;
}

const parse = (text: string) => {
  const n = Number(text);
  return Number.isInteger(n) && n >= 1 && n <= MAX_VALUE ? n : null;
};

export default function EuclideanAlgorithmVisualizer() {
  const [aText, setAText] = useState('1071');
  const [bText, setBText] = useState('462');
  const [shown, setShown] = useState(Infinity);
  const [showExtended, setShowExtended] = useState(false);

  const a = parse(aText);
  const b = parse(bText);
  const valid = a !== null && b !== null;

  const steps = valid ? euclidSteps(a, b) : [];
  const gcd = steps.length ? steps[steps.length - 1].b : 0;
  const lcm = valid ? (a / gcd) * b : 0;
  const visible = Math.min(shown, steps.length);

  // The tiling uses the long side horizontally. If a < b the first division step is a = 0·b + a,
  // which only swaps the numbers, so it has no squares of its own.
  const swapStep = valid && a < b ? 1 : 0;
  const w = valid ? Math.max(a, b) : 1;
  const h = valid ? Math.min(a, b) : 1;
  const squares = valid ? tile(w, h) : [];
  const scale = Math.min((WIDTH - 2 * MARGIN) / w, (HEIGHT - 2 * MARGIN) / h);
  const offsetX = (WIDTH - w * scale) / 2;
  const offsetY = (HEIGHT - h * scale) / 2;

  const extended = valid && showExtended ? extendedRows(a, b) : [];
  const bezout = extended.length >= 2 ? extended[extended.length - 2] : null;

  const loadPreset = ([pa, pb]: [number, number]) => {
    setAText(String(pa));
    setBText(String(pb));
    setShown(Infinity);
  };

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-28">
          <Input
            label="a"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_VALUE}
            value={aText}
            onChange={(e) => {
              setAText(e.target.value);
              setShown(Infinity);
            }}
          />
        </div>
        <div className="w-28">
          <Input
            label="b"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_VALUE}
            value={bText}
            onChange={(e) => {
              setBText(e.target.value);
              setShown(Infinity);
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ink-muted">Try:</span>
          {presets.map((p) => (
            <Button key={p.join()} size="sm" variant="outline" onClick={() => loadPreset(p)}>
              {p[0]}, {p[1]}
            </Button>
          ))}
        </div>
      </div>

      {!valid ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900">
          Enter two whole numbers between 1 and {MAX_VALUE}.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<RotateCcw className="h-4 w-4" />}
              disabled={visible === 0}
              onClick={() => setShown(0)}
            >
              Start over
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<ChevronLeft className="h-4 w-4" />}
              disabled={visible === 0}
              onClick={() => setShown(visible - 1)}
            >
              Back
            </Button>
            <Button
              size="sm"
              rightIcon={<ChevronRight className="h-4 w-4" />}
              disabled={visible === steps.length}
              onClick={() => setShown(visible + 1)}
            >
              Next step
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<ListChecks className="h-4 w-4" />}
              disabled={visible === steps.length}
              onClick={() => setShown(Infinity)}
            >
              Show all
            </Button>
            <span className="text-sm text-ink-muted">
              Step {visible} of {steps.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className={`${responsiveSurface} rounded-lg border border-line bg-subtle`}
                role="img"
                aria-label={`A ${w} by ${h} rectangle tiled with squares`}
              >
                <rect
                  x={offsetX}
                  y={offsetY}
                  width={w * scale}
                  height={h * scale}
                  fill="white"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="8 6"
                />
                {squares
                  .filter((sq) => sq.step + swapStep < visible)
                  .map((sq, i) => {
                    const side = sq.size * scale;
                    const isLatest = sq.step + swapStep === visible - 1;
                    return (
                      <g key={i}>
                        <rect
                          x={offsetX + sq.x * scale}
                          y={offsetY + sq.y * scale}
                          width={side}
                          height={side}
                          fill={colorFor(sq.step + swapStep)}
                          fillOpacity={isLatest ? 0.85 : 0.45}
                          stroke="white"
                          strokeWidth={Math.min(2, side / 4)}
                        />
                        {side >= 44 && (
                          <text
                            x={offsetX + (sq.x + sq.size / 2) * scale}
                            y={offsetY + (sq.y + sq.size / 2) * scale}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={Math.min(32, side * 0.35)}
                            fontWeight={600}
                            fill="#0f172a"
                          >
                            {sq.size}
                          </text>
                        )}
                      </g>
                    );
                  })}
              </svg>
              <p className="mt-2 text-sm text-ink-muted">
                A {w} × {h} rectangle. Each step fills the remaining strip with the largest squares that fit. The last,
                smallest square has side {gcd} = gcd, and it tiles every square before it.
              </p>
            </div>

            <div className="space-y-4">
              <div className="overflow-x-auto rounded-lg border border-line">
                <table className="w-full text-sm">
                  <thead className="bg-subtle text-left text-ink-muted">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-semibold">
                        Step
                      </th>
                      <th scope="col" className="px-3 py-2 font-semibold">
                        a = q × b + r
                      </th>
                      <th scope="col" className="px-3 py-2 text-right font-semibold">
                        r
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {steps.slice(0, visible).map((s, i) => (
                      <tr key={i} className={i === visible - 1 ? 'bg-brand-50/60' : ''}>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: colorFor(i) }} />
                            {i + 1}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 font-mono tabular-nums text-ink">
                          {s.a} = {s.q} × {s.b} + {s.r}
                        </td>
                        <td className="px-3 py-2 text-right font-mono tabular-nums text-ink">{s.r}</td>
                      </tr>
                    ))}
                    {visible === 0 && (
                      <tr>
                        <td colSpan={3} className="px-3 py-4 text-center text-ink-muted">
                          Press Next step to divide {a} by {b}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg border border-line bg-white px-3 py-2">
                  <div className="text-xs text-ink-muted">gcd({a}, {b})</div>
                  <div className="font-mono text-xl font-semibold text-brand-700">
                    {visible === steps.length ? gcd : '?'}
                  </div>
                </div>
                <div className="rounded-lg border border-line bg-white px-3 py-2">
                  <div className="text-xs text-ink-muted">lcm = a × b / gcd</div>
                  <div className="break-words font-mono text-xl font-semibold text-ink">
                    {visible === steps.length ? lcm : '?'}
                  </div>
                </div>
              </div>
              {visible === steps.length && (
                <p className="text-sm text-ink">
                  The remainder hit 0, so the last non-zero remainder (the last divisor), {gcd}, is the GCD.{' '}
                  {gcd === 1 && <>The numbers are coprime.</>}
                </p>
              )}

              <label className="inline-flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={showExtended} onChange={(e) => setShowExtended(e.target.checked)} />
                Show extended Euclid (Bézout coefficients)
              </label>
            </div>
          </div>

          {showExtended && bezout && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-lg border border-line">
                <table className="w-full text-sm">
                  <thead className="bg-subtle text-left text-ink-muted">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-right font-semibold">r</th>
                      <th scope="col" className="px-3 py-2 text-right font-semibold">q</th>
                      <th scope="col" className="px-3 py-2 text-right font-semibold">s</th>
                      <th scope="col" className="px-3 py-2 text-right font-semibold">t</th>
                      <th scope="col" className="px-3 py-2 font-semibold">check: r = s·a + t·b</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line font-mono tabular-nums">
                    {extended.slice(0, -1).map((row, i) => (
                      <tr key={i} className={row === bezout ? 'bg-emerald-50/70' : ''}>
                        <td className="px-3 py-2 text-right text-ink">{row.r}</td>
                        <td className="px-3 py-2 text-right text-ink-muted">{row.q ?? ''}</td>
                        <td className="px-3 py-2 text-right text-ink">{row.s}</td>
                        <td className="px-3 py-2 text-right text-ink">{row.t}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-ink-muted">
                          {row.s}·{a} {row.t < 0 ? '−' : '+'} {Math.abs(row.t)}·{b} = {row.s * a + row.t * b}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 font-mono text-sm text-emerald-900">
                gcd({a}, {b}) = {gcd} = ({bezout.s})·{a} + ({bezout.t})·{b}
              </p>
              <p className="text-sm text-ink-muted">
                Each new row is the row two above minus q times the row above, so r = s·a + t·b stays true all the way
                down. The highlighted row holds the GCD and its Bézout coefficients.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
