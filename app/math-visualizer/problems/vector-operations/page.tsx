import type { Metadata } from 'next';
import { Gamepad2, Navigation, Sun, Wrench } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, StepList } from '@/components/content';
import VectorOperationsVisualizer from './VectorOperationsVisualizer';

export const metadata: Metadata = {
  title: 'Vector Operations - Linear Algebra | AllVisualizer',
  description:
    'Drag two vectors on a grid to explore vector addition, subtraction, magnitude, the dot product with projection and angle, and the cross product as a signed area.',
  keywords: ['vectors', 'dot product', 'cross product', 'vector magnitude', 'vector projection', 'vector addition', 'linear algebra'],
};

const dotSigns = [
  { sign: 'a · b > 0', angle: '0° ≤ θ < 90°', meaning: 'Vectors point broadly the same way' },
  { sign: 'a · b = 0', angle: 'θ = 90°', meaning: 'Vectors are perpendicular (orthogonal)' },
  { sign: 'a · b < 0', angle: '90° < θ ≤ 180°', meaning: 'Vectors point broadly in opposite directions' },
];

const applications = [
  { title: 'Navigation', description: 'A plane’s ground velocity is the sum of its air velocity and the wind velocity.', icon: Navigation },
  { title: 'Work in physics', description: 'Work is a dot product, W = F · d: only the part of the force along the motion does work.', icon: Wrench },
  { title: 'Lighting in 3D graphics', description: 'Surface brightness uses the dot product of the surface normal and the light direction.', icon: Sun },
  { title: 'Games', description: 'The sign of a 2D cross product tells a game whether a target is to the left or right of a character.', icon: Gamepad2 },
];

export default function VectorOperationsPage() {
  return (
    <DetailPage
      subject="math"
      item="vector-operations"
      description="Drag two vectors around a grid and watch their sum, difference, magnitude, dot product and cross product update live."
    >
      <VectorOperationsVisualizer />

      <ContentSection title="Understanding vector operations">
        <Prose>
          <p>
            A vector has a <strong>magnitude</strong> (length) and a <strong>direction</strong>. In 2D we write it with
            components, a = (a<sub>x</sub>, a<sub>y</sub>), and draw it as an arrow from the origin.
          </p>
          <ul>
            <li>
              <strong>Addition</strong> works component by component. Geometrically, put the tail of b on the tip of a; the
              sum runs from the start of a to the end of b, the diagonal of the parallelogram the two vectors span.
            </li>
            <li>
              <strong>Subtraction</strong> a − b is the vector you add to b to reach a, so it points from the tip of b to the
              tip of a.
            </li>
            <li>
              The <strong>dot product</strong> a · b is a number. It equals |a||b| cos θ, so it measures how much the vectors
              point the same way. Dividing by |b| gives the length of the shadow (projection) of a on b.
            </li>
            <li>
              The <strong>cross product</strong> is defined for 3D vectors. For two vectors in the xy-plane it points straight
              along the z-axis, and its z-component a<sub>x</sub>b<sub>y</sub> − a<sub>y</sub>b<sub>x</sub> is the signed
              area of the parallelogram spanned by a and b. The sign tells you the turning direction from a to b.
            </li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="grid gap-4 lg:grid-cols-2">
          <Callout tone="formula" title="Magnitude">
            <Formula>|a| = √(a<sub>x</sub>² + a<sub>y</sub>²)</Formula>
          </Callout>
          <Callout tone="formula" title="Sum and difference">
            <Formula>a ± b = (a<sub>x</sub> ± b<sub>x</sub>, a<sub>y</sub> ± b<sub>y</sub>)</Formula>
          </Callout>
          <Callout tone="formula" title="Dot product and angle">
            <Formula>a · b = a<sub>x</sub>b<sub>x</sub> + a<sub>y</sub>b<sub>y</sub> = |a||b| cos θ</Formula>
            <Formula>θ = arccos( a · b / (|a||b|) )</Formula>
          </Callout>
          <Callout tone="formula" title="Projection of a onto b">
            <Formula
              where={[
                { symbol: 'a · b / |b|', meaning: 'scalar projection (signed length of the shadow)' },
                { symbol: 'proj', meaning: 'vector projection, along b' },
              ]}
            >
              proj<sub>b</sub> a = (a · b / |b|²) b
            </Formula>
          </Callout>
          <Callout tone="formula" title="Cross product (vectors in the xy-plane)" className="lg:col-span-2">
            <Formula
              where={[
                { symbol: 'z', meaning: 'signed area of the parallelogram spanned by a and b' },
                { symbol: 'z > 0', meaning: 'b is counter-clockwise from a (right-hand rule: out of the screen)' },
              ]}
            >
              a × b = (0, 0, a<sub>x</sub>b<sub>y</sub> − a<sub>y</sub>b<sub>x</sub>), |a × b| = |a||b| sin θ
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="What the sign of the dot product tells you">
        <DataTable
          columns={[
            { header: 'Dot product', cell: 'sign' },
            { header: 'Angle', cell: 'angle' },
            { header: 'Meaning', cell: 'meaning' },
          ]}
          rows={dotSigns}
        />
        <Callout tone="tip" title="Order matters for the cross product" className="mt-4">
          The dot product is symmetric (a · b = b · a) but the cross product is not: b × a = −(a × b). Swap the vectors in the
          visualizer and the parallelogram changes colour.
        </Callout>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Drag the white handles at the tips of a (blue) and b (red). Untick “Snap to whole numbers” for finer positions.',
            'Pick Sum or Difference to see the tip-to-tail construction and the resulting vector in violet.',
            'Pick Dot product to see the angle θ and the green projection of a onto b. Drag b until the vectors are perpendicular and watch a · b become 0.',
            'Pick Cross product to see the parallelogram. Its area is |z|; it turns red when b is clockwise from a.',
            'Read the worked numbers in the panel beside the grid; every value is substituted into its formula.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Angle between two vectors"
            question="Find the angle between a = (3, 4) and b = (4, −3). Then find a + b and |a + b|."
            solution={
              <>
                <p>a · b = 3×4 + 4×(−3) = 12 − 12 = 0</p>
                <p>cos θ = 0, so θ = 90°: the vectors are perpendicular.</p>
                <p>a + b = (3 + 4, 4 − 3) = (7, 1)</p>
                <p>|a + b| = √(49 + 1) = √50 ≈ 7.07</p>
                <p className="font-semibold text-emerald-700">θ = 90°, a + b = (7, 1), |a + b| ≈ 7.07</p>
                <p>Check with Pythagoras: |a| = |b| = 5 and they are perpendicular, so |a + b| = √(25 + 25).</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Projection and parallelogram area"
            question="For a = (4, 1) and b = (1, 3), find the projection of a onto b and the area of the parallelogram they span."
            solution={
              <>
                <p>a · b = 4×1 + 1×3 = 7</p>
                <p>|b|² = 1² + 3² = 10</p>
                <p>proj<sub>b</sub> a = (7/10)(1, 3) = (0.7, 2.1)</p>
                <p>z = a<sub>x</sub>b<sub>y</sub> − a<sub>y</sub>b<sub>x</sub> = 4×3 − 1×1 = 11</p>
                <p className="font-semibold text-emerald-700">projection = (0.7, 2.1), area = 11</p>
                <p>z &gt; 0, so b is counter-clockwise from a. These are the visualizer’s starting vectors.</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
