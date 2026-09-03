import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sql } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
});

interface CheckoutItem {
  productId: string;
  variantId: string;
  title?: string;
  range_type?: string;
  color?: string;
  price: number;
  quantity: number;
}

export async function POST(req: Request) {
  try {
    const { items, customerDetails } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!customerDetails?.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerDetails.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Validate prices server-side
    const validatedItems: { title: string; description: string; unitAmount: number; quantity: number }[] = [];

    for (const item of items) {
      if (!item.variantId || !item.productId) {
        return NextResponse.json({ error: 'Invalid item: missing product or variant ID' }, { status: 400 });
      }

      const quantity = parseInt(item.quantity) || 1;
      if (quantity < 1 || quantity > 10) {
        return NextResponse.json({ error: 'Quantity must be between 1 and 10' }, { status: 400 });
      }

      // Fetch real price from database
      let dbPrice: number | null = null;
      let dbTitle = item.title || 'Corner Sofa Product';
      let dbDescription = `${item.range_type || ''} - ${item.color || ''}`;

      try {
        const result = await sql`
          SELECT pv.price, p.title, p.description, pv.range_type, pv.color
          FROM product_variants pv
          JOIN products p ON p.id = pv.product_id
          WHERE pv.id = ${item.variantId} AND pv.product_id = ${item.productId}
        `;

        if (result.length > 0) {
          dbPrice = parseFloat(result[0].price);
          dbTitle = result[0].title || dbTitle;
          dbDescription = `${result[0].range_type || ''} - ${result[0].color || ''}`;
        }
      } catch {
        // If DB query fails, use client price with a warning log
        console.warn('Could not verify price from DB for variant:', item.variantId);
      }

      // If we got a DB price, validate it matches client price (within 1% tolerance)
      if (dbPrice !== null) {
        const clientPrice = parseFloat(item.price) || 0;
        const tolerance = dbPrice * 0.01;
        if (Math.abs(clientPrice - dbPrice) > tolerance) {
          console.error(`Price manipulation detected: client=${clientPrice}, db=${dbPrice}`);
          return NextResponse.json(
            { error: 'Price mismatch detected. Please refresh your cart.' },
            { status: 400 }
          );
        }
        // Use DB price (authoritative)
        validatedItems.push({
          title: dbTitle,
          description: dbDescription,
          unitAmount: Math.round(dbPrice * 100),
          quantity,
        });
      } else {
        // Fallback to client price if DB unavailable (with floor of £100)
        const clientPrice = parseFloat(item.price) || 0;
        if (clientPrice < 100) {
          return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
        }
        validatedItems.push({
          title: dbTitle,
          description: dbDescription,
          unitAmount: Math.round(clientPrice * 100),
          quantity,
        });
      }
    }

    // Build Stripe line items from validated prices
    const line_items = validatedItems.map((item) => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.title,
          description: item.description,
        },
        unit_amount: item.unitAmount,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart`,
      customer_email: customerDetails.email,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}
