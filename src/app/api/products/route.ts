import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { requireAdmin } from "@/lib/api";
import { readDB, updateDB } from "@/lib/db";
import type { Product } from "@/lib/types";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const db = await readDB();
  return NextResponse.json({
    products: [...db.products].sort((a, b) => a.order - b.order),
  });
}

function parseProduct(input: any): Omit<Product, "id" | "createdAt" | "order"> {
  const availability = ["available", "sold-out", "coming-soon"].includes(input.availability)
    ? input.availability
    : "available";
  return {
    name: String(input.name || "").slice(0, 200),
    price: String(input.price || "").slice(0, 50),
    shortDescription: String(input.shortDescription || "").slice(0, 500),
    fullDescription: String(input.fullDescription || "").slice(0, 4000),
    ingredients: String(input.ingredients || "").slice(0, 1000),
    allergens: String(input.allergens || "").slice(0, 500),
    imageUrl: String(input.imageUrl || ""),
    availability,
    featured: !!input.featured,
  };
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  await updateDB((db) => {
    const order = (db.products.reduce((m, p) => Math.max(m, p.order), 0) || 0) + 1;
    db.products.push({
      id: uuid(),
      ...parseProduct(body),
      order,
      createdAt: new Date().toISOString(),
    });
  });
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await updateDB((db) => {
    const p = db.products.find((x) => x.id === body.id);
    if (p) Object.assign(p, parseProduct(body));
  });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { order } = await req.json();
  if (!Array.isArray(order)) return NextResponse.json({ error: "order array required" }, { status: 400 });
  await updateDB((db) => {
    order.forEach((id: string, idx: number) => {
      const p = db.products.find((x) => x.id === id);
      if (p) p.order = idx + 1;
    });
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await updateDB((db) => {
    const idx = db.products.findIndex((p) => p.id === id);
    if (idx >= 0) db.products.splice(idx, 1);
  });
  return NextResponse.json({ ok: true });
}
