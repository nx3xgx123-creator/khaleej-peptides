import { StarIcon, UserIcon, CheckIcon } from "./icons";
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

export function formatReviewDate(date?: string): string | null {
  if (!date) return null;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(parsed);
}

/** One "notebook entry" style review card. */
export default function ReviewCard({ review, entryNumber, tint }: { review: Review; entryNumber: number; tint?: boolean }) {
  const formattedDate = formatReviewDate(review.date);
  return (
    <div className={`h-full rounded-card border border-line p-5 ${tint ? "bg-blush-deep/60" : "bg-white"}`}>
      <div className="flex items-center justify-between">
        <span className="mono text-[0.6rem] uppercase tracking-[0.08em] text-rosegold-deep">
          Entry / {String(entryNumber).padStart(3, "0")}
        </span>
        <Stars rating={review.rating} className="text-rosegold-deep" />
      </div>
      <p className="mt-3 text-[0.83rem] leading-relaxed text-ink">{review.text}</p>
      <div className="mono mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[0.62rem] text-ink-soft">
        <span className="flex items-center gap-1.5">
          <UserIcon width={12} height={12} />
          {review.name}
          <span className="flex items-center gap-0.5 text-instock">
            <CheckIcon width={10} height={10} />
            Verified Buyer
          </span>
        </span>
        {formattedDate && <span>{formattedDate}</span>}
      </div>
    </div>
  );
}
