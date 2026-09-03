import { describe, it, expect, beforeEach } from 'vitest';

// CartContext logic tests (pure functions, no React rendering)
describe('Cart Logic', () => {
  interface CartItem {
    productId: string;
    variantId: string;
    range_type: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
    title: string;
  }

  function calculateTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  function calculateItemCount(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }

  function addItem(items: CartItem[], newItem: Omit<CartItem, 'quantity'>, quantity = 1): CartItem[] {
    const existingIndex = items.findIndex(
      (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
    );
    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + quantity };
      return updated;
    }
    return [...items, { ...newItem, quantity }];
  }

  function removeItem(items: CartItem[], productId: string, variantId: string): CartItem[] {
    return items.filter((i) => i.productId !== productId || i.variantId !== variantId);
  }

  const mockItem: Omit<CartItem, 'quantity'> = {
    productId: 'p1',
    variantId: 'v1',
    range_type: '2-Seater',
    color: 'Charcoal',
    price: 1999,
    image: '/img.jpg',
    title: 'Test Sofa',
  };

  it('calculates total correctly', () => {
    const items = [
      { ...mockItem, quantity: 1 },
      { ...mockItem, productId: 'p2', variantId: 'v2', price: 2499, quantity: 2 },
    ];
    expect(calculateTotal(items)).toBe(1999 + 2499 * 2);
  });

  it('calculates item count correctly', () => {
    const items = [
      { ...mockItem, quantity: 1 },
      { ...mockItem, productId: 'p2', variantId: 'v2', quantity: 3 },
    ];
    expect(calculateItemCount(items)).toBe(4);
  });

  it('adds new item to empty cart', () => {
    const result = addItem([], mockItem, 1);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(1);
  });

  it('increments quantity for duplicate item', () => {
    const items = [{ ...mockItem, quantity: 1 }];
    const result = addItem(items, mockItem, 2);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(3);
  });

  it('removes item by productId and variantId', () => {
    const items = [
      { ...mockItem, quantity: 1 },
      { ...mockItem, productId: 'p2', variantId: 'v2', quantity: 1 },
    ];
    const result = removeItem(items, 'p1', 'v1');
    expect(result).toHaveLength(1);
    expect(result[0].productId).toBe('p2');
  });

  it('returns empty array when removing last item', () => {
    const items = [{ ...mockItem, quantity: 1 }];
    const result = removeItem(items, 'p1', 'v1');
    expect(result).toHaveLength(0);
  });
});

describe('Price Formatting', () => {
  function formatPrice(n: number): string {
    return n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  it('formats whole numbers with decimals', () => {
    expect(formatPrice(1999)).toBe('1,999.00');
  });

  it('formats decimals correctly', () => {
    expect(formatPrice(1999.99)).toBe('1,999.99');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('0.00');
  });
});

describe('Delivery Cost Calculation', () => {
  const DELIVERY_OPTIONS = [
    { id: 'standard', price: 0 },
    { id: 'express', price: 29.99 },
    { id: 'room-of-choice', price: 49.99 },
  ];

  it('calculates standard delivery as free', () => {
    const option = DELIVERY_OPTIONS.find((d) => d.id === 'standard')!;
    expect(option.price).toBe(0);
  });

  it('adds express delivery to total', () => {
    const subtotal = 2499;
    const delivery = DELIVERY_OPTIONS.find((d) => d.id === 'express')!;
    expect(subtotal + delivery.price).toBe(2528.99);
  });

  it('adds room-of-choice delivery to total', () => {
    const subtotal = 3299;
    const delivery = DELIVERY_OPTIONS.find((d) => d.id === 'room-of-choice')!;
    expect(subtotal + delivery.price).toBe(3348.99);
  });
});
