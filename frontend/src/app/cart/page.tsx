'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Button, PriceTag } from '@/components/ui';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-[600px] bg-primary flex flex-col items-center justify-center">
        <h2 className="text-3xl font-light tracking-[0.15em] text-dark mb-4 uppercase">
          Your Cart is Empty
        </h2>
        <p className="text-sm text-dark/60 tracking-widest uppercase mb-8">
          Browse our collection to find the perfect sofa
        </p>
        <Link href="/">
          <Button variant="contrast" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="py-12 bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-light tracking-[0.2em] text-dark uppercase mb-3">
            Your Cart
          </h1>
          <p className="text-sm tracking-widest text-dark/60 uppercase">
            {items.length} item{items.length !== 1 ? 's' : ''} — Total: £
            {total.toFixed(2)}
          </p>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-3 text-left font-light tracking-widest text-dark/60 uppercase text-xs">
                  Product
                </th>
                <th className="p-3 text-left font-light tracking-widest text-dark/60 uppercase text-xs">
                  Configuration
                </th>
                <th className="p-3 text-right font-light tracking-widest text-dark/60 uppercase text-xs">
                  Price
                </th>
                <th className="p-3 text-right font-light tracking-widest text-dark/60 uppercase text-xs">
                  Qty
                </th>
                <th className="p-3 text-right font-light tracking-widest text-dark/60 uppercase text-xs">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.productId} className="border-b border-gray-100">
                  <td className="p-3">
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-dark font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-dark/50">{item.range_type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="text-dark text-sm">{item.color}</p>
                  </td>
                  <td className="p-3 text-right">
                    <PriceTag price={item.price} size="sm" />
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity - 1
                          )
                        }
                        className={`w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:border-dark transition-colors ${
                          item.quantity <= 1 ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity + 1
                          )
                        }
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:border-dark transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-red-600 text-xs hover:underline tracking-wide"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-dark/60">Subtotal</span>
            <span className="text-dark">£{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium pt-3 border-t border-gray-200">
            <span className="text-dark">Total</span>
            <PriceTag price={total} size="md" />
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <Link href="/products" className="flex-1">
            <Button variant="ghost" size="lg" className="w-full">
              Continue Shopping
            </Button>
          </Link>
          <Button
            variant="primary"
            size="lg"
            onClick={clearCart}
            className="flex-1"
          >
            Clear Cart
          </Button>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <Link href="/checkout" className="block">
            <Button variant="contrast" size="lg" className="w-full">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
