import React from 'react';

/** Border, focus ring and text styles shared by Input, Textarea and Select. */
export const fieldStyles =
  'w-full rounded-control border border-line-strong bg-white px-3.5 text-sm text-ink shadow-card transition-colors placeholder:text-ink-faint focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100';

/** Label + control wrapper used by form fields. */
export function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
      {children}
      {required && <span className="ml-0.5 text-red-500" aria-hidden>*</span>}
    </label>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, id, className = '', ...props }, ref) => {
  const generatedId = React.useId();
  const fieldId = id || generatedId;
  return (
    <div>
      {label && <FieldLabel htmlFor={fieldId} required={props.required}>{label}</FieldLabel>}
      <textarea ref={ref} id={fieldId} className={`${fieldStyles} py-2.5 ${className}`} {...props} />
    </div>
  );
});
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ label, id, className = '', children, ...props }, ref) => {
  const generatedId = React.useId();
  const fieldId = id || generatedId;
  return (
    <div>
      {label && <FieldLabel htmlFor={fieldId} required={props.required}>{label}</FieldLabel>}
      <select ref={ref} id={fieldId} className={`${fieldStyles} h-11 ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
});
Select.displayName = 'Select';
