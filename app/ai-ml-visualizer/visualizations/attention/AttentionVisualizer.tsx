'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';

/* ------------------------------------------------------------------ */
/* Toy model: deterministic embeddings and projection weights          */
/* ------------------------------------------------------------------ */

const D_MODEL = 8;
const MAX_TOKENS = 8;

type Vec = number[];
type Mat = number[][];

/** FNV-1a string hash, used to seed each word's embedding. */
function hash(text: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

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

function seededMatrix(rows: number, cols: number, seed: number, scale = 1): Mat {
  const rand = mulberry32(seed);
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (rand() * 2 - 1) * scale));
}

function embed(token: string): Vec {
  return seededMatrix(1, D_MODEL, hash(token.toLowerCase()))[0];
}

/** Sinusoidal positional encoding from "Attention Is All You Need". */
function positionalEncoding(pos: number, i: number, d = D_MODEL) {
  const pair = Math.floor(i / 2);
  const angle = pos / Math.pow(10000, (2 * pair) / d);
  return i % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
}

const matMul = (a: Mat, b: Mat): Mat => a.map((row) => b[0].map((_, j) => row.reduce((s, v, k) => s + v * b[k][j], 0)));
const transpose = (m: Mat): Mat => (m.length ? m[0].map((_, j) => m.map((row) => row[j])) : []);

function softmaxRow(row: Vec): Vec {
  const finite = row.filter((v) => Number.isFinite(v));
  const max = Math.max(...finite);
  const exps = row.map((v) => (Number.isFinite(v) ? Math.exp(v - max) : 0));
  const sum = exps.reduce((s, v) => s + v, 0);
  return exps.map((v) => v / sum);
}

interface HeadResult {
  Q: Mat;
  K: Mat;
  V: Mat;
  scores: Mat; // after scaling and masking
  weights: Mat;
  output: Mat;
  dk: number;
}

function attentionHead(X: Mat, heads: number, head: number, causal: boolean): HeadResult {
  const dk = D_MODEL / heads;
  const seed = 1000 * heads + 10 * head;
  const WQ = seededMatrix(D_MODEL, dk, seed + 1, 0.8);
  const WK = seededMatrix(D_MODEL, dk, seed + 2, 0.8);
  const WV = seededMatrix(D_MODEL, dk, seed + 3, 0.8);
  const Q = matMul(X, WQ);
  const K = matMul(X, WK);
  const V = matMul(X, WV);
  const raw = matMul(Q, transpose(K));
  const scale = Math.sqrt(dk);
  const scores = raw.map((row, i) => row.map((v, j) => (causal && j > i ? -Infinity : v / scale)));
  const weights = scores.map(softmaxRow);
  const output = matMul(weights, V);
  return { Q, K, V, scores, weights, output, dk };
}

/* ------------------------------------------------------------------ */
/* Colours and formatting                                              */
/* ------------------------------------------------------------------ */

function diverging(v: number, maxAbs = 2) {
  const t = Math.max(-1, Math.min(1, v / maxAbs));
  if (t >= 0) return `rgb(255,${Math.round(255 - t * 115)},${Math.round(255 - t * 255)})`;
  const u = -t;
  return `rgb(${Math.round(255 - u * 196)},${Math.round(255 - u * 125)},${Math.round(255 - u * 9)})`;
}

/** 0 → white, 1 → indigo. */
function weightColor(w: number) {
  const t = Math.max(0, Math.min(1, w));
  return `rgb(${Math.round(255 - t * 176)},${Math.round(255 - t * 185)},${Math.round(255 - t * 26)})`;
}

const fmt = (v: number) => (Number.isFinite(v) ? v.toFixed(2) : '−∞');

const HEAD_COLORS = ['#4f46e5', '#059669', '#d97706', '#db2777'];

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Panel({ title, subtitle, children }: { title: React.ReactNode; subtitle?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-card border border-line bg-white p-4 shadow-card sm:p-5">
      <h3 className="font-semibold text-ink">{title}</h3>
      {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function MatrixTable({
  title,
  rows,
  rowLabels,
  colLabels,
  color,
  selectedRow,
}: {
  title: string;
  rows: Mat;
  rowLabels: string[];
  colLabels?: string[];
  color: (v: number) => string;
  selectedRow?: number;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 font-mono text-sm font-semibold text-ink">{title}</p>
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-0.5 font-mono text-xs">
          {colLabels && (
            <thead>
              <tr>
                <th />
                {colLabels.map((c, j) => (
                  <th key={j} className="px-1 pb-1 text-center font-normal text-ink-muted">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <th scope="row" className={`whitespace-nowrap pr-2 text-right font-normal ${i === selectedRow ? 'font-semibold text-brand-700' : 'text-ink-muted'}`}>
                  {rowLabels[i]}
                </th>
                {row.map((v, j) => (
                  <td
                    key={j}
                    className={`min-w-[44px] rounded px-1.5 py-1 text-center text-ink ${i === selectedRow ? 'ring-2 ring-inset ring-brand-500' : ''}`}
                    style={{ backgroundColor: Number.isFinite(v) ? color(v) : '#f1f5f9' }}
                  >
                    {fmt(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Heatmap({
  weights,
  tokens,
  selected,
  onSelect,
  compact = false,
  color = weightColor,
}: {
  weights: Mat;
  tokens: string[];
  selected: number;
  onSelect?: (i: number) => void;
  compact?: boolean;
  color?: (v: number) => string;
}) {
  const n = tokens.length;
  const cell = 50;
  const label = compact ? 0 : 70;
  const size = label + n * cell;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={responsiveSurface} role="img" aria-label="Attention weights heatmap; rows are queries, columns are keys">
      {!compact &&
        tokens.map((t, j) => (
          <text key={`c${j}`} x={label + j * cell + cell / 2} y={label - 10} textAnchor="middle" fontSize={13} fill="#4b5563" transform={`rotate(-35 ${label + j * cell + cell / 2} ${label - 10})`}>
            {t.length > 7 ? `${t.slice(0, 6)}.` : t}
          </text>
        ))}
      {weights.map((row, i) => (
        <g key={i} onClick={() => onSelect?.(i)} className={onSelect ? 'cursor-pointer' : undefined}>
          {!compact && (
            <text x={label - 8} y={label + i * cell + cell / 2 + 5} textAnchor="end" fontSize={13} fontWeight={i === selected ? 700 : 400} fill={i === selected ? '#4338ca' : '#4b5563'}>
              {tokens[i].length > 7 ? `${tokens[i].slice(0, 6)}.` : tokens[i]}
            </text>
          )}
          {row.map((w, j) => (
            <g key={j}>
              <rect x={label + j * cell} y={label + i * cell} width={cell} height={cell} fill={color(w)} stroke="#ffffff" strokeWidth={2} />
              {!compact && (
                <text x={label + j * cell + cell / 2} y={label + i * cell + cell / 2 + 5} textAnchor="middle" fontSize={12} fill={w > 0.55 ? '#ffffff' : '#0b1020'}>
                  {w < 0.005 ? '0' : w.toFixed(2)}
                </text>
              )}
            </g>
          ))}
          {i === selected && (
            <rect x={label + 1.5} y={label + i * cell + 1.5} width={n * cell - 3} height={cell - 3} fill="none" stroke="#4338ca" strokeWidth={3} />
          )}
        </g>
      ))}
    </svg>
  );
}

/** Lines from the selected query token to every key token, thickness ∝ attention weight. */
function AttentionLines({ tokens, weights, selected, color }: { tokens: string[]; weights: Vec; selected: number; color: string }) {
  const n = tokens.length;
  const width = 640;
  const step = width / n;
  const x = (i: number) => step * i + step / 2;
  return (
    <svg viewBox={`0 0 ${width} 200`} className={responsiveSurface} role="img" aria-label="Attention from the selected token to every token">
      <text x={4} y={20} fontSize={12} fill="#4b5563">
        query
      </text>
      <text x={4} y={192} fontSize={12} fill="#4b5563">
        keys
      </text>
      {weights.map((w, j) => (
        <line key={j} x1={x(selected)} y1={44} x2={x(j)} y2={150} stroke={color} strokeWidth={1 + w * 14} strokeOpacity={0.15 + w * 0.85} strokeLinecap="round" />
      ))}
      {tokens.map((t, i) => (
        <g key={i}>
          {i === selected && (
            <>
              <rect x={x(i) - 36} y={18} width={72} height={26} rx={6} fill="#eef2ff" stroke={color} strokeWidth={2} />
              <text x={x(i)} y={36} textAnchor="middle" fontSize={14} fontWeight={600} fill="#0b1020">
                {t.length > 8 ? `${t.slice(0, 7)}.` : t}
              </text>
            </>
          )}
          <rect x={x(i) - 36} y={150} width={72} height={26} rx={6} fill="#ffffff" stroke="#d1d5db" />
          <text x={x(i)} y={168} textAnchor="middle" fontSize={14} fill="#0b1020">
            {t.length > 8 ? `${t.slice(0, 7)}.` : t}
          </text>
          <text x={x(i)} y={195} textAnchor="middle" fontSize={11} fill="#4b5563" fontFamily="monospace">
            {weights[i].toFixed(2)}
          </text>
        </g>
      ))}
    </svg>
  );
}

function TransformerBlock() {
  const box = (y: number, label: string, fill: string, stroke: string) => (
    <g>
      <rect x={70} y={y} width={180} height={40} rx={10} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <text x={160} y={y + 25} textAnchor="middle" fontSize={14} fill="#0b1020">
        {label}
      </text>
    </g>
  );
  const arrow = (y1: number, y2: number) => <line x1={160} y1={y1} x2={160} y2={y2} stroke="#6b7280" strokeWidth={2} markerEnd="url(#tb-arrow)" />;
  return (
    <svg viewBox="0 0 320 470" className={`${responsiveSurface} mx-auto max-w-[340px]`} role="img" aria-label="Transformer block diagram">
      <defs>
        <marker id="tb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
        </marker>
      </defs>
      <text x={160} y={458} textAnchor="middle" fontSize={13} fill="#4b5563">
        token embeddings + positional encoding
      </text>
      {arrow(440, 402)}
      {box(360, 'Multi-head attention', '#eef2ff', '#4f46e5')}
      {arrow(360, 322)}
      {box(280, 'Add & Norm', '#f8fafc', '#9ca3af')}
      {arrow(280, 242)}
      {box(200, 'Feed-forward (per token)', '#ecfdf5', '#059669')}
      {arrow(200, 162)}
      {box(120, 'Add & Norm', '#f8fafc', '#9ca3af')}
      {arrow(120, 62)}
      <text x={160} y={50} textAnchor="middle" fontSize={13} fill="#4b5563">
        output (same shape: n × d_model)
      </text>
      {/* residual connections */}
      <path d="M 160 425 L 285 425 L 285 300 L 252 300" fill="none" stroke="#d97706" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#tb-arrow)" />
      <path d="M 160 262 L 285 262 L 285 140 L 252 140" fill="none" stroke="#d97706" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#tb-arrow)" />
      <text x={292} y={365} fontSize={11} fill="#b45309" transform="rotate(90 292 365)">
        residual
      </text>
      <text x={292} y={200} fontSize={11} fill="#b45309" transform="rotate(90 292 200)">
        residual
      </text>
      <text x={20} y={300} fontSize={11} fill="#4b5563" transform="rotate(-90 20 300)">
        repeated N times
      </text>
      <rect x={52} y={105} width={250} height={315} rx={14} fill="none" stroke="#d1d5db" strokeDasharray="4 4" />
    </svg>
  );
}

function PositionalEncodingPlot({ n }: { n: number }) {
  const maxPos = Math.max(10, n);
  const W = 640;
  const Hh = 220;
  const pad = { l: 36, r: 12, t: 12, b: 30 };
  const px = (p: number) => pad.l + (p / maxPos) * (W - pad.l - pad.r);
  const py = (v: number) => pad.t + ((1 - v) / 2) * (Hh - pad.t - pad.b);
  const dims = [
    { i: 0, color: '#4f46e5', label: 'dim 0 (sin, fast)' },
    { i: 1, color: '#a5b4fc', label: 'dim 1 (cos, fast)' },
    { i: 2, color: '#059669', label: 'dim 2 (sin, slower)' },
    { i: 3, color: '#6ee7b7', label: 'dim 3 (cos, slower)' },
  ];
  const curve = (i: number) => {
    const pts: string[] = [];
    for (let s = 0; s <= 200; s++) {
      const p = (s / 200) * maxPos;
      pts.push(`${s === 0 ? 'M' : 'L'} ${px(p).toFixed(1)} ${py(positionalEncoding(p, i)).toFixed(1)}`);
    }
    return pts.join(' ');
  };
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${Hh}`} className={responsiveSurface} role="img" aria-label="Positional encoding sinusoids">
        {[-1, 0, 1].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={py(v)} y2={py(v)} stroke={v === 0 ? '#9ca3af' : '#e5e7eb'} />
            <text x={pad.l - 6} y={py(v) + 4} textAnchor="end" fontSize={12} fill="#4b5563">
              {v}
            </text>
          </g>
        ))}
        {Array.from({ length: maxPos + 1 }).map((_, p) => (
          <text key={p} x={px(p)} y={Hh - 10} textAnchor="middle" fontSize={11} fill="#4b5563">
            {p}
          </text>
        ))}
        {Array.from({ length: n }).map((_, p) => (
          <line key={p} x1={px(p)} x2={px(p)} y1={pad.t} y2={Hh - pad.b} stroke="#eef2ff" strokeWidth={6} />
        ))}
        {dims.map((d) => (
          <path key={d.i} d={curve(d.i)} fill="none" stroke={d.color} strokeWidth={2.5} />
        ))}
        {dims.map((d) =>
          Array.from({ length: n }).map((_, p) => <circle key={`${d.i}-${p}`} cx={px(p)} cy={py(positionalEncoding(p, d.i))} r={4} fill={d.color} stroke="#fff" strokeWidth={1.5} />),
        )}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
        {dims.map((d) => (
          <span key={d.i} className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4" style={{ backgroundColor: d.color }} />
            {d.label}
          </span>
        ))}
        <span>Shaded columns: positions used by your sentence. Dims 4–7 change even more slowly.</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-brand-600" />
      {label}
    </label>
  );
}

export default function AttentionVisualizer() {
  const [sentence, setSentence] = useState('the cat sat on the mat');
  const [selected, setSelected] = useState(1);
  const [causal, setCausal] = useState(false);
  const [usePE, setUsePE] = useState(true);
  const [heads, setHeads] = useState(1);
  const [head, setHead] = useState(0);

  const tokens = sentence.trim().split(/\s+/).filter(Boolean).slice(0, MAX_TOKENS);
  const n = tokens.length;
  const sel = Math.min(selected, Math.max(n - 1, 0));
  const activeHead = Math.min(head, heads - 1);

  const X: Mat = tokens.map((t, pos) => embed(t).map((v, i) => v + (usePE ? positionalEncoding(pos, i) : 0)));
  const results = n > 0 ? Array.from({ length: heads }, (_, h) => attentionHead(X, heads, h, causal)) : [];
  const r = results[activeHead];
  const tooMany = sentence.trim().split(/\s+/).filter(Boolean).length > MAX_TOKENS;

  const dimLabels = (d: number) => Array.from({ length: d }, (_, j) => `${j}`);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-5">
        <label htmlFor="attn-sentence" className="mb-1.5 block text-sm font-medium text-ink">
          Sentence (split on spaces, up to {MAX_TOKENS} tokens)
        </label>
        <Input id="attn-sentence" value={sentence} onChange={(e) => setSentence(e.target.value.slice(0, 80))} />
        {tooMany && <p className="mt-1 text-xs text-amber-700">Only the first {MAX_TOKENS} tokens are used.</p>}

        <div className="mt-4">
          <p className="mb-1.5 text-sm font-medium text-ink">Query token (click to inspect)</p>
          <div className="flex flex-wrap gap-2">
            {tokens.map((t, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`rounded-lg px-3 py-1.5 font-mono text-sm ring-1 ring-inset transition-colors ${
                  i === sel ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-ink ring-line-strong hover:bg-subtle'
                }`}
              >
                {t}
                <span className={`ml-1.5 text-xs ${i === sel ? 'text-brand-100' : 'text-ink-faint'}`}>{i}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Toggle checked={causal} onChange={setCausal} label="Causal mask (decoder)" />
          <Toggle checked={usePE} onChange={setUsePE} label="Add positional encoding" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink">Heads</span>
            {[1, 2, 4].map((h) => (
              <Button
                key={h}
                size="sm"
                variant={heads === h ? 'primary' : 'outline'}
                onClick={() => {
                  setHeads(h);
                  setHead(0);
                }}
              >
                {h}
              </Button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          d_model = {D_MODEL}, d_k = d_model / heads = {D_MODEL / heads}. Embeddings are hashed from each word and the W_Q, W_K, W_V weights come from a
          seeded random generator, so the patterns are illustrative rather than learned. The arithmetic is exact.
        </p>
      </div>

      {n === 0 || !r ? (
        <p className="rounded-card border border-line bg-subtle p-6 text-sm text-ink-muted">Type a sentence to start.</p>
      ) : (
        <>
          {heads > 1 && (
            <Panel title="All heads" subtitle="Each head has its own W_Q, W_K, W_V, so it can attend in a different pattern. Pick one to inspect below.">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {results.map((res, h) => (
                  <button
                    key={h}
                    onClick={() => setHead(h)}
                    className={`rounded-lg p-2 text-left ring-1 ring-inset transition-colors ${h === activeHead ? 'bg-brand-50 ring-brand-500' : 'ring-line hover:bg-subtle'}`}
                  >
                    <span className="mb-1 flex items-center gap-1.5 text-sm font-medium text-ink">
                      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: HEAD_COLORS[h] }} />
                      Head {h + 1}
                    </span>
                    <Heatmap weights={res.weights} tokens={tokens} selected={sel} compact />
                  </button>
                ))}
              </div>
            </Panel>
          )}

          <Panel
            title={heads > 1 ? `Head ${activeHead + 1}: queries, keys and values` : 'Queries, keys and values'}
            subtitle={
              <span>
                Q = X·W<sub>Q</sub>, K = X·W<sub>K</sub>, V = X·W<sub>V</sub>, each {n}×{r.dk}. X is the embedding{usePE ? ' plus positional encoding' : ''} of each token.
              </span>
            }
          >
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <MatrixTable title="Q" rows={r.Q} rowLabels={tokens} colLabels={dimLabels(r.dk)} color={(v) => diverging(v)} selectedRow={sel} />
              <MatrixTable title="K" rows={r.K} rowLabels={tokens} colLabels={dimLabels(r.dk)} color={(v) => diverging(v)} />
              <MatrixTable title="V" rows={r.V} rowLabels={tokens} colLabels={dimLabels(r.dk)} color={(v) => diverging(v)} />
            </div>
          </Panel>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel
              title={
                <span>
                  Scores QKᵀ / √d<sub>k</sub>
                </span>
              }
              subtitle={`Dot product of each query row with each key row, divided by √${r.dk} = ${Math.sqrt(r.dk).toFixed(2)}.${causal ? ' Masked cells (future tokens) are −∞.' : ''}`}
            >
              <MatrixTable title="scores" rows={r.scores} rowLabels={tokens} colLabels={tokens} color={(v) => diverging(v, 3)} selectedRow={sel} />
            </Panel>
            <Panel title="Attention weights = softmax(scores)" subtitle="Each row sums to 1. Click a row to make it the query.">
              <div className="mx-auto max-w-[460px]">
                <Heatmap weights={r.weights} tokens={tokens} selected={sel} onSelect={setSelected} />
              </div>
            </Panel>
          </div>

          <Panel
            title={`What "${tokens[sel]}" attends to`}
            subtitle="Line thickness is the attention weight. The output for this token is the weighted sum of the value rows."
          >
            <AttentionLines tokens={tokens} weights={r.weights[sel]} selected={sel} color={HEAD_COLORS[activeHead]} />
            <div className="mt-4 overflow-x-auto rounded-lg bg-subtle p-3 font-mono text-xs text-ink ring-1 ring-inset ring-line sm:text-sm">
              <p className="whitespace-nowrap">
                z({tokens[sel]}) ={' '}
                {r.weights[sel]
                  .map((w, j) => ({ w, j }))
                  .filter(({ w }) => w > 0)
                  .map(({ w, j }) => `${w.toFixed(2)}·v(${tokens[j]})`)
                  .join(' + ')}
              </p>
              <p className="mt-1 whitespace-nowrap">= [{r.output[sel].map((v) => v.toFixed(2)).join(', ')}]</p>
            </div>
            {heads > 1 && (
              <p className="mt-2 text-xs text-ink-muted">
                The {heads} head outputs (each length {r.dk}) are concatenated back to length {D_MODEL} and mixed by one more matrix W_O.
              </p>
            )}
          </Panel>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <Panel title="Transformer block" subtitle="Attention mixes information between tokens; the feed-forward layer processes each token on its own.">
              <TransformerBlock />
            </Panel>
            <Panel
              title="Positional encoding"
              subtitle={
                <span>
                  Attention ignores order, so each position adds a unique pattern of sines and cosines. Turn it off and repeated words get identical
                  rows in Q, K and V.
                </span>
              }
            >
              <PositionalEncodingPlot n={n} />
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}
