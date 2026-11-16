import { molarMass, parseFormula, type Composition } from '../_stoichiometry/chem';

export interface ReactionSpecies {
  formula: string;
  coef: number;
  comp: Composition;
  M: number;
  color: string;
}

export interface Reaction {
  id: string;
  name: string;
  reactants: ReactionSpecies[];
  products: ReactionSpecies[];
  defaultParticles: number[];
  defaultGrams: number[];
}

const species = (formula: string, coef: number, color: string): ReactionSpecies => {
  const comp = parseFormula(formula);
  return { formula, coef, comp, M: molarMass(comp), color };
};

export const REACTIONS: Reaction[] = [
  {
    id: 'water',
    name: 'Water synthesis',
    reactants: [species('H2', 2, '#0ea5e9'), species('O2', 1, '#ef4444')],
    products: [species('H2O', 2, '#8b5cf6')],
    defaultParticles: [10, 3],
    defaultGrams: [10, 64],
  },
  {
    id: 'ammonia',
    name: 'Haber process',
    reactants: [species('N2', 1, '#2563eb'), species('H2', 3, '#0ea5e9')],
    products: [species('NH3', 2, '#8b5cf6')],
    defaultParticles: [4, 9],
    defaultGrams: [28, 9],
  },
  {
    id: 'methane',
    name: 'Methane combustion',
    reactants: [species('CH4', 1, '#475569'), species('O2', 2, '#ef4444')],
    products: [species('CO2', 1, '#f59e0b'), species('H2O', 2, '#8b5cf6')],
    defaultParticles: [5, 7],
    defaultGrams: [16, 48],
  },
  {
    id: 'alcl3',
    name: 'Aluminium chloride',
    reactants: [species('Al', 2, '#94a3b8'), species('Cl2', 3, '#22c55e')],
    products: [species('AlCl3', 2, '#14b8a6')],
    defaultParticles: [6, 6],
    defaultGrams: [27, 71],
  },
  {
    id: 'nacl',
    name: 'Sodium chloride',
    reactants: [species('Na', 2, '#7c3aed'), species('Cl2', 1, '#22c55e')],
    products: [species('NaCl', 2, '#ec4899')],
    defaultParticles: [7, 5],
    defaultGrams: [23, 50],
  },
];

export interface LimitingResult {
  ratios: number[];
  extent: number;
  limiting: number[];
  used: number[];
  left: number[];
  formed: number[];
}

export function analyse(reaction: Reaction, amounts: number[], integer = false): LimitingResult {
  const ratios = reaction.reactants.map((r, i) => amounts[i] / r.coef);
  const raw = Math.min(...ratios);
  const extent = integer ? Math.floor(raw + 1e-9) : raw;
  const tol = 1e-9 * Math.max(1, raw);
  const limiting = ratios.map((q, i) => (Math.abs(q - raw) <= tol ? i : -1)).filter((i) => i >= 0);
  const used = reaction.reactants.map((r) => r.coef * extent);
  const left = amounts.map((a, i) => Math.max(0, a - used[i]));
  const formed = reaction.products.map((p) => p.coef * extent);
  return { ratios, extent, limiting, used, left, formed };
}
