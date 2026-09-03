import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const swatches = await sql`
      SELECT id, name, hex_color, image_url, material
      FROM swatches
      ORDER BY material, name
    `;
    return NextResponse.json(swatches);
  } catch (error) {
    console.error('Error fetching swatches:', error);
    return NextResponse.json([]);
  }
}
