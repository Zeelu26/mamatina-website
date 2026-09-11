import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendContactNotification } from "@/lib/email";

const recent = new Map<string, number>();
const RATE_WINDOW = 60 * 1000;

function rateLimit(ip: string) {
  const now = Date.now();
  const last = recent.get(ip) || 0;

  if (now - last < RATE_WINDOW) {
    return false;
  }

  recent.set(ip, now);
  return true;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Slow down a moment." },
        { status: 429 }
      );
    }

    const required = ["name", "phone", "email", "message"] as const;

    for (const key of required) {
      if (!data[key] || String(data[key]).trim().length === 0) {
        return NextResponse.json(
          { error: `Missing ${key}` },
          { status: 400 }
        );
      }
    }

    const email = String(data.email).trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    const name = String(data.name).trim().slice(0, 200);
    const phone = String(data.phone).trim().slice(0, 50);
    const message = String(data.message).trim().slice(0, 5000);
    const productInterest = data.productInterest
      ? String(data.productInterest).slice(0, 200)
      : null;
    const quantity = data.quantity
      ? String(data.quantity).slice(0, 100)
      : null;
    const eventDate = data.eventDate
      ? String(data.eventDate).slice(0, 100)
      : null;

    const { error } = await supabaseAdmin.from("messages").insert({
      id: uuid(),
      name,
      phone,
      email: email.slice(0, 200),
      message,
      product_interest: productInterest,
      quantity,
      event_date: eventDate,
      file_url: data.fileUrl
        ? String(data.fileUrl).slice(0, 1000)
        : null,
      read: false,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Failed to save contact message:", error);

      return NextResponse.json(
        { error: "Failed to send" },
        { status: 500 }
      );
    }

    // Best-effort owner notification — never blocks or fails the response.
    await sendContactNotification({
      name,
      email,
      phone,
      message,
      productInterest,
      quantity,
      eventDate,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected contact form error:", error);

    return NextResponse.json(
      { error: "Failed to send" },
      { status: 500 }
    );
  }
}