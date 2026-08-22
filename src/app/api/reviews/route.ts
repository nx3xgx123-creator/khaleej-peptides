import { submitPendingReview } from "@/lib/reviewQueue";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, rating, text, productId } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof text !== "string" ||
    !text.trim() ||
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return Response.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  try {
    await submitPendingReview({
      name: name.trim().slice(0, 100),
      rating,
      text: text.trim().slice(0, 2000),
      ...(typeof productId === "string" && productId ? { productId } : {}),
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("submitPendingReview failed", err);
    return Response.json({ error: "Could not submit review right now" }, { status: 502 });
  }
}
