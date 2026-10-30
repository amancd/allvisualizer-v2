interface ContentSectionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** 'plain' for flowing text, 'card' to put the section in a bordered panel. */
  variant?: 'plain' | 'card';
  id?: string;
  className?: string;
  children: React.ReactNode;
}

/** A titled block of page content. Use it for every <h2> section so spacing stays consistent. */
export default function ContentSection({ title, description, variant = 'plain', id, className = '', children }: ContentSectionProps) {
  const card = variant === 'card';
  return (
    <section id={id} className={`scroll-mt-24 ${card ? 'rounded-card border border-line bg-white p-6 shadow-card' : ''} ${className}`}>
      {title && <h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2>}
      {description && <p className="mt-2 text-ink-muted">{description}</p>}
      <div className={title || description ? 'mt-5' : ''}>{children}</div>
    </section>
  );
}

/** Tailwind classes that style inline <code> inside a block. Shared by Prose, StepList and Callout. */
export const inlineCode =
  '[&_code]:rounded [&_code]:bg-subtle [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:ring-1 [&_code]:ring-line';

/** Body text with sensible defaults for paragraphs, lists and inline code. */
export function Prose({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`space-y-4 leading-relaxed text-gray-700 ${inlineCode} [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 ${className}`}
    >
      {children}
    </div>
  );
}
