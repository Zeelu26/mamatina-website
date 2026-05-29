"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { Button, Field, Select, Toggle, ImagePicker, Card } from "../ui";

type Editable = Omit<Product, "id" | "createdAt" | "order"> & {
  id?: string;
  order?: number;
};

const blank: Editable = {
  name: "",
  price: "",
  shortDescription: "",
  fullDescription: "",
  ingredients: "",
  allergens: "",
  imageUrl: "",
  availability: "available",
  featured: false,
};

export default function ProductsManager({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState<Product[]>(
    [...initial].sort((a, b) => a.order - b.order),
  );
  const [editing, setEditing] = useState<Editable | null>(null);

  async function refetch() {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = await res.json();
    setProducts(data.products);
  }

  useEffect(() => {
    setProducts([...initial].sort((a, b) => a.order - b.order));
  }, [initial]);

  async function move(id: string, direction: -1 | 1) {
    const i = products.findIndex((p) => p.id === id);
    const j = i + direction;
    if (j < 0 || j >= products.length) return;
    const next = [...products];
    [next[i], next[j]] = [next[j], next[i]];
    setProducts(next);
    await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((p) => p.id) }),
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    await refetch();
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-chocolate/65">
          {products.length} product{products.length === 1 ? "" : "s"}
        </div>
        <Button onClick={() => setEditing(blank)}>+ New Product</Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <div className="text-chocolate/55 italic text-sm">No products yet.</div>
        </Card>
      ) : (
        <ul className="grid gap-4">
          {products.map((p, i) => (
            <li
              key={p.id}
              className="luxe-card p-5 flex flex-col md:flex-row md:items-center gap-5"
            >
              <div className="h-20 w-20 rounded-xl overflow-hidden bg-beige shrink-0">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full placeholder-art" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3">
                  <div className="font-serif text-lg text-chocolate truncate">{p.name}</div>
                  <div className="text-gold-dark text-sm">{p.price}</div>
                  {p.featured && (
                    <span className="text-[9px] uppercase tracking-widest-2 bg-gold/15 text-gold-dark px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                  <span
                    className={`text-[9px] uppercase tracking-widest-2 px-2 py-0.5 rounded-full ${
                      p.availability === "available"
                        ? "bg-green-900/10 text-green-900/80"
                        : p.availability === "sold-out"
                          ? "bg-chocolate/15 text-chocolate"
                          : "bg-gold/15 text-gold-dark"
                    }`}
                  >
                    {p.availability.replace("-", " ")}
                  </span>
                </div>
                <div className="text-xs text-chocolate/60 truncate mt-1">
                  {p.shortDescription}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => move(p.id, -1)}
                  disabled={i === 0}
                  className="px-2 py-1 text-chocolate/55 hover:text-chocolate disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(p.id, 1)}
                  disabled={i === products.length - 1}
                  className="px-2 py-1 text-chocolate/55 hover:text-chocolate disabled:opacity-30"
                >
                  ↓
                </button>
                <Button variant="secondary" onClick={() => setEditing(p)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => remove(p.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <ProductEditor
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

function ProductEditor({
  initial,
  onClose,
  onSaved,
}: {
  initial: Editable;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      id: initial.id,
      name: String(form.get("name") || ""),
      price: String(form.get("price") || ""),
      shortDescription: String(form.get("shortDescription") || ""),
      fullDescription: String(form.get("fullDescription") || ""),
      ingredients: String(form.get("ingredients") || ""),
      allergens: String(form.get("allergens") || ""),
      imageUrl: String(form.get("imageUrl") || ""),
      availability: String(form.get("availability") || "available"),
      featured: form.get("featured") === "true",
    };
    const res = await fetch("/api/products", {
      method: initial.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) onSaved();
    else {
      const data = await res.json().catch(() => ({}));
      setErr(data.error || "Save failed.");
    }
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-soft-black/60 backdrop-blur-sm">
      <div className="relative bg-cream w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-beige flex items-center justify-between">
          <h3 className="font-display text-2xl text-chocolate">
            {initial.id ? "Edit product" : "New product"}
          </h3>
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-cream hover:bg-beige text-xl">
            ×
          </button>
        </div>
        <form onSubmit={onSubmit} className="px-8 py-6 max-h-[75vh] overflow-y-auto grid gap-5">
          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2 grid gap-5">
              <Field label="Name" name="name" defaultValue={initial.name} required />
              <div className="grid grid-cols-2 gap-5">
                <Field label="Price" name="price" defaultValue={initial.price} placeholder="$9" />
                <Select
                  label="Availability"
                  name="availability"
                  defaultValue={initial.availability}
                  options={[
                    { value: "available", label: "Available" },
                    { value: "sold-out", label: "Sold Out" },
                    { value: "coming-soon", label: "Coming Soon" },
                  ]}
                />
              </div>
            </div>
            <ImagePicker name="imageUrl" current={initial.imageUrl} label="Product Image" />
          </div>
          <Field
            label="Short description"
            name="shortDescription"
            defaultValue={initial.shortDescription}
            textarea
            rows={2}
          />
          <Field
            label="Full description"
            name="fullDescription"
            defaultValue={initial.fullDescription}
            textarea
            rows={4}
          />
          <div className="grid md:grid-cols-2 gap-5">
            <Field
              label="Ingredients"
              name="ingredients"
              defaultValue={initial.ingredients}
              textarea
              rows={3}
            />
            <Field
              label="Allergens"
              name="allergens"
              defaultValue={initial.allergens}
              textarea
              rows={3}
            />
          </div>
          <Toggle
            label="Mark as featured"
            name="featured"
            defaultChecked={initial.featured}
            hint="Featured products are highlighted on the homepage."
          />
          {err && <div className="text-sm text-red-700 italic">{err}</div>}
          <div className="flex items-center gap-3 pt-2 pb-2 sticky bottom-0 bg-cream">
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
