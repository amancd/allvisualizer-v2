import { Info, Lightbulb, AlertTriangle, BookOpen, Sigma } from 'lucide-react';
import { inlineCode } from './ContentSection';

const tones = {
  note: { icon: Info, box: 'border-brand-200 bg-brand-50/60', title: 'text-brand-900', icon_: 'text-brand-600' },
  tip: { icon: Lightbulb, box: 'border-emerald-200 bg-emerald-50/70', title: 'text-emerald-900', icon_: 'text-emerald-600' },
  warning: { icon: AlertTriangle, box: 'border-amber-200 bg-amber-50/70', title: 'text-amber-900', icon_: 'text-amber-600' },
  example: { icon: BookOpen, box: 'border-line bg-subtle', title: 'text-ink', icon_: 'text-ink-muted' },
  formula: { icon: Sigma, box: 'border-violet-200 bg-violet-50/60', title: 'text-violet-900', icon_: 'text-violet-600' },
} as const;

export type CalloutTone = keyof typeof tones;

interface CalloutProps {
  tone?: CalloutTone;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Highlighted aside: notes, tips, warnings, worked examples and formulas. */
export default function Callout({ tone = 'note', title, children, className = '' }: CalloutProps) {
  const t = tones[tone];
  const Icon = t.icon;
  return (
    <div className={`flex gap-3 rounded-xl border p-4 ${t.box} ${className}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${t.icon_}`} aria-hidden />
      <div className={`min-w-0 text-sm leading-relaxed text-gray-700 ${inlineCode}`}>
        {title && <p className={`mb-1 font-semibold ${t.title}`}>{title}</p>}
        {children}
      </div>
    </div>
  );
}
