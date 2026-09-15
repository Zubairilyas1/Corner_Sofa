import { describe, expect, it } from 'vitest';
import { ProductValidationError, validateProductInput, validProductImage } from '../lib/product-validation';
import type { StoreProduct } from '../lib/product-options';
import { SOFA_CATEGORIES } from '../lib/product-categories';

it.each(SOFA_CATEGORIES)('accepts %s when creating and editing products', category => {
  const created = validateProductInput(input({ category, variants: [newColour({ range_type: category })] }));
  expect(created.category).toBe(category);
  expect(created.variants[0].range_type).toBe(category);
  const updated = validateProductInput(input({ category }), existing());
  expect(updated.category).toBe(category);
});

const newColour = (overrides: Record<string, unknown> = {}) => ({
  color: 'Cream', color_hex: '#ece6d8', range_type: '2-Seater',
  price: 249, stock: 4, images: ['/cream-front.webp'], ...overrides,
});

const input = (overrides: Record<string, unknown> = {}) => ({
  title: 'Comfort Sofa', description: 'A comfortable sofa.', category: '2-Seater',
  base_price: 249, compare_at_price: 839.99, images: ['/sofa-front.webp'],
  variants: [newColour()], ...overrides,
});

const existing = (): StoreProduct => ({
  id: 'sofa-1', slug: 'comfort-sofa', title: 'Comfort Sofa', description: 'A comfortable sofa.',
  category: '2-Seater', base_price: 249, compare_at_price: 839.99,
  images: ['/sofa-front.webp', '/sofa-side.webp'],
  variants: [
    { id: 'cream-1', sku: 'CREAM-SKU', color: 'Cream', color_hex: '#ece6d8',
      range_type: '2-Seater', price: 249, stock: 4, images: ['/cream-front.webp', '/cream-side.webp'] },
    { id: 'blue-1', sku: 'BLUE-SKU', color: 'Blue', color_hex: '#123456',
      range_type: '2-Seater', price: 299.99, stock: 2, images: ['/blue-front.webp', '/blue-side.webp'] },
  ],
});

describe('admin product input validation', () => {
  it('accepts decimal form values and creates a saved identity for each new colour', () => {
    const result = validateProductInput(input({ base_price: '249.99', compare_at_price: '839.99',
      variants: [newColour({ price: '249.99', stock: '4' })] }));

    expect(result.base_price).toBe(249.99);
    expect(result.compare_at_price).toBe(839.99);
    expect(result.variants[0]).toMatchObject({ color: 'Cream', color_hex: '#ece6d8', price: 249.99, stock: 4, images: ['/cream-front.webp'] });
    expect(result.variants[0].id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it.each([0, -1, 1.005, 100000000, Number.NaN, Number.POSITIVE_INFINITY, '', ' ', 'abc', null, true])(
    'rejects invalid selling price %s', (price) => {
      expect(() => validateProductInput(input({ base_price: price }))).toThrow(ProductValidationError);
      expect(() => validateProductInput(input({ variants: [newColour({ price })] }))).toThrow(ProductValidationError);
    },
  );

  it.each([0, -1, 1.005, 100000000, Number.NaN, Number.POSITIVE_INFINITY, 'abc', true])(
    'rejects invalid original price %s', (compare_at_price) => {
      expect(() => validateProductInput(input({ compare_at_price }))).toThrow(ProductValidationError);
    },
  );

  it('requires the original price to exceed the base price and every colour price', () => {
    expect(() => validateProductInput(input({ compare_at_price: 249 }))).toThrow(/higher than/);
    expect(() => validateProductInput(input({ compare_at_price: 299, variants: [newColour({ price: 299 })] }))).toThrow(/higher than/);
    expect(() => validateProductInput(input({ compare_at_price: 300, variants: [newColour({ price: 349 })] }))).toThrow(/higher than/);
  });

  it.each([-1, 1.5, 1000001, Number.NaN, Number.POSITIVE_INFINITY, '', ' ', null, undefined, true])(
    'rejects invalid stock %s', (stock) => {
      expect(() => validateProductInput(input({ variants: [newColour({ stock })] }))).toThrow(/stock must be a whole number/);
    },
  );

  it('accepts zero stock so sold-out colours can remain in the catalogue', () => {
    expect(validateProductInput(input({ variants: [newColour({ stock: 0 })] })).variants[0].stock).toBe(0);
  });

  it('rejects a variant ID belonging to another product', () => {
    expect(() => validateProductInput(input({ variants: [newColour({ id: 'another-sofas-colour' })] }), existing())).toThrow(/does not belong/);
  });

  it('rejects duplicate IDs even when their submitted colour names differ', () => {
    const saved = existing();
    expect(() => validateProductInput(input({ variants: [saved.variants[0], { ...saved.variants[0], color: 'Other name' }] }), saved)).toThrow(/Duplicate colour option ID/);
  });

  it('requires a photo or generated image link for a newly added colour', () => {
    expect(() => validateProductInput(input({ variants: [newColour({ images: [] })] }))).toThrow(/add a photo/);
    expect(() => validateProductInput(input({ variants: [newColour({ images: undefined })] }), existing())).toThrow(/add a photo/);
  });

  it('rejects duplicate colour/configuration choices after case and whitespace normalization', () => {
    expect(() => validateProductInput(input({ variants: [newColour(), newColour({ color: ' cream ', range_type: ' 2-seater ' })] }))).toThrow(/already added/);
    expect(validateProductInput(input({ variants: [newColour(), newColour({ range_type: '3-Seater' })] })).variants).toHaveLength(2);
  });

  it('preserves the identity and product-image fallback of an existing single legacy colour', () => {
    const saved = existing();
    saved.variants = [{ ...saved.variants[0], images: undefined, color_hex: undefined }];
    const result = validateProductInput(input({ images: undefined, variants: saved.variants }), saved);

    expect(result.variants).toHaveLength(1);
    expect(result.variants[0]).toMatchObject({ id: 'cream-1', sku: 'CREAM-SKU', price: 249, stock: 4, images: [] });
    expect(result.images).toEqual(saved.images);
  });

  it('keeps a legacy main-photo fallback when another saved colour already has its own photo', () => {
    const saved = existing();
    saved.variants[0].images = [];
    const result = validateProductInput(input({ variants: saved.variants }), saved);
    expect(result.variants[0].images).toEqual([]);
    expect(result.variants[1].images).toEqual(saved.variants[1].images);
    expect(result.images).toEqual(['/sofa-front.webp']);
  });

  it('accepts a generated photo for a new colour beside a legacy colour using the main photo', () => {
    const saved = existing();
    saved.variants = [{ ...saved.variants[0], images: [] }];
    const generated = `/api/sofa-previews/${'a'.repeat(64)}.webp`;
    const result = validateProductInput(input({ variants: [saved.variants[0], newColour({ color: 'Navy', images: [generated] })] }), saved);
    expect(result.variants[0]).toMatchObject({ id: 'cream-1', images: [] });
    expect(result.variants[1].images).toEqual([generated]);
  });

  it('removes every colour when the admin explicitly submits an empty list', () => {
    expect(validateProductInput(input({ variants: [] }), existing()).variants).toEqual([]);
  });

  it('preserves omitted variants and updates only prices that followed the old base price', () => {
    const saved = existing();
    const before = structuredClone(saved);
    const result = validateProductInput(input({ base_price: 279.99, variants: undefined }), saved);

    expect(result.variants).toEqual([
      { ...saved.variants[0], price: 279.99 },
      saved.variants[1],
    ]);
    expect(saved).toEqual(before);
  });

  it.each([null, ''])('clears the original price with %s', (compare_at_price) => {
    expect(validateProductInput(input({ compare_at_price }), existing()).compare_at_price).toBeNull();
  });

  it('keeps the saved original price when an update omits it', () => {
    expect(validateProductInput(input({ compare_at_price: undefined }), existing()).compare_at_price).toBe(839.99);
  });

  it('preserves all gallery photos and existing colour metadata when those fields are omitted', () => {
    const saved = existing();
    const result = validateProductInput(input({ images: undefined,
      variants: saved.variants.map(({ images: _images, color_hex: _hex, ...variant }) => variant),
    }), saved);

    expect(result.images).toEqual(['/sofa-front.webp', '/sofa-side.webp']);
    expect(result.variants).toEqual(saved.variants);
  });

  it('rejects invalid colour codes and unsafe photo URLs', () => {
    expect(() => validateProductInput(input({ variants: [newColour({ color_hex: 'red' })] }))).toThrow(/six-digit colour code/);
    expect(() => validateProductInput(input({ variants: [newColour({ images: ['javascript:alert(1)'] })] }))).toThrow(/http\(s\) URL/);
    expect(validProductImage('//example.com/sofa.jpg')).toBe(false);
    expect(validProductImage('/\\example.com/sofa.jpg')).toBe(false);
    expect(validProductImage('/uploads/sofa.jpg')).toBe(true);
    expect(validProductImage('https://example.com/sofa.jpg')).toBe(true);
  });
});
