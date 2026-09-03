import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await sql`
      SELECT p.*, json_agg(json_build_object(
        'id', pv.id,
        'range_type', pv.range_type,
        'sku', pv.sku,
        'price', pv.price,
        'color', pv.color,
        'stock', pv.stock
      )) as variants
      FROM products p
      LEFT JOIN product_variants pv ON pv.product_id = p.id
      WHERE p.id = ${id}
      GROUP BY p.id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, base_price, category, images } = body;

    if (!title || !base_price) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 });
    }

    const result = await sql`
      UPDATE products SET
        title = ${title},
        description = ${description || ''},
        base_price = ${base_price},
        category = ${category || ''},
        images = ${images || []}
      WHERE id = ${id}
      RETURNING id, title, slug, base_price, category, images
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: result[0] });
  } catch (err) {
    console.error('Error updating product:', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete variants first (cascade should handle this, but being explicit)
    await sql`DELETE FROM product_variants WHERE product_id = ${id}`;
    const result = await sql`DELETE FROM products WHERE id = ${id} RETURNING id, title`;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: result[0] });
  } catch (err) {
    console.error('Error deleting product:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
