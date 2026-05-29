"use client";

import { useState, useRef } from "react";

export function PageHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <header className="mb-10">
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="font-display font-light text-3xl md:text-4xl text-chocolate mt-1">
        {title}
      </h1>
      {sub && <p className="text-chocolate/60 mt-2 max-w-2xl font-light">{sub}</p>}
      <div className="gold-line mt-6" />
    </header>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`luxe-card p-6 md:p-8 ${className}`}>{children}</div>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
  hint,
  textarea,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  textarea?: boolean;
  rows?: number;
}) {
  const cls =
    "w-full bg-cream/40 border border-beige rounded-lg px-4 py-3 text-sm text-chocolate placeholder:text-chocolate/35 focus:outline-none focus:border-gold focus:bg-cream/70 transition";
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest-2 text-chocolate/65 block mb-2">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className={`${cls} resize-none leading-relaxed`}
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          required={required}
          type={type}
          placeholder={placeholder}
          className={cls}
        />
      )}
      {hint && <span className="block text-[11px] text-chocolate/45 mt-1.5">{hint}</span>}
    </label>
  );
}

export function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest-2 text-chocolate/65 block mb-2">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full bg-cream/40 border border-beige rounded-lg px-4 py-3 text-sm text-chocolate focus:outline-none focus:border-gold transition"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <label className="flex items-start gap-4 cursor-pointer select-none">
      <input type="hidden" name={name} value={on ? "true" : "false"} />
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className={`h-7 w-12 rounded-full transition relative shrink-0 mt-0.5 ${
          on ? "bg-gold" : "bg-chocolate/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-cream shadow transition-transform ${
            on ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
      <span>
        <span className="block text-sm text-chocolate">{label}</span>
        {hint && <span className="block text-[11px] text-chocolate/55 mt-0.5">{hint}</span>}
      </span>
    </label>
  );
}

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  const cls =
    variant === "danger"
      ? "bg-red-900/80 hover:bg-red-900 text-cream"
      : variant === "secondary"
        ? "bg-cream border border-chocolate/20 hover:border-chocolate text-chocolate"
        : "bg-chocolate hover:bg-soft-black text-cream";
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] uppercase tracking-widest-2 transition disabled:opacity-50 ${cls} ${props.className || ""}`}
    >
      {children}
    </button>
  );
}

export function ImagePicker({
  name,
  current,
  label = "Image",
  hint,
}: {
  name: string;
  current?: string;
  label?: string;
  hint?: string;
}) {
  const [preview, setPreview] = useState<string>(current || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }
      const { url } = await res.json();
      setPreview(url);
    } catch (e: any) {
      setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="text-[11px] uppercase tracking-widest-2 text-chocolate/65 block mb-2">
        {label}
      </span>
      <input type="hidden" name={name} value={preview} />
      <div className="flex gap-4 items-start">
        <div className="h-28 w-28 rounded-xl overflow-hidden bg-cream border border-beige shrink-0">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full placeholder-art" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPick}
            className="block text-xs text-chocolate/70 file:mr-3 file:rounded-full file:border-0 file:bg-chocolate file:text-cream file:px-4 file:py-2 file:text-[11px] file:uppercase file:tracking-widest-2 hover:file:bg-soft-black"
          />
          {preview && (
            <button
              type="button"
              onClick={() => setPreview("")}
              className="text-[11px] uppercase tracking-widest-2 text-chocolate/55 hover:text-red-900 self-start"
            >
              Remove
            </button>
          )}
          {busy && <span className="text-xs text-chocolate/60">Uploading…</span>}
          {err && <span className="text-xs text-red-700">{err}</span>}
          {hint && !err && <span className="text-xs text-chocolate/45">{hint}</span>}
        </div>
      </div>
    </div>
  );
}

export function SaveBar({ busy, msg }: { busy?: boolean; msg?: string | null }) {
  return (
    <div className="mt-8 flex items-center gap-4">
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : "Save Changes"}
      </Button>
      {msg && <span className="text-sm text-chocolate/65 italic">{msg}</span>}
    </div>
  );
}
