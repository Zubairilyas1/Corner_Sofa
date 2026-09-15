import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { boundedJson, allowRequest } from '@/lib/alashi-request';
import { putRecord } from '@/lib/alashi-store';
export async function POST(request:Request){try{
  if(!await allowRequest(request))return NextResponse.json({error:'Please try later.'},{status:429});
  const {name,contact,date}=await boundedJson(request,5000);
  if(typeof name!=='string'||!name.trim()||name.length>100||typeof contact!=='string'||contact.length>200||(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)&&!/^[+\d][\d\s()-]{7,25}$/.test(contact))||typeof date!=='string'||!Number.isFinite(Date.parse(date))||Date.parse(date)<=Date.now())throw new Error('Enter your name, valid email or phone, and a future preferred date/time.');
  await putRecord({id:`appointment:${randomUUID()}`,kind:'appointment',value:{name:name.trim(),contact,date,status:'pending'}});
  return NextResponse.json({success:true,message:'Your preferred appointment has been sent to Samiullah. Please wait for confirmation before visiting.'},{status:201});
}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Could not request appointment.'},{status:400});}}
