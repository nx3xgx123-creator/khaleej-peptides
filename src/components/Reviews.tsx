import Link from "next/link";
import { REVIEWS } from "@/lib/reviews";
import WriteReview from "./WriteReview";
import ReviewCard, { Stars, formatReviewDate } from "./ReviewCard";
import Reveal from "./Reveal";
import { ArrowRight } from "./icons";

const HOMEPAGE_CAP = 8; // featured pull-quote + up to 7 notebook entries

export default function Reviews() {
  const newestFirst = [...REVIEWS].reverse();
  const [featured, ...rest] = newestFirst;
  if (!featured) return null;

  const shown = rest.slice(0, HOMEPAGE_CAP - 1);
  const hasMore = REVIEWS.length > HOMEPAGE_CAP;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow text-rosegold-deep">Field Notes &nbsp;/&nbsp; Verified Feedback</span>
            <h2 className="font-display mt-2 text-4xl text-ink sm:text-5xl">What Researchers Report</h2>
          </div>
          {hasMore && (
            <Link href="/reviews" className="mono text-xs uppercase tracking-[0.08em] text-ink underline underline-offset-4">
              View All {REVIEWS.length} Entries →
            </Link>
          )}
        </div>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Featured pull-quote — most recent */}
        <Reveal>
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-card bg-plum p-10 text-white sm:p-14">
            <span className="font-display pointer-events-none absolute -left-1 -top-6 text-[10rem] leading-none text-charcoal-soft">
              &ldquo;
            </span>
            <div className="relative">
              <span className="mono text-[0.68rem] uppercase tracking-[0.12em] text-rosegold">
                Entry / 001{featured.productIds?.[0] ? ` · ${featured.productIds[0]}` : ""}
              </span>
              <p className="font-display mt-5 text-3xl italic leading-snug sm:text-4xl">
                {featured.text}
              </p>
            </div>
            <div className="relative mt-10 flex items-center justify-between border-t border-charcoal-soft pt-5">
              <span className="mono text-[0.68rem] text-white/45">
                {featured.name}
                {formatReviewDate(featured.date) ? ` · ${formatReviewDate(featured.date)}` : ""}
              </span>
              <Stars rating={featured.rating} className="text-rosegold" />
            </div>
          </div>
        </Reveal>

        {/* Notebook-entry grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {shown.map((r, i) => (
            <Reveal key={r.id} delay={(i % 4) * 70}>
              <ReviewCard review={r} entryNumber={i + 2} tint={i % 3 === 0} />
            </Reveal>
          ))}

          <div className="col-span-full flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="mono text-[0.7rem] text-ink-soft">
              {REVIEWS.length} verified {REVIEWS.length === 1 ? "entry" : "entries"} on file
            </span>
            <div className="flex items-center gap-4">
              {hasMore && (
                <Link href="/reviews" className="mono flex items-center gap-1.5 text-xs uppercase tracking-[0.06em] text-ink-soft hover:text-ink">
                  View all
                  <ArrowRight width={12} height={12} />
                </Link>
              )}
              <WriteReview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
