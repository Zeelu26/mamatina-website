"use client";

import { useState } from "react";

export default function Newsletter() {
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setMsg(null);
    const form = new FormData(e.currentTarget);
    if (form.get("company")) return;
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email: form.get("email") }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("err");
      setMsg("You're on the list. Thank you.");
      (e.currentTarget as HTMLFormElement).reset();
    } catch {
      setMsg("Something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="relative py-24 md:py-32 bg-cream">
      <div className="container-luxe">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="gold-divider" />
            <span className="eyebrow">Stay In Touch</span>
            <span className="gold-divider" />
          </div>
          <h3 className="font-display font-light text-3xl md:text-4xl lg:text-5xl text-chocolate text-balance">
            New flavors, small drops, quiet things.
          </h3>
          <p className="mt-5 text-chocolate/65 font-light max-w-xl mx-auto">
            One thoughtful note a month. Never more, never less.
          </p>
          <form
            onSubmit={onSubmit}
            className="mt-9 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              tabIndex={-1}
              name="company"
              autoComplete="off"
              className="hidden"
              aria-hidden
            />
            <input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className="flex-1 bg-soft-white border border-beige rounded-full px-6 py-3.5 text-sm text-chocolate placeholder:text-chocolate/40 focus:outline-none focus:border-gold transition"
            />
            <button disabled={sending} className="btn-primary !px-6">
              {sending ? "…" : "Subscribe"}
            </button>
          </form>
          {msg && (
            <p className="mt-4 text-sm text-chocolate/60 italic">{msg}</p>
          )}
        </div>
      </div>
    </section>
  );
}
