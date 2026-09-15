'use client';

import Link from 'next/link';
import { ArrowRight, Layers3, MessageCircle, Search } from 'lucide-react';
import MiniCart from '@/components/MiniCart';

const primaryLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function HomeHero() {
  return (
    <section className="reference-home-hero" aria-label="Corner Sofa introduction">
      <picture className="reference-hero-photo">
        <source media="(min-width: 761px) and (min-aspect-ratio: 1586/992)" srcSet="/images/sofas/blue-corner-room-wide.webp" />
        <img
          src="/images/sofas/blue-corner-room-hero.webp"
          alt="Cream corner sofa with a left chaise, woven coffee table and olive tree against a blue living room wall"
          width={1586}
          height={992}
          className="reference-hero-image"
          fetchPriority="high"
        />
      </picture>
      <div className="reference-hero-scene">
        <header className="reference-hero-nav">
          <Link href="/" className="reference-hero-brand" aria-label="Corner Sofa home">
            <svg viewBox="0 0 52 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 19V13C7 5 15 2 26 2s19 3 19 11v6M4 25h44v-8a4 4 0 0 0-8 0v4H12v-4a4 4 0 0 0-8 0v8ZM7 25v4m38-4v4" />
              <path d="M13 20c3-5 8-6 13-6s10 1 13 6M26 5v9" />
            </svg>
            <span>Corner Sofa</span>
          </Link>
          <nav aria-label="Homepage navigation" className="reference-hero-links">
            {primaryLinks.map(link => <Link key={link.label} href={link.href} aria-current={link.href === '/' ? 'page' : undefined}>{link.label}</Link>)}
          </nav>
          <div className="reference-hero-actions">
            <MiniCart />
            <Link href="/reviews" aria-label="Customer feedback"><MessageCircle size={16} aria-hidden="true" /><span>Reviews</span></Link>
          </div>
        </header>

        <div className="reference-hero-copy">
          <h1>Comfort Starts with the<br />Right Furniture</h1>
          <p>Thoughtful shapes, lasting comfort, and room for everyday living.</p>
          <div className="reference-hero-shop-row">
            <form action="/products" role="search" aria-label="Find your sofa" className="reference-hero-search">
              <label htmlFor="home-sofa-search" className="sr-only">Search furniture</label>
              <input id="home-sofa-search" type="search" name="q" placeholder="Search furniture" />
              <button type="submit" aria-label="Search furniture"><Search size={18} aria-hidden="true" /></button>
            </form>
            <Link href="/products" className="reference-hero-shop">Shop now <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
      <aside className="home-room-planner" aria-label="Plan your room">
        <Layers3 size={42} strokeWidth={1.4} aria-hidden="true" />
        <h2>Plan your room</h2>
        <p>See your favourite sofa in your own space before you choose.</p>
        <Link href="/room-planner/" aria-label="Plan my room">Plan room <ArrowRight size={17} aria-hidden="true" /></Link>
      </aside>
    </section>
  );
}
