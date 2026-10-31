import type { Metadata } from 'next';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, StepList } from '@/components/content';
import GeometricTransformationsVisualizer from './GeometricTransformationsVisualizer';

export const metadata: Metadata = {
  title: 'Geometric Transformations - Math Visualizer | AllVisualizer',
  description:
    'Translate, rotate, reflect and dilate a polygon on the coordinate plane. See labelled images, coordinate rules and transformation matrices, and compose several transformations.',
  keywords: ['geometric transformations', 'translation', 'rotation', 'reflection', 'dilation', 'transformation matrix', 'coordinate geometry'],
};

const rules = [
  { name: 'Translation by ⟨a, b⟩', rule: '(x, y) → (x + a, y + b)', matrix: '3×3 only: [1 0 a; 0 1 b; 0 0 1]', preserves: 'Size, shape, orientation' },
  { name: 'Rotation 90° about origin', rule: '(x, y) → (−y, x)', matrix: '[0 −1; 1 0]', preserves: 'Size, shape, orientation' },
  { name: 'Rotation 180° about origin', rule: '(x, y) → (−x, −y)', matrix: '[−1 0; 0 −1]', preserves: 'Size, shape, orientation' },
  { name: 'Reflection over x-axis', rule: '(x, y) → (x, −y)', matrix: '[1 0; 0 −1]', preserves: 'Size, shape (orientation flips)' },
  { name: 'Reflection over y-axis', rule: '(x, y) → (−x, y)', matrix: '[−1 0; 0 1]', preserves: 'Size, shape (orientation flips)' },
  { name: 'Reflection over y = x', rule: '(x, y) → (y, x)', matrix: '[0 1; 1 0]', preserves: 'Size, shape (orientation flips)' },
  { name: 'Dilation by k about origin', rule: '(x, y) → (kx, ky)', matrix: '[k 0; 0 k]', preserves: 'Shape and angles; lengths scale by |k|' },
];

const kinds = [
  { title: 'Translation', description: 'Slides every point the same distance in the same direction. Nothing turns or flips.' },
  { title: 'Rotation', description: 'Turns every point through the same angle about a fixed centre. Counterclockwise is positive.' },
  { title: 'Reflection', description: 'Flips the shape over a mirror line. Each point and its image are the same distance from the line.' },
  { title: 'Dilation', description: 'Enlarges or shrinks from a centre by a scale factor k. The image is similar, not congruent, unless k = 1.' },
];

export default function GeometricTransformationsPage() {
  return (
    <DetailPage
      subject="math"
      item="geometric-transformations"
      description="Move a polygon around the coordinate plane with translations, rotations, reflections and dilations. Chain several together and see the single rule and matrix that does the same job."
    >
      <GeometricTransformationsVisualizer />

      <ContentSection title="The four basic transformations">
        <CardGrid items={kinds} />
        <Prose className="mt-6">
          <p>
            A transformation moves every point of the plane by the same rule. The original shape is the{' '}
            <strong>pre-image</strong> and the result is the <strong>image</strong>; a vertex A is sent to A′ (read &ldquo;A prime&rdquo;), and a second step
            sends A′ to A″. Translations, rotations and reflections are <strong>rigid motions</strong>: the image is congruent to the
            original. A dilation keeps angles but scales lengths, so the image is similar.
          </p>
          <p>
            Every one of these transformations can be written as a matrix. Rotations, reflections and dilations about the origin are
            2×2 matrices. A translation is not linear (it moves the origin), so we use a 3×3 <strong>homogeneous</strong> matrix that
            treats the point (x, y) as (x, y, 1). Then composing transformations is just multiplying matrices.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Rotation by θ about the origin">
            <Formula where={[{ symbol: 'θ', meaning: 'angle of rotation, counterclockwise positive' }]}>
              (x, y) → (x cos θ − y sin θ, x sin θ + y cos θ)
            </Formula>
          </Callout>
          <Callout tone="formula" title="About any centre (h, k)">
            <Formula>
              Translate (h, k) to the origin, apply the transformation, translate back: M = T(h, k) · R · T(−h, −k)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Composition">
            <Formula>Do M₁ first, then M₂: the combined matrix is M₂ · M₁ (the first step sits on the right).</Formula>
          </Callout>
          <DataTable
            columns={[
              { header: 'Transformation', cell: 'name' },
              { header: 'Coordinate rule', cell: 'rule' },
              { header: 'Matrix', cell: 'matrix' },
              { header: 'Preserves', cell: 'preserves' },
            ]}
            rows={rules}
          />
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick a starting shape, or drag its blue vertices to any grid point.',
            'Choose the type of Step 1 and set its parameters: the shift for a translation, the angle and centre for a rotation, the mirror line for a reflection, or the scale factor and centre for a dilation.',
            'Read the coordinate rule under each step, and compare the vertex table: every original vertex A maps to A′ by that rule.',
            'Click Add step to compose up to four transformations. Dashed outlines show the image after each earlier step; the red shape is the final image.',
            'The combined panel shows one rule and one matrix that do the whole sequence at once. Order matters: a reflection followed by a rotation is usually not the same as the rotation followed by the reflection.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Rotation about the origin"
            question="Triangle ABC has A(1, 1), B(4, 1) and C(1, 3). Find the image after a rotation of 90° counterclockwise about the origin."
            solution={
              <>
                <p>Rule for 90° counterclockwise: (x, y) → (−y, x)</p>
                <p>A(1, 1) → A′(−1, 1)</p>
                <p>B(4, 1) → B′(−1, 4)</p>
                <p>C(1, 3) → C′(−3, 1)</p>
                <p className="font-semibold text-emerald-700">A′(−1, 1), B′(−1, 4), C′(−3, 1)</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Composing two reflections"
            question="Point P(3, 2) is reflected over the x-axis and then over the y-axis. Find the final image, and the single transformation that does the same thing."
            solution={
              <>
                <p>Reflect over the x-axis: (x, y) → (x, −y), so P′ = (3, −2)</p>
                <p>Reflect over the y-axis: (x, y) → (−x, y), so P″ = (−3, −2)</p>
                <p>Matrices: [−1 0; 0 1] · [1 0; 0 −1] = [−1 0; 0 −1]</p>
                <p>That is the rule (x, y) → (−x, −y), a rotation of 180° about the origin.</p>
                <p className="font-semibold text-emerald-700">P″ = (−3, −2); equivalent to a 180° rotation about the origin</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
