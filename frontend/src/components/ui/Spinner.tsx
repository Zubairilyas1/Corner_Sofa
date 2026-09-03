interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeMap = {
  sm: 'w-4 h-4 border',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
};

export default function Spinner({ size = 'md', label }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-label={label || 'Loading'}>
      <div
        className={`${sizeMap[size]} border-accent border-t-transparent rounded-full animate-spin`}
      />
      {label && (
        <span className="text-dark/60 text-sm tracking-widest uppercase font-light">
          {label}
        </span>
      )}
    </div>
  );
}
