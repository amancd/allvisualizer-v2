export const AVOGADRO = 6.02214076e23;

export interface ElementInfo {
  name: string;
  mass: number;
  color: string;
  text: string;
}

const dark = '#ffffff';
const light = '#0f172a';

export const ELEMENTS: Record<string, ElementInfo> = {
  H: { name: 'Hydrogen', mass: 1.008, color: '#f1f5f9', text: light },
  He: { name: 'Helium', mass: 4.0026, color: '#a5f3fc', text: light },
  Li: { name: 'Lithium', mass: 6.94, color: '#c084fc', text: light },
  Be: { name: 'Beryllium', mass: 9.0122, color: '#bef264', text: light },
  B: { name: 'Boron', mass: 10.81, color: '#fdba74', text: light },
  C: { name: 'Carbon', mass: 12.011, color: '#334155', text: dark },
  N: { name: 'Nitrogen', mass: 14.007, color: '#2563eb', text: dark },
  O: { name: 'Oxygen', mass: 15.999, color: '#dc2626', text: dark },
  F: { name: 'Fluorine', mass: 18.998, color: '#84cc16', text: light },
  Ne: { name: 'Neon', mass: 20.18, color: '#67e8f9', text: light },
  Na: { name: 'Sodium', mass: 22.99, color: '#7c3aed', text: dark },
  Mg: { name: 'Magnesium', mass: 24.305, color: '#15803d', text: dark },
  Al: { name: 'Aluminium', mass: 26.982, color: '#94a3b8', text: light },
  Si: { name: 'Silicon', mass: 28.085, color: '#d6a77a', text: light },
  P: { name: 'Phosphorus', mass: 30.974, color: '#f97316', text: light },
  S: { name: 'Sulfur', mass: 32.06, color: '#eab308', text: light },
  Cl: { name: 'Chlorine', mass: 35.45, color: '#22c55e', text: light },
  Ar: { name: 'Argon', mass: 39.95, color: '#22d3ee', text: light },
  K: { name: 'Potassium', mass: 39.098, color: '#9333ea', text: dark },
  Ca: { name: 'Calcium', mass: 40.078, color: '#65a30d', text: dark },
  Ti: { name: 'Titanium', mass: 47.867, color: '#9ca3af', text: light },
  Cr: { name: 'Chromium', mass: 51.996, color: '#64748b', text: dark },
  Mn: { name: 'Manganese', mass: 54.938, color: '#a78bfa', text: light },
  Fe: { name: 'Iron', mass: 55.845, color: '#c2410c', text: dark },
  Co: { name: 'Cobalt', mass: 58.933, color: '#db2777', text: dark },
  Ni: { name: 'Nickel', mass: 58.693, color: '#4d7c0f', text: dark },
  Cu: { name: 'Copper', mass: 63.546, color: '#b45309', text: dark },
  Zn: { name: 'Zinc', mass: 65.38, color: '#6b7280', text: dark },
  Br: { name: 'Bromine', mass: 79.904, color: '#9a3412', text: dark },
  Ag: { name: 'Silver', mass: 107.87, color: '#cbd5e1', text: light },
  Sn: { name: 'Tin', mass: 118.71, color: '#78716c', text: dark },
  I: { name: 'Iodine', mass: 126.9, color: '#6b21a8', text: dark },
  Ba: { name: 'Barium', mass: 137.33, color: '#0f766e', text: dark },
  Pt: { name: 'Platinum', mass: 195.08, color: '#a1a1aa', text: light },
  Au: { name: 'Gold', mass: 196.97, color: '#ca8a04', text: light },
  Hg: { name: 'Mercury', mass: 200.59, color: '#94a3b8', text: light },
  Pb: { name: 'Lead', mass: 207.2, color: '#475569', text: dark },
  U: { name: 'Uranium', mass: 238.03, color: '#16a34a', text: dark },
};

export type Composition = Record<string, number>;

const SUBSCRIPT_DIGITS = '₀₁₂₃₄₅₆₇₈₉';

function normalize(formula: string) {
  let out = '';
  for (const ch of formula) {
    const sub = SUBSCRIPT_DIGITS.indexOf(ch);
    out += sub >= 0 ? String(sub) : ch;
  }
  return out.replace(/\s+/g, '');
}

function addInto(target: Composition, source: Composition, times: number) {
  for (const [el, n] of Object.entries(source)) target[el] = (target[el] ?? 0) + n * times;
}

export function parseFormula(raw: string): Composition {
  const formula = normalize(raw);
  if (!formula) throw new Error('Enter a formula');
  const result: Composition = {};
  const parts = formula.split(/[·.*•]/);
  for (const part of parts) {
    if (!part) throw new Error(`"${raw}" has an empty part around a hydrate dot`);
    const lead = /^(\d+)/.exec(part);
    const multiplier = lead ? Number(lead[1]) : 1;
    const body = lead ? part.slice(lead[1].length) : part;
    if (!body) throw new Error(`"${raw}" has a number with no formula after it`);
    if (multiplier === 0) throw new Error('A multiplier of 0 is not allowed');
    let i = 0;
    const readCount = () => {
      const m = /^\d+/.exec(body.slice(i));
      if (!m) return 1;
      i += m[0].length;
      const n = Number(m[0]);
      if (n === 0) throw new Error('A subscript of 0 is not allowed');
      return n;
    };
    const readGroup = (close: string | null): Composition => {
      const comp: Composition = {};
      while (i < body.length) {
        const ch = body[i];
        if (ch === '(' || ch === '[') {
          i += 1;
          const inner = readGroup(ch === '(' ? ')' : ']');
          addInto(comp, inner, readCount());
        } else if (ch === ')' || ch === ']') {
          if (ch !== close) throw new Error(`Unexpected "${ch}" in ${raw}`);
          i += 1;
          return comp;
        } else if (/[A-Z]/.test(ch)) {
          let symbol = ch;
          i += 1;
          if (i < body.length && /[a-z]/.test(body[i])) {
            symbol += body[i];
            i += 1;
          }
          if (!ELEMENTS[symbol]) throw new Error(`Unknown element "${symbol}" (symbols are case-sensitive, e.g. Co vs CO)`);
          comp[symbol] = (comp[symbol] ?? 0) + readCount();
        } else {
          throw new Error(`Unexpected "${ch}" in ${raw}`);
        }
      }
      if (close) throw new Error(`Missing "${close}" in ${raw}`);
      return comp;
    };
    addInto(result, readGroup(null), multiplier);
  }
  if (Object.keys(result).length === 0) throw new Error('No elements found');
  return result;
}

export function molarMass(comp: Composition) {
  return Object.entries(comp).reduce((s, [el, n]) => s + ELEMENTS[el].mass * n, 0);
}

export function atomTotal(comp: Composition) {
  return Object.values(comp).reduce((s, n) => s + n, 0);
}

export interface FormulaSegment {
  text: string;
  sub: boolean;
}

export function formulaSegments(raw: string): FormulaSegment[] {
  const formula = normalize(raw).replace(/[.*•]/g, '·');
  const segs: FormulaSegment[] = [];
  let prevAllowsSub = false;
  for (const ch of formula) {
    const isDigit = /\d/.test(ch);
    const isSub: boolean = isDigit && prevAllowsSub;
    const last = segs[segs.length - 1];
    if (last && last.sub === isSub) last.text += ch;
    else segs.push({ text: ch, sub: isSub });
    if (isDigit) prevAllowsSub = isSub;
    else prevAllowsSub = /[A-Za-z)\]]/.test(ch);
  }
  return segs;
}

export interface Species {
  formula: string;
  comp: Composition;
}

export interface ParsedEquation {
  reactants: Species[];
  products: Species[];
  given: number[];
}

export function parseEquation(raw: string): ParsedEquation {
  const text = raw.replace(/⟶|→|=>|->|=/g, '→');
  const sides = text.split('→');
  if (sides.length !== 2) throw new Error('Write one arrow between reactants and products, e.g. H2 + O2 -> H2O');
  const given: number[] = [];
  const parseSide = (side: string, label: string) => {
    const terms = side.split('+').map((t) => t.trim());
    if (terms.some((t) => !t)) throw new Error(`The ${label} side has an empty term`);
    return terms.map((term) => {
      const m = /^(\d+)\s*(.+)$/.exec(term);
      const coef = m && /^[A-Z([]/.test(m[2]) ? Number(m[1]) : 1;
      const formula = m && /^[A-Z([]/.test(m[2]) ? m[2].trim() : term;
      given.push(coef || 1);
      return { formula: normalize(formula), comp: parseFormula(formula) };
    });
  };
  const reactants = parseSide(sides[0], 'reactant');
  const products = parseSide(sides[1], 'product');
  const left = new Set(reactants.flatMap((s) => Object.keys(s.comp)));
  const right = new Set(products.flatMap((s) => Object.keys(s.comp)));
  for (const el of left) if (!right.has(el)) throw new Error(`${el} appears only on the reactant side, so the equation can never balance`);
  for (const el of right) if (!left.has(el)) throw new Error(`${el} appears only on the product side, so the equation can never balance`);
  return { reactants, products, given };
}

export function elementsOf(species: Species[]) {
  const seen: string[] = [];
  for (const s of species) for (const el of Object.keys(s.comp)) if (!seen.includes(el)) seen.push(el);
  return seen;
}

type Rational = { n: bigint; d: bigint };

const ZERO = BigInt(0);
const ONE = BigInt(1);

function bigAbs(a: bigint) {
  return a < ZERO ? -a : a;
}

function bigGcd(a: bigint, b: bigint): bigint {
  let x = bigAbs(a);
  let y = bigAbs(b);
  while (y !== ZERO) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function rat(n: bigint, d: bigint = ONE): Rational {
  if (d === ZERO) throw new Error('Division by zero');
  if (d < ZERO) {
    n = -n;
    d = -d;
  }
  const g = bigGcd(n, d);
  return g > ONE ? { n: n / g, d: d / g } : { n, d };
}

const ratSub = (a: Rational, b: Rational) => rat(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a: Rational, b: Rational) => rat(a.n * b.n, a.d * b.d);
const div = (a: Rational, b: Rational) => rat(a.n * b.d, a.d * b.n);

export type BalanceResult =
  | { ok: true; coefficients: number[] }
  | { ok: false; reason: string };

export function balance(reactants: Species[], products: Species[]): BalanceResult {
  const species = [...reactants, ...products];
  const elements = elementsOf(species);
  const cols = species.length;
  const m: Rational[][] = elements.map((el) =>
    species.map((s, j) => rat(BigInt((s.comp[el] ?? 0) * (j < reactants.length ? 1 : -1)))),
  );

  const pivots: number[] = [];
  let row = 0;
  for (let col = 0; col < cols && row < m.length; col++) {
    let p = row;
    while (p < m.length && m[p][col].n === ZERO) p++;
    if (p === m.length) continue;
    [m[row], m[p]] = [m[p], m[row]];
    const pv = m[row][col];
    m[row] = m[row].map((v) => div(v, pv));
    for (let r = 0; r < m.length; r++) {
      if (r === row || m[r][col].n === ZERO) continue;
      const f = m[r][col];
      m[r] = m[r].map((v, c) => ratSub(v, mul(f, m[row][c])));
    }
    pivots.push(col);
    row++;
  }

  const free = Array.from({ length: cols }, (_, c) => c).filter((c) => !pivots.includes(c));
  if (free.length === 0) return { ok: false, reason: 'No set of positive coefficients balances this equation. Check the formulas.' };
  if (free.length > 1) {
    return {
      ok: false,
      reason: 'This equation has more than one independent way to balance (it is really two or more reactions added together), so there is no single answer.',
    };
  }

  const f = free[0];
  const x: Rational[] = Array.from({ length: cols }, () => rat(ZERO));
  x[f] = rat(ONE);
  pivots.forEach((pc, r) => {
    x[pc] = rat(-m[r][f].n, m[r][f].d);
  });

  let lcm = ONE;
  for (const v of x) lcm = (lcm * v.d) / bigGcd(lcm, v.d);
  let ints = x.map((v) => (v.n * lcm) / v.d);
  const g = ints.reduce((acc, v) => bigGcd(acc, v), ZERO);
  ints = ints.map((v) => v / g);
  if (ints.every((v) => v <= ZERO)) ints = ints.map((v) => -v);
  if (ints.some((v) => v <= ZERO)) {
    return { ok: false, reason: 'The only solution needs a zero or negative coefficient, so at least one species does not belong in this reaction.' };
  }
  return { ok: true, coefficients: ints.map((v) => Number(v)) };
}

export function gcdList(values: number[]) {
  const g2 = (a: number, b: number): number => (b === 0 ? Math.abs(a) : g2(b, a % b));
  return values.reduce((acc, v) => g2(acc, v), 0);
}

const SUPERSCRIPT: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻',
};

export function sci(x: number, digits = 4) {
  if (!Number.isFinite(x)) return '–';
  if (x === 0) return '0';
  const abs = Math.abs(x);
  if (abs >= 1e-3 && abs < 1e6) {
    const fixed = Number(x.toPrecision(digits));
    return fixed.toLocaleString('en-US', { maximumFractionDigits: 6 });
  }
  const [mant, exp] = x.toExponential(digits - 1).split('e');
  const e = String(Number(exp)).split('').map((c) => SUPERSCRIPT[c] ?? c).join('');
  return `${mant} × 10${e}`;
}

export function parseAmount(raw: string): number {
  const cleaned = raw
    .replace(/\s+/g, '')
    .replace(/[×x]10\^?/i, 'e')
    .replace(/,/g, '');
  if (!/^[+]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(cleaned)) return NaN;
  return Number(cleaned);
}

export function superscript(n: number) {
  return String(n).split('').map((c) => SUPERSCRIPT[c] ?? c).join('');
}
