import { NextRequest, NextResponse } from 'next/server';
import { readSofaPreview } from '@/lib/sofa-preview-renderer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const image = await readSofaPreview(filename);
  if (!image) return new NextResponse('Colour preview not found', { status: 404 });
  return new NextResponse(new Uint8Array(image), { headers: {
    'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
  } });
}
