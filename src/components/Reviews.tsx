import { REVIEWS } from "@/lib/reviews";
import { StarIcon, UserIcon } from "./icons";
import WriteReview from "./WriteReview";
import Reveal from "./Reveal";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-rosegold-deep">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} width={14} height={14} className={i < rating ? "" : "text-line"} />
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="text-center">
          <div className="lux-rule mb-4">
            <span className="eyebrow text-rosegold-deep">Customer Reviews</span>
          </div>
          <h2 className="font-display text-4xl font-medium text-plum-deep sm:text-5xl">
            What Researchers Are Saying
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-ink-soft">
            Feedback from customers on ordering, communication, and delivery.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {REVIEWS.map((r, i) => (
          <Reveal key={r.id} delay={(i % 4) * 80}>
            <div className="surface-card flex flex-col gap-3 p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(35,43,61,0.3)]">
              <Stars rating={r.rating} />
              <p className="flex-1 text-sm leading-relaxed text-ink-soft">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center gap-2 pt-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush text-rosegold-deep">
                  <UserIcon width={16} height={16} />
                </span>
                <span className="text-sm font-semibold text-ink">{r.name}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-10 text-center">
          <WriteReview />
        </div>
      </Reveal>
    </section>
  );
}
