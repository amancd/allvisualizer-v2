'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  /** Prism language id, e.g. 'python', 'javascript', 'java', 'cpp'. */
  language?: string;
  /** Label shown in the title bar. Defaults to the language. */
  label?: string;
  compact?: boolean;
}

/** Syntax-highlighted code with a copy button. */
export default function CodeBlock({ code, language = 'python', label, compact = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-black/5 bg-[#1e1e1e] shadow-card">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </span>
          <span className="ml-2 font-mono text-xs text-gray-400">{label ?? language}</span>
        </div>
        <button
          onClick={copy}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            copied ? 'bg-emerald-500/15 text-emerald-300' : 'text-gray-400 hover:bg-white/10 hover:text-gray-200'
          }`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: compact ? '0.75rem 1rem' : '1rem 1.25rem',
          fontSize: '0.84rem',
          lineHeight: '1.65',
          background: 'transparent',
        }}
        codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
        wrapLongLines={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
