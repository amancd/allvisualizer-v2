import type { Metadata } from 'next';
import { Callout, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, StepList } from '@/components/content';
import DampedDrivenOscillationsVisualizer from './DampedDrivenOscillationsVisualizer';

export const metadata: Metadata = {
  title: 'Damping & Resonance - Physics Visualizer | AllVisualizer',
  description:
    'Interactive damped, driven oscillator. Explore underdamped, critically damped and overdamped motion, then drive the spring and trace the resonance curve, phase lag and Q factor.',
  keywords: ['damped oscillation', 'driven oscillator', 'resonance', 'Q factor', 'critical damping', 'phase lag', 'resonance curve', 'physics simulation'],
};

const regimes = [
  { regime: 'Underdamped', condition: 'γ < ω₀  (b < 2√(km))', behaviour: 'Oscillates at ω₁ = √(ω₀² − γ²) while the amplitude decays as e^(−γt)' },
  { regime: 'Critically damped', condition: 'γ = ω₀  (b = 2√(km))', behaviour: 'Fastest return to equilibrium with no overshoot' },
  { regime: 'Overdamped', condition: 'γ > ω₀  (b > 2√(km))', behaviour: 'Slow, non-oscillating return; the slow rate is γ − √(γ² − ω₀²)' },
];

export default function DampedDrivenOscillationsPage() {
  return (
    <DetailPage subject="physics" item="damped-driven-oscillations">
      <DampedDrivenOscillationsVisualizer />

      <ContentSection title="Damping: where the energy goes">
        <Prose>
          <p>
            A real spring does not oscillate forever. Air resistance, internal friction or a shock absorber add a force
            that opposes the velocity, F = −bv. The equation of motion becomes{' '}
            <strong>m x&apos;&apos; + b x&apos; + k x = 0</strong>. Dividing by m, two rates control
            everything: the natural frequency ω₀ = √(k/m) and the damping rate γ = b/2m.
          </p>
          <p>
            When γ is smaller than ω₀ the mass still oscillates, slightly slower than ω₀, inside an envelope that shrinks
            like e^(−γt). Energy, which is proportional to amplitude squared, decays like e^(−2γt). Increase b until γ
            equals ω₀ and the oscillation disappears: this is <strong>critical damping</strong>, the quickest way back to
            rest without overshooting, which is what car suspensions and door closers aim for. Beyond that the system is
            overdamped and creeps back slowly.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Driving and resonance">
        <Prose>
          <p>
            Now push the mass with a periodic force F₀ cos(ω<sub>d</sub>t). At first the motion is a mix of the driven
            response and the natural, decaying oscillation (the <strong>transient</strong>). After a few decay times 1/γ
            the transient is gone and the mass oscillates at the driving frequency, not its own, with a fixed amplitude A
            and a fixed phase lag δ behind the force. This is the <strong>steady state</strong>.
          </p>
          <p>
            Drive slowly and the spring simply follows the force: A ≈ F₀/k and the motion is in phase. Drive very fast
            and the mass cannot keep up: A falls towards zero and the motion is half a cycle out of phase. In between,
            near ω₀, the force pushes in step with the velocity, energy pours in on every cycle, and the amplitude peaks.
            That is <strong>resonance</strong>. The lighter the damping, the taller and narrower the peak.
          </p>
          <p>
            The <strong>quality factor</strong> Q = ω₀/2γ measures how sharp the resonance is. At resonance the
            amplitude is about Q times the static stretch F₀/k, the peak&apos;s width at 1/√2 of its height is about
            ω₀/Q, and a free oscillator rings for roughly Q/π cycles before its energy drops to e<sup>−2</sup> of the
            start.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Callout tone="formula" title="Equation of motion">
            <Formula
              where={[
                { symbol: 'b', meaning: 'damping coefficient (N·s/m)' },
                { symbol: 'F₀, ω_d', meaning: 'driving amplitude (N) and angular frequency (rad/s)' },
              ]}
            >
              m x&apos;&apos; + b x&apos; + k x = F₀ cos(ω<sub>d</sub>t)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Natural frequency, damping rate, Q">
            <Formula>
              ω₀ = √(k/m), &nbsp; γ = b/(2m), &nbsp; Q = ω₀/(2γ) = √(km)/b
            </Formula>
          </Callout>
          <Callout tone="formula" title="Free underdamped motion">
            <Formula>
              x(t) = A₀ e<sup>−γt</sup> cos(ω₁t − φ), &nbsp; ω₁ = √(ω₀² − γ²)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Steady-state amplitude and phase">
            <Formula>
              A(ω<sub>d</sub>) = (F₀/m) / √((ω₀² − ω<sub>d</sub>²)² + (2γω<sub>d</sub>)²)
              <br />
              tan δ = 2γω<sub>d</sub> / (ω₀² − ω<sub>d</sub>²)
            </Formula>
          </Callout>
        </div>
        <Callout tone="note" title="The peak is not exactly at ω₀" className="mt-4">
          The amplitude is largest at ω<sub>r</sub> = √(ω₀² − 2γ²), a little below ω₀. For light damping (large Q) the
          difference is tiny. The phase lag, however, is exactly 90° at ω<sub>d</sub> = ω₀ for any damping, because there
          the force is in step with the velocity.
        </Callout>
      </ContentSection>

      <ContentSection title="The three damping regimes">
        <DataTable
          columns={[
            { header: 'Regime', cell: 'regime' },
            { header: 'Condition', cell: 'condition' },
            { header: 'Behaviour', cell: 'behaviour' },
          ]}
          rows={regimes}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'With the driving force off, drag the block aside and let go. The dashed curves show the envelope ±A₀e^(−γt) that the peaks follow.',
            'Increase b and watch the regime label change. Press Critical to set b = 2√(km) and see the fastest non-oscillating return.',
            'Turn the driving force on and press Reset to start from rest. The transient dies out and the motion settles onto the dashed steady-state amplitude.',
            'Sweep ω_d across ω₀. The red dot moves along the resonance curve, and the phase lag passes through 90°.',
            'Lower b to raise Q and sharpen the peak. Set b = 0 and drive near (not at) ω₀ to see beats.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Classify the damping"
            question="A 2.0 kg mass on a spring with k = 50 N/m has damping b = 4.0 N·s/m. Find ω₀, γ, the damping regime, Q, and the time for the amplitude to halve when it oscillates freely."
            solution={
              <>
                <p>ω₀ = √(50 / 2.0) = 5.0 rad/s</p>
                <p>γ = b / 2m = 4.0 / 4.0 = 1.0 s⁻¹</p>
                <p>γ &lt; ω₀, so the motion is underdamped (critical b would be 2√(km) = 20 N·s/m)</p>
                <p>Q = ω₀ / 2γ = 5.0 / 2.0 = 2.5</p>
                <p>Amplitude halves when e^(−γt) = ½: t = ln 2 / γ = 0.693 s</p>
                <p className="font-semibold text-emerald-700">Underdamped, Q = 2.5, half-life of amplitude ≈ 0.69 s</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Amplitude at resonance"
            question="A 1.0 kg mass on a spring with k = 100 N/m and b = 0.50 N·s/m is driven by F₀ = 2.0 N. Find the steady-state amplitude and phase lag when ω_d = ω₀, and when ω_d = 5.0 rad/s."
            solution={
              <>
                <p>ω₀ = √(100 / 1.0) = 10 rad/s, γ = 0.50 / 2.0 = 0.25 s⁻¹, Q = 10 / 0.5 = 20</p>
                <p>At ω_d = ω₀ the first term vanishes: A = (F₀/m) / (2γω₀) = 2.0 / (2 × 0.25 × 10) = 0.40 m</p>
                <p>Check: Q × F₀/k = 20 × 0.020 m = 0.40 m. Phase lag δ = 90°.</p>
                <p>At ω_d = 5.0: ω₀² − ω_d² = 100 − 25 = 75, 2γω_d = 2.5</p>
                <p>A = 2.0 / √(75² + 2.5²) = 2.0 / 75.04 = 0.0267 m</p>
                <p>tan δ = 2.5 / 75 → δ = 1.9°</p>
                <p className="font-semibold text-emerald-700">0.40 m at resonance (δ = 90°); 2.7 cm at 5 rad/s (δ ≈ 1.9°)</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
