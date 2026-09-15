import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const ADMIN_SESSION_COOKIE = 'sofa_admin_session';
export const ADMIN_SESSION_MAX_AGE = 24 * 60 * 60;

function sessionSecret() {
  if (!process.env.TOKEN_SECRET && !process.env.ADMIN_PASSWORD) throw new Error('Admin credentials are not configured');
  return process.env.TOKEN_SECRET || createHash('sha256')
    .update(`sofa-admin-session:${process.env.ADMIN_PASSWORD}`)
    .digest('hex');
}

function signature(payload: string) {
  return createHmac('sha256', sessionSecret()).update(payload).digest();
}

export function createAdminSession(now = Date.now()) {
  const issuedAt = Math.floor(now / 1000);
  const expiresAt = issuedAt + ADMIN_SESSION_MAX_AGE;
  const payload = Buffer.from(JSON.stringify({
    version: 1, scope: 'sofa-preview', issuedAt, expiresAt, nonce: randomBytes(16).toString('hex'),
  })).toString('base64url');
  return { token: `${payload}.${signature(payload).toString('base64url')}`, expiresAt: expiresAt * 1000 };
}

export function verifyAdminSession(token: string | undefined, now = Date.now()): boolean {
  if (!token || token.length > 1024) return false;
  const parts = token.split('.');
  if (parts.length !== 2 || !/^[A-Za-z0-9_-]+$/.test(parts[0]) || !/^[A-Za-z0-9_-]{43}$/.test(parts[1])) return false;
  try {
    const supplied = Buffer.from(parts[1], 'base64url');
    const expected = signature(parts[0]);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;
    const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    const current = Math.floor(now / 1000);
    return payload?.version === 1 && payload.scope === 'sofa-preview'
      && Number.isSafeInteger(payload.issuedAt) && Number.isSafeInteger(payload.expiresAt)
      && payload.issuedAt <= current && payload.expiresAt > current
      && payload.expiresAt - payload.issuedAt === ADMIN_SESSION_MAX_AGE
      && typeof payload.nonce === 'string' && /^[a-f0-9]{32}$/.test(payload.nonce);
  } catch {
    return false;
  }
}
