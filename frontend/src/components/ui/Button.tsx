import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'contrast' | 'glass' | 'glass-outline' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: 'glass-btn text-white rounded-full',
  secondary: 'glass-btn-outline text-dark rounded-full',
  ghost: 'bg-transparent text-dark hover:bg-white/30 rounded-full',
  contrast: 'bg-contrast text-white hover:bg-accent rounded-full',
  glass: 'glass-btn text-white rounded-full',
  'glass-outline': 'glass-btn-outline text-dark rounded-full',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-900/10 rounded-full',
  warning: 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-900/10 rounded-full',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/10 rounded-full',
  info: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/10 rounded-full',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-5 py-2 text-xs',
  md: 'px-7 py-3 text-xs',
  lg: 'px-10 py-4 text-xs',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      rounded = true,
      loading = false,
      icon,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2
          font-medium uppercase tracking-[0.15em]
          transition-all duration-300
          ${rounded ? 'rounded-full' : 'rounded-xl'}
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          icon
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
