import Link from 'next/link';
import Badge from './Badge';
import PriceTag from './PriceTag';

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  oldPrice?: number;
  newPrice: number;
  saveAmount?: number;
  category?: string;
  badge?: string;
  href?: string;
}

export default function ProductCard({
  id,
  title,
  image,
  oldPrice,
  newPrice,
  saveAmount,
  badge = 'Sale',
  href,
}: ProductCardProps) {
  const linkHref = href || `/product/${id}`;

  return (
    <Link href={linkHref} className="group text-center block cursor-pointer">
      <div className="relative aspect-square mb-6 overflow-hidden rounded-2xl glass-card p-0">
        {badge && (
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="sale">{badge}</Badge>
          </div>
        )}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-2xl"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-contrast/90 to-transparent pt-16 pb-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-b-2xl">
          <span className="text-white text-xs uppercase tracking-[0.2em]">View Details</span>
        </div>
      </div>
      <h3 className="text-sm font-light tracking-widest text-dark mb-2 uppercase line-clamp-1">
        {title}
      </h3>
      <PriceTag price={newPrice} oldPrice={oldPrice} saveAmount={saveAmount} size="sm" />
    </Link>
  );
}
