import Link from 'next/link';
import { Armchair, ArrowUpRight } from 'lucide-react';

const columns = [
  { title: 'Find your comfort', links: [['All sofas', '/products'], ['Corner sofas', '/products?category=Corner'], ['2-seater sofas', '/products?category=2-Seater'], ['3-seater sofas', '/products?category=3-Seater'], ['Recliners', '/products?category=Recliner']] },
  { title: 'Here to help', links: [['Free fabric swatches', '/swatches'], ['Size & measuring guide', '/size-guide'], ['Delivery information', '/delivery-info'], ['Common questions', '/faq'], ['Get in touch', '/contact']] },
  { title: 'A little about us', links: [['Our story', '/about'], ['Visit our showroom', '/appointment'], ['Customer reviews', '/reviews'], ['Ideas & inspiration', '/blog']] },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="footer-top">
          <div>
            <Link href="/" className="footer-brand inline-flex items-center gap-3" aria-label="Corner Sofa home"><Armchair size={32} strokeWidth={1.4} aria-hidden="true" />corner sofa.</Link>
            <p className="footer-intro">Considered design. Beautiful craftsmanship.<br />A comfortable place to call your own.</p>
            <Link href="/contact" className="mt-4 inline-flex min-h-11 items-center gap-3 text-xs text-[#d2dbc7]">Let’s find your perfect sofa <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
          {columns.map((column) => <div key={column.title} className="footer-column"><h3>{column.title}</h3><ul>{column.links.map(([label, href]) => <li key={label}><Link href={href}>{label}</Link></li>)}</ul></div>)}
        </div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} Corner Sofa. Made for the way you live.</p><div className="flex flex-wrap gap-6"><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms &amp; conditions</Link><span>United Kingdom · GBP £</span></div></div>
      </div>
    </footer>
  );
}
