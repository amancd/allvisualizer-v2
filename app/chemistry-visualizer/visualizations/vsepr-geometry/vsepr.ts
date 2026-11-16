import { angleBetween, type Vec3 } from '../_chemical-bonding/molecule3d';

const TET_R = Math.sqrt(8 / 9);
const tet = (deg: number): Vec3 => [TET_R * Math.sin((deg * Math.PI) / 180), -1 / 3, TET_R * Math.cos((deg * Math.PI) / 180)];
const eq = (deg: number): Vec3 => [Math.sin((deg * Math.PI) / 180), 0, Math.cos((deg * Math.PI) / 180)];

export const DOMAINS: Record<number, { directions: Vec3[]; lonePairOrder: number[] }> = {
  2: { directions: [[1, 0, 0], [-1, 0, 0]], lonePairOrder: [] },
  3: {
    directions: [[0, 1, 0], [-Math.sqrt(3) / 2, -0.5, 0], [Math.sqrt(3) / 2, -0.5, 0]],
    lonePairOrder: [0],
  },
  4: { directions: [[0, 1, 0], tet(0), tet(120), tet(240)], lonePairOrder: [0, 1] },
  5: { directions: [[0, 1, 0], [0, -1, 0], eq(90), eq(210), eq(330)], lonePairOrder: [3, 4, 2] },
  6: { directions: [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]], lonePairOrder: [0, 1] },
};

export interface Shape {
  axe: string;
  electronGeometry: string;
  molecularGeometry: string;
  idealAngles: string;
  hybridization: string;
  example: string;
}

export const HYBRIDIZATION: Record<number, string> = { 2: 'sp', 3: 'sp²', 4: 'sp³', 5: 'sp³d', 6: 'sp³d²' };

const ELECTRON_GEOMETRY: Record<number, string> = {
  2: 'Linear',
  3: 'Trigonal planar',
  4: 'Tetrahedral',
  5: 'Trigonal bipyramidal',
  6: 'Octahedral',
};

const shape = (bonds: number, lone: number, molecular: string, idealAngles: string, example: string): Shape => ({
  axe: `AX${bonds > 1 ? bonds : ''}${lone > 0 ? `E${lone > 1 ? lone : ''}` : ''}`,
  electronGeometry: ELECTRON_GEOMETRY[bonds + lone],
  molecularGeometry: molecular,
  idealAngles,
  hybridization: HYBRIDIZATION[bonds + lone],
  example,
});

export const SHAPES: Record<string, Shape> = {
  '2-0': shape(2, 0, 'Linear', '180°', 'CO₂'),
  '3-0': shape(3, 0, 'Trigonal planar', '120°', 'BF₃'),
  '2-1': shape(2, 1, 'Bent', '< 120°', 'SO₂'),
  '4-0': shape(4, 0, 'Tetrahedral', '109.5°', 'CH₄'),
  '3-1': shape(3, 1, 'Trigonal pyramidal', '< 109.5°', 'NH₃'),
  '2-2': shape(2, 2, 'Bent', '< 109.5°', 'H₂O'),
  '5-0': shape(5, 0, 'Trigonal bipyramidal', '90°, 120°, 180°', 'PCl₅'),
  '4-1': shape(4, 1, 'Seesaw', '< 90°, < 120°, < 180°', 'SF₄'),
  '3-2': shape(3, 2, 'T-shaped', '< 90°, < 180°', 'ClF₃'),
  '2-3': shape(2, 3, 'Linear', '180°', 'XeF₂'),
  '6-0': shape(6, 0, 'Octahedral', '90°, 180°', 'SF₆'),
  '5-1': shape(5, 1, 'Square pyramidal', '< 90°', 'BrF₅'),
  '4-2': shape(4, 2, 'Square planar', '90°, 180°', 'XeF₄'),
};

export const isValid = (bonds: number, lone: number) => `${bonds}-${lone}` in SHAPES;

export function maxLonePairs(bonds: number) {
  let max = 0;
  for (let l = 0; l <= 3; l++) if (isValid(bonds, l)) max = l;
  return max;
}

export interface Preset {
  formula: string;
  center: string;
  ligand: string;
  bonds: number;
  lone: number;
  realAngles: string;
  note: string;
}

export const PRESETS: Preset[] = [
  { formula: 'CO₂', center: 'C', ligand: 'O', bonds: 2, lone: 0, realAngles: 'O=C=O 180°', note: 'Each C=O double bond counts as one electron domain.' },
  { formula: 'BF₃', center: 'B', ligand: 'F', bonds: 3, lone: 0, realAngles: 'F–B–F 120°', note: 'B has only 6 valence electrons around it and no lone pairs.' },
  { formula: 'SO₂', center: 'S', ligand: 'O', bonds: 2, lone: 1, realAngles: 'O–S–O ≈ 119°', note: 'The lone pair on S squeezes the angle just below 120°.' },
  { formula: 'CH₄', center: 'C', ligand: 'H', bonds: 4, lone: 0, realAngles: 'H–C–H 109.5°', note: 'Four identical bonds give the perfect tetrahedral angle.' },
  { formula: 'NH₃', center: 'N', ligand: 'H', bonds: 3, lone: 1, realAngles: 'H–N–H ≈ 107°', note: 'One lone pair pushes the three N–H bonds closer together.' },
  { formula: 'H₂O', center: 'O', ligand: 'H', bonds: 2, lone: 2, realAngles: 'H–O–H ≈ 104.5°', note: 'Two lone pairs squeeze the angle even more than in NH₃.' },
  { formula: 'PCl₅', center: 'P', ligand: 'Cl', bonds: 5, lone: 0, realAngles: 'Clax–P–Cleq 90°, Cleq–P–Cleq 120°', note: 'Axial and equatorial positions are not equivalent.' },
  { formula: 'SF₄', center: 'S', ligand: 'F', bonds: 4, lone: 1, realAngles: 'Fax–S–Fax ≈ 173°, Feq–S–Feq ≈ 102°', note: 'The lone pair sits in an equatorial position, where it has only two neighbours at 90°.' },
  { formula: 'ClF₃', center: 'Cl', ligand: 'F', bonds: 3, lone: 2, realAngles: 'Fax–Cl–Feq ≈ 87.5°', note: 'Both lone pairs are equatorial, leaving a T shape.' },
  { formula: 'XeF₂', center: 'Xe', ligand: 'F', bonds: 2, lone: 3, realAngles: 'F–Xe–F 180°', note: 'The three lone pairs take all three equatorial positions, leaving the two F atoms on the axis, 180° apart.' },
  { formula: 'SF₆', center: 'S', ligand: 'F', bonds: 6, lone: 0, realAngles: 'F–S–F 90°', note: 'All six positions are equivalent.' },
  { formula: 'BrF₅', center: 'Br', ligand: 'F', bonds: 5, lone: 1, realAngles: 'Fax–Br–Feq ≈ 85°', note: 'The lone pair pushes the four basal F atoms away from it.' },
  { formula: 'XeF₄', center: 'Xe', ligand: 'F', bonds: 4, lone: 2, realAngles: 'F–Xe–F 90°', note: 'The two lone pairs sit opposite each other (180° apart).' },
];

export function domainLayout(bonds: number, lone: number) {
  const { directions, lonePairOrder } = DOMAINS[bonds + lone];
  const lonePairs = lonePairOrder.slice(0, lone);
  const ligands = directions.map((_, i) => i).filter((i) => !lonePairs.includes(i));
  return {
    ligandDirections: ligands.map((i) => directions[i]),
    lonePairDirections: lonePairs.map((i) => directions[i]),
  };
}

export function ligandAngles(directions: Vec3[]) {
  const values = new Set<number>();
  for (let i = 0; i < directions.length; i++) {
    for (let j = i + 1; j < directions.length; j++) {
      values.add(Math.round(angleBetween(directions[i], directions[j]) * 10) / 10);
    }
  }
  return [...values].sort((a, b) => a - b);
}
