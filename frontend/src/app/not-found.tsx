import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <main className="min-h-[60vh] bg-primary flex flex-col items-center justify-center py-20 px-4">
      <div className="text-center max-w-lg">
        <p className="text-6xl font-light text-accent mb-6">404</p>
        <h1 className="text-2xl font-light tracking-[0.15em] text-dark uppercase mb-4">
          Page Not Found
        </h1>
        <p className="text-sm text-dark/60 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <p className="text-xs text-dark/40 uppercase tracking-widest mb-4">Popular Pages</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/products" className="text-sm text-dark/60 hover:text-accent transition-colors p-3 bg-primary/50 rounded-lg text-center">
              Shop Sofas
            </Link>
            <Link href="/swatches" className="text-sm text-dark/60 hover:text-accent transition-colors p-3 bg-primary/50 rounded-lg text-center">
              Free Swatches
            </Link>
            <Link href="/faq" className="text-sm text-dark/60 hover:text-accent transition-colors p-3 bg-primary/50 rounded-lg text-center">
              FAQ
            </Link>
            <Link href="/appointment" className="text-sm text-dark/60 hover:text-accent transition-colors p-3 bg-primary/50 rounded-lg text-center">
              Book a Visit
            </Link>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="contrast" size="lg">Return Home</Button>
          </Link>
          <Link href="/products">
            <Button variant="ghost" size="lg">Browse Sofas</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
