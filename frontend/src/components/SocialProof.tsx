import Link from 'next/link';
import { Card, Rating, Badge } from './ui';

interface CustomerReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  title: string;
  review: string;
  image?: string;
  date: string;
  verified: boolean;
}

interface SocialProofProps {
  reviews: CustomerReview[];
  showCount?: number;
}

export default function SocialProof({
  reviews,
  showCount = 6,
}: SocialProofProps) {
  const displayedReviews = reviews.slice(0, showCount);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-light tracking-[0.2em] text-dark uppercase mb-3">
            Sofas in Real Life
          </h2>
          <p className="text-sm tracking-widest text-dark/60 uppercase font-medium">
            See how our sofas look in real homes across the UK
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedReviews.map((review) => (
            <Card key={review.id} hover padding="lg">
              <Rating rating={review.rating} size="sm" />
              <h3 className="text-base font-medium text-dark mt-4 mb-2">
                {review.title}
              </h3>
              <p className="text-sm text-dark/60 mb-4 line-clamp-3 leading-relaxed">
                {review.review}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <img
                    src={review.image || '/placeholder.svg'}
                    alt={review.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-sm text-dark font-medium block">
                      {review.name}
                    </span>
                    <span className="text-xs text-dark/50">{review.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-dark/50 block">{review.date}</span>
                  {review.verified && (
                    <Badge variant="verified">Verified Purchase</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {reviews.length > showCount && (
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <Link href="/reviews" className="text-accent text-sm font-medium hover:underline tracking-wide">
              See all {reviews.length} reviews →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
