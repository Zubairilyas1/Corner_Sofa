// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import sharp from 'sharp';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/reviews/route';
import { summarizeReviews, validateReviewFields } from '@/lib/reviews';
import { listReviews } from '@/lib/review-store';

vi.mock('@/lib/db', () => ({ isDatabaseConfigured: false }));
vi.mock('@/lib/product-store', () => ({ findProduct: vi.fn(async (id: string) => id === 'sofa-a' ? { id, title: 'Test Sofa' } : undefined) }));
let directory: string;
const originalDirectory = process.env.REVIEW_DATA_DIR;
beforeAll(async () => { directory = await mkdtemp(path.join(os.tmpdir(), 'sofa-reviews-test-')); process.env.REVIEW_DATA_DIR = directory; });
afterAll(async () => { if (originalDirectory === undefined) delete process.env.REVIEW_DATA_DIR; else process.env.REVIEW_DATA_DIR = originalDirectory; await rm(directory, { recursive: true, force: true }); });
function request(overrides: Record<string, string> = {}, photo?: Blob) {
  const form = new FormData();
  Object.entries({ name: 'Customer', text: 'Very comfortable sofa.', rating: '4', product_id: 'sofa-a', ...overrides }).forEach(([key,value]) => form.set(key,value));
  if (photo) form.append('photos', photo, 'sofa.png');
  return new NextRequest('http://localhost/api/reviews', { method: 'POST', body: form });
}
describe('customer reviews', () => {
  it('saves text and a re-encoded photo, reads them back, and updates the product average', async () => {
    const png = await sharp({ create: { width: 3, height: 3, channels: 3, background: '#eeeecc' } }).png().toBuffer();
    const response = await POST(request({}, new Blob([new Uint8Array(png)], { type: 'image/png' })));
    expect(response.status).toBe(201);
    const saved = await response.json();
    expect(saved.photos[0]).toMatch(/^data:image\/webp;base64,/);
    expect((await listReviews()).find(review => review.id === saved.id)?.text).toBe('Very comfortable sofa.');
    expect((await POST(request({ rating: '2' }))).status).toBe(201);
    const result = await GET(new NextRequest('http://localhost/api/reviews?summary=1'));
    expect(await result.json()).toEqual({ 'sofa-a': { count: 2, average: 3 } });
    const other = await GET(new NextRequest('http://localhost/api/reviews?product=sofa-b'));
    expect(await other.json()).toEqual([]);
  });
  it('rejects unknown products and invalid image bytes without saving', async () => {
    const before = (await listReviews()).length;
    expect((await POST(request({ product_id: 'missing' }))).status).toBe(400);
    expect((await POST(request({}, new Blob(['not a photo'], { type: 'image/png' })))).status).toBe(400);
    expect((await listReviews()).length).toBe(before);
  });
  it.each(['0','6','2.5','hello'])('rejects rating %s', rating => {
    expect(() => validateReviewFields({ name:'Customer',text:'Lovely sofa',rating,product_id:'sofa-a' })).toThrow(/rating/);
  });
  it('does not mix ratings between sofas', () => {
    expect(summarizeReviews([{product_id:'a',rating:5},{product_id:'b',rating:1},{product_id:'a',rating:3}])).toEqual({a:{average:4,count:2},b:{average:1,count:1}});
  });
});
