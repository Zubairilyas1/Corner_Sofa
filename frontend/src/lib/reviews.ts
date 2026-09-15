export interface CustomerReview {
  id: string;
  product_id: string;
  product_title: string;
  name: string;
  rating: number;
  text: string;
  photos: string[];
  created_at: string;
}
export type ReviewSummary = Record<string, { count: number; average: number }>;
export function summarizeReviews(reviews: Pick<CustomerReview, 'product_id' | 'rating'>[]): ReviewSummary {
  const result: ReviewSummary = {};
  for (const review of reviews) {
    const item = result[review.product_id] ||= { count: 0, average: 0 };
    item.count++;
    item.average += review.rating;
  }
  for (const item of Object.values(result)) item.average /= item.count;
  return result;
}
export function validateReviewFields(fields: { name: unknown; text: unknown; rating: unknown; product_id: unknown }) {
  const name = typeof fields.name === 'string' ? fields.name.trim() : '';
  const text = typeof fields.text === 'string' ? fields.text.trim() : '';
  const product_id = typeof fields.product_id === 'string' ? fields.product_id.trim() : '';
  const rating = Number(fields.rating);
  if (!name || name.length > 80) throw new Error('Enter your name (up to 80 characters).');
  if (text.length < 5 || text.length > 2000) throw new Error('Write a review between 5 and 2,000 characters.');
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error('Choose a rating from 1 to 5 stars.');
  if (!product_id || product_id.length > 100) throw new Error('Choose your sofa.');
  return { name, text, rating, product_id };
}
