import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'glass-white';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const variantStyles = {
  default: 'bg-primary rounded-xl border border-gray-200 hover:border-dark hover:shadow-[0_4px_20px_rgba(78,34,15,0.1)]',
  glass: 'glass-card rounded-2xl',
  'glass-white': 'glass-white rounded-2xl',
};

export default function Card({
  children,
  className = '',
  hover = true,
  padding = 'md',
  variant = 'glass',
}: CardProps) {
  return (
    <div
      className={`
        ${variantStyles[variant]}
        ${hover && variant === 'default' ? 'hover:border-dark hover:shadow-[0_4px_20px_rgba(78,34,15,0.1)]' : ''}
        transition-all duration-400
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
