'use client';

import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';

/* ------------------------------------------------------------------ */
/* Number theory helpers                                               */
/* ------------------------------------------------------------------ */

/** Remainder that is always in 0..n-1, also for negative numbers. */
const mod = (x: number, n: number) => ((x % n) + n) % n;

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/** Inverse of a mod n via the extended Euclidean algorithm, or null when gcd(a, n) ≠ 1. */
function modInverse(a: number, n: number): number | null {
  let [oldR, r] = [mod(a, n), n];
  let [oldS, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  return oldR === 1 ? mod(oldS, n) : null;
}

/* ------------------------------------------------------------------ */
/* Small UI pieces                                                     */
/* ------------------------------------------------------------------ */

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block min-w-0 flex-1 basis-40 text-sm font-medium text-ink">
      <span className="flex justify-between gap-2">
        <span>{label}</span>
        <span className="font-mono text-ink-muted">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-brand-600"
      />
    </label>
  );
}

function Panel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Clock arithmetic                                                    */
/* ------------------------------------------------------------------ */

type Operation = 'add' | 'multiply';

const CLOCK_SIZE = 420;
const CENTER = CLOCK_SIZE / 2;
const RADIUS = 150;

/** Point on the clock face for residue k (0 at the top, increasing clockwise). */
function clockPoint(k: number, n: number, radius = RADIUS) {
  const angle = (2 * Math.PI * k) / n - Math.PI / 2;
  return { x: CENTER + radius * Math.cos(angle), y: CENTER + radius * Math.sin(angle) };
}

/**
 * The positions visited on the clock.
 * - Addition: start at 0, walk a single steps, then b more single steps.
 * - Multiplication: start at 0 and make b jumps of size a.
 * Each entry is an unreduced running total; reduce it mod n to find where it sits on the clock.
 */
function visitedTotals(operation: Operation, a: number, b: number): number[] {
  if (operation === 'add') return Array.from({ length: a + b + 1 }, (_, k) => k);
  return Array.from({ length: b + 1 }, (_, k) => k * a);
}

function ClockView() {
  const [n, setN] = useState(12);
  const [a, setA] = useState(9);
  const [b, setB] = useState(7);
  const [operation, setOperation] = useState<Operation>('add');
  const totals = visitedTotals(operation, a, b);
  const lastStep = totals.length - 1;
  const [step, setStep] = useState(lastStep);
  const [playing, setPlaying] = useState(false);

  // Any input change shows the finished walk again.
  const update = (setter: (v: number) => void) => (v: number) => {
    setter(v);
    setPlaying(false);
    setStep(Infinity);
  };
  const shownStep = Math.min(step, lastStep);

  const running = playing && shownStep < lastStep;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, lastStep)), operation === 'add' ? 260 : 600);
    return () => window.clearInterval(id);
  }, [running, lastStep, operation]);

  const play = () => {
    if (shownStep >= lastStep) setStep(0);
    setPlaying(true);
  };

  const exact = operation === 'add' ? a + b : a * b;
  const result = mod(exact, n);
  const current = totals[shownStep];
  const symbol = operation === 'add' ? '+' : '×';

  // Addition is drawn as a spiral that moves inward on every lap so wrap-arounds stay visible.
  const laps = Math.max(1, Math.ceil((a + b) / n));
  const lapGap = Math.min(22, 90 / laps);
  const spiralPoint = (k: number) => clockPoint(k, n, RADIUS - 18 - (lapGap * k) / n);
  const spiralPath = (from: number, to: number) => {
    const pts: string[] = [];
    const samples = Math.max(2, (to - from) * 8);
    for (let i = 0; i <= samples; i++) {
      const p = spiralPoint(from + ((to - from) * i) / samples);
      pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    }
    return `M ${pts.join(' L ')}`;
  };

  const marker = operation === 'add' ? spiralPoint(current) : clockPoint(mod(current, n), n, RADIUS);
  const tickFont = n > 16 ? 18 : 22;

  return (
    <Panel
      title="Clock arithmetic"
      description="Numbers mod n live on a clock with n positions. Going past n − 1 wraps back to 0."
    >
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={operation === 'add' ? 'primary' : 'outline'}
          onClick={() => {
            setOperation('add');
            setPlaying(false);
            setStep(Infinity);
          }}
        >
          a + b mod n
        </Button>
        <Button
          size="sm"
          variant={operation === 'multiply' ? 'primary' : 'outline'}
          onClick={() => {
            setOperation('multiply');
            setPlaying(false);
            setStep(Infinity);
          }}
        >
          a × b mod n
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-4">
        <Slider label="Modulus n" value={n} min={2} max={24} onChange={update(setN)} />
        <Slider label="a" value={a} min={0} max={30} onChange={update(setA)} />
        <Slider label="b" value={b} min={0} max={30} onChange={update(setB)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <div className="mx-auto w-full max-w-md">
          <svg
            viewBox={`0 0 ${CLOCK_SIZE} ${CLOCK_SIZE}`}
            className={responsiveSurface}
            role="img"
            aria-label={`Clock for arithmetic mod ${n}`}
          >
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={3} />

            {Array.from({ length: n }, (_, k) => {
              const dot = clockPoint(k, n);
              const label = clockPoint(k, n, RADIUS + 34);
              const isResult = shownStep === lastStep && k === result;
              return (
                <g key={k}>
                  <circle cx={dot.x} cy={dot.y} r={isResult ? 10 : 6} fill={isResult ? '#10b981' : '#64748b'} />
                  <text
                    x={label.x}
                    y={label.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={tickFont}
                    fontWeight={isResult ? 700 : 500}
                    fill={isResult ? '#047857' : '#334155'}
                  >
                    {k}
                  </text>
                </g>
              );
            })}

            {operation === 'add' ? (
              <>
                {/* First a steps in blue, then b steps in orange. */}
                {shownStep > 0 && (
                  <path
                    d={spiralPath(0, Math.min(shownStep, a))}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth={5}
                    strokeLinecap="round"
                  />
                )}
                {shownStep > a && (
                  <path d={spiralPath(a, shownStep)} fill="none" stroke="#f97316" strokeWidth={5} strokeLinecap="round" />
                )}
              </>
            ) : (
              totals.slice(1, shownStep + 1).map((total, i) => {
                const from = clockPoint(mod(totals[i], n), n, RADIUS);
                const to = clockPoint(mod(total, n), n, RADIUS);
                return (
                  <line
                    key={i}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={i === shownStep - 1 ? '#f97316' : '#93c5fd'}
                    strokeWidth={i === shownStep - 1 ? 5 : 3}
                    strokeLinecap="round"
                  />
                );
              })
            )}

            <circle cx={marker.x} cy={marker.y} r={11} fill="#f97316" stroke="white" strokeWidth={3} />
            <text x={CENTER} y={CENTER - 14} textAnchor="middle" fontSize={22} fill="#64748b">
              mod {n}
            </text>
            <text x={CENTER} y={CENTER + 20} textAnchor="middle" fontSize={34} fontWeight={700} fill="#0f172a">
              {mod(current, n)}
            </text>
          </svg>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-subtle p-4 font-mono text-sm text-ink">
            <p>
              {a} {symbol} {b} = {exact}
            </p>
            <p className="mt-1">
              {exact} = {Math.floor(exact / n)} × {n} + {result}
            </p>
            <p className="mt-2 text-base font-semibold text-emerald-700">
              {a} {symbol} {b} ≡ {result} (mod {n})
            </p>
          </div>

          <p className="text-sm text-ink-muted">
            {operation === 'add'
              ? `Start at 0, take ${a} single steps (blue), then ${b} more (orange). Each full lap of the clock is a multiple of ${n} that the remainder forgets.`
              : `Start at 0 and make ${b} jumps of size ${a}. After ${b} jumps you have travelled ${exact} steps, which lands on ${result}.`}
          </p>

          <p className="text-sm text-ink">
            Step {shownStep} of {lastStep}
            {operation === 'add' ? ' single steps' : ' jumps'}, running total {current} ≡ {mod(current, n)}
          </p>

          <div className="flex flex-wrap gap-2">
            {running ? (
              <Button size="sm" variant="outline" leftIcon={<Pause className="h-4 w-4" />} onClick={() => setPlaying(false)}>
                Pause
              </Button>
            ) : (
              <Button size="sm" leftIcon={<Play className="h-4 w-4" />} onClick={play} disabled={lastStep === 0}>
                Animate steps
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              leftIcon={<RotateCcw className="h-4 w-4" />}
              onClick={() => {
                setPlaying(false);
                setStep(0);
              }}
            >
              Back to 0
            </Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Times-table circle                                                  */
/* ------------------------------------------------------------------ */

const TABLE_SIZE = 600;
const TABLE_CENTER = TABLE_SIZE / 2;
const TABLE_RADIUS = 270;

function TimesTableCircle() {
  const [n, setN] = useState(120);
  const [m, setM] = useState(2);

  const point = (k: number) => {
    const angle = (2 * Math.PI * k) / n + Math.PI; // start on the left like the classic picture
    return { x: TABLE_CENTER + TABLE_RADIUS * Math.cos(angle), y: TABLE_CENTER + TABLE_RADIUS * Math.sin(angle) };
  };

  const famous: Record<number, string> = {
    2: 'a cardioid (one cusp)',
    3: 'a nephroid (two cusps)',
    4: 'three cusps',
    5: 'four cusps',
  };

  return (
    <Panel
      title="Times-table circle"
      description="Place n points around a circle and draw a line from every k to k·m mod n. Multiplication mod n turns into a curve."
    >
      <div className="flex flex-wrap gap-x-6 gap-y-4">
        <Slider label="Points n" value={n} min={10} max={300} onChange={setN} />
        <Slider label="Multiplier m" value={m} min={2} max={60} onChange={setM} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
        <div className="mx-auto w-full max-w-xl">
          <svg
            viewBox={`0 0 ${TABLE_SIZE} ${TABLE_SIZE}`}
            className={responsiveSurface}
            role="img"
            aria-label={`Times table ${m} mod ${n}`}
          >
            <rect width={TABLE_SIZE} height={TABLE_SIZE} rx={24} fill="#0f172a" />
            <circle cx={TABLE_CENTER} cy={TABLE_CENTER} r={TABLE_RADIUS} fill="none" stroke="#334155" strokeWidth={2} />
            {Array.from({ length: n }, (_, k) => {
              const from = point(k);
              const to = point(mod(k * m, n));
              return (
                <line
                  key={k}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={`hsl(${(360 * k) / n}, 85%, 62%)`}
                  strokeOpacity={0.75}
                  strokeWidth={1.2}
                />
              );
            })}
          </svg>
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          <p>
            Line k connects point <span className="font-mono">k</span> to point{' '}
            <span className="font-mono">
              k × {m} mod {n}
            </span>
            . For example, point 7 connects to {mod(7 * m, n)}.
          </p>
          <p>
            {famous[m]
              ? `With m = ${m} the envelope of the lines is ${famous[m]}. In general m gives m − 1 cusps.`
              : `In general the envelope has m − 1 cusps, so m = ${m} gives ${m - 1}. Try m = 2 for the cardioid.`}
          </p>
          <p>
            Interesting coincidences appear when m is close to n or to a simple fraction of n, for example m = {n + 1} would
            look exactly like m = 1 because {n + 1} ≡ 1 (mod {n}).
          </p>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Congruence classes and inverses                                     */
/* ------------------------------------------------------------------ */

function CongruenceTable() {
  const [n, setN] = useState(10);
  const units = Array.from({ length: n }, (_, r) => r).filter((r) => gcd(r, n) === 1).length;

  return (
    <Panel
      title="Congruence classes and inverses"
      description="Every integer falls into exactly one class [r], the numbers that leave remainder r when divided by n."
    >
      <div className="flex flex-wrap gap-x-6 gap-y-4">
        <Slider label="Modulus n" value={n} min={2} max={16} onChange={setN} />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[30rem] text-sm">
          <thead className="border-b border-line bg-subtle text-left text-ink">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">Class</th>
              <th scope="col" className="px-3 py-2 font-semibold">Some members</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">gcd(r, {n})</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">Inverse r⁻¹</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line font-mono text-gray-700">
            {Array.from({ length: n }, (_, r) => {
              const inverse = modInverse(r, n);
              return (
                <tr key={r}>
                  <td className="px-3 py-2 font-semibold text-ink">[{r}]</td>
                  <td className="whitespace-nowrap px-3 py-2">
                    …, {r - 2 * n}, {r - n}, {r}, {r + n}, {r + 2 * n}, …
                  </td>
                  <td className="px-3 py-2 text-right">{gcd(r, n)}</td>
                  <td className={`px-3 py-2 text-right ${inverse === null ? 'text-ink-faint' : 'font-semibold text-emerald-700'}`}>
                    {inverse === null ? 'none' : `${inverse}  (${r}·${inverse} ≡ 1)`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-ink-muted">
        A class r has a multiplicative inverse exactly when gcd(r, n) = 1. Here {units} of the {n} classes are invertible
        {units === n - 1 ? `, every non-zero class, because ${n} is prime.` : '.'}
      </p>
    </Panel>
  );
}

export default function ModularArithmeticVisualizer() {
  return (
    <div className="space-y-6">
      <ClockView />
      <TimesTableCircle />
      <CongruenceTable />
    </div>
  );
}
