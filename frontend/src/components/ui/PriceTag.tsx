interface PriceTagProps {
  price: number;
  oldPrice?: number;
  saveAmount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: { price: 'text-sm', old: 'text-xs', save: 'text-xs' },
  md: { price: 'text-lg', old: 'text-sm', save: 'text-xs' },
  lg: { price: 'text-2xl', old: 'text-base', save: 'text-sm' },
};

export default function PriceTag({
  price,
  oldPrice,
  saveAmount,
  size = 'md',
  className = '',
}: PriceTagProps) {
  const styles = sizeStyles[size];
  const formattedPrice = price.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className={`flex flex-col items-center gap-0.5 ${className}`}>
      <div className={`font-bold text-accent ${styles.price}`}>
        £{formattedPrice}
      </div>
      {oldPrice !== undefined && (
        <div className={`text-dark/50 line-through ${styles.old}`}>
          £
          {oldPrice.toLocaleString('en-GB', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      )}
      {saveAmount !== undefined && saveAmount > 0 && (
        <div className={`font-medium text-red-600 tracking-wider ${styles.save}`}>
          Save £
          {saveAmount.toLocaleString('en-GB', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      )}
    </div>
  );
}
