'use client';

import { useState } from 'react';
import { Button, Rating, Badge, Card } from '@/components/ui';

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  product: string;
  verified: boolean;
  date: string;
}

const REVIEWS: Review[] = [
  { id: '1', name: 'Emma R.', rating: 5, text: 'Absolutely stunning sofa. The velvet is incredibly soft and the build quality is exceptional. Delivery team were professional and placed it exactly where we wanted.', product: 'Velvet 3-Seater Sofa', verified: true, date: '2026-08-28' },
  { id: '2', name: 'James T.', rating: 4, text: 'Great value for money. Looks much more expensive than it is. Only minor issue was delivery took 8 days instead of 5, but the sofa itself is perfect.', product: 'Linen 2-Seater Sofa', verified: true, date: '2026-08-22' },
  { id: '3', name: 'Sophie H.', rating: 5, text: 'We spent months looking for a corner sofa that would fit our awkward room. The left-facing velvet corner is perfect. The free swatches were a game-changer for deciding on colour.', product: 'Velvet Corner Sofa — Left Facing', verified: true, date: '2026-08-15' },
  { id: '4', name: 'David M.', rating: 5, text: 'You can genuinely feel the handmade quality. The stitching, the cushion fill, the frame — everything feels built to last. Already recommended to two friends.', product: 'Leather 3-Seater Sofa', verified: true, date: '2026-08-10' },
  { id: '5', name: 'Tom W.', rating: 4, text: 'Ordered the recliner pair for our cinema room. Silent motors, comfortable seats, USB charging is a nice touch. Slightly tighter than expected but very happy overall.', product: 'Velvet Recliner Pair', verified: true, date: '2026-08-05' },
  { id: '6', name: 'Sarah K.', rating: 5, text: 'Visited the Manchester showroom first — the team were incredibly helpful without being pushy. Went home, ordered online, and the sofa arrived 5 days later. Flawless experience.', product: 'Chesterfield 2-Seater Sofa', verified: true, date: '2026-07-30' },
  { id: '7', name: 'Michael B.', rating: 5, text: 'Third sofa we\'ve bought from Corner Sofa. Started with a 2-seater, then a corner, now a recliner pair for the bedroom. Consistent quality every time.', product: 'Fabric Recliner Pair', verified: true, date: '2026-07-22' },
  { id: '8', name: 'Rachel P.', rating: 4, text: 'The bouclé fabric is gorgeous — soft and textured. Looks stunning in our living room. Only wish there were more colour options for this material.', product: 'Bouclé 3-Seater Sofa', verified: true, date: '2026-07-15' },
  { id: '9', name: 'Andrew L.', rating: 5, text: 'Free room-of-choice delivery was brilliant. Two guys carried it up two flights of stairs and placed it perfectly. No damage to walls or the sofa. 10/10.', product: 'Velvet 3-Seater Sofa', verified: true, date: '2026-07-08' },
  { id: '10', name: 'Claire D.', rating: 5, text: 'The 10-year warranty gave us confidence to invest. We plan to keep this sofa for at least that long. The quality backs it up.', product: 'Leather Corner Sofa', verified: true, date: '2026-06-30' },
];

export default function ReviewsPage() {
  const [filter, setFilter] = useState<number | null>(null);

  const filtered = filter ? REVIEWS.filter((r) => r.rating === filter) : REVIEWS;
  const avgRating = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <main className="py-20 bg-primary">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light tracking-[0.2em] text-dark uppercase mb-3">Customer Reviews</h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Rating rating={parseFloat(avgRating)} />
            <span className="text-sm text-dark/60">{avgRating} out of 5</span>
          </div>
          <p className="text-xs text-dark/40">Based on {REVIEWS.length} verified reviews</p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-10">
          <button
            onClick={() => setFilter(null)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
              filter === null ? 'bg-accent text-primary' : 'bg-white text-dark border border-gray-200 hover:border-dark/20'
            }`}
          >
            All ({REVIEWS.length})
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setFilter(star)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                filter === star ? 'bg-accent text-primary' : 'bg-white text-dark border border-gray-200 hover:border-dark/20'
              }`}
            >
              {star}★ ({REVIEWS.filter((r) => r.rating === star).length})
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Rating rating={review.rating} />
                  </div>
                  <p className="text-sm font-medium text-dark">{review.name}</p>
                </div>
                {review.verified && <Badge variant="verified">Verified</Badge>}
              </div>
              <p className="text-sm text-dark/60 leading-relaxed mb-3">{review.text}</p>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-dark/40">{review.product}</p>
                <p className="text-[10px] text-dark/30">
                  {new Date(review.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-dark/50 mb-6">Have you bought from us? We&apos;d love to hear your experience.</p>
          <Button variant="contrast" size="lg" onClick={() => window.location.href = '/contact'}>
            Leave a Review
          </Button>
        </div>
      </div>
    </main>
  );
}
