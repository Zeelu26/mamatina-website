import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { updateDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    await updateDB((db) => {
      const existing = db.subscribers.find(
        (s) => s.email.toLowerCase() === email.toLowerCase(),
      );
      if (!existing) {
        db.subscribers.push({
          id: uuid(),
          email: email.toLowerCase(),
          createdAt: new Date().toISOString(),
        });
      }
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
