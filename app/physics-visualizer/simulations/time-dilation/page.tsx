import type { Metadata } from 'next';
import { Callout, CardGrid, ContentSection, DetailPage, Prose, type CardGridItem } from '@/components/content';
import TimeDilationVisualizer from './TimeDilationVisualizer';

export const metadata: Metadata = {
  title: 'Time Dilation Visualization | Physics Visualizer',
  description:
    'Interactive visualization of time dilation from special relativity. Explore how time passes differently for observers in relative motion and the twin paradox.',
  keywords: [
    'time dilation',
    'special relativity',
    'Einstein',
    'Lorentz factor',
    'twin paradox',
    'relativity',
    'spacetime',
    'speed of light',
    'physics visualization',
    'modern physics',
  ],
};

const evidence: CardGridItem[] = [
  {
    icon: '⚛️',
    title: 'Muon decay',
    description:
      "Cosmic ray muons created in the upper atmosphere reach Earth's surface more often than expected. Time dilation extends their lifetime from our perspective, allowing them to travel farther before decaying.",
  },
  {
    icon: '🕰️',
    title: 'Atomic clocks',
    description:
      'In 1971, Hafele and Keating flew atomic clocks around the world on commercial flights. The traveling clocks showed measurable time differences matching relativistic predictions to within experimental error.',
  },
  {
    icon: '🌀',
    title: 'Particle accelerators',
    description:
      'Particles in accelerators like the LHC travel at 99.9999% of light speed. Their measured lifetimes are thousands of times longer than when at rest, exactly as relativity predicts.',
  },
  {
    icon: '🛰️',
    title: 'GPS satellites',
    description:
      'GPS satellites must account for both special and general relativistic time dilation. Without these corrections, GPS would accumulate errors of about 10 kilometers per day.',
  },
];

const keyInsights: CardGridItem[] = [
  {
    icon: '🚗',
    title: 'Low speeds (v ≪ c)',
    description:
      'At everyday speeds, γ ≈ 1 and time dilation is negligible. For a car at 100 km/h, the effect is only about 1 part in 10¹⁶.',
  },
  {
    icon: '🚀',
    title: 'High speeds (v → c)',
    description:
      'As velocity approaches light speed, γ increases dramatically. At 99.99% of c, γ ≈ 70.7, meaning time passes 70 times slower for the moving object.',
  },
  {
    icon: '💡',
    title: 'Speed of light limit',
    description:
      'As v approaches c, γ approaches infinity. This is why nothing with mass can reach or exceed light speed: it would require infinite energy.',
  },
];

const applications: CardGridItem[] = [
  { icon: '🛰️', title: 'GPS navigation', description: 'Requires relativistic corrections for accurate positioning.' },
  { icon: '⚛️', title: 'Particle physics', description: 'Understanding decay rates and collision dynamics.' },
  { icon: '🔭', title: 'Astronomy', description: 'Explaining cosmic ray observations and stellar phenomena.' },
  { icon: '🔬', title: 'Fundamental research', description: 'Testing the limits of special relativity.' },
  { icon: '🚀', title: 'Future space travel', description: 'Enabling interstellar journeys through time dilation effects.' },
];

const misconceptions = [
  {
    myth: "It's just the clocks that slow down",
    correction:
      'No: time itself passes at different rates. All physical processes slow down, including aging, radioactive decay, and chemical reactions.',
  },
  {
    myth: 'The moving observer feels time slow down',
    correction:
      "No: from the moving observer's perspective, their own time passes normally. It's only when comparing with the stationary observer that the difference appears.",
  },
  {
    myth: 'You can travel backward in time',
    correction:
      'No: time dilation only causes time to pass slower, never backward. The arrow of time always points forward in all reference frames.',
  },
];

export default function TimeDilationPage() {
  return (
    <DetailPage
      subject="physics"
      item="time-dilation"
      icon="⏱️"
      description="Discover how time passes at different rates for observers in relative motion, one of Einstein's most remarkable predictions."
    >
      <TimeDilationVisualizer />

      <ContentSection title="What is time dilation?">
        <Prose>
          <p>
            Time dilation is a difference in elapsed time measured by two clocks, either due to relative velocity
            (special relativity) or gravitational potential (general relativity). Moving clocks run slower compared to
            stationary ones, a prediction that has been confirmed by countless experiments.
          </p>
          <p>
            This isn&apos;t just a clock malfunction or measurement error: time itself actually passes at different
            rates. This counterintuitive result emerges from Einstein&apos;s postulate that the speed of light is
            constant in all reference frames.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="The time dilation formula">
        <Prose>
          <p>
            The relationship between time measured by a stationary observer (Δt) and a moving observer (Δt₀) is:
          </p>
        </Prose>
        <Callout tone="formula" title="Time dilation and the Lorentz factor" className="my-4">
          <div className="space-y-1 font-mono text-base">
            <p>Δt = γΔt₀</p>
            <p>γ = 1/√(1 - v²/c²)</p>
          </div>
        </Callout>
        <Prose>
          <p>Where:</p>
          <ul>
            <li><strong>γ</strong> (gamma) = Lorentz factor</li>
            <li><strong>v</strong> = relative velocity between observers</li>
            <li><strong>c</strong> = speed of light (299,792,458 m/s)</li>
            <li><strong>Δt₀</strong> = proper time (time in moving frame)</li>
            <li><strong>Δt</strong> = dilated time (time in stationary frame)</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="The twin paradox">
        <Prose>
          <p>
            One of the most famous thought experiments in relativity involves identical twins. One twin stays on Earth
            while the other travels on a high-speed rocket to a distant star and returns. When they reunite:
          </p>
        </Prose>
        <Callout tone="example" title="The traveling twin ages less" className="mt-4">
          <p className="mb-2">
            Due to time dilation, less time passes for the traveling twin. At 90% the speed of light, only 4.4 years
            pass for the traveler while 10 years pass on Earth.
          </p>
          <p>
            This is not a paradox but a real physical effect. The asymmetry comes from the fact that the traveling twin
            must accelerate to turn around, breaking the symmetry between the twins.
          </p>
        </Callout>
      </ContentSection>

      <ContentSection title="Experimental evidence">
        <CardGrid items={evidence} />
      </ContentSection>

      <ContentSection title="Key insights">
        <CardGrid items={keyInsights} columns={3} />
      </ContentSection>

      <ContentSection title="Practical applications">
        <CardGrid items={applications} columns={3} />
      </ContentSection>

      <ContentSection title="Common misconceptions">
        <div className="space-y-3">
          {misconceptions.map((m) => (
            <Callout key={m.myth} tone="warning" title={`Myth: “${m.myth}”`}>
              {m.correction}
            </Callout>
          ))}
        </div>
      </ContentSection>

      <ContentSection title="Interstellar travel">
        <Prose>
          <p>Time dilation offers a potential solution to interstellar travel. At high relativistic speeds:</p>
          <ul>
            <li>
              A trip to Alpha Centauri (4.3 light-years) at 99.9% light speed takes 4.3 years on Earth but only 2 months
              for the traveler
            </li>
            <li>
              At 99.99% light speed, travelers could reach the center of our galaxy (27,000 light-years) in about 380
              years of their own time
            </li>
            <li>
              The challenge is achieving such speeds: it requires enormous energy and technology we don&apos;t yet
              possess
            </li>
          </ul>
        </Prose>
      </ContentSection>
    </DetailPage>
  );
}
