import { ReactNode } from 'react';

interface GlassSectionProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'white' | 'dark' | 'accent';
  as?: 'section' | 'div' | 'article';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const variantStyles = {
  default: 'glass',
  white: 'glass-white',
  dark: 'glass-dark text-primary',
  accent: 'glass-accent',
};

const paddingStyles = {
  none: '',
  sm: 'px-4 py-8',
  md: 'px-6 py-12',
  lg: 'px-8 py-16',
  xl: 'px-8 py-20 md:py-24',
};

export default function GlassSection({
  children,
  className = '',
  variant = 'default',
  as: Tag = 'section',
  padding = 'lg',
}: GlassSectionProps) {
  return (
    <Tag className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}>
      {children}
    </Tag>
  );
}
