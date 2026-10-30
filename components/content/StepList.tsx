import { inlineCode } from './ContentSection';

/** Numbered list of instructions, e.g. "How to use this visualizer". */
export default function StepList({ steps }: { steps: React.ReactNode[] }) {
  return (
    <ol className={`space-y-3 ${inlineCode}`}>
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 text-gray-700">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
            {i + 1}
          </span>
          <div className="leading-relaxed">{step}</div>
        </li>
      ))}
    </ol>
  );
}
