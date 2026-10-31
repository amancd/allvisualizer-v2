import type { Metadata } from 'next';
import { Callout, CardGrid, ContentSection, DetailPage, Formula, PracticeProblem, Prose, StepList } from '@/components/content';
import WavesVisualizer from './WavesVisualizer';

export const metadata: Metadata = {
  title: 'Wave Functions - Math Visualizer | AllVisualizer',
  description:
    'Add sine waves with adjustable amplitude, frequency and phase, build square, sawtooth and triangle waves from Fourier harmonics, and see beats from two close frequencies.',
  keywords: ['sine wave', 'superposition', 'harmonics', 'Fourier series', 'Gibbs phenomenon', 'beats', 'interference'],
};

const applications = [
  { title: 'Music and sound', description: 'An instrument note is a fundamental plus harmonics. Their relative strengths are what make a violin sound different from a flute.' },
  { title: 'Tuning by beats', description: 'Musicians tune by listening for beats between two strings and adjusting until the beating slows to zero.' },
  { title: 'Signal processing', description: 'Audio compression, equalisers and radio receivers all work on the frequency components of a signal.' },
  { title: 'Noise cancellation', description: 'Headphones play a copy of the noise shifted by 180°, so the two waves interfere destructively.' },
];

export default function WavesPage() {
  return (
    <DetailPage
      subject="math"
      item="waves"
      description="Add sine waves together, build square, sawtooth and triangle waves from their harmonics, and see how two close frequencies produce beats."
    >
      <WavesVisualizer />

      <ContentSection title="Adding waves together">
        <Prose>
          <p>
            A sine wave y = A sin(2πft + φ) has three dials: <strong>amplitude</strong> A (how tall), <strong>frequency</strong> f
            (cycles per second) and <strong>phase</strong> φ (where in its cycle it starts). When two waves meet, their values simply
            add at every instant. This is the <strong>principle of superposition</strong>.
          </p>
          <p>
            Waves of the same frequency that are in phase reinforce each other (constructive interference). Shift one by 180° and
            they cancel (destructive interference). Two waves with slightly different frequencies drift in and out of phase, so the
            loudness of their sum rises and falls: these are <strong>beats</strong>.
          </p>
          <p>
            Fourier showed that the idea also runs backwards: any reasonable periodic signal can be written as a sum of sines at
            whole-number multiples of its base frequency. A square wave, for example, uses only the odd harmonics with amplitudes
            1, 1/3, 1/5, ... Near a jump, a finite sum always overshoots by about 9% of the jump, however many terms you take. This
            is the <strong>Gibbs phenomenon</strong>.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="A single sine wave">
            <Formula
              where={[
                { symbol: 'A', meaning: 'amplitude' },
                { symbol: 'f', meaning: 'frequency in hertz; the period is T = 1/f' },
                { symbol: 'φ', meaning: 'phase, the starting angle' },
              ]}
            >
              y(t) = A sin(2πft + φ)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Beats (sum-to-product)">
            <Formula where={[{ symbol: '|f₁ − f₂|', meaning: 'beat frequency: how many loud-quiet cycles per second' }]}>
              sin(2πf₁t) + sin(2πf₂t) = 2 cos(π(f₁ − f₂)t) · sin(π(f₁ + f₂)t)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Fourier series (period 1)">
            <Formula>
              square(t) = (4/π) Σ<sub>k odd</sub> sin(2πkt) / k
              <br />
              sawtooth(t) = (2/π) Σ<sub>k ≥ 1</sub> (−1)<sup>k+1</sup> sin(2πkt) / k
              <br />
              triangle(t) = (8/π²) Σ<sub>k odd</sub> (−1)<sup>(k−1)/2</sup> sin(2πkt) / k²
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Compose waves: switch each wave on or off and set its amplitude, frequency and phase. The thick black curve is their sum. Try the Constructive and Destructive presets.',
            'Fourier series: pick a target shape and raise N. Watch the partial sum hug the dashed target more closely, and the spectrum fill in.',
            'Look at the corners of the square or sawtooth wave as N grows. The overshoot gets narrower, but the overshoot percentage stays near 9%.',
            'Beats: set f₁ and f₂ a little apart. The dashed envelope pulses at |f₁ − f₂| times per second; make them equal and the beating stops.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Where this shows up">
        <CardGrid items={applications} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Beats from two tuning forks"
            question="Two tuning forks of 440 Hz and 444 Hz are struck together. How many beats per second are heard, and what pitch does the combined sound have?"
            solution={
              <>
                <p>Beat frequency = |f₁ − f₂| = |440 − 444| = 4 Hz</p>
                <p>The sum oscillates at the average frequency (f₁ + f₂)/2 = (440 + 444)/2 = 442 Hz</p>
                <p className="font-semibold text-emerald-700">4 beats per second, heard at a pitch of 442 Hz</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Square-wave harmonics"
            question="A square wave of amplitude 1 and frequency 50 Hz is built from its Fourier series. What are the frequencies and amplitudes of its first three non-zero harmonics?"
            solution={
              <>
                <p>Only odd harmonics k = 1, 3, 5 appear, each with amplitude 4/(πk).</p>
                <p>k = 1: 50 Hz, amplitude 4/π ≈ 1.273</p>
                <p>k = 3: 150 Hz, amplitude 4/(3π) ≈ 0.424</p>
                <p>k = 5: 250 Hz, amplitude 4/(5π) ≈ 0.255</p>
                <p className="font-semibold text-emerald-700">50, 150 and 250 Hz with amplitudes 1.273, 0.424 and 0.255</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
