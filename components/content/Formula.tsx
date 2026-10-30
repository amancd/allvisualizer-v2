interface FormulaProps {
  /** The equation. Use <sub>/<sup> for indices and powers. */
  children: React.ReactNode;
  /** Optional variable definitions, shown under the equation. */
  where?: { symbol: React.ReactNode; meaning: React.ReactNode }[];
}

/**
 * A display equation with an optional "where" legend. Put it inside
 * <Callout tone="formula"> or use it on its own.
 *
 *   <Formula where={[{ symbol: 'F', meaning: 'net force (N)' }]}>F = m × a</Formula>
 */
export default function Formula({ children, where }: FormulaProps) {
  return (
    <div>
      <p className="font-mono text-base text-ink">{children}</p>
      {where && where.length > 0 && (
        <dl className="mt-2 grid gap-x-3 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
          {where.map((w, i) => (
            <div key={i} className="contents">
              <dt className="font-mono font-semibold text-ink">{w.symbol}</dt>
              <dd className="text-ink-muted">{w.meaning}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
