"use client";

import { useState } from "react";
import { StarIcon } from "../icons";
import type { PendingReview } from "@/lib/reviewQueue";

interface Props {
  initialReviews: PendingReview[];
  products: { id: string; name: string }[];
}

export default function PendingReviewsList({ initialReviews, products }: Props) {
  const [reviews, setReviews] = useState(initialReviews);

  function remove(issueNumber: number) {
    setReviews((rs) => rs.filter((r) => r.issueNumber !== issueNumber));
  }

  if (reviews.length === 0) {
    return <p className="text-sm text-ink-soft">No pending reviews right now.</p>;
  }

  return (
    <ul className="space-y-4">
      {reviews.map((r) => (
        <PendingReviewCard key={r.issueNumber} review={r} products={products} onDone={() => remove(r.issueNumber)} />
      ))}
    </ul>
  );
}

function PendingReviewCard({
  review,
  products,
  onDone,
}: {
  review: PendingReview;
  products: { id: string; name: string }[];
  onDone: () => void;
}) {
  const [name, setName] = useState(review.name);
  const [rating, setRating] = useState(review.rating);
  const [text, setText] = useState(review.text);
  const [productId, setProductId] = useState(review.productId ?? "");
  const [busy, setBusy] = useState<"approve" | "decline" | null>(null);
  const [error, setError] = useState("");

  async function approve() {
    setBusy("approve");
    setError("");
    try {
      const res = await fetch(`/api/admin/reviews/${review.issueNumber}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, text, productId: productId || undefined }),
      });
      if (!res.ok) throw new Error();
      onDone();
    } catch {
      setError("Could not approve. Try again.");
    } finally {
      setBusy(null);
    }
  }

  async function decline() {
    setBusy("decline");
    setError("");
    try {
      const res = await fetch(`/api/admin/reviews/${review.issueNumber}/decline`, { method: "POST" });
      if (!res.ok) throw new Error();
      onDone();
    } catch {
      setError("Could not decline. Try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <li className="surface-card space-y-3 p-5">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i + 1)}
            className={i < rating ? "text-rosegold-deep" : "text-line"}
          >
            <StarIcon width={18} height={18} />
          </button>
        ))}
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-rosegold"
        placeholder="Name"
      />

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full resize-none rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-rosegold"
      />

      <select
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-rosegold"
      >
        <option value="">No specific product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.id})
          </option>
        ))}
      </select>

      <p className="text-[0.68rem] text-ink-soft">
        Submitted {new Date(review.createdAt).toLocaleString()} · Issue #{review.issueNumber}
      </p>

      {error && <p className="text-xs text-rosegold-deep">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button onClick={approve} disabled={busy !== null} className="btn-primary flex-1 text-xs disabled:opacity-50">
          {busy === "approve" ? "Approving…" : "Approve"}
        </button>
        <button onClick={decline} disabled={busy !== null} className="btn-ghost flex-1 text-xs disabled:opacity-50">
          {busy === "decline" ? "Declining…" : "Decline"}
        </button>
      </div>
    </li>
  );
}
