import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full';
  className?: string;
  padding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  maxWidth = '7xl',
  className = '',
  padding = true,
}) => {
  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };
  
  const paddingStyles = padding ? 'px-4 sm:px-6 lg:px-8' : '';
  
  return (
    <div className={`${maxWidthStyles[maxWidth]} mx-auto ${paddingStyles} ${className}`}>
      {children}
    </div>
  );
};
