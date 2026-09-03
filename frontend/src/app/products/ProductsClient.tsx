'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ProductCard, Spinner } from '@/components/ui';

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

const CATEGORIES = ['All', '2-Seater', '3-Seater', 'Corner', 'Recliner'] as const;
const FABRICS = ['All Fabrics', 'Velvet', 'Linen', 'Bouclé', 'Leather', 'Fabric'] as const;
type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest',
  'price-asc': 'Price Low → High',
  'price-desc': 'Price High → Low',
  'name-asc': 'Name A → Z',
};

const MOCK_PRODUCTS: Product[] = [
  { id: 'a1000000-0000-0000-0000-000000000001', slug: 'chesterfield-2-seater', title: 'Chesterfield 2-Seater Sofa', description: 'Classic deep buttoned Chesterfield in genuine leather.', base_price: 2199.00, images: ['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800'], category: '2-Seater', variants: [{ id: 'v1', range_type: '2-Seater', price: 2199.00, stock: 3, color: 'Cognac' }] },
  { id: 'a1000000-0000-0000-0000-000000000002', slug: 'velvet-2-seater', title: 'Velvet 2-Seater Sofa', description: 'Plush velvet upholstery with slim oak legs.', base_price: 1799.00, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'], category: '2-Seater', variants: [{ id: 'v2', range_type: '2-Seater', price: 1799.00, stock: 5, color: 'Bourneville' }] },
  { id: 'a1000000-0000-0000-0000-000000000003', slug: 'linen-2-seater', title: 'Linen 2-Seater Sofa', description: 'Relaxed linen blend with feather-filled cushions.', base_price: 1499.00, images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800'], category: '2-Seater', variants: [{ id: 'v3', range_type: '2-Seater', price: 1499.00, stock: 7, color: 'Mushroom' }] },
  { id: 'a1000000-0000-0000-0000-000000000004', slug: 'velvet-3-seater', title: 'Velvet 3-Seater Sofa', description: 'Luxurious velvet 3-seater with deep seat.', base_price: 2499.00, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'], category: '3-Seater', variants: [{ id: 'v4', range_type: '3-Seater', price: 2499.00, stock: 3, color: 'Charcoal' }] },
  { id: 'a1000000-0000-0000-0000-000000000005', slug: 'boucle-3-seater', title: 'Bouclé 3-Seater Sofa', description: 'Trendy bouclé fabric with cloud-like comfort.', base_price: 2899.00, images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800'], category: '3-Seater', variants: [{ id: 'v5', range_type: '3-Seater', price: 2899.00, stock: 3, color: 'Cream' }] },
  { id: 'a1000000-0000-0000-0000-000000000006', slug: 'leather-3-seater', title: 'Leather 3-Seater Sofa', description: 'Premium aniline leather with natural patina.', base_price: 2799.00, images: ['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800'], category: '3-Seater', variants: [{ id: 'v6', range_type: '3-Seater', price: 2799.00, stock: 2, color: 'Cognac' }] },
  { id: 'a1000000-0000-0000-0000-000000000007', slug: 'velvet-corner-left', title: 'Velvet Corner Sofa — Left Facing', description: 'Generous L-shaped corner in premium velvet.', base_price: 3299.00, images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800'], category: 'Corner', variants: [{ id: 'v7', range_type: 'Left Facing', price: 3299.00, stock: 2, color: 'Bourneville' }] },
  { id: 'a1000000-0000-0000-0000-000000000008', slug: 'velvet-corner-right', title: 'Velvet Corner Sofa — Right Facing', description: 'Mirror of our best-selling left-facing corner.', base_price: 3299.00, images: ['https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800'], category: 'Corner', variants: [{ id: 'v8', range_type: 'Right Facing', price: 3299.00, stock: 4, color: 'Charcoal' }] },
  { id: 'a1000000-0000-0000-0000-000000000009', slug: 'leather-corner', title: 'Leather Corner Sofa', description: 'Statement corner in full-grain leather.', base_price: 3599.00, images: ['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800'], category: 'Corner', variants: [{ id: 'v9', range_type: 'Corner', price: 3599.00, stock: 1, color: 'Cognac' }] },
  { id: 'a1000000-0000-0000-0000-000000000010', slug: 'velvet-recliner-pair', title: 'Velvet Recliner Pair', description: 'Set of 2 electric recliners in soft velvet.', base_price: 2999.00, images: ['https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800'], category: 'Recliner', variants: [{ id: 'v10', range_type: 'Recliner Pair', price: 2999.00, stock: 3, color: 'Bourneville' }] },
  { id: 'a1000000-0000-0000-0000-000000000011', slug: 'leather-recliner', title: 'Leather Recliner Sofa', description: 'Manual recliner in durable bonded leather.', base_price: 2299.00, images: ['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800'], category: 'Recliner', variants: [{ id: 'v11', range_type: 'Recliner', price: 2299.00, stock: 4, color: 'Cognac' }] },
  { id: 'a1000000-0000-0000-0000-000000000012', slug: 'fabric-recliner-pair', title: 'Fabric Recliner Pair', description: 'Set of 2 manual recliners in easy-clean fabric.', base_price: 1799.00, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'], category: 'Recliner', variants: [{ id: 'v12', range_type: 'Recliner Pair', price: 1799.00, stock: 5, color: 'Light Grey' }] },
];

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>(initialCategory);
  const [fabric, setFabric] = useState<string>('All Fabrics');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) { setProducts(data); setLoading(false); return; }
        }
      } catch { /* fall through */ }
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const FABRIC_KEYWORDS: Record<string, string[]> = {
    Velvet: ['velvet'],
    Linen: ['linen'],
    'Bouclé': ['bouclé', 'boucle'],
    Leather: ['leather', 'chesterfield'],
    Fabric: ['fabric'],
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (category !== 'All') result = result.filter((p) => p.category === category);
    if (fabric !== 'All Fabrics') {
      const keywords = FABRIC_KEYWORDS[fabric] || [];
      result = result.filter((p) => keywords.some((k) => p.title.toLowerCase().includes(k) || p.description?.toLowerCase().includes(k)));
    }
    result = result.filter((p) => p.base_price >= priceRange[0] && p.base_price <= priceRange[1]);
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.base_price - b.base_price); break;
      case 'price-desc': result.sort((a, b) => b.base_price - a.base_price); break;
      case 'name-asc': result.sort((a, b) => a.title.localeCompare(b.title)); break;
    }
    return result;
  }, [products, category, fabric, sortBy, priceRange]);

  const formatPrice = (n: number) => n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-primary min-h-screen relative">
      <div className="bg-orb bg-orb-accent w-[500px] h-[500px] -top-40 -right-40 absolute pointer-events-none" />
      <div className="bg-orb bg-orb-gold w-[400px] h-[400px] top-[60%] -left-40 absolute pointer-events-none" />

      <section className="py-20 glass-white border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] text-dark uppercase mb-4">
            {category !== 'All' ? `${category} Collection` : 'Our Collection'}
          </h1>
          <div className="glass-divider max-w-[120px] mx-auto mb-4" />
          <p className="text-xs tracking-[0.2em] text-dark/50 uppercase font-medium">
            Handmade in the UK — Free delivery on all orders
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-dark/5">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 ${category === cat ? 'glass-btn text-white shadow-glow' : 'glass-card text-dark/60 hover:text-dark'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {FABRICS.map((f) => (
              <button key={f} onClick={() => setFabric(f)}
                className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium transition-all duration-300 ${fabric === f ? 'glass-btn text-white' : 'glass-card text-dark/50 hover:text-dark'}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[10px] text-dark/40 uppercase tracking-widest">Price:</label>
            <input type="range" min={0} max={5000} step={100} value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-32 accent-accent" />
            <span className="text-xs text-dark/50">Up to £{priceRange[1].toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 glass-input rounded-xl text-xs uppercase tracking-widest text-dark focus:outline-none focus:ring-2 focus:ring-accent/20">
              {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <div className="flex glass-card rounded-xl overflow-hidden p-0.5">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'glass-btn text-white' : 'text-dark/40 hover:text-dark'}`} aria-label="Grid view">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'glass-btn text-white' : 'text-dark/40 hover:text-dark'}`} aria-label="List view">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-dark/40 tracking-[0.2em] uppercase">
            Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </p>
          {category !== 'All' && (
            <button onClick={() => setCategory('All')} className="text-xs text-accent hover:underline tracking-wide">Clear filter</button>
          )}
        </div>

        {loading ? (
          <div className="py-32 flex justify-center"><Spinner label="Loading products..." /></div>
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center">
            <div className="glass-white rounded-2xl p-12 max-w-md mx-auto">
              <p className="text-dark/40 tracking-[0.2em] uppercase text-sm mb-4">No products found</p>
              <button onClick={() => setCategory('All')} className="glass-btn text-white px-6 py-2 rounded-full text-xs uppercase tracking-widest">View all products</button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
            {filtered.map((p) => (
              <ProductCard key={p.id} id={p.id} title={p.title} image={p.images[0]} newPrice={p.base_price} oldPrice={p.base_price * 1.35} saveAmount={p.base_price * 0.35} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="flex gap-6 p-5 glass-card rounded-2xl">
                <div className="w-48 h-48 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[10px] text-dark/40 tracking-[0.2em] uppercase mb-1">{p.category}</p>
                  <h3 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-2">{p.title}</h3>
                  <p className="text-sm text-dark/50 mb-3 line-clamp-2">{p.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-accent font-bold">£{formatPrice(p.base_price)}</span>
                    <span className="text-xs text-dark/30 line-through">£{formatPrice(p.base_price * 1.35)}</span>
                    <span className="text-xs text-red-500 font-medium">Save £{formatPrice(p.base_price * 0.35)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
