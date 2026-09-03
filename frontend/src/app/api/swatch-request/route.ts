import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const result = await sql`
      SELECT id, customer_name, email, shipping_address, swatch_ids, created_at
      FROM swatch_requests
      ORDER BY created_at DESC
    `;
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching swatch requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch swatch requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, email, address, swatchIds } = body;

    if (!customerName || !email || !address || !swatchIds?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (swatchIds.length > 4) {
      return NextResponse.json(
        { error: 'Maximum 4 swatches per request' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO swatch_requests (customer_name, email, shipping_address, swatch_ids)
      VALUES (${customerName}, ${email}, ${JSON.stringify(address)}, ${swatchIds})
      RETURNING id, created_at
    `;

    return NextResponse.json({
      success: true,
      id: result[0]?.id,
      message: 'Swatch request submitted successfully. Expect delivery in 5-7 working days.',
    });
  } catch (error) {
    console.error('Error creating swatch request:', error);
    return NextResponse.json(
      { error: 'Failed to submit request' },
      { status: 500 }
    );
  }
}
