"use client";

import { useState } from "react";
import type { Product, Settings } from "@/lib/types";

export default function Contact({
  settings,
  products,
}: {
  settings: Settings;
  products: Product[];
}) {
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setMsg(null);
    try {
      const form = new FormData(e.currentTarget);
      // honeypot
      if (form.get("company")) throw new Error("spam");
      const payload = {
        name: form.get("name"),
        phone: form.get("phone"),
        email: form.get("email"),
        productInterest: form.get("productInterest"),
        quantity: form.get("quantity"),
        eventDate: form.get("eventDate"),
        message: form.get("message"),
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to send");
      setMsg("Thank you. We'll be in touch shortly.");
      (e.currentTarget as HTMLFormElement).reset();
    } catch {
      setMsg("Something went wrong. Please try again or call us directly.");
    } finally {
      setSending(false);
    }
  }

  const { business } = settings;
  const telHref = `tel:${business.phone.replace(/\s/g, "")}`;
  const mailHref = `mailto:${business.email}`;

  return (
    <section
      id="contact"
      className="relative py-28 md:py-36 bg-chocolate text-cream overflow-hidden"
    >
      <div className="absolute inset-0 grain" />
      <div className="container-luxe relative grid md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-5">
          <div className="flex items-center gap-4 mb-6">
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <span className="text-[11px] uppercase tracking-widest-2 text-gold">
              Inquire
            </span>
          </div>
          <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-cream leading-[1.05] text-balance">
            Tell us about
            <span className="italic block">your occasion.</span>
          </h2>
          <p className="mt-6 text-cream/70 font-light leading-loose max-w-md">
            Custom jars, catering, gifting, weddings, or simply a Tuesday that
            deserves something better. We'd love to hear from you.
          </p>

          <div className="mt-10 space-y-4">
            <a
              href={telHref}
              className="flex items-center gap-4 group"
            >
              <span className="h-12 w-12 rounded-full border border-cream/20 group-hover:border-gold flex items-center justify-center transition">
                ☎
              </span>
              <div>
                <div className="text-[10px] uppercase tracking-widest-2 text-cream/50">
                  Call
                </div>
                <div className="text-cream group-hover:text-gold transition font-serif text-lg">
                  {business.phone}
                </div>
              </div>
            </a>
            <a
              href={mailHref}
              className="flex items-center gap-4 group"
            >
              <span className="h-12 w-12 rounded-full border border-cream/20 group-hover:border-gold flex items-center justify-center transition">
                ✉
              </span>
              <div>
                <div className="text-[10px] uppercase tracking-widest-2 text-cream/50">
                  Email
                </div>
                <div className="text-cream group-hover:text-gold transition font-serif text-lg">
                  {business.email}
                </div>
              </div>
            </a>
            {business.address && (
              <div className="flex items-center gap-4">
                <span className="h-12 w-12 rounded-full border border-cream/20 flex items-center justify-center">
                  ⌖
                </span>
                <div>
                  <div className="text-[10px] uppercase tracking-widest-2 text-cream/50">
                    Visit
                  </div>
                  <div className="text-cream font-serif text-lg">
                    {business.address}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-7">
          <form onSubmit={onSubmit} className="grid gap-7">
            <input
              tabIndex={-1}
              name="company"
              autoComplete="off"
              className="hidden"
              aria-hidden
            />
            <div className="grid md:grid-cols-2 gap-7">
              <Field label="Name" name="name" required />
              <Field label="Phone" name="phone" type="tel" required />
            </div>
            <div className="grid md:grid-cols-2 gap-7">
              <Field label="Email" name="email" type="email" required />
              <div>
                <label className="text-[10px] uppercase tracking-widest-2 text-cream/55 block mb-2">
                  Flavor of interest
                </label>
                <select
                  name="productInterest"
                  className="w-full bg-transparent border-b border-cream/25 py-3 px-1 text-cream focus:outline-none focus:border-gold transition appearance-none"
                  defaultValue=""
                >
                  <option value="" className="bg-chocolate">
                    Choose a flavor…
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.name} className="bg-chocolate">
                      {p.name}
                    </option>
                  ))}
                  <option value="Custom" className="bg-chocolate">
                    Custom / Catering
                  </option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-7">
              <Field label="Quantity" name="quantity" placeholder="6 jars, 12 jars…" />
              <Field label="Event date (optional)" name="eventDate" type="date" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest-2 text-cream/55 block mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                required
                className="w-full bg-transparent border-b border-cream/25 py-3 px-1 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold transition resize-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button disabled={sending} className="btn-gold">
                {sending ? "Sending…" : "Send Inquiry"}
              </button>
              {msg && (
                <span className="text-sm text-cream/70 italic">{msg}</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest-2 text-cream/55 block mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-cream/25 py-3 px-1 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold transition"
      />
    </div>
  );
}
