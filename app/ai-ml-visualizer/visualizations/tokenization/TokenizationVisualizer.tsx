'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw, SkipForward, StepForward } from 'lucide-react';
import { Button, Textarea, fieldStyles } from '@/components/ui';
import { SPACE_MARK, buildVocab, countPairs, encodeWord, preTokenize, trainBPE } from './bpe';
import { corpusPresets } from './corpora';

const MAX_MERGES = 300;

/** Literal class strings so Tailwind keeps them. Token colour = id mod palette length. */
const palette = [
  'bg-sky-100 text-sky-900 ring-sky-200',
  'bg-amber-100 text-amber-900 ring-amber-200',
  'bg-emerald-100 text-emerald-900 ring-emerald-200',
  'bg-rose-100 text-rose-900 ring-rose-200',
  'bg-violet-100 text-violet-900 ring-violet-200',
  'bg-lime-100 text-lime-900 ring-lime-200',
  'bg-orange-100 text-orange-900 ring-orange-200',
  'bg-cyan-100 text-cyan-900 ring-cyan-200',
  'bg-fuchsia-100 text-fuchsia-900 ring-fuchsia-200',
  'bg-teal-100 text-teal-900 ring-teal-200',
];

function TokenChip({ token, id, showId = false, highlight = false }: { token: string; id: number | undefined; showId?: boolean; highlight?: boolean }) {
  const colour = id === undefined ? 'bg-red-100 text-red-900 ring-red-300' : palette[id % palette.length];
  return (
    <span
      title={id === undefined ? 'Unknown character' : `id ${id}`}
      className={`inline-flex flex-col items-center rounded px-1 py-0.5 font-mono text-sm ring-1 ring-inset ${colour} ${
        highlight ? 'outline-2 outline-offset-1 outline-brand-500' : ''
      }`}
    >
      <span className="whitespace-pre">
        {token.startsWith(SPACE_MARK) ? (
          <>
            <span className="opacity-40">{SPACE_MARK}</span>
            {token.slice(SPACE_MARK.length)}
          </>
        ) : (
          token
        )}
      </span>
      {showId && <span className="text-[10px] leading-none opacity-70">{id === undefined ? 'UNK' : id}</span>}
    </span>
  );
}

function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-lg border border-line bg-subtle px-3 py-2">
      <div className="text-xs text-ink-muted">{label}</div>
      <div className="font-mono text-lg font-semibold text-ink">{value}</div>
      {hint && <div className="text-[11px] text-ink-faint">{hint}</div>}
    </div>
  );
}

export default function TokenizationVisualizer() {
  const [corpus, setCorpus] = useState(corpusPresets[0].text);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [input, setInput] = useState(corpusPresets[0].sample);

  const training = useMemo(() => trainBPE(corpus, MAX_MERGES), [corpus]);
  const total = training.merges.length;
  const n = Math.min(step, total);
  const isPlaying = playing && n < total;

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => setStep((s) => s + 1), 450);
    return () => clearInterval(id);
  }, [isPlaying]);

  const segmentation = training.snapshots[n];
  const pairs = useMemo(() => countPairs(segmentation, training.types), [segmentation, training.types]);
  const vocab = useMemo(() => buildVocab(training.baseVocab, training.merges, n), [training, n]);
  const nextMerge = training.merges[n];
  const lastMerge = n > 0 ? training.merges[n - 1] : undefined;

  const segByWord = useMemo(() => {
    const map = new Map<string, string[]>();
    training.types.forEach((t, i) => map.set(t.word, segmentation[i]));
    return map;
  }, [training.types, segmentation]);

  const corpusTokens = training.sequence.reduce((sum, w) => sum + (segByWord.get(w)?.length ?? 0), 0);

  const encoded = useMemo(() => {
    const pieces = preTokenize(input);
    return pieces.flatMap((w) => encodeWord(w, training.merges, n));
  }, [input, training.merges, n]);
  const charCount = Array.from(input).length;
  const wordCount = preTokenize(input).length;
  const unknown = encoded.filter((t) => !vocab.has(t)).length;

  const changeCorpus = (text: string) => {
    setCorpus(text);
    setStep(0);
    setPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Corpus + controls */}
      <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-ink">1. Training corpus</h3>
          <div className="flex flex-wrap gap-2">
            {corpusPresets.map((p) => (
              <Button
                key={p.label}
                size="sm"
                variant={corpus === p.text ? 'secondary' : 'outline'}
                onClick={() => {
                  changeCorpus(p.text);
                  setInput(p.sample);
                }}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>
        <Textarea
          aria-label="Training corpus"
          rows={4}
          value={corpus}
          onChange={(e) => changeCorpus(e.target.value)}
          className="font-mono"
        />
        <p className="mt-2 text-xs text-ink-muted">
          {training.sequence.length} pre-tokens, {training.types.length} distinct words, {training.baseVocab.length} distinct
          characters. <span className="font-mono">{SPACE_MARK}</span> marks a word that follows a space.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" leftIcon={<StepForward className="h-4 w-4" />} onClick={() => setStep(n + 1)} disabled={n >= total}>
            Step
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            onClick={() => setPlaying(!isPlaying)}
            disabled={n >= total}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button size="sm" variant="outline" leftIcon={<SkipForward className="h-4 w-4" />} onClick={() => setStep(total)} disabled={n >= total}>
            All merges
          </Button>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<RotateCcw className="h-4 w-4" />}
            onClick={() => {
              setStep(0);
              setPlaying(false);
            }}
          >
            Reset
          </Button>
          <label className="flex min-w-0 flex-1 basis-56 items-center gap-2 text-sm text-ink-muted">
            <span className="shrink-0">Merges</span>
            <input
              type="range"
              min={0}
              max={total}
              value={n}
              onChange={(e) => {
                setStep(Number(e.target.value));
                setPlaying(false);
              }}
              className="min-w-0 flex-1 accent-brand-600"
            />
            <span className="w-16 shrink-0 text-right font-mono text-ink">
              {n}/{total}
            </span>
          </label>
        </div>
      </div>

      {/* Pair counts and merges */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
          <h3 className="text-lg font-semibold text-ink">2. Pair counts</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Every adjacent pair of symbols, counted across the corpus (weighted by word frequency). The top pair is merged next.
          </p>
          {nextMerge ? (
            <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-900 ring-1 ring-inset ring-brand-100">
              Next merge <span className="font-semibold">#{n + 1}</span>:{' '}
              <span className="font-mono">
                {nextMerge.left} + {nextMerge.right} → {nextMerge.token}
              </span>{' '}
              ({nextMerge.count} times)
            </p>
          ) : (
            <p className="mt-3 rounded-lg bg-subtle px-3 py-2 text-sm text-ink-muted ring-1 ring-inset ring-line">
              Training finished: no pair occurs twice any more{total >= MAX_MERGES ? ' (or the merge cap was reached)' : ''}.
            </p>
          )}
          <div className="mt-3 max-h-80 overflow-auto rounded-lg border border-line">
            <table className="w-full text-sm">
              <thead className="sticky top-0 border-b border-line bg-subtle text-left text-ink">
                <tr>
                  <th className="px-3 py-2 font-semibold">Pair</th>
                  <th className="px-3 py-2 font-semibold">Merged</th>
                  <th className="px-3 py-2 text-right font-semibold">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pairs.slice(0, 12).map((p, i) => (
                  <tr key={p.left + '\u0000' + p.right} className={i === 0 && nextMerge ? 'bg-brand-50/70' : ''}>
                    <td className="px-3 py-1.5 font-mono whitespace-pre">
                      {p.left} + {p.right}
                    </td>
                    <td className="px-3 py-1.5 font-mono whitespace-pre">{p.left + p.right}</td>
                    <td className="px-3 py-1.5 text-right font-mono tabular-nums">{p.count}</td>
                  </tr>
                ))}
                {pairs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-ink-muted">
                      No pairs left: every word is a single token.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
          <h3 className="text-lg font-semibold text-ink">3. Vocabulary</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Stat label="Vocabulary size" value={vocab.size} hint={`${training.baseVocab.length} chars + ${vocab.size - training.baseVocab.length} merged`} />
            <Stat label="Corpus tokens" value={corpusTokens} />
            <Stat label="Chars per token" value={(corpusTokens ? Array.from(corpus).length / corpusTokens : 0).toFixed(2)} />
          </div>
          <p className="mt-4 text-sm font-medium text-ink">Base characters</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {training.baseVocab.map((ch) => (
              <TokenChip key={ch} token={ch} id={vocab.get(ch)} />
            ))}
          </div>
          <p className="mt-4 text-sm font-medium text-ink">Learned merges, in order</p>
          {n === 0 ? (
            <p className="mt-2 text-sm text-ink-muted">None yet. Press Step to learn the first merge.</p>
          ) : (
            <ol className="mt-2 flex max-h-48 flex-wrap gap-1 overflow-auto">
              {training.merges.slice(0, n).map((m, i) => (
                <li key={i} className="flex items-center gap-1 text-xs text-ink-muted">
                  <span className="font-mono">{i + 1}.</span>
                  <TokenChip token={m.token} id={vocab.get(m.token)} highlight={i === n - 1} />
                </li>
              ))}
            </ol>
          )}
          {lastMerge && (
            <p className="mt-3 text-xs text-ink-muted">
              Last merge: <span className="font-mono">{lastMerge.left} + {lastMerge.right} → {lastMerge.token}</span>
            </p>
          )}
        </div>
      </div>

      {/* Segmented corpus */}
      <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
        <h3 className="text-lg font-semibold text-ink">4. Corpus after {n} merges</h3>
        <p className="mt-1 text-sm text-ink-muted">Each coloured box is one token; colour follows the token id.</p>
        <div className="mt-3 flex max-h-72 flex-wrap gap-x-2 gap-y-1.5 overflow-auto rounded-lg border border-line bg-subtle p-3">
          {training.sequence.map((w, i) => (
            <span key={i} className="inline-flex flex-wrap gap-px">
              {(segByWord.get(w) ?? []).map((t, j) => (
                <TokenChip key={j} token={t} id={vocab.get(t)} highlight={lastMerge?.token === t} />
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Encode */}
      <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
        <h3 className="text-lg font-semibold text-ink">5. Encode new text</h3>
        <p className="mt-1 text-sm text-ink-muted">
          Uses the first {n} merges, applied in the order they were learned. Words never seen in training still split into
          known pieces; characters that never appeared become <span className="font-mono">UNK</span>.
        </p>
        <input
          aria-label="Text to encode"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`${fieldStyles} mt-3 h-11 font-mono`}
        />
        <div className="mt-3 flex flex-wrap gap-1">
          {encoded.map((t, i) => (
            <TokenChip key={i} token={t} id={vocab.get(t)} showId />
          ))}
        </div>
        <p className="mt-3 break-all font-mono text-xs text-ink-muted">
          ids: [{encoded.map((t) => vocab.get(t) ?? 'UNK').join(', ')}]
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Stat label="Character-level" value={charCount} hint="one token per character" />
          <Stat label={`BPE (${n} merges)`} value={encoded.length} hint={unknown ? `${unknown} unknown` : `vocab of ${vocab.size}`} />
          <Stat label="Word-level" value={wordCount} hint="one token per word or mark" />
        </div>
      </div>
    </div>
  );
}
