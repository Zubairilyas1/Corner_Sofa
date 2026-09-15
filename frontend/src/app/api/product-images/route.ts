import {NextRequest,NextResponse} from 'next/server';
import {ADMIN_SESSION_COOKIE,verifyAdminSession} from '@/lib/admin-session';
import {saveProductPhoto} from '@/lib/product-photo-store';
export const runtime='nodejs';
export async function POST(request:NextRequest){
  if(!verifyAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value))return NextResponse.json({error:'Your admin session expired. Please sign in again.'},{status:401});
  try{const reader=request.body?.getReader();if(!reader)throw new Error('Choose a photo.');const chunks:Uint8Array[]=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>15*1024*1024){await reader.cancel();throw new Error('Choose a photo smaller than 15 MB.');}chunks.push(value);}const url=await saveProductPhoto(Buffer.concat(chunks));return NextResponse.json({url},{status:201});}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Photo upload failed.'},{status:400});}
}
