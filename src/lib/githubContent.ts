import { GITHUB_BRANCH, GITHUB_OWNER, GITHUB_REPO } from "./constants";

// Server-only. Backs the review moderation queue: pending submissions live as
// GitHub Issues, and approving one commits the review straight into
// src/data/reviews.json via the Contents API. Requires a repo-scoped
// GITHUB_TOKEN env var (never exposed to the client).

const API = "https://api.github.com";

function authHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not configured");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function gh(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API ${path} -> ${res.status}: ${body}`);
  }
  return res.json();
}

export interface GithubIssue {
  number: number;
  title: string;
  body: string | null;
  labels: { name: string }[];
  created_at: string;
}

export async function createIssue(title: string, body: string, labels: string[]): Promise<GithubIssue> {
  return gh(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({ title, body, labels }),
  });
}

export async function listIssuesByLabel(label: string): Promise<GithubIssue[]> {
  return gh(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=${encodeURIComponent(label)}&state=open&per_page=100`
  );
}

export async function getIssue(number: number): Promise<GithubIssue> {
  return gh(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${number}`);
}

export async function closeIssue(number: number, labels: string[]): Promise<void> {
  await gh(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${number}`, {
    method: "PATCH",
    body: JSON.stringify({ state: "closed", labels }),
  });
}

/** Fetch a repo file's decoded text content + blob sha (needed to update it). */
export async function getFile(path: string): Promise<{ content: string; sha: string }> {
  const res = await gh(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`
  );
  return { content: Buffer.from(res.content, "base64").toString("utf-8"), sha: res.sha };
}

/** Commit new content to a repo file. */
export async function putFile(path: string, content: string, sha: string, message: string): Promise<void> {
  await gh(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      sha,
      branch: GITHUB_BRANCH,
    }),
  });
}
