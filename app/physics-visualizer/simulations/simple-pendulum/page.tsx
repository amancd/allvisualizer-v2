import type { Metadata } from 'next';
import { Callout, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, StepList } from '@/components/content';
import SimplePendulumVisualizer from './SimplePendulumVisualizer';

export const metadata: Metadata = {
  title: 'Simple Pendulum - Physics Visualizer | AllVisualizer',
  description:
    'Interactive simple pendulum. Change length and gravity, drag the bob to any angle, and compare the exact nonlinear motion with the small-angle approximation and its period.',
  keywords: ['simple pendulum', 'pendulum period', 'small-angle approximation', 'nonlinear pendulum', 'elliptic integral', 'gravity', 'physics simulation'],
};

// T / T₀ = 1 / AGM(1, cos(θ₀/2)) for a pendulum released from rest at θ₀.
const periodRatios = [
  { angle: '5°', ratio: '1.0005', error: '0.05%' },
  { angle: '10°', ratio: '1.0019', error: '0.2%' },
  { angle: '20°', ratio: '1.0077', error: '0.8%' },
  { angle: '30°', ratio: '1.0174', error: '1.7%' },
  { angle: '45°', ratio: '1.0400', error: '4.0%' },
  { angle: '60°', ratio: '1.0732', error: '7.3%' },
  { angle: '90°', ratio: '1.1803', error: '18%' },
  { angle: '120°', ratio: '1.3729', error: '37%' },
  { angle: '150°', ratio: '1.7622', error: '76%' },
  { angle: '170°', ratio: '2.4394', error: '144%' },
];

export default function SimplePendulumPage() {
  return (
    <DetailPage subject="physics" item="simple-pendulum">
      <SimplePendulumVisualizer />

      <ContentSection title="How a pendulum swings">
        <Prose>
          <p>
            A pendulum bob of mass m hangs on a light rod of length L. When it is pulled to an angle θ, gravity has a
            component mg sin θ along the arc, pointing back toward the bottom. Newton&apos;s second law along the arc gives{' '}
            <strong>θ&apos;&apos; = −(g/L) sin θ</strong>. The mass cancels, so a heavy bob and a light bob on the same
            string swing together.
          </p>
          <p>
            This equation is <strong>nonlinear</strong> because of the sin θ. For small angles sin θ ≈ θ (in radians), and
            the equation becomes θ&apos;&apos; = −(g/L) θ, which is simple harmonic motion with ω₀ = √(g/L). Its period
            T₀ = 2π√(L/g) does not depend on the amplitude. That is what Galileo noticed, and it made pendulum clocks
            possible.
          </p>
          <p>
            At larger angles sin θ is noticeably smaller than θ, so the restoring force is weaker than the linear model
            predicts and the real pendulum takes longer to come back. The visualizer runs both models side by side: the
            solid bob follows the exact equation, the faded bob follows the small-angle one. Release them at 10° and they
            stay together for many swings. Release them at 120° and the exact bob falls behind within one cycle.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Callout tone="formula" title="Equation of motion">
            <Formula
              where={[
                { symbol: 'θ', meaning: 'angle from the vertical (rad)' },
                { symbol: 'g', meaning: 'gravitational field strength (m/s²)' },
                { symbol: 'L', meaning: 'length from pivot to the bob’s centre (m)' },
              ]}
            >
              θ&apos;&apos; = −(g/L) sin θ
            </Formula>
          </Callout>
          <Callout tone="formula" title="Small-angle period">
            <Formula>T₀ = 2π √(L/g), &nbsp; θ(t) ≈ θ₀ cos(ω₀t), &nbsp; ω₀ = √(g/L)</Formula>
          </Callout>
          <Callout tone="formula" title="Exact period (any amplitude)">
            <Formula
              where={[
                { symbol: 'AGM', meaning: 'arithmetic-geometric mean: repeatedly replace (a, b) with ((a+b)/2, √(ab))' },
              ]}
            >
              T = T₀ / AGM(1, cos(θ₀/2))
            </Formula>
          </Callout>
          <Callout tone="formula" title="Series approximation">
            <Formula>T ≈ T₀ (1 + θ₀²/16 + 11θ₀⁴/3072 + …)</Formula>
          </Callout>
        </div>
        <Callout tone="note" title="Where the AGM comes from" className="mt-4">
          The exact period is T = (4/ω₀) K(k) with k = sin(θ₀/2), where K is the complete elliptic integral of the first
          kind. Gauss showed that K(k) = π / (2 AGM(1, √(1 − k²))), and √(1 − k²) = cos(θ₀/2). The AGM converges so
          quickly that four or five iterations give full double precision.
        </Callout>
      </ContentSection>

      <ContentSection title="How much does amplitude matter?">
        <DataTable
          caption="Exact period divided by the small-angle period, for a pendulum released from rest."
          columns={[
            { header: 'Release angle θ₀', cell: 'angle' },
            { header: 'T / T₀', cell: 'ratio', numeric: true },
            { header: 'Error of T₀', cell: 'error', numeric: true },
          ]}
          rows={periodRatios}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Drag anywhere on the picture to pull the bob out to a release angle, then let go. Both bobs start from rest at that angle.',
            'Start with a small angle (about 10°). The two bobs and the two graph traces stay on top of each other.',
            'Now try 90° or more. The exact bob lags behind, and the measured period grows well past T₀.',
            'Change L or switch between Earth, Moon, Mars and Jupiter. The period scales as √(L/g), but the ratio T/T₀ depends only on the angle.',
            'Compare the measured period with the exact formula. They agree to about a millisecond.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: A pendulum on the Moon"
            question="A 1.0 m pendulum swings with small amplitude. Find its period on Earth (g = 9.81 m/s²) and on the Moon (g = 1.62 m/s²). How long must the pendulum be on the Moon to have the same period as on Earth?"
            solution={
              <>
                <p>Earth: T₀ = 2π√(1.0 / 9.81) = 2π × 0.319 = 2.01 s</p>
                <p>Moon: T₀ = 2π√(1.0 / 1.62) = 2π × 0.786 = 4.94 s</p>
                <p>Same period needs the same L/g: L<sub>Moon</sub> = 1.0 × 1.62 / 9.81 = 0.165 m</p>
                <p className="font-semibold text-emerald-700">2.01 s on Earth, 4.94 s on the Moon; a 16.5 cm pendulum on the Moon</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: When the approximation breaks"
            question="A 2.0 m pendulum on Earth is released from rest at 60°. Estimate its period using the small-angle formula and the first correction term, and compare with the exact value."
            solution={
              <>
                <p>T₀ = 2π√(2.0 / 9.81) = 2.837 s</p>
                <p>θ₀ = 60° = π/3 = 1.047 rad, so θ₀²/16 = 1.097 / 16 = 0.0685</p>
                <p>First correction: T ≈ 2.837 × 1.0685 = 3.031 s</p>
                <p>Exact: T = T₀ / AGM(1, cos 30°) = 2.837 / AGM(1, 0.8660) = 2.837 × 1.0732 = 3.045 s</p>
                <p className="font-semibold text-emerald-700">
                  T₀ underestimates by about 7%; the one-term correction is within 0.5% of the exact 3.04 s
                </p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
