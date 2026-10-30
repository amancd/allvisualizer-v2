/** Per-subject accent colors. Keep class strings literal so Tailwind can see them. */
export const accents = {
  brand:   { icon: 'bg-brand-50 text-brand-600 ring-brand-100',       bar: 'bg-brand-500',   text: 'text-brand-700' },
  amber:   { icon: 'bg-amber-50 text-amber-600 ring-amber-100',       bar: 'bg-amber-500',   text: 'text-amber-700' },
  sky:     { icon: 'bg-sky-50 text-sky-600 ring-sky-100',             bar: 'bg-sky-500',     text: 'text-sky-700' },
  emerald: { icon: 'bg-emerald-50 text-emerald-600 ring-emerald-100', bar: 'bg-emerald-500', text: 'text-emerald-700' },
  violet:  { icon: 'bg-violet-50 text-violet-600 ring-violet-100',    bar: 'bg-violet-500',  text: 'text-violet-700' },
  rose:    { icon: 'bg-rose-50 text-rose-600 ring-rose-100',          bar: 'bg-rose-500',    text: 'text-rose-700' },
  gray:    { icon: 'bg-gray-100 text-gray-500 ring-gray-200',         bar: 'bg-gray-300',    text: 'text-gray-600' },
} as const;

export type Accent = keyof typeof accents;
