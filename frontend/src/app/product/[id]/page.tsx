'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SwatchRequestModal from '@/components/SwatchRequestModal';
import { Button, PriceTag, Badge, Spinner } from '@/components/ui';
import { useCart } from '@/context/CartContext';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/schema';
import SocialProof from '@/components/SocialProof';

interface ProductVariant {
  id: string;
  range_type: string;
  price: number;
  stock: number;
  color: string;
}

interface Product {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  base_price: number;
  images: string[];
  category: string;
  variants: ProductVariant[];
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'a1000000-0000-0000-0000-000000000001', slug: 'chesterfield-2-seater', title: 'Chesterfield 2-Seater Sofa',
    description: 'Classic deep buttoned Chesterfield in genuine leather. Solid hardwood frame with serpentine springs for lasting comfort. Hand-finished by skilled artisans in our UK workshop.',
    base_price: 2199.00,
    images: ['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800'],
    category: '2-Seater',
    variants: [
      { id: 'v1a', range_type: '2-Seater', price: 2199.00, stock: 3, color: 'Cognac' },
      { id: 'v1b', range_type: '2-Seater', price: 2299.00, stock: 2, color: 'Black' },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000002', slug: 'velvet-2-seater', title: 'Velvet 2-Seater Sofa',
    description: 'Plush velvet upholstery with slim oak legs. Compact design perfect for smaller living spaces. Feather-blend seat cushions for everyday comfort.',
    base_price: 1799.00,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800'],
    category: '2-Seater',
    variants: [
      { id: 'v2a', range_type: '2-Seater', price: 1799.00, stock: 5, color: 'Bourneville' },
      { id: 'v2b', range_type: '2-Seater', price: 1799.00, stock: 4, color: 'Charcoal' },
      { id: 'v2c', range_type: '2-Seater', price: 1849.00, stock: 6, color: 'Beige' },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000003', slug: 'linen-2-seater', title: 'Linen 2-Seater Sofa',
    description: 'Relaxed linen blend with feather-filled cushions. Timeless rolled arms and turnip legs. Pre-washed for a soft, lived-in feel from day one.',
    base_price: 1499.00,
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800'],
    category: '2-Seater',
    variants: [
      { id: 'v3a', range_type: '2-Seater', price: 1499.00, stock: 7, color: 'Mushroom' },
      { id: 'v3b', range_type: '2-Seater', price: 1499.00, stock: 5, color: 'Cream' },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000004', slug: 'velvet-3-seater', title: 'Velvet 3-Seater Sofa',
    description: 'Luxurious velvet 3-seater with deep seat and supportive back cushions. Handcrafted in the UK with kiln-dried hardwood frame.',
    base_price: 2499.00,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800'],
    category: '3-Seater',
    variants: [
      { id: 'v4a', range_type: '3-Seater', price: 2499.00, stock: 3, color: 'Bourneville' },
      { id: 'v4b', range_type: '3-Seater', price: 2499.00, stock: 4, color: 'Charcoal' },
      { id: 'v4c', range_type: '3-Seater', price: 2599.00, stock: 2, color: 'Ivory' },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000005', slug: 'boucle-3-seater', title: 'Bouclé 3-Seater Sofa',
    description: 'Trendy bouclé fabric with cloud-like comfort. Oversized proportions for ultimate lounging. Deep pocket spring system.',
    base_price: 2899.00,
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
    category: '3-Seater',
    variants: [
      { id: 'v5a', range_type: '3-Seater', price: 2899.00, stock: 3, color: 'Cream' },
      { id: 'v5b', range_type: '3-Seater', price: 2999.00, stock: 2, color: 'Grey' },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000006', slug: 'leather-3-seater', title: 'Leather 3-Seater Sofa',
    description: 'Premium aniline leather with natural patina. Solid oak frame and hand-stitched detailing. Ages beautifully over time.',
    base_price: 2799.00,
    images: ['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800'],
    category: '3-Seater',
    variants: [
      { id: 'v6a', range_type: '3-Seater', price: 2799.00, stock: 2, color: 'Cognac' },
      { id: 'v6b', range_type: '3-Seater', price: 2899.00, stock: 3, color: 'Black' },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000007', slug: 'velvet-corner-left', title: 'Velvet Corner Sofa — Left Facing',
    description: 'Generous L-shaped corner in premium velvet. Reversible cushion design for flexible styling. Deep seats and wide arms.',
    base_price: 3299.00,
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
    category: 'Corner',
    variants: [
      { id: 'v7a', range_type: 'Left Facing', price: 3299.00, stock: 2, color: 'Bourneville' },
      { id: 'v7b', range_type: 'Left Facing', price: 3299.00, stock: 3, color: 'Charcoal' },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000008', slug: 'velvet-corner-right', title: 'Velvet Corner Sofa — Right Facing',
    description: 'Mirror of our best-selling left-facing corner. Same premium velvet and construction. Perfect for asymmetric rooms.',
    base_price: 3299.00,
    images: ['https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800'],
    category: 'Corner',
    variants: [
      { id: 'v8a', range_type: 'Right Facing', price: 3299.00, stock: 2, color: 'Bourneville' },
      { id: 'v8b', range_type: 'Right Facing', price: 3299.00, stock: 4, color: 'Charcoal' },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000009', slug: 'leather-corner', title: 'Leather Corner Sofa',
    description: 'Statement corner in full-grain leather. Wide arms and deep seats for a luxurious feel. Built to last a lifetime.',
    base_price: 3599.00,
    images: ['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
    category: 'Corner',
    variants: [
      { id: 'v9a', range_type: 'Corner', price: 3599.00, stock: 1, color: 'Cognac' },
      { id: 'v9b', range_type: 'Corner', price: 3699.00, stock: 2, color: 'Black' },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000010', slug: 'velvet-recliner-pair', title: 'Velvet Recliner Pair',
    description: 'Set of 2 electric recliners in soft velvet. USB charging port and adjustable headrest. Silent motor operation.',
    base_price: 2999.00,
    images: ['https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
    category: 'Recliner',
    variants: [
      { id: 'v10a', range_type: 'Recliner Pair', price: 2999.00, stock: 3, color: 'Bourneville' },
      { id: 'v10b', range_type: 'Recliner Pair', price: 2999.00, stock: 2, color: 'Charcoal' },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000011', slug: 'leather-recliner', title: 'Leather Recliner Sofa',
    description: 'Manual recliner in durable bonded leather. Solid mechanism with 5-year guarantee. Padded armrests and headrest.',
    base_price: 2299.00,
    images: ['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800'],
    category: 'Recliner',
    variants: [
      { id: 'v11a', range_type: 'Recliner', price: 2299.00, stock: 4, color: 'Cognac' },
      { id: 'v11b', range_type: 'Recliner', price: 2399.00, stock: 3, color: 'Black' },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000012', slug: 'fabric-recliner-pair', title: 'Fabric Recliner Pair',
    description: 'Set of 2 manual recliners in easy-clean fabric. Foam-filled cushions and lumbar support. Family-friendly comfort.',
    base_price: 1799.00,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800'],
    category: 'Recliner',
    variants: [
      { id: 'v12a', range_type: 'Recliner Pair', price: 1799.00, stock: 5, color: 'Light Grey' },
      { id: 'v12b', range_type: 'Recliner Pair', price: 1799.00, stock: 4, color: 'Mushroom' },
    ],
  },
];

const TABS = ['Details', 'Delivery', 'Warranty'] as const;
type Tab = (typeof TABS)[number];

const TAB_CONTENT: Record<Tab, { title: string; items: string[] }> = {
  Details: {
    title: 'Product Details',
    items: [
      'Handcrafted in the UK by skilled artisans',
      'Kiln-dried hardwood frame for structural integrity',
      'Premium fabric upholstery (see variant for material)',
      'Foam and feather-blend seat cushions',
      'Removable and reversible seat cushions',
      '10-year structural warranty included',
    ],
  },
  Delivery: {
    title: 'Delivery Information',
    items: [
      'Free room-of-choice delivery across the UK',
      'Standard delivery: 5–7 working days',
      'Express delivery (2–3 days): £29.99 at checkout',
      'Two-person delivery team to your room of choice',
      'Old sofa removal available for £49.99',
      'Delivery to Scotland may take an additional 2–3 days',
    ],
  },
  Warranty: {
    title: '10-Year Warranty',
    items: [
      '10-year guarantee on all sofa frames',
      'Covers structural frame integrity and joint stability',
      'Sagging prevention — seat foam density retained',
      'Fabric quality issues covered for 2 years',
      'Recliner mechanism covered for 5 years',
      'Simple online claims process — no hidden costs',
    ],
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [showSwatchModal, setShowSwatchModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('Details');
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const all: Product[] = await res.json();
          const found = all.find((p) => p.id === params.id);
          if (found) {
            setProduct(found);
            if (found.variants.length > 0) setSelectedVariant(found.variants[0]);
            const related = all
              .filter((p) => p.category === found.category && p.id !== found.id)
              .slice(0, 4);
            setRelatedProducts(related);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fall through to mock
      }
      const found = MOCK_PRODUCTS.find((p) => p.id === params.id);
      if (found) {
        setProduct(found);
        if (found.variants.length > 0) setSelectedVariant(found.variants[0]);
        const related = MOCK_PRODUCTS
          .filter((p) => p.category === found.category && p.id !== found.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      range_type: selectedVariant.range_type,
      color: selectedVariant.color,
      price: selectedVariant.price,
      image: product.images[0],
      title: product.title,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const formatPrice = (n: number) =>
    n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-primary">
        <Spinner label="Loading product..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-primary">
        <div className="text-center">
          <h2 className="text-2xl font-light tracking-[0.15em] text-dark uppercase mb-4">
            Product Not Found
          </h2>
          <p className="text-sm text-dark/60 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button variant="contrast" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="stock-out">Out of Stock</Badge>;
    if (stock <= 3) return <Badge variant="stock-low">Low Stock ({stock} left)</Badge>;
    return <Badge variant="stock-high">In Stock</Badge>;
  };

  return (
    <main className="py-12 bg-primary relative">
      <div className="bg-orb bg-orb-accent w-[500px] h-[500px] -top-40 -right-40 absolute pointer-events-none" />
      <div className="bg-orb bg-orb-gold w-[400px] h-[400px] top-[50%] -left-40 absolute pointer-events-none" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductSchema({
            title: product.title,
            description: product.description || '',
            images: product.images,
            base_price: selectedVariant?.price || product.base_price,
            id: product.id,
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Products', url: '/products' },
            { name: product.category, url: `/products?category=${product.category}` },
            { name: product.title, url: `/product/${product.id}` },
          ])),
        }}
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-dark/40 mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-accent transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-accent transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-dark/70">{product.title}</span>
        </nav>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Gallery */}
          <div>
            <div className="aspect-square overflow-hidden rounded-3xl glass-card p-0 mb-4">
              <img src={product.images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, index) => (
                <button key={index} onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-xl transition-all duration-300 ${selectedImage === index ? 'ring-2 ring-accent ring-offset-2 ring-offset-primary glass-card p-0' : 'glass-card p-0 opacity-50 hover:opacity-100'}`}>
                  <img src={img} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-[10px] text-dark/40 tracking-[0.2em] uppercase mb-2">{product.category}</p>
            <h1 className="text-3xl font-light tracking-[0.12em] text-dark uppercase mb-4">{product.title}</h1>
            <div className="mb-4">
              <PriceTag price={selectedVariant?.price || product.base_price} size="lg" />
            </div>
            {selectedVariant && <div className="mb-6">{getStockBadge(selectedVariant.stock)}</div>}

            <div className="mb-6">
              <label className="text-dark text-xs font-medium mb-3 block tracking-[0.1em] uppercase">Configuration</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button key={variant.id} onClick={() => setSelectedVariant(variant)} disabled={variant.stock === 0}
                    className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 ${selectedVariant?.id === variant.id ? 'glass-btn text-white' : variant.stock === 0 ? 'glass-card text-dark/20 cursor-not-allowed line-through' : 'glass-card text-dark/60 hover:text-dark'}`}>
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <Button variant="glass-outline" size="lg" className="flex-1" onClick={() => setShowSwatchModal(true)}>
                Free Swatches
              </Button>
              <Button variant="glass" size="lg" className="flex-1" onClick={handleAddToCart} disabled={!selectedVariant || selectedVariant.stock === 0}>
                {addedToCart ? 'Added ✓' : 'Add to Basket'}
              </Button>
            </div>

            {product.description && (
              <p className="text-sm text-dark/50 leading-relaxed mb-6">{product.description}</p>
            )}

            <div className="glass-white rounded-xl p-4 flex items-center gap-4 text-xs text-dark/50">
              <span className="flex items-center gap-1.5">🚚 Free Delivery</span>
              <span className="flex items-center gap-1.5">🛡️ 10-Year Warranty</span>
              <span className="flex items-center gap-1.5">🇬🇧 UK Handmade</span>
            </div>

            <div className="mt-4 glass-accent rounded-xl p-3 flex items-center gap-2">
              <span className="text-xs font-medium text-dark">Pay in 3 interest-free instalments with Klarna</span>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="mb-16">
          <div className="flex gap-1 glass-white rounded-full p-1 mb-6 w-fit">
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-xs uppercase tracking-[0.15em] font-medium rounded-full transition-all duration-300 ${activeTab === tab ? 'glass-btn text-white' : 'text-dark/40 hover:text-dark'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="glass-white rounded-2xl p-8">
            <h3 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-5">{TAB_CONTENT[activeTab].title}</h3>
            <ul className="space-y-3">
              {TAB_CONTENT[activeTab].items.map((item, i) => (
                <li key={i} className="text-sm text-dark/60 leading-relaxed flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Reviews via SocialProof */}
        <SocialProof
          reviews={[
            { id: 'r1', name: 'Emma R.', location: 'London', rating: 5, title: 'Beautiful quality', review: 'Absolutely stunning sofa. The velvet is incredibly soft and the build quality is exceptional.', image: '', date: 'Aug 2026', verified: true },
            { id: 'r2', name: 'James T.', location: 'Manchester', rating: 4, title: 'Great value', review: 'Great value for money. Looks much more expensive than it is.', image: '', date: 'Aug 2026', verified: true },
            { id: 'r3', name: 'Sophie H.', location: 'Birmingham', rating: 5, title: 'Perfect fit', review: 'Fits our awkward room perfectly. The free swatches were a game-changer.', image: '', date: 'Jul 2026', verified: true },
          ]}
          showCount={3}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-xl font-light tracking-[0.15em] text-dark uppercase mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`} className="group text-center">
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl glass-card p-0">
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-2xl" />
                  </div>
                  <h3 className="text-sm font-light tracking-widest text-dark mb-1 uppercase">{p.title}</h3>
                  <PriceTag price={p.base_price} size="sm" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <SwatchRequestModal isOpen={showSwatchModal} onClose={() => setShowSwatchModal(false)} onSubmit={(data) => console.log('Swatch request:', data)} />
    </main>
  );
}
