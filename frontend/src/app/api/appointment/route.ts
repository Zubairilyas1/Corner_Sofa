import { requireAdmin } from '@/lib/require-admin';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const result = await sql`
      SELECT id, customer_name, email, phone, appointment_date, notes, status, created_at
      FROM appointments
      ORDER BY created_at DESC
    `;
    return NextResponse.json(result);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customerName, email, phone, appointmentDate, showroomId, notes } = await request.json();

    if (!customerName || !email || !appointmentDate || !showroomId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, date, and showroom are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const dateObj = new Date(appointmentDate);
    if (isNaN(dateObj.getTime()) || dateObj < new Date()) {
      return NextResponse.json({ error: 'Invalid or past appointment date' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO appointments (customer_name, email, phone, appointment_date, notes, status)
      VALUES (${customerName}, ${email}, ${phone || null}, ${dateObj.toISOString()}, ${notes || null}, 'pending')
      RETURNING id, appointment_date, status
    `;

    const appointment = result[0];

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        date: appointment.appointment_date,
        status: appointment.status,
      },
    });
  } catch (err: unknown) {
    console.error('Appointment booking error:', err);
    return NextResponse.json(
      { error: 'Failed to book appointment. Please try again.' },
      { status: 500 }
    );
  }
}
