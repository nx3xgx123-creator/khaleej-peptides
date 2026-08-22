import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { declineReview } from "@/lib/reviewQueue";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const store = await cookies();
  if (!isValidSession(store.get(ADMIN_COOKIE)?.value)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const issueNumber = Number(id);
  if (!Number.isInteger(issueNumber)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await declineReview(issueNumber);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("declineReview failed", err);
    return Response.json({ error: "Could not decline review" }, { status: 502 });
  }
}
