import { requireAdmin } from '@/lib/require-admin';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { deleteLocalSwatchRequest, updateLocalSwatchRequest } from '@/lib/swatch-request-store';

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered'];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    if (!process.env.DATABASE_URL) {
      const updated = await updateLocalSwatchRequest(id, status);
      if (!updated) return NextResponse.json({ error: 'Swatch request not found' }, { status: 404 });
      return NextResponse.json({ success: true, request: updated });
    }

    const result = await sql`
      UPDATE swatch_requests SET status = ${status} WHERE id = ${id}
      RETURNING id, customer_name, email, status
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Swatch request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, request: result[0] });
  } catch (err) {
    console.error('Error updating swatch request:', err);
    return NextResponse.json(
      { error: 'Failed to update swatch request' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    if (!process.env.DATABASE_URL) {
      if (!await deleteLocalSwatchRequest(id)) return NextResponse.json({ error: 'Swatch request not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }
    const result = await sql`DELETE FROM swatch_requests WHERE id = ${id} RETURNING id`;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Swatch request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting swatch request:', err);
    return NextResponse.json(
      { error: 'Failed to delete swatch request' },
      { status: 500 }
    );
  }
}
