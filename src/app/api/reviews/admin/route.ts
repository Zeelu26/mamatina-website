import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { requireAdmin } from "@/lib/api";
import { readDB, updateDB } from "@/lib/db";
import type { Review } from "@/lib/types";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const db = await readDB();
  return NextResponse.json({ reviews: db.reviews });
}

function parse(input: any): Omit<Review, "id" | "date"> {
  return {
    customerName: String(input.customerName || "").slice(0, 200),
    rating: Math.min(5, Math.max(1, Number(input.rating) || 5)),
    text: String(input.text || "").slice(0, 2000),
    photoUrl: input.photoUrl ? String(input.photoUrl) : undefined,
    approved: !!input.approved,
    featured: !!input.featured,
  };
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  await updateDB((db) => {
    db.reviews.push({
      id: uuid(),
      ...parse(body),
      date: new Date().toISOString(),
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
    const r = db.reviews.find((x) => x.id === body.id);
    if (r) Object.assign(r, parse(body));
  });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await updateDB((db) => {
    const r = db.reviews.find((x) => x.id === body.id);
    if (r) {
      if (typeof body.approved === "boolean") r.approved = body.approved;
      if (typeof body.featured === "boolean") r.featured = body.featured;
    }
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await updateDB((db) => {
    const idx = db.reviews.findIndex((r) => r.id === id);
    if (idx >= 0) db.reviews.splice(idx, 1);
  });
  return NextResponse.json({ ok: true });
}
