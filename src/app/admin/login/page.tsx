"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password.");
        return;
      }
      router.push("/admin/reviews");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="font-display text-2xl font-medium text-plum-deep">Admin Sign In</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-rosegold"
        />
        {error && <p className="text-xs text-rosegold-deep">{error}</p>}
        <button type="submit" disabled={loading || !password} className="btn-primary w-full text-sm disabled:opacity-50">
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
