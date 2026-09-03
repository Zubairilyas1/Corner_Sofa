'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { useCart } from '@/context/CartContext';

function getEstimatedDelivery(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) clearCart();
  }, [sessionId, clearCart]);

  return (
    <main className="min-h-[60vh] bg-primary flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-sm text-center max-w-lg w-full border border-gray-200">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-light tracking-[0.15em] text-dark uppercase mb-3">Order Confirmed</h1>
        <p className="text-sm text-dark/60 mb-2">Thank you for your purchase.</p>
        <p className="text-xs text-dark/40 mb-6">
          A confirmation email has been sent to your address.
        </p>

        <div className="bg-primary/50 rounded-lg p-4 mb-8">
          <p className="text-xs text-dark/50 uppercase tracking-widest mb-1">Estimated Delivery</p>
          <p className="text-sm font-medium text-dark">{getEstimatedDelivery()}</p>
        </div>

        {sessionId && (
          <p className="text-[10px] text-dark/30 mb-6">Order ref: {sessionId.slice(0, 20)}...</p>
        )}

        <div className="flex gap-3">
          <Link href="/products" className="flex-1">
            <Button variant="ghost" size="lg" className="w-full">Continue Shopping</Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="primary" size="lg" className="w-full">Track Order</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
