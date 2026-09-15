import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, Star } from 'lucide-react';
import HomeHero from '@/components/HomeHero';
import HomeProductSections from '@/components/HomeProductSections';
import LazyImage from '@/components/LazyImage';
import { listProducts } from '@/lib/product-store';
import { formatProductPrice, getProductPrice } from '@/lib/product-options';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Corner Sofa | Beautifully British. Comfortably Yours.',
  description: 'Shop handmade British sofas with free UK delivery.',
  alternates: { canonical: '/' },
};

const categories = [
  { title: '2-seater sofas', href: '/products?category=2-Seater', image: 'premium-two-seater.webp', price: '£2,499', rating: '4.8', detail: 'Compact 2-seater sofas for cosy rooms', types: '2-Seater Sofas, Small Space Sofas' },
  { title: '3-seater sofas', href: '/products?category=3-Seater', image: 'premium-three-seater.webp', price: '£2,899', rating: '5.0', detail: 'Generous 3-seater sofas made to unwind', types: '3-Seater Sofas, Family Sofas' },
  { title: 'Corner sofas', href: '/products?category=Corner', image: 'premium-corner.webp', price: '£3,599', rating: '4.9', detail: 'Statement corner sofas for gathering', types: 'Corner Sofas, Leather & Fabric' },
  { title: 'U-shape sofas', href: '/products?category=U-Shape', image: 'comfort-hero.webp', price: '£3,999', rating: '4.9', detail: 'Spacious U-shape sofas for everyone', types: 'U-Shape Sofas, Modular Sofas' },
  { title: 'Recliner sofas', href: '/products?category=Recliner', image: 'premium-recliners.webp', price: '£2,299', rating: '5.0', detail: 'Recliner sofas made for deep relaxation', types: 'Electric & Manual Recliner Sofas' },
];

export default async function HomePage() {
  const products = await listProducts().catch(() => []);
  const sofaBeds = products.filter(product => product.category === 'Sofa Bed');
  const homeCategories = [...categories, {
    title: 'Sofa beds', href: '/products?category=Sofa%20Bed', image: 'premium-sofa-bed.webp',
    price: sofaBeds.length ? formatProductPrice(Math.min(...sofaBeds.map(getProductPrice))) : '',
    rating: '', detail: 'Comfort by day, a cosy bed by night', types: 'Sofa Beds, Guest Room Comfort',
  }];
  return (
    <div className="storefront-home">
      <HomeHero />
      <section id="collections" className="category-orbit-section home-dark-categories">
        <h2 className="home-category-title">Our Categories</h2>
        <div className="category-orbit-grid">
          {homeCategories.map(category => (
            <article key={category.title} className="category-orbit-item">
              <Link href={category.href} className="category-orbit-link">
                <span className="category-orbit-photo">
                  <LazyImage src={`/images/sofas/${category.image}`} alt={category.title} className="h-full w-full" />
                </span>
                <strong>{category.title}</strong>
              </Link>
              <div className="category-orbit-details">
                <div className="category-orbit-info">
                  <div className="category-orbit-title-row">
                    <h3>{category.detail}</h3>
                    {category.rating && <span>{category.rating}<Star size={13} fill="currentColor" aria-hidden="true" /></span>}
                  </div>
                  <p>{category.types}</p>
                </div>
                <div className="category-orbit-buy">
                  <p>{category.price ? <><span>From</span><strong>{category.price}</strong></> : <span>Coming soon</span>}</p>
                  <Link href={category.href} aria-label={`Shop ${category.title}`}>
                    Shop <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <HomeProductSections />
    </div>
  );
}
