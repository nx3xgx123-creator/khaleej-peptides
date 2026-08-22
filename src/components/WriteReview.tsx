"use client";

import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { CheckIcon, CloseIcon, StarIcon } from "./icons";

function buildReviewWhatsAppUrl(name: string, rating: number, text: string, productName?: string) {
  const lines = [
    "Hi Khaleej Peptides! I'd like to leave a review:",
    "",
    ...(productName ? [`Product: ${productName}`] : []),
    `Rating: ${rating}/5`,
    `Name: ${name.trim()}`,
    "",
    text.trim(),
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export default function WriteReview({ productId, productName }: { productId?: string; productName?: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const canSubmit = name.trim().length > 0 && rating > 0 && text.trim().length > 0;

  function reset() {
    setName("");
    setRating(0);
    setHoverRating(0);
    setText("");
    setStatus("idle");
  }

  async function submit() {
    if (!canSubmit) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, text, productId }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function close() {
    setOpen(false);
    reset();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-ghost text-sm">
        Write a Review
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Write a review"
        >
          <div
            className="absolute inset-0 bg-plum-ink/40"
            style={{ animation: "scrim-in 0.25s ease both" }}
            onClick={close}
          />
          <div
            className="surface-card relative w-full max-w-md p-6"
            style={{ animation: "pop-in 0.2s ease both" }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-medium text-plum-deep">
                {productName ? `Review ${productName}` : "Write a Review"}
              </h2>
              <button
                onClick={close}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-blush"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            {status === "sent" ? (
              <div className="py-4 text-center">
                <p className="text-sm text-ink">Thanks! Your review is in for a quick check before it goes live.</p>
                <button onClick={close} className="btn-ghost mt-4 text-sm">
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-plum-deep">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const value = i + 1;
                      const filled = value <= (hoverRating || rating);
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          onMouseEnter={() => setHoverRating(value)}
                          onMouseLeave={() => setHoverRating(0)}
                          className={filled ? "text-rosegold-deep" : "text-line"}
                          aria-label={`${value} star${value > 1 ? "s" : ""}`}
                        >
                          <StarIcon width={26} height={26} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="review-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-plum-deep">
                    Your Name
                  </label>
                  <input
                    id="review-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ahmed"
                    className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-rosegold"
                  />
                </div>

                <div>
                  <label htmlFor="review-text" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-plum-deep">
                    Your Review
                  </label>
                  <textarea
                    id="review-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    placeholder="Tell us about your ordering experience..."
                    className="w-full resize-none rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-rosegold"
                  />
                </div>

                <p className="text-[0.7rem] leading-relaxed text-ink-soft">
                  Reviews are checked before they&apos;re published on the site.
                </p>

                {status === "error" && (
                  <p className="text-xs text-rosegold-deep">
                    Couldn&apos;t submit that —{" "}
                    <a
                      className="underline"
                      href={buildReviewWhatsAppUrl(name, rating, text, productName)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      send it to us on WhatsApp
                    </a>{" "}
                    instead.
                  </p>
                )}

                <button
                  onClick={submit}
                  disabled={!canSubmit || status === "sending"}
                  className="btn-primary flex w-full items-center justify-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckIcon width={18} height={18} />
                  {status === "sending" ? "Submitting…" : "Submit Review"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
