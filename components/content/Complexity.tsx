interface ComplexityProps {
  time: string;
  space: string;
  timeNote?: React.ReactNode;
  spaceNote?: React.ReactNode;
}

/** Time and space complexity side by side. */
export default function Complexity({ time, space, timeNote, spaceNote }: ComplexityProps) {
  const cells = [
    { label: 'Time complexity', value: time, note: timeNote },
    { label: 'Space complexity', value: space, note: spaceNote },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cells.map((c) => (
        <div key={c.label} className="rounded-xl border border-line bg-white p-5 shadow-card">
          <p className="text-sm text-ink-muted">{c.label}</p>
          <p className="mt-1 font-mono text-xl font-semibold text-ink">{c.value}</p>
          {c.note && <p className="mt-2 text-sm text-ink-muted">{c.note}</p>}
        </div>
      ))}
    </div>
  );
}
