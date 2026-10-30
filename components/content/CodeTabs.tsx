'use client';

import { useState } from 'react';
import CodeBlock from './CodeBlock';

export interface CodeSample {
  /** Tab label, e.g. 'Python'. */
  label: string;
  /** Prism language id, e.g. 'python'. */
  language: string;
  code: string;
}

/** The same solution in several languages, one tab per language. */
export default function CodeTabs({ samples }: { samples: CodeSample[] }) {
  const [active, setActive] = useState(0);
  const sample = samples[active];

  return (
    <div>
      <div role="tablist" className="mb-3 flex flex-wrap gap-1 rounded-lg bg-subtle p-1 ring-1 ring-inset ring-line w-fit">
        {samples.map((s, i) => (
          <button
            key={s.label}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              i === active ? 'bg-white text-ink shadow-card ring-1 ring-line' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <CodeBlock code={sample.code} language={sample.language} label={sample.label} />
    </div>
  );
}
