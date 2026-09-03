import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const [products, swatchRequests, appointments] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM products`,
      sql`SELECT COUNT(*) as count FROM swatch_requests`,
      sql`SELECT COUNT(*) as count FROM appointments`,
    ]);

    const [pendingAppointments, pendingSwatches, lowStockProducts] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'`,
      sql`SELECT COUNT(*) as count FROM swatch_requests WHERE status = 'pending'`,
      sql`SELECT COUNT(*) as count FROM product_variants WHERE stock <= 3`,
    ]);

    return NextResponse.json({
      products: parseInt(products[0]?.count || '0'),
      swatchRequests: parseInt(swatchRequests[0]?.count || '0'),
      appointments: parseInt(appointments[0]?.count || '0'),
      orders: 0,
      pendingAppointments: parseInt(pendingAppointments[0]?.count || '0'),
      pendingSwatches: parseInt(pendingSwatches[0]?.count || '0'),
      lowStockProducts: parseInt(lowStockProducts[0]?.count || '0'),
    });
  } catch {
    return NextResponse.json({
      products: 0,
      swatchRequests: 0,
      appointments: 0,
      orders: 0,
      pendingAppointments: 0,
      pendingSwatches: 0,
      lowStockProducts: 0,
    });
  }
}
