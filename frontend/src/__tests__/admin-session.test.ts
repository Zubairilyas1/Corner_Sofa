// @vitest-environment node
import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ADMIN_SESSION_MAX_AGE, createAdminSession, verifyAdminSession } from '../lib/admin-session';

const now = Date.UTC(2026, 8, 10, 12);

beforeEach(() => {
  vi.stubEnv('TOKEN_SECRET', 'test-session-secret');
  vi.stubEnv('ADMIN_PASSWORD', 'test-admin-password');
});
afterEach(() => vi.unstubAllEnvs());

describe('admin session for sofa preview generation', () => {
  it('accepts an issued session until its expiry without exposing credentials', () => {
    const session = createAdminSession(now);
    expect(session.expiresAt).toBe(now + ADMIN_SESSION_MAX_AGE * 1000);
    expect(verifyAdminSession(session.token, now)).toBe(true);
    expect(verifyAdminSession(session.token, session.expiresAt - 1)).toBe(true);
    expect(verifyAdminSession(session.token, session.expiresAt)).toBe(false);
    const payload = Buffer.from(session.token.split('.')[0], 'base64url').toString('utf8');
    expect(payload).not.toContain('test-admin-password');
    expect(payload).not.toContain('test-session-secret');
    expect(createAdminSession(now).token).not.toBe(session.token);
  });

  it.each([undefined, '', 'admin_forged-long-enough-token', 'abc.def', 'a.b.c', 'a'.repeat(1025)])(
    'rejects absent or malformed session %s', (token) => expect(verifyAdminSession(token, now)).toBe(false),
  );

  it('rejects tampered expiry, tampered signature, and future-issued sessions', () => {
    const session = createAdminSession(now);
    const [payload, signature] = session.token.split('.');
    const changed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    changed.expiresAt += ADMIN_SESSION_MAX_AGE;
    const forgedPayload = Buffer.from(JSON.stringify(changed)).toString('base64url');
    expect(verifyAdminSession(`${forgedPayload}.${signature}`, now)).toBe(false);
    const forgedSignature = `${signature[0] === 'a' ? 'b' : 'a'}${signature.slice(1)}`;
    expect(verifyAdminSession(`${payload}.${forgedSignature}`, now)).toBe(false);
    expect(verifyAdminSession(session.token, now - 1000)).toBe(false);
  });

  it('rejects correctly signed credentials for another scope or invalid lifetime', () => {
    const original = JSON.parse(Buffer.from(createAdminSession(now).token.split('.')[0], 'base64url').toString('utf8'));
    for (const change of [{ scope: 'customer' }, { version: 2 }, { issuedAt: 'invalid' }, { expiresAt: original.expiresAt + 60 }, { nonce: '' }]) {
      const payload = Buffer.from(JSON.stringify({ ...original, ...change })).toString('base64url');
      const signature = createHmac('sha256', 'test-session-secret').update(payload).digest('base64url');
      expect(verifyAdminSession(`${payload}.${signature}`, now)).toBe(false);
    }
  });

  it('invalidates sessions when the configured signing secret changes', () => {
    const session = createAdminSession(now);
    vi.stubEnv('TOKEN_SECRET', 'replacement-secret');
    expect(verifyAdminSession(session.token, now)).toBe(false);
  });

  it('refuses to issue sessions without configured credentials', () => {
    vi.stubEnv('TOKEN_SECRET', '');
    vi.stubEnv('ADMIN_PASSWORD', '');
    expect(() => createAdminSession(now)).toThrow('Admin credentials are not configured');
  });

  it('derives the fallback secret from the admin password', () => {
    vi.stubEnv('TOKEN_SECRET', '');
    const session = createAdminSession(now);
    expect(verifyAdminSession(session.token, now)).toBe(true);
    vi.stubEnv('ADMIN_PASSWORD', 'replacement-password');
    expect(verifyAdminSession(session.token, now)).toBe(false);
  });
});
