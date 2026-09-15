import { beforeEach, describe, expect, it, vi } from 'vitest';
import { findProduct } from '@/lib/product-store';
import { CheckoutValidationError, validateCheckoutItems } from '@/lib/checkout-products';
import type { StoreProduct } from '@/lib/product-options';

vi.mock('@/lib/product-store', () => ({ findProduct: vi.fn() }));

const lookup = vi.mocked(findProduct);
const basketItem = {
  productId: 'sofa-one', variantId: 'colour-olive', price: 49.99, quantity: 1,
  title: 'Untrusted title', color: 'Untrusted colour', range_type: 'Untrusted range', image: '/untrusted.jpg',
};

function product(): StoreProduct {
  return {
    id: 'sofa-one', slug: 'sofa-one', title: 'Olive two-seater', description: '', category: '2-Seater',
    base_price: 59.99, compare_at_price: 199.99, images: ['/main-sofa.webp'],
    variants: [{ id: 'colour-olive', range_type: '2-Seater', color: 'Olive', color_hex: '#64715c',
      price: 49.99, stock: 6, images: ['/olive-sofa.webp'] }],
  };
}

describe('Checkout catalogue validation', () => {
  beforeEach(() => {
    lookup.mockReset();
    lookup.mockResolvedValue(product());
  });

  it('accepts an admin discount below £100 and returns authoritative product details', async () => {
    const result = await validateCheckoutItems([basketItem]);
    expect(result).toEqual([{
      productId: 'sofa-one', variantId: 'colour-olive', title: 'Olive two-seater',
      color: 'Olive', range_type: '2-Seater', price: 49.99, quantity: 1, image: '/olive-sofa.webp',
      itemType: 'sofa',
    }]);
    expect(lookup).toHaveBeenCalledExactlyOnceWith('sofa-one');
  });

  it('rejects a stale price even when the difference is only one penny', async () => {
    await expect(validateCheckoutItems([{ ...basketItem, price: 49.98 }])).rejects.toThrow(/price.*changed.*refresh your basket/i);
  });

  it('rejects a client price that requires rounding to match the saved price', async () => {
    await expect(validateCheckoutItems([{ ...basketItem, price: 49.991 }])).rejects.toBeInstanceOf(CheckoutValidationError);
  });

  it('allows an ordinary decimal price without floating-point mismatch', async () => {
    const current = product();
    current.variants[0].price = 1999.99;
    lookup.mockResolvedValue(current);
    await expect(validateCheckoutItems([{ ...basketItem, price: 1999.99 }])).resolves.toMatchObject([{ price: 1999.99 }]);
  });

  it('rejects a colour removed by the admin even if the product still exists', async () => {
    const current = product();
    current.variants = [];
    lookup.mockResolvedValue(current);
    await expect(validateCheckoutItems([basketItem])).rejects.toThrow(/colour.*no longer available.*refresh your basket/i);
  });

  it('rejects a variant ID belonging to a different product', async () => {
    await expect(validateCheckoutItems([{ ...basketItem, variantId: 'other-product-colour' }])).rejects.toBeInstanceOf(CheckoutValidationError);
  });

  it('rejects a missing local product instead of trusting a client price above the old floor', async () => {
    lookup.mockResolvedValue(undefined);
    await expect(validateCheckoutItems([{ ...basketItem, price: 200 }])).rejects.toThrow(/no longer available.*refresh your basket/i);
  });

  it('fails when the catalogue cannot be read instead of using client data as a fallback', async () => {
    const unavailable = new Error('Catalogue unavailable');
    lookup.mockRejectedValue(unavailable);
    await expect(validateCheckoutItems([{ ...basketItem, price: 200 }])).rejects.toBe(unavailable);
  });

  it('rejects an admin colour with no stock', async () => {
    const current = product();
    current.variants[0].stock = 0;
    lookup.mockResolvedValue(current);
    await expect(validateCheckoutItems([basketItem])).rejects.toThrow(/sold out.*refresh your basket/i);
  });

  it('checks duplicate lines against their combined stock requirement', async () => {
    await expect(validateCheckoutItems([
      { ...basketItem, quantity: 4 }, { ...basketItem, quantity: 4 },
    ])).rejects.toThrow(/only 6.*reduce the quantity/i);
  });

  it('combines valid duplicate lines and resolves their product only once', async () => {
    await expect(validateCheckoutItems([
      { ...basketItem, quantity: 2 }, { ...basketItem, quantity: 3 },
    ])).resolves.toMatchObject([{ quantity: 5, price: 49.99 }]);
    expect(lookup).toHaveBeenCalledTimes(1);
  });

  it('checks every duplicate line price rather than trusting the first valid line', async () => {
    await expect(validateCheckoutItems([
      basketItem, { ...basketItem, price: 1 },
    ])).rejects.toBeInstanceOf(CheckoutValidationError);
  });

  it('enforces the quantity limit across duplicate lines', async () => {
    const current = product();
    current.variants[0].stock = 20;
    lookup.mockResolvedValue(current);
    await expect(validateCheckoutItems([
      { ...basketItem, quantity: 6 }, { ...basketItem, quantity: 5 },
    ])).rejects.toThrow(/up to 10/i);
  });

  it.each([0, -1, 1.5, 11, '2', null, undefined, NaN, Infinity])('rejects an invalid quantity: %s', async (quantity) => {
    await expect(validateCheckoutItems([{ ...basketItem, quantity }])).rejects.toThrow(/whole-number quantity between 1 and 10/i);
    expect(lookup).not.toHaveBeenCalled();
  });

  it('uses the product photo for a legacy colour with no individual photos', async () => {
    const current = product();
    current.variants[0].images = [];
    lookup.mockResolvedValue(current);
    await expect(validateCheckoutItems([basketItem])).resolves.toMatchObject([{ image: '/main-sofa.webp' }]);
  });

  it('rejects an empty basket', async () => {
    await expect(validateCheckoutItems([])).rejects.toBeInstanceOf(CheckoutValidationError);
  });

  it('rejects a missing product ID before attempting a catalogue lookup', async () => {
    await expect(validateCheckoutItems([{ ...basketItem, productId: '' }])).rejects.toBeInstanceOf(CheckoutValidationError);
    expect(lookup).not.toHaveBeenCalled();
  });
});
