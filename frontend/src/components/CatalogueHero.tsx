import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronRight, Layers3, Sofa } from 'lucide-react';
import SiteHeader from './SiteHeader';
import styles from './CatalogueHero.module.css';

const categoryPhotos: Record<string, string> = {
  '2-Seater': 'category-two-seater-clean.png',
  'U-Shape': 'category-u-shape-full-black.png',
  Corner: 'catalogue-mountain-room.webp',
  Recliner: 'premium-recliners.webp',
  'Sofa Bed': 'category-sofa-bed.png',
};

export default function CatalogueHero({ title, categoryLabel, category = 'All', query = '' }: { title: string; categoryLabel: string; category?: string; query?: string }) {
  const photo = category === 'Recliner' && /\bmanual\b/i.test(query)
    ? 'premium-recliners.webp'
    : categoryPhotos[category] || 'catalogue-mountain-room.webp';
  const banner = category === 'Sofa Bed';
  return <section className={`${styles.hero} ${category === '2-Seater' ? styles.lightHero : ''} ${category === 'U-Shape' ? styles.uShapeHero : ''} ${banner ? styles.bannerHero : ''}`}>
    <img className={styles.photo} src={`/images/sofas/${photo}`} alt={`${categoryLabel} collection`} fetchPriority="high" />
    <div className={styles.navigation}><SiteHeader catalogue /></div>
    {!banner && <div className={styles.content}>
      <nav aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight size={13} /><span>{categoryLabel}</span></nav>
      <p className={styles.eyebrow}>The sofa collection</p>
      <h1>{title === 'Find your kind of comfort.' ? <>Find your kind of<br /><em>comfort.</em></> : title}</h1>
      <p className={styles.description}>Thoughtful shapes. Beautiful textures. Discover a sofa that feels right at home, from the very first sit.</p>
      <div className={styles.actions}><a href="#collection">Explore the collection <ArrowRight size={18} /></a></div>
      <Link href="/room-planner" className={styles.tryRoom}><Sofa size={21} /><span>Try in your room <ArrowUpRight size={13} /><small>See your favourite sofa in your own space.</small></span></Link>
    </div>}
    {banner ? <div className={styles.bannerFeatures}>
      <Link href="#collection" aria-label="Explore sofa beds"><ArrowRight size={22} /></Link>
      <Link href="/room-planner" aria-label="Try in your room"><Sofa size={22} /></Link>
      <Link href="/room-planner" aria-label="Plan your room"><Layers3 size={22} /></Link>
    </div> : <aside className={styles.planner} aria-label="Plan your room">
      <Layers3 size={45} strokeWidth={1.4} aria-hidden="true" />
      <h2>Plan your room</h2>
      <p>See your favourite sofa in your own space before you choose.</p>
      <Link href="/room-planner">Plan room <ArrowRight size={17} aria-hidden="true" /></Link>
    </aside>}
  </section>;
}
