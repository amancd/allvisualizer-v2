import type { Metadata } from 'next';
import { Callout, CardGrid, ContentSection, DetailPage, Prose, type CardGridItem } from '@/components/content';
import CarnotCycleVisualizer from './CarnotCycleVisualizer';

export const metadata: Metadata = {
  title: 'Carnot Cycle Visualization | Physics Visualizer',
  description:
    'Interactive visualization of the Carnot cycle - the most efficient thermodynamic cycle. Explore isothermal and adiabatic processes, PV diagrams, and thermal efficiency.',
  keywords: [
    'Carnot cycle',
    'thermodynamic cycle',
    'heat engine',
    'PV diagram',
    'isothermal process',
    'adiabatic process',
    'thermal efficiency',
    'reversible process',
    'physics visualization',
    'thermodynamics',
  ],
};

/** One card per stage of the cycle, with the stage's energy equations underneath. */
const processes: CardGridItem[] = [
  {
    title: '1. Isothermal expansion (A → B)',
    description: (
      <>
        <p>
          The gas expands at constant high temperature T<sub>H</sub> while in contact with the hot reservoir. The system
          absorbs heat Q<sub>H</sub> and does work on the surroundings.
        </p>
        <p className="mt-2 font-mono text-xs">
          ΔU = 0, W = Q<sub>H</sub> = nRT<sub>H</sub>ln(V<sub>B</sub>/V<sub>A</sub>)
        </p>
      </>
    ),
  },
  {
    title: '2. Adiabatic expansion (B → C)',
    description: (
      <>
        <p>
          The gas continues to expand without heat exchange (thermally isolated). Temperature decreases from T<sub>H</sub>{' '}
          to T<sub>C</sub> as the gas does work using its internal energy.
        </p>
        <p className="mt-2 font-mono text-xs">
          Q = 0, W = nC<sub>V</sub>(T<sub>H</sub> - T<sub>C</sub>), PV<sup>γ</sup> = constant
        </p>
      </>
    ),
  },
  {
    title: '3. Isothermal compression (C → D)',
    description: (
      <>
        <p>
          The gas is compressed at constant low temperature T<sub>C</sub> while in contact with the cold reservoir. The
          system releases heat Q<sub>C</sub> and work is done on the gas.
        </p>
        <p className="mt-2 font-mono text-xs">
          ΔU = 0, W = -Q<sub>C</sub> = nRT<sub>C</sub>ln(V<sub>D</sub>/V<sub>C</sub>)
        </p>
      </>
    ),
  },
  {
    title: '4. Adiabatic compression (D → A)',
    description: (
      <>
        <p>
          The gas is compressed without heat exchange. Temperature increases from T<sub>C</sub> back to T<sub>H</sub> as
          work is done on the gas, returning to the initial state.
        </p>
        <p className="mt-2 font-mono text-xs">
          Q = 0, W = -nC<sub>V</sub>(T<sub>H</sub> - T<sub>C</sub>), PV<sup>γ</sup> = constant
        </p>
      </>
    ),
  },
];

const keyPrinciples: CardGridItem[] = [
  {
    title: 'Reversibility',
    description:
      'All processes in the Carnot cycle are reversible, meaning they can proceed in either direction without any entropy increase. This is an idealization impossible to achieve in practice.',
  },
  {
    title: 'Maximum efficiency',
    description:
      'The Carnot cycle establishes the maximum theoretical efficiency. All real heat engines have lower efficiency due to friction, heat losses, and other irreversibilities.',
  },
  {
    title: 'PV diagram',
    description: (
      <>
        The Carnot cycle forms a closed loop on a PV diagram. The area enclosed represents the net work output per
        cycle: W<sub>net</sub> = Q<sub>H</sub> - Q<sub>C</sub>.
      </>
    ),
  },
  {
    title: 'Temperature reservoirs',
    description: (
      <>
        The cycle requires two thermal reservoirs at constant temperatures T<sub>H</sub> and T<sub>C</sub>. The
        reservoirs are assumed to be so large that their temperatures remain constant.
      </>
    ),
  },
];

const applications: CardGridItem[] = [
  { title: 'Steam turbines', description: 'Power plants approach Carnot efficiency with high-temperature steam.' },
  { title: 'Refrigerators', description: 'The reverse Carnot cycle is the theoretical model for cooling systems.' },
  { title: 'Engine design', description: 'Engineers use Carnot efficiency as a benchmark for optimization.' },
  { title: 'Geothermal power', description: 'Efficiency is limited by the temperature difference between ground and surface.' },
  { title: 'Thermodynamic analysis', description: 'The foundation for understanding all heat engines and refrigerators.' },
];

export default function CarnotCyclePage() {
  return (
    <DetailPage
      subject="physics"
      item="carnot-cycle"
      description="Visualize the most efficient theoretical heat engine cycle, consisting of four reversible processes."
    >
      <CarnotCycleVisualizer />

      <ContentSection title="What is the Carnot cycle?">
        <Prose>
          <p>
            The Carnot cycle is a theoretical thermodynamic cycle that provides an upper limit on the efficiency that any
            classical thermodynamic engine can achieve during the conversion of heat into work. It consists of four
            reversible processes: two isothermal (constant temperature) and two adiabatic (no heat exchange).
          </p>
          <p>
            Named after French physicist Sadi Carnot who described it in 1824, the Carnot cycle demonstrates the maximum
            possible efficiency of a heat engine operating between two temperature reservoirs.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="The four processes">
        <CardGrid items={processes} />
      </ContentSection>

      <ContentSection title="Carnot efficiency">
        <Prose>
          <p>The thermal efficiency of a Carnot engine depends only on the temperatures of the hot and cold reservoirs:</p>
        </Prose>
        <Callout tone="formula" title="Carnot efficiency" className="my-4">
          <p className="font-mono text-base">
            η = 1 - T<sub>C</sub>/T<sub>H</sub> = (T<sub>H</sub> - T<sub>C</sub>)/T<sub>H</sub>
          </p>
        </Callout>
        <Prose>
          <p>
            Where T<sub>H</sub> and T<sub>C</sub> are in Kelvin. This efficiency represents the maximum possible
            efficiency for any heat engine operating between these two temperatures.
          </p>
          <ul>
            <li>η &lt; 1 always (100% efficiency is impossible)</li>
            <li>Higher T<sub>H</sub> or lower T<sub>C</sub> increases efficiency</li>
            <li>No real engine can achieve Carnot efficiency due to irreversibilities</li>
            <li>Carnot efficiency sets the theoretical upper limit</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="Key principles">
        <CardGrid items={keyPrinciples} />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} columns={3} />
      </ContentSection>

      <ContentSection title="Practical limitations">
        <Prose>
          <p>While the Carnot cycle is theoretically perfect, real engines cannot achieve it because:</p>
          <ul>
            <li>Truly reversible processes would take infinite time</li>
            <li>Perfect thermal insulation for adiabatic processes is impossible</li>
            <li>Friction and other dissipative effects are unavoidable</li>
            <li>Maintaining constant temperature during heat transfer requires infinitesimal temperature differences</li>
            <li>Real working fluids have phase changes and non-ideal behavior</li>
          </ul>
          <p>
            Despite these limitations, the Carnot cycle remains fundamental to thermodynamics, providing a theoretical
            benchmark against which all real engines are compared.
          </p>
        </Prose>
      </ContentSection>
    </DetailPage>
  );
}
