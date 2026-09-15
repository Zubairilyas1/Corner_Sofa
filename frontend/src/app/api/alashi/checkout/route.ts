import { NextResponse } from 'next/server';
import { boundedJson, allowRequest } from '@/lib/alashi-request';
import { records } from '@/lib/alashi-store';
import { ASSEMBLY_FEE, deliveryCharge } from '@/lib/alashi-commerce';
import { validateCheckoutItems } from '@/lib/checkout-products';
import { createLocalOrder } from '@/lib/local-orders';
export const runtime='nodejs';
export async function POST(request:Request){try{
  if(!await allowRequest(request))return NextResponse.json({error:'Please try again later.'},{status:429});
  const {items,customer}=await boundedJson(request,100000);
  for(const field of ['name','email','phone','address','city','postcode'])if(typeof customer?.[field]!=='string'||!customer[field].trim()||customer[field].length>300)throw new Error('Complete your contact and delivery details.');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)||!/^[+\d][\d\s()-]{7,25}$/.test(customer.phone))throw new Error('Enter a valid email and phone number.');
  const delivery=deliveryCharge(await records(),customer.postcode);
  if(delivery===undefined)throw new Error('Your delivery postcode needs confirmation. Please contact Samiullah before placing this order.');
  const lines=await validateCheckoutItems(items);
  const subtotal=Math.round(lines.reduce((n,p)=>n+p.price*p.quantity,0)*100)/100;
  const total=Math.round((subtotal+delivery+ASSEMBLY_FEE)*100)/100;
  const order=await createLocalOrder({customer:customer.name,email:customer.email,phone:customer.phone,address:`${customer.address}, ${customer.city}`,postcode:customer.postcode,total,items:lines.reduce((n,p)=>n+p.quantity,0),status:'pending',paymentMethod:'Cash on Delivery',lines:lines.map(p=>({title:p.title,color:p.color,quantity:p.quantity,price:p.price,type:p.itemType||'sofa'}))});
  return NextResponse.json({invoice:{id:order.id,date:order.date,lines:order.lines,subtotal,delivery,assembly:ASSEMBLY_FEE,total,paymentMethod:'Cash on Delivery',customer:customer.name},message:'Order request received. Samiullah will confirm your made-to-order sofa and delivery.'},{status:201});
}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Could not place order.'},{status:400});}}
export async function GET(request:Request){const postcode=new URL(request.url).searchParams.get('postcode')||'';const charge=deliveryCharge(await records(),postcode);return NextResponse.json({delivery:charge??null,assembly:ASSEMBLY_FEE,needsOwner:charge===undefined});}
