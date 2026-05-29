"use client";

import { useEffect, useRef, useState } from "react";

type Photo = { id: string; url: string; alt: string; caption?: string; order: number };

export default function PhotoManager({
  resource,
  initial,
  hint,
}: {
  resource: "hero" | "gallery";
  initial: Photo[];
  hint?: string;
}) {
  const [photos, setPhotos] = useState<Photo[]>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotos([...initial].sort((a, b) => a.order - b.order));
  }, [initial]);

  async function refetch() {
    const res = await fetch(`/api/${resource}/photos`, { cache: "no-store" });
    const data = await res.json();
    setPhotos(data.photos);
  }

  async function onUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr(null);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const upRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (!upRes.ok) {
          const data = await upRes.json().catch(() => ({}));
          throw new Error(data.error || "Upload failed");
        }
        const { url } = await upRes.json();
        await fetch(`/api/${resource}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, alt: file.name }),
        });
      }
      await refetch();
    } catch (e: any) {
      setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this photo?")) return;
    await fetch(`/api/${resource}/photos?id=${id}`, { method: "DELETE" });
    await refetch();
  }

  async function move(id: string, direction: -1 | 1) {
    const i = photos.findIndex((p) => p.id === id);
    const j = i + direction;
    if (j < 0 || j >= photos.length) return;
    const next = [...photos];
    [next[i], next[j]] = [next[j], next[i]];
    setPhotos(next);
    await fetch(`/api/${resource}/photos`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((p) => p.id) }),
    });
  }

  async function updateCaption(id: string, caption: string) {
    await fetch(`/api/${resource}/photos`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, caption }),
    });
  }

  return (
    <div>
      <div className="luxe-card p-6 md:p-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-xl text-chocolate">Upload Photos</div>
            <div className="text-xs text-chocolate/55 mt-1">
              {hint || "JPG, PNG, or WebP. Up to 8 MB each."}
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onUpload(e.target.files)}
            className="block text-xs text-chocolate/70 file:mr-3 file:rounded-full file:border-0 file:bg-chocolate file:text-cream file:px-5 file:py-2.5 file:text-[11px] file:uppercase file:tracking-widest-2 hover:file:bg-soft-black"
          />
        </div>
        {busy && <div className="text-xs text-chocolate/60 mt-3">Uploading…</div>}
        {err && <div className="text-xs text-red-700 mt-3">{err}</div>}
      </div>

      {photos.length === 0 ? (
        <div className="luxe-card p-10 text-center text-chocolate/55 italic">
          No photos yet. Upload your first above.
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((p, i) => (
            <li key={p.id} className="luxe-card overflow-hidden">
              <div className="relative aspect-[4/3] bg-beige">
                <img src={p.url} alt={p.alt} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <input
                  defaultValue={p.caption || ""}
                  onBlur={(e) => updateCaption(p.id, e.target.value)}
                  placeholder="Caption (optional)"
                  className="w-full bg-cream/40 border border-beige rounded-lg px-3 py-2 text-xs text-chocolate placeholder:text-chocolate/35 focus:outline-none focus:border-gold"
                />
                <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest-2 text-chocolate/55">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => move(p.id, -1)}
                      disabled={i === 0}
                      className="px-2 py-1 hover:text-chocolate disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(p.id, 1)}
                      disabled={i === photos.length - 1}
                      className="px-2 py-1 hover:text-chocolate disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    onClick={() => remove(p.id)}
                    className="hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
