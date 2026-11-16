import { add, length, pyramidal, scale, type Vec3 } from '../_chemical-bonding/molecule3d';

export interface ElementInfo {
  symbol: string;
  name: string;
  en: number;
  metal: boolean;
}

export const ELEMENTS: ElementInfo[] = [
  { symbol: 'H', name: 'Hydrogen', en: 2.2, metal: false },
  { symbol: 'Li', name: 'Lithium', en: 0.98, metal: true },
  { symbol: 'Be', name: 'Beryllium', en: 1.57, metal: true },
  { symbol: 'B', name: 'Boron', en: 2.04, metal: false },
  { symbol: 'C', name: 'Carbon', en: 2.55, metal: false },
  { symbol: 'N', name: 'Nitrogen', en: 3.04, metal: false },
  { symbol: 'O', name: 'Oxygen', en: 3.44, metal: false },
  { symbol: 'F', name: 'Fluorine', en: 3.98, metal: false },
  { symbol: 'Na', name: 'Sodium', en: 0.93, metal: true },
  { symbol: 'Mg', name: 'Magnesium', en: 1.31, metal: true },
  { symbol: 'Al', name: 'Aluminium', en: 1.61, metal: true },
  { symbol: 'Si', name: 'Silicon', en: 1.9, metal: false },
  { symbol: 'P', name: 'Phosphorus', en: 2.19, metal: false },
  { symbol: 'S', name: 'Sulfur', en: 2.58, metal: false },
  { symbol: 'Cl', name: 'Chlorine', en: 3.16, metal: false },
  { symbol: 'K', name: 'Potassium', en: 0.82, metal: true },
  { symbol: 'Ca', name: 'Calcium', en: 1.0, metal: true },
  { symbol: 'Fe', name: 'Iron', en: 1.83, metal: true },
  { symbol: 'Cu', name: 'Copper', en: 1.9, metal: true },
  { symbol: 'Zn', name: 'Zinc', en: 1.65, metal: true },
  { symbol: 'Ge', name: 'Germanium', en: 2.01, metal: false },
  { symbol: 'As', name: 'Arsenic', en: 2.18, metal: false },
  { symbol: 'Se', name: 'Selenium', en: 2.55, metal: false },
  { symbol: 'Br', name: 'Bromine', en: 2.96, metal: false },
  { symbol: 'Rb', name: 'Rubidium', en: 0.82, metal: true },
  { symbol: 'Sr', name: 'Strontium', en: 0.95, metal: true },
  { symbol: 'Ag', name: 'Silver', en: 1.93, metal: true },
  { symbol: 'Sn', name: 'Tin', en: 1.96, metal: true },
  { symbol: 'I', name: 'Iodine', en: 2.66, metal: false },
  { symbol: 'Cs', name: 'Caesium', en: 0.79, metal: true },
  { symbol: 'Ba', name: 'Barium', en: 0.89, metal: true },
];

export const EN: Record<string, number> = Object.fromEntries(ELEMENTS.map((e) => [e.symbol, e.en]));

export const NONPOLAR_LIMIT = 0.4;
export const IONIC_LIMIT = 1.8;
export const EN_SCALE_MAX = 3.3;

export const percentIonic = (delta: number) => 100 * (1 - Math.exp(-(delta * delta) / 4));

export type BondType = 'nonpolar' | 'polar' | 'ionic' | 'metallic';

export function classify(a: ElementInfo, b: ElementInfo): BondType {
  if (a.metal && b.metal) return 'metallic';
  const delta = Math.abs(a.en - b.en);
  if (delta < NONPOLAR_LIMIT) return 'nonpolar';
  if (delta <= IONIC_LIMIT) return 'polar';
  return 'ionic';
}

export const BOND_LABEL: Record<BondType, string> = {
  nonpolar: 'Nonpolar covalent',
  polar: 'Polar covalent',
  ionic: 'Ionic',
  metallic: 'Metallic (two metals)',
};

export const QUICK_PAIRS: [string, string][] = [
  ['H', 'H'],
  ['C', 'H'],
  ['C', 'O'],
  ['H', 'Cl'],
  ['O', 'H'],
  ['H', 'F'],
  ['Al', 'Cl'],
  ['Na', 'Cl'],
  ['Mg', 'O'],
  ['Cs', 'F'],
];

export interface DipoleMolecule {
  formula: string;
  name: string;
  center: string;
  geometry: string;
  ligands: { el: string; dir: Vec3 }[];
  lonePair?: Vec3;
  measured: number;
  note: string;
}

const s3 = Math.sqrt(3) / 2;
const halfWater = (104.5 / 2) * (Math.PI / 180);
const tetDown = pyramidal((Math.acos(-1 / 3) * 180) / Math.PI, 3, true);
const nh3 = pyramidal(106.8, 3, true);

export const MOLECULES: DipoleMolecule[] = [
  {
    formula: 'CO₂',
    name: 'Carbon dioxide',
    center: 'C',
    geometry: 'Linear, 180°',
    ligands: [
      { el: 'O', dir: [1, 0, 0] },
      { el: 'O', dir: [-1, 0, 0] },
    ],
    measured: 0,
    note: 'Two equal C=O dipoles point in exactly opposite directions and cancel.',
  },
  {
    formula: 'H₂O',
    name: 'Water',
    center: 'O',
    geometry: 'Bent, 104.5°',
    ligands: [
      { el: 'H', dir: [Math.sin(halfWater), -Math.cos(halfWater), 0] },
      { el: 'H', dir: [-Math.sin(halfWater), -Math.cos(halfWater), 0] },
    ],
    lonePair: [0, 1, 0],
    measured: 1.85,
    note: 'The bent shape stops the O–H dipoles from cancelling; the two lone pairs on O add to the net dipole too.',
  },
  {
    formula: 'CCl₄',
    name: 'Carbon tetrachloride',
    center: 'C',
    geometry: 'Tetrahedral, 109.5°',
    ligands: [{ el: 'Cl', dir: [0, 1, 0] }, ...tetDown.map((dir) => ({ el: 'Cl', dir }))],
    measured: 0,
    note: 'Four identical C–Cl dipoles at tetrahedral angles add up to exactly zero.',
  },
  {
    formula: 'CHCl₃',
    name: 'Chloroform',
    center: 'C',
    geometry: 'Tetrahedral (approximately)',
    ligands: [{ el: 'H', dir: [0, 1, 0] }, ...tetDown.map((dir) => ({ el: 'Cl', dir }))],
    measured: 1.04,
    note: 'Swapping one Cl for H breaks the symmetry, so the C–Cl dipoles are no longer balanced.',
  },
  {
    formula: 'BF₃',
    name: 'Boron trifluoride',
    center: 'B',
    geometry: 'Trigonal planar, 120°',
    ligands: [
      { el: 'F', dir: [0, 1, 0] },
      { el: 'F', dir: [-s3, -0.5, 0] },
      { el: 'F', dir: [s3, -0.5, 0] },
    ],
    measured: 0,
    note: 'Three B–F dipoles at 120° in a plane cancel, even though each B–F bond is very polar.',
  },
  {
    formula: 'NH₃',
    name: 'Ammonia',
    center: 'N',
    geometry: 'Trigonal pyramidal, 107°',
    ligands: nh3.map((dir) => ({ el: 'H', dir })),
    lonePair: [0, 1, 0],
    measured: 1.47,
    note: 'The pyramid shape leaves a net dipole pointing toward N and its lone pair.',
  },
];

export function bondDipole(center: string, ligand: { el: string; dir: Vec3 }): Vec3 {
  return scale(ligand.dir, EN[ligand.el] - EN[center]);
}

export function netDipole(m: DipoleMolecule) {
  const sum = m.ligands.reduce<Vec3>((acc, l) => add(acc, bondDipole(m.center, l)), [0, 0, 0]);
  const magnitude = length(sum);
  return { vector: magnitude < 1e-6 ? ([0, 0, 0] as Vec3) : sum, magnitude: magnitude < 1e-6 ? 0 : magnitude };
}
