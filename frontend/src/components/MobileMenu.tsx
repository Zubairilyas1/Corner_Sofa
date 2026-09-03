'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/products', label: 'Shop Sofas' },
  { href: '/swatches', label: 'Swatches' },
  { href: '/faq', label: 'FAQ' },
  { href: '/appointment', label: 'Showroom' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/size-guide', label: 'Size Guide' },
  { href: '/delivery-info', label: 'Delivery' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 -mr-2 relative z-[60]"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <div className="w-5 h-4 flex flex-col justify-between">
          <span className={`block h-[1.5px] bg-dark transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
          <span className={`block h-[1.5px] bg-dark transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : ''}`} />
          <span className={`block h-[1.5px] bg-dark transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
        </div>
      </button>

      {/* Backdrop + Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[55] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-dark/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-[280px] glass-white animate-slide-in-left">
            <div className="pt-24 px-6">
              <nav className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block py-3 px-4 text-sm tracking-[0.1em] uppercase transition-all duration-200 rounded-xl ${
                      pathname === link.href
                        ? 'glass-btn text-white'
                        : 'text-dark/60 hover:text-dark hover:bg-dark/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="glass-divider my-6" />

              <div className="space-y-3">
                <Link
                  href="/products"
                  className="glass-btn block text-center text-white py-3 rounded-full text-xs uppercase tracking-[0.15em]"
                >
                  Shop Now
                </Link>
                <Link
                  href="/swatches"
                  className="glass-btn-outline block text-center text-dark py-3 rounded-full text-xs uppercase tracking-[0.15em]"
                >
                  Free Swatches
                </Link>
              </div>

              <div className="mt-8 text-xs text-dark/30 space-y-2">
                <p>sales@cornersofa.co.uk</p>
                <p>0800 123 4567</p>
                <p>Mon–Fri 9am–5pm</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
