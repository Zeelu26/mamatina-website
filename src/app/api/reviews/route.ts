import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { updateDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { customerName, rating, text } = await req.json();
    if (typeof customerName !== "string" || customerName.trim().length < 1) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }
    if (typeof text !== "string" || text.trim().length < 5) {
      return NextResponse.json({ error: "Review too short" }, { status: 400 });
    }
    const r = Math.min(5, Math.max(1, Number(rating) || 5));
    await updateDB((db) => {
      db.reviews.push({
        id: uuid(),
        customerName: customerName.slice(0, 200),
        rating: r,
        text: text.slice(0, 2000),
        approved: false,
        featured: false,
        date: new Date().toISOString(),
      });
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
