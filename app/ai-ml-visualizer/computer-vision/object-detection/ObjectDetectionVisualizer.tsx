'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FastForward, Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import SceneArt from './SceneArt';
import {
  CANDIDATES,
  CLASS_COLORS,
  GROUND_TRUTH,
  SCENE_H,
  SCENE_W,
  evaluate,
  runNms,
  type Candidate,
} from './detectionData';

type Status = 'pending' | 'current' | 'kept' | 'suppressed' | 'filtered';

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block min-w-0 flex-1 basis-48">
      <span className="flex justify-between text-sm text-ink-muted">
        <span>{label}</span>
        <span className="font-mono text-ink">{value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-brand-600"
      />
    </label>
  );
}

const STATUS_LABEL: Record<Status, string> = {
  pending: 'waiting',
  current: 'picked now',
  kept: 'kept',
  suppressed: 'suppressed',
  filtered: 'below score',
};

const STATUS_STYLE: Record<Status, string> = {
  pending: 'bg-subtle text-ink-muted ring-line',
  current: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
  kept: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  suppressed: 'bg-gray-100 text-gray-500 ring-gray-200 line-through',
  filtered: 'bg-gray-50 text-gray-400 ring-gray-200',
};

function BoxShape({ c, status, iouWithPick }: { c: Candidate; status: Status; iouWithPick?: number }) {
  if (status === 'filtered') return null;
  const color = CLASS_COLORS[c.cls];
  const strong = status === 'kept' || status === 'current';
  const label = `${c.cls} ${c.score.toFixed(2)}`;
  return (
    <g opacity={status === 'suppressed' ? 0.35 : status === 'pending' ? 0.75 : 1}>
      <rect
        x={c.x}
        y={c.y}
        width={c.w}
        height={c.h}
        fill={status === 'current' ? color : 'none'}
        fillOpacity={status === 'current' ? 0.12 : 0}
        stroke={status === 'suppressed' ? '#6b7280' : color}
        strokeWidth={strong ? 4 : 1.5}
        strokeDasharray={status === 'suppressed' ? '6 5' : undefined}
      />
      {strong && (
        <g>
          <rect x={c.x} y={Math.max(0, c.y - 22)} width={label.length * 9 + 10} height={22} fill={color} />
          <text x={c.x + 5} y={Math.max(0, c.y - 22) + 16} fontSize={15} fontWeight={600} fill="#ffffff">
            {label}
          </text>
        </g>
      )}
      {status === 'suppressed' && iouWithPick !== undefined && (
        <text x={c.x + 4} y={c.y + c.h - 6} fontSize={14} fill="#374151">
          IoU {iouWithPick.toFixed(2)}
        </text>
      )}
    </g>
  );
}

export default function ObjectDetectionVisualizer() {
  const [scoreThreshold, setScoreThreshold] = useState(0.3);
  const [iouThreshold, setIouThreshold] = useState(0.5);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showGt, setShowGt] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const trace = useMemo(() => runNms(CANDIDATES, scoreThreshold, iouThreshold), [scoreThreshold, iouThreshold]);
  const totalSteps = trace.steps.length;
  const step = Math.min(stepIndex, totalSteps);
  const done = step >= totalSteps;

  // Status of every candidate after `step` NMS iterations.
  const { status, suppressedIou } = useMemo(() => {
    const s = new Map<number, Status>();
    const iouMap = new Map<number, number>();
    for (const c of CANDIDATES) s.set(c.id, 'filtered');
    for (const c of trace.eligible) s.set(c.id, 'pending');
    trace.steps.slice(0, step).forEach((st, k) => {
      s.set(st.pick, k === step - 1 && !done ? 'current' : 'kept');
      for (const sup of st.suppressed) {
        s.set(sup.id, 'suppressed');
        iouMap.set(sup.id, sup.iou);
      }
    });
    if (done && step > 0) s.set(trace.steps[step - 1].pick, 'kept');
    return { status: s, suppressedIou: iouMap };
  }, [trace, step, done]);

  const finalDetections = useMemo(() => {
    const keep = new Set(trace.steps.map((s) => s.pick));
    return CANDIDATES.filter((c) => keep.has(c.id));
  }, [trace]);
  const evaluation = useMemo(() => evaluate(finalDetections), [finalDetections]);
  const rawEvaluation = useMemo(() => evaluate(trace.eligible), [trace]);

  const stopTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  useEffect(() => stopTimer, []);

  const resetSteps = () => {
    stopTimer();
    setPlaying(false);
    setStepIndex(0);
  };

  const play = () => {
    if (playing) {
      stopTimer();
      setPlaying(false);
      return;
    }
    stopTimer();
    setPlaying(true);
    let s = done ? 0 : step;
    setStepIndex(s);
    timer.current = setInterval(() => {
      s = Math.min(s + 1, totalSteps);
      setStepIndex(s);
      if (s >= totalSteps) {
        stopTimer();
        setPlaying(false);
      }
    }, 900);
  };

  const changeScore = (v: number) => {
    setScoreThreshold(v);
    resetSteps();
  };
  const changeIou = (v: number) => {
    setIouThreshold(v);
    resetSteps();
  };

  const current = step > 0 && !done ? trace.steps[step - 1] : null;
  const pickedBox = current ? CANDIDATES.find((c) => c.id === current.pick) : null;
  const sorted = [...CANDIDATES].sort((a, b) => b.score - a.score);

  return (
    <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="min-w-0 space-y-4">
          <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} className={`${responsiveSurface} rounded-lg border border-line-strong`} role="img" aria-label="Synthetic scene with candidate boxes">
            <SceneArt />
            {showGt &&
              GROUND_TRUTH.map((gt) => (
                <rect key={gt.id} x={gt.x} y={gt.y} width={gt.w} height={gt.h} fill="none" stroke="#111827" strokeWidth={2} strokeDasharray="2 4" />
              ))}
            {/* Draw low scores first so the strongest boxes end up on top. */}
            {[...sorted].reverse().map((c) => (
              <BoxShape key={c.id} c={c} status={status.get(c.id) ?? 'filtered'} iouWithPick={suppressedIou.get(c.id)} />
            ))}
          </svg>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={resetSteps}>
              Reset
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<StepForward className="h-4 w-4" />}
              disabled={done}
              onClick={() => {
                stopTimer();
                setPlaying(false);
                setStepIndex(Math.min(step + 1, totalSteps));
              }}
            >
              Step
            </Button>
            <Button size="sm" variant="primary" leftIcon={playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} onClick={play}>
              {playing ? 'Pause' : 'Play'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<FastForward className="h-4 w-4" />}
              onClick={() => {
                stopTimer();
                setPlaying(false);
                setStepIndex(totalSteps);
              }}
            >
              Finish
            </Button>
            <label className="ml-auto flex items-center gap-2 text-sm text-ink-muted">
              <input type="checkbox" checked={showGt} onChange={(e) => setShowGt(e.target.checked)} className="accent-brand-600" />
              Ground truth (dotted)
            </label>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Slider label="Score threshold" value={scoreThreshold} min={0} max={0.95} step={0.05} onChange={changeScore} />
            <Slider label="NMS IoU threshold" value={iouThreshold} min={0.05} max={0.95} step={0.05} onChange={changeIou} />
          </div>

          <p className="rounded-lg border border-line bg-subtle p-3 text-sm text-gray-700">
            {step === 0
              ? `${trace.eligible.length} of ${CANDIDATES.length} candidate boxes pass the score threshold. Press Step to start NMS.`
              : current && pickedBox
                ? `Step ${step}: keep the best remaining box (${pickedBox.cls} ${pickedBox.score.toFixed(2)}). ${
                    current.suppressed.length
                      ? `It suppresses ${current.suppressed.length} same-class box${current.suppressed.length > 1 ? 'es' : ''} with IoU above ${iouThreshold.toFixed(2)}.`
                      : 'No same-class box overlaps it enough, so nothing is suppressed.'
                  }`
                : `Done after ${totalSteps} steps: ${finalDetections.length} boxes kept out of ${trace.eligible.length}.`}
          </p>
        </div>

        <div className="min-w-0 space-y-4">
          <div>
            <h3 className="font-semibold text-ink">Candidates (best score first)</h3>
            <ul className="mt-2 max-h-72 space-y-1 overflow-y-auto rounded-lg border border-line p-2 text-sm">
              {sorted.map((c) => {
                const s = status.get(c.id) ?? 'filtered';
                return (
                  <li key={c.id} className="flex items-center gap-2">
                    <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: CLASS_COLORS[c.cls] }} />
                    <span className="w-16 shrink-0 text-ink">{c.cls}</span>
                    <span className="w-10 shrink-0 font-mono text-ink">{c.score.toFixed(2)}</span>
                    <span className={`ml-auto truncate rounded-full px-2 py-0.5 text-xs ring-1 ring-inset ${STATUS_STYLE[s]}`}>
                      {STATUS_LABEL[s]}
                      {s === 'suppressed' && suppressedIou.has(c.id) ? ` (IoU ${suppressedIou.get(c.id)!.toFixed(2)})` : ''}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-ink">Precision and recall (after full NMS)</h3>
            <p className="text-xs text-ink-muted">A detection counts as correct if it has the right class and IoU ≥ 0.5 with an unmatched object.</p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-ink-muted">
                  <tr>
                    <th className="py-1 pr-2 font-medium" />
                    <th className="py-1 pr-2 text-right font-medium">TP</th>
                    <th className="py-1 pr-2 text-right font-medium">FP</th>
                    <th className="py-1 pr-2 text-right font-medium">FN</th>
                    <th className="py-1 pr-2 text-right font-medium">Precision</th>
                    <th className="py-1 text-right font-medium">Recall</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-ink">
                  {[
                    { name: 'Before NMS', e: rawEvaluation },
                    { name: 'After NMS', e: evaluation },
                  ].map(({ name, e }) => (
                    <tr key={name} className="border-t border-line">
                      <td className="py-1 pr-2 font-sans text-ink-muted">{name}</td>
                      <td className="py-1 pr-2 text-right">{e.tp}</td>
                      <td className="py-1 pr-2 text-right">{e.fp}</td>
                      <td className="py-1 pr-2 text-right">{e.fn}</td>
                      <td className="py-1 pr-2 text-right">{e.precision.toFixed(2)}</td>
                      <td className="py-1 text-right">{e.recall.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-ink-muted">
              Duplicates count as false positives, which is why NMS raises precision. Raising the score threshold trades recall for precision.
            </p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-ink-muted">
        The candidate boxes and scores are simulated: generated deterministically around each object to mimic raw detector output.
        The IoU, NMS and precision/recall computations on them are real.
      </p>
    </div>
  );
}
