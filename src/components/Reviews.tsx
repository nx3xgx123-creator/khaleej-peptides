import { REVIEWS } from "@/lib/reviews";
import { StarIcon, UserIcon } from "./icons";
import WriteReview from "./WriteReview";
import Reveal from "./Reveal";

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} width={13} height={13} className={i < rating ? "" : "opacity-30"} />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [featured, ...rest] = REVIEWS;
  if (!featured) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <span className="eyebrow text-rosegold-deep">Field Notes &nbsp;/&nbsp; Verified Feedback</span>
        <h2 className="font-display mt-2 text-4xl text-ink sm:text-5xl">What Researchers Report</h2>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Featured pull-quote */}
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
              <span className="mono text-[0.68rem] text-white/45">{featured.name}</span>
              <Stars rating={featured.rating} className="mono text-rosegold" />
            </div>
          </div>
        </Reveal>

        {/* Notebook-entry grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {rest.map((r, i) => (
            <Reveal key={r.id} delay={(i % 4) * 70}>
              <div className={`h-full rounded-card border border-line p-5 ${i % 3 === 0 ? "bg-blush-deep/60" : "bg-white"}`}>
                <div className="flex items-center justify-between">
                  <span className="mono text-[0.6rem] uppercase tracking-[0.08em] text-rosegold-deep">
                    Entry / {String(i + 2).padStart(3, "0")}
                  </span>
                  <Stars rating={r.rating} className="text-rosegold-deep" />
                </div>
                <p className="mt-3 text-[0.83rem] leading-relaxed text-ink">{r.text}</p>
                <div className="mono mt-4 flex items-center gap-1.5 text-[0.62rem] text-ink-soft">
                  <UserIcon width={12} height={12} />
                  {r.name}
                </div>
              </div>
            </Reveal>
          ))}

          <div className="col-span-full flex items-center justify-between pt-2">
            <span className="mono text-[0.7rem] text-ink-soft">
              {REVIEWS.length} verified {REVIEWS.length === 1 ? "entry" : "entries"} on file
            </span>
            <WriteReview />
          </div>
        </div>
      </div>
    </section>
  );
}
