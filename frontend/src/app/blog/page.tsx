import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tips, inspiration, and behind-the-scenes from Corner Sofa. Sofa buying guides, interior design ideas, and workshop stories.',
};

const POSTS = [
  {
    id: '1',
    title: 'How to Choose the Perfect Corner Sofa for Your Living Room',
    excerpt: 'Corner sofas come in left-facing and right-facing configurations. Here\'s how to pick the right one for your space.',
    category: 'Buying Guide',
    date: '2026-08-15',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Velvet vs Linen: Which Fabric Is Right for You?',
    excerpt: 'We compare the durability, feel, and maintenance of our two most popular fabric choices.',
    category: 'Materials',
    date: '2026-08-01',
    readTime: '4 min read',
  },
  {
    id: '3',
    title: 'Behind the Scenes: How Our Sofas Are Made',
    excerpt: 'Take a tour of our Manchester workshop and see the craftsmanship that goes into every Corner Sofa.',
    category: 'Behind the Scenes',
    date: '2026-07-20',
    readTime: '6 min read',
  },
  {
    id: '4',
    title: '5 Ways to Style a Neutral Sofa',
    excerpt: 'A neutral sofa is a blank canvas. Here are five ways to make it the star of your living room.',
    category: 'Interior Design',
    date: '2026-07-10',
    readTime: '3 min read',
  },
  {
    id: '5',
    title: 'What Does "Room of Choice" Delivery Actually Mean?',
    excerpt: 'Our free delivery includes white-glove service. Here\'s exactly what happens on delivery day.',
    category: 'Delivery',
    date: '2026-06-28',
    readTime: '3 min read',
  },
  {
    id: '6',
    title: 'Why We Offer Free Fabric Swatches',
    excerpt: 'Buying a sofa online can feel like a leap of faith. Our free swatches let you feel the quality before you commit.',
    category: 'Swatches',
    date: '2026-06-15',
    readTime: '2 min read',
  },
];

export default function BlogPage() {
  return (
    <main className="py-20 bg-primary">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light tracking-[0.2em] text-dark uppercase mb-3">Blog</h1>
          <p className="text-sm tracking-widest text-dark/60 uppercase">Tips, guides, and inspiration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POSTS.map((post) => (
            <article key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-dark/20 hover:shadow-lg transition-all duration-300">
              <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
                <p className="text-dark/20 text-xs">{post.category}</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] text-accent uppercase tracking-widest font-medium">{post.category}</span>
                  <span className="text-dark/20">·</span>
                  <span className="text-[10px] text-dark/30">{post.readTime}</span>
                </div>
                <h2 className="text-sm font-medium text-dark mb-2 leading-relaxed">{post.title}</h2>
                <p className="text-xs text-dark/50 leading-relaxed mb-4">{post.excerpt}</p>
                <span className="text-[10px] text-dark/30 uppercase tracking-widest">
                  {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-dark/50 mb-6">More articles coming soon.</p>
          <Link href="/products">
            <Button variant="contrast" size="lg">Shop Sofas</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
