const categoryImages: Record<string, string> = {
  '2-Seater': '/images/sofas/premium-two-seater.webp',
  '3-Seater': '/images/sofas/premium-three-seater.webp',
  Corner: '/images/sofas/premium-corner.webp',
  Recliner: '/images/sofas/premium-recliners.webp',
  'U-Shape': '/images/sofas/comfort-hero.webp',
  'Sofa Bed': '/images/sofas/premium-sofa-bed.webp',
};

export function sofaImageForCategory(category?: string) {
  return categoryImages[category || ''] || '/images/sofas/premium-three-seater.webp';
}

export function ensureLocalProductImages<T extends { category?: string; images?: string[] }>(product: T): T {
  const images = product.images || [];
  const usableImages = images.filter((image) => typeof image === 'string' && (/^\/(?!\/)/.test(image) || /^https?:\/\//i.test(image)));

  if (usableImages.length) return usableImages.length === images.length ? product : { ...product, images: usableImages };

  return {
    ...product,
    images: [sofaImageForCategory(product.category)],
  };
}
