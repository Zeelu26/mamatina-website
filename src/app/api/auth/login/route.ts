import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readDB } from "@/lib/db";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const db = await readDB();
    const admin = db.admins.find(
      (a) => a.email.toLowerCase() === email.toLowerCase(),
    );
    if (!admin) {
      await bcrypt.hash(password, 10);
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    const token = await createSession({ sub: admin.id, email: admin.email });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
