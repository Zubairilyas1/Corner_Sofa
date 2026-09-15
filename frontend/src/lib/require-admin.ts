import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from './admin-session';

export async function requireAdmin() {
  const jar = await cookies();
  if (!verifyAdminSession(jar.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
  }
}
