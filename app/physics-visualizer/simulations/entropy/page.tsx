import type { Metadata } from 'next';
import {
  Callout,
  CardGrid,
  ContentSection,
  DataTable,
  DetailPage,
  Formula,
  PracticeProblem,
  Prose,
  StepList,
  type CardGridItem,
} from '@/components/content';
import EntropyVisualizer from './EntropyVisualizer';

export const metadata: Metadata = {
  title: 'Entropy and the Second Law - Physics Visualizer | AllVisualizer',
  description:
    'Watch a gas spread out after a partition is removed, count microstates with S = k ln Ω, and see why heat always flows from hot to cold. An interactive guide to entropy and irreversibility.',
  keywords: ['entropy', 'second law of thermodynamics', 'microstates', 'Boltzmann entropy', 'free expansion', 'irreversibility', 'heat flow'],
};

const ideas: CardGridItem[] = [
  {
    title: 'Microstates and macrostates',
    description:
      'A macrostate is what you measure, such as "30 particles on the left". A microstate says exactly which particles are where. Many microstates share one macrostate.',
  },
  {
    title: 'Entropy counts possibilities',
    description: 'S = k ln Ω measures how many microstates are compatible with what you see. Spread-out states have vastly more.',
  },
  {
    title: 'Irreversibility is statistics',
    description:
      'The laws of motion run equally well backwards. Processes look one-way because the reverse requires landing in an absurdly rare set of microstates.',
  },
  {
    title: 'Heat flows downhill',
    description:
      'Moving heat Q from hot to cold raises entropy by Q/T_cold − Q/T_hot > 0. The reverse would lower it, so it never happens on its own.',
  },
];

// Ω for the most likely (even) split versus the probability that all particles are on one side.
const scaling = [2, 10, 100, 1000, 6.02e23].map((N) => ({
  N: N > 1e6 ? '6 × 10²³ (1 mol)' : N.toLocaleString('en-US'),
  pAllLeft: N > 1e6 ? '10^(−1.8 × 10²³)' : N <= 10 ? `1 / ${2 ** N}` : `≈ 10^−${Math.round(N * Math.log10(2))}`,
  fluctuation: N > 1e6 ? '≈ 10⁻¹²' : `≈ ${(1 / (2 * Math.sqrt(N))).toFixed(N >= 1000 ? 3 : 2)}`,
}));

export default function EntropyPage() {
  return (
    <DetailPage
      subject="physics"
      item="entropy"
      title="Entropy and the Second Law"
      description="Why does a gas spread out but never gather itself back into a corner? Count the microstates and the direction of time appears."
    >
      <EntropyVisualizer />

      <ContentSection title="What entropy measures">
        <Prose>
          <p>
            Put N gas particles in a box and ask only how many are in the left half. If n are on the left, the number of
            ways to choose which particles those are is the binomial coefficient <strong>Ω = C(N, n)</strong>. Boltzmann
            defined the entropy of that macrostate as <strong>S = k ln Ω</strong>.
          </p>
          <p>
            With the partition in place every particle is on the left, so Ω = 1 and S = 0. Once the partition is gone the
            even split has by far the most microstates: for N = 100 there are about 10²⁹ ways to split 50/50 but only one
            way to have all 100 on the left. Each particle moves at random, so the gas drifts towards the states that
            make up almost all of the possibilities and stays there.
          </p>
          <p>
            That is the <strong>second law of thermodynamics</strong>: the entropy of an isolated system does not decrease.
            It is not a force but overwhelming probability. With 4 particles you will see them all return to the left
            within seconds. With a mole of gas the odds are 1 in 2^(6 × 10²³), so it never happens.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="grid gap-4 lg:grid-cols-2">
          <Callout tone="formula" title="Boltzmann entropy">
            <Formula
              where={[
                { symbol: 'k', meaning: 'Boltzmann constant, 1.381 × 10⁻²³ J/K' },
                { symbol: 'Ω', meaning: 'number of microstates for the macrostate' },
              ]}
            >
              S = k ln Ω
            </Formula>
          </Callout>
          <Callout tone="formula" title="Particles split between two halves">
            <Formula where={[{ symbol: 'n', meaning: 'particles in the left half' }]}>
              Ω(n) = C(N, n) = N! / (n! (N − n)!)
            </Formula>
            <p className="mt-2 text-sm">
              ln N! is computed as ln 1 + ln 2 + … + ln N, so huge numbers never overflow.
            </p>
          </Callout>
          <Callout tone="formula" title="Clausius entropy change">
            <Formula
              where={[
                { symbol: 'Q', meaning: 'heat transferred reversibly (J)' },
                { symbol: 'T', meaning: 'absolute temperature (K)' },
              ]}
            >
              ΔS = Q / T
            </Formula>
          </Callout>
          <Callout tone="formula" title="Heat flowing from hot to cold">
            <Formula>ΔS<sub>total</sub> = Q / T<sub>cold</sub> − Q / T<sub>hot</sub> &gt; 0</Formula>
            <div className="mt-2">
              <Formula>Free expansion to double volume: ΔS = N k ln 2</Formula>
            </div>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose the number of particles N. Changing N puts all particles back in the left half.',
            'Press Remove partition and watch the blue fraction-on-the-left curve fall to about one half while S / Smax climbs to about 1.',
            'Try N = 4 or 6. The curve jumps around and the gas regularly gathers on the left again; the counter shows how often.',
            'Now try N = 400. The curve barely wiggles and the probability of a return, 2^−N, is around 10^−120.',
            'In the heat-flow panel, set the two starting temperatures and press Start contact. The hot block loses less entropy than the cold block gains, so the total rises until both reach the average temperature.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Why big systems never run backwards">
        <DataTable
          caption="Probability that all particles are found in the left half, and typical fluctuation of the left fraction around ½"
          columns={[
            { header: 'Particles N', cell: 'N' },
            { header: 'P(all on left) = 2^−N', cell: 'pAllLeft' },
            { header: 'Typical fluctuation', cell: 'fluctuation', numeric: true },
          ]}
          rows={scaling}
        />
      </ContentSection>

      <ContentSection title="Key ideas">
        <CardGrid items={ideas} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Counting microstates"
            question="Six particles share a box. How many microstates have 3 on the left, and how many have all 6 on the left? What is the entropy difference between the two macrostates, in units of k?"
            solution={
              <>
                <p>Ω(3) = C(6, 3) = 6! / (3! 3!) = 20</p>
                <p>Ω(6) = C(6, 6) = 1</p>
                <p>ΔS = k ln 20 − k ln 1 = k ln 20</p>
                <p className="font-semibold text-emerald-700">ΔS ≈ 3.00 k; the even split is 20 times as likely</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Heat between two reservoirs"
            question="1200 J of heat flows from a reservoir at 600 K to one at 300 K. Find the entropy change of each reservoir and of the universe."
            solution={
              <>
                <p>Hot reservoir: ΔS = −Q / T = −1200 / 600 = −2.0 J/K</p>
                <p>Cold reservoir: ΔS = +Q / T = 1200 / 300 = +4.0 J/K</p>
                <p>Total: −2.0 + 4.0 = +2.0 J/K</p>
                <p className="font-semibold text-emerald-700">ΔS<sub>universe</sub> = +2.0 J/K &gt; 0, so the process is allowed</p>
                <p>Reversing it would give −2.0 J/K, which is why heat never flows from cold to hot on its own.</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
