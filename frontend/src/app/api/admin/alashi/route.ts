import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-session';
import { records, putRecord, deleteRecord, validateRange, type Question } from '@/lib/alashi-store';
import { normalizePostcode } from '@/lib/alashi-commerce';
import { boundedJson } from '@/lib/alashi-request';
import { SOFA_CATEGORIES } from '@/lib/product-categories';
import { findProduct } from '@/lib/product-store';
export const dynamic = 'force-dynamic';
const authorized = (req: NextRequest) => verifyAdminSession(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);
export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Sign in to admin.' }, { status: 401 });
  return NextResponse.json({ records: await records(), connected: Boolean(process.env.OPENAI_API_KEY), model: process.env.ALASHI_CHAT_MODEL || 'gpt-4.1-mini' });
}
export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Sign in to admin.' }, { status: 401 });
  try {
    const body = await boundedJson(req, 150000);
    if(body.action==='check-connection') {
      if(!process.env.OPENAI_API_KEY)throw new Error('OPENAI_API_KEY is missing. Add it privately to frontend/.env.local and restart the server.');
      const response=await fetch('https://api.openai.com/v1/models',{headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},signal:AbortSignal.timeout(15000)});
      if(!response.ok)throw new Error('The provider rejected the connection. Check the server key and account access.');
      return NextResponse.json({success:true,message:'API key authenticated successfully. Chat/image model access and billing are checked when used.'});
    } else if (body.action === 'delivery') {
      const postcode=normalizePostcode(String(body.postcode||''));const charge=body.charge;
      if(!/^[A-Z]{1,2}\d[A-Z\d]?(?:\d[A-Z]{2})?$/.test(postcode)||typeof charge!=='number'||!Number.isFinite(charge)||charge<0||charge>9999||Math.abs(charge*100-Math.round(charge*100))>0.00001)throw new Error('Enter a UK outward postcode (e.g. M1) or full postcode and a valid charge; 0 means free.');
      await putRecord({kind:'delivery',id:`delivery:${postcode}`,value:{postcode,charge}});
    } else if(body.action==='facts') {
      if(!await findProduct(String(body.productId)))throw new Error('Select a current sofa.');
      const fields=['warranty','materials','colours'] as const;
      for(const f of fields)if(typeof body[f]!=='string'||body[f].length>2000)throw new Error('Keep each detail below 2,000 characters.');
      await putRecord({kind:'facts',id:`facts:${body.productId}`,value:{warranty:body.warranty,materials:body.materials,colours:body.colours}});
    } else if (body.action === 'range') {
      const id = String(body.id || '');
      if (!(id.startsWith('category:') && SOFA_CATEGORIES.some(c=>`category:${c}`===id)) && !(id.startsWith('product:') && await findProduct(id.slice(8)))) throw new Error('Select a current product or sofa category.');
      if (body.range === null) await deleteRecord(id);
      else await putRecord({kind:'range',id,value:validateRange(body.range)});
    } else if (body.action === 'knowledge' || body.action === 'answer') {
      const title = typeof body.title === 'string' ? body.title.trim() : '';
      const text = typeof body.text === 'string' ? body.text.trim() : '';
      if (!title || title.length > 3000 || !text || text.length > 30000) throw new Error('Add a title and answer (maximum 30,000 characters).');
      const all = await records();
      const question = body.action === 'answer' ? all.find(r=>r.kind==='question' && r.id===body.id) : undefined;
      if (body.action === 'answer' && !question) throw new Error('Question no longer exists.');
      const id = question ? `knowledge:${question.id}` : (all.find(r=>r.kind==='knowledge' && r.id===body.id)?.id || `knowledge:${randomUUID()}`);
      await putRecord({kind:'knowledge',id,value:{id,title,text,updated:new Date().toISOString()}});
      if (question) await putRecord({...question,value:{...(question.value as Question),answer:text}});
    } else if (body.action === 'delete') {
      const record = (await records()).find(r=>r.id===body.id);
      if (!record) throw new Error('Entry not found.');
      await deleteRecord(record.id);
    } else throw new Error('Unknown action.');
    return NextResponse.json({success:true});
  } catch(error) { return NextResponse.json({error:error instanceof Error?error.message:'Unable to save.'},{status:400}); }
}
