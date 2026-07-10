import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    const { data: existing, error: lookupError } = await supabaseAdmin
      .from("subscribers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (lookupError) {
      console.error("Failed to check subscriber:", lookupError);

      return NextResponse.json(
        { error: "Failed" },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json({ ok: true });
    }

    const { error: insertError } = await supabaseAdmin
      .from("subscribers")
      .insert({
        id: uuid(),
        email,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Failed to create subscriber:", insertError);

      return NextResponse.json(
        { error: "Failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected newsletter signup error:", error);

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}