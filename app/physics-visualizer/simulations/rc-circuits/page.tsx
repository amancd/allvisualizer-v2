import type { Metadata } from 'next';
import { Callout, CardGrid, type CardGridItem, ContentSection, DetailPage, Formula, Prose } from '@/components/content';
import RCCircuitVisualizer from './RCCircuitVisualizer';

export const metadata: Metadata = {
  title: 'Capacitors & RC Circuits - Physics Visualizer | AllVisualizer',
  description:
    'Visualize capacitor charging and discharging in RC circuits. Interactive simulation with voltage, current, and charge graphs.',
  keywords: ['capacitor', 'RC circuit', 'time constant', 'exponential decay', 'charging', 'discharging', 'physics simulation'],
  openGraph: {
    title: 'RC Circuit Visualizer - Interactive Physics',
    description: 'Master capacitors and RC circuits through interactive visualization',
  },
};

const concepts: CardGridItem[] = [
  {
    title: 'Exponential behavior',
    description:
      'Both charging and discharging follow exponential curves, not linear ones. The rate of change is fastest at the beginning and slows down as the capacitor approaches its final state.',
  },
  {
    title: 'Time constant significance',
    description:
      'The time constant τ = RC determines how fast the circuit responds. A larger resistance or capacitance increases τ, making the process slower. After 5τ, the process is essentially complete (99.3%).',
  },
  {
    title: 'Current direction',
    description:
      'During charging, current flows into the capacitor (positive). During discharging, current flows out of the capacitor (negative). The magnitude decreases exponentially in both cases.',
  },
  {
    title: 'Energy conservation',
    description:
      'Energy is stored in the electric field between the capacitor plates. During discharge, this energy is dissipated as heat in the resistor. Half the energy from the battery is always lost to the resistor during charging.',
  },
];

const applications: CardGridItem[] = [
  {
    title: 'Timing circuits',
    description: 'RC circuits create precise time delays in electronics, from simple timers to computer clock circuits.',
  },
  {
    title: 'Filters',
    description: 'Low-pass and high-pass filters use RC circuits to block or pass specific frequencies.',
  },
  {
    title: 'Flash photography',
    description: 'Camera flashes use capacitors to store energy and release it quickly for bright light.',
  },
  {
    title: 'Power supplies',
    description: 'Smoothing capacitors in power supplies filter out voltage ripples for stable DC output.',
  },
  {
    title: 'Touchscreens',
    description: 'Capacitive touchscreens detect finger position by measuring capacitance changes.',
  },
  {
    title: 'Defibrillators',
    description: 'Medical defibrillators charge capacitors to deliver controlled electric shocks to the heart.',
  },
];

export default function RCCircuitPage() {
  return (
    <DetailPage
      subject="physics"
      item="rc-circuits"
      description="Visualize how capacitors charge and discharge in RC circuits with exponential behavior."
    >
      <ContentSection title="RC circuit theory" variant="card">
        <Prose>
          <p>
            An <strong>RC circuit</strong> consists of a resistor (R) and capacitor (C) connected in series. When
            connected to a voltage source, the capacitor charges exponentially, and when disconnected, it discharges
            exponentially through the resistor.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Callout tone="formula" title="Charging">
              <div className="space-y-1 font-mono">
                <p>Q(t) = Q₀(1 − e^(−t/τ))</p>
                <p>V(t) = V₀(1 − e^(−t/τ))</p>
                <p>I(t) = (V₀/R)e^(−t/τ)</p>
              </div>
            </Callout>
            <Callout tone="formula" title="Discharging">
              <div className="space-y-1 font-mono">
                <p>Q(t) = Q₀e^(−t/τ)</p>
                <p>V(t) = V₀e^(−t/τ)</p>
                <p>I(t) = −(V₀/R)e^(−t/τ)</p>
              </div>
            </Callout>
          </div>

          <Callout tone="formula" title="Time constant (τ)">
            <Formula>τ = R × C</Formula>
            <ul className="mt-2 space-y-1">
              <li>At t = τ: 63.2% charged/discharged</li>
              <li>At t = 2τ: 86.5% charged/discharged</li>
              <li>At t = 3τ: 95.0% charged/discharged</li>
              <li>At t = 5τ: 99.3% charged/discharged (effectively complete)</li>
            </ul>
          </Callout>

          <p><strong>Key properties:</strong></p>
          <ul>
            <li>Capacitance (C) measures charge storage ability (farads)</li>
            <li>Larger τ means slower charging/discharging</li>
            <li>Current is maximum at t = 0 and decreases exponentially</li>
            <li>Energy stored: E = ½CV²</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection title="Interactive simulation">
        <RCCircuitVisualizer />
      </ContentSection>

      <ContentSection title="Key concepts">
        <CardGrid items={concepts} />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} columns={3} />
      </ContentSection>
    </DetailPage>
  );
}
