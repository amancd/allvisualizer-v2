import React from 'react';
import { FieldLabel, fieldStyles } from './Field';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const baseStyles = `${fieldStyles} h-11`;
    const errorStyles = error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : '';
    const widthClass = fullWidth ? 'w-full' : '';
    const iconPaddingLeft = leftIcon ? 'pl-10' : '';
    const iconPaddingRight = rightIcon ? 'pr-10' : '';
    
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && <FieldLabel htmlFor={inputId} required={props.required}>{label}</FieldLabel>}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex text-ink-faint items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={`${baseStyles} ${errorStyles} ${widthClass} ${iconPaddingLeft} ${iconPaddingRight} ${className}`}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex text-ink-faint items-center">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-ink-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
