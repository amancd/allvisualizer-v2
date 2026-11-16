import { ELEMENTS, NOBLE_GAS_NUMBERS, type ChemicalElement } from '../_atomic-structure/elements';

export const L_LETTERS = ['s', 'p', 'd', 'f'] as const;

export interface Subshell {
  n: number;
  l: number;
  label: string;
  capacity: number;
  orbitals: number;
}

export const AUFBAU_ORDER: Subshell[] = (() => {
  const list: Subshell[] = [];
  for (let n = 1; n <= 7; n++) {
    for (let l = 0; l < Math.min(n, 4); l++) {
      list.push({ n, l, label: `${n}${L_LETTERS[l]}`, capacity: 2 * (2 * l + 1), orbitals: 2 * l + 1 });
    }
  }
  return list
    .filter((s) => s.n + s.l <= 8)
    .sort((a, b) => a.n + a.l - (b.n + b.l) || a.n - b.n);
})();

export type Occupancy = Record<string, number>;

export const EXCEPTIONS: Record<number, Occupancy> = {
  24: { '4s': 1, '3d': 5 },
  29: { '4s': 1, '3d': 10 },
  41: { '5s': 1, '4d': 4 },
  42: { '5s': 1, '4d': 5 },
  44: { '5s': 1, '4d': 7 },
  45: { '5s': 1, '4d': 8 },
  46: { '5s': 0, '4d': 10 },
  47: { '5s': 1, '4d': 10 },
  57: { '4f': 0, '5d': 1 },
  58: { '4f': 1, '5d': 1 },
  64: { '4f': 7, '5d': 1 },
  78: { '6s': 1, '5d': 9 },
  79: { '6s': 1, '5d': 10 },
  89: { '5f': 0, '6d': 1 },
  90: { '5f': 0, '6d': 2 },
  91: { '5f': 2, '6d': 1 },
  92: { '5f': 3, '6d': 1 },
  93: { '5f': 4, '6d': 1 },
  96: { '5f': 7, '6d': 1 },
  103: { '6d': 0, '7p': 1 },
};

export const PREDICTED_FROM = 104;

export function madelungOccupancy(electrons: number): Occupancy {
  const occ: Occupancy = {};
  let left = electrons;
  for (const s of AUFBAU_ORDER) {
    if (left <= 0) break;
    const k = Math.min(left, s.capacity);
    occ[s.label] = k;
    left -= k;
  }
  return occ;
}

export function actualOccupancy(z: number): Occupancy {
  const occ = madelungOccupancy(z);
  const override = EXCEPTIONS[z];
  if (override) Object.assign(occ, override);
  return occ;
}

export function occupiedSubshells(occ: Occupancy): { subshell: Subshell; count: number }[] {
  return AUFBAU_ORDER.filter((s) => (occ[s.label] ?? 0) > 0).map((s) => ({ subshell: s, count: occ[s.label] }));
}

export function boxSpins(count: number, orbitals: number): [boolean, boolean][] {
  return Array.from({ length: orbitals }, (_, i) => [i < Math.min(count, orbitals), i < count - orbitals]);
}

export function unpairedIn(count: number, orbitals: number) {
  return count <= orbitals ? count : 2 * orbitals - count;
}

export function totalUnpaired(occ: Occupancy) {
  return occupiedSubshells(occ).reduce((sum, { subshell, count }) => sum + unpairedIn(count, subshell.orbitals), 0);
}

export interface NotationPart {
  label: string;
  count: number;
}

export function notationParts(occ: Occupancy): NotationPart[] {
  return occupiedSubshells(occ).map(({ subshell, count }) => ({ label: subshell.label, count }));
}

export function nobleGasCore(z: number): ChemicalElement | null {
  const core = [...NOBLE_GAS_NUMBERS].reverse().find((g) => g < z);
  return core ? ELEMENTS[core - 1] : null;
}

export function shorthandParts(z: number, occ: Occupancy): { core: ChemicalElement | null; parts: NotationPart[] } {
  const core = nobleGasCore(z);
  if (!core) return { core: null, parts: notationParts(occ) };
  const coreOcc = madelungOccupancy(core.z);
  const parts = AUFBAU_ORDER.map((s) => ({ label: s.label, count: (occ[s.label] ?? 0) - (coreOcc[s.label] ?? 0) })).filter((p) => p.count > 0);
  return { core, parts };
}

export function valenceElectrons(element: ChemicalElement, occ: Occupancy) {
  const parts = occupiedSubshells(occ);
  const nMax = element.period;
  const outer = parts.filter((p) => p.subshell.n === nMax).reduce((s, p) => s + p.count, 0);
  if (element.block === 's' || element.block === 'p') {
    return { count: outer, rule: `electrons in the outer shell (n = ${nMax})` };
  }
  if (element.block === 'd') {
    const d = occ[`${nMax - 1}d`] ?? 0;
    return { count: outer + d, rule: `${nMax}s${nMax === 7 && occ['7p'] ? ' + 7p' : ''} + ${nMax - 1}d electrons` };
  }
  const core = nobleGasCore(element.z);
  return { count: element.z - (core?.z ?? 0), rule: 'electrons outside the noble-gas core' };
}

export function madelungStep(k: number): { label: string; box: number; up: boolean } | null {
  if (k <= 0) return null;
  let before = 0;
  for (const s of AUFBAU_ORDER) {
    if (k <= before + s.capacity) {
      const j = k - before - 1;
      return { label: s.label, box: j < s.orbitals ? j : j - s.orbitals, up: j < s.orbitals };
    }
    before += s.capacity;
  }
  return null;
}

export function formatNotation(parts: NotationPart[]) {
  return parts.map((p) => `${p.label}${toSuperscript(p.count)}`).join(' ');
}

const SUPERSCRIPTS = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

export function toSuperscript(value: number) {
  return String(value)
    .split('')
    .map((d) => SUPERSCRIPTS[Number(d)])
    .join('');
}
