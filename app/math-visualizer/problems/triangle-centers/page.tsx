import type { Metadata } from 'next';
import { Circle, Crosshair, Scale, Triangle } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, StepList } from '@/components/content';
import TriangleCentersVisualizer from './TriangleCentersVisualizer';

export const metadata: Metadata = {
  title: 'Triangle Centers - Geometry Visualizer | AllVisualizer',
  description:
    'Drag the vertices of a triangle and watch its centroid, circumcenter, incenter and orthocenter move. See the medians, perpendicular bisectors, angle bisectors, altitudes and the Euler line.',
  keywords: ['triangle centers', 'centroid', 'circumcenter', 'incenter', 'orthocenter', 'Euler line', 'circumcircle', 'incircle', 'geometry'],
};

const centers = [
  {
    title: 'Centroid (G)',
    icon: Scale,
    description:
      'Where the three medians meet. A median joins a vertex to the midpoint of the opposite side. G is the balance point of a triangle cut from card, and it divides every median 2 : 1 from the vertex.',
  },
  {
    title: 'Circumcenter (O)',
    icon: Circle,
    description:
      'Where the perpendicular bisectors of the sides meet. O is the same distance R from all three vertices, so it is the center of the circumscribed circle. It is inside acute triangles, on the hypotenuse of right triangles and outside obtuse ones.',
  },
  {
    title: 'Incenter (I)',
    icon: Crosshair,
    description:
      'Where the angle bisectors meet. I is the same distance r from all three sides, so it is the center of the inscribed circle. It is always inside the triangle.',
  },
  {
    title: 'Orthocenter (H)',
    icon: Triangle,
    description:
      'Where the three altitudes meet. An altitude drops from a vertex perpendicular to the line of the opposite side. In a right triangle H is the right-angle vertex; in an obtuse triangle it lies outside.',
  },
];

const summary = [
  { center: 'Centroid G', lines: 'Medians', property: 'Divides each median 2 : 1', location: 'Always inside' },
  { center: 'Circumcenter O', lines: 'Perpendicular bisectors', property: 'Equidistant from the vertices (R)', location: 'Inside / on / outside' },
  { center: 'Incenter I', lines: 'Angle bisectors', property: 'Equidistant from the sides (r)', location: 'Always inside' },
  { center: 'Orthocenter H', lines: 'Altitudes', property: 'Altitudes are concurrent', location: 'Inside / at a vertex / outside' },
];

export default function TriangleCentersPage() {
  return (
    <DetailPage subject="math" item="triangle-centers">
      <TriangleCentersVisualizer />

      <ContentSection title="Four centers of a triangle">
        <Prose>
          <p>
            A triangle has many &quot;centers&quot;, each defined by three special lines that all pass through one point. That three lines
            meet at a single point is not obvious: it is a theorem (a statement about <strong>concurrency</strong>) that holds for every
            triangle. The visualizer draws the lines for each center so you can see them meet.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={centers} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Centroid">
            <Formula where={[{ symbol: 'A, B, C', meaning: 'the vertex coordinates' }]}>
              G = (A + B + C) / 3 = ((x<sub>A</sub> + x<sub>B</sub> + x<sub>C</sub>)/3, (y<sub>A</sub> + y<sub>B</sub> + y<sub>C</sub>)/3)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Incenter and inradius">
            <Formula
              where={[
                { symbol: 'a, b, c', meaning: 'lengths of the sides opposite A, B, C' },
                { symbol: 's', meaning: 'semi-perimeter (a + b + c) / 2' },
                { symbol: 'K', meaning: 'area of the triangle' },
              ]}
            >
              I = (aA + bB + cC) / (a + b + c),&nbsp;&nbsp; r = K / s
            </Formula>
          </Callout>
          <Callout tone="formula" title="Circumradius">
            <Formula>R = abc / (4K) = a / (2 sin A)</Formula>
          </Callout>
          <Callout tone="formula" title="Euler line">
            <Formula>H = A + B + C − 2O,&nbsp;&nbsp; so O, G, H are collinear with OG : GH = 1 : 2</Formula>
            <p className="mt-2">
              Measured from the circumcenter, G = (A + B + C)/3 and H = A + B + C (as vectors), so H − O = 3(G − O). The incenter is not on
              the Euler line in general; it is only when the triangle is isosceles.
            </p>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="At a glance">
        <DataTable
          columns={[
            { header: 'Center', cell: 'center' },
            { header: 'Meeting lines', cell: 'lines' },
            { header: 'Property', cell: 'property' },
            { header: 'Location', cell: 'location' },
          ]}
          rows={summary}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Drag any vertex A, B or C. Every center, line and circle updates as you move it.',
            'Use the toggles above the drawing to show or hide each center together with the lines that define it.',
            'Make one angle larger than 90°. Watch O and H leave the triangle while G and I stay inside.',
            'Turn on the Euler line and check the panel: the ratio OG : GH stays 1 : 2 for every shape.',
            'Try an equilateral triangle (for example A(−3, 0), B(3, 0), C(0, 5.2) with snapping off): the four centers almost coincide, and in an exactly equilateral triangle they are the same point.',
            'Line the three vertices up. The triangle becomes degenerate and only the centroid is still defined.',
          ]}
        />
      </ContentSection>

      <Callout tone="tip" title="Why the Euler line works">
        The triangle formed by the midpoints of the sides (the medial triangle) is the original shrunk by a factor of −1/2 about G. Its
        altitudes are the original perpendicular bisectors, so that shrink sends H to O. A scaling by −1/2 about G means O − G = −½(H − G),
        which is exactly the 1 : 2 ratio on a single line.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Centroid, circumcenter, orthocenter"
            question="For the triangle A(0, 0), B(6, 0), C(0, 8), find G, O and H, and check that OG : GH = 1 : 2."
            solution={
              <>
                <p>G = ((0 + 6 + 0)/3, (0 + 0 + 8)/3) = (2, 8/3)</p>
                <p>The angle at A is 90°, so O is the midpoint of the hypotenuse BC:</p>
                <p>O = ((6 + 0)/2, (0 + 8)/2) = (3, 4),&nbsp; R = |BC|/2 = 10/2 = 5</p>
                <p>H = A + B + C − 2O = (6, 8) − (6, 8) = (0, 0), the right-angle vertex</p>
                <p>OG = √((3 − 2)² + (4 − 8/3)²) = √(1 + 16/9) = 5/3</p>
                <p>GH = √(2² + (8/3)²) = √(100/9) = 10/3</p>
                <p className="font-semibold text-emerald-700">G = (2, 8/3), O = (3, 4), H = (0, 0), OG : GH = 5/3 : 10/3 = 1 : 2</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Incenter and inradius"
            question="Find the incenter and inradius of the triangle A(0, 0), B(4, 0), C(0, 3)."
            solution={
              <>
                <p>Side lengths: a = |BC| = 5, b = |CA| = 3, c = |AB| = 4</p>
                <p>I = (aA + bB + cC) / (a + b + c)</p>
                <p>&nbsp;&nbsp;= (5·(0, 0) + 3·(4, 0) + 4·(0, 3)) / 12 = (12, 12) / 12 = (1, 1)</p>
                <p>Area K = ½ · 4 · 3 = 6, semi-perimeter s = 12 / 2 = 6</p>
                <p>r = K / s = 6 / 6 = 1</p>
                <p className="font-semibold text-emerald-700">I = (1, 1), r = 1 (the incircle touches both axes, as expected)</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
