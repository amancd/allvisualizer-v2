import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  border = true,
}) => {
  const baseStyles = 'bg-white rounded-xl';
  const borderStyles = border ? 'border-2 border-gray-200' : '';
  const hoverStyles = hover ? 'hover:border-gray-400 hover:shadow-lg transition-all' : '';
  
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div className={`${baseStyles} ${borderStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '', size = 'md' }) => {
  const sizeStyles = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };
  
  return <h3 className={`${sizeStyles[size]} font-bold text-gray-900 ${className}`}>{children}</h3>;
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => {
  return <p className={`text-gray-600 ${className}`}>{children}</p>;
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return <div className={`mt-4 ${className}`}>{children}</div>;
};
