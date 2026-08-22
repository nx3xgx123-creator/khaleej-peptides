// Server-safe constants (no "use client" — importable from server & client components)

export const WHATSAPP_NUMBER = "971544952206";
export const WHATSAPP_DISPLAY = "+971 54 495 2206";

// Repo that backs the review moderation queue (GitHub Issues as the pending
// store, reviews.json as the published store). Not a secret — just identifies
// where GITHUB_TOKEN (a server-only env var) is allowed to write.
export const GITHUB_OWNER = "nx3xgx123-creator";
export const GITHUB_REPO = "khaleej-peptides";
export const GITHUB_BRANCH = "main";
