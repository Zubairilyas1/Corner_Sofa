import { findProduct } from './product-store';
import { getVariantImages, type StoreProduct } from './product-options';
import { validOffer } from './alashi-commerce';
import { records } from './alashi-store';

export class CheckoutValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CheckoutValidationError';
  }
}

export interface ValidatedCheckoutItem {
  productId: string;
  variantId: string;
  title: string;
  color: string;
  range_type: string;
  price: number;
  quantity: number;
  image: string;
  itemType?: 'sofa' | 'swatch';
}

function fail(message: string): never {
  throw new CheckoutValidationError(message);
}

function pennies(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return undefined;
  const rounded = Math.round(value * 100);
  if (!Number.isSafeInteger(rounded) || Math.abs(value * 100 - rounded) > 0.00001) return undefined;
  return rounded;
}

/** Resolve every basket line against the same catalogue used by the admin and storefront. */
export async function validateCheckoutItems(input: unknown): Promise<ValidatedCheckoutItem[]> {
  if (!Array.isArray(input) || input.length === 0) return fail('Your basket is empty.');

  const products = new Map<string, Promise<StoreProduct | undefined>>();
  const validated = new Map<string, ValidatedCheckoutItem>();
  let hasSofa = false;

  for (const candidate of input) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
      return fail('An item in your basket is invalid. Please refresh your basket and try again.');
    }
    const item = candidate as Record<string, unknown>;
    if (typeof item.productId !== 'string' || !item.productId.trim()
      || typeof item.variantId !== 'string' || !item.variantId.trim()) {
      return fail('A product or colour is missing. Please refresh your basket and choose the colour again.');
    }
    if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) {
      return fail('Choose a whole-number quantity between 1 and 10 for each sofa in your basket.');
    }

    const productId = item.productId;
    const variantId = item.variantId;
    if (item.itemType === 'swatch') {
      if (item.quantity !== 1) return fail('You can add only one fabric swatch to an order.');
      const key = JSON.stringify([productId, variantId]);
      validated.set(key, { productId, variantId, title: typeof item.title === 'string' ? item.title : 'Fabric swatch', color: typeof item.color === 'string' ? item.color : 'Selected swatch', range_type: 'Fabric swatch', price: 0, quantity: 1, image: typeof item.image === 'string' ? item.image : '/placeholder.svg', itemType: 'swatch' });
      continue;
    }
    hasSofa = true;
    if (!products.has(productId)) products.set(productId, findProduct(productId));
    // Store failures must fail checkout; client prices are never a fallback.
    const product = await products.get(productId);
    if (!product) return fail('A sofa is no longer available. Please refresh your basket and remove the unavailable item.');
    const variant = product.variants.find((option) => option.id === variantId);
    if (!variant) return fail(`A colour for ${product.title} is no longer available. Please refresh your basket and choose another colour.`);

    const offerPrice = item.offerToken ? validOffer(item.offerToken, product, variantId, await records()) : undefined;
    if (item.offerToken && offerPrice === undefined) return fail('Your ALASHI offer has expired or changed. Please ask ALASHI for a new offer.');
    const currentPennies = pennies(offerPrice ?? Number(variant.price));
    if (currentPennies === undefined || pennies(item.price) !== currentPennies) {
      return fail(`The price of ${product.title} has changed. Please refresh your basket and add this sofa again to use its current price.`);
    }
    if (!Number.isInteger(variant.stock) || variant.stock < 1) {
      return fail(`${product.title} in ${variant.color} is sold out. Please refresh your basket and choose another colour.`);
    }

    const key = JSON.stringify([productId, variantId]);
    const quantity = (validated.get(key)?.quantity || 0) + item.quantity;
    if (quantity > 10) return fail(`You can order up to 10 of ${product.title} in ${variant.color}. Please update your basket quantity.`);
    if (quantity > variant.stock) {
      return fail(`Only ${variant.stock} of ${product.title} in ${variant.color} are available. Please refresh your basket and reduce the quantity.`);
    }
    validated.set(key, {
      productId: product.id,
      variantId: variant.id,
      title: product.title,
      color: variant.color,
      range_type: variant.range_type,
      price: currentPennies / 100,
      quantity,
      image: getVariantImages(product, variant)[0] || '',
      itemType: 'sofa',
    });
  }
  if (!hasSofa) return fail('Please add a sofa before checking out. A fabric swatch cannot be purchased on its own.');
  return [...validated.values()];
}
