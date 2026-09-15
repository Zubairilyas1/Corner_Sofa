import type { StoreProduct } from './product-options';
export function normalized(value:string){return value.toLowerCase().replace(/reclinear|reclinar|recliner?s/g,'recliner').replace(/gray/g,'grey').replace(/l[ -]?shape[d]?/g,'corner').replace(/two[ -]?seater/g,'2 seater').replace(/three[ -]?seater/g,'3 seater').replace(/sofa[ -]?beds?/g,'sofa bed').replace(/[-–]/g,' ');}
export function categoryIntent(value:string){const q=normalized(value);if(/sofa bed|sleeper/.test(q))return 'Sofa Bed';if(/recliner/.test(q))return 'Recliner';if(/u shape/.test(q))return 'U-Shape';if(/corner/.test(q))return 'Corner';if(/2\s*seat/.test(q))return '2-Seater';if(/3\s*seat/.test(q))return '3-Seater';return undefined;}
export function matchProducts(products:StoreProduct[],query:string,shown:string[]=[],alternatives=false) {
  const q=normalized(query);const category=categoryIntent(q);
  const words=q.split(/\W+/).filter(w=>w.length>2&&!['want','sofa','have','with','please','show','need','the','you','can','more','another','different','option','options','price','cost','what','how','much'].includes(w));
  const scored=products.map(p=>{const haystack=normalized(`${p.title} ${p.category} ${p.description} ${p.variants.map(v=>v.color).join(' ')}`);return {p,score:words.reduce((n,w)=>n+(haystack.includes(w)?2:0),0)+(category===p.category?30:0)+(alternatives&&shown.includes(p.id)?-100:0)};}).filter(x=>category?x.p.category===category:x.score>0).sort((a,b)=>b.score-a.score);
  return scored.slice(0,3).map(x=>x.p);
}
