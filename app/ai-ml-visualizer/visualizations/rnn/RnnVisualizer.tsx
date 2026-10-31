'use client';

import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw, StepBack, StepForward } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';

/* ------------------------------------------------------------------ */
/* Toy model                                                           */
/* ------------------------------------------------------------------ */

const H = 4; // hidden size
const D = 3; // input size
const MAX_LEN = 8;

type Vec = number[];
type Mat = number[][];

/** Each letter gets a fixed 3-number code: a point on a circle plus an odd/even flag. */
function encodeChar(ch: string): Vec {
  const c = ch.charCodeAt(0) - 97;
  const theta = (2 * Math.PI * c) / 26;
  return [Math.cos(theta), Math.sin(theta), c % 2 ? 0.5 : -0.5];
}

// Hand-picked weights for the vanilla RNN (illustrative, not trained).
const W_H: Mat = [
  [0.5, -0.3, 0.2, 0.1],
  [0.2, 0.4, -0.3, 0.2],
  [-0.1, 0.3, 0.5, -0.2],
  [0.3, -0.2, 0.1, 0.4],
];
const W_X: Mat = [
  [0.9, -0.4, 0.3],
  [-0.5, 0.8, 0.2],
  [0.4, 0.6, -0.7],
  [-0.3, -0.2, 0.9],
];
const B: Vec = [0.1, -0.1, 0, 0.05];

const matVec = (m: Mat, v: Vec) => m.map((row) => row.reduce((s, w, j) => s + w * v[j], 0));
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

interface RnnStep {
  x: Vec;
  whh: Vec;
  wxx: Vec;
  a: Vec;
  h: Vec;
}

function runRnn(chars: string[]): RnnStep[] {
  let h: Vec = Array(H).fill(0);
  return chars.map((ch) => {
    const x = encodeChar(ch);
    const whh = matVec(W_H, h);
    const wxx = matVec(W_X, x);
    const a = whh.map((v, i) => v + wxx[i] + B[i]);
    h = a.map(Math.tanh);
    return { x, whh, wxx, a, h };
  });
}

// Seeded PRNG so the LSTM weights are identical on server and client.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededMatrix(rows: number, cols: number, seed: number, scale: number): Mat {
  const rand = mulberry32(seed);
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (rand() * 2 - 1) * scale));
}

// LSTM gates act on the concatenation [h_{t-1}, x_t] (size H + D).
const LSTM = {
  f: { w: seededMatrix(H, H + D, 11, 0.8), b: Array(H).fill(1) }, // forget bias 1, a common default
  i: { w: seededMatrix(H, H + D, 23, 0.8), b: Array(H).fill(0) },
  g: { w: seededMatrix(H, H + D, 37, 0.8), b: Array(H).fill(0) },
  o: { w: seededMatrix(H, H + D, 41, 0.8), b: Array(H).fill(0) },
};

interface LstmStep {
  f: Vec;
  i: Vec;
  g: Vec;
  o: Vec;
  c: Vec;
  cPrev: Vec;
  h: Vec;
}

function runLstm(chars: string[]): LstmStep[] {
  let h: Vec = Array(H).fill(0);
  let c: Vec = Array(H).fill(0);
  return chars.map((ch) => {
    const z = [...h, ...encodeChar(ch)];
    const gate = (p: { w: Mat; b: Vec }, act: (x: number) => number) => matVec(p.w, z).map((v, k) => act(v + p.b[k]));
    const f = gate(LSTM.f, sigmoid);
    const i = gate(LSTM.i, sigmoid);
    const g = gate(LSTM.g, Math.tanh);
    const o = gate(LSTM.o, sigmoid);
    const cPrev = c;
    c = c.map((cv, k) => f[k] * cv + i[k] * g[k]);
    h = c.map((cv, k) => o[k] * Math.tanh(cv));
    return { f, i, g, o, c, cPrev, h };
  });
}

/* ------------------------------------------------------------------ */
/* Colours                                                             */
/* ------------------------------------------------------------------ */

/** −1 → blue, 0 → white, +1 → orange. */
function diverging(v: number) {
  const t = Math.max(-1, Math.min(1, v));
  if (t >= 0) return `rgb(255,${Math.round(255 - t * 115)},${Math.round(255 - t * 255)})`;
  const u = -t;
  return `rgb(${Math.round(255 - u * 196)},${Math.round(255 - u * 125)},${Math.round(255 - u * 9)})`;
}

/** 0 → white, 1 → green (for gate values). */
function sequential(v: number) {
  const t = Math.max(0, Math.min(1, v));
  return `rgb(${Math.round(255 - t * 239)},${Math.round(255 - t * 70)},${Math.round(255 - t * 126)})`;
}

const fmt = (v: number) => (v >= 0 ? ' ' : '') + v.toFixed(2);

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Panel({ title, subtitle, children }: { title: string; subtitle?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-card border border-line bg-white p-4 shadow-card sm:p-5">
      <h3 className="font-semibold text-ink">{title}</h3>
      {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

/** A vector drawn as a row of coloured cells inside an SVG. */
function SvgVector({ x, y, values, cell = 22, color = diverging, show = true }: { x: number; y: number; values: Vec; cell?: number; color?: (v: number) => string; show?: boolean }) {
  return (
    <g>
      {values.map((v, k) => (
        <rect key={k} x={x + k * cell} y={y} width={cell} height={cell} fill={show ? color(v) : '#f8fafc'} stroke="#9ca3af" strokeWidth={1} />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Unrolled RNN diagram                                                */
/* ------------------------------------------------------------------ */

function UnrolledRnn({ chars, steps, current }: { chars: string[]; steps: RnnStep[]; current: number }) {
  const col = 120;
  const left = 90;
  const width = left + Math.max(chars.length, 1) * col + 10;
  const height = 290;
  const boxY = 120;
  const boxH = 50;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={responsiveSurface} role="img" aria-label="RNN unrolled through time">
      <defs>
        <marker id="rnn-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
        </marker>
      </defs>
      {/* h0 */}
      <text x={10} y={boxY - 20} fontSize={14} fill="#4b5563">
        h₀ = 0
      </text>
      <SvgVector x={10} y={boxY + 14} values={Array(H).fill(0)} cell={16} />
      {chars.map((ch, t) => {
        const cx = left + t * col + col / 2;
        const active = t < current;
        const isCurrent = t === current - 1;
        const s = steps[t];
        return (
          <g key={t} opacity={active ? 1 : 0.35}>
            {/* recurrent arrow from previous step */}
            <line
              x1={t === 0 ? 76 : cx - col + 45}
              y1={boxY + boxH / 2}
              x2={cx - 45}
              y2={boxY + boxH / 2}
              stroke="#6b7280"
              strokeWidth={2}
              markerEnd="url(#rnn-arrow)"
            />
            {/* cell */}
            <rect
              x={cx - 44}
              y={boxY}
              width={88}
              height={boxH}
              rx={10}
              fill={isCurrent ? '#eef2ff' : '#ffffff'}
              stroke={isCurrent ? '#4f46e5' : '#9ca3af'}
              strokeWidth={isCurrent ? 3 : 1.5}
            />
            <text x={cx} y={boxY + 30} textAnchor="middle" fontSize={14} fill="#0b1020">
              tanh
            </text>
            {/* hidden state */}
            <line x1={cx} y1={boxY} x2={cx} y2={78} stroke="#6b7280" strokeWidth={2} markerEnd="url(#rnn-arrow)" />
            <SvgVector x={cx - 44} y={50} values={s.h} show={active} />
            <text x={cx} y={36} textAnchor="middle" fontSize={14} fill="#0b1020">
              h{subscript(t + 1)}
            </text>
            {/* input */}
            <line x1={cx} y1={208} x2={cx} y2={boxY + boxH + 2} stroke="#6b7280" strokeWidth={2} markerEnd="url(#rnn-arrow)" />
            <SvgVector x={cx - 33} y={210} values={s.x} />
            <text x={cx} y={262} textAnchor="middle" fontSize={18} fontWeight={600} fill="#0b1020" fontFamily="monospace">
              {ch}
            </text>
            <text x={cx} y={282} textAnchor="middle" fontSize={12} fill="#4b5563">
              x{subscript(t + 1)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function subscript(n: number) {
  const digits = '₀₁₂₃₄₅₆₇₈₉';
  return String(n)
    .split('')
    .map((d) => digits[Number(d)])
    .join('');
}

/* ------------------------------------------------------------------ */
/* Gradient demo                                                       */
/* ------------------------------------------------------------------ */

const LOG_MIN = -12;
const LOG_MAX = 12;

function gradientCurves(w: number, f: number, T: number) {
  const linear: number[] = [0];
  const tanhRnn: number[] = [0];
  const lstm: number[] = [0];
  let h = 0;
  let logTanh = 0;
  for (let k = 1; k <= T; k++) {
    linear.push(k * Math.log10(Math.abs(w) || 1e-12));
    // scalar tanh RNN with a small fixed input; dh_k/dh_{k-1} = w · (1 − h_k²)
    h = Math.tanh(w * h + 0.4 * Math.sin(k));
    logTanh += Math.log10(Math.max(1e-300, Math.abs(w * (1 - h * h))));
    tanhRnn.push(logTanh);
    lstm.push(k * Math.log10(f));
  }
  return { linear, tanhRnn, lstm };
}

function GradientPlot({ w, f, T }: { w: number; f: number; T: number }) {
  const { linear, tanhRnn, lstm } = gradientCurves(w, f, T);
  const Wd = 640;
  const Hd = 300;
  const pad = { l: 56, r: 16, t: 14, b: 40 };
  const px = (k: number) => pad.l + (k / T) * (Wd - pad.l - pad.r);
  const py = (lg: number) => {
    const c = Math.max(LOG_MIN, Math.min(LOG_MAX, lg));
    return pad.t + ((LOG_MAX - c) / (LOG_MAX - LOG_MIN)) * (Hd - pad.t - pad.b);
  };
  const path = (arr: number[]) => arr.map((v, k) => `${k === 0 ? 'M' : 'L'} ${px(k).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
  const ticks = [-12, -8, -4, 0, 4, 8, 12];
  const xticks = Array.from(new Set([0, Math.round(T / 4), Math.round(T / 2), Math.round((3 * T) / 4), T]));
  return (
    <svg viewBox={`0 0 ${Wd} ${Hd}`} className={responsiveSurface} role="img" aria-label="Gradient norm versus number of time steps, log scale">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={Wd - pad.r} y1={py(t)} y2={py(t)} stroke={t === 0 ? '#9ca3af' : '#e5e7eb'} />
          <text x={pad.l - 6} y={py(t) + 4} textAnchor="end" fontSize={12} fill="#4b5563">
            {t === 0 ? '1' : `1e${t}`}
          </text>
        </g>
      ))}
      {xticks.map((k) => (
        <text key={k} x={px(k)} y={Hd - pad.b + 18} textAnchor="middle" fontSize={12} fill="#4b5563">
          {k}
        </text>
      ))}
      <text x={(pad.l + Wd - pad.r) / 2} y={Hd - 4} textAnchor="middle" fontSize={12} fill="#4b5563">
        steps back in time k
      </text>
      <path d={path(linear)} fill="none" stroke="#ef4444" strokeWidth={2.5} />
      <path d={path(tanhRnn)} fill="none" stroke="#4f46e5" strokeWidth={2.5} />
      <path d={path(lstm)} fill="none" stroke="#10b981" strokeWidth={2.5} strokeDasharray="6 4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* LSTM cell diagram                                                   */
/* ------------------------------------------------------------------ */

function LstmCell({ s, show }: { s: LstmStep; show: boolean }) {
  // Gate boxes sit on a row; each gate's output vector is drawn just above its box.
  const gates: { key: 'f' | 'i' | 'g' | 'o'; label: string; x: number; color: (v: number) => string }[] = [
    { key: 'f', label: 'forget  σ', x: 30, color: sequential },
    { key: 'i', label: 'input  σ', x: 150, color: sequential },
    { key: 'g', label: 'candidate  tanh', x: 270, color: diverging },
    { key: 'o', label: 'output  σ', x: 390, color: sequential },
  ];
  const cy = 50; // cell-state line
  const line = { stroke: '#6b7280', strokeWidth: 2, fill: 'none' } as const;
  const op = (x: number, y: number, sym: string, r = 12) => (
    <g>
      <circle cx={x} cy={y} r={r} fill="#fff" stroke="#6b7280" strokeWidth={2} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={15} fill="#0b1020">
        {sym}
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 630 340" className={responsiveSurface} role="img" aria-label="LSTM cell with forget, input and output gates">
      <defs>
        <marker id="lstm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
        </marker>
      </defs>
      <rect x={20} y={20} width={530} height={250} rx={14} fill="#f8fafc" stroke="#d1d5db" />

      {/* cell-state highway: c(t-1) -> x f -> + i*g -> c(t) */}
      <text x={24} y={cy - 14} fontSize={12} fill="#4b5563">
        c(t−1)
      </text>
      <SvgVector x={24} y={cy - 7} values={s.cPrev} cell={14} show={show} />
      <line x1={82} y1={cy} x2={133} y2={cy} {...line} />
      {op(145, cy, '×')}
      <line x1={157} y1={cy} x2={298} y2={cy} {...line} />
      {op(310, cy, '+')}
      <line x1={322} y1={cy} x2={552} y2={cy} {...line} markerEnd="url(#lstm-arrow)" />
      <text x={558} y={cy - 14} fontSize={12} fill="#4b5563">
        c(t)
      </text>
      <SvgVector x={558} y={cy - 7} values={s.c} cell={14} show={show} />

      {/* gates and their output vectors */}
      {gates.map((gt) => (
        <g key={gt.key}>
          <line x1={gt.x + 55} y1={290} x2={gt.x + 55} y2={208} stroke="#9ca3af" strokeWidth={1.5} markerEnd="url(#lstm-arrow)" />
          <rect x={gt.x} y={170} width={110} height={36} rx={8} fill="#fff" stroke="#4f46e5" strokeWidth={1.5} />
          <text x={gt.x + 55} y={193} textAnchor="middle" fontSize={13} fill="#0b1020">
            {gt.label}
          </text>
          <SvgVector x={gt.x + 11} y={140} values={s[gt.key]} cell={22} color={gt.color} show={show} />
        </g>
      ))}

      {/* f multiplies the old cell state */}
      <path d="M 85 140 L 85 110 L 145 110 L 145 64" {...line} markerEnd="url(#lstm-arrow)" />
      {/* i * g is added to it */}
      <path d="M 205 140 L 205 110 L 253 110" {...line} />
      <path d="M 325 140 L 325 110 L 277 110" {...line} />
      {op(265, 110, '×', 11)}
      <path d="M 265 99 L 265 84 L 310 84 L 310 64" {...line} markerEnd="url(#lstm-arrow)" />

      {/* h(t) = o * tanh(c(t)) */}
      <path d="M 520 50 L 520 76" {...line} markerEnd="url(#lstm-arrow)" />
      <rect x={496} y={78} width={48} height={22} rx={6} fill="#fff" stroke="#6b7280" />
      <text x={520} y={94} textAnchor="middle" fontSize={12} fill="#0b1020">
        tanh
      </text>
      <line x1={520} y1={100} x2={520} y2={113} {...line} />
      {op(520, 125, '×', 11)}
      <path d="M 445 140 L 445 125 L 509 125" {...line} />
      <line x1={531} y1={125} x2={552} y2={125} {...line} markerEnd="url(#lstm-arrow)" />
      <text x={558} y={112} fontSize={12} fill="#4b5563">
        h(t)
      </text>
      <SvgVector x={558} y={118} values={s.h} cell={14} show={show} />

      {/* input bus */}
      <line x1={60} y1={290} x2={470} y2={290} stroke="#9ca3af" strokeWidth={2} />
      <text x={265} y={312} textAnchor="middle" fontSize={13} fill="#0b1020">
        [h(t−1), x(t)] feeds every gate
      </text>
      <text x={265} y={332} textAnchor="middle" fontSize={11} fill="#4b5563">
        gate colours: white = 0 (closed), green = 1 (open)
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

function VectorRow({ label, values, color = diverging }: { label: string; values: Vec; color?: (v: number) => string }) {
  return (
    <tr>
      <th scope="row" className="whitespace-nowrap px-2 py-1 text-left font-medium text-ink">
        {label}
      </th>
      {values.map((v, k) => (
        <td key={k} className="px-1 py-1">
          <span className="block rounded px-1.5 py-0.5 text-center font-mono text-xs text-ink ring-1 ring-inset ring-line" style={{ backgroundColor: color(v) }}>
            {fmt(v)}
          </span>
        </td>
      ))}
    </tr>
  );
}

export default function RnnVisualizer() {
  const [word, setWord] = useState('hello');
  const [step, setStep] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [w, setW] = useState(0.9);
  const [forget, setForget] = useState(0.97);
  const [T, setT] = useState(30);

  const chars = word.split('');
  const n = chars.length;
  const current = Math.min(step, n); // number of steps computed so far
  const steps = runRnn(chars);
  const lstm = runLstm(chars);

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => {
      if (current >= n) setPlaying(false);
      else setStep(current + 1);
    }, 700);
    return () => clearTimeout(id);
  }, [playing, current, n]);

  const s = current > 0 ? steps[current - 1] : null;
  const hPrev = current > 1 ? steps[current - 2].h : Array(H).fill(0);
  const ls = current > 0 ? lstm[current - 1] : null;

  const curves = gradientCurves(w, forget, T);
  const atT = (arr: number[]) => {
    const v = arr[arr.length - 1];
    return v > 12 ? '> 1e12' : v < -12 ? '< 1e-12' : Math.pow(10, v).toExponential(1);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full sm:w-56">
            <label htmlFor="rnn-word" className="mb-1.5 block text-sm font-medium text-ink">
              Input sequence (letters a–z, up to {MAX_LEN})
            </label>
            <Input
              id="rnn-word"
              value={word}
              onChange={(e) => {
                setWord(e.target.value.toLowerCase().replace(/[^a-z]/g, '').slice(0, MAX_LEN));
                setPlaying(false);
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              disabled={n === 0}
              leftIcon={playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              onClick={() => {
                if (!playing && current >= n) setStep(0);
                setPlaying(!playing);
              }}
            >
              {playing ? 'Pause' : 'Play'}
            </Button>
            <Button size="sm" variant="outline" leftIcon={<StepBack className="h-4 w-4" />} disabled={current === 0} onClick={() => { setPlaying(false); setStep(current - 1); }}>
              Back
            </Button>
            <Button size="sm" variant="outline" leftIcon={<StepForward className="h-4 w-4" />} disabled={current >= n} onClick={() => { setPlaying(false); setStep(current + 1); }}>
              Step
            </Button>
            <Button size="sm" variant="ghost" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => { setPlaying(false); setStep(0); }}>
              Reset
            </Button>
          </div>
          <p className="text-sm text-ink-muted">
            Time step <span className="font-mono text-ink">t = {current}</span> of {n}
          </p>
        </div>
      </div>

      <Panel
        title="Unrolled through time"
        subtitle="The same cell (same weights) is applied at every step. Each hidden state is 4 numbers: orange positive, blue negative."
      >
        {n === 0 ? (
          <p className="rounded-lg bg-subtle p-4 text-sm text-ink-muted">Type a word to build the sequence.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[480px]">
              <UnrolledRnn chars={chars} steps={steps} current={current} />
            </div>
          </div>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Vanilla RNN step" subtitle={<span className="font-mono">h(t) = tanh(W_h · h(t−1) + W_x · x(t) + b)</span>}>
          {s ? (
            <div className="overflow-x-auto">
              <table className="text-sm">
                <tbody>
                  <VectorRow label="h(t−1)" values={hPrev} />
                  <VectorRow label="W_h · h(t−1)" values={s.whh} />
                  <VectorRow label={`W_x · x(t)  ['${chars[current - 1]}']`} values={s.wxx} />
                  <VectorRow label="b" values={B} />
                  <VectorRow label="sum a(t)" values={s.a} />
                  <VectorRow label="h(t) = tanh(a)" values={s.h} />
                </tbody>
              </table>
              <p className="mt-3 text-xs text-ink-muted">
                x(t) for &apos;{chars[current - 1]}&apos; = [{s.x.map((v) => v.toFixed(2)).join(', ')}]. Weights are hand-picked for
                illustration, not trained.
              </p>
            </div>
          ) : (
            <p className="rounded-lg bg-subtle p-4 text-sm text-ink-muted">Press Step to process the first character.</p>
          )}
        </Panel>

        <Panel title="LSTM cell at the same step" subtitle="Same input sequence, separate seeded weights. Gates decide what to forget, write and output.">
          <LstmCell
            s={ls ?? { f: Array(H).fill(0), i: Array(H).fill(0), g: Array(H).fill(0), o: Array(H).fill(0), c: Array(H).fill(0), cPrev: Array(H).fill(0), h: Array(H).fill(0) }}
            show={ls !== null}
          />
          {ls && (
            <div className="mt-3 overflow-x-auto">
              <table className="text-sm">
                <tbody>
                  <VectorRow label="f forget" values={ls.f} color={sequential} />
                  <VectorRow label="i input" values={ls.i} color={sequential} />
                  <VectorRow label="g candidate" values={ls.g} />
                  <VectorRow label="o output" values={ls.o} color={sequential} />
                  <VectorRow label="c(t)" values={ls.c} />
                  <VectorRow label="h(t)" values={ls.h} />
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <Panel
        title="Vanishing and exploding gradients"
        subtitle="How much a loss at step T still depends on a hidden state k steps earlier. Each step back multiplies the gradient by the same kind of factor (log scale)."
      >
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <label className="block min-w-[200px] flex-1 text-sm text-ink">
            Recurrent weight w = <span className="font-mono">{w.toFixed(2)}</span>
            <input type="range" min={0.1} max={2} step={0.05} value={w} onChange={(e) => setW(Number(e.target.value))} className="mt-1 block w-full accent-brand-600" />
          </label>
          <label className="block min-w-[200px] flex-1 text-sm text-ink">
            LSTM forget gate f = <span className="font-mono">{forget.toFixed(2)}</span>
            <input type="range" min={0.5} max={1} step={0.01} value={forget} onChange={(e) => setForget(Number(e.target.value))} className="mt-1 block w-full accent-brand-600" />
          </label>
          <label className="block min-w-[200px] flex-1 text-sm text-ink">
            Sequence length T = <span className="font-mono">{T}</span>
            <input type="range" min={5} max={60} step={1} value={T} onChange={(e) => setT(Number(e.target.value))} className="mt-1 block w-full accent-brand-600" />
          </label>
        </div>
        <div className="mt-4">
          <GradientPlot w={w} f={forget} T={T} />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-lg bg-subtle p-3 ring-1 ring-inset ring-line">
            <span className="mr-2 inline-block h-0.5 w-5 bg-red-500 align-middle" />
            <span className="text-ink">Linear RNN |w|<sup>k</sup></span>
            <p className="mt-1 font-mono text-ink-muted">at T: {atT(curves.linear)}</p>
          </div>
          <div className="rounded-lg bg-subtle p-3 ring-1 ring-inset ring-line">
            <span className="mr-2 inline-block h-0.5 w-5 bg-brand-600 align-middle" />
            <span className="text-ink">tanh RNN ∏ w·(1 − h²)</span>
            <p className="mt-1 font-mono text-ink-muted">at T: {atT(curves.tanhRnn)}</p>
          </div>
          <div className="rounded-lg bg-subtle p-3 ring-1 ring-inset ring-line">
            <span className="mr-2 inline-block h-0.5 w-5 border-t-2 border-dashed border-emerald-500 align-middle" />
            <span className="text-ink">LSTM cell path f<sup>k</sup></span>
            <p className="mt-1 font-mono text-ink-muted">at T: {atT(curves.lstm)}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          A one-unit model keeps the maths visible: with a matrix W_h the role of |w| is played by its largest singular value. The tanh curve uses a
          small fixed input sequence; because tanh′ ≤ 1 it can only shrink the gradient further, so it vanishes even for some w above 1.
        </p>
      </Panel>
    </div>
  );
}
