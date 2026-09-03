import '../../styles/globals.css';
import { CartProvider } from '@/context/CartContext';
import MiniCart from '@/components/MiniCart';
import MobileMenu from '@/components/MobileMenu';
import BackToTop from '@/components/BackToTop';
import Link from 'next/link';
import { Metadata } from 'next';
import { generateOrganizationSchema } from '@/lib/schema';
import { Assistant } from 'next/font/google';
import Analytics from '@/components/Analytics';

const assistant = Assistant({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-assistant',
});

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://cornersofa.co.uk';

export const metadata: Metadata = {
  title: {
    default: 'Corner Sofa | Premium UK Handmade Sofas',
    template: '%s | Corner Sofa',
  },
  description: 'Premium quality, handmade sofas crafted in the UK. Free delivery, 10-year warranty, and free fabric swatches. Shop 2-seater, 3-seater, corner, and recliner sofas.',
  keywords: ['sofas', 'handmade sofas', 'UK sofas', 'corner sofas', '2-seater sofas', '3-seater sofas', 'recliner sofas', 'premium sofas', 'luxury sofas', 'free delivery sofas'],
  authors: [{ name: 'Corner Sofa' }],
  creator: 'Corner Sofa',
  publisher: 'Corner Sofa',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: 'Corner Sofa',
    title: 'Corner Sofa | Premium UK Handmade Sofas',
    description: 'Premium quality, handmade sofas crafted in the UK. Free delivery, 10-year warranty, and free fabric swatches.',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Corner Sofa — Premium UK Handmade Sofas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corner Sofa | Premium UK Handmade Sofas',
    description: 'Premium quality, handmade sofas crafted in the UK. Free delivery, 10-year warranty.',
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className={`${assistant.variable} bg-primary text-dark font-sans flex flex-col min-h-screen`}>
        <CartProvider>
          <Analytics />

          {/* ── Glass Header ─────────────────────────── */}
          <header className="fixed top-0 left-0 right-0 z-50 glass-white border-b border-white/30">
            <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
              <Link href="/" className="text-2xl font-light tracking-[0.2em] uppercase text-dark hover:text-accent transition-colors">
                Corner Sofa
              </Link>
              <nav className="hidden md:flex gap-8 items-center">
                <Link href="/products" className="text-xs font-medium tracking-[0.15em] uppercase text-dark/70 hover:text-accent transition-colors">Shop Sofas</Link>
                <Link href="/swatches" className="text-xs font-medium tracking-[0.15em] uppercase text-dark/70 hover:text-accent transition-colors">Swatches</Link>
                <Link href="/faq" className="text-xs font-medium tracking-[0.15em] uppercase text-dark/70 hover:text-accent transition-colors">FAQ</Link>
                <Link href="/appointment" className="text-xs font-medium tracking-[0.15em] uppercase text-dark/70 hover:text-accent transition-colors">Showroom</Link>
                <MiniCart />
              </nav>
              <div className="flex items-center gap-2 md:hidden">
                <MiniCart />
                <MobileMenu />
              </div>
            </div>
          </header>

          <main className="flex-grow pt-20">
            {children}
          </main>

          {/* ── Glass Footer ─────────────────────────── */}
          <footer className="glass-dark text-primary py-16 mt-auto relative overflow-hidden">
            {/* Decorative orbs */}
            <div className="bg-orb bg-orb-accent w-[400px] h-[400px] -top-40 -right-40 absolute" />
            <div className="bg-orb bg-orb-gold w-[300px] h-[300px] -bottom-20 -left-20 absolute" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
                <div>
                  <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-4 text-gold">Corner Sofa</h3>
                  <p className="text-primary/50 leading-relaxed text-sm">
                    Premium quality, handmade in the UK. Direct to you with free delivery and a 10-year warranty.
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-medium tracking-[0.25em] uppercase mb-5 text-primary/40">Shop</h4>
                  <ul className="space-y-3 text-primary/50">
                    <li><Link href="/products?category=2-Seater" className="hover:text-gold transition-colors">2-Seater Sofas</Link></li>
                    <li><Link href="/products?category=3-Seater" className="hover:text-gold transition-colors">3-Seater Sofas</Link></li>
                    <li><Link href="/products?category=Corner" className="hover:text-gold transition-colors">Corner Sofas</Link></li>
                    <li><Link href="/products?category=Recliner" className="hover:text-gold transition-colors">Recliners</Link></li>
                    <li><Link href="/products" className="hover:text-gold transition-colors">All Sofas</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-medium tracking-[0.25em] uppercase mb-5 text-primary/40">Customer Service</h4>
                  <ul className="space-y-3 text-primary/50">
                    <li><Link href="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
                    <li><Link href="/swatches" className="hover:text-gold transition-colors">Free Fabric Swatches</Link></li>
                    <li><Link href="/appointment" className="hover:text-gold transition-colors">Book a Showroom Visit</Link></li>
                    <li><Link href="/reviews" className="hover:text-gold transition-colors">Customer Reviews</Link></li>
                    <li><Link href="/size-guide" className="hover:text-gold transition-colors">Size Guide</Link></li>
                    <li><Link href="/delivery-info" className="hover:text-gold transition-colors">Delivery Information</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-medium tracking-[0.25em] uppercase mb-5 text-primary/40">Company</h4>
                  <ul className="space-y-3 text-primary/50">
                    <li><Link href="/about" className="hover:text-gold transition-colors">About Us</Link></li>
                    <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
                    <li><Link href="/blog" className="hover:text-gold transition-colors">Blog</Link></li>
                    <li><Link href="/terms" className="hover:text-gold transition-colors">Terms & Conditions</Link></li>
                    <li><Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
                  </ul>
                </div>
              </div>

              <div className="glass-divider my-10" />

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-primary/30 tracking-[0.15em] uppercase">
                <p>&copy; 2026 Corner Sofa. All rights reserved.</p>
                <div className="flex gap-6">
                  <span>UK Handmade</span>
                  <span className="text-accent">·</span>
                  <span>10-Year Warranty</span>
                  <span className="text-accent">·</span>
                  <span>Free Delivery</span>
                </div>
              </div>
            </div>
          </footer>
          <BackToTop />
        </CartProvider>
      </body>
    </html>
  );
}
