import {NextResponse} from 'next/server';
import {readProductPhoto} from '@/lib/product-photo-store';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{filename:string}>}){const {filename}=await params;const photo=await readProductPhoto(filename);return photo?new NextResponse(new Uint8Array(photo),{headers:{'Content-Type':'image/webp','Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'}}):new NextResponse('Photo not found',{status:404});}
