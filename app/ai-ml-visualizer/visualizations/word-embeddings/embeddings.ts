/**
 * Hand-crafted, illustrative word vectors.
 *
 * Real embeddings (word2vec, GloVe) have 100 to 300 dimensions learned from
 * billions of words, and their dimensions have no readable meaning. These 16
 * dimensions are designed by hand so the same structure shows up in a form you
 * can inspect: clusters of related words, and consistent offsets (gender,
 * royalty, tense, country to capital) that make analogies work. A small
 * deterministic jitter is added so no two words are perfectly aligned.
 */

export type Group = 'people' | 'animals' | 'places' | 'verbs';

export const dimensionNames = [
  'person',
  'male (+) / female (-)',
  'royalty',
  'young (+) / older (-)',
  'animal',
  'domestic (+) / wild (-)',
  'feline (+) / canine (-)',
  'size',
  'place',
  'country (+) / capital (-)',
  'west (-) / east (+)',
  'south (-) / north (+)',
  'verb',
  'past tense',
  'verb sense A',
  'verb sense B',
];

export const DIMS = dimensionNames.length;

export interface WordVector {
  word: string;
  group: Group;
  vector: number[];
}

type Sparse = Partial<Record<number, number>>;

// Dimension indices, for readability below.
const PERSON = 0, GENDER = 1, ROYAL = 2, YOUNG = 3, ANIMAL = 4, DOMESTIC = 5, FELINE = 6, SIZE = 7;
const PLACE = 8, COUNTRY = 9, EAST = 10, NORTH = 11, VERB = 12, PAST = 13, SENSE_A = 14, SENSE_B = 15;

const person = (gender: number, royal: number, young: number): Sparse => ({ [PERSON]: 1.5, [GENDER]: 0.7 * gender, [ROYAL]: royal, [YOUNG]: young });
const animal = (domestic: number, feline: number, size: number, young = 0): Sparse => ({ [ANIMAL]: 1.5, [DOMESTIC]: domestic, [FELINE]: feline, [SIZE]: size, [YOUNG]: young });
const country = (east: number, north: number): Sparse => ({ [PLACE]: 1.5, [COUNTRY]: 0.8, [EAST]: east, [NORTH]: north });
const capital = (east: number, north: number): Sparse => ({ [PLACE]: 1.5, [COUNTRY]: -0.8, [EAST]: east, [NORTH]: north });
/** Each verb has an "identity" direction (angle in the sense plane) plus an optional past-tense offset. */
const verb = (angleDeg: number, past: boolean): Sparse => {
  const a = (angleDeg * Math.PI) / 180;
  return { [VERB]: 1.5, [PAST]: past ? 1.5 : 0, [SENSE_A]: Math.cos(a), [SENSE_B]: Math.sin(a) };
};

const raw: [string, Group, Sparse][] = [
  ['king', 'people', person(1, 1, -0.3)],
  ['queen', 'people', person(-1, 1, -0.3)],
  ['prince', 'people', person(1, 1, 0.8)],
  ['princess', 'people', person(-1, 1, 0.8)],
  ['man', 'people', person(1, 0, 0)],
  ['woman', 'people', person(-1, 0, 0)],
  ['boy', 'people', person(1, 0, 1)],
  ['girl', 'people', person(-1, 0, 1)],
  ['father', 'people', person(1, 0, -0.8)],
  ['mother', 'people', person(-1, 0, -0.8)],

  ['cat', 'animals', animal(1, 1, -0.5)],
  ['kitten', 'animals', animal(1, 1, -0.9, 1)],
  ['dog', 'animals', animal(1, -1, 0)],
  ['puppy', 'animals', animal(1, -1, -0.5, 1)],
  ['lion', 'animals', animal(-1, 1, 0.8)],
  ['tiger', 'animals', animal(-1, 1, 0.9)],
  ['wolf', 'animals', animal(-1, -1, 0.3)],
  ['fox', 'animals', animal(-0.7, -0.8, -0.3)],
  ['horse', 'animals', animal(0.6, 0, 1.2)],
  ['cow', 'animals', animal(0.6, 0, 1.1)],
  ['elephant', 'animals', animal(-1, 0, 1.7)],

  ['france', 'places', country(-0.5, 0.5)],
  ['paris', 'places', capital(-0.5, 0.5)],
  ['germany', 'places', country(-0.1, 1)],
  ['berlin', 'places', capital(-0.1, 1)],
  ['italy', 'places', country(0, -0.4)],
  ['rome', 'places', capital(0, -0.4)],
  ['spain', 'places', country(-1, -0.3)],
  ['madrid', 'places', capital(-1, -0.3)],
  ['japan', 'places', country(1.2, -0.2)],
  ['tokyo', 'places', capital(1.2, -0.2)],
  ['china', 'places', country(0.9, 0.6)],
  ['beijing', 'places', capital(0.9, 0.6)],

  ['walk', 'verbs', verb(0, false)],
  ['walked', 'verbs', verb(0, true)],
  ['run', 'verbs', verb(60, false)],
  ['ran', 'verbs', verb(60, true)],
  ['swim', 'verbs', verb(120, false)],
  ['swam', 'verbs', verb(120, true)],
  ['go', 'verbs', verb(180, false)],
  ['went', 'verbs', verb(180, true)],
  ['eat', 'verbs', verb(240, false)],
  ['ate', 'verbs', verb(240, true)],
  ['see', 'verbs', verb(300, false)],
  ['saw', 'verbs', verb(300, true)],
];

/** mulberry32: tiny seeded PRNG so the jitter is identical on server and client. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(2024);
const JITTER = 0.08;

export const words: WordVector[] = raw.map(([word, group, sparse]) => ({
  word,
  group,
  vector: Array.from({ length: DIMS }, (_, d) => Math.round(((sparse[d] ?? 0) + (rand() * 2 - 1) * JITTER) * 1000) / 1000),
}));

export const groupLabels: Record<Group, string> = {
  people: 'People and royalty',
  animals: 'Animals',
  places: 'Countries and capitals',
  verbs: 'Verbs and tenses',
};

export const analogyPresets: { a: string; b: string; c: string; label: string }[] = [
  { label: 'king − man + woman', a: 'king', b: 'man', c: 'woman' },
  { label: 'paris − france + italy', a: 'paris', b: 'france', c: 'italy' },
  { label: 'walked − walk + swim', a: 'walked', b: 'walk', c: 'swim' },
  { label: 'kitten − cat + dog', a: 'kitten', b: 'cat', c: 'dog' },
  { label: 'prince − boy + girl', a: 'prince', b: 'boy', c: 'girl' },
  { label: 'tokyo − japan + china', a: 'tokyo', b: 'japan', c: 'china' },
];
