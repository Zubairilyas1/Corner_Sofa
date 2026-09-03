import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'corner-sofa-admin-secret-2026';

function generateToken(password: string): string {
  const payload = `${password}:${Date.now()}`;
  const hmac = crypto.createHmac('sha256', TOKEN_SECRET);
  hmac.update(payload);
  return `admin_${hmac.digest('hex')}`;
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = generateToken(password);

    return NextResponse.json({
      success: true,
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
