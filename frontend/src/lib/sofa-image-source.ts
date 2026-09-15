import { readFile, realpath, stat } from 'fs/promises';
import path from 'path';
import { lookup } from 'dns/promises';
import { isIP } from 'net';
import http from 'http';
import https from 'https';

export const MAX_SOFA_IMAGE_BYTES = 15 * 1024 * 1024;

export function isPublicImageAddress(address: string) {
  if (isIP(address) === 4) {
    const [a, b] = address.split('.').map(Number);
    return a !== 0 && a !== 10 && a !== 127 && a < 224
      && !(a === 169 && b === 254) && !(a === 172 && b >= 16 && b <= 31)
      && !(a === 192 && (b === 168 || b === 0)) && !(a === 100 && b >= 64 && b <= 127)
      && !(a === 198 && (b === 18 || b === 19));
  }
  // Accept only global unicast IPv6; mapped IPv4/loopback/link-local/private ranges are excluded.
  return isIP(address) === 6 && /^[23][0-9a-f]{3}:/i.test(address);
}

async function readRemoteImage(url: URL, redirects = 0): Promise<Buffer> {
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || (url.port && !['80', '443'].includes(url.port))) {
    throw new Error('Use a public http(s) photo URL.');
  }
  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  const addresses = await lookup(hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => !isPublicImageAddress(address))) {
    throw new Error('This photo address is not a public image URL.');
  }
  // Prefer IPv4 on hosts without working outbound IPv6 connectivity.
  const pinned = addresses.find(item => item.family === 4) || addresses[0];
  return new Promise((resolve, reject) => {
    const client = url.protocol === 'https:' ? https : http;
    const request = client.get(url, {
      signal: AbortSignal.timeout(15000),
      headers: { Accept: 'image/jpeg,image/png,image/webp,image/avif', 'User-Agent': 'SofaColourPreview/1.0' },
      lookup: (_host, options, callback) => {
        if (options.all) (callback as unknown as (error: null, resolved: typeof addresses) => void)(null, [pinned]);
        else callback(null, pinned.address, pinned.family);
      },
    }, (response) => {
      if ([301, 302, 303, 307, 308].includes(response.statusCode || 0)) {
        response.resume();
        if (!response.headers.location || redirects >= 3) { reject(new Error('The photo URL redirects too many times.')); return; }
        readRemoteImage(new URL(response.headers.location, url), redirects + 1).then(resolve, reject);
        return;
      }
      if (response.statusCode !== 200 || !response.headers['content-type']?.startsWith('image/')) {
        response.resume(); reject(new Error('The main photo URL did not return an image.')); return;
      }
      if (Number(response.headers['content-length']) > MAX_SOFA_IMAGE_BYTES) {
        response.destroy(); reject(new Error('Choose a main photo smaller than 15 MB.')); return;
      }
      const chunks: Buffer[] = [];
      let bytes = 0;
      response.on('data', (chunk: Buffer) => {
        bytes += chunk.length;
        if (bytes > MAX_SOFA_IMAGE_BYTES) { response.destroy(new Error('Choose a main photo smaller than 15 MB.')); return; }
        chunks.push(chunk);
      });
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    });
    request.setTimeout(15000, () => request.destroy(new Error('The main photo took too long to load. Please retry.')));
    request.on('error', reject);
  });
}

export async function readSofaImage(source: string): Promise<Buffer> {
  if (typeof source !== 'string' || !source || source.length > 4000) throw new Error('Choose a main sofa photo first.');
  const uploaded = /^\/api\/product-images\/([a-f0-9]{64}\.webp)\/?$/.exec(source);
  if (uploaded) {
    const { readProductPhoto } = await import('./product-photo-store');
    const bytes = await readProductPhoto(uploaded[1]);
    if (!bytes) throw new Error('This uploaded photo is missing. Please upload it again.');
    return bytes;
  }
  if (!source.startsWith('/')) return readRemoteImage(new URL(source));
  if (source.startsWith('//') || source.includes('\\') || source.includes('\0')) throw new Error('Invalid main photo path.');
  const relative = decodeURIComponent(source.split('?')[0]);
  if (!/^\/images\//.test(relative) || !/\.(webp|png|jpe?g|avif)$/i.test(relative)) {
    throw new Error('Use an original JPG, PNG, WebP or AVIF sofa photo in /images/, or a public photo URL.');
  }
  const publicRoot = await realpath(path.join(process.cwd(), 'public'));
  const file = await realpath(path.resolve(publicRoot, `.${relative}`));
  const within = path.relative(publicRoot, file);
  if (within.startsWith('..') || path.isAbsolute(within)) throw new Error('Invalid main photo path.');
  const metadata = await stat(file);
  if (!metadata.isFile() || metadata.size > MAX_SOFA_IMAGE_BYTES) throw new Error('Choose a main photo smaller than 15 MB.');
  return readFile(file);
}
