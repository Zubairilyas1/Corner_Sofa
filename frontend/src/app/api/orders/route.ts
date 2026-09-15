import { requireAdmin } from '@/lib/require-admin';
import { NextRequest, NextResponse } from 'next/server';
import { createLocalOrder, getLocalOrders } from '@/lib/local-orders';
import { CheckoutValidationError, validateCheckoutItems } from '@/lib/checkout-products';

export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await getLocalOrders(), {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { items, customerDetails, deliveryCost = 0, paymentMethod = 'card' } = await request.json();
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'Basket is empty' }, { status: 400 });
    if (!customerDetails?.name || !customerDetails?.email || !customerDetails?.phone) return NextResponse.json({ error: 'Name, email and phone are required' }, { status: 400 });

    const validatedItems = await validateCheckoutItems(items);
    const total = validatedItems.reduce((sum, item) =>
      sum + item.price * item.quantity, Number(deliveryCost));
    const order = await createLocalOrder({
      customer: customerDetails.name,
      email: customerDetails.email,
      address: [customerDetails.address, customerDetails.city].filter(Boolean).join(', '),
      postcode: customerDetails.postcode || '',
      phone: customerDetails.phone,
      total,
      items: validatedItems.reduce((sum, item) => sum + item.quantity, 0),
      status: 'pending',
      paymentMethod,
      lines: validatedItems.map((item) => ({
        title: item.title, color: item.color, quantity: item.quantity, price: item.price, type: item.itemType || 'sofa',
      })),
    });
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    if (error instanceof CheckoutValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: 'Could not save order' }, { status: 500 });
  }
}
