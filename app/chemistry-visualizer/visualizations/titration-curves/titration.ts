import { speciate } from '../_equilibrium/acidBase';

export type Mode = 'sa-sb' | 'wa-sb' | 'wb-sa';

export interface Setup {
  mode: Mode;
  ca: number;
  va: number;
  ct: number;
  pk: number;
}

export interface Indicator {
  id: string;
  name: string;
  low: number;
  high: number;
  acidColor: [number, number, number, number];
  baseColor: [number, number, number, number];
  acidName: string;
  baseName: string;
}

export const INDICATORS: Indicator[] = [
  { id: 'phenolphthalein', name: 'Phenolphthalein', low: 8.2, high: 10.0, acidColor: [224, 242, 254, 0.35], baseColor: [236, 72, 153, 0.75], acidName: 'colourless', baseName: 'pink' },
  { id: 'bromothymol', name: 'Bromothymol blue', low: 6.0, high: 7.6, acidColor: [234, 179, 8, 0.7], baseColor: [37, 99, 235, 0.75], acidName: 'yellow', baseName: 'blue' },
  { id: 'methyl-orange', name: 'Methyl orange', low: 3.1, high: 4.4, acidColor: [220, 38, 38, 0.75], baseColor: [250, 204, 21, 0.75], acidName: 'red', baseName: 'yellow' },
];

export function equivalenceVolume(s: Setup): number {
  return (s.ca * s.va) / s.ct;
}

export function phAt(s: Setup, vt: number): number {
  const total = s.va + vt;
  const analyte = (s.ca * s.va) / total;
  const titrant = (s.ct * vt) / total;
  const k = 10 ** -s.pk;
  if (s.mode === 'sa-sb') return speciate({ strongAcid: analyte, strongBase: titrant }).pH;
  if (s.mode === 'wa-sb') return speciate({ weakAcid: analyte, ka: k, strongBase: titrant }).pH;
  return speciate({ weakBase: analyte, kb: k, strongAcid: titrant }).pH;
}

export function indicatorColor(ind: Indicator, pH: number): string {
  const f = Math.max(0, Math.min(1, (pH - ind.low) / (ind.high - ind.low)));
  const c = ind.acidColor.map((v, i) => v + (ind.baseColor[i] - v) * f);
  return `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${c[3].toFixed(2)})`;
}

export function volumeAtPh(s: Setup, target: number, vMax: number): number | null {
  const rising = s.mode !== 'wb-sa';
  const f = (v: number) => (phAt(s, v) - target) * (rising ? 1 : -1);
  if (f(0) > 0 || f(vMax) < 0) return null;
  let lo = 0;
  let hi = vMax;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) < 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
