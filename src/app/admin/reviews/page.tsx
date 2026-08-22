import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidSession } from "@/lib/adminAuth";
import { listPendingReviews } from "@/lib/reviewQueue";
import { PRODUCTS } from "@/lib/products";
import PendingReviewsList from "@/components/admin/PendingReviewsList";
import SignOutButton from "@/components/admin/SignOutButton";

export default async function AdminReviewsPage() {
  const store = await cookies();
  if (!isValidSession(store.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  let pending: Awaited<ReturnType<typeof listPendingReviews>> = [];
  let loadError = false;
  try {
    pending = await listPendingReviews();
  } catch (err) {
    console.error("listPendingReviews failed", err);
    loadError = true;
  }

  const productOptions = PRODUCTS.map((p) => ({ id: p.id, name: p.name }));

  return (
    <div className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-plum-deep">Pending Reviews</h1>
        <SignOutButton />
      </div>

      {loadError ? (
        <p className="text-sm text-rosegold-deep">
          Could not load pending reviews — check GITHUB_TOKEN is configured.
        </p>
      ) : (
        <PendingReviewsList initialReviews={pending} products={productOptions} />
      )}
    </div>
  );
}
