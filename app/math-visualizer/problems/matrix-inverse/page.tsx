import type { Metadata } from 'next';
import { ArrowLeftRight, Calculator, Lock, Monitor, Plus, Scaling, TrendingUp } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DetailPage, Formula, PracticeProblem, Prose, StepList } from '@/components/content';
import MatrixInverseVisualizer from './MatrixInverseVisualizer';

export const metadata: Metadata = {
  title: 'Matrix Inverse - Linear Algebra | AllVisualizer',
  description:
    'Find the inverse of a 2×2 or 3×3 matrix step by step with Gauss-Jordan elimination. See every row operation, the adjugate formula, and why singular matrices have no inverse.',
  keywords: ['matrix inverse', 'inverse matrix', 'Gauss-Jordan elimination', 'row operations', 'adjugate', 'singular matrix', 'linear systems'],
};

const rowOperations = [
  {
    title: 'Swap two rows',
    description: 'Ri ↔ Rj. Used when the pivot position holds a 0 and a lower row has a non-zero entry in that column.',
    icon: ArrowLeftRight,
  },
  {
    title: 'Scale a row',
    description: 'Ri ← k·Ri with k ≠ 0. Used to turn the pivot into a 1.',
    icon: Scaling,
  },
  {
    title: 'Add a multiple of another row',
    description: 'Ri ← Ri − k·Rj. Used to make every other entry in the pivot column 0.',
    icon: Plus,
  },
];

const applications = [
  { title: 'Solving linear systems', description: 'If Ax = b and A is invertible, then x = A⁻¹b. One inverse solves the system for every right-hand side b.', icon: Calculator },
  { title: 'Computer graphics', description: 'Undoing a camera or model transformation means applying its inverse matrix, for example to map a mouse click back into world space.', icon: Monitor },
  { title: 'Cryptography', description: 'The Hill cipher encrypts blocks of letters with a matrix; decrypting uses its inverse (modulo 26).', icon: Lock },
  { title: 'Statistics', description: 'Least-squares regression uses (XᵀX)⁻¹Xᵀy to find the best-fit coefficients.', icon: TrendingUp },
];

export default function MatrixInversePage() {
  return (
    <DetailPage
      subject="math"
      item="matrix-inverse"
      description="Step through Gauss-Jordan elimination on [A | I] and watch the identity matrix turn into the inverse. Try a singular matrix to see where it breaks."
    >
      <MatrixInverseVisualizer />

      <ContentSection title="What is an inverse matrix?">
        <Prose>
          <p>
            The inverse of a square matrix A is the matrix A⁻¹ that undoes it: multiplying them in either order gives the
            identity, AA⁻¹ = A⁻¹A = I. If A rotates, stretches or shears the plane, A⁻¹ puts every point back where it
            started.
          </p>
          <p>
            Not every matrix has an inverse. If A flattens space onto a line or a point, different inputs land on the same
            output and there is no way to tell them apart afterwards. That happens exactly when <strong>det(A) = 0</strong>.
            Such a matrix is called <strong>singular</strong>.
          </p>
          <p>
            <strong>Gauss-Jordan elimination</strong> finds the inverse with row operations. Each row operation is the same
            as multiplying on the left by an elementary matrix E. If a sequence of them turns A into I, then
            E<sub>k</sub>…E<sub>1</sub>A = I, so E<sub>k</sub>…E<sub>1</sub> = A⁻¹. Applying the same operations to I
            (the right half of [A | I]) builds exactly that product.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="The three row operations">
        <CardGrid items={rowOperations} columns={3} />
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="grid gap-4 lg:grid-cols-2">
          <Callout tone="formula" title="Definition">
            <Formula>A·A⁻¹ = A⁻¹·A = I</Formula>
          </Callout>
          <Callout tone="formula" title="Gauss-Jordan">
            <Formula>[A | I] → row operations → [I | A⁻¹]</Formula>
          </Callout>
          <Callout tone="formula" title="2×2 inverse (adjugate formula)">
            <Formula
              where={[
                { symbol: 'A', meaning: '[[a, b], [c, d]]' },
                { symbol: 'ad − bc', meaning: 'the determinant; must be non-zero' },
              ]}
            >
              A⁻¹ = 1/(ad − bc) × [[d, −b], [−c, a]]
            </Formula>
          </Callout>
          <Callout tone="formula" title="General adjugate formula and useful rules">
            <Formula>A⁻¹ = adj(A) / det(A)</Formula>
            <Formula>(AB)⁻¹ = B⁻¹A⁻¹</Formula>
            <Formula>det(A⁻¹) = 1 / det(A)</Formula>
          </Callout>
        </div>
        <Callout tone="warning" title="Watch the order" className="mt-4">
          The inverse of a product reverses the order: (AB)⁻¹ = B⁻¹A⁻¹, just as you take off your shoes before your socks.
        </Callout>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose a 2×2 or 3×3 matrix and type integer entries, or load one of the presets.',
            'Check the determinant. If it is 0 the matrix is singular and has no inverse.',
            'Press Next step to apply one row operation at a time. The changed row is highlighted in amber, the row used to change it in blue, and the current pivot is outlined.',
            'Click any operation in the list to jump straight to it.',
            'At the last step the left half is I and the right half is A⁻¹. For a 2×2 matrix, compare it with the adjugate formula below the steps.',
            'Load the Singular preset to see elimination stop when a column has no pivot.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Where inverses are used">
        <CardGrid items={applications} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Invert a 2×2 matrix"
            question="Find the inverse of A = [[3, 5], [1, 2]] and check your answer."
            solution={
              <>
                <p>det(A) = 3×2 − 5×1 = 1</p>
                <p>A⁻¹ = 1/1 × [[2, −5], [−1, 3]]</p>
                <p className="font-semibold text-emerald-700">A⁻¹ = [[2, −5], [−1, 3]]</p>
                <p>Check: row 1 of A times A⁻¹ = [3×2 + 5×(−1), 3×(−5) + 5×3] = [1, 0]</p>
                <p>Row 2 of A times A⁻¹ = [1×2 + 2×(−1), 1×(−5) + 2×3] = [0, 1]. So AA⁻¹ = I.</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Solve a system with the inverse"
            question={
              <>
                Solve 4x + 7y = 15 and 2x + 6y = 10 by writing it as Ax = b with A = [[4, 7], [2, 6]].
              </>
            }
            solution={
              <>
                <p>det(A) = 4×6 − 7×2 = 10</p>
                <p>A⁻¹ = 1/10 × [[6, −7], [−2, 4]]</p>
                <p>x = A⁻¹b = 1/10 × [6×15 − 7×10, −2×15 + 4×10]</p>
                <p>= 1/10 × [20, 10]</p>
                <p className="font-semibold text-emerald-700">x = 2, y = 1</p>
                <p>Check: 4(2) + 7(1) = 15 and 2(2) + 6(1) = 10.</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
