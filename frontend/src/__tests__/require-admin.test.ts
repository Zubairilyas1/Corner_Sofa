// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAdminSession } from '../lib/admin-session';
import { requireAdmin } from '../lib/require-admin';
const state = vi.hoisted(() => ({ token: undefined as string | undefined }));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => state.token ? { value: state.token } : undefined }) }));
afterEach(() => { state.token = undefined; vi.unstubAllEnvs(); });
describe('admin API access', () => {
  it.each([undefined, 'admin_forged-long-enough-token'])('rejects unauthorized access: %s', async token => {
    state.token = token;
    expect((await requireAdmin())?.status).toBe(401);
  });
  it('allows a valid session and rejects an expired session', async () => {
    vi.stubEnv('TOKEN_SECRET', 'test-only-secret');
    state.token = createAdminSession().token;
    expect(await requireAdmin()).toBeUndefined();
    state.token = createAdminSession(0).token;
    expect((await requireAdmin())?.status).toBe(401);
  });
});
