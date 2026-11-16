import {
  Atom, Link2, Scale, Timer, Droplets,
  Microscope, FlaskConical, Pill, Leaf, Gamepad2, LineChart, Calculator,
} from 'lucide-react';
import type { Subject } from './types';

const viz = '/chemistry-visualizer/visualizations';

export const chemistry: Subject = {
  id: 'chemistry',
  title: 'Chemistry',
  shortTitle: 'Chemistry',
  href: '/chemistry-visualizer',
  accent: 'rose',
  intro:
    'Explore atoms, bonds and reactions through interactive visualizations. Fill orbitals, rotate molecules, balance equations and watch reactions reach equilibrium.',
  itemNoun: 'visualizations',
  topics: [
    {
      slug: 'atomic-structure',
      title: 'Atomic Structure',
      icon: Atom,
      summary: 'Electrons, orbitals and the periodic table',
      intro:
        'See how electrons are arranged around the nucleus. Fill orbitals in order, explore the shapes of s, p and d orbitals, and discover why properties repeat across the periodic table.',
      itemBasePath: viz,
      highlights: ['Electron Configuration', 'Orbitals', 'Periodic Trends', 'Quantum Numbers'],
      concepts: [
        { title: 'Quantum Numbers', description: 'Four numbers (n, l, mₗ, mₛ) label every electron in an atom' },
        { title: 'Aufbau Principle', description: 'Electrons fill the lowest-energy orbitals first' },
        { title: 'Orbital Shapes', description: 'Regions where an electron is likely to be found: spheres, dumbbells and cloverleaves' },
        { title: 'Periodicity', description: 'Radius, ionization energy and electronegativity change predictably across the table' },
      ],
      items: [
        { slug: 'electron-configuration', title: 'Electron Configuration', description: 'Fill orbitals electron by electron with the Aufbau principle, Hund\'s rule and the Pauli exclusion principle', difficulty: 'Beginner', tags: ['Aufbau', 'Hund\'s Rule', 'Pauli Exclusion', 'Orbital Diagram'] },
        { slug: 'atomic-orbitals', title: 'Atomic Orbitals', description: 'Explore the shapes and electron probability clouds of s, p and d orbitals', difficulty: 'Intermediate', tags: ['s Orbital', 'p Orbital', 'd Orbital', 'Probability Density', 'Nodes'] },
        { slug: 'periodic-trends', title: 'Periodic Trends', description: 'Colour the periodic table by atomic radius, ionization energy or electronegativity and see the patterns', difficulty: 'Beginner', tags: ['Atomic Radius', 'Ionization Energy', 'Electronegativity', 'Periodic Table'] },
      ],
    },
    {
      slug: 'chemical-bonding',
      title: 'Chemical Bonding',
      icon: Link2,
      summary: 'How atoms share and transfer electrons',
      intro:
        'Discover why atoms bond and what shape the resulting molecules take. Build Lewis structures, predict geometry with VSEPR theory and measure how polar a bond is.',
      itemBasePath: viz,
      highlights: ['Lewis Structures', 'VSEPR', 'Polarity', 'Ionic vs Covalent'],
      concepts: [
        { title: 'Octet Rule', description: 'Main-group atoms tend to gain, lose or share electrons to reach eight valence electrons' },
        { title: 'Electron Domains', description: 'Bonds and lone pairs repel each other and spread out as far as possible' },
        { title: 'Electronegativity', description: 'How strongly an atom pulls shared electrons toward itself' },
        { title: 'Molecular Polarity', description: 'Bond dipoles add as vectors; symmetric molecules can be nonpolar overall' },
      ],
      items: [
        { slug: 'lewis-structures', title: 'Lewis Structures', description: 'Build Lewis dot structures step by step: count valence electrons, place bonds and complete octets', difficulty: 'Beginner', tags: ['Valence Electrons', 'Octet Rule', 'Lone Pairs', 'Formal Charge'] },
        { slug: 'vsepr-geometry', title: 'VSEPR Molecular Geometry', description: 'Rotate 3D molecules and see how bonding pairs and lone pairs set their shape and bond angles', difficulty: 'Intermediate', tags: ['VSEPR', 'Bond Angles', 'Lone Pairs', 'Molecular Shape'] },
        { slug: 'bond-polarity', title: 'Bond Polarity', description: 'Pick two elements and see whether their bond is nonpolar, polar covalent or ionic', difficulty: 'Beginner', tags: ['Electronegativity', 'Dipole', 'Ionic Bond', 'Covalent Bond'] },
      ],
    },
    {
      slug: 'stoichiometry',
      title: 'Stoichiometry',
      icon: Scale,
      summary: 'Moles, balanced equations and reaction yields',
      intro:
        'Count atoms the way chemists do. Balance chemical equations, convert between grams, moles and particles, and find out which reactant runs out first.',
      itemBasePath: viz,
      highlights: ['Balancing Equations', 'The Mole', 'Limiting Reagent', 'Percent Yield'],
      concepts: [
        { title: 'Conservation of Mass', description: 'Atoms are rearranged, never created or destroyed, so both sides must balance' },
        { title: 'The Mole', description: '6.022 × 10²³ particles, the bridge between atoms and grams' },
        { title: 'Mole Ratios', description: 'Coefficients in a balanced equation give the ratio in which substances react' },
        { title: 'Limiting Reagent', description: 'The reactant that runs out first decides how much product forms' },
      ],
      items: [
        { slug: 'balancing-equations', title: 'Balancing Equations', description: 'Adjust coefficients and watch atom counts on each side until the equation balances', difficulty: 'Beginner', tags: ['Coefficients', 'Conservation of Mass', 'Atom Count'] },
        { slug: 'mole-concept', title: 'The Mole Concept', description: 'Convert between mass, moles and number of particles for any compound', difficulty: 'Beginner', tags: ['Avogadro\'s Number', 'Molar Mass', 'Unit Conversion'] },
        { slug: 'limiting-reagent', title: 'Limiting Reagent', description: 'Mix reactant molecules and see which one runs out, how much product forms and what is left over', difficulty: 'Intermediate', tags: ['Limiting Reactant', 'Excess Reactant', 'Theoretical Yield', 'Percent Yield'] },
      ],
    },
    {
      slug: 'kinetics',
      title: 'Reaction Kinetics',
      icon: Timer,
      summary: 'How fast reactions go and why',
      intro:
        'Watch molecules collide and react. See how temperature, concentration and catalysts change the rate, and how rate laws describe concentration over time.',
      itemBasePath: viz,
      highlights: ['Collision Theory', 'Rate Laws', 'Activation Energy', 'Catalysts'],
      concepts: [
        { title: 'Collision Theory', description: 'Molecules must collide with enough energy and the right orientation to react' },
        { title: 'Rate Laws', description: 'Rate = k[A]ᵐ[B]ⁿ links reaction speed to concentration' },
        { title: 'Activation Energy', description: 'The energy barrier that colliding molecules must climb over' },
        { title: 'Catalysts', description: 'Provide a lower-energy path without being used up' },
      ],
      items: [
        { slug: 'collision-theory', title: 'Collision Theory', description: 'Simulate colliding particles and see how temperature and concentration change the reaction rate', difficulty: 'Beginner', tags: ['Collisions', 'Temperature', 'Concentration', 'Maxwell-Boltzmann'] },
        { slug: 'rate-laws', title: 'Rate Laws & Reaction Order', description: 'Compare zero, first and second order reactions with concentration-time graphs and half-lives', difficulty: 'Intermediate', tags: ['Reaction Order', 'Half-Life', 'Integrated Rate Law', 'Rate Constant'] },
        { slug: 'activation-energy', title: 'Activation Energy & Catalysts', description: 'Explore energy profiles, the Arrhenius equation and how a catalyst lowers the barrier', difficulty: 'Advanced', tags: ['Arrhenius Equation', 'Energy Profile', 'Catalyst', 'Transition State'] },
      ],
    },
    {
      slug: 'equilibrium',
      title: 'Equilibrium & Acids',
      icon: Droplets,
      summary: 'Reversible reactions, pH and titrations',
      intro:
        'See reversible reactions settle into balance and shift when disturbed. Explore the pH scale, strong and weak acids, and the shape of titration curves.',
      itemBasePath: viz,
      highlights: ['Le Chatelier', 'Equilibrium Constant', 'pH', 'Titration'],
      concepts: [
        { title: 'Dynamic Equilibrium', description: 'Forward and reverse reactions continue at equal rates, so concentrations stay constant' },
        { title: 'Le Chatelier\'s Principle', description: 'A system at equilibrium shifts to partly undo any change imposed on it' },
        { title: 'pH', description: 'pH = −log[H⁺]; each unit is a tenfold change in acidity' },
        { title: 'Titration', description: 'Add a base of known concentration to find how much acid is present' },
      ],
      items: [
        { slug: 'le-chateliers-principle', title: 'Le Chatelier\'s Principle', description: 'Disturb a reaction at equilibrium by adding reactant, changing volume or heating, and watch it shift', difficulty: 'Intermediate', tags: ['Equilibrium Constant', 'Reaction Quotient', 'Concentration', 'Temperature'] },
        { slug: 'ph-scale', title: 'pH Scale', description: 'Explore pH, pOH and ion concentrations for strong and weak acids and bases', difficulty: 'Beginner', tags: ['pH', 'pOH', 'Strong Acid', 'Weak Acid', 'Ka'] },
        { slug: 'titration-curves', title: 'Titration Curves', description: 'Add titrant drop by drop and trace the pH curve, equivalence point and buffer region', difficulty: 'Advanced', tags: ['Equivalence Point', 'Buffer', 'Indicator', 'Henderson-Hasselbalch'] },
      ],
    },
  ],
  whyLearn: {
    title: 'Why study chemistry?',
    description: 'Chemistry explains what everything around you is made of and how it changes.',
    items: [
      { icon: Microscope, title: 'The central science', description: 'Links physics to biology, medicine, materials and the environment.' },
      { icon: Pill, title: 'Medicine', description: 'Drug design, dosing and diagnostics all rely on chemistry.' },
      { icon: Leaf, title: 'Environment', description: 'Understand air quality, ocean acidity and clean energy.' },
      { icon: FlaskConical, title: 'Everyday life', description: 'Cooking, cleaning and batteries are chemical reactions.' },
    ],
  },
  features: {
    title: 'Learning features',
    description: 'Everything you need to build chemical intuition.',
    items: [
      { icon: Gamepad2, title: 'Hands-on models', description: 'Rotate molecules, fill orbitals and mix reactants yourself.' },
      { icon: LineChart, title: 'Live graphs', description: 'Watch concentration, energy and pH change in real time.' },
      { icon: Calculator, title: 'Worked calculations', description: 'See the numbers behind every result, step by step.' },
    ],
  },
};
