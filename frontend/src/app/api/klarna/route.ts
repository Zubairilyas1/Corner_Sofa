import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const installmentAmount = totalAmount / 3;

    return NextResponse.json({
      redirect_url: '#',
      html_snippet: '',
      klarna_reference: `KLS-${Date.now()}`,
      'payment-method': {
        name: 'Pay later in 3 interest-free instalments',
        asset_urls: {},
      },
      plan_details: {
        plans: [
          { title: '1st payment', amount: installmentAmount, date: 'Today' },
          { title: '2nd payment', amount: installmentAmount, date: 'In 30 days' },
          { title: '3rd payment', amount: installmentAmount, date: 'In 60 days' },
        ],
      },
      customer_email: customerEmail,
      total_amount: totalAmount,
      currency: 'GBP',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create Klarna session' },
      { status: 500 }
    );
  }
}
