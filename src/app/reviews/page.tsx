import type { Metadata } from "next";
import { REVIEWS } from "@/lib/reviews";
import ReviewCard from "@/components/ReviewCard";
import WriteReview from "@/components/WriteReview";

export const metadata: Metadata = {
  title: "Customer Reviews | Khaleej Peptides",
  description: "Verified customer feedback on ordering, communication, and delivery from Khaleej Peptides.",
};

export default function ReviewsPage() {
  const newestFirst = [...REVIEWS].reverse();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="eyebrow text-rosegold-deep">Field Notes &nbsp;/&nbsp; Verified Feedback</span>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-5xl text-ink sm:text-6xl">All Reviews</h1>
        <WriteReview />
      </div>
      <p className="mono mt-3 text-xs uppercase tracking-[0.08em] text-ink-soft">
        {REVIEWS.length} verified {REVIEWS.length === 1 ? "entry" : "entries"} on file
      </p>

      {newestFirst.length === 0 ? (
        <p className="surface-card mt-10 p-10 text-center text-sm text-ink-soft">No reviews yet.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {newestFirst.map((r, i) => (
            <ReviewCard key={r.id} review={r} entryNumber={i + 1} tint={i % 3 === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
