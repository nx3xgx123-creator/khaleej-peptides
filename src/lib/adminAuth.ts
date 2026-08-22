import { createHash, timingSafeEqual } from "crypto";

// Lightweight password gate for /admin — not full auth (no users/roles), but
// enough to keep the review queue private. Requires ADMIN_PASSWORD env var.

export const ADMIN_COOKIE = "kp_admin";

function requiredPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD is not configured");
  return password;
}

export function checkPassword(candidate: string): boolean {
  const expected = Buffer.from(requiredPassword());
  const actual = Buffer.from(candidate);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

/** Cookie value set on a successful login — a hash of the password, never the password itself. */
export function sessionToken(): string {
  return createHash("sha256").update(requiredPassword()).digest("hex");
}

export function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  try {
    const expected = Buffer.from(sessionToken());
    const actual = Buffer.from(cookieValue);
    if (expected.length !== actual.length) return false;
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}
