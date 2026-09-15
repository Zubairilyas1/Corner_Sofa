import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { findProduct } from '@/lib/product-store';
import { listReviews, saveReview } from '@/lib/review-store';
import { summarizeReviews, validateReviewFields } from '@/lib/reviews';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const reviews = await listReviews();
    const product = request.nextUrl.searchParams.get('product');
    return NextResponse.json(request.nextUrl.searchParams.has('summary') ? summarizeReviews(reviews) : reviews.filter(review => !product || review.product_id === product), { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Unable to load reviews. Please try again.' }, { status: 500 }); }
}
export async function POST(request: NextRequest) {
  try {
    // Bound the actual request body, including uploads, before parsing multipart data.
    const reader = request.body?.getReader();
    if (!reader) throw new Error('Enter your review.');
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 13 * 1024 * 1024) { await reader.cancel(); throw new Error('Photos must total less than 12 MB.'); }
      chunks.push(value);
    }
    const form = await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': request.headers.get('content-type') || '' } }).formData();
    const fields = validateReviewFields({ name: form.get('name'), text: form.get('text'), rating: form.get('rating'), product_id: form.get('product_id') });
    const product = await findProduct(fields.product_id);
    if (!product) throw new Error('This sofa is no longer available. Please choose another sofa.');
    const files = form.getAll('photos').filter((file): file is File => file instanceof File && file.size > 0);
    if (files.length > 3) throw new Error('You can share up to 3 photos.');
    const photos: string[] = [];
    for (const file of files) {
      if (file.size > 4 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Use JPG, PNG or WebP photos, up to 4 MB each.');
      try {
        const photo = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 25000000 }).rotate().resize(1000,1000,{fit:'inside',withoutEnlargement:true}).webp({quality:78}).toBuffer();
        photos.push(`data:image/webp;base64,${photo.toString('base64')}`);
      } catch { throw new Error('One photo could not be read. Please choose a JPG, PNG or WebP image.'); }
    }
    const review = await saveReview({ ...fields, product_title: product.title, photos });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && !/sql|database|ENOENT|EACCES/i.test(error.message) ? error.message : 'Your review could not be saved. Please try again.' }, { status: 400 });
  }
}
