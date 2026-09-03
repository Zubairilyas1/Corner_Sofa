import { ReactNode } from 'react';

interface BadgeProps {
  variant: 'sale' | 'stock-high' | 'stock-low' | 'stock-out' | 'info' | 'verified';
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  sale: 'bg-contrast/90 backdrop-blur-sm text-white',
  'stock-high': 'bg-emerald-500/10 backdrop-blur-sm text-emerald-700 border border-emerald-200/50',
  'stock-low': 'bg-amber-500/10 backdrop-blur-sm text-amber-700 border border-amber-200/50',
  'stock-out': 'bg-red-500/10 backdrop-blur-sm text-red-600 border border-red-200/50',
  info: 'glass-accent text-dark',
  verified: 'text-green-600',
};

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  if (variant === 'verified') {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium ${className}`}>
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        {children}
      </span>
    );
  }

  return (
    <span className={`inline-block text-[10px] px-3 py-1 tracking-[0.2em] uppercase font-medium rounded-full ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
