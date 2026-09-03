import Link from 'next/link';
import { Metadata } from 'next';
import SocialProof from '@/components/SocialProof';

export const metadata: Metadata = {
  title: 'Corner Sofa | Premium UK Handmade Sofas',
  description: 'Premium quality, handmade sofas crafted in the UK. Free delivery, 10-year warranty, and free fabric swatches. Shop our collection of 2-seater, 3-seater, corner, and recliner sofas.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Corner Sofa | Premium UK Handmade Sofas',
    description: 'Premium quality, handmade sofas crafted in the UK. Free delivery, 10-year warranty.',
  },
};

const featuredSofas = [
  { id: '1', title: 'Luxury 3+2 Seater Sofa', oldPrice: 3499.99, newPrice: 2499.99, saveAmount: 1000, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
  { id: '2', title: 'Corner Sofa Left Facing', oldPrice: 4599.99, newPrice: 3299.99, saveAmount: 1300, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800' },
  { id: '3', title: 'Chesterfield Leather Sofa', oldPrice: 3899.99, newPrice: 2899.99, saveAmount: 1000, image: 'https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800' },
  { id: '4', title: 'Modern Sectional Sofa', oldPrice: 2799.99, newPrice: 1999.99, saveAmount: 800, image: 'https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800' },
  { id: '5', title: 'Velvet Recliner Set', oldPrice: 3199.99, newPrice: 2299.99, saveAmount: 900, image: 'https://images.unsplash.com/photo-1506898667547-42e22a46e125?auto=format&fit=crop&q=80&w=800' },
];

const categories = [
  { title: '2-Seater Sofas', slug: '2-Seater', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
  { title: '3-Seater Sofas', slug: '3-Seater', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800' },
  { title: 'Corner Sofas', slug: 'Corner', image: 'https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800' },
  { title: 'Recliners', slug: 'Recliner', image: 'https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800' },
];

const sofaCollection = [
  { id: '1', title: 'Luxury 3+2 Seater Sofa', oldPrice: 3499.99, newPrice: 2499.99, saveAmount: 1000, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
  { id: '2', title: 'Corner Sofa Left Facing', oldPrice: 4599.99, newPrice: 3299.99, saveAmount: 1300, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800' },
  { id: '3', title: 'Chesterfield Leather Sofa', oldPrice: 3899.99, newPrice: 2899.99, saveAmount: 1000, image: 'https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800' },
  { id: '4', title: 'Modern Sectional Sofa', oldPrice: 2799.99, newPrice: 1999.99, saveAmount: 800, image: 'https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800' },
];

const reviews = [
  { id: 'r1', name: 'Emma R.', location: 'London', rating: 5, title: 'Beautiful quality', review: 'The 3+2 seater sofa is exactly as described. Premium velvet, excellent craftsmanship, and the UK delivery was prompt.', image: '/placeholder.svg', date: '2 weeks ago', verified: true },
  { id: 'r2', name: 'James T.', location: 'Manchester', rating: 4, title: 'Great value for money', review: 'Excellent sofa for the price. Easy assembly and looks stunning in our living room.', image: '/placeholder.svg', date: '1 month ago', verified: true },
  { id: 'r3', name: 'Sophie H.', location: 'Birmingham', rating: 5, title: 'Perfect for our space', review: 'The corner sofa fits our awkward room perfectly. The linen blend is high quality.', image: '/placeholder.svg', date: '3 weeks ago', verified: true },
  { id: 'r4', name: 'David M.', location: 'Leeds', rating: 5, title: 'Stunning craftsmanship', review: 'You can really feel the quality handmade construction. The leather is genuine.', image: '/placeholder.svg', date: '1 week ago', verified: true },
  { id: 'r5', name: 'Sarah K.', location: 'Edinburgh', rating: 5, title: 'Showroom visit was worth it', review: 'Visited the Manchester showroom first and the team were incredibly helpful.', image: '/placeholder.svg', date: '2 months ago', verified: false },
  { id: 'r6', name: 'Tom W.', location: 'Bristol', rating: 4, title: 'Quick delivery', review: 'Ordered on Monday, delivered by Friday. The 3-seater fits perfectly in our new flat.', image: '/placeholder.svg', date: '3 months ago', verified: true },
];

export default function HomePage() {
  const fmt = (n: number) => n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-primary relative overflow-hidden">
      {/* ── Decorative Background Orbs ───────────────── */}
      <div className="bg-orb bg-orb-accent w-[600px] h-[600px] -top-40 -right-40 absolute pointer-events-none" />
      <div className="bg-orb bg-orb-gold w-[500px] h-[500px] top-[40%] -left-60 absolute pointer-events-none" />
      <div className="bg-orb bg-orb-secondary w-[400px] h-[400px] bottom-20 right-[-10%] absolute pointer-events-none" />

      {/* ── Hero Section ─────────────────────────────── */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=2000"
          alt="Premium handmade sofa in a living room"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-xl animate-slide-up">
            <div className="glass-accent inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-soft" />
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-medium">UK Handcrafted since 2018</span>
            </div>
            <h1 className="text-4xl md:text-[4rem] font-light text-dark tracking-[0.12em] leading-[1.05] mb-6 uppercase">
              Where every<br />seat tells<br />a story.
            </h1>
            <p className="text-lg md:text-xl text-dark/60 mb-10 font-light tracking-wide leading-relaxed">
              Premium sofas, handmade to order in the UK.<br />
              Delivered free to your room of choice.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="glass-btn inline-flex items-center gap-3 text-white px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-medium">
                Shop Now <span className="text-lg leading-none">&rarr;</span>
              </Link>
              <Link href="/swatches" className="glass-btn-outline inline-flex items-center gap-3 text-dark px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-medium">
                Free Swatches
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Value Propositions ───────────────────────── */}
      <section className="relative z-10 -mt-8 mx-auto max-w-6xl px-4">
        <div className="glass-white rounded-2xl p-2">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { icon: '🇬🇧', label: 'UK Handmade', sub: 'Crafted in Britain' },
              { icon: '🛡️', label: '10-Year Warranty', sub: 'Frame & structure' },
              { icon: '🚚', label: 'Free Delivery', sub: 'Room of choice' },
              { icon: '🎨', label: 'Free Swatches', sub: 'Try before you buy' },
            ].map((item, i) => (
              <div key={i} className={`py-6 px-5 text-center ${i < 3 ? 'border-r border-dark/5' : ''}`}>
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-[10px] font-medium text-dark uppercase tracking-[0.15em]">{item.label}</p>
                <p className="text-[10px] text-dark/40 mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Sofas ───────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="mb-14">
          <h2 className="text-3xl font-light tracking-[0.2em] text-dark uppercase mb-4">Featured Sofas</h2>
          <div className="glass-divider max-w-[120px] mx-auto mb-6" />
          <Link href="/products" className="glass-btn-outline inline-flex items-center px-8 py-3 text-xs uppercase tracking-[0.2em] text-dark rounded-full">
            View All
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {featuredSofas.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group text-center flex-shrink-0 w-[280px] snap-start cursor-pointer">
              <div className="relative aspect-square mb-6 overflow-hidden rounded-2xl glass-card p-0">
                <div className="absolute top-4 right-4 bg-contrast/90 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 z-10 tracking-[0.2em] uppercase rounded-full">
                  Sale
                </div>
                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-2xl" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-contrast/90 to-transparent pt-16 pb-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-b-2xl">
                  <span className="text-white text-xs uppercase tracking-[0.2em]">View Details</span>
                </div>
              </div>
              <h3 className="text-sm font-light tracking-widest text-dark mb-2 uppercase">{product.title}</h3>
              <div className="text-sm text-dark/50 mb-1">
                <span className="line-through">£{fmt(product.oldPrice)}</span>{' '}
                <span className="text-accent font-medium">£{fmt(product.newPrice)}</span>
              </div>
              <div className="text-xs font-medium text-red-500 tracking-wider">Save £{fmt(product.saveAmount)}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────── */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-light tracking-[0.2em] text-dark uppercase mb-4">Shop by Category</h2>
            <div className="glass-divider max-w-[120px] mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="group">
                <div className="aspect-square overflow-hidden rounded-2xl glass-card p-0 mb-4">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="text-sm font-light tracking-widest text-dark uppercase mb-3">{cat.title}</h3>
                <span className="glass-btn-outline inline-flex items-center px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-dark rounded-full group-hover:bg-accent/10 transition-colors">
                  Shop Now
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Collection ───────────────────────────── */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-light tracking-[0.2em] text-dark uppercase mb-4">Our Collection</h2>
            <div className="glass-divider max-w-[120px] mx-auto mb-6" />
            <Link href="/products" className="glass-btn-outline inline-flex items-center px-8 py-3 text-xs uppercase tracking-[0.2em] text-dark rounded-full">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sofaCollection.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group text-center cursor-pointer">
                <div className="relative aspect-square mb-6 overflow-hidden rounded-2xl glass-card p-0">
                  <div className="absolute top-4 right-4 bg-contrast/90 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 z-10 tracking-[0.2em] uppercase rounded-full">
                    Sale
                  </div>
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-2xl" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-contrast/90 to-transparent pt-16 pb-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-b-2xl">
                    <span className="text-white text-xs uppercase tracking-[0.2em]">View Details</span>
                  </div>
                </div>
                <h3 className="text-sm font-light tracking-widest text-dark mb-2 uppercase">{product.title}</h3>
                <div className="text-sm text-dark/50 mb-1">
                  <span className="line-through">£{fmt(product.oldPrice)}</span> from{' '}
                  <span className="text-accent font-medium">£{fmt(product.newPrice)}</span>
                </div>
                <div className="text-xs font-medium text-red-500 tracking-wider">Save £{fmt(product.saveAmount)}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof ─────────────────────────────── */}
      <section className="relative z-10">
        <SocialProof reviews={reviews} showCount={6} />
      </section>

      {/* ── CTA Banner ───────────────────────────────── */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass-dark rounded-3xl py-20 px-8 text-center relative overflow-hidden">
            <div className="bg-orb bg-orb-accent w-[300px] h-[300px] -top-20 -right-20 absolute" />
            <div className="bg-orb bg-orb-gold w-[200px] h-[200px] -bottom-10 -left-10 absolute" />
            <div className="relative z-10">
              <div className="glass-accent inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6">
                <span className="text-xs uppercase tracking-[0.2em] text-accent font-medium">Free Fabric Swatches</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-light tracking-[0.12em] uppercase mb-6 text-primary">
                Feel the quality<br />before you decide
              </h2>
              <p className="text-primary/50 mb-10 font-light tracking-wide max-w-lg mx-auto">
                Request up to 4 free fabric samples delivered to your door within 5-7 working days.
              </p>
              <Link href="/swatches" className="glass-btn inline-flex items-center gap-3 text-white px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-medium">
                Request Free Swatches
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
