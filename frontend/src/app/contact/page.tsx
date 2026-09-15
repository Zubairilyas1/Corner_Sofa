import Link from 'next/link';
import type { Metadata } from 'next';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import styles from './contact.module.css';

export const metadata: Metadata = { title: 'Contact', description: 'Contact Samiullah at Corner Sofa by email, phone or WhatsApp.', alternates: { canonical: '/contact' } };

export default function ContactPage() {
  return (
    <div className={styles.scene}>
      <section className={styles.sheet} aria-labelledby="contact-title">
        <header className={styles.header}>
          <nav aria-label="Contact page navigation"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/contact" aria-current="page">Contacts</Link></nav>
          <Link href="/" className={styles.brand}>Corner Sofa</Link>
          <Link href="/products" className={styles.shop}>Shop</Link>
        </header>
        <p className={styles.aboutLabel}>About me</p>
        <h1 id="contact-title" className={styles.title}>Corner Sofa</h1>
        <div className={styles.person}><h2>Samiullah</h2><p>Comfort for everyday living.<br />Thoughtful sofas for your home.</p></div>
        <div className={styles.tabletStory}><p>UK based<br />Free UK delivery<br />Cash on delivery</p><h2>Crafted for comfort.<br />Made for your home.</h2><span>United Kingdom</span></div>
        <div className={styles.phoneBlock}>
          <a className={styles.phone} href="tel:+447456439050" aria-label="Call +44 7456 439050"><Phone aria-hidden="true" />Call +44 7456 439050</a>
          <a className={styles.whatsapp} href="https://wa.me/447456439050" target="_blank" rel="noopener noreferrer"><MessageCircle size={19} aria-hidden="true" /> WhatsApp</a>
        </div>
        <div className={styles.emails} aria-label="Email Corner Sofa">
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=cornersofaonlineuk%40gmail.com" target="_blank" rel="noopener noreferrer"><Mail size={17} />cornersofaonlineuk@gmail.com</a>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=furnishingshub52%40gmail.com" target="_blank" rel="noopener noreferrer"><Mail size={17} />furnishingshub52@gmail.com</a>
        </div>
        <footer className={styles.footer}><span>© Corner Sofa</span><span>{new Date().getFullYear()}</span></footer>
      </section>
    </div>
  );
}
