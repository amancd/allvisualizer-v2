import { Callout, CodeBlock, DifficultyBadge } from '@/components/content';
import { patternDiagrams, type SubPattern } from '@/config/dsa-patterns';

const leetcodeUrl = (name: string) =>
  `https://leetcode.com/problems/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}/`;

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">{children}</h3>;
}

/** One pattern: recall tip, diagram, theory, code template and practice problems. */
export default function PatternCard({ pattern, index }: { pattern: SubPattern; index: number }) {
  const diagram = patternDiagrams[pattern.slug];

  return (
    <section id={pattern.slug} className="scroll-mt-20 overflow-hidden rounded-card border border-line bg-white shadow-card lg:scroll-mt-6">
      <div className="flex items-start gap-4 px-5 py-5 sm:px-7">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 font-mono text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
          {index + 1}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{pattern.title}</h2>
          <p className="mt-0.5 text-sm text-ink-faint">{pattern.problems.length} practice problems</p>
        </div>
      </div>

      <div className="space-y-7 border-t border-line px-4 py-6 sm:px-7">
        {pattern.recall && (
          <Callout tone="note" title="How to recall this pattern">
            {pattern.recall}
          </Callout>
        )}

        {diagram && (
          <div>
            <SubHeading>Visual diagram</SubHeading>
            <div className="flex justify-center rounded-xl border border-line bg-subtle bg-dots p-2 sm:p-5">{diagram}</div>
          </div>
        )}

        <div>
          <SubHeading>Theory</SubHeading>
          <ul className="space-y-2.5">
            {pattern.theory.map((point, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-gray-700">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" aria-hidden />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SubHeading>Code template</SubHeading>
          <CodeBlock code={pattern.template} />
        </div>

        <div>
          <SubHeading>Practice problems · {pattern.problems.length}</SubHeading>
          <div className="divide-y divide-line overflow-hidden rounded-xl border border-line">
            {pattern.problems.map((prob, i) => (
              <div key={prob.lc} className="bg-white">
                <div className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-subtle/70">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="w-5 shrink-0 font-mono text-xs text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                    <a
                      href={leetcodeUrl(prob.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-[15px] font-medium text-ink transition-colors hover:text-brand-700"
                    >
                      {prob.name}
                    </a>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <DifficultyBadge level={prob.difficulty} />
                    <span className="hidden font-mono text-xs text-ink-faint sm:inline">#{prob.lc}</span>
                  </div>
                </div>

                {(prob.explanation || prob.code) && (
                  <div className="space-y-3 px-4 pb-4 sm:pl-12">
                    {prob.explanation && <p className="text-sm leading-relaxed text-ink-muted">{prob.explanation}</p>}
                    {prob.code && <CodeBlock code={prob.code} compact />}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
