'use client';

import { useMemo, useState } from 'react';
import { Select } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import { analogyPresets, dimensionNames, groupLabels, words, type Group } from './embeddings';
import { add, cosine, dot, norm, pca, project, sub } from './vectorMath';

const W = 640;
const H = 460;
const PAD = 44;

const groupColour: Record<Group, string> = {
  people: '#6366f1',
  animals: '#10b981',
  places: '#f59e0b',
  verbs: '#f43f5e',
};
const groups = Object.keys(groupLabels) as Group[];

const axisOptions: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
];

const byWord = new Map(words.map((w) => [w.word, w]));
const vec = (word: string) => byWord.get(word)!.vector;

function neighbours(target: number[], exclude: string[], k: number) {
  return words
    .filter((w) => !exclude.includes(w.word))
    .map((w) => ({ word: w.word, group: w.group, sim: cosine(target, w.vector) }))
    .sort((a, b) => b.sim - a.sim)
    .slice(0, k);
}

function SimBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-subtle ring-1 ring-inset ring-line">
      <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

function WordSelect({ label, value, onChange }: { label: string; value: string; onChange: (w: string) => void }) {
  return (
    <Select label={label} value={value} onChange={(e) => onChange(e.target.value)}>
      {groups.map((g) => (
        <optgroup key={g} label={groupLabels[g]}>
          {words
            .filter((w) => w.group === g)
            .map((w) => (
              <option key={w.word} value={w.word}>
                {w.word}
              </option>
            ))}
        </optgroup>
      ))}
    </Select>
  );
}

function Arrow({ from, to, colour, dashed = false, id }: { from: [number, number]; to: [number, number]; colour: string; dashed?: boolean; id: string }) {
  return (
    <>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={colour} />
        </marker>
      </defs>
      <line
        x1={from[0]}
        y1={from[1]}
        x2={to[0]}
        y2={to[1]}
        stroke={colour}
        strokeWidth={2.5}
        strokeDasharray={dashed ? '6 5' : undefined}
        markerEnd={`url(#${id})`}
      />
    </>
  );
}

export default function WordEmbeddingsVisualizer() {
  const [fit, setFit] = useState<'all' | Group>('all');
  const [axes, setAxes] = useState(1);
  const [selected, setSelected] = useState('king');
  const [analogy, setAnalogy] = useState({ a: 'king', b: 'man', c: 'woman' });
  const [showAnalogy, setShowAnalogy] = useState(true);
  const [pair, setPair] = useState({ x: 'cat', y: 'kitten' });

  const fitWords = useMemo(() => (fit === 'all' ? words : words.filter((w) => w.group === fit)), [fit]);
  const model = useMemo(() => pca(fitWords.map((w) => w.vector), 3), [fitWords]);
  const [cx, cy] = axisOptions[axes];

  // Analogy: a − b + c, nearest words by cosine (excluding the three inputs, as word2vec does).
  const target = useMemo(() => add(sub(vec(analogy.a), vec(analogy.b)), vec(analogy.c)), [analogy]);
  const analogyResults = useMemo(() => neighbours(target, [analogy.a, analogy.b, analogy.c], 5), [target, analogy]);
  const answer = analogyResults[0].word;

  const selectedNeighbours = useMemo(() => neighbours(vec(selected), [selected], 6), [selected]);

  // Words drawn on the plot: the fitted set, plus anything the analogy refers to.
  const plotted = useMemo(() => {
    const extra = showAnalogy ? [analogy.a, analogy.b, analogy.c, answer] : [];
    const set = new Set([...fitWords.map((w) => w.word), ...extra, selected]);
    return words.filter((w) => set.has(w.word));
  }, [fitWords, showAnalogy, analogy, answer, selected]);

  const { toScreen } = useMemo(() => {
    const pts = plotted.map((w) => project(w.vector, model, cx, cy));
    if (showAnalogy) pts.push(project(target, model, cx, cy));
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const sx = (W - 2 * PAD) / (maxX - minX || 1);
    const sy = (H - 2 * PAD) / (maxY - minY || 1);
    return {
      toScreen: (v: number[]): [number, number] => {
        const [x, y] = project(v, model, cx, cy);
        return [PAD + (x - minX) * sx, H - PAD - (y - minY) * sy];
      },
    };
  }, [plotted, model, cx, cy, showAnalogy, target]);

  const explained = (i: number) => ((model.variances[i] / model.totalVariance) * 100).toFixed(0);

  const pa = vec(pair.x);
  const pb = vec(pair.y);
  const pairDot = dot(pa, pb);
  const pairCos = cosine(pa, pb);
  const products = pa.map((x, i) => x * pb[i]);
  const maxAbsProduct = Math.max(...products.map(Math.abs), 0.001);

  const applyPreset = (p: (typeof analogyPresets)[number]) => {
    setAnalogy({ a: p.a, b: p.b, c: p.c });
    setShowAnalogy(true);
    setFit(byWord.get(p.a)!.group);
  };

  const sa = toScreen(vec(analogy.a));
  const sb = toScreen(vec(analogy.b));
  const sc = toScreen(vec(analogy.c));
  const st = toScreen(target);
  const sAns = toScreen(vec(answer));
  const sSel = toScreen(vec(selected));

  return (
    <div className="space-y-6">
      <p className="rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900">
        These {words.length} vectors are hand-crafted and illustrative (16 dimensions with readable meanings). Real embeddings
        are learned from text and have hundreds of unlabelled dimensions, but they show the same kinds of structure.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Projection */}
        <div className="min-w-0 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <div className="min-w-0 flex-1 basis-40">
              <Select label="Fit PCA to" value={fit} onChange={(e) => setFit(e.target.value as 'all' | Group)}>
                <option value="all">All words</option>
                {groups.map((g) => (
                  <option key={g} value={g}>
                    {groupLabels[g]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="min-w-0 flex-1 basis-40">
              <Select label="Axes" value={axes} onChange={(e) => setAxes(Number(e.target.value))}>
                {axisOptions.map(([a, b], i) => (
                  <option key={i} value={i}>
                    PC{a + 1} vs PC{b + 1}
                  </option>
                ))}
              </Select>
            </div>
            <label className="flex h-11 items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={showAnalogy} onChange={(e) => setShowAnalogy(e.target.checked)} className="h-4 w-4 accent-brand-600" />
              Draw analogy
            </label>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className={`${responsiveSurface} rounded-lg border border-line bg-subtle`} role="img" aria-label="2D PCA projection of word vectors">
            <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#d1d5db" />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#d1d5db" />
            <text x={W - PAD} y={H - 14} textAnchor="end" fontSize={13} fill="#6b7280">
              PC{cx + 1} ({explained(cx)}% of variance)
            </text>
            <text x={14} y={PAD - 14} fontSize={13} fill="#6b7280">
              PC{cy + 1} ({explained(cy)}%)
            </text>

            {/* Lines to the selected word's nearest neighbours */}
            {selectedNeighbours.slice(0, 3).map((nb) => {
              const p = toScreen(vec(nb.word));
              return <line key={nb.word} x1={sSel[0]} y1={sSel[1]} x2={p[0]} y2={p[1]} stroke="#6366f1" strokeOpacity={0.35} strokeWidth={1.5} />;
            })}

            {showAnalogy && (
              <g>
                <Arrow id="arrow-ab" from={sb} to={sa} colour="#0ea5e9" />
                <Arrow id="arrow-ct" from={sc} to={st} colour="#0ea5e9" dashed />
                <circle cx={st[0]} cy={st[1]} r={7} fill="none" stroke="#0ea5e9" strokeWidth={2.5} />
                <circle cx={sAns[0]} cy={sAns[1]} r={12} fill="none" stroke="#0f172a" strokeWidth={2} strokeDasharray="3 3" />
              </g>
            )}

            {plotted.map((w) => {
              const [x, y] = toScreen(w.vector);
              const isSel = w.word === selected;
              return (
                <g
                  key={w.word}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${w.word}`}
                  className="cursor-pointer outline-none"
                  onClick={() => setSelected(w.word)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelected(w.word);
                  }}
                >
                  <circle cx={x} cy={y} r={14} fill="transparent" />
                  <circle cx={x} cy={y} r={isSel ? 7 : 5} fill={groupColour[w.group]} stroke={isSel ? '#0b1020' : 'white'} strokeWidth={isSel ? 2.5 : 1.5} />
                  <text x={x + 9} y={y - 7} fontSize={14} fontWeight={isSel ? 700 : 500} fill="#1f2937" paintOrder="stroke" stroke="white" strokeWidth={3}>
                    {w.word}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
            {groups.map((g) => (
              <span key={g} className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: groupColour[g] }} />
                {groupLabels[g]}
              </span>
            ))}
            {showAnalogy && (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-sky-500" />
                analogy offset (solid: b → a, dashed: same offset from c)
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            The 16-D vectors are squashed to 2-D, so distances on the plot are only approximate. Cosine similarities in the
            panels are computed on the full vectors. Try fitting PCA to one group to see its internal structure.
          </p>
        </div>

        {/* Neighbours */}
        <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
          <h3 className="text-lg font-semibold text-ink">Nearest neighbours</h3>
          <p className="mt-1 text-sm text-ink-muted">Click a word on the plot or pick one here.</p>
          <div className="mt-3">
            <WordSelect label="Word" value={selected} onChange={setSelected} />
          </div>
          <ol className="mt-4 space-y-2.5">
            {selectedNeighbours.map((nb, i) => (
              <li key={nb.word}>
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <button type="button" onClick={() => setSelected(nb.word)} className="font-medium text-ink hover:text-brand-700">
                    {i + 1}. {nb.word}
                  </button>
                  <span className="font-mono text-ink-muted">{nb.sim.toFixed(3)}</span>
                </div>
                <SimBar value={nb.sim} />
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Analogy */}
        <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
          <h3 className="text-lg font-semibold text-ink">Analogy: a − b + c = ?</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {analogyPresets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors ${
                  p.a === analogy.a && p.b === analogy.b && p.c === analogy.c
                    ? 'bg-brand-50 text-brand-700 ring-brand-200'
                    : 'bg-white text-ink-muted ring-line hover:text-ink'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <WordSelect label="a" value={analogy.a} onChange={(a) => setAnalogy({ ...analogy, a })} />
            <WordSelect label="b (minus)" value={analogy.b} onChange={(b) => setAnalogy({ ...analogy, b })} />
            <WordSelect label="c (plus)" value={analogy.c} onChange={(c) => setAnalogy({ ...analogy, c })} />
          </div>
          <p className="mt-4 text-base text-ink">
            <span className="font-mono">
              {analogy.a} − {analogy.b} + {analogy.c} ≈{' '}
            </span>
            <span className="font-semibold text-brand-700">{answer}</span>
          </p>
          <ol className="mt-3 space-y-2">
            {analogyResults.map((r, i) => (
              <li key={r.word} className="grid grid-cols-[6rem_1fr_3.5rem] items-center gap-2 text-sm">
                <span className={i === 0 ? 'font-semibold text-ink' : 'text-ink-muted'}>{r.word}</span>
                <SimBar value={r.sim} />
                <span className="text-right font-mono text-ink-muted">{r.sim.toFixed(3)}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-ink-muted">
            The offset b → a (for example man → king, &quot;add royalty&quot;) is added to c. The result is a point in space
            that is not exactly any word, so we report the words with the highest cosine similarity, excluding a, b and c.
          </p>
        </div>

        {/* Cosine explainer */}
        <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
          <h3 className="text-lg font-semibold text-ink">Cosine similarity, step by step</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <WordSelect label="Word x" value={pair.x} onChange={(x) => setPair({ ...pair, x })} />
            <WordSelect label="Word y" value={pair.y} onChange={(y) => setPair({ ...pair, y })} />
          </div>
          <div className="mt-4 space-y-1">
            <div className="grid grid-cols-[minmax(0,1fr)_3rem_3rem_minmax(0,6rem)] gap-2 border-b border-line pb-1 text-xs font-semibold text-ink">
              <span>Dimension</span>
              <span className="text-right">x</span>
              <span className="text-right">y</span>
              <span>x·y</span>
            </div>
            {dimensionNames.map((name, i) => {
              const pr = products[i];
              const width = (Math.abs(pr) / maxAbsProduct) * 50;
              return (
                <div key={name} className="grid grid-cols-[minmax(0,1fr)_3rem_3rem_minmax(0,6rem)] items-center gap-2 text-xs">
                  <span className="truncate text-ink-muted" title={name}>
                    {name}
                  </span>
                  <span className="text-right font-mono">{pa[i].toFixed(2)}</span>
                  <span className="text-right font-mono">{pb[i].toFixed(2)}</span>
                  <div className="relative h-3 rounded bg-subtle">
                    <div className="absolute inset-y-0 left-1/2 w-px bg-line-strong" />
                    <div
                      className={`absolute inset-y-0.5 rounded-sm ${pr >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={pr >= 0 ? { left: '50%', width: `${width}%` } : { right: '50%', width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-1 rounded-lg bg-subtle p-3 font-mono text-sm text-ink ring-1 ring-inset ring-line">
            <p>x · y = Σ xᵢyᵢ = {pairDot.toFixed(3)}</p>
            <p>
              |x| = {norm(pa).toFixed(3)}, |y| = {norm(pb).toFixed(3)}
            </p>
            <p className="font-semibold">
              cos θ = {pairDot.toFixed(3)} / ({norm(pa).toFixed(3)} × {norm(pb).toFixed(3)}) = {pairCos.toFixed(3)}
            </p>
            <p className="text-ink-muted">θ ≈ {((Math.acos(Math.max(-1, Math.min(1, pairCos))) * 180) / Math.PI).toFixed(1)}°</p>
          </div>
        </div>
      </div>
    </div>
  );
}
