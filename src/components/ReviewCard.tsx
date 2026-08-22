import { StarIcon, UserIcon } from "./icons";
import type { Review } from "@/lib/reviews";

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} width={13} height={13} className={i < rating ? "" : "opacity-30"} />
      ))}
    </div>
  );
}

/** One "notebook entry" style review card. */
export default function ReviewCard({ review, entryNumber, tint }: { review: Review; entryNumber: number; tint?: boolean }) {
  return (
    <div className={`h-full rounded-card border border-line p-5 ${tint ? "bg-blush-deep/60" : "bg-white"}`}>
      <div className="flex items-center justify-between">
        <span className="mono text-[0.6rem] uppercase tracking-[0.08em] text-rosegold-deep">
          Entry / {String(entryNumber).padStart(3, "0")}
        </span>
        <Stars rating={review.rating} className="text-rosegold-deep" />
      </div>
      <p className="mt-3 text-[0.83rem] leading-relaxed text-ink">{review.text}</p>
      <div className="mono mt-4 flex items-center gap-1.5 text-[0.62rem] text-ink-soft">
        <UserIcon width={12} height={12} />
        {review.name}
      </div>
    </div>
  );
}
