'use client';

import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw, SkipForward, StepForward } from 'lucide-react';
import { Button, Select } from '@/components/ui';

type SieveEvent =
  | { kind: 'select'; p: number }
  | { kind: 'cross'; p: number; m: number }
  | { kind: 'done'; nextPrime: number };

const LIMITS = [50, 100, 150, 200];
const SPEEDS = [
  { label: 'Slow', ms: 700 },
  { label: 'Medium', ms: 300 },
  { label: 'Fast', ms: 90 },
];

/** Colour for each prime that does any crossing out (every prime ≤ √200). */
const PRIME_COLORS: Record<number, { cell: string; chip: string }> = {
  2: { cell: 'bg-sky-100 text-sky-800', chip: 'bg-sky-400' },
  3: { cell: 'bg-amber-100 text-amber-800', chip: 'bg-amber-400' },
  5: { cell: 'bg-emerald-100 text-emerald-800', chip: 'bg-emerald-400' },
  7: { cell: 'bg-violet-100 text-violet-800', chip: 'bg-violet-400' },
  11: { cell: 'bg-rose-100 text-rose-800', chip: 'bg-rose-400' },
  13: { cell: 'bg-teal-100 text-teal-800', chip: 'bg-teal-400' },
};

/** Runs the sieve once and records every action as an event we can replay one at a time. */
function buildEvents(n: number): SieveEvent[] {
  const crossed = new Array<boolean>(n + 1).fill(false);
  const events: SieveEvent[] = [];
  let p = 2;
  for (; p * p <= n; p++) {
    if (crossed[p]) continue;
    events.push({ kind: 'select', p });
    for (let m = p * p; m <= n; m += p) {
      // Numbers already crossed by a smaller prime are still visited, just as in the real algorithm.
      crossed[m] = true;
      events.push({ kind: 'cross', p, m });
    }
  }
  while (p <= n && crossed[p]) p++;
  events.push({ kind: 'done', nextPrime: p });
  return events;
}

interface SieveState {
  /** Smallest prime factor for every number crossed out so far. */
  crossedBy: Map<number, number>;
  current: SieveEvent | null;
  /** Prime currently being processed (null before start). */
  activePrime: number | null;
  done: boolean;
}

/** Replays the first `count` events to get the grid state at that moment. */
function replay(events: SieveEvent[], count: number): SieveState {
  const crossedBy = new Map<number, number>();
  let activePrime: number | null = null;
  let done = false;
  for (let i = 0; i < count; i++) {
    const e = events[i];
    if (e.kind === 'select') activePrime = e.p;
    else if (e.kind === 'cross') {
      // Primes are processed in increasing order, so the first prime to reach m is its smallest prime factor.
      if (!crossedBy.has(e.m)) crossedBy.set(e.m, e.p);
    } else done = true;
  }
  return { crossedBy, current: count > 0 ? events[count - 1] : null, activePrime, done };
}

export default function SieveVisualizer() {
  const [limit, setLimit] = useState(100);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(SPEEDS[1].ms);

  const events = buildEvents(limit);
  const total = events.length;
  const atEnd = step >= total;
  const isPlaying = playing && !atEnd;

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, total)), speed);
    return () => window.clearInterval(id);
  }, [isPlaying, speed, total]);

  const { crossedBy, current, activePrime, done } = replay(events, step);

  // A number left uncrossed is certainly prime once it is below p² for the prime p being processed
  // (any composite below p² has a factor smaller than p and was already crossed), or once the sieve is done.
  const confirmedBelow = done ? Infinity : activePrime ? activePrime * activePrime : 2;
  const isConfirmedPrime = (k: number) => k >= 2 && !crossedBy.has(k) && (k < confirmedBelow || k === activePrime);
  const numbers = Array.from({ length: limit }, (_, i) => i + 1);
  const primeCount = numbers.filter(isConfirmedPrime).length;
  const sievingPrimes = events.flatMap((e) => (e.kind === 'select' ? [e.p] : []));

  const changeLimit = (value: number) => {
    setLimit(value);
    setStep(0);
    setPlaying(false);
  };

  const togglePlay = () => {
    if (atEnd) setStep(0);
    setPlaying(!isPlaying);
  };

  const jumpToNextPrime = () => {
    setPlaying(false);
    const next = events.findIndex((e, i) => i >= step && e.kind !== 'cross');
    setStep(next === -1 ? total : next + 1);
  };

  let message: React.ReactNode = (
    <>
      Press <strong>Play</strong> or <strong>Step</strong>. Start at 2, the first prime.
    </>
  );
  if (current?.kind === 'select') {
    message = (
      <>
        <strong>{current.p}</strong> is not crossed out, so it is prime. Cross out its multiples starting at{' '}
        {current.p}² = {current.p * current.p}; smaller multiples were already removed by smaller primes.
      </>
    );
  } else if (current?.kind === 'cross') {
    const already = crossedBy.get(current.m) !== current.p;
    message = (
      <>
        Crossing out multiples of <strong>{current.p}</strong>: {current.m} = {current.p} × {current.m / current.p}
        {already && <> (already crossed out by {crossedBy.get(current.m)})</>}
      </>
    );
  } else if (current?.kind === 'done') {
    message = (
      <>
        The next prime is {current.nextPrime}, and {current.nextPrime}² = {current.nextPrime * current.nextPrime} &gt; {limit}.
        Every composite up to {limit} has a prime factor ≤ √{limit} ≈ {Math.sqrt(limit).toFixed(2)}, so all remaining
        numbers are prime.
      </>
    );
  }

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-32">
          <Select label="Up to N" value={limit} onChange={(e) => changeLimit(Number(e.target.value))}>
            {LIMITS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-32">
          <Select label="Speed" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
            {SPEEDS.map((s) => (
              <option key={s.label} value={s.ms}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            leftIcon={isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            onClick={togglePlay}
          >
            {isPlaying ? 'Pause' : atEnd ? 'Replay' : 'Play'}
          </Button>
          <Button
            variant="outline"
            leftIcon={<StepForward className="h-4 w-4" />}
            disabled={atEnd}
            onClick={() => {
              setPlaying(false);
              setStep((s) => Math.min(s + 1, total));
            }}
          >
            Step
          </Button>
          <Button variant="outline" leftIcon={<SkipForward className="h-4 w-4" />} disabled={atEnd} onClick={jumpToNextPrime}>
            Next prime
          </Button>
          <Button
            variant="ghost"
            leftIcon={<RotateCcw className="h-4 w-4" />}
            onClick={() => {
              setPlaying(false);
              setStep(0);
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-subtle p-4 text-sm leading-relaxed text-ink" aria-live="polite">
        {message}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="overflow-x-auto">
          <div className="grid min-w-[18rem] grid-cols-10 gap-1">
            {numbers.map((k) => {
              const spf = crossedBy.get(k);
              const isCurrent =
                (current?.kind === 'cross' && current.m === k) || (current?.kind === 'select' && current.p === k);
              let cls = 'bg-white text-ink border border-line';
              if (k === 1) cls = 'bg-subtle text-ink-faint border border-line';
              else if (spf) cls = `${PRIME_COLORS[spf]?.cell ?? 'bg-gray-100 text-gray-600'} line-through decoration-2`;
              else if (k === activePrime) cls = 'bg-brand-600 text-white font-bold';
              else if (isConfirmedPrime(k)) cls = 'bg-brand-100 text-brand-800 font-bold border border-brand-300';
              return (
                <div
                  key={k}
                  className={`flex aspect-square items-center justify-center rounded-md font-mono text-xs tabular-nums transition-colors sm:text-sm ${cls} ${
                    isCurrent ? 'ring-2 ring-ink ring-offset-1' : ''
                  }`}
                  title={spf ? `${k} = ${spf} × ${k / spf}` : undefined}
                >
                  {k}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg border border-line bg-white px-3 py-2">
              <div className="text-xs text-ink-muted">{done ? `π(${limit})` : 'Primes confirmed'}</div>
              <div className="font-mono text-xl font-semibold text-brand-700">{primeCount}</div>
            </div>
            <div className="rounded-lg border border-line bg-white px-3 py-2">
              <div className="text-xs text-ink-muted">Crossed out</div>
              <div className="font-mono text-xl font-semibold text-ink">{crossedBy.size}</div>
            </div>
            <div className="rounded-lg border border-line bg-white px-3 py-2">
              <div className="text-xs text-ink-muted">√N</div>
              <div className="font-mono text-xl font-semibold text-ink">{Math.sqrt(limit).toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-line bg-white px-3 py-2">
              <div className="text-xs text-ink-muted">Step</div>
              <div className="font-mono text-xl font-semibold text-ink">
                {step}/{total}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Smallest prime factor</div>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink">
              {sievingPrimes.map((p) => (
                <li key={p} className="inline-flex items-center gap-1.5">
                  <span className={`h-3 w-3 rounded-sm ${PRIME_COLORS[p]?.chip ?? 'bg-gray-400'}`} />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-brand-600" /> current prime
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm border border-brand-300 bg-brand-100" /> prime
              </span>
            </div>
          </div>

          {done && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-900">
              Found all {primeCount} primes up to {limit} using only {sievingPrimes.length} sieving primes:{' '}
              {sievingPrimes.join(', ')}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
