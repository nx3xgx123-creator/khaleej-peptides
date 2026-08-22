import {
  closeIssue,
  createIssue,
  getFile,
  listIssuesByLabel,
  putFile,
  type GithubIssue,
} from "./githubContent";
import type { Review } from "./reviews";

const LABEL_PENDING = "review:pending";
const LABEL_APPROVED = "review:approved";
const LABEL_DECLINED = "review:declined";
const REVIEWS_PATH = "src/data/reviews.json";

export interface PendingReviewSubmission {
  name: string;
  rating: number;
  text: string;
  productId?: string;
}

export interface PendingReview extends PendingReviewSubmission {
  issueNumber: number;
  createdAt: string;
}

function issueBody(sub: PendingReviewSubmission): string {
  return [
    "Submitted via the website's Write a Review form.",
    "",
    "```json",
    JSON.stringify(sub, null, 2),
    "```",
  ].join("\n");
}

function parseIssue(issue: GithubIssue): PendingReview | null {
  const match = issue.body?.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    const sub = JSON.parse(match[1]) as PendingReviewSubmission;
    return { ...sub, issueNumber: issue.number, createdAt: issue.created_at };
  } catch {
    return null;
  }
}

export async function submitPendingReview(sub: PendingReviewSubmission): Promise<void> {
  await createIssue(`Review: ${sub.name}${sub.productId ? ` — ${sub.productId}` : ""}`, issueBody(sub), [
    LABEL_PENDING,
  ]);
}

export async function listPendingReviews(): Promise<PendingReview[]> {
  const issues = await listIssuesByLabel(LABEL_PENDING);
  return issues.map(parseIssue).filter((r): r is PendingReview => r !== null);
}

export async function declineReview(issueNumber: number): Promise<void> {
  await closeIssue(issueNumber, [LABEL_DECLINED]);
}

/** Approve: commit the (possibly edited) review into reviews.json, then close the issue. */
export async function approveReview(issueNumber: number, edited: PendingReviewSubmission): Promise<void> {
  const { content, sha } = await getFile(REVIEWS_PATH);
  const reviews = JSON.parse(content) as Review[];

  const nextNum = reviews.reduce((max, r) => {
    const n = parseInt(r.id.replace(/^r/, ""), 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0) + 1;

  const newReview: Review = {
    id: `r${nextNum}`,
    name: edited.name,
    text: edited.text,
    rating: edited.rating,
    ...(edited.productId ? { productIds: [edited.productId] } : {}),
  };

  reviews.push(newReview);
  await putFile(
    REVIEWS_PATH,
    JSON.stringify(reviews, null, 2) + "\n",
    sha,
    `Approve review from ${edited.name}`
  );
  await closeIssue(issueNumber, [LABEL_APPROVED]);
}
