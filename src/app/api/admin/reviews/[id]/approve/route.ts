import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { approveReview } from "@/lib/reviewQueue";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const store = await cookies();
  if (!isValidSession(store.get(ADMIN_COOKIE)?.value)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const issueNumber = Number(id);
  if (!Number.isInteger(issueNumber)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

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
    await approveReview(issueNumber, {
      name: name.trim(),
      rating,
      text: text.trim(),
      ...(typeof productId === "string" && productId ? { productId } : {}),
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("approveReview failed", err);
    return Response.json({ error: "Could not approve review" }, { status: 502 });
  }
}
