// @vitest-environment node
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ADMIN_SESSION_COOKIE, createAdminSession, verifyAdminSession } from '../lib/admin-session';
import { generateSofaPreview } from '../lib/sofa-preview-renderer';
import { POST as preview } from '../app/api/sofa-previews/route';

vi.mock('../lib/sofa-preview-renderer', () => ({ generateSofaPreview: vi.fn() }));

beforeEach(() => {
  vi.stubEnv('ADMIN_PASSWORD', 'preview-test-password');
  vi.stubEnv('TOKEN_SECRET', 'preview-test-secret');
  vi.clearAllMocks();
});
afterEach(() => vi.unstubAllEnvs());

function previewRequest(token?: string) {
  return new NextRequest('http://localhost:3000/api/sofa-previews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Cookie: `${ADMIN_SESSION_COOKIE}=${token}` } : {}) },
    body: JSON.stringify({ source: '/images/sofas/example.webp', color: '#497fbd' }),
  });
}

describe('preview generation authentication', () => {
  it.each([undefined, 'admin_forged-long-enough-token', 'expired'])(
    'rejects missing, invalid, or expired credentials before image processing', async (token) => {
      const response = await preview(previewRequest(token === 'expired' ? createAdminSession(Date.UTC(2020, 0, 1)).token : token));
      expect(response.status).toBe(401);
      expect((await response.json()).error).toMatch(/sign out.*sign in again/);
      expect(generateSofaPreview).not.toHaveBeenCalled();
    },
  );

  it('allows an authenticated admin to generate a preview', async () => {
    const url = `/api/sofa-previews/${'a'.repeat(64)}.webp`;
    vi.mocked(generateSofaPreview).mockResolvedValue(url);
    const response = await preview(previewRequest(createAdminSession().token));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ url });
    expect(generateSofaPreview).toHaveBeenCalledWith('/images/sofas/example.webp', '#497fbd');
  });
});

describe('admin sign-in cookie', () => {
  it('returns expiry and sets a signed, HttpOnly, strict cookie', async () => {
    const { POST: login } = await import('../app/api/admin/auth/route');
    const response = await login(new NextRequest('https://sofa.example/api/admin/auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'preview-test-password' }),
    }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ success: true, expiresAt: expect.any(Number) });
    const cookie = response.cookies.get(ADMIN_SESSION_COOKIE);
    expect(cookie).toMatchObject({ httpOnly: true, sameSite: 'strict', secure: true, path: '/', maxAge: 86400 });
    expect(verifyAdminSession(cookie?.value)).toBe(true);
  });

  it('does not grant a generation session for an incorrect password', async () => {
    const { POST: login } = await import('../app/api/admin/auth/route');
    const response = await login(new NextRequest('http://localhost:3000/api/admin/auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'wrong-password' }),
    }));
    expect(response.status).toBe(401);
    expect(response.cookies.get(ADMIN_SESSION_COOKIE)).toBeUndefined();
  });

  it.each(['http://localhost:3000', 'https://sofa.example'])('clears the scoped session cookie on sign-out from %s', async (origin) => {
    const { DELETE: logout } = await import('../app/api/admin/auth/route');
    const response = await logout(new NextRequest(`${origin}/api/admin/auth`, { method: 'DELETE' }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    const cookie = response.cookies.get(ADMIN_SESSION_COOKIE);
    expect(cookie).toMatchObject({ value: '', httpOnly: true, sameSite: 'strict', secure: origin.startsWith('https:'), path: '/', maxAge: 0 });
    const expiresAt = cookie?.expires instanceof Date ? cookie.expires.getTime() : cookie?.expires;
    expect(expiresAt).toBeLessThanOrEqual(Date.now());
    expect(verifyAdminSession(cookie?.value)).toBe(false);
  });
});
