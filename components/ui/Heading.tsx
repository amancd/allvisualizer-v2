import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const Heading: React.FC<HeadingProps> = ({ 
  children, 
  level = 1,
  className = '',
  align = 'left',
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const baseStyles = 'font-bold text-gray-900';
  
  const levelStyles = {
    1: 'text-4xl md:text-5xl',
    2: 'text-3xl md:text-4xl',
    3: 'text-2xl md:text-3xl',
    4: 'text-xl md:text-2xl',
    5: 'text-lg md:text-xl',
    6: 'text-base md:text-lg',
  };
  
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  return (
    <Tag className={`${baseStyles} ${levelStyles[level]} ${alignStyles[align]} ${className}`}>
      {children}
    </Tag>
  );
};
