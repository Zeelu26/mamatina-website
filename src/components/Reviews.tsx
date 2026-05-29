"use client";

import { useState } from "react";
import type { Review } from "@/lib/types";

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5 text-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? "" : "opacity-25"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews({ reviews }: { reviews: Review[] }) {
  const approved = reviews.filter((r) => r.approved);
  const featured = approved.filter((r) => r.featured);
  const shown = featured.length > 0 ? featured : approved.slice(0, 4);

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          customerName: form.get("name"),
          rating: Number(form.get("rating")),
          text: form.get("text"),
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to submit");
      setMsg("Thank you. Your review will appear once approved.");
      (e.currentTarget as HTMLFormElement).reset();
    } catch {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="reviews" className="relative py-28 md:py-36 bg-gradient-to-b from-cream to-sand">
      <div className="container-luxe">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="gold-divider" />
            <span className="eyebrow">Kind Words</span>
            <span className="gold-divider" />
          </div>
          <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-chocolate text-balance max-w-3xl">
            What our guests are saying.
          </h2>
        </div>

        {shown.length === 0 ? (
          <p className="text-center text-chocolate/60 italic">No reviews yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {shown.map((r) => (
              <article
                key={r.id}
                className="luxe-card p-8 md:p-10 hover:-translate-y-1"
              >
                <Stars value={r.rating} />
                <p className="mt-5 font-serif text-lg md:text-xl leading-relaxed text-chocolate italic">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="mt-7 flex items-center gap-3">
                  {r.photoUrl ? (
                    <img
                      src={r.photoUrl}
                      alt={r.customerName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gold/20 text-gold-dark flex items-center justify-center font-serif">
                      {r.customerName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-chocolate font-medium">{r.customerName}</div>
                    <div className="text-[10px] uppercase tracking-widest-2 text-chocolate/50">
                      {new Date(r.date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-14 text-center">
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs uppercase tracking-widest-2 text-chocolate/70 hover:text-gold-dark"
          >
            {open ? "Close" : "Share Your Experience"} →
          </button>
        </div>

        {open && (
          <form
            onSubmit={onSubmit}
            className="mt-8 max-w-xl mx-auto luxe-card p-8 md:p-10 grid gap-6"
          >
            <div>
              <label className="label-luxe">Your name</label>
              <input name="name" required className="input-luxe" />
            </div>
            <div>
              <label className="label-luxe">Rating</label>
              <select name="rating" required defaultValue="5" className="input-luxe bg-cream">
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} stars
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-luxe">Your review</label>
              <textarea name="text" required rows={4} className="input-luxe resize-none" />
            </div>
            <button disabled={submitting} className="btn-primary justify-self-start">
              {submitting ? "Sending…" : "Submit Review"}
            </button>
            {msg && (
              <p className="text-sm text-chocolate/70 italic">{msg}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
