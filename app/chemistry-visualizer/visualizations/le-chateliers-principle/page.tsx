import type { Metadata } from 'next';
import { Beaker, Gauge, Scale, Thermometer } from 'lucide-react';
import { Callout, CardGrid, ContentSection, DataTable, DetailPage, Formula, PracticeProblem, Prose, RelatedItems, StepList } from '@/components/content';
import LeChateliersPrincipleVisualizer from './LeChateliersPrincipleVisualizer';

export const metadata: Metadata = {
  title: "Le Chatelier's Principle - Chemistry Visualizer | AllVisualizer",
  description:
    "Disturb the Haber process or the N₂O₄ ⇌ 2NO₂ equilibrium by adding reactant, removing product, compressing or heating, and watch Q, K and the concentrations re-equilibrate.",
  keywords: ["Le Chatelier's principle", 'chemical equilibrium', 'reaction quotient', 'equilibrium constant', 'Haber process', "van 't Hoff equation", 'N2O4 NO2'],
};

const ideas = [
  {
    title: 'Concentration',
    icon: Beaker,
    description: 'Adding a reactant or removing a product makes Q smaller than K, so the reaction runs forward. Adding a product or removing a reactant does the opposite.',
  },
  {
    title: 'Pressure and volume',
    icon: Gauge,
    description: 'Squeezing a gas mixture raises every concentration. Q changes unless both sides have the same number of gas moles, and the system shifts toward the side with fewer.',
  },
  {
    title: 'Temperature',
    icon: Thermometer,
    description: 'Heating favours the endothermic direction and cooling favours the exothermic one. This is the only disturbance that changes K itself.',
  },
  {
    title: 'Q versus K',
    icon: Scale,
    description: 'Every prediction comes from comparing the reaction quotient Q with K. Q < K means shift right, Q > K means shift left, Q = K means equilibrium.',
  },
];

const disturbances = [
  { change: 'Add N₂ or H₂', q: 'Q falls below K', k: 'unchanged', shift: 'Right, more NH₃' },
  { change: 'Remove NH₃', q: 'Q falls below K', k: 'unchanged', shift: 'Right, more NH₃' },
  { change: 'Halve the volume', q: 'Q × ¼ (Δn = −2)', k: 'unchanged', shift: 'Right, fewer gas moles' },
  { change: 'Raise T (ΔH < 0)', q: 'unchanged at first', k: 'K decreases', shift: 'Left, absorbs heat' },
  { change: 'Add a catalyst', q: 'unchanged', k: 'unchanged', shift: 'None, equilibrium is just reached faster' },
  { change: 'Add argon at constant V', q: 'unchanged', k: 'unchanged', shift: 'None, concentrations do not change' },
];

export default function LeChateliersPrinciplePage() {
  return (
    <DetailPage subject="chemistry" item="le-chateliers-principle">
      <LeChateliersPrincipleVisualizer />

      <ContentSection title="Equilibrium is dynamic">
        <Prose>
          <p>
            In a reversible reaction such as N₂ + 3H₂ ⇌ 2NH₃, molecules keep reacting in both directions. At first the forward reaction is
            fast because there is plenty of N₂ and H₂. As ammonia builds up, the reverse reaction speeds up, until both run at the same rate.
            From then on the concentrations stay constant even though reactions never stop: that is <strong>dynamic equilibrium</strong>.
          </p>
          <p>
            <strong>Le Chatelier&apos;s principle</strong> says that if you disturb a system at equilibrium, it shifts in the direction that
            partly undoes the disturbance. Add nitrogen, and some of it is used up. Squeeze the gas, and the mixture moves toward fewer
            molecules. Heat it, and the heat-absorbing direction is favoured.
          </p>
          <p>
            The rule of thumb is backed by a precise test. The <strong>reaction quotient Q</strong> has the same form as K but uses the
            concentrations right now. Right after a disturbance Q no longer equals K, and the reaction runs in whichever direction brings Q
            back to K. In the visualizer the rates follow mass-action kinetics, and the clock is scaled so every shift takes a few seconds.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Equilibrium constant and reaction quotient">
            <Formula
              where={[
                { symbol: 'K', meaning: 'value of the quotient at equilibrium (depends only on temperature)' },
                { symbol: 'Q', meaning: 'the same expression with the current concentrations' },
              ]}
            >
              for aA + bB ⇌ cC:&nbsp; Q = [C]ᶜ / ([A]ᵃ[B]ᵇ)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Direction of shift">
            <Formula>Q &lt; K → forward (right);&nbsp;&nbsp; Q &gt; K → reverse (left);&nbsp;&nbsp; Q = K → equilibrium</Formula>
          </Callout>
          <Callout tone="formula" title="Volume change">
            <Formula where={[{ symbol: 'Δn', meaning: 'moles of gaseous products minus moles of gaseous reactants' }]}>
              scaling V by f multiplies Q by f^(−Δn)
            </Formula>
          </Callout>
          <Callout tone="formula" title="van 't Hoff equation">
            <Formula
              where={[
                { symbol: 'ΔH°', meaning: 'standard enthalpy change of the reaction (J/mol), assumed constant' },
                { symbol: 'R', meaning: '8.314 J/(mol·K)' },
              ]}
            >
              ln(K₂ / K₁) = −(ΔH° / R) × (1/T₂ − 1/T₁)
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Reactions in the visualizer">
        <DataTable
          columns={[
            { header: 'Reaction', cell: 'rx' },
            { header: 'ΔH°', cell: 'dh', numeric: true },
            { header: 'Kc', cell: 'k', numeric: true },
            { header: 'Δn(gas)', cell: 'dn', numeric: true },
          ]}
          rows={[
            { rx: 'N₂ + 3H₂ ⇌ 2NH₃', dh: '−92 kJ/mol', k: '0.060 at 773 K', dn: '−2' },
            { rx: 'N₂O₄ (colourless) ⇌ 2NO₂ (brown)', dh: '+57.2 kJ/mol', k: '4.6 × 10⁻³ at 298 K', dn: '+1' },
          ]}
        />
        <div className="mt-6">
          <DataTable
            caption="How the Haber equilibrium responds"
            columns={[
              { header: 'Disturbance', cell: 'change' },
              { header: 'Effect on Q', cell: 'q' },
              { header: 'Effect on K', cell: 'k' },
              { header: 'Shift', cell: 'shift' },
            ]}
            rows={disturbances}
          />
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose a reaction. It starts at equilibrium, so the lines on the chart are flat and the Q marker sits on Q = K.',
            'Press Add N₂ (or another species). The line jumps, Q moves off K and the arrow shows which way the reaction shifts. Watch the curves settle at new flat values.',
            'Press Compress (½ V). Every concentration doubles at once; then the side with fewer gas moles grows. For N₂O₄ ⇌ 2NO₂ the brown colour darkens, then fades partly back.',
            'Drag the temperature slider. K changes, Q does not, so the system has to move to a new equilibrium.',
            'Read the explanation box after each change: it gives the new Q and K and the reason for the shift.',
            'Press Start from reactants only to watch an equilibrium form from scratch.',
          ]}
        />
      </ContentSection>

      <Callout tone="warning" title="Common misconception">
        Adding a reactant does not change K, and the shift never fully removes what you added. The new equilibrium has more of every
        species on the other side and still a little more of the substance you added. Only temperature changes K; a catalyst changes neither
        K nor the equilibrium position, only how fast it is reached.
      </Callout>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Compressing N₂O₄ and NO₂"
            question="At 298 K, Kc = 4.6 × 10⁻³ for N₂O₄ ⇌ 2NO₂. An equilibrium mixture has [NO₂] = 0.0200 M and [N₂O₄] = 0.0870 M. The volume is suddenly halved. Find Q just after compression, the direction of shift and the new equilibrium concentrations."
            solution={
              <>
                <p>Check: (0.0200)² / 0.0870 = 4.6 × 10⁻³ = K, so the mixture starts at equilibrium.</p>
                <p>After halving V: [NO₂] = 0.0400 M, [N₂O₄] = 0.174 M</p>
                <p>Q = (0.0400)² / 0.174 = 9.2 × 10⁻³ = 2K, so Q &gt; K and the reaction shifts left.</p>
                <p>Let x mol/L of N₂O₄ form: (0.0400 − 2x)² / (0.174 + x) = 4.6 × 10⁻³</p>
                <p>4x² − 0.1646x + 7.996 × 10⁻⁴ = 0, so x = 0.00563 (the other root makes [NO₂] negative)</p>
                <p className="font-semibold text-emerald-700">
                  Shift left; [NO₂] ≈ 0.0287 M and [N₂O₄] ≈ 0.1796 M. The gas stays darker than before compression, because [NO₂] is still
                  higher than 0.0200 M.
                </p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Cooling the Haber process"
            question="For N₂ + 3H₂ ⇌ 2NH₃, ΔH° = −92 kJ/mol and Kc = 0.060 at 773 K. Estimate Kc at 673 K with the van 't Hoff equation, and say whether cooling raises or lowers the equilibrium yield of ammonia."
            solution={
              <>
                <p>ln(K₂/K₁) = −(ΔH°/R)(1/T₂ − 1/T₁) = (92 000 / 8.314) × (1/673 − 1/773)</p>
                <p>= 11 066 × (1.4859 × 10⁻³ − 1.2937 × 10⁻³) = 11 066 × 1.922 × 10⁻⁴ ≈ 2.127</p>
                <p>K₂ = 0.060 × e^2.127 = 0.060 × 8.39 ≈ 0.50</p>
                <p className="font-semibold text-emerald-700">
                  Kc ≈ 0.50 at 673 K, about 8 times larger, so cooling raises the ammonia yield. Industry still runs hot (about 700–800 K)
                  because at lower temperatures the reaction is far too slow, even with an iron catalyst.
                </p>
              </>
            }
          />
        </div>
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems
          subject="chemistry"
          current="le-chateliers-principle"
          items={[
            { slug: 'rate-laws', note: 'The forward and reverse rate laws whose balance defines equilibrium' },
            { slug: 'activation-energy', note: 'Why a catalyst speeds up both directions without moving the equilibrium' },
            { slug: 'titration-curves', note: 'Acid-base equilibria and buffers shifting as base is added' },
          ]}
        />
      </ContentSection>
    </DetailPage>
  );
}
