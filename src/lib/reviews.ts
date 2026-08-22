import reviewsData from "@/data/reviews.json";

export interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  /** ISO date (YYYY-MM-DD) the review went live */
  date?: string;
  /** product id(s) this review is about, when identifiable from the review text */
  productIds?: string[];
}

// Published, live reviews. New entries land here only via an approved
// pending-review issue (see src/lib/reviewQueue.ts) — never edited by hand
// mid-flight, so the admin approve action's read-modify-write against
// GitHub stays predictable.
export const REVIEWS: Review[] = reviewsData as Review[];

/** Real reviews that mention a given product, by id. */
export function reviewsForProduct(productId: string): Review[] {
  return REVIEWS.filter((r) => r.productIds?.includes(productId));
}

/** Average rating + count for a product, or null if it has no reviews yet. */
export function ratingForProduct(productId: string): { average: number; count: number } | null {
  const matches = reviewsForProduct(productId);
  if (matches.length === 0) return null;
  const average = matches.reduce((sum, r) => sum + r.rating, 0) / matches.length;
  return { average, count: matches.length };
}
