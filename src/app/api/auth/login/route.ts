import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    const { data: admin, error } = await supabaseAdmin
      .from("admins")
      .select("id, email, password_hash")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Failed to load admin account:", error);

      return NextResponse.json(
        { error: "Login failed." },
        { status: 500 }
      );
    }

    if (!admin) {
      await bcrypt.hash(password, 10);

      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = await createSession({
      sub: admin.id,
      email: admin.email,
    });

    await setSessionCookie(token);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected login error:", error);

    return NextResponse.json(
      { error: "Login failed." },
      { status: 500 }
    );
  }
}