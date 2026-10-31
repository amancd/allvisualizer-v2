import {
  Settings, Zap, Waves, Flame, Atom, Activity,
  Globe, Lightbulb, Rocket, Sparkles, Gamepad2, LineChart, Calculator,
} from 'lucide-react';
import type { Subject } from './types';

const sims = '/physics-visualizer/simulations';

export const physics: Subject = {
  id: 'physics',
  title: 'Physics',
  shortTitle: 'Physics',
  href: '/physics-visualizer',
  accent: 'emerald',
  intro:
    'Master physics concepts through interactive simulations. Experiment with parameters and see the laws that govern our universe in action.',
  itemNoun: 'simulations',
  topics: [
    {
      slug: 'mechanics',
      title: 'Classical Mechanics',
      icon: Settings,
      summary: 'Motion, forces, energy, and momentum',
      intro:
        "Master the physics of motion and forces. Explore Newton's laws, projectile motion, collisions, and energy conservation through interactive simulations.",
      itemBasePath: sims,
      highlights: ['Projectile Motion', "Newton's Laws", 'Collisions', 'Energy Conservation'],
      concepts: [
        { title: 'Kinematics', description: 'Describe motion with position, velocity, and acceleration' },
        { title: 'Dynamics', description: 'Understand forces and their effects on motion (F = ma)' },
        { title: 'Energy', description: 'Track kinetic and potential energy transformations' },
        { title: 'Momentum', description: 'Analyze collisions and conservation laws' },
      ],
      items: [
        { slug: 'projectile-motion', title: 'Projectile Motion', description: 'Simulate 2D motion under gravity with customizable parameters', difficulty: 'Beginner', tags: ['Kinematics', 'Parabolic Trajectory', 'Range', 'Max Height'] },
        { slug: 'newtons-laws', title: "Newton's Laws", description: 'Explore force, mass, and acceleration relationships', difficulty: 'Beginner', tags: ['F=ma', 'Friction', 'Normal Force', 'Free Body'] },
        { slug: 'elastic-collisions', title: 'Elastic Collisions', description: 'Analyze momentum and energy conservation in collisions', difficulty: 'Intermediate', tags: ['Momentum', 'Energy', '1D Collisions', '2D Collisions'] },
        { slug: 'energy-conservation', title: 'Energy Conservation', description: 'Visualize potential and kinetic energy transformations', difficulty: 'Beginner', tags: ['Kinetic Energy', 'Potential Energy', 'Work', 'Power'] },
      ],
    },
    {
      slug: 'electromagnetism',
      title: 'Electromagnetism',
      icon: Zap,
      summary: 'Electric and magnetic fields and forces',
      intro:
        "Explore electric and magnetic fields. Learn Coulomb's law, Maxwell's equations, circuits, and electromagnetic waves through interactive simulations.",
      itemBasePath: sims,
      highlights: ['Electric Fields', 'Magnetic Fields', 'Circuits', 'EM Waves'],
      concepts: [
        { title: 'Electric Fields', description: 'Understand electric forces and fields from charged particles' },
        { title: 'Magnetic Fields', description: 'Explore magnetic forces from currents and permanent magnets' },
        { title: "Maxwell's Equations", description: 'Master the fundamental equations of electromagnetism' },
        { title: 'EM Waves', description: 'Study propagating electromagnetic waves and radiation' },
      ],
      items: [
        { slug: 'electric-field-lines', title: 'Electric Field Lines', description: 'Visualize electric fields from point charges and charge distributions', difficulty: 'Beginner', tags: ["Coulomb's Law", 'Field Lines', 'Superposition', 'Point Charges'] },
        { slug: 'magnetic-field', title: 'Magnetic Field Visualization', description: 'Explore magnetic fields from currents and magnets', difficulty: 'Intermediate', tags: ['Biot-Savart', 'Magnetic Dipole', 'Current Loops', 'Solenoids'] },
        { slug: 'rc-circuits', title: 'Capacitors & RC Circuits', description: 'Analyze charging and discharging of capacitors', difficulty: 'Intermediate', tags: ['Capacitance', 'Time Constant', 'Exponential Decay', 'Energy Storage'] },
        { slug: 'em-induction', title: 'Electromagnetic Induction', description: "Visualize Faraday's law and induced currents", difficulty: 'Advanced', tags: ["Faraday's Law", "Lenz's Law", 'Induced EMF', 'Transformers'] },
      ],
    },
    {
      slug: 'waves-optics',
      title: 'Waves & Optics',
      icon: Waves,
      summary: 'Wave behavior, interference, and light',
      intro:
        'Explore wave physics and optics. Learn about interference, diffraction, refraction, and the wave nature of light through interactive simulations.',
      itemBasePath: sims,
      highlights: ['Wave Motion', 'Interference', 'Diffraction', 'Refraction'],
      concepts: [
        { title: 'Wave Interference', description: 'Superposition of waves creates constructive and destructive interference patterns.' },
        { title: 'Refraction', description: 'Light bends when passing between media with different refractive indices.' },
        { title: 'Diffraction', description: 'Waves bend around obstacles and spread through openings.' },
        { title: 'Wave-Particle Duality', description: 'Light exhibits both wave and particle properties in quantum mechanics.' },
      ],
      items: [
        { slug: 'wave-interference', title: 'Wave Interference', description: 'Explore constructive and destructive interference patterns from two wave sources', difficulty: 'Beginner', tags: ['Superposition', 'Phase Difference', 'Amplitude', 'Frequency'] },
        { slug: 'double-slit', title: 'Double-Slit Experiment', description: 'Observe the classic interference pattern that demonstrates the wave nature of light', difficulty: 'Intermediate', tags: ['Interference', 'Diffraction', 'Wavelength', 'Path Difference'] },
        { slug: 'reflection-refraction', title: 'Reflection & Refraction', description: 'Understand how light behaves at interfaces between different media', difficulty: 'Beginner', tags: ["Snell's Law", 'Total Internal Reflection', 'Critical Angle', 'Refractive Index'] },
        { slug: 'standing-waves', title: 'Standing Waves', description: 'Visualize standing wave patterns in strings and pipes', difficulty: 'Intermediate', tags: ['Nodes', 'Antinodes', 'Harmonics', 'Resonance'] },
      ],
    },
    {
      slug: 'thermodynamics',
      title: 'Thermodynamics',
      icon: Flame,
      summary: 'Heat, temperature, and energy transfer',
      intro:
        'Explore heat, temperature, and energy transfer. Learn about gas laws, thermodynamic processes, heat engines, and the laws of thermodynamics.',
      itemBasePath: sims,
      highlights: ['Heat Transfer', 'Gas Laws', 'Entropy', 'Engines'],
      concepts: [
        { title: 'Laws of Thermodynamics', description: 'Four fundamental laws governing energy, heat, and entropy in physical systems.' },
        { title: 'Ideal Gas Law', description: 'PV = nRT describes how gases behave under different pressure, volume, and temperature.' },
        { title: 'Heat Transfer', description: 'Energy transfer through conduction, convection, and radiation.' },
        { title: 'Entropy', description: 'A measure of disorder and the irreversibility of natural processes.' },
      ],
      items: [
        { slug: 'ideal-gas-law', title: 'Ideal Gas Law', description: 'Explore the relationship between pressure, volume, and temperature in gases', difficulty: 'Beginner', tags: ['PV=nRT', 'Pressure', 'Volume', 'Temperature'] },
        { slug: 'heat-transfer', title: 'Heat Transfer', description: 'Visualize conduction, convection, and radiation', difficulty: 'Intermediate', tags: ['Conduction', 'Convection', 'Radiation', 'Thermal Energy'] },
        { slug: 'carnot-cycle', title: 'Carnot Cycle', description: 'Understand the most efficient heat engine cycle', difficulty: 'Advanced', tags: ['Heat Engine', 'Efficiency', 'PV Diagram', 'Reversible Process'] },
        { slug: 'entropy', title: 'Entropy & Second Law', description: 'Explore entropy and the direction of thermodynamic processes', difficulty: 'Advanced', tags: ['Entropy', 'Second Law', 'Disorder', 'Irreversibility'] },
      ],
    },
    {
      slug: 'modern-physics',
      title: 'Modern Physics',
      icon: Atom,
      summary: 'Relativity and quantum mechanics',
      intro:
        'Explore the 20th-century discoveries that changed our understanding of space, time, matter, and energy at fundamental scales.',
      itemBasePath: sims,
      highlights: ['Relativity', 'Quantum', 'Atomic', 'Photons'],
      concepts: [
        { title: 'Quantum Mechanics', description: 'Wave-particle duality, quantization, and the uncertainty principle' },
        { title: 'Special Relativity', description: 'Time dilation, length contraction, and mass-energy equivalence' },
        { title: 'Photoelectric Effect', description: 'Photons, work function, and the particle nature of light' },
        { title: 'Atomic Structure', description: 'Bohr model, energy levels, and spectral emission' },
      ],
      items: [
        { slug: 'photoelectric-effect', title: 'Photoelectric Effect', description: 'See how light ejects electrons from metal surfaces, proving the particle nature of light', difficulty: 'Intermediate', tags: ['Quantum Mechanics', 'Photons', 'Work Function'] },
        { slug: 'bohr-model', title: 'Bohr Model', description: 'Visualize electron orbits and energy levels in the hydrogen atom', difficulty: 'Intermediate', tags: ['Atomic Physics', 'Energy Levels', 'Spectral Lines'] },
        { slug: 'time-dilation', title: 'Time Dilation', description: 'Explore how time passes differently for observers in relative motion', difficulty: 'Advanced', tags: ['Special Relativity', 'Lorentz Factor', 'Twin Paradox'] },
        { slug: 'wave-particle-duality', title: 'Wave-Particle Duality', description: 'Demonstrate the dual wave and particle nature of matter and light', difficulty: 'Beginner', tags: ['Quantum Mechanics', 'de Broglie', 'Uncertainty'] },
      ],
    },
    {
      slug: 'oscillations',
      title: 'Oscillations',
      icon: Activity,
      summary: 'Periodic motion and simple harmonic motion',
      intro:
        'Explore motion that repeats. Watch masses on springs and swinging pendulums, then add damping and a driving force to see resonance.',
      itemBasePath: sims,
      highlights: ['SHM', 'Pendulum', 'Springs', 'Resonance'],
      concepts: [
        { title: 'Simple Harmonic Motion', description: 'A restoring force proportional to displacement produces sinusoidal motion' },
        { title: 'Period and Frequency', description: 'How long one cycle takes, and what sets it: mass, stiffness, length and gravity' },
        { title: 'Damping', description: 'Friction drains energy so the amplitude decays over time' },
        { title: 'Resonance', description: 'Driving a system near its natural frequency builds up large amplitudes' },
      ],
      items: [
        { slug: 'simple-harmonic-motion', title: 'Simple Harmonic Motion', description: 'A mass on a spring with live position, velocity and energy graphs', difficulty: 'Beginner', tags: ['Hooke\'s Law', 'Spring Constant', 'Period', 'Energy'] },
        { slug: 'simple-pendulum', title: 'Simple Pendulum', description: 'Swing a pendulum and compare the exact motion with the small-angle approximation', difficulty: 'Beginner', tags: ['Period', 'Gravity', 'Small-Angle Approximation'] },
        { slug: 'damped-driven-oscillations', title: 'Damping & Resonance', description: 'Add damping and a driving force, and trace the resonance curve', difficulty: 'Advanced', tags: ['Damping', 'Driving Force', 'Resonance', 'Q Factor'] },
      ],
    },
  ],
  whyLearn: {
    title: 'Why study physics?',
    description: 'Understand the fundamental laws that govern our universe.',
    items: [
      { icon: Globe, title: 'Universal laws', description: 'The principles that govern everything from atoms to galaxies.' },
      { icon: Lightbulb, title: 'Problem solving', description: 'Build analytical thinking and mathematical modelling skills.' },
      { icon: Rocket, title: 'Technology', description: 'The foundation for engineering, electronics, and computing.' },
      { icon: Sparkles, title: 'Curiosity', description: 'Find out how the universe works at every scale.' },
    ],
  },
  features: {
    title: 'Learning features',
    description: 'Everything you need to master physics concepts.',
    items: [
      { icon: Gamepad2, title: 'Interactive simulations', description: 'Real-time physics engines with adjustable parameters.' },
      { icon: LineChart, title: 'Live graphs', description: 'Plot position, velocity, acceleration, and energy as they change.' },
      { icon: Calculator, title: 'Step-by-step math', description: 'See the equations and calculations behind each simulation.' },
    ],
  },
};
