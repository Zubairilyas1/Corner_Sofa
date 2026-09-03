'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import Link from 'next/link';
import { Button, Input, PriceTag } from '@/components/ui';

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  days: string;
}

const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: 'standard', name: 'Standard Delivery', description: 'Delivered to your room of choice', price: 0, days: '5–7 working days' },
  { id: 'express', name: 'Express Delivery', description: 'Priority room-of-choice delivery', price: 29.99, days: '2–3 working days' },
  { id: 'room-of-choice', name: 'Room of Choice + Assembly', description: 'White-glove service with full assembly', price: 49.99, days: '3–5 working days' },
];

type PaymentMethod = 'stripe' | 'klarna';

export default function CheckoutPage() {
  const { items, total, itemCount, clearCart } = useCart();
  const [deliveryOption, setDeliveryOption] = useState<string>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [customerData, setCustomerData] = useState({ name: '', email: '', postcode: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [klarnaData, setKlarnaData] = useState<Record<string, unknown> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedDelivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryOption)!;
  const deliveryCost = selectedDelivery.price;
  const orderTotal = total + deliveryCost;

  const formatPrice = (n: number) => n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (items.length === 0) {
    return (
      <main className="min-h-[600px] bg-primary flex flex-col items-center justify-center">
        <h2 className="text-3xl font-light tracking-[0.15em] text-dark uppercase mb-4">Your Cart is Empty</h2>
        <p className="text-sm text-dark/60 tracking-widest uppercase mb-8">Browse our collection to find the perfect sofa</p>
        <Link href="/"><Button variant="contrast" size="lg">Continue Shopping</Button></Link>
      </main>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!customerData.name.trim()) e.name = 'Name is required';
    if (!customerData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) e.email = 'Invalid email';
    if (!customerData.postcode.trim()) e.postcode = 'Postcode is required';
    if (!customerData.address.trim()) e.address = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStripeSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customerDetails: customerData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const handleKlarnaSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/klarna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customerEmail: customerData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Klarna session failed');
      setKlarnaData(data);
      setLoading(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Klarna failed. Please try again.');
      setLoading(false);
    }
  };

  const handlePayWithKlarna = () => {
    clearCart();
    window.location.href = '/checkout/success?session_id=klarna_mock';
  };

  return (
    <main className="py-12 bg-primary">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light tracking-[0.2em] text-dark uppercase mb-3">Checkout</h1>
          <p className="text-sm tracking-widest text-dark/60 uppercase">{itemCount} item{itemCount !== 1 ? 's' : ''} — Total: £{formatPrice(orderTotal)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Form — Left */}
          <div className="lg:col-span-3 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-light tracking-[0.15em] text-dark uppercase mb-4">Order Summary</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-4 p-3 bg-primary/50 rounded-lg">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-dark">{item.title}</p>
                      <p className="text-xs text-dark/50">{item.range_type} — {item.color} × {item.quantity}</p>
                    </div>
                    <PriceTag price={item.price * item.quantity} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-light tracking-[0.15em] text-dark uppercase mb-4">Delivery Options</h2>
              <div className="space-y-3">
                {DELIVERY_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      deliveryOption === opt.id ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-dark/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={opt.id}
                      checked={deliveryOption === opt.id}
                      onChange={() => setDeliveryOption(opt.id)}
                      className="accent-accent"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-dark">{opt.name}</p>
                      <p className="text-xs text-dark/50">{opt.description}</p>
                      <p className="text-xs text-dark/40 mt-0.5">{opt.days}</p>
                    </div>
                    <span className="text-sm font-bold text-accent">
                      {opt.price === 0 ? 'Free' : `£${formatPrice(opt.price)}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-light tracking-[0.15em] text-dark uppercase mb-4">Delivery Details</h2>
              <div className="space-y-4">
                <Input label="Full Name" required placeholder="John Doe" value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} error={errors.name} />
                <Input label="Email" type="email" required placeholder="john@example.com" value={customerData.email} onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })} error={errors.email} />
                <Input label="Postcode" required placeholder="SW1A 1AA" value={customerData.postcode} onChange={(e) => setCustomerData({ ...customerData, postcode: e.target.value })} error={errors.postcode} />
                <Input label="Address" required placeholder="123 High Street, London" value={customerData.address} onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })} error={errors.address} />
              </div>
            </div>
          </div>

          {/* Sidebar — Right */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-28">
              <h2 className="text-lg font-light tracking-[0.15em] text-dark uppercase mb-4">Payment</h2>

              {/* Payment Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`flex-1 py-3 rounded-lg text-xs uppercase tracking-[0.15em] font-medium transition-all duration-200 ${
                    paymentMethod === 'stripe' ? 'bg-contrast text-white' : 'bg-gray-100 text-dark hover:bg-gray-200'
                  }`}
                >
                  Pay with Card
                </button>
                <button
                  onClick={() => setPaymentMethod('klarna')}
                  className={`flex-1 py-3 rounded-lg text-xs uppercase tracking-[0.15em] font-medium transition-all duration-200 ${
                    paymentMethod === 'klarna' ? 'bg-[#FFB3C7] text-[#171321]' : 'bg-gray-100 text-dark hover:bg-gray-200'
                  }`}
                >
                  Pay Later
                </button>
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-6 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-dark/60">Subtotal</span>
                  <span>£{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark/60">Delivery</span>
                  <span>{deliveryCost === 0 ? 'Free' : `£${formatPrice(deliveryCost)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <PriceTag price={orderTotal} size="sm" />
                </div>
              </div>

              {/* Klarna Breakdown */}
              {paymentMethod === 'klarna' && (
                <div className="mb-6 p-4 bg-[#FFB3C7]/10 rounded-lg border border-[#FFB3C7]/30">
                  <p className="text-xs font-medium text-dark mb-3">Pay in 3 interest-free instalments</p>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between text-xs mb-1.5">
                      <span className="text-dark/60">
                        {i === 1 ? 'Today' : i === 2 ? 'In 30 days' : 'In 60 days'}
                      </span>
                      <span className="font-medium">£{formatPrice(orderTotal / 3)}</span>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs border border-red-200">{error}</div>
              )}

              {/* Klarna success state */}
              {klarnaData ? (
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                    <p className="text-sm font-medium text-green-700">Klarna approved</p>
                    <p className="text-xs text-green-600 mt-1">Complete your purchase below</p>
                  </div>
                  <Button variant="primary" size="lg" className="w-full" onClick={handlePayWithKlarna}>
                    Confirm & Pay £{formatPrice(orderTotal / 3)} Today
                  </Button>
                </div>
              ) : (
                <Button
                  variant={paymentMethod === 'klarna' ? 'primary' : 'contrast'}
                  size="lg"
                  className="w-full"
                  loading={loading}
                  onClick={paymentMethod === 'stripe' ? handleStripeSubmit : handleKlarnaSubmit}
                >
                  {paymentMethod === 'stripe' ? 'Pay Securely with Stripe' : 'Continue with Klarna'}
                </Button>
              )}

              <div className="flex items-center justify-center gap-2 mt-4">
                <svg className="w-4 h-4 text-dark/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[10px] text-dark/40 uppercase tracking-widest">Secure 256-bit SSL Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
