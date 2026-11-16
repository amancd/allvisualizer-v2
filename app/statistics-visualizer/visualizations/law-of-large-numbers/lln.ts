export type ExperimentKey = 'coin' | 'biased' | 'die' | 'twoDice';

export const EXPERIMENTS: { key: ExperimentKey; label: string }[] = [
  { key: 'coin', label: 'Fair coin' },
  { key: 'biased', label: 'Biased coin' },
  { key: 'die', label: 'Fair die' },
  { key: 'twoDice', label: 'Two dice' },
];

export interface Config {
  key: ExperimentKey;
  p: number;
  face: number;
}

export const MAX_TRIALS = 50000;
export const RECENT = 30;

export function categories(key: ExperimentKey): string[] {
  if (key === 'coin' || key === 'biased') return ['H', 'T'];
  if (key === 'die') return ['1', '2', '3', '4', '5', '6'];
  return Array.from({ length: 11 }, (_, i) => String(i + 2));
}

export function trueProbs(cfg: Config): number[] {
  if (cfg.key === 'coin') return [0.5, 0.5];
  if (cfg.key === 'biased') return [cfg.p, 1 - cfg.p];
  if (cfg.key === 'die') return Array(6).fill(1 / 6);
  return Array.from({ length: 11 }, (_, i) => (6 - Math.abs(i + 2 - 7)) / 36);
}

export function successCategory(cfg: Config): number {
  if (cfg.key === 'die') return cfg.face - 1;
  if (cfg.key === 'twoDice') return 5;
  return 0;
}

export function eventLabel(cfg: Config): string {
  if (cfg.key === 'die') return `rolling a ${cfg.face}`;
  if (cfg.key === 'twoDice') return 'a sum of 7';
  return 'heads';
}

export function eventProbabilityText(cfg: Config): string {
  if (cfg.key === 'coin') return '1/2';
  if (cfg.key === 'biased') return cfg.p.toFixed(2);
  return cfg.key === 'die' ? '1/6' : '6/36 = 1/6';
}

function sample(cfg: Config): number {
  const r = Math.random();
  if (cfg.key === 'coin') return r < 0.5 ? 0 : 1;
  if (cfg.key === 'biased') return r < cfg.p ? 0 : 1;
  if (cfg.key === 'die') return Math.floor(r * 6);
  return Math.floor(r * 6) + Math.floor(Math.random() * 6);
}

export interface Sim {
  n: number;
  hits: Int32Array[];
  counts: number[];
  recent: number[];
}

export function createSim(cfg: Config, runs: number): Sim {
  return {
    n: 0,
    hits: Array.from({ length: runs }, () => new Int32Array(MAX_TRIALS)),
    counts: Array(categories(cfg.key).length).fill(0),
    recent: [],
  };
}

export function advance(sim: Sim, cfg: Config, trials: number): Sim {
  const target = Math.min(MAX_TRIALS, sim.n + trials);
  const success = successCategory(cfg);
  const counts = [...sim.counts];
  const recent = [...sim.recent];
  for (let i = sim.n; i < target; i++) {
    sim.hits.forEach((run, r) => {
      const cat = sample(cfg);
      run[i] = (i > 0 ? run[i - 1] : 0) + (cat === success ? 1 : 0);
      if (r === 0) {
        counts[cat] += 1;
        recent.push(cat);
      }
    });
  }
  return { ...sim, n: target, counts, recent: recent.slice(-RECENT) };
}

export function autoBatch(n: number): number {
  if (n < 50) return 1;
  if (n < 200) return 3;
  if (n < 1000) return 10;
  if (n < 5000) return 50;
  return 250;
}
