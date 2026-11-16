export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export type Block = 's' | 'p' | 'd' | 'f';

export interface ChemicalElement {
  z: number;
  symbol: string;
  name: string;
  mass: string;
  period: number;
  group: number | null;
  column: number;
  row: number;
  block: Block;
  category: ElementCategory;
  electronegativity: number | null;
  ionizationEnergy: number | null;
  covalentRadius: number | null;
  electronAffinity: number | null;
}

type Row = [symbol: string, name: string, mass: string, en: number | null, ie: number | null, radius: number | null, ea: number | null];

const RAW: Row[] = [
  ['H', 'Hydrogen', '1.008', 2.2, 1312.0, 31, 72.769],
  ['He', 'Helium', '4.0026', null, 2372.3, 28, null],
  ['Li', 'Lithium', '6.94', 0.98, 520.2, 128, 59.633],
  ['Be', 'Beryllium', '9.0122', 1.57, 899.5, 96, null],
  ['B', 'Boron', '10.81', 2.04, 800.6, 84, 26.989],
  ['C', 'Carbon', '12.011', 2.55, 1086.5, 76, 121.776],
  ['N', 'Nitrogen', '14.007', 3.04, 1402.3, 71, null],
  ['O', 'Oxygen', '15.999', 3.44, 1313.9, 66, 140.976],
  ['F', 'Fluorine', '18.998', 3.98, 1681.0, 57, 328.165],
  ['Ne', 'Neon', '20.180', null, 2080.7, 58, null],
  ['Na', 'Sodium', '22.990', 0.93, 495.8, 166, 52.867],
  ['Mg', 'Magnesium', '24.305', 1.31, 737.7, 141, null],
  ['Al', 'Aluminium', '26.982', 1.61, 577.5, 121, 41.763],
  ['Si', 'Silicon', '28.085', 1.9, 786.5, 111, 134.068],
  ['P', 'Phosphorus', '30.974', 2.19, 1011.8, 107, 72.037],
  ['S', 'Sulfur', '32.06', 2.58, 999.6, 105, 200.41],
  ['Cl', 'Chlorine', '35.45', 3.16, 1251.2, 102, 348.575],
  ['Ar', 'Argon', '39.95', null, 1520.6, 106, null],
  ['K', 'Potassium', '39.098', 0.82, 418.8, 203, 48.383],
  ['Ca', 'Calcium', '40.078', 1.0, 589.8, 176, 2.37],
  ['Sc', 'Scandium', '44.956', 1.36, 633.1, 170, 18.0],
  ['Ti', 'Titanium', '47.867', 1.54, 658.8, 160, 7.289],
  ['V', 'Vanadium', '50.942', 1.63, 650.9, 153, 50.911],
  ['Cr', 'Chromium', '51.996', 1.66, 652.9, 139, 65.21],
  ['Mn', 'Manganese', '54.938', 1.55, 717.3, 139, null],
  ['Fe', 'Iron', '55.845', 1.83, 762.5, 132, 14.785],
  ['Co', 'Cobalt', '58.933', 1.88, 760.4, 126, 63.898],
  ['Ni', 'Nickel', '58.693', 1.91, 737.1, 124, 111.65],
  ['Cu', 'Copper', '63.546', 1.9, 745.5, 132, 119.235],
  ['Zn', 'Zinc', '65.38', 1.65, 906.4, 122, null],
  ['Ga', 'Gallium', '69.723', 1.81, 578.8, 122, 41],
  ['Ge', 'Germanium', '72.630', 2.01, 762.2, 120, 118.935],
  ['As', 'Arsenic', '74.922', 2.18, 947.0, 119, 77.65],
  ['Se', 'Selenium', '78.971', 2.55, 941.0, 120, 194.958],
  ['Br', 'Bromine', '79.904', 2.96, 1139.9, 120, 324.536],
  ['Kr', 'Krypton', '83.798', 3.0, 1350.8, 116, null],
  ['Rb', 'Rubidium', '85.468', 0.82, 403.0, 220, 46.884],
  ['Sr', 'Strontium', '87.62', 0.95, 549.5, 195, 5.023],
  ['Y', 'Yttrium', '88.906', 1.22, 600.0, 190, 29.6],
  ['Zr', 'Zirconium', '91.224', 1.33, 640.1, 175, 41.806],
  ['Nb', 'Niobium', '92.906', 1.6, 652.1, 164, 88.516],
  ['Mo', 'Molybdenum', '95.95', 2.16, 684.3, 154, 72.1],
  ['Tc', 'Technetium', '[97]', 1.9, 702.0, 147, null],
  ['Ru', 'Ruthenium', '101.07', 2.2, 710.2, 146, 100.96],
  ['Rh', 'Rhodium', '102.91', 2.28, 719.7, 142, 110.27],
  ['Pd', 'Palladium', '106.42', 2.2, 804.4, 139, 54.24],
  ['Ag', 'Silver', '107.87', 1.93, 731.0, 145, 125.86],
  ['Cd', 'Cadmium', '112.41', 1.69, 867.8, 144, null],
  ['In', 'Indium', '114.82', 1.78, 558.3, 142, 37.043],
  ['Sn', 'Tin', '118.71', 1.96, 708.6, 139, 107.298],
  ['Sb', 'Antimony', '121.76', 2.05, 834.0, 139, 101.059],
  ['Te', 'Tellurium', '127.60', 2.1, 869.3, 138, 190.161],
  ['I', 'Iodine', '126.90', 2.66, 1008.4, 139, 295.153],
  ['Xe', 'Xenon', '131.29', 2.6, 1170.4, 140, null],
  ['Cs', 'Caesium', '132.91', 0.79, 375.7, 244, 45.505],
  ['Ba', 'Barium', '137.33', 0.89, 502.9, 215, 13.954],
  ['La', 'Lanthanum', '138.91', 1.1, 538.1, 207, 53.79],
  ['Ce', 'Cerium', '140.12', 1.12, 534.4, 204, null],
  ['Pr', 'Praseodymium', '140.91', 1.13, 527.0, 203, null],
  ['Nd', 'Neodymium', '144.24', 1.14, 533.1, 201, null],
  ['Pm', 'Promethium', '[145]', 1.13, 540.0, 199, null],
  ['Sm', 'Samarium', '150.36', 1.17, 544.5, 198, null],
  ['Eu', 'Europium', '151.96', 1.2, 547.1, 198, null],
  ['Gd', 'Gadolinium', '157.25', 1.2, 593.4, 196, null],
  ['Tb', 'Terbium', '158.93', 1.1, 565.8, 194, null],
  ['Dy', 'Dysprosium', '162.50', 1.22, 573.0, 192, null],
  ['Ho', 'Holmium', '164.93', 1.23, 581.0, 192, null],
  ['Er', 'Erbium', '167.26', 1.24, 589.3, 189, null],
  ['Tm', 'Thulium', '168.93', 1.25, 596.7, 190, null],
  ['Yb', 'Ytterbium', '173.05', 1.1, 603.4, 187, null],
  ['Lu', 'Lutetium', '174.97', 1.27, 523.5, 187, 23.04],
  ['Hf', 'Hafnium', '178.49', 1.3, 658.5, 175, 17.18],
  ['Ta', 'Tantalum', '180.95', 1.5, 761.0, 170, 31],
  ['W', 'Tungsten', '183.84', 2.36, 770.0, 162, 78.76],
  ['Re', 'Rhenium', '186.21', 1.9, 760.0, 151, 5.827],
  ['Os', 'Osmium', '190.23', 2.2, 840.0, 144, 103.99],
  ['Ir', 'Iridium', '192.22', 2.2, 880.0, 141, 150.94],
  ['Pt', 'Platinum', '195.08', 2.28, 870.0, 136, 205.041],
  ['Au', 'Gold', '196.97', 2.54, 890.1, 136, 222.747],
  ['Hg', 'Mercury', '200.59', 2.0, 1007.1, 132, null],
  ['Tl', 'Thallium', '204.38', 1.62, 589.4, 145, 36.4],
  ['Pb', 'Lead', '207.2', 2.33, 715.6, 146, 34.418],
  ['Bi', 'Bismuth', '208.98', 2.02, 703.0, 148, 90.924],
  ['Po', 'Polonium', '[209]', 2.0, 812.1, 140, null],
  ['At', 'Astatine', '[210]', 2.2, 899.0, 150, 233.087],
  ['Rn', 'Radon', '[222]', 2.2, 1037.0, 150, null],
  ['Fr', 'Francium', '[223]', 0.79, 393.0, 260, null],
  ['Ra', 'Radium', '[226]', 0.9, 509.3, 221, null],
  ['Ac', 'Actinium', '[227]', 1.1, 499.0, 215, null],
  ['Th', 'Thorium', '232.04', 1.3, 587.0, 206, null],
  ['Pa', 'Protactinium', '231.04', 1.5, 568.0, 200, null],
  ['U', 'Uranium', '238.03', 1.38, 597.6, 196, null],
  ['Np', 'Neptunium', '[237]', 1.36, 604.5, 190, null],
  ['Pu', 'Plutonium', '[244]', 1.28, 584.7, 187, null],
  ['Am', 'Americium', '[243]', 1.13, 578.0, 180, null],
  ['Cm', 'Curium', '[247]', 1.28, 581.0, 169, null],
  ['Bk', 'Berkelium', '[247]', 1.3, 601.0, null, null],
  ['Cf', 'Californium', '[251]', 1.3, 608.0, null, null],
  ['Es', 'Einsteinium', '[252]', 1.3, 619.0, null, null],
  ['Fm', 'Fermium', '[257]', 1.3, 627.0, null, null],
  ['Md', 'Mendelevium', '[258]', 1.3, 635.0, null, null],
  ['No', 'Nobelium', '[259]', 1.3, 642.0, null, null],
  ['Lr', 'Lawrencium', '[266]', null, 478.6, null, null],
  ['Rf', 'Rutherfordium', '[267]', null, null, null, null],
  ['Db', 'Dubnium', '[268]', null, null, null, null],
  ['Sg', 'Seaborgium', '[269]', null, null, null, null],
  ['Bh', 'Bohrium', '[270]', null, null, null, null],
  ['Hs', 'Hassium', '[269]', null, null, null, null],
  ['Mt', 'Meitnerium', '[278]', null, null, null, null],
  ['Ds', 'Darmstadtium', '[281]', null, null, null, null],
  ['Rg', 'Roentgenium', '[282]', null, null, null, null],
  ['Cn', 'Copernicium', '[285]', null, null, null, null],
  ['Nh', 'Nihonium', '[286]', null, null, null, null],
  ['Fl', 'Flerovium', '[289]', null, null, null, null],
  ['Mc', 'Moscovium', '[290]', null, null, null, null],
  ['Lv', 'Livermorium', '[293]', null, null, null, null],
  ['Ts', 'Tennessine', '[294]', null, null, null, null],
  ['Og', 'Oganesson', '[294]', null, null, null, null],
];

const PERIOD_STARTS = [1, 3, 11, 19, 37, 55, 87, 119];

const METALLOIDS = new Set(['B', 'Si', 'Ge', 'As', 'Sb', 'Te']);
const REACTIVE_NONMETALS = new Set(['H', 'C', 'N', 'O', 'P', 'S', 'Se']);
const HALOGENS = new Set(['F', 'Cl', 'Br', 'I', 'At']);
const NOBLE_GASES = new Set(['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn']);

function periodOf(z: number) {
  let p = 1;
  while (z >= PERIOD_STARTS[p]) p++;
  return p;
}

function placement(z: number): { group: number | null; column: number; row: number } {
  const period = periodOf(z);
  const offset = z - PERIOD_STARTS[period - 1];
  if (period === 1) return z === 1 ? { group: 1, column: 1, row: 1 } : { group: 18, column: 18, row: 1 };
  if (period <= 3) {
    const group = offset < 2 ? offset + 1 : offset + 11;
    return { group, column: group, row: period };
  }
  if (period <= 5) return { group: offset + 1, column: offset + 1, row: period };
  if (offset < 2) return { group: offset + 1, column: offset + 1, row: period };
  if (offset < 16) return { group: null, column: offset + 1, row: period + 3 };
  const group = offset - 13;
  return { group, column: group, row: period };
}

function blockOf(group: number | null, z: number): Block {
  if (group === null) return 'f';
  if (z === 2 || group <= 2) return 's';
  if (group >= 13) return 'p';
  return 'd';
}

function categoryOf(symbol: string, z: number, group: number | null): ElementCategory {
  if (z >= 109) return 'unknown';
  if (NOBLE_GASES.has(symbol)) return 'noble-gas';
  if (HALOGENS.has(symbol)) return 'halogen';
  if (METALLOIDS.has(symbol)) return 'metalloid';
  if (REACTIVE_NONMETALS.has(symbol)) return 'reactive-nonmetal';
  if ((z >= 57 && z <= 71)) return 'lanthanide';
  if ((z >= 89 && z <= 103)) return 'actinide';
  if (group === 1) return 'alkali-metal';
  if (group === 2) return 'alkaline-earth-metal';
  if (group !== null && group >= 3 && group <= 12) return 'transition-metal';
  return 'post-transition-metal';
}

export const ELEMENTS: ChemicalElement[] = RAW.map(([symbol, name, mass, en, ie, radius, ea], i) => {
  const z = i + 1;
  const { group, column, row } = placement(z);
  return {
    z,
    symbol,
    name,
    mass,
    period: periodOf(z),
    group,
    column,
    row,
    block: blockOf(group, z),
    category: categoryOf(symbol, z, group),
    electronegativity: en,
    ionizationEnergy: ie,
    covalentRadius: radius,
    electronAffinity: ea,
  };
});

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'alkali-metal': 'Alkali metal',
  'alkaline-earth-metal': 'Alkaline earth metal',
  'transition-metal': 'Transition metal',
  'post-transition-metal': 'Post-transition metal',
  metalloid: 'Metalloid',
  'reactive-nonmetal': 'Reactive nonmetal',
  halogen: 'Halogen',
  'noble-gas': 'Noble gas',
  lanthanide: 'Lanthanide',
  actinide: 'Actinide',
  unknown: 'Unknown properties',
};

export const NOBLE_GAS_NUMBERS = [2, 10, 18, 36, 54, 86, 118];
