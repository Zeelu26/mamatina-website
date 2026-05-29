"use client";

import { useEffect, useState } from "react";
import type { Review } from "@/lib/types";
import { Button, Field, Select, Card } from "../ui";

type Editable = Omit<Review, "id" | "date"> & { id?: string; date?: string };

const blank: Editable = {
  customerName: "",
  rating: 5,
  text: "",
  photoUrl: "",
  approved: true,
  featured: false,
};

export default function ReviewsManager({ initial }: { initial: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initial);
  const [editing, setEditing] = useState<Editable | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    setReviews(initial);
  }, [initial]);

  async function refetch() {
    const res = await fetch("/api/reviews/admin", { cache: "no-store" });
    const data = await res.json();
    setReviews(data.reviews);
  }

  async function update(id: string, patch: Partial<Review>) {
    await fetch("/api/reviews/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    await refetch();
  }

  async function remove(id: string) {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/admin?id=${id}`, { method: "DELETE" });
    await refetch();
  }

  const shown = reviews.filter((r) =>
    filter === "pending" ? !r.approved : filter === "approved" ? r.approved : true,
  );

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 luxe-card p-1">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-widest-2 transition ${
                filter === f
                  ? "bg-chocolate text-cream"
                  : "text-chocolate/65 hover:text-chocolate"
              }`}
            >
              {f}
              {f === "pending" && pendingCount > 0 && (
                <span className="ml-2 bg-gold text-soft-black rounded-full px-1.5 text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <Button onClick={() => setEditing(blank)}>+ New Review</Button>
      </div>

      {shown.length === 0 ? (
        <Card>
          <div className="text-chocolate/55 italic text-sm">No reviews here.</div>
        </Card>
      ) : (
        <ul className="grid gap-4">
          {shown.map((r) => (
            <li key={r.id} className="luxe-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-chocolate font-medium">{r.customerName}</div>
                    <div className="text-gold">{"★".repeat(r.rating)}<span className="text-gold/30">{"★".repeat(5 - r.rating)}</span></div>
                    {!r.approved && (
                      <span className="text-[10px] uppercase tracking-widest-2 bg-gold/15 text-gold-dark px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
                    {r.featured && (
                      <span className="text-[10px] uppercase tracking-widest-2 bg-chocolate/10 text-chocolate px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-chocolate/80 font-light leading-relaxed italic">
                    &ldquo;{r.text}&rdquo;
                  </p>
                  <div className="mt-2 text-[10px] uppercase tracking-widest-2 text-chocolate/45">
                    {new Date(r.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 flex-wrap">
                {!r.approved ? (
                  <Button onClick={() => update(r.id, { approved: true })}>
                    Approve
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => update(r.id, { approved: false })}
                  >
                    Unapprove
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => update(r.id, { featured: !r.featured })}
                >
                  {r.featured ? "Unfeature" : "Feature"}
                </Button>
                <Button variant="secondary" onClick={() => setEditing(r)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => remove(r.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <Editor
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            await refetch();
            setEditing(null);
          }}
        />
      )}
    </>
  );
}

function Editor({
  initial,
  onClose,
  onSaved,
}: {
  initial: Editable;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      id: initial.id,
      customerName: String(form.get("customerName") || ""),
      rating: Number(form.get("rating") || 5),
      text: String(form.get("text") || ""),
      photoUrl: String(form.get("photoUrl") || ""),
      approved: form.get("approved") === "on",
      featured: form.get("featured") === "on",
    };
    const res = await fetch("/api/reviews/admin", {
      method: initial.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) onSaved();
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-soft-black/60 backdrop-blur-sm">
      <div className="relative bg-cream w-full max-w-xl rounded-3xl overflow-hidden">
        <div className="px-7 py-5 border-b border-beige flex items-center justify-between">
          <h3 className="font-display text-xl text-chocolate">
            {initial.id ? "Edit review" : "New review"}
          </h3>
          <button onClick={onClose} className="h-9 w-9 rounded-full hover:bg-beige text-xl">
            ×
          </button>
        </div>
        <form onSubmit={onSubmit} className="px-7 py-6 grid gap-5 max-h-[75vh] overflow-y-auto">
          <Field label="Customer name" name="customerName" defaultValue={initial.customerName} required />
          <Select
            label="Rating"
            name="rating"
            defaultValue={String(initial.rating)}
            options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} stars` }))}
          />
          <Field label="Review text" name="text" defaultValue={initial.text} textarea rows={5} required />
          <Field label="Customer photo URL (optional)" name="photoUrl" defaultValue={initial.photoUrl || ""} />
          <div className="flex items-center gap-6">
            <label className="text-sm text-chocolate inline-flex items-center gap-2">
              <input type="checkbox" name="approved" defaultChecked={initial.approved} />
              Approved
            </label>
            <label className="text-sm text-chocolate inline-flex items-center gap-2">
              <input type="checkbox" name="featured" defaultChecked={initial.featured} />
              Featured
            </label>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
