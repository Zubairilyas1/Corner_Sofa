import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://cornersofa.co.uk';

interface Product {
  id: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const { sql } = await import('@/lib/db');
    const rows = await sql`SELECT id FROM products ORDER BY created_at DESC` as Product[];
    return rows;
  } catch {
    return [
      { id: 'a1000000-0000-0000-0000-000000000001' },
      { id: 'a1000000-0000-0000-0000-000000000002' },
      { id: 'a1000000-0000-0000-0000-000000000003' },
      { id: 'a1000000-0000-0000-0000-000000000004' },
      { id: 'a1000000-0000-0000-0000-000000000005' },
      { id: 'a1000000-0000-0000-0000-000000000006' },
      { id: 'a1000000-0000-0000-0000-000000000007' },
      { id: 'a1000000-0000-0000-0000-000000000008' },
      { id: 'a1000000-0000-0000-0000-000000000009' },
      { id: 'a1000000-0000-0000-0000-000000000010' },
      { id: 'a1000000-0000-0000-0000-000000000011' },
      { id: 'a1000000-0000-0000-0000-000000000012' },
    ];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const staticPages = [
    { url: `${SITE_URL}/room-planner/`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/reviews`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${SITE_URL}/swatches`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/appointment`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/size-guide`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE_URL}/delivery-info`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/cart`, lastModified: new Date(), changeFrequency: 'never' as const, priority: 0.3 },
    { url: `${SITE_URL}/checkout`, lastModified: new Date(), changeFrequency: 'never' as const, priority: 0.3 },
  ];

  const productPages = products.map((product) => ({
    url: `${SITE_URL}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
