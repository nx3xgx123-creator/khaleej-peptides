"use client";

import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { CloseIcon, StarIcon, WhatsAppIcon } from "./icons";

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

export default function WriteReview({ productName }: { productName?: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");

  const canSubmit = name.trim().length > 0 && rating > 0 && text.trim().length > 0;

  function reset() {
    setName("");
    setRating(0);
    setHoverRating(0);
    setText("");
  }

  function submit() {
    if (!canSubmit) return;
    const url = buildReviewWhatsAppUrl(name, rating, text, productName);
    window.open(url, "_blank");
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
            onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-blush"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

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
                Reviews are sent to us via WhatsApp and published on the site after a quick check.
              </p>

              <button
                onClick={submit}
                disabled={!canSubmit}
                className="btn-primary flex w-full items-center justify-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <WhatsAppIcon width={18} height={18} />
                Send Review on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
