import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const customerName =
      typeof body.customerName === "string"
        ? body.customerName.trim()
        : "";

    const text =
      typeof body.text === "string"
        ? body.text.trim()
        : "";

    if (!customerName) {
      return NextResponse.json(
        { error: "Name required" },
        { status: 400 }
      );
    }

    if (text.length < 5) {
      return NextResponse.json(
        { error: "Review too short" },
        { status: 400 }
      );
    }

    const rating = Math.min(
      5,
      Math.max(1, Number(body.rating) || 5)
    );

    const { error } = await supabaseAdmin
      .from("reviews")
      .insert({
        id: uuid(),
        customer_name: customerName.slice(0, 200),
        rating,
        text: text.slice(0, 2000),
        photo_url:
          typeof body.photoUrl === "string" && body.photoUrl.trim()
            ? body.photoUrl.trim().slice(0, 1000)
            : null,
        date: new Date().toISOString(),
        approved: false,
        featured: false,
      });

    if (error) {
      console.error("Failed to submit review:", error);

      return NextResponse.json(
        { error: "Failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected review submission error:", error);

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}