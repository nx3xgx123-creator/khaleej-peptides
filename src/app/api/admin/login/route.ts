import { cookies } from "next/headers";
import { ADMIN_COOKIE, checkPassword, sessionToken } from "@/lib/adminAuth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { password } = (body ?? {}) as Record<string, unknown>;
  if (typeof password !== "string") {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }

  let ok: boolean;
  try {
    ok = checkPassword(password);
  } catch (err) {
    console.error("admin login failed", err);
    return Response.json({ error: "Admin login is not configured (ADMIN_PASSWORD missing)" }, { status: 500 });
  }
  if (!ok) {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ ok: true });
}
