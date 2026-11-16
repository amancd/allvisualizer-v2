import type { Metadata } from 'next';
import { Circle, CircleDot, Orbit, Waves } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import AtomicOrbitalsVisualizer from './AtomicOrbitalsVisualizer';

export const metadata: Metadata = {
  title: 'Atomic Orbitals - Chemistry Visualizer | AllVisualizer',
  description:
    'Rotate 3D probability clouds of the hydrogen 1s, 2s, 2p, 3s, 3p and 3d orbitals, slice them into cross-sections, and read radial distribution functions, nodes and quantum numbers.',
  keywords: ['atomic orbitals', 'orbital shapes', 'probability density', 'radial distribution function', 'nodes', 'quantum numbers', 'hydrogen atom', 'd orbitals', 'chemistry'],
};

const ideas = [
  {
    title: 'Wavefunction ψ',
    icon: Waves,
    description: 'Each orbital is a solution of the Schrödinger equation. ψ itself can be positive or negative; the sign (phase) matters when orbitals overlap to form bonds.',
  },
  {
    title: 'Probability density |ψ|²',
    icon: CircleDot,
    description: 'The chance of finding the electron in a tiny volume around a point is |ψ|² times that volume. The cloud of dots is a sample from this density.',
  },
  {
    title: 'Radial distribution P(r)',
    icon: Orbit,
    description: 'Adding up |ψ|² over a thin spherical shell gives P(r) = r²R(r)², the probability per unit distance of finding the electron at radius r.',
  },
  {
    title: 'Nodes',
    icon: Circle,
    description: 'Surfaces where ψ = 0. Radial nodes are spheres, angular nodes are planes or cones. An orbital has n − 1 nodes in total, l of them angular.',
  },
];

const orbitalTable = [
  { orbital: '1s', n: 1, l: 0, radial: 0, angular: 0, peak: '1.00', mean: '1.5' },
  { orbital: '2s', n: 2, l: 0, radial: 1, angular: 0, peak: '5.24', mean: '6.0' },
  { orbital: '2p', n: 2, l: 1, radial: 0, angular: 1, peak: '4.00', mean: '5.0' },
  { orbital: '3s', n: 3, l: 0, radial: 2, angular: 0, peak: '13.07', mean: '13.5' },
  { orbital: '3p', n: 3, l: 1, radial: 1, angular: 1, peak: '12.00', mean: '12.5' },
  { orbital: '3d', n: 3, l: 2, radial: 0, angular: 2, peak: '9.00', mean: '10.5' },
];

export default function AtomicOrbitalsPage() {
  return (
    <DetailPage subject="chemistry" item="atomic-orbitals">
      <AtomicOrbitalsVisualizer />

      <ContentSection title="What an orbital is">
        <Prose>
          <p>
            An <strong>atomic orbital</strong> is a wavefunction ψ that describes one electron in an atom. It does not trace a path like a
            planet&apos;s orbit. Instead, |ψ|² at each point gives the probability density of finding the electron there. The cloud on the left
            is built by drawing thousands of random positions from that density, so dots bunch up where the electron is most likely to be.
          </p>
          <p>
            For hydrogen the wavefunction separates into a radial part and an angular part: ψ = R<sub>nl</sub>(r) × Y<sub>lm</sub>(θ, φ). The
            principal quantum number n sets the size and energy, the angular momentum number l sets the shape (s, p, d for l = 0, 1, 2), and
            the magnetic number m<sub>l</sub> sets the orientation. The familiar p<sub>x</sub>, p<sub>y</sub> and d<sub>xy</sub> shapes are
            real combinations of the complex m<sub>l</sub> = +1 and −1 (or +2 and −2) functions, which is why the visualizer lists m<sub>l</sub> as ±1 or ±2 for them.
          </p>
          <p>
            The colours show the sign of ψ: red where it is positive, blue where it is negative. Crossing a node flips the sign. A 2s orbital
            has a small inner sphere and a larger outer shell of opposite sign, separated by a spherical radial node at r = 2a₀. A 2p orbital
            has two lobes of opposite sign with a nodal plane between them.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Hydrogen 1s and 2s radial functions">
            <Formula where={[{ symbol: 'a₀', meaning: 'Bohr radius, 52.9 pm' }]}>
              R₁₀ = 2 a₀<sup>−3/2</sup> e<sup>−r/a₀</sup>,&nbsp;&nbsp; R₂₀ = (1/(2√2)) a₀<sup>−3/2</sup> (2 − r/a₀) e<sup>−r/2a₀</sup>
            </Formula>
          </Callout>
          <Callout tone="formula" title="Radial distribution function">
            <Formula where={[{ symbol: 'P(r) dr', meaning: 'probability of finding the electron between r and r + dr' }]}>P(r) = r² R<sub>nl</sub>(r)²,&nbsp;&nbsp; ∫₀^∞ P(r) dr = 1</Formula>
          </Callout>
          <Callout tone="formula" title="Counting nodes">
            <Formula>radial nodes = n − l − 1,&nbsp;&nbsp; angular nodes = l,&nbsp;&nbsp; total nodes = n − 1</Formula>
          </Callout>
          <Callout tone="formula" title="Energy and mean radius (hydrogen)">
            <Formula>
              E<sub>n</sub> = −13.6 eV / n²,&nbsp;&nbsp; ⟨r⟩ = (a₀ / 2) [3n² − l(l + 1)]
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Hydrogen orbitals at a glance" description="Distances in Bohr radii (a₀ = 52.9 pm).">
        <DataTable
          columns={[
            { header: 'Orbital', cell: 'orbital' },
            { header: 'n', cell: 'n', numeric: true },
            { header: 'l', cell: 'l', numeric: true },
            { header: 'Radial nodes', cell: 'radial', numeric: true },
            { header: 'Angular nodes', cell: 'angular', numeric: true },
            { header: 'Most probable r', cell: 'peak', numeric: true },
            { header: 'Mean ⟨r⟩', cell: 'mean', numeric: true },
          ]}
          rows={orbitalTable}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick an orbital from the n = 1, 2 or 3 rows. All panels and numbers update together.',
            'Drag the dark 3D cloud to rotate it, or let it auto-rotate. Use Resample or change the number of points to see that the shape is a statistical pattern, not a fixed surface.',
            'In the cross-section, switch between the xz, xy and yz planes. For 2pₓ, the yz plane is a nodal plane, so the slice is empty.',
            'Turn on "Colour by sign of ψ" to see the phase of each lobe, and look for white gaps: they are the nodes.',
            'Drag along the radial distribution plot. The read-out gives P(r) and the probability that the electron lies inside r. Try 1s at r = 1 a₀.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception: the most likely place is the nucleus">
        For 1s, |ψ|² is largest at the nucleus, yet the most probable distance is r = a₀. Both are true: the density per unit volume
        peaks at r = 0, but a thin shell at radius r has volume 4πr² dr, which is zero at the centre and grows with r. P(r) multiplies
        the two, so it peaks at a₀.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Counting nodes"
            question="How many radial nodes, angular nodes and total nodes do a 4d orbital and a 5f orbital have? Where is the radial node of a hydrogen 2s orbital, in pm?"
            solution={
              <>
                <p>4d: n = 4, l = 2. Radial = 4 − 2 − 1 = 1, angular = 2, total = 3.</p>
                <p>5f: n = 5, l = 3. Radial = 5 − 3 − 1 = 1, angular = 3, total = 4.</p>
                <p>For 2s, R₂₀ ∝ (2 − r/a₀), which is zero at r = 2a₀ = 2 × 52.9 pm.</p>
                <p className="font-semibold text-emerald-700">4d: 1 radial + 2 angular = 3; 5f: 1 + 3 = 4; 2s node at 2a₀ ≈ 106 pm</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Inside the Bohr radius"
            question="For a hydrogen 1s electron, find the most probable distance from the nucleus and the probability that the electron is closer than a₀."
            solution={
              <>
                <p>P(r) = r² R₁₀² = (4/a₀³) r² e<sup>−2r/a₀</sup>.</p>
                <p>dP/dr = (4/a₀³) e<sup>−2r/a₀</sup> (2r − 2r²/a₀) = 0 gives r = a₀, the most probable distance.</p>
                <p>With x = r/a₀: ∫₀¹ 4x² e<sup>−2x</sup> dx = 1 − e<sup>−2</sup>(1 + 2 + 2) = 1 − 5e<sup>−2</sup>.</p>
                <p>5e<sup>−2</sup> = 5 × 0.1353 = 0.6767, so the probability is 1 − 0.6767 = 0.3233.</p>
                <p className="font-semibold text-emerald-700">Most probable r = a₀ = 52.9 pm; P(r &lt; a₀) ≈ 0.323, about 32%</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related visualizations">
        <RelatedItems
          subject="chemistry"
          current="atomic-orbitals"
          items={[
            { slug: 'vsepr-geometry', note: 'See how the orbitals of bonded atoms arrange molecules in 3D' },
            { slug: 'bond-polarity', note: 'Follow shared electrons as they shift toward the more electronegative atom' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
