import type { Metadata } from 'next';
import { Flame, Mountain, Route, Thermometer } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import ActivationEnergyVisualizer from './ActivationEnergyVisualizer';

export const metadata: Metadata = {
  title: 'Activation Energy & Catalysts - Chemistry Visualizer | AllVisualizer',
  description:
    'Shape a reaction energy profile with sliders for Ea and ΔH, add a catalyst to lower the barrier, and explore the Arrhenius equation with k vs T and ln k vs 1/T plots and a two-temperature calculator.',
  keywords: ['activation energy', 'Arrhenius equation', 'energy profile', 'transition state', 'catalyst', 'exothermic', 'endothermic', 'rate constant', 'kinetics', 'chemistry'],
};

const ideas = [
  {
    title: 'The energy barrier',
    icon: Mountain,
    description: 'Reactants must pass through a high-energy transition state where old bonds are partly broken and new ones partly formed. Ea is the height of that barrier.',
  },
  {
    title: 'ΔH is separate from Ea',
    icon: Flame,
    description: 'ΔH is the difference between products and reactants. A very exothermic reaction can still be slow if its barrier is high.',
  },
  {
    title: 'Temperature and k',
    icon: Thermometer,
    description: 'The Arrhenius equation says k grows exponentially with temperature. The larger Ea is, the more sensitive the rate is to T.',
  },
  {
    title: 'Catalysts open a new route',
    icon: Route,
    description: 'A catalyst offers a different mechanism with a lower barrier, often through an intermediate. It is regenerated, and ΔH and the equilibrium position stay the same.',
  },
];

const tenKelvin = [
  { ea: '25', ratio: '1.39' },
  { ea: '50', ratio: '1.93' },
  { ea: '75', ratio: '2.67' },
  { ea: '100', ratio: '3.71' },
  { ea: '150', ratio: '7.14' },
];

export default function ActivationEnergyPage() {
  return (
    <DetailPage subject="chemistry" item="activation-energy">
      <ActivationEnergyVisualizer />

      <ContentSection title="Energy profiles and the Arrhenius equation">
        <Prose>
          <p>
            An <strong>energy profile</strong> follows the energy of the reacting system along the reaction coordinate, the path from reactants
            to products. On the way, the atoms pass through the <strong>transition state</strong>, the highest point on the path. The
            <strong> activation energy</strong> Ea is the climb from reactants to that peak. The reverse reaction has to climb from the products,
            so its barrier is Ea − ΔH.
          </p>
          <p>
            Svante Arrhenius found that rate constants follow k = A e^(−Ea/RT). The exponential factor is the share of collisions with enough
            energy to cross the barrier, and the pre-exponential factor A collects the collision frequency and the orientation requirement.
            Taking logarithms gives ln k = ln A − (Ea/R)(1/T), a straight line when ln k is plotted against 1/T. The slope is −Ea/R, which is how
            activation energies are measured in the lab.
          </p>
          <p>
            A <strong>catalyst</strong> does not push molecules over the same hill; it provides a different path with a lower top. Because the
            exponent is divided by RT, even a modest drop in Ea gives a huge speed-up: lowering the barrier by 20 kJ/mol at body temperature
            makes a reaction about 2300 times faster.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Arrhenius equation">
            <Formula
              where={[
                { symbol: 'k', meaning: 'rate constant' },
                { symbol: 'A', meaning: 'pre-exponential (frequency) factor, same units as k' },
                { symbol: 'Ea', meaning: 'activation energy (J/mol)' },
                { symbol: 'R', meaning: '8.314 J/(mol·K)' },
                { symbol: 'T', meaning: 'absolute temperature (K)' },
              ]}
            >
              k = A e^(−Ea/RT)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Linear form (Arrhenius plot)">
            <Formula>ln k = ln A − (Ea/R) × (1/T)&nbsp;&nbsp; slope = −Ea/R</Formula>
          </Callout>
          <Callout tone="formula" title="Two temperatures">
            <Formula>ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂)</Formula>
          </Callout>
          <Callout tone="formula" title="Barriers on an energy profile">
            <Formula>Ea(reverse) = Ea(forward) − ΔH;&nbsp;&nbsp; k_cat/k = e^((Ea − Ea,cat)/RT) for the same A</Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How much faster for a 10 K rise?">
        <DataTable
          caption="k(308 K) / k(298 K) = exp[(Ea/R)(1/298 − 1/308)]"
          columns={[
            { header: 'Ea (kJ/mol)', cell: 'ea', numeric: true },
            { header: 'Rate increase from 298 K to 308 K', cell: 'ratio', numeric: true },
          ]}
          rows={tenKelvin}
        />
        <p className="mt-3 text-sm text-ink-muted">
          The familiar rule that a 10 K rise doubles the rate only holds for Ea of about 50 kJ/mol near room temperature.
        </p>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Set Ea and ΔH with the sliders, or drag the red peak and the blue products level directly on the energy profile.',
            'Make ΔH negative for an exothermic reaction and positive for an endothermic one. Watch the reverse barrier Ea,rev = Ea − ΔH change with it.',
            'Tick Add a catalyst. A dashed green path with a lower barrier appears; drag its peak or use the Catalysed Ea slider. The reactant and product levels do not move.',
            'Move the temperature slider. The point on the k vs T curve climbs steeply, while on the ln k vs 1/T plot it slides along a straight line with slope −Ea/R.',
            'Compare the two lines on the Arrhenius plot with the catalyst on. The catalysed line is less steep (smaller Ea) and lies above the uncatalysed one.',
            'Use the two-temperature calculator to see how many times faster the reaction becomes for a +10 K rise, or any other change.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception">
        A catalyst does not change ΔH or the position of equilibrium, and it does not only speed up the forward reaction. It lowers the barrier
        for the forward and reverse reactions by the same amount, so equilibrium is reached sooner but at the same composition.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Ea from two rate constants"
            question="A first order reaction has k = 2.0 × 10⁻³ s⁻¹ at 300 K and k = 1.0 × 10⁻² s⁻¹ at 320 K. Find the activation energy and the pre-exponential factor A."
            solution={
              <>
                <p>ln(k₂/k₁) = ln(1.0 × 10⁻² / 2.0 × 10⁻³) = ln 5 = 1.609</p>
                <p>1/T₁ − 1/T₂ = 1/300 − 1/320 = 2.083 × 10⁻⁴ K⁻¹</p>
                <p>Ea/R = 1.609 / 2.083 × 10⁻⁴ = 7725 K</p>
                <p>Ea = 7725 × 8.314 = 64 230 J/mol ≈ 64.2 kJ/mol</p>
                <p>A = k₁ e^(Ea/RT₁) = 2.0 × 10⁻³ × e^(7725/300) = 2.0 × 10⁻³ × e^25.75</p>
                <p>A = 2.0 × 10⁻³ × 1.53 × 10¹¹ ≈ 3.1 × 10⁸ s⁻¹</p>
                <p className="font-semibold text-emerald-700">Ea ≈ 64 kJ/mol, A ≈ 3.1 × 10⁸ s⁻¹</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: An enzyme at body temperature"
            question="An enzyme lowers the activation energy of a reaction from 80 kJ/mol to 60 kJ/mol. Assuming A is unchanged, how many times faster is the catalysed reaction at 310 K? What temperature would the uncatalysed reaction need to match that rate?"
            solution={
              <>
                <p>k_cat/k = e^((Ea − Ea,cat)/RT) = e^(20 000 / (8.314 × 310))</p>
                <p>exponent = 20 000 / 2577 = 7.760</p>
                <p>k_cat/k = e^7.760 ≈ 2.34 × 10³</p>
                <p>Same k with the same A needs the same Ea/T: 80 000/T = 60 000/310</p>
                <p>T = 310 × 80/60 = 413 K (about 140 °C)</p>
                <p className="font-semibold text-emerald-700">About 2300 times faster; the uncatalysed reaction would need about 413 K</p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related visualizations">
        <RelatedItems
          subject="chemistry"
          current="activation-energy"
          items={[
            { slug: 'collision-theory', note: 'See the e^(−Ea/RT) fraction of successful collisions happen in a simulation' },
            { slug: 'rate-laws', note: 'How the rate constant k enters concentration-time graphs and half-lives' },
            { slug: 'le-chateliers-principle', note: 'Temperature also shifts equilibria, unlike a catalyst' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
