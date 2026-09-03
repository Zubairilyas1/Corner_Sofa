import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Corner Sofa — premium UK handmade sofas crafted by skilled artisans. Our story, values, and commitment to quality.',
};

export default function AboutPage() {
  return (
    <main className="bg-primary">
      {/* Hero */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-3">Our Story</p>
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] text-dark uppercase mb-6">
            Handcrafted in the UK
          </h1>
          <p className="text-sm tracking-widest text-dark/60 uppercase font-medium max-w-xl mx-auto">
            Since 2018, we&apos;ve been building sofas that combine traditional craftsmanship with modern comfort
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl font-light tracking-[0.15em] text-dark uppercase mb-6">
                Born from a Simple Idea
              </h2>
              <div className="space-y-4 text-sm text-dark/60 leading-relaxed">
                <p>
                  Corner Sofa started with a frustration: why does a quality handmade sofa have to cost
                  so much? We believed there was a better way — cutting out the middleman, selling
                  directly, and passing the savings to our customers.
                </p>
                <p>
                  Based in Manchester, our workshop is home to a team of skilled artisans who take pride
                  in every stitch. Each sofa is built to order using kiln-dried hardwood frames,
                  premium fabrics, and time-tested construction techniques.
                </p>
                <p>
                  Today, we&apos;ve delivered over 5,000 sofas across the UK, each one backed by our
                  10-year warranty and free room-of-choice delivery.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center">
              <p className="text-dark/20 text-sm">Workshop Image</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-light tracking-[0.15em] text-dark uppercase text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Quality First', desc: 'Every sofa passes a 12-point quality check before it leaves our workshop. We never compromise on materials or construction.' },
              { title: 'Honest Pricing', desc: 'No showrooms with 300% markups. No middlemen. Just fair prices for handmade furniture delivered direct to you.' },
              { title: 'Sustainable Craft', desc: 'We use responsibly sourced hardwood, water-based finishes, and recyclable packaging. Quality furniture should last, not end up in landfill.' },
            ].map((v) => (
              <div key={v.title} className="text-center">
                <h3 className="text-sm font-medium tracking-[0.15em] text-dark uppercase mb-3">{v.title}</h3>
                <p className="text-xs text-dark/50 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '5,000+', label: 'Sofas Delivered' },
              { num: '10', label: 'Year Warranty' },
              { num: '4.9★', label: 'Customer Rating' },
              { num: '2018', label: 'Founded' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-light text-accent mb-1">{s.num}</p>
                <p className="text-[10px] text-dark/40 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-dark text-primary">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-light tracking-[0.15em] uppercase mb-4">Ready to Find Your Sofa?</h2>
          <p className="text-sm text-primary/60 mb-8">Order free fabric swatches or visit our showroom to feel the quality in person.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button variant="primary" size="lg">Shop Sofas</Button>
            </Link>
            <Link href="/swatches">
              <Button variant="ghost" size="lg" className="text-primary border-primary/20 hover:bg-primary/10">Free Swatches</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
