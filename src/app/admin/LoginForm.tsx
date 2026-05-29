"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data.error || "Invalid credentials.");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setErr("Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <div>
        <label className="label-luxe">Email</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="input-luxe"
        />
      </div>
      <div>
        <label className="label-luxe">Password</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="input-luxe"
        />
      </div>
      {err && (
        <div className="text-sm text-red-700/80 italic">{err}</div>
      )}
      <button disabled={busy} className="btn-primary mt-2">
        {busy ? "Signing in…" : "Sign In"}
      </button>
      <p className="mt-4 text-[11px] uppercase tracking-widest-2 text-chocolate/40 text-center">
        Default · admin@mamatina.com / mamatina2026
      </p>
    </form>
  );
}
