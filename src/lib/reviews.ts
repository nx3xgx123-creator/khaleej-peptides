export interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  /** product id(s) this review is about, when identifiable from the review text */
  productIds?: string[];
}

export const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Verified Customer",
    text: "My wife and I have both had a great experience with the peptide — great quality, and we're taking it slow but really happy with it.",
    rating: 5,
  },
  {
    id: "r2",
    name: "Verified Customer",
    text: "This was my third order from them. The ordering process was smooth, communication was clear, and my package arrived as expected.",
    rating: 5,
  },
  {
    id: "r3",
    name: "Verified Customer",
    text: "I ordered GHK-Cu and had a positive experience overall. They replied to my questions quickly and kept me updated on the order.",
    rating: 5,
    productIds: ["ghk-cu", "ghk-cu-vial"],
  },
  {
    id: "r4",
    name: "Verified Customer",
    text: "Really happy with Khaleej Peptides' GLP3 — great quality and support throughout.",
    rating: 5,
    productIds: ["rt-10", "retatrutide-vial"],
  },
  {
    id: "r5",
    name: "Verified Customer",
    text: "I started taking the Wolverine Stack and have been really happy with the quality and support throughout.",
    rating: 5,
    productIds: ["wolverine", "wolverine-vial"],
  },
  {
    id: "r6",
    name: "Verified Customer",
    text: "I ordered KLOW and MOTS-C from Khaleej Peptides and had a very positive experience. Communication was quick, ordering was straightforward, and the package arrived on time.",
    rating: 5,
    productIds: ["klow", "klow-vial", "mots-c", "mots-c-vial"],
  },
  {
    id: "r7",
    name: "Verified Customer",
    text: "Really happy with my experience ordering Tesamorelin from Khaleej Peptides — the service was professional from start to finish.",
    rating: 5,
    productIds: ["tesamorelin", "tesamorelin-vial"],
  },
  {
    id: "r8",
    name: "Verified Customer",
    text: "Delivery of the Reta to Al Ain was next-day with proper cold handling.",
    rating: 5,
    productIds: ["rt-10", "retatrutide-vial"],
  },
];

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
