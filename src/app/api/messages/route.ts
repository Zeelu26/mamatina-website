import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api";
import { readDB, updateDB } from "@/lib/db";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const db = await readDB();
  return NextResponse.json({ messages: db.messages });
}

export async function PATCH(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await updateDB((db) => {
    const m = db.messages.find((x) => x.id === body.id);
    if (m && typeof body.read === "boolean") m.read = body.read;
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await updateDB((db) => {
    const idx = db.messages.findIndex((m) => m.id === id);
    if (idx >= 0) db.messages.splice(idx, 1);
  });
  return NextResponse.json({ ok: true });
}
