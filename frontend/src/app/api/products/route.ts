import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await sql`
      SELECT
        p.id, p.slug, p.title, p.description, p.base_price, p.images, p.category,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pv.id,
              'range_type', pv.range_type,
              'price', pv.price,
              'stock', pv.stock,
              'color', pv.color
            ) ORDER BY pv.price
          ) FILTER (WHERE pv.id IS NOT NULL),
          '[]'
        ) AS variants
      FROM products p
      LEFT JOIN product_variants pv ON pv.product_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, base_price, category, images } = body;

    if (!title || !base_price) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const result = await sql`
      INSERT INTO products (slug, title, description, base_price, images, category)
      VALUES (${slug}, ${title}, ${description || ''}, ${base_price}, ${images || []}, ${category || ''})
      RETURNING id, slug, title, base_price, category, images
    `;

    return NextResponse.json({ success: true, product: result[0] }, { status: 201 });
  } catch (err) {
    console.error('Error creating product:', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
