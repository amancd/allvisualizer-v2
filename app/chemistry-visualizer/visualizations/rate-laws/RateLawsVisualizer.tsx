'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Pause, Play, RotateCcw, Shuffle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import { Legend, Panel, Slider, Stat } from '../_kinetics/Controls';
import LinePlot, { type Point } from '../_kinetics/LinePlot';
import { fixed, linearFit, sci } from '../_kinetics/format';
import { ORDERS, ORDER_INFO, TRANSFORMS, T_MAX, concentration, halfLife, halvingTimes, makeMystery, rate, type Mystery, type Order } from './rateLaw';

const CURVE = '#4f46e5';
const HALF = '#f59e0b';
const STRAIGHT = '#059669';
const VESSEL_COUNT = 60;
const PLAY_SECONDS = 10;

const VESSEL = Array.from({ length: VESSEL_COUNT }, (_, i) => {
  const col = i % 10;
  const row = Math.floor(i / 10);
  const jx = Math.sin(i * 12.9898) * 43758.5453;
  const jy = Math.sin(i * 78.233) * 12345.6789;
  return {
    x: 22 + col * 36 + (jx - Math.floor(jx) - 0.5) * 14,
    y: 22 + row * 36 + (jy - Math.floor(jy) - 0.5) * 14,
    rank: (i * 37) % VESSEL_COUNT,
  };
});

function sampleTimes(end: number, n = 240): number[] {
  return Array.from({ length: n + 1 }, (_, i) => (end * i) / n);
}

function padRange(values: number[]): [number, number] {
  const finite = values.filter(Number.isFinite);
  if (finite.length === 0) return [0, 1];
  let lo = Math.min(...finite);
  let hi = Math.max(...finite);
  if (hi - lo < 1e-9) {
    lo -= 0.5;
    hi += 0.5;
  }
  const pad = (hi - lo) * 0.08;
  return [lo - pad, hi + pad];
}

function OrderButtons({ value, onChange, label }: { value: Order | null; onChange: (o: Order) => void; label?: (o: Order) => string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ORDERS.map((o) => (
        <Button key={o} size="sm" variant={value === o ? 'primary' : 'outline'} aria-pressed={value === o} onClick={() => onChange(o)}>
          {label ? label(o) : ORDER_INFO[o].name}
        </Button>
      ))}
    </div>
  );
}

function Explore() {
  const [order, setOrder] = useState<Order>(1);
  const [k, setK] = useState(ORDER_INFO[1].kDefault);
  const [a0, setA0] = useState(1);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);

  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  });

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = ((now - last) / 1000) * (T_MAX / PLAY_SECONDS);
      last = now;
      const next = Math.min(T_MAX, tRef.current + dt);
      tRef.current = next;
      setT(next);
      if (next >= T_MAX) {
        setPlaying(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const info = ORDER_INFO[order];
  const a = concentration(order, k, a0, t);
  const times = sampleTimes(T_MAX);
  const curve: Point[] = times.map((s) => [s, concentration(order, k, a0, s)]);
  const halvings = halvingTimes(order, k, a0, T_MAX);
  const depletion = order === 0 ? a0 / k : Infinity;
  const linearEnd = Math.min(T_MAX, depletion * 0.995);
  const linearTimes = sampleTimes(linearEnd, 160);
  const remaining = Math.round((VESSEL_COUNT * a) / a0);

  const play = () => {
    if (!playing && t >= T_MAX) {
      tRef.current = 0;
      setT(0);
    }
    setPlaying(!playing);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Reaction order (rate = k[A]ⁿ)</p>
          <OrderButtons
            value={order}
            onChange={(o) => {
              setOrder(o);
              setK(ORDER_INFO[o].kDefault);
            }}
            label={(o) => `${ORDER_INFO[o].name} (n = ${o})`}
          />
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <Slider label="Rate constant k" value={k} min={info.kMin} max={info.kMax} step={info.kStep} display={`${sci(k, 3)} ${info.kUnit}`} onChange={setK} />
          <Slider label="Initial concentration [A]₀" value={a0} min={0.2} max={2} step={0.1} display={`${fixed(a0, 1)} M`} onChange={setA0} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={play} leftIcon={playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}>
            {playing ? 'Pause' : 'Play'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPlaying(false);
              setT(0);
            }}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Reset
          </Button>
          <label className="flex min-w-0 flex-1 basis-48 items-center gap-2 text-sm text-ink-muted">
            t
            <input
              type="range"
              min={0}
              max={T_MAX}
              step={0.5}
              value={t}
              onChange={(e) => {
                setPlaying(false);
                setT(Number(e.target.value));
              }}
              className="w-full accent-brand-600"
              aria-label="Time"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
          <p className="text-sm font-medium text-ink">[A] vs time</p>
          <LinePlot
            x={[0, T_MAX]}
            y={[0, 2.1]}
            xLabel="time t (s)"
            yLabel="[A] (M)"
            ariaLabel={`Concentration of A against time for a ${info.name.toLowerCase()} reaction`}
            series={[{ points: curve, color: CURVE, width: 3 }]}
          >
            {(sx, sy) => (
              <g>
                {halvings.map((h, i) => {
                  const level = a0 / 2 ** (i + 1);
                  return (
                    <g key={i}>
                      <line x1={sx(h)} x2={sx(h)} y1={sy(0)} y2={sy(level)} stroke={HALF} strokeWidth={2} strokeDasharray="5 4" />
                      <line x1={sx(0)} x2={sx(h)} y1={sy(level)} y2={sy(level)} stroke={HALF} strokeWidth={1} strokeDasharray="3 4" opacity={0.7} />
                      <circle cx={sx(h)} cy={sy(level)} r={5} fill={HALF} />
                      <text x={sx(h) + 4} y={sy(0) - 6 - (i % 2) * 16} fontSize={13} fill="#b45309">
                        {`t${i + 1}`}
                      </text>
                    </g>
                  );
                })}
                <line x1={sx(t)} x2={sx(t)} y1={sy(0)} y2={sy(2.1)} stroke="#0f172a" strokeWidth={1.5} opacity={0.5} />
                <circle cx={sx(t)} cy={sy(a)} r={7} fill="#dc2626" stroke="white" strokeWidth={2} />
              </g>
            )}
          </LinePlot>
          <Legend
            items={[
              { color: CURVE, label: '[A](t)' },
              { color: HALF, label: 'successive half-lives t1, t2, … ([A]₀/2, [A]₀/4, …)', dashed: true },
            ]}
          />
        </div>

        <div className="space-y-4">
          <svg viewBox="0 0 380 236" className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label={`Reaction vessel: ${remaining} of ${VESSEL_COUNT} molecules are still A`}>
            {VESSEL.map((m, i) => {
              const isA = m.rank < remaining;
              return <circle key={i} cx={m.x} cy={m.y} r={11} fill={isA ? '#3b82f6' : '#d1fae5'} stroke={isA ? '#1e3a8a' : '#10b981'} strokeWidth={1.5} />;
            })}
          </svg>
          <p className="text-xs text-ink-muted">Vessel: blue = A ({remaining} of {VESSEL_COUNT}), green = product</p>
          <Panel title={`At t = ${fixed(t, 1)} s`}>
            <dl className="space-y-1">
              <Stat label="[A]" value={`${sci(a, 3)} M`} />
              <Stat label="Fraction left" value={`${fixed((100 * a) / a0, 1)}%`} />
              <Stat label="Rate = k[A]ⁿ" value={`${sci(rate(order, k, a), 3)} M/s`} />
              <Stat label="Current half-life" value={a > 0 ? `${sci(halfLife(order, k, a), 3)} s` : '–'} />
              <Stat label="First half-life" value={`${sci(halfLife(order, k, a0), 3)} s`} />
            </dl>
          </Panel>
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-ink">Linearised plots: only one is a straight line</p>
        <p className="mb-3 text-sm text-ink-muted">
          {info.name}: {info.linear} is straight with slope {info.slope}
          {order === 0 && ' (until A runs out)'}. R² = 1 means a perfect straight line.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {TRANSFORMS.map((tr) => {
            const pts: Point[] = linearTimes.map((s) => [s, tr.f(concentration(order, k, a0, s))]);
            const fit = linearFit(pts.filter(([, v]) => Number.isFinite(v)));
            const straight = tr.order === order;
            return (
              <div key={tr.key} className={`rounded-xl border-2 p-2 ${straight ? 'border-emerald-400 bg-emerald-50/50' : 'border-transparent'}`}>
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 text-sm">
                  <span className="font-medium text-ink">{tr.title}</span>
                  <span className="font-mono text-xs text-ink-muted">R² = {fixed(fit.r2, 4)}</span>
                </div>
                <LinePlot
                  width={360}
                  height={260}
                  fontSize={15}
                  x={[0, T_MAX]}
                  y={padRange(pts.map(([, v]) => v))}
                  xLabel="t (s)"
                  yLabel={tr.label}
                  ariaLabel={`${tr.title} plot`}
                  series={[{ points: pts, color: straight ? STRAIGHT : '#94a3b8', width: 3 }]}
                />
                {straight && <p className="mt-1 text-xs font-medium text-emerald-700">Straight line, slope = {tr.order === 2 ? '' : '−'}{sci(k, 3)}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MysteryMode() {
  const [mystery, setMystery] = useState<Mystery>(() => ({ order: 1, k: Math.log(1 / 0.2) / 80, a0: 1, data: Array.from({ length: 8 }, (_, i) => [(80 * i) / 7, Number(Math.exp((-Math.log(5) * i) / 7).toPrecision(3))]) }));
  const [guess, setGuess] = useState<Order | null>(null);

  const next = () => {
    setMystery(makeMystery());
    setGuess(null);
  };

  const tEnd = mystery.data[mystery.data.length - 1][0];
  const fits = TRANSFORMS.map((tr) => {
    const pts: Point[] = mystery.data.map(([t, a]) => [t, tr.f(a)]);
    return { tr, pts, fit: linearFit(pts) };
  });
  const answered = guess !== null;
  const correct = guess === mystery.order;
  const straightFit = fits[mystery.order].fit;

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-muted">
        A reaction A → products was followed in the lab. Plot the data three ways and decide which plot is a straight line. That tells you the
        order.
      </p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-subtle text-left text-ink">
              <tr>
                <th className="px-3 py-2 font-semibold">t (s)</th>
                <th className="px-3 py-2 text-right font-semibold">[A] (M)</th>
                <th className="px-3 py-2 text-right font-semibold">ln[A]</th>
                <th className="px-3 py-2 text-right font-semibold">1/[A]</th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums text-ink">
              {mystery.data.map(([t, a]) => (
                <tr key={t} className="border-t border-line">
                  <td className="px-3 py-1.5">{fixed(t, 1)}</td>
                  <td className="px-3 py-1.5 text-right">{a.toFixed(3)}</td>
                  <td className="px-3 py-1.5 text-right">{Math.log(a).toFixed(3)}</td>
                  <td className="px-3 py-1.5 text-right">{(1 / a).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
          {fits.map(({ tr, pts, fit }) => {
            const line: Point[] = [
              [0, fit.intercept],
              [tEnd, fit.intercept + fit.slope * tEnd],
            ];
            const highlight = answered && tr.order === mystery.order;
            return (
              <div key={tr.key} className={`rounded-xl border-2 p-2 ${highlight ? 'border-emerald-400 bg-emerald-50/50' : 'border-transparent'}`}>
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 text-sm">
                  <span className="font-medium text-ink">{tr.title}</span>
                  {answered && <span className="font-mono text-xs text-ink-muted">R² = {fixed(fit.r2, 4)}</span>}
                </div>
                <LinePlot
                  width={360}
                  height={260}
                  x={[0, tEnd]}
                  y={padRange(pts.map(([, v]) => v))}
                  xLabel="t (s)"
                  yLabel={tr.label}
                  ariaLabel={`${tr.title} plot of the mystery data`}
                  series={[
                    { points: line, color: '#94a3b8', dash: '6 5', width: 2 },
                    { points: pts, color: '#4f46e5', dots: true },
                  ]}
                />
              </div>
            );
          })}
          <div className="space-y-3 rounded-xl border border-line bg-subtle p-4 text-sm">
            <p className="font-semibold text-ink">Which order is it?</p>
            <OrderButtons value={guess} onChange={setGuess} />
            {answered && (
              <div className="space-y-1">
                <p className={`flex items-center gap-1.5 font-semibold ${correct ? 'text-emerald-700' : 'text-red-700'}`}>
                  {correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  {correct ? 'Correct!' : `Not quite: it is ${ORDER_INFO[mystery.order].name.toLowerCase()}.`}
                </p>
                <p className="text-ink-muted">
                  {ORDER_INFO[mystery.order].linear} is straight. Its slope is {sci(straightFit.slope, 3)}, so k ≈ {sci(Math.abs(straightFit.slope), 3)}{' '}
                  {ORDER_INFO[mystery.order].kUnit} (true value {sci(mystery.k, 3)}).
                </p>
              </div>
            )}
            <Button size="sm" variant="secondary" onClick={next} leftIcon={<Shuffle className="h-4 w-4" />}>
              New mystery data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RateLawsVisualizer() {
  const [mode, setMode] = useState<'explore' | 'mystery'>('explore');
  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={mode === 'explore' ? 'primary' : 'outline'} aria-pressed={mode === 'explore'} onClick={() => setMode('explore')}>
          Explore orders
        </Button>
        <Button size="sm" variant={mode === 'mystery' ? 'primary' : 'outline'} aria-pressed={mode === 'mystery'} onClick={() => setMode('mystery')}>
          Mystery data
        </Button>
      </div>
      {mode === 'explore' ? <Explore /> : <MysteryMode />}
    </div>
  );
}
