'use client';

import { useMemo, useState } from 'react';
import { Dices, RotateCcw, Target, Undo2 } from 'lucide-react';
import { Button, Select, fieldStyles } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import { presets, type Candidate } from './continuations';
import { entropyBits, filterTopKTopP, sampleIndex, seededUniform, softmax } from './sampling';

interface Choice {
  token: string;
  /** Final (after filtering) probability of the chosen token. */
  prob: number;
  method: 'sample' | 'greedy';
  /** The uniform random number used, for sampled tokens. */
  u?: number;
  /** Index into the sorted candidate list. */
  index: number;
}

const sortCandidates = (c: Candidate[]) => [...c].sort((a, b) => b.logit - a.logit);

/** Shows a token with its leading space made visible. */
function TokenLabel({ token }: { token: string }) {
  const space = token.startsWith(' ');
  return (
    <span className="whitespace-pre font-mono">
      {space && <span className="text-ink-faint">␣</span>}
      {space ? token.slice(1) : token}
    </span>
  );
}

const T_MIN = 0.05;
const T_MAX = 3;

function EntropyChart({ logits, temperature }: { logits: number[]; temperature: number }) {
  const w = 420;
  const h = 200;
  const pad = { l: 40, r: 12, t: 14, b: 32 };
  const hMax = Math.log2(logits.length);
  const xs = Array.from({ length: 80 }, (_, i) => T_MIN + ((T_MAX - T_MIN) * i) / 79);
  const toX = (t: number) => pad.l + ((t - T_MIN) / (T_MAX - T_MIN)) * (w - pad.l - pad.r);
  const toY = (e: number) => h - pad.b - (e / (hMax || 1)) * (h - pad.t - pad.b);
  const path = xs.map((t, i) => `${i ? 'L' : 'M'}${toX(t).toFixed(1)},${toY(entropyBits(softmax(logits, t))).toFixed(1)}`).join(' ');
  const current = entropyBits(softmax(logits, temperature));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={responsiveSurface} role="img" aria-label="Entropy of the next-token distribution as temperature changes">
      <line x1={pad.l} y1={toY(hMax)} x2={w - pad.r} y2={toY(hMax)} stroke="#d1d5db" strokeDasharray="4 4" />
      <text x={w - pad.r} y={toY(hMax) - 4} textAnchor="end" fontSize={11} fill="#6b7280">
        max = log₂({logits.length}) = {hMax.toFixed(2)} bits
      </text>
      <line x1={pad.l} y1={h - pad.b} x2={w - pad.r} y2={h - pad.b} stroke="#9ca3af" />
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={h - pad.b} stroke="#9ca3af" />
      {[0, 1, 2, 3].map((t) => (
        <text key={t} x={toX(Math.max(t, T_MIN))} y={h - pad.b + 16} textAnchor="middle" fontSize={11} fill="#6b7280">
          {t}
        </text>
      ))}
      <text x={(w + pad.l) / 2} y={h - 4} textAnchor="middle" fontSize={11} fill="#6b7280">
        temperature T
      </text>
      <text x={8} y={toY(0)} fontSize={11} fill="#6b7280">
        0
      </text>
      <text x={8} y={toY(hMax) + 4} fontSize={11} fill="#6b7280">
        {hMax.toFixed(1)}
      </text>
      <path d={path} fill="none" stroke="#6366f1" strokeWidth={2.5} />
      <line x1={toX(temperature)} y1={pad.t} x2={toX(temperature)} y2={h - pad.b} stroke="#f59e0b" strokeDasharray="3 3" />
      <circle cx={toX(temperature)} cy={toY(current)} r={5} fill="#f59e0b" stroke="white" strokeWidth={2} />
    </svg>
  );
}

export default function TextGenerationVisualizer() {
  const [presetId, setPresetId] = useState(presets[0].id);
  const [temperature, setTemperature] = useState(1);
  const [topK, setTopK] = useState(0);
  const [topP, setTopP] = useState(1);
  const [seed, setSeed] = useState(42);
  const [draws, setDraws] = useState(0);
  const [path, setPath] = useState<Choice[]>([]);

  const preset = presets.find((p) => p.id === presetId) ?? presets[0];

  // Walk the tree along the tokens generated so far.
  const candidates = useMemo(() => {
    let node: Candidate[] | undefined = sortCandidates(preset.root);
    for (const step of path) {
      node = node?.[step.index]?.next;
      node = node && sortCandidates(node);
    }
    return node;
  }, [preset, path]);

  const logits = useMemo(() => candidates?.map((c) => c.logit) ?? [], [candidates]);
  const probs = useMemo(() => (logits.length ? softmax(logits, temperature) : []), [logits, temperature]);
  const filtered = useMemo(() => filterTopKTopP(probs, topK, topP), [probs, topK, topP]);
  const maxProb = Math.max(...probs, 0.0001);
  const hT = entropyBits(probs);
  const hFinal = entropyBits(filtered.final);
  const keptCount = filtered.status.filter((s) => s === 'kept').length;
  const last = path[path.length - 1];

  const choose = (index: number, method: Choice['method'], u?: number) => {
    if (!candidates) return;
    setPath([...path, { token: candidates[index].token, prob: filtered.final[index], method, u, index }]);
  };

  const sample = () => {
    const u = seededUniform(seed, draws);
    setDraws(draws + 1);
    choose(sampleIndex(filtered.final, u), 'sample', u);
  };

  const greedy = () => {
    let best = 0;
    filtered.final.forEach((p, i) => {
      if (p > filtered.final[best]) best = i;
    });
    choose(best, 'greedy');
  };

  const reset = () => {
    setPath([]);
    setDraws(0);
  };

  // Each kept token owns an interval of [0, 1); sampling picks the one containing u.
  const intervals = filtered.final.map((_, i) => {
    const start = filtered.final.slice(0, i).reduce((s, x) => s + x, 0);
    return [start, start + filtered.final[i]] as const;
  });

  return (
    <div className="space-y-6">
      <p className="rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900">
        The next-token scores here are hand-crafted and illustrative: each prompt has a small tree of a dozen or so likely
        continuations instead of a real model&apos;s full vocabulary. The softmax, temperature, top-k, top-p, sampling and
        entropy calculations are all real.
      </p>

      {/* Prompt and generated text */}
      <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1 basis-56">
            <Select
              label="Prompt"
              value={presetId}
              onChange={(e) => {
                setPresetId(e.target.value);
                reset();
              }}
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </Select>
          </div>
          <label className="w-28">
            <span className="mb-1.5 block text-sm font-medium text-ink">Seed</span>
            <input
              type="number"
              value={seed}
              onChange={(e) => {
                setSeed(Math.trunc(Number(e.target.value)) || 0);
                setDraws(0);
              }}
              className={`${fieldStyles} h-11`}
            />
          </label>
        </div>

        <div className="mt-4 rounded-lg border border-line bg-subtle p-4 text-lg leading-relaxed text-ink">
          <span>{preset.prompt}</span>
          {path.map((c, i) => (
            <span
              key={i}
              title={`${c.method === 'greedy' ? 'Greedy' : `Sampled (u = ${c.u?.toFixed(3)})`}, p = ${(c.prob * 100).toFixed(1)}%`}
              className={`whitespace-pre-wrap rounded px-0.5 ${c.method === 'greedy' ? 'bg-sky-100 text-sky-900' : 'bg-violet-100 text-violet-900'}`}
            >
              {c.token}
            </span>
          ))}
          {candidates && <span className="ml-0.5 inline-block h-5 w-2 animate-pulse bg-brand-500 align-middle" aria-hidden />}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-violet-100 ring-1 ring-violet-200" /> sampled
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-sky-100 ring-1 ring-sky-200" /> greedy
          </span>
          <span>
            {path.length} token{path.length === 1 ? '' : 's'} generated, sequence probability{' '}
            <span className="font-mono">{path.reduce((p, c) => p * c.prob, 1).toExponential(2)}</span>
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" leftIcon={<Dices className="h-4 w-4" />} onClick={sample} disabled={!candidates}>
            Sample next token
          </Button>
          <Button size="sm" variant="outline" leftIcon={<Target className="h-4 w-4" />} onClick={greedy} disabled={!candidates}>
            Greedy next token
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<Undo2 className="h-4 w-4" />} onClick={() => setPath(path.slice(0, -1))} disabled={path.length === 0}>
            Undo
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={reset} disabled={path.length === 0}>
            Reset
          </Button>
        </div>
        {!candidates && (
          <p className="mt-3 text-sm text-ink-muted">End of this branch of the illustrative tree. Undo or reset to try another path.</p>
        )}
        {last?.method === 'sample' && (
          <p className="mt-3 text-sm text-ink-muted">
            Last draw: u = <span className="font-mono">{last.u?.toFixed(3)}</span> fell in the interval of{' '}
            <TokenLabel token={last.token} /> (p = {(last.prob * 100).toFixed(1)}%).
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]">
        {/* Distribution */}
        <div className="min-w-0 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
          <h3 className="text-lg font-semibold text-ink">Next-token distribution</h3>
          {candidates ? (
            <>
              <p className="mt-1 text-sm text-ink-muted">
                Bar length is the probability after temperature. Hatched bars are removed by top-k or top-p; the right column is
                the renormalised probability actually used for sampling.
              </p>
              <div className="mt-4 overflow-x-auto">
                <div className="min-w-[280px] space-y-1.5">
                  <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.25rem_3.25rem] gap-2 text-xs font-semibold text-ink sm:grid-cols-[7rem_3rem_minmax(0,1fr)_3.5rem_3.5rem]">
                    <span>Token</span>
                    <span className="hidden text-right sm:block">logit</span>
                    <span>p after T</span>
                    <span className="text-right">p(T)</span>
                    <span className="text-right">final</span>
                  </div>
                  {candidates.map((c, i) => {
                    const status = filtered.status[i];
                    return (
                      <div
                        key={c.token}
                        className={`grid grid-cols-[5.5rem_minmax(0,1fr)_3.25rem_3.25rem] items-center gap-2 text-sm sm:grid-cols-[7rem_3rem_minmax(0,1fr)_3.5rem_3.5rem] ${
                          status === 'kept' ? 'text-ink' : 'text-ink-faint'
                        }`}
                        title={status === 'kept' ? `sampling interval ${intervals[i][0].toFixed(3)} to ${intervals[i][1].toFixed(3)}` : `removed by ${status}`}
                      >
                        <span className="truncate">
                          <TokenLabel token={c.token} />
                        </span>
                        <span className="hidden text-right font-mono text-xs text-ink-muted sm:block">{c.logit.toFixed(1)}</span>
                        <div className="h-4 rounded bg-subtle">
                          <div
                            className={`h-full rounded ${status === 'kept' ? 'bg-brand-500' : 'bg-gray-300'}`}
                            style={{
                              width: `${(probs[i] / maxProb) * 100}%`,
                              backgroundImage:
                                status === 'kept' ? undefined : 'repeating-linear-gradient(45deg, transparent 0 4px, rgba(255,255,255,0.7) 4px 7px)',
                            }}
                          />
                        </div>
                        <span className="text-right font-mono text-xs tabular-nums">{(probs[i] * 100).toFixed(1)}%</span>
                        <span className="text-right font-mono text-xs tabular-nums">
                          {status === 'kept' ? `${(filtered.final[i] * 100).toFixed(1)}%` : status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-ink-muted">No continuations left on this branch.</p>
          )}
        </div>

        {/* Controls and entropy */}
        <div className="min-w-0 space-y-6">
          <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
            <h3 className="text-lg font-semibold text-ink">Decoding settings</h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="flex justify-between text-sm font-medium text-ink">
                  Temperature <span className="font-mono">{temperature.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min={T_MIN}
                  max={T_MAX}
                  step={0.05}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="mt-1 w-full accent-brand-600"
                />
                <span className="text-xs text-ink-muted">Below 1 sharpens the distribution, above 1 flattens it.</span>
              </label>
              <label className="block">
                <span className="flex justify-between text-sm font-medium text-ink">
                  Top-k <span className="font-mono">{topK === 0 ? 'off' : topK}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={1}
                  value={topK}
                  onChange={(e) => setTopK(Number(e.target.value))}
                  className="mt-1 w-full accent-brand-600"
                />
                <span className="text-xs text-ink-muted">Keep only the k most likely tokens (0 = off).</span>
              </label>
              <label className="block">
                <span className="flex justify-between text-sm font-medium text-ink">
                  Top-p <span className="font-mono">{topP >= 1 ? 'off' : topP.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={topP}
                  onChange={(e) => setTopP(Number(e.target.value))}
                  className="mt-1 w-full accent-brand-600"
                />
                <span className="text-xs text-ink-muted">Keep the smallest set of top tokens whose probabilities add up to p.</span>
              </label>
            </div>
          </div>

          <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
            <h3 className="text-lg font-semibold text-ink">Entropy</h3>
            {candidates ? (
              <>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-line bg-subtle px-3 py-2">
                    <div className="text-xs text-ink-muted">After temperature</div>
                    <div className="font-mono text-lg font-semibold text-ink">{hT.toFixed(2)} bits</div>
                    <div className="text-[11px] text-ink-faint">like {Math.pow(2, hT).toFixed(1)} equal choices</div>
                  </div>
                  <div className="rounded-lg border border-line bg-subtle px-3 py-2">
                    <div className="text-xs text-ink-muted">After top-k / top-p</div>
                    <div className="font-mono text-lg font-semibold text-ink">{hFinal.toFixed(2)} bits</div>
                    <div className="text-[11px] text-ink-faint">{keptCount} of {candidates.length} tokens kept</div>
                  </div>
                </div>
                <div className="mt-4">
                  <EntropyChart logits={logits} temperature={temperature} />
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-ink-muted">Nothing to measure at the end of a branch.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
