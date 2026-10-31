import type { Metadata } from 'next';
import { Building2, MapPin, Monitor, Ruler } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, StepList } from '@/components/content';
import DistanceFormulaVisualizer from './DistanceFormulaVisualizer';
import PythagoreanVisualizer from './PythagoreanVisualizer';

export const metadata: Metadata = {
  title: 'Pythagorean Theorem - Geometry | AllVisualizer',
  description:
    'See a² + b² = c² with squares drawn on the sides of an adjustable right triangle, watch an animated rearrangement proof, and connect it to the distance formula.',
  keywords: ['Pythagorean theorem', 'a² + b² = c²', 'right triangle', 'visual proof', 'Pythagorean triples', 'distance formula', 'hypotenuse'],
};

const triples = [
  { triple: '3, 4, 5', check: '9 + 16 = 25' },
  { triple: '5, 12, 13', check: '25 + 144 = 169' },
  { triple: '8, 15, 17', check: '64 + 225 = 289' },
  { triple: '7, 24, 25', check: '49 + 576 = 625' },
  { triple: '6, 8, 10', check: '36 + 64 = 100 (3, 4, 5 doubled)' },
];

const applications = [
  { title: 'Construction', description: 'Builders mark 3, 4 and 5 units along two walls and a diagonal to check that a corner is exactly square.', icon: Building2 },
  { title: 'Navigation', description: 'Walk 3 km east and 4 km north and you are 5 km from where you started, as the crow flies.', icon: MapPin },
  { title: 'Screen sizes', description: 'A TV’s size is its diagonal: a 16 × 9 panel has a diagonal of √(16² + 9²) ≈ 18.4 units.', icon: Monitor },
  { title: 'Distance in any dimension', description: 'In 3D the distance is √(Δx² + Δy² + Δz²), by applying the theorem twice.', icon: Ruler },
];

export default function PythagoreanTheoremPage() {
  return (
    <DetailPage subject="math" item="pythagorean-theorem">
      <PythagoreanVisualizer />

      <ContentSection title="What the theorem says">
        <Prose>
          <p>
            In a right triangle the side opposite the right angle is the <strong>hypotenuse</strong>, c. The other two sides
            are the <strong>legs</strong>, a and b. The Pythagorean theorem says the square built on the hypotenuse has exactly
            the same area as the two squares built on the legs put together: <strong>a² + b² = c²</strong>.
          </p>
          <p>
            The converse is also true: if the sides of a triangle satisfy a² + b² = c², the angle opposite c is a right angle.
            If a² + b² &gt; c² that angle is acute, and if a² + b² &lt; c² it is obtuse.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Why the rearrangement proof works">
        <Prose>
          <p>
            Take a square of side a + b and place four copies of the triangle inside it, one in each corner. The space left in
            the middle is a square whose sides are all hypotenuses, so its area is c². Now slide the same four triangles into
            two a × b rectangles. The space left is now an a × a square and a b × b square.
          </p>
          <p>
            Nothing changed size: the big square is the same and the four triangles are the same, so the leftover areas must be
            equal. Hence c² = a² + b². You can also see it with algebra:
          </p>
        </Prose>
        <Callout tone="formula" title="Algebra behind the picture" className="mt-4">
          <Formula>(a + b)² = 4 × (½ab) + c²</Formula>
          <Formula>a² + 2ab + b² = 2ab + c²</Formula>
          <Formula>a² + b² = c²</Formula>
        </Callout>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="grid gap-4 lg:grid-cols-2">
          <Callout tone="formula" title="Pythagorean theorem">
            <Formula
              where={[
                { symbol: 'a, b', meaning: 'the legs (the sides that meet at the right angle)' },
                { symbol: 'c', meaning: 'the hypotenuse (the longest side)' },
              ]}
            >
              a² + b² = c²
            </Formula>
          </Callout>
          <Callout tone="formula" title="Finding a missing side">
            <Formula>c = √(a² + b²)</Formula>
            <Formula>a = √(c² − b²)</Formula>
          </Callout>
          <Callout tone="formula" title="Distance formula" className="lg:col-span-2">
            <Formula
              where={[
                { symbol: 'Δx = x₂ − x₁', meaning: 'horizontal leg' },
                { symbol: 'Δy = y₂ − y₁', meaning: 'vertical leg' },
              ]}
            >
              d = √((x₂ − x₁)² + (y₂ − y₁)²)
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection
        title="Connection: the distance formula"
        description="Any two points on a grid are the ends of the hypotenuse of a right triangle whose legs run along the axes."
      >
        <DistanceFormulaVisualizer />
      </ContentSection>

      <ContentSection title="Common Pythagorean triples">
        <DataTable
          columns={[
            { header: 'a, b, c', cell: 'triple' },
            { header: 'a² + b² = c²', cell: 'check' },
          ]}
          rows={triples}
        />
        <Callout tone="tip" title="Making more triples" className="mt-4">
          Any multiple of a triple is a triple. And for whole numbers m &gt; n &gt; 0, the numbers m² − n², 2mn and m² + n² always
          form one: m = 2, n = 1 gives 3, 4, 5.
        </Callout>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Move the a and b sliders, or pick a preset triple. The squares on all three sides resize and show their areas.',
            'Check the readout: a² + b² always equals c², even when c is not a whole number.',
            'Press Rearrange to slide the four triangles. Watch the c² square turn into the a² and b² squares.',
            'Drag the progress slider to pause the proof halfway and see that every triangle only slides, never stretches.',
            'In the distance formula grid, drag P₁ and P₂ to see Δx and Δy become the legs of a right triangle.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Ladder against a wall"
            question="A 13 m ladder leans against a wall with its foot 5 m from the base of the wall. How high up the wall does it reach?"
            solution={
              <>
                <p>The ladder is the hypotenuse: c = 13, a = 5.</p>
                <p>b² = c² − a² = 169 − 25 = 144</p>
                <p>b = √144</p>
                <p className="font-semibold text-emerald-700">b = 12 m</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Distance between two points"
            question="Find the distance between P₁ = (−2, 1) and P₂ = (4, 9)."
            solution={
              <>
                <p>Δx = 4 − (−2) = 6</p>
                <p>Δy = 9 − 1 = 8</p>
                <p>d = √(6² + 8²) = √(36 + 64) = √100</p>
                <p className="font-semibold text-emerald-700">d = 10</p>
                <p>The legs 6 and 8 form the 6, 8, 10 triple.</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
