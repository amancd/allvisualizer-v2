import type { Metadata } from 'next';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, StepList } from '@/components/content';
import IdentitiesVisualizer from './IdentitiesVisualizer';

export const metadata: Metadata = {
  title: 'Trigonometric Identities - Math Visualizer | AllVisualizer',
  description:
    'See the Pythagorean, sum and difference, double-angle and half-angle identities proved on the unit circle, with both sides evaluated and plotted for every angle.',
  keywords: ['trigonometric identities', 'Pythagorean identity', 'sum formula', 'double angle', 'half angle', 'unit circle', 'proof'],
};

const identityTable = [
  { name: 'Pythagorean', identity: 'sin²θ + cos²θ = 1', alt: '1 + tan²θ = sec²θ' },
  { name: 'Sum (sine)', identity: 'sin(α + β) = sin α cos β + cos α sin β', alt: 'sin(α − β) = sin α cos β − cos α sin β' },
  { name: 'Sum (cosine)', identity: 'cos(α + β) = cos α cos β − sin α sin β', alt: 'cos(α − β) = cos α cos β + sin α sin β' },
  { name: 'Double angle', identity: 'sin 2α = 2 sin α cos α', alt: 'cos 2α = cos²α − sin²α = 2cos²α − 1 = 1 − 2sin²α' },
  { name: 'Half angle', identity: 'cos²(θ/2) = (1 + cos θ)/2', alt: 'sin²(θ/2) = (1 − cos θ)/2,  tan(θ/2) = sin θ/(1 + cos θ)' },
];

const uses = [
  { title: 'Simplifying expressions', description: 'Replace sin²x + cos²x with 1, or 2 sin x cos x with sin 2x, to shorten calculations.' },
  { title: 'Integration', description: 'Power-reduction forms such as cos²x = (1 + cos 2x)/2 turn hard integrals into easy ones.' },
  { title: 'Exact values', description: 'sin 75° = sin(45° + 30°) gives an exact surd instead of a decimal approximation.' },
  { title: 'Signals and rotation', description: 'The sum formulas are exactly the rotation matrix: rotating by α then β equals rotating by α + β.' },
];

export default function IdentitiesPage() {
  return (
    <DetailPage
      subject="math"
      item="identities"
      description="Pick an identity, move the angles and watch a unit-circle construction prove it. Both sides are evaluated and plotted, so you can see they agree for every angle."
    >
      <IdentitiesVisualizer />

      <ContentSection title="What is an identity?">
        <Prose>
          <p>
            An <strong>identity</strong> is an equation that holds for every value of the variable, not just for a few solutions.
            sin²θ + cos²θ = 1 is true at 0°, at 37°, at 250°, at any angle you choose. That is why the two curves in the graph
            above lie exactly on top of each other.
          </p>
          <p>
            Every identity on this page comes from one picture: the <strong>unit circle</strong>, where the point at angle θ is
            (cos θ, sin θ). The Pythagorean identity is Pythagoras on the triangle under that point. The sum formulas come from
            reaching the point at angle α + β in two right-angled steps, and the double- and half-angle formulas are special cases.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Sum and difference">
            <Formula
              where={[
                { symbol: 'α, β', meaning: 'any two angles' },
                { symbol: '±, ∓', meaning: 'take the top signs together or the bottom signs together' },
              ]}
            >
              sin(α ± β) = sin α cos β ± cos α sin β
              <br />
              cos(α ± β) = cos α cos β ∓ sin α sin β
            </Formula>
          </Callout>
          <DataTable
            columns={[
              { header: 'Family', cell: 'name' },
              { header: 'Identity', cell: 'identity' },
              { header: 'Related forms', cell: 'alt' },
            ]}
            rows={identityTable}
          />
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose an identity from the row of buttons. The identity is shown in full above the figure.',
            'Move the α (or θ) slider, or drag anywhere on the circle, to change the angle. For sum and difference identities, use the β slider too.',
            'In the construction, the green and orange pieces are the two terms of the right-hand side. They stack along an axis to give the coordinate of B (or the length QF in the half-angle case).',
            'Check the numeric panel: the left side and the sum of the terms agree to every displayed decimal place.',
            'The graph sweeps the angle through a full turn. The blue band (left side) and the dashed line (right side) coincide everywhere, which is what makes it an identity.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Where identities are used">
        <CardGrid items={uses} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: An exact value"
            question="Use a sum formula to find the exact value of sin 75°."
            solution={
              <>
                <p>sin 75° = sin(45° + 30°)</p>
                <p>= sin 45° cos 30° + cos 45° sin 30°</p>
                <p>= (√2/2)(√3/2) + (√2/2)(1/2)</p>
                <p>= (√6 + √2)/4</p>
                <p className="font-semibold text-emerald-700">sin 75° = (√6 + √2)/4 ≈ 0.9659</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Double angle from one ratio"
            question="Angle θ is in the first quadrant and sin θ = 3/5. Find sin 2θ and cos 2θ."
            solution={
              <>
                <p>cos²θ = 1 − sin²θ = 1 − 9/25 = 16/25, and θ is in quadrant I so cos θ = 4/5.</p>
                <p>sin 2θ = 2 sin θ cos θ = 2 · (3/5) · (4/5) = 24/25</p>
                <p>cos 2θ = cos²θ − sin²θ = 16/25 − 9/25 = 7/25</p>
                <p>Check: (24/25)² + (7/25)² = (576 + 49)/625 = 1</p>
                <p className="font-semibold text-emerald-700">sin 2θ = 24/25, cos 2θ = 7/25</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
