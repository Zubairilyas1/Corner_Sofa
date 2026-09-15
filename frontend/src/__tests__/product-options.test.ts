import { describe, expect, it } from 'vitest';
import {
  formatProductPrice, getColourHex, getDefaultVariant, getProductPrice, getSavings,
  getVariantImages, type ProductVariant,
} from '../lib/product-options';

const finish = (overrides: Partial<ProductVariant> = {}): ProductVariant => ({
  id: 'cream', range_type: '2-Seater', color: 'Cream', price: 249, stock: 4,
  ...overrides,
});

describe('storefront product options', () => {
  it('starts with the cheapest available finish, even when a sold-out finish costs less', () => {
    const soldOut = finish({ id: 'out', price: 199, stock: 0 });
    const premium = finish({ id: 'premium', price: 329.99 });
    const available = finish({ id: 'available', price: 249.99 });
    const variants = [soldOut, premium, available];

    expect(getDefaultVariant(variants)).toBe(available);
    expect(getProductPrice({ base_price: 199, variants })).toBe(249.99);
  });

  it('keeps sold-out finishes previewable and falls back to the base price without finishes', () => {
    const lessExpensive = finish({ stock: 0, price: 249 });
    const premium = finish({ id: 'premium', stock: 0, price: 399 });

    expect(getDefaultVariant([premium, lessExpensive])).toBe(lessExpensive);
    expect(getDefaultVariant([])).toBeUndefined();
    expect(getProductPrice({ base_price: 299.99, variants: [] })).toBe(299.99);
  });

  it('shows pounds and pence consistently and calculates exact penny savings', () => {
    expect(formatProductPrice(249)).toBe('£249.00');
    expect(formatProductPrice(1249.9)).toBe('£1,249.90');
    expect(getSavings(249, 839.99)).toBe(590.99);
    expect(getSavings(19.9, 19.99)).toBe(0.09);
    expect(getSavings(0.2, 0.3)).toBe(0.1);
  });

  it.each([undefined, null, 0, 249, 199, Number.NaN, Number.POSITIVE_INFINITY])(
    'does not advertise a discount for invalid or non-higher original price %s', (original) => {
      expect(getSavings(249, original)).toBe(0);
    },
  );

  it('uses only the selected finish gallery, with the product gallery as a legacy fallback', () => {
    const product = { images: ['/sofa-front.webp', '/sofa-side.webp'] };
    const blue = finish({ color: 'Blue', images: ['/blue-front.webp', '/blue-side.webp'] });

    expect(getVariantImages(product, blue)).toEqual(['/blue-front.webp', '/blue-side.webp']);
    expect(getVariantImages(product, finish({ images: [] }))).toEqual(product.images);
    expect(getVariantImages(product, finish())).toEqual(product.images);
    expect(getVariantImages(product, null)).toEqual(product.images);
  });

  it('uses the admin supplied colour code before legacy name previews', () => {
    expect(getColourHex(finish({ color: 'Cream', color_hex: '#Ab12Cd' }))).toBe('#Ab12Cd');
    expect(getColourHex(finish({ color: 'Bespoke Ocean', color_hex: '#123456' }))).toBe('#123456');
    expect(getColourHex(finish({ color: 'CREAM', color_hex: null }))).toBe('#ece6d8');
    expect(getColourHex(finish({ color: 'Unlisted finish', color_hex: 'invalid' }))).toBe('#d5d8cf');
  });
});
