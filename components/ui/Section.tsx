import React from 'react';
import { Container } from './Container';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  containerMaxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full';
  noPadding?: boolean;
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  className = '',
  background = 'white',
  padding = 'lg',
  containerMaxWidth = '7xl',
  noPadding = false,
}) => {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-b from-gray-50 to-white',
  };
  
  const paddings = {
    none: '',
    sm: 'py-8',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-20',
    xl: 'py-20 md:py-24',
  };
  
  return (
    <section className={`${backgrounds[background]} ${noPadding ? '' : paddings[padding]} ${className}`}>
      <Container maxWidth={containerMaxWidth} padding={!noPadding}>
        {children}
      </Container>
    </section>
  );
};
