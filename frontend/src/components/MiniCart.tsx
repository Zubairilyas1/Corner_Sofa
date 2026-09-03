'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Button } from './ui';

export default function MiniCart() {
  const { items, total, itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const formatPrice = (n: number) =>
    n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="hover:text-accent transition-colors font-medium flex items-center gap-2 text-sm tracking-wide uppercase relative"
        aria-label={`Basket with ${itemCount} items`}
      >
        Basket
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-3 w-5 h-5 bg-accent text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-medium text-dark uppercase tracking-widest">
              Your Basket ({itemCount} item{itemCount !== 1 ? 's' : ''})
            </p>
          </div>

          {items.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-dark/50 mb-4">Your basket is empty</p>
              <Button variant="contrast" size="sm" onClick={() => setOpen(false)}>
                <Link href="/products">Shop Now</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="max-h-64 overflow-y-auto">
                {items.slice(0, 3).map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="flex items-center gap-3 p-4 border-b border-gray-50"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-dark truncate">{item.title}</p>
                      <p className="text-[10px] text-dark/50">{item.color} × {item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-accent">
                      £{formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-[10px] text-dark/40 text-center py-2">
                    +{items.length - 3} more item{items.length - 3 !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="p-4 bg-primary/50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-dark/60">Subtotal</span>
                  <span className="text-sm font-bold text-accent">£{formatPrice(total)}</span>
                </div>
                <div className="flex gap-2">
                  <Link href="/cart" className="flex-1" onClick={() => setOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">View Basket</Button>
                  </Link>
                  <Link href="/checkout" className="flex-1" onClick={() => setOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">Checkout</Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
