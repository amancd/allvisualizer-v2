import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md',
  className = '',
  label,
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className={`${sizes[size]} animate-spin text-gray-600 ${className}`} />
      {label && <p className="text-sm text-gray-600">{label}</p>}
    </div>
  );
};
