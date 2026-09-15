import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { isDatabaseConfigured, sql } from './db';
const limits = new Map<string, { count: number; time: number }>();
export async function allowRequest(request: Request, image = false) {
  const window = Math.floor(Date.now() / 3600000);
  // Configure the reverse proxy to replace (not append user-supplied) x-forwarded-for.
  const address = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const key = createHash('sha256').update(`${address}:${window}:${image ? 'image' : 'chat'}`).digest('hex');
  const maximum = image ? 3 : 30;
  if (isDatabaseConfigured) {
    await sql`CREATE TABLE IF NOT EXISTS alashi_limits (id text PRIMARY KEY, count integer NOT NULL, expires bigint NOT NULL)`;
    await sql`DELETE FROM alashi_limits WHERE expires < ${Date.now()}`;
    const rows = await sql`INSERT INTO alashi_limits (id,count,expires) VALUES (${key},1,${Date.now()+3600000}) ON CONFLICT(id) DO UPDATE SET count=alashi_limits.count+1 RETURNING count`;
    return Number(rows[0].count) <= maximum;
  }
  for (const [id, value] of limits) if (value.time < Date.now()) limits.delete(id);
  const value = limits.get(key) || { count: 0, time: Date.now()+3600000 }; value.count++; limits.set(key, value);
  return value.count <= maximum;
}
export async function boundedJson(request: Request, maximum = 8000000) {
  const reader = request.body?.getReader(); if (!reader) throw new Error('A request body is required.');
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > maximum) { await reader.cancel(); throw new Error('Upload is too large. Maximum file size is 5 MB.'); } chunks.push(value); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export async function attachmentInput(file: unknown): Promise<{ type: string; [key: string]: unknown }[]> {
  if (!file) return [];
  const f = file as { name: string; data: string };
  if (typeof f.name !== 'string' || f.name.length > 200 || typeof f.data !== 'string') throw new Error('Invalid attachment.');
  const match = /^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/.exec(f.data);
  if (!match) throw new Error('Invalid attachment encoding.');
  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length || buffer.length > 5 * 1024 * 1024) throw new Error('Maximum file size is 5 MB.');
  if (['image/jpeg', 'image/png', 'image/webp'].includes(match[1])) {
    try {
    const bytes = await sharp(buffer, { limitInputPixels: 25000000 }).rotate().resize(1400,1400,{fit:'inside',withoutEnlargement:true}).webp().toBuffer();
    return [{ type: 'input_image', image_url: `data:image/webp;base64,${bytes.toString('base64')}` }];
    } catch { throw new Error('I could not read that photo. Please try another JPG, PNG or WebP image.'); }
  }
  if (/\.pdf$/i.test(f.name) && buffer.subarray(0,5).toString() === '%PDF-') return [{ type: 'input_file', filename: f.name, file_data: `data:application/pdf;base64,${buffer.toString('base64')}` }];
  if (/\.(txt|md|csv)$/i.test(f.name) && !buffer.includes(0)) return [{ type: 'input_text', text: `UNTRUSTED CUSTOMER DOCUMENT (${f.name}):\n${buffer.toString('utf8').slice(0,30000)}` }];
  throw new Error('Add a JPG, PNG, WebP photo or a PDF, TXT, MD or CSV document.');
}
