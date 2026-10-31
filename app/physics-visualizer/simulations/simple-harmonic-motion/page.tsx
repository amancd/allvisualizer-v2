import type { Metadata } from 'next';
import { Building2, Car, Music, Watch } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DetailPage, Formula, PracticeProblem, Prose, StepList } from '@/components/content';
import SimpleHarmonicMotionVisualizer from './SimpleHarmonicMotionVisualizer';

export const metadata: Metadata = {
  title: 'Simple Harmonic Motion - Physics Visualizer | AllVisualizer',
  description:
    "Interactive mass-spring simulation of simple harmonic motion. Change mass and spring constant, drag to set the amplitude, and watch live position, velocity, acceleration and energy graphs.",
  keywords: ['simple harmonic motion', 'SHM', "Hooke's law", 'spring constant', 'period', 'angular frequency', 'reference circle', 'physics simulation'],
};

const applications = [
  { icon: Watch, title: 'Clocks and watches', description: 'A balance wheel on a hairspring or a quartz crystal oscillates with a steady period that keeps time.' },
  { icon: Building2, title: 'Buildings and bridges', description: 'Structures sway like springs. Engineers compute their natural periods so wind and earthquakes do not excite them.' },
  { icon: Music, title: 'Musical instruments', description: 'Strings, tuning forks and air columns vibrate in nearly simple harmonic motion, producing pure tones.' },
  { icon: Car, title: 'Vehicle suspension', description: 'Car springs let the body oscillate over bumps; shock absorbers then damp the motion out.' },
];

export default function SimpleHarmonicMotionPage() {
  return (
    <DetailPage subject="physics" item="simple-harmonic-motion">
      <SimpleHarmonicMotionVisualizer />

      <ContentSection title="What is simple harmonic motion?">
        <Prose>
          <p>
            A spring pulls back on a mass with a force proportional to how far it is stretched or squashed. This is{' '}
            <strong>Hooke&apos;s law</strong>, F = −kx. The minus sign means the force always points back toward
            equilibrium. Combine it with Newton&apos;s second law and you get a = −(k/m)x: the acceleration is
            proportional to the displacement and opposite to it.
          </p>
          <p>
            Any system that obeys this rule oscillates sinusoidally, x(t) = A cos(ωt + φ). The amplitude A depends on how
            you start the motion, but the period does not: a stiffer spring (bigger k) makes it faster, and a heavier mass
            (bigger m) makes it slower. Doubling the amplitude does not change the period at all.
          </p>
          <p>
            Velocity and acceleration are also sinusoids. Velocity is a quarter cycle ahead of position, so the mass is
            fastest as it passes through x = 0. Acceleration is exactly opposite to position, so it is largest at the
            turning points where the mass momentarily stops.
          </p>
          <p>
            The <strong>reference circle</strong> under the spring shows why the motion is a cosine. A point going round a
            circle of radius A at constant angular speed ω has a horizontal coordinate A cos(ωt). Its shadow on the
            horizontal axis moves exactly like the mass, which is why ω is called the angular frequency even though
            nothing is rotating.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Callout tone="formula" title="Equation of motion">
            <Formula where={[{ symbol: 'k', meaning: 'spring constant (N/m)' }, { symbol: 'm', meaning: 'mass (kg)' }]}>
              F = −kx &nbsp;⇒&nbsp; a = −(k/m) x = −ω²x
            </Formula>
          </Callout>
          <Callout tone="formula" title="Solution">
            <Formula
              where={[
                { symbol: 'A', meaning: 'amplitude (m)' },
                { symbol: 'φ', meaning: 'phase constant, set by the starting conditions' },
              ]}
            >
              x(t) = A cos(ωt + φ)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Angular frequency, period and frequency">
            <Formula>
              ω = √(k/m), &nbsp; T = 2π√(m/k), &nbsp; f = 1/T
            </Formula>
          </Callout>
          <Callout tone="formula" title="Velocity, acceleration and energy">
            <Formula>
              v<sub>max</sub> = Aω, &nbsp; a<sub>max</sub> = Aω², &nbsp; E = ½mv² + ½kx² = ½kA²
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Drag the blue block left or right to set the starting displacement, then let go. It is released from rest, so that displacement is the amplitude.',
            'Change the mass and spring constant and watch ω, T and f update. Quadruple the mass and the period doubles.',
            'Compare the graph traces: v (green) peaks a quarter period before x (blue), and a (orange) is always the mirror image of x.',
            'Watch the energy bars. Kinetic and spring potential energy trade places twice per cycle while the total stays at ½kA².',
            'Follow the dot on the reference circle. Its horizontal position always matches the block.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Period of a spring"
            question="A 0.50 kg mass hangs on a spring with k = 200 N/m. Find the angular frequency, the period and the frequency of its oscillation."
            solution={
              <>
                <p>ω = √(k/m) = √(200 / 0.50) = √400 = 20 rad/s</p>
                <p>T = 2π/ω = 2π / 20 = 0.314 s</p>
                <p>f = 1/T = 3.18 Hz</p>
                <p className="font-semibold text-emerald-700">ω = 20 rad/s, T ≈ 0.31 s, f ≈ 3.2 Hz</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Maximum speed from energy"
            question="A 2.0 kg block on a spring with k = 50 N/m is pulled 0.10 m from equilibrium and released. What is its maximum speed, and what is its speed when x = 0.06 m?"
            solution={
              <>
                <p>Total energy: E = ½kA² = ½ × 50 × 0.10² = 0.25 J</p>
                <p>At x = 0 all of it is kinetic: ½mv<sub>max</sub>² = 0.25 J</p>
                <p>v<sub>max</sub> = √(2 × 0.25 / 2.0) = 0.50 m/s (check: Aω = 0.10 × √(50/2) = 0.50 m/s)</p>
                <p>At x = 0.06 m: ½mv² = 0.25 − ½ × 50 × 0.06² = 0.25 − 0.09 = 0.16 J</p>
                <p>v = √(2 × 0.16 / 2.0) = 0.40 m/s</p>
                <p className="font-semibold text-emerald-700">v<sub>max</sub> = 0.50 m/s, v(0.06 m) = 0.40 m/s</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
