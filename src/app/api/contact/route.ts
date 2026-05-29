import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { updateDB } from "@/lib/db";

const recent = new Map<string, number>();
const RATE_WINDOW = 60 * 1000;

function rateLimit(ip: string) {
  const now = Date.now();
  const last = recent.get(ip) || 0;
  if (now - last < RATE_WINDOW) return false;
  recent.set(ip, now);
  return true;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: "Slow down a moment." }, { status: 429 });
    }
    const required = ["name", "phone", "email", "message"] as const;
    for (const k of required) {
      if (!data[k] || String(data[k]).trim().length === 0) {
        return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    await updateDB((db) => {
      db.messages.push({
        id: uuid(),
        name: String(data.name).slice(0, 200),
        phone: String(data.phone).slice(0, 50),
        email: String(data.email).slice(0, 200),
        message: String(data.message).slice(0, 5000),
        productInterest: data.productInterest ? String(data.productInterest).slice(0, 200) : undefined,
        quantity: data.quantity ? String(data.quantity).slice(0, 100) : undefined,
        eventDate: data.eventDate ? String(data.eventDate).slice(0, 100) : undefined,
        read: false,
        createdAt: new Date().toISOString(),
      });
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
