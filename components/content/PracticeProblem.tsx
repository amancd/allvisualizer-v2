interface PracticeProblemProps {
  title: React.ReactNode;
  question: React.ReactNode;
  /** Revealed when the reader clicks "Show solution". */
  solution: React.ReactNode;
}

/** A question with a collapsible worked solution. */
export default function PracticeProblem({ title, question, solution }: PracticeProblemProps) {
  return (
    <div className="rounded-xl border border-line bg-white p-5 shadow-card">
      <h3 className="font-semibold text-ink">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-gray-700">{question}</div>
      <details className="group mt-3 text-sm">
        <summary className="cursor-pointer select-none font-medium text-brand-700 hover:text-brand-800">
          <span className="group-open:hidden">Show solution</span>
          <span className="hidden group-open:inline">Hide solution</span>
        </summary>
        <div className="mt-3 space-y-1 rounded-lg border border-line bg-subtle p-4 font-mono text-[13px] text-gray-700">{solution}</div>
      </details>
    </div>
  );
}
