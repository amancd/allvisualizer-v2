export type Element = 'H' | 'B' | 'C' | 'N' | 'O' | 'F' | 'P' | 'S' | 'Cl' | 'Xe';

export const VALENCE: Record<Element, number> = { H: 1, B: 3, C: 4, N: 5, O: 6, F: 7, P: 5, S: 6, Cl: 7, Xe: 8 };

export const ELECTRONEGATIVITY: Record<Element, number> = {
  H: 2.2,
  B: 2.04,
  C: 2.55,
  N: 3.04,
  O: 3.44,
  F: 3.98,
  P: 2.19,
  S: 2.58,
  Cl: 3.16,
  Xe: 2.6,
};

export interface Preset {
  id: string;
  formula: string;
  name: string;
  center: Element;
  terminals: { el: Element; angle: number }[];
  charge: number;
  centerReason: string;
  centerLonePairAngles?: number[];
}

const tf = (els: Element[], angles: number[]) => els.map((el, i) => ({ el, angle: angles[i] }));

export const PRESETS: Preset[] = [
  { id: 'h2o', formula: 'H₂O', name: 'Water', center: 'O', terminals: tf(['H', 'H'], [135, 45]), charge: 0, centerReason: 'H can only form one bond, so it is always an outer atom. O goes in the middle.', centerLonePairAngles: [225, 315] },
  { id: 'nh3', formula: 'NH₃', name: 'Ammonia', center: 'N', terminals: tf(['H', 'H', 'H'], [180, 90, 0]), charge: 0, centerReason: 'H can only form one bond, so N goes in the middle.' },
  { id: 'ch4', formula: 'CH₄', name: 'Methane', center: 'C', terminals: tf(['H', 'H', 'H', 'H'], [270, 0, 90, 180]), charge: 0, centerReason: 'H can only form one bond, so C goes in the middle.' },
  { id: 'co2', formula: 'CO₂', name: 'Carbon dioxide', center: 'C', terminals: tf(['O', 'O'], [180, 0]), charge: 0, centerReason: 'C (2.55) is less electronegative than O (3.44), so C goes in the middle.' },
  { id: 'o2', formula: 'O₂', name: 'Oxygen', center: 'O', terminals: tf(['O'], [0]), charge: 0, centerReason: 'A diatomic molecule has no real center. Start from either atom.' },
  { id: 'n2', formula: 'N₂', name: 'Nitrogen', center: 'N', terminals: tf(['N'], [0]), charge: 0, centerReason: 'A diatomic molecule has no real center. Start from either atom.' },
  { id: 'co', formula: 'CO', name: 'Carbon monoxide', center: 'C', terminals: tf(['O'], [0]), charge: 0, centerReason: 'A diatomic molecule has no real center. Start from C, the less electronegative atom.' },
  { id: 'hcn', formula: 'HCN', name: 'Hydrogen cyanide', center: 'C', terminals: tf(['H', 'N'], [180, 0]), charge: 0, centerReason: 'H is always an outer atom, and C (2.55) is less electronegative than N (3.04), so C goes in the middle.' },
  { id: 'ch2o', formula: 'CH₂O', name: 'Formaldehyde', center: 'C', terminals: tf(['O', 'H', 'H'], [270, 30, 150]), charge: 0, centerReason: 'H is always an outer atom, and C (2.55) is less electronegative than O (3.44).' },
  { id: 'so2', formula: 'SO₂', name: 'Sulfur dioxide', center: 'S', terminals: tf(['O', 'O'], [150, 30]), charge: 0, centerReason: 'S (2.58) is less electronegative than O (3.44), so S goes in the middle.' },
  { id: 'o3', formula: 'O₃', name: 'Ozone', center: 'O', terminals: tf(['O', 'O'], [150, 30]), charge: 0, centerReason: 'All three atoms are O, so any one can be central; the skeleton is O-O-O.' },
  { id: 'no3', formula: 'NO₃⁻', name: 'Nitrate ion', center: 'N', terminals: tf(['O', 'O', 'O'], [270, 30, 150]), charge: -1, centerReason: 'N (3.04) is less electronegative than O (3.44), so N goes in the middle.' },
  { id: 'co3', formula: 'CO₃²⁻', name: 'Carbonate ion', center: 'C', terminals: tf(['O', 'O', 'O'], [270, 30, 150]), charge: -2, centerReason: 'C (2.55) is less electronegative than O (3.44), so C goes in the middle.' },
  { id: 'nh4', formula: 'NH₄⁺', name: 'Ammonium ion', center: 'N', terminals: tf(['H', 'H', 'H', 'H'], [270, 0, 90, 180]), charge: 1, centerReason: 'H can only form one bond, so N goes in the middle.' },
  { id: 'bf3', formula: 'BF₃', name: 'Boron trifluoride', center: 'B', terminals: tf(['F', 'F', 'F'], [270, 30, 150]), charge: 0, centerReason: 'B (2.04) is much less electronegative than F (3.98), so B goes in the middle.' },
  { id: 'pcl5', formula: 'PCl₅', name: 'Phosphorus pentachloride', center: 'P', terminals: tf(['Cl', 'Cl', 'Cl', 'Cl', 'Cl'], [270, 342, 54, 126, 198]), charge: 0, centerReason: 'P (2.19) is less electronegative than Cl (3.16), so P goes in the middle.' },
  { id: 'sf6', formula: 'SF₆', name: 'Sulfur hexafluoride', center: 'S', terminals: tf(['F', 'F', 'F', 'F', 'F', 'F'], [270, 330, 30, 90, 150, 210]), charge: 0, centerReason: 'S (2.58) is less electronegative than F (3.98), so S goes in the middle.' },
  { id: 'xef4', formula: 'XeF₄', name: 'Xenon tetrafluoride', center: 'Xe', terminals: tf(['F', 'F', 'F', 'F'], [45, 135, 225, 315]), charge: 0, centerReason: 'Xe (2.60) is less electronegative than F (3.98), so Xe goes in the middle.', centerLonePairAngles: [270, 90] },
];

export interface Structure {
  bonds: number[];
  lonePairs: number[];
}

export interface Step {
  title: string;
  detail: string;
  structure: Structure;
  remaining: number;
  showBonds: boolean;
  showFormalCharges: boolean;
  highlightCenter: boolean;
}

export interface Solution {
  total: number;
  steps: Step[];
  resonance: Structure[];
}

const MULTIPLE_BOND_PARTNERS: Element[] = ['C', 'N', 'O', 'S'];

export function atomElements(p: Preset): Element[] {
  return [p.center, ...p.terminals.map((t) => t.el)];
}

export function bondSum(s: Structure, atom: number) {
  return atom === 0 ? s.bonds.reduce((a, b) => a + b, 0) : s.bonds[atom - 1];
}

export function electronsAround(s: Structure, atom: number) {
  return 2 * s.lonePairs[atom] + 2 * bondSum(s, atom);
}

export function formalCharge(p: Preset, s: Structure, atom: number) {
  const el = atomElements(p)[atom];
  return VALENCE[el] - 2 * s.lonePairs[atom] - bondSum(s, atom);
}

export function formatCharge(q: number) {
  if (q === 0) return '0';
  return `${q > 0 ? '+' : '−'}${Math.abs(q)}`;
}

const clone = (s: Structure): Structure => ({ bonds: [...s.bonds], lonePairs: [...s.lonePairs] });
const pairs = (n: number) => `${n} lone pair${n === 1 ? '' : 's'}`;

function distinctPermutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  const seen = new Set<string>();
  const out: T[][] = [];
  items.forEach((item, i) => {
    const key = JSON.stringify(item);
    if (seen.has(key)) return;
    seen.add(key);
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const perm of distinctPermutations(rest)) out.push([item, ...perm]);
  });
  return out;
}

function resonanceForms(p: Preset, s: Structure): Structure[] {
  const groups = new Map<Element, number[]>();
  p.terminals.forEach((t, i) => groups.set(t.el, [...(groups.get(t.el) ?? []), i]));
  let forms: Structure[] = [clone(s)];
  for (const indices of groups.values()) {
    const tuples = indices.map((i) => [s.bonds[i], s.lonePairs[i + 1]] as [number, number]);
    const perms = distinctPermutations(tuples);
    const next: Structure[] = [];
    for (const form of forms) {
      for (const perm of perms) {
        const f = clone(form);
        indices.forEach((termIdx, k) => {
          f.bonds[termIdx] = perm[k][0];
          f.lonePairs[termIdx + 1] = perm[k][1];
        });
        next.push(f);
      }
    }
    forms = next;
  }
  return forms;
}

function valenceSummary(p: Preset, total: number) {
  const counts = new Map<Element, number>();
  for (const el of atomElements(p)) counts.set(el, (counts.get(el) ?? 0) + 1);
  const parts = [...counts.entries()].map(([el, n]) => `${el}: ${n} × ${VALENCE[el]} = ${n * VALENCE[el]}`);
  let text = parts.join(', ');
  if (p.charge < 0) text += `; add ${-p.charge} for the ${formatCharge(p.charge)} charge`;
  if (p.charge > 0) text += `; remove ${p.charge} for the ${formatCharge(p.charge)} charge`;
  return `${text}. Total: ${total} valence electrons (${total / 2} pairs) to place.`;
}

export function solve(p: Preset): Solution {
  const els = atomElements(p);
  const n = p.terminals.length;
  const total = els.reduce((sum, el) => sum + VALENCE[el], 0) - p.charge;
  const steps: Step[] = [];
  let s: Structure = { bonds: new Array(n).fill(0), lonePairs: new Array(n + 1).fill(0) };
  let remaining = total;

  steps.push({
    title: 'Count valence electrons',
    detail: valenceSummary(p, total),
    structure: clone(s),
    remaining,
    showBonds: false,
    showFormalCharges: false,
    highlightCenter: false,
  });

  steps.push({
    title: 'Choose the central atom',
    detail: `${p.centerReason} The central atom is usually the least electronegative atom that is not H.`,
    structure: clone(s),
    remaining,
    showBonds: false,
    showFormalCharges: false,
    highlightCenter: true,
  });

  s = clone(s);
  s.bonds = new Array(n).fill(1);
  remaining -= 2 * n;
  steps.push({
    title: 'Connect atoms with single bonds',
    detail: `${n} single bond${n === 1 ? '' : 's'} × 2 electrons = ${2 * n} electrons used. ${remaining} left.`,
    structure: clone(s),
    remaining,
    showBonds: true,
    showFormalCharges: false,
    highlightCenter: false,
  });

  s = clone(s);
  let outerUsed = 0;
  p.terminals.forEach((t, i) => {
    if (t.el === 'H') return;
    const need = Math.max(0, (8 - electronsAround(s, i + 1)) / 2);
    const give = Math.min(need, Math.floor(remaining / 2));
    s.lonePairs[i + 1] += give;
    remaining -= 2 * give;
    outerUsed += 2 * give;
  });
  const allH = p.terminals.every((t) => t.el === 'H');
  steps.push({
    title: 'Complete the octets of the outer atoms',
    detail: allH
      ? 'Every outer atom is H, which needs only 2 electrons (a duet). Each bond already gives it 2, so nothing is added.'
      : `Give each outer atom lone pairs until it has 8 electrons${p.terminals.some((t) => t.el === 'H') ? ' (H only needs 2, which its bond already supplies)' : ''}. That uses ${outerUsed} electrons. ${remaining} left.`,
    structure: clone(s),
    remaining,
    showBonds: true,
    showFormalCharges: false,
    highlightCenter: false,
  });

  s = clone(s);
  const centralPairs = Math.floor(remaining / 2);
  s.lonePairs[0] += centralPairs;
  const leftover = remaining;
  remaining -= 2 * centralPairs;
  const centralCount = electronsAround(s, 0);
  steps.push({
    title: 'Put any leftover electrons on the central atom',
    detail:
      leftover === 0
        ? `No electrons are left. The central ${p.center} has ${centralCount} electrons around it.`
        : `The ${leftover} leftover electrons go on ${p.center} as ${pairs(centralPairs)}. ${p.center} now has ${centralCount} electrons around it${centralCount > 8 ? ', an expanded octet (possible for period 3 and heavier elements)' : ''}.`,
    structure: clone(s),
    remaining,
    showBonds: true,
    showFormalCharges: false,
    highlightCenter: false,
  });

  s = clone(s);
  const before = electronsAround(s, 0);
  let detail: string;
  if (before >= 8) {
    detail = `${p.center} already has ${before} electrons, so no multiple bonds are needed.`;
  } else if (p.center === 'B') {
    detail = `B has only ${before} electrons. Turning an F lone pair into a B=F double bond would put a +1 formal charge on F, the most electronegative element, so the best structure leaves B with an incomplete octet of 6.`;
  } else {
    const moves: string[] = [];
    while (electronsAround(s, 0) < 8) {
      let pick = -1;
      let pickCharge = Infinity;
      p.terminals.forEach((t, i) => {
        if (!MULTIPLE_BOND_PARTNERS.includes(t.el) || s.lonePairs[i + 1] === 0) return;
        const q = formalCharge(p, s, i + 1);
        if (q < pickCharge) {
          pick = i;
          pickCharge = q;
        }
      });
      if (pick < 0) break;
      s.lonePairs[pick + 1] -= 1;
      s.bonds[pick] += 1;
      moves.push(p.terminals[pick].el);
    }
    const kinds = s.bonds.map((b, i) => (b === 2 ? `${p.center}=${p.terminals[i].el}` : b === 3 ? `${p.center}≡${p.terminals[i].el}` : null)).filter(Boolean);
    detail = `${p.center} has only ${before} electrons. Turn ${moves.length === 1 ? 'one outer lone pair into a shared bonding pair' : `${moves.length} outer lone pairs into shared bonding pairs`}, giving ${[...new Set(kinds)].join(' and ')}. ${p.center} now has ${electronsAround(s, 0)} electrons.`;
  }
  steps.push({
    title: 'Form multiple bonds if the central atom is short',
    detail,
    structure: clone(s),
    remaining,
    showBonds: true,
    showFormalCharges: false,
    highlightCenter: false,
  });

  const resonance = resonanceForms(p, s);
  const charges = els.map((_, i) => formalCharge(p, s, i));
  const nonzero = charges.map((q, i) => ({ q, i })).filter((c) => c.q !== 0);
  const sum = charges.reduce((a, b) => a + b, 0);
  const chargeText =
    nonzero.length === 0
      ? 'Every atom has a formal charge of 0, the ideal case.'
      : `Nonzero formal charges: ${nonzero.map((c) => `${els[c.i]}${c.i === 0 ? ' (central)' : ''} ${formatCharge(c.q)}`).join(', ')}.`;
  steps.push({
    title: 'Check formal charges and resonance',
    detail: `${chargeText} They add up to ${formatCharge(sum)}, the overall charge. ${
      resonance.length > 1
        ? `The multiple bond could sit on any of the equivalent outer atoms, so there are ${resonance.length} resonance forms. The real structure is an average of them.`
        : 'There is only one way to draw this structure, so there are no resonance forms.'
    }`,
    structure: clone(s),
    remaining,
    showBonds: true,
    showFormalCharges: true,
    highlightCenter: false,
  });

  return { total, steps, resonance };
}
