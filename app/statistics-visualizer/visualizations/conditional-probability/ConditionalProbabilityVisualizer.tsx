'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import { Panel, Slider, Stat } from '../_probability/controls';
import { clampOverlap, vennLayout } from './venn';

type Condition = 'none' | 'A' | 'B';

const PRESETS = [
  { label: 'Dependent', a: 40, b: 50, ab: 30 },
  { label: 'Independent', a: 50, b: 40, ab: 20 },
  { label: 'Disjoint', a: 30, b: 40, ab: 0 },
  { label: 'A inside B', a: 20, b: 50, ab: 20 },
];

const VW = 800;
const VH = 390;
const CY = 200;
const R_MAX = 150;
const RECT = { x: 20, y: 20, w: 760, h: 350 };

const f2 = (x: number) => (x / 100).toFixed(2);
const ratio = (num: number, den: number) => (den > 0 ? (num / den).toFixed(3) : 'undefined');

function VennDiagram({ a, b, ab, condition, onCondition }: { a: number; b: number; ab: number; condition: Condition; onCondition: (c: Condition) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { ax, bx, ra, rb } = vennLayout(a / 100, b / 100, ab / 100, R_MAX, 400, 24);

  const aOnly = a - ab;
  const bOnly = b - ab;
  const neither = 100 - a - b + ab;

  const lensLeft = Math.max(ax - ra, bx - rb);
  const lensRight = Math.min(ax + ra, bx + rb);
  const labels = [
    { show: aOnly > 0 && lensLeft - (ax - ra) > 40, x: (ax - ra + lensLeft) / 2, value: aOnly },
    { show: ab > 0 && lensRight - lensLeft > 40, x: (lensLeft + lensRight) / 2, value: ab },
    { show: bOnly > 0 && bx + rb - lensRight > 40, x: (lensRight + bx + rb) / 2, value: bOnly },
  ];

  const handlePointer = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const { x, y } = toDrawingPoint(e, svgRef.current);
    const inA = Math.hypot(x - ax, y - CY) <= ra;
    const inB = Math.hypot(x - bx, y - CY) <= rb;
    if (inA && inB) onCondition(condition === 'B' ? 'A' : 'B');
    else if (inB) onCondition('B');
    else if (inA) onCondition('A');
    else onCondition('none');
  };

  const scene = (
    <g>
      <rect x={RECT.x} y={RECT.y} width={RECT.w} height={RECT.h} rx={14} fill="#f8fafc" />
      {ra > 0 && <circle cx={ax} cy={CY} r={ra} fill="#3b82f6" fillOpacity={0.35} stroke="#1d4ed8" strokeWidth={3} />}
      {rb > 0 && <circle cx={bx} cy={CY} r={rb} fill="#f59e0b" fillOpacity={0.4} stroke="#b45309" strokeWidth={3} />}
      {labels.map((l, i) =>
        l.show ? (
          <text key={i} x={l.x} y={CY + 8} fontSize={22} textAnchor="middle" fill="#0f172a" fontWeight={700}>
            {f2(l.value)}
          </text>
        ) : null,
      )}
      {neither > 0 && (
        <text x={RECT.x + RECT.w - 16} y={RECT.y + RECT.h - 16} fontSize={20} textAnchor="end" fill="#475569">
          neither: {f2(neither)}
        </text>
      )}
      {ra > 0 && (
        <text x={ax - ra * 0.72} y={CY - ra * 0.72 - 6} fontSize={26} textAnchor="end" fill="#1d4ed8" fontWeight={700}>
          A
        </text>
      )}
      {rb > 0 && (
        <text x={bx + rb * 0.72} y={CY - rb * 0.72 - 6} fontSize={26} fill="#b45309" fontWeight={700}>
          B
        </text>
      )}
    </g>
  );

  const focus = condition === 'A' ? { cx: ax, r: ra, color: '#1d4ed8' } : condition === 'B' ? { cx: bx, r: rb, color: '#b45309' } : null;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VW} ${VH}`}
      className={`${responsiveSurface} cursor-pointer rounded-xl border border-line bg-white`}
      onPointerDown={handlePointer}
      role="img"
      aria-label="Venn diagram of events A and B"
    >
      <defs>
        <clipPath id="cond-prob-focus">{focus && <circle cx={focus.cx} cy={CY} r={focus.r} />}</clipPath>
      </defs>
      <g opacity={focus ? 0.15 : 1}>{scene}</g>
      {focus && (
        <>
          <g clipPath="url(#cond-prob-focus)">{scene}</g>
          <circle cx={focus.cx} cy={CY} r={focus.r} fill="none" stroke={focus.color} strokeWidth={5} />
        </>
      )}
      <rect x={RECT.x} y={RECT.y} width={RECT.w} height={RECT.h} rx={14} fill="none" stroke="#94a3b8" strokeWidth={2} strokeDasharray={focus ? '8 6' : undefined} />
      <text x={RECT.x + 14} y={RECT.y + 30} fontSize={20} fill="#475569">
        {focus ? `universe shrinks to ${condition}` : 'S (everyone)'}
      </text>
    </svg>
  );
}

const TX = { root: 70, mid: 300, leaf: 545 };
const TY = { A: 85, notA: 245, AB: 40, ABc: 130, AcB: 200, AcBc: 290 };

function ProbabilityTree({ a, b, ab, n, condition }: { a: number; b: number; ab: number; n: number; condition: Condition }) {
  const pBgA = a > 0 ? (ab / a).toFixed(3) : '–';
  const pBcgA = a > 0 ? ((a - ab) / a).toFixed(3) : '–';
  const pBgAc = a < 100 ? ((b - ab) / (100 - a)).toFixed(3) : '–';
  const pBcgAc = a < 100 ? ((100 - a - b + ab) / (100 - a)).toFixed(3) : '–';
  const count = (x: number) => ((x * n) / 100).toLocaleString('en-US');

  const leaves = [
    { y: TY.AB, from: TY.A, label: 'A ∩ B', p: ab, edge: pBgA, top: true, inA: true, inB: true },
    { y: TY.ABc, from: TY.A, label: 'A ∩ B′', p: a - ab, edge: pBcgA, top: false, inA: true, inB: false },
    { y: TY.AcB, from: TY.notA, label: 'A′ ∩ B', p: b - ab, edge: pBgAc, top: true, inA: false, inB: true },
    { y: TY.AcBc, from: TY.notA, label: 'A′ ∩ B′', p: 100 - a - b + ab, edge: pBcgAc, top: false, inA: false, inB: false },
  ];
  const active = (leaf: (typeof leaves)[number]) => condition === 'none' || (condition === 'A' ? leaf.inA : leaf.inB);

  return (
    <svg viewBox="0 0 800 330" className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label="Probability tree for A then B">
      {[
        { y: TY.A, label: 'A', p: f2(a), color: '#1d4ed8' },
        { y: TY.notA, label: 'A′', p: f2(100 - a), color: '#475569' },
      ].map((node) => (
        <g key={node.label}>
          <line x1={TX.root + 12} y1={165} x2={TX.mid - 22} y2={node.y} stroke="#94a3b8" strokeWidth={2.5} />
          <text x={(TX.root + TX.mid) / 2 - 10} y={(165 + node.y) / 2 + (node.y < 165 ? -12 : 26)} fontSize={20} textAnchor="middle" fill="#334155">
            {node.p}
          </text>
          <text x={TX.mid} y={node.y + 8} fontSize={24} textAnchor="middle" fill={node.color} fontWeight={700}>
            {node.label}
          </text>
        </g>
      ))}
      <circle cx={TX.root} cy={165} r={8} fill="#334155" />
      {leaves.map((leaf) => (
        <g key={leaf.label} opacity={active(leaf) ? 1 : 0.3}>
          <line x1={TX.mid + 24} y1={leaf.from} x2={TX.leaf - 8} y2={leaf.y} stroke={leaf.inB ? '#d97706' : '#94a3b8'} strokeWidth={2.5} />
          <text x={(TX.mid + TX.leaf) / 2} y={(leaf.from + leaf.y) / 2 + (leaf.top ? -10 : 24)} fontSize={18} textAnchor="middle" fill="#334155">
            {leaf.inB ? 'P(B|' : 'P(B′|'}
            {leaf.inA ? 'A)' : 'A′)'} = {leaf.edge}
          </text>
          <text x={TX.leaf} y={leaf.y + 7} fontSize={20} fill="#0f172a" fontWeight={700}>
            {leaf.label}
          </text>
          <text x={TX.leaf + 110} y={leaf.y + 7} fontSize={20} fill="#334155">
            {f2(leaf.p)} ({count(leaf.p)})
          </text>
        </g>
      ))}
    </svg>
  );
}

function ContingencyTable({ a, b, ab, n, condition }: { a: number; b: number; ab: number; n: number; condition: Condition }) {
  const c = (x: number) => ((x * n) / 100).toLocaleString('en-US');
  const rows = [
    { label: 'A', cells: [ab, a - ab, a], isA: true },
    { label: 'A′ (not A)', cells: [b - ab, 100 - a - b + ab, 100 - a], isA: false },
    { label: 'Total', cells: [b, 100 - b, 100], isA: null },
  ];
  const highlight = (row: (typeof rows)[number], col: number) => {
    if (condition === 'A') return row.isA === true && col < 3;
    if (condition === 'B') return col === 0 && row.isA !== null;
    return false;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full text-sm">
        <thead className="bg-subtle text-ink">
          <tr>
            <th scope="col" className="px-3 py-2 text-left font-semibold">
              Out of {n.toLocaleString('en-US')}
            </th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">B</th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">B′</th>
            <th scope="col" className="px-3 py-2 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-line">
              <th scope="row" className="px-3 py-2 text-left font-semibold text-ink">
                {row.label}
              </th>
              {row.cells.map((cell, i) => (
                <td key={i} className={`px-3 py-2 text-right font-mono tabular-nums ${highlight(row, i) ? 'bg-amber-100 font-semibold text-amber-900' : 'text-ink'}`}>
                  {c(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ConditionalProbabilityVisualizer() {
  const [a, setA] = useState(40);
  const [b, setB] = useState(50);
  const [ab, setAb] = useState(30);
  const [n, setN] = useState(100);
  const [condition, setCondition] = useState<Condition>('B');

  const minAb = Math.max(0, a + b - 100);
  const maxAb = Math.min(a, b);
  const union = a + b - ab;
  const product = (a * b) / 10000;
  const independent = a * b === ab * 100;

  const changeA = (v: number) => {
    setA(v);
    setAb(clampOverlap(ab, v, b));
  };
  const changeB = (v: number) => {
    setB(v);
    setAb(clampOverlap(ab, a, v));
  };

  const conditionText =
    condition === 'B'
      ? `Only the ${((b * n) / 100).toLocaleString('en-US')} people in B count now. Of them, ${((ab * n) / 100).toLocaleString('en-US')} are also in A, so P(A | B) = ${f2(ab)} / ${f2(b)} = ${ratio(ab, b)}.`
      : condition === 'A'
        ? `Only the ${((a * n) / 100).toLocaleString('en-US')} people in A count now. Of them, ${((ab * n) / 100).toLocaleString('en-US')} are also in B, so P(B | A) = ${f2(ab)} / ${f2(a)} = ${ratio(ab, a)}.`
        : 'Click circle A or B (or use the buttons) to condition on that event.';

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Slider label="P(A)" value={a} min={0} max={100} step={1} display={f2(a)} onChange={changeA} />
        <Slider label="P(B)" value={b} min={0} max={100} step={1} display={f2(b)} onChange={changeB} />
        <Slider
          label="P(A ∩ B)"
          value={ab}
          min={minAb}
          max={maxAb}
          step={1}
          display={f2(ab)}
          onChange={(v) => setAb(clampOverlap(v, a, b))}
          hint={`allowed: ${f2(minAb)} to ${f2(maxAb)}`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-ink">Presets</span>
        {PRESETS.map((p) => (
          <Button
            key={p.label}
            size="sm"
            variant="outline"
            onClick={() => {
              setA(p.a);
              setB(p.b);
              setAb(p.ab);
            }}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-ink">Condition on</span>
        {(['none', 'A', 'B'] as Condition[]).map((c) => (
          <Button key={c} size="sm" variant={condition === c ? 'primary' : 'outline'} aria-pressed={condition === c} onClick={() => setCondition(c)}>
            {c === 'none' ? 'Nothing' : `Given ${c}`}
          </Button>
        ))}
        <span className="ml-2 text-sm font-semibold text-ink">People</span>
        {[100, 1000].map((size) => (
          <Button key={size} size="sm" variant={n === size ? 'primary' : 'outline'} aria-pressed={n === size} onClick={() => setN(size)}>
            {size.toLocaleString('en-US')}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="min-w-0 space-y-4 lg:col-span-2">
          <div>
            <p className="mb-1 text-sm font-medium text-ink">
              Venn diagram
              <span className="ml-2 font-normal text-ink-muted">(circle and overlap areas are proportional to the probabilities)</span>
            </p>
            <VennDiagram a={a} b={b} ab={ab} condition={condition} onCondition={setCondition} />
            <p className="mt-2 text-sm text-ink-muted">{conditionText}</p>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-ink">
              Probability tree
              <span className="ml-2 font-normal text-ink-muted">(leaf: joint probability, with the count out of {n.toLocaleString('en-US')})</span>
            </p>
            <ProbabilityTree a={a} b={b} ab={ab} n={n} condition={condition} />
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <Panel title="Conditional probabilities">
            <dl className="space-y-1">
              <Stat label="P(A | B) = P(A∩B) / P(B)" value={ratio(ab, b)} strong={condition === 'B'} />
              <Stat label="P(B | A) = P(A∩B) / P(A)" value={ratio(ab, a)} strong={condition === 'A'} />
              <Stat label="P(A | B′)" value={ratio(a - ab, 100 - b)} />
              <Stat label="P(A ∪ B) = P(A) + P(B) − P(A∩B)" value={f2(union)} />
            </dl>
          </Panel>

          <Panel title="Independence check">
            <dl className="space-y-1">
              <Stat label="P(A) × P(B)" value={product.toFixed(4)} />
              <Stat label="P(A ∩ B)" value={(ab / 100).toFixed(4)} />
            </dl>
            <p className={`mt-2 font-semibold ${independent ? 'text-emerald-700' : 'text-rose-700'}`}>
              {independent
                ? 'Independent: knowing B does not change the chance of A.'
                : ab * 100 > a * b
                  ? 'Not independent: B makes A more likely.'
                  : 'Not independent: B makes A less likely.'}
            </p>
            {!independent && a > 0 && b > 0 && a < 100 && b < 100 && (
              <Button
                size="sm"
                variant="ghost"
                className="mt-2"
                onClick={() => setAb(clampOverlap(Math.round((a * b) / 100), a, b))}
              >
                Set P(A ∩ B) ≈ P(A) × P(B)
              </Button>
            )}
          </Panel>

          <div>
            <p className="mb-1 text-sm font-medium text-ink">Contingency table</p>
            <ContingencyTable a={a} b={b} ab={ab} n={n} condition={condition} />
          </div>
        </div>
      </div>
    </div>
  );
}
