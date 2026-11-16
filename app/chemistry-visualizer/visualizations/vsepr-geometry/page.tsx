import type { Metadata } from 'next';
import { Box, Magnet, Orbit, Shapes } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import VseprGeometryVisualizer from './VseprGeometryVisualizer';

export const metadata: Metadata = {
  title: 'VSEPR Molecular Geometry - Chemistry Visualizer | AllVisualizer',
  description:
    'Rotate 3D ball-and-stick models and see how bonding pairs and lone pairs set molecular shape: linear, trigonal planar, tetrahedral, trigonal bipyramidal, octahedral and their lone-pair variants, with bond angles and hybridization.',
  keywords: ['VSEPR', 'molecular geometry', 'electron geometry', 'bond angle', 'lone pairs', 'hybridization', 'steric number', 'AXE notation', 'chemistry'],
};

const ideas = [
  {
    title: 'Electron domains',
    icon: Orbit,
    description: 'Every region of electron density around the central atom counts as one domain: a single, double or triple bond, or a lone pair.',
  },
  {
    title: 'Maximum separation',
    icon: Magnet,
    description: 'Domains repel each other, so they spread out as far as possible: 2 → linear, 3 → triangle, 4 → tetrahedron, 5 → trigonal bipyramid, 6 → octahedron.',
  },
  {
    title: 'Shape is set by atoms',
    icon: Shapes,
    description: 'The molecular geometry names only where the atoms are. Lone pairs shape the molecule but are invisible in its name: H₂O is tetrahedral in electrons but bent in shape.',
  },
  {
    title: 'Lone pairs push harder',
    icon: Box,
    description: 'A lone pair is held by one nucleus only, so it spreads out more than a bonding pair. Repulsion order: lone–lone > lone–bond > bond–bond.',
  },
];

const shapes = [
  { axe: 'AX₂', sn: 2, electron: 'Linear', molecular: 'Linear', angles: '180°', hyb: 'sp', example: 'CO₂, BeCl₂' },
  { axe: 'AX₃', sn: 3, electron: 'Trigonal planar', molecular: 'Trigonal planar', angles: '120°', hyb: 'sp²', example: 'BF₃' },
  { axe: 'AX₂E', sn: 3, electron: 'Trigonal planar', molecular: 'Bent', angles: '< 120° (SO₂ ≈ 119°)', hyb: 'sp²', example: 'SO₂, O₃' },
  { axe: 'AX₄', sn: 4, electron: 'Tetrahedral', molecular: 'Tetrahedral', angles: '109.5°', hyb: 'sp³', example: 'CH₄, NH₄⁺' },
  { axe: 'AX₃E', sn: 4, electron: 'Tetrahedral', molecular: 'Trigonal pyramidal', angles: '< 109.5° (NH₃ ≈ 107°)', hyb: 'sp³', example: 'NH₃, PCl₃' },
  { axe: 'AX₂E₂', sn: 4, electron: 'Tetrahedral', molecular: 'Bent', angles: '< 109.5° (H₂O 104.5°)', hyb: 'sp³', example: 'H₂O' },
  { axe: 'AX₅', sn: 5, electron: 'Trigonal bipyramidal', molecular: 'Trigonal bipyramidal', angles: '90°, 120°, 180°', hyb: 'sp³d', example: 'PCl₅' },
  { axe: 'AX₄E', sn: 5, electron: 'Trigonal bipyramidal', molecular: 'Seesaw', angles: '< 90°, < 120°', hyb: 'sp³d', example: 'SF₄' },
  { axe: 'AX₃E₂', sn: 5, electron: 'Trigonal bipyramidal', molecular: 'T-shaped', angles: '< 90°', hyb: 'sp³d', example: 'ClF₃' },
  { axe: 'AX₂E₃', sn: 5, electron: 'Trigonal bipyramidal', molecular: 'Linear', angles: '180°', hyb: 'sp³d', example: 'XeF₂, I₃⁻' },
  { axe: 'AX₆', sn: 6, electron: 'Octahedral', molecular: 'Octahedral', angles: '90°, 180°', hyb: 'sp³d²', example: 'SF₆' },
  { axe: 'AX₅E', sn: 6, electron: 'Octahedral', molecular: 'Square pyramidal', angles: '< 90°', hyb: 'sp³d²', example: 'BrF₅' },
  { axe: 'AX₄E₂', sn: 6, electron: 'Octahedral', molecular: 'Square planar', angles: '90°, 180°', hyb: 'sp³d²', example: 'XeF₄' },
];

export default function VseprGeometryPage() {
  return (
    <DetailPage subject="chemistry" item="vsepr-geometry">
      <VseprGeometryVisualizer />

      <ContentSection title="How VSEPR predicts shape">
        <Prose>
          <p>
            <strong>Valence Shell Electron Pair Repulsion</strong> (VSEPR) theory starts from one idea: groups of electrons around a central atom repel
            each other and settle as far apart as possible. Count the groups (the <strong>steric number</strong>) and you know the arrangement of
            electrons, the <strong>electron geometry</strong>.
          </p>
          <p>
            The <strong>molecular geometry</strong> then describes where the atoms sit. If some domains are lone pairs, the shape is what is left when you
            ignore them. Four domains with one lone pair give a pyramid (NH₃); with two lone pairs, a bent molecule (H₂O).
          </p>
          <p>
            Lone pairs also distort angles. They are fatter than bonding pairs, so they squeeze the bonds together: 109.5° in CH₄ drops to about 107°
            in NH₃ and 104.5° in H₂O. In the five-domain family, lone pairs always choose the roomier equatorial positions, which is why SF₄ is a seesaw,
            ClF₃ is T-shaped and XeF₂ is linear.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Steric number">
            <Formula
              where={[
                { symbol: 'X', meaning: 'atoms bonded to the central atom (a double or triple bond still counts once)' },
                { symbol: 'E', meaning: 'lone pairs on the central atom' },
              ]}
            >
              SN = X + E
            </Formula>
          </Callout>
          <Callout tone="formula" title="Lone pairs on the central atom">
            <Formula
              where={[
                { symbol: 'V', meaning: 'valence electrons of the central atom' },
                { symbol: 'q', meaning: 'charge of the ion (NO₃⁻: E = (5 + 1 − 3 × 2) / 2 = 0)' },
                { symbol: 'n', meaning: 'electrons each bonded atom still needs for its own octet or duet: 1 for H and halogens, 2 for O, 3 for N' },
              ]}
            >
              E = (V − q − Σn) / 2
            </Formula>
          </Callout>
          <Callout tone="formula" title="Hybridization from steric number">
            <Formula>SN 2 → sp,&nbsp; 3 → sp²,&nbsp; 4 → sp³,&nbsp; 5 → sp³d,&nbsp; 6 → sp³d²</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="The VSEPR table">
        <DataTable
          columns={[
            { header: 'AXE', cell: 'axe' },
            { header: 'SN', cell: 'sn', numeric: true },
            { header: 'Electron geometry', cell: 'electron' },
            { header: 'Molecular geometry', cell: 'molecular' },
            { header: 'Bond angles', cell: 'angles' },
            { header: 'Hybridization', cell: 'hyb' },
            { header: 'Examples', cell: 'example' },
          ]}
          rows={shapes}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick a preset molecule, or set the number of bonded atoms (X) and lone pairs (E) yourself. Combinations with more than six domains are disabled.',
            'Drag the model to rotate it. Stop the auto-rotation to look at it from a fixed angle, and use Reset view to return to the start.',
            'Read the side panel: AXE notation, steric number, electron geometry, molecular geometry, bond angles and hybridization.',
            'Compare the ideal angles of the model with the real angles of the preset molecule: CH₄, NH₃ and H₂O show the lone-pair squeeze clearly.',
            'Turn off Show lone pairs to see only the atoms. This is the molecular geometry, the shape that gives the molecule its name.',
            'Step through X = 5, 4, 3, 2 with SN = 5 to watch the lone pairs fill the equatorial positions.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception: lone pairs are part of the shape name">
        H₂O and CO₂ both have three atoms, but water is not linear: its oxygen has four electron domains (two bonds, two lone pairs) arranged
        tetrahedrally, so the atoms form a bent shape. Always count lone pairs to find the electron geometry, then name the shape from the atoms alone.
      </Callout>

      <Callout tone="note" title="About sp³d and sp³d² hybridization">
        These labels are the standard textbook way to match steric numbers 5 and 6. Modern calculations show that d orbitals contribute very little to
        bonding in molecules like PCl₅ and SF₆, which are better described with polar, delocalized bonds. VSEPR predicts the shapes correctly either way.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: PCl₃ and ICl₄⁻"
            question="Predict the electron geometry, molecular geometry, ideal bond angle and hybridization of the central atom in PCl₃ and in ICl₄⁻."
            solution={
              <>
                <p>PCl₃: valence electrons = 5 + 3 × 7 = 26</p>
                <p>3 P–Cl bonds (6) + 3 lone pairs on each Cl (18) = 24 → 2 left = 1 lone pair on P</p>
                <p>SN = 3 + 1 = 4 → tetrahedral electron geometry, AX₃E</p>
                <p>Shape: trigonal pyramidal, angle &lt; 109.5° (measured ≈ 100°), sp³</p>
                <p>ICl₄⁻: valence electrons = 7 + 4 × 7 + 1 = 36</p>
                <p>4 I–Cl bonds (8) + Cl lone pairs (24) = 32 → 4 left = 2 lone pairs on I</p>
                <p>SN = 4 + 2 = 6 → octahedral electron geometry, AX₄E₂</p>
                <p className="font-semibold text-emerald-700">PCl₃: trigonal pyramidal, sp³. ICl₄⁻: square planar, 90°, sp³d².</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Where does the lone pair go in SF₄?"
            question="SF₄ has 34 valence electrons. Find its steric number, then decide whether the lone pair sits in an axial or an equatorial position of the trigonal bipyramid by counting 90° interactions."
            solution={
              <>
                <p>4 S–F bonds (8) + 3 lone pairs on each F (24) = 32 → 2 left = 1 lone pair on S</p>
                <p>SN = 4 + 1 = 5 → trigonal bipyramidal electron geometry</p>
                <p>Axial lone pair: 3 bonds at 90° (the equatorial ones)</p>
                <p>Equatorial lone pair: 2 bonds at 90° (the axial ones), the other 2 at 120°</p>
                <p>Fewer strong 90° lone pair–bond repulsions → equatorial</p>
                <p className="font-semibold text-emerald-700">SN = 5; equatorial lone pair; seesaw shape (AX₄E), Fax–S–Fax ≈ 173°, Feq–S–Feq ≈ 102°</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="chemistry"
          current="vsepr-geometry"
          items={[
            { slug: 'lewis-structures', note: 'Count bonds and lone pairs before predicting shape' },
            { slug: 'bond-polarity', note: 'Shape decides whether bond dipoles cancel' },
            { slug: 'atomic-orbitals', note: 'The s, p and d orbitals behind hybridization' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
