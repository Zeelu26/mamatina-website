import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { requireAdmin } from "@/lib/api";
import { readDB, updateDB } from "@/lib/db";
import { deleteImage } from "@/lib/uploads";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const db = await readDB();
  return NextResponse.json({
    photos: [...db.galleryPhotos].sort((a, b) => a.order - b.order),
  });
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { url, alt } = await req.json();
  if (typeof url !== "string") return NextResponse.json({ error: "url required" }, { status: 400 });
  await updateDB((db) => {
    const nextOrder = (db.galleryPhotos.reduce((m, p) => Math.max(m, p.order), 0) || 0) + 1;
    db.galleryPhotos.push({
      id: uuid(),
      url,
      alt: alt ? String(alt).slice(0, 200) : "",
      order: nextOrder,
    });
  });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  await updateDB((db) => {
    if (Array.isArray(body.order)) {
      body.order.forEach((id: string, idx: number) => {
        const p = db.galleryPhotos.find((x) => x.id === id);
        if (p) p.order = idx + 1;
      });
    } else if (body.id) {
      const p = db.galleryPhotos.find((x) => x.id === body.id);
      if (p) {
        if (typeof body.caption === "string") p.caption = body.caption;
        if (typeof body.alt === "string") p.alt = body.alt;
      }
    }
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  let urlToDelete: string | null = null;
  await updateDB((db) => {
    const idx = db.galleryPhotos.findIndex((p) => p.id === id);
    if (idx >= 0) {
      urlToDelete = db.galleryPhotos[idx].url;
      db.galleryPhotos.splice(idx, 1);
    }
  });
  if (urlToDelete) await deleteImage(urlToDelete);
  return NextResponse.json({ ok: true });
}
