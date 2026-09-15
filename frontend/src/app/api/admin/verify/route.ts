import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-session';

export async function POST(request: NextRequest) {
  const valid = verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  return NextResponse.json({ valid }, { status: valid ? 200 : 401 });
}
