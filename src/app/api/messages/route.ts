import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  const { data: rows, error } = await supabaseAdmin
    .from("messages")
    .select(
      "id, name, email, phone, message, product_interest, quantity, event_date, file_url, read, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load messages:", error);

    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 }
    );
  }

  const messages = (rows ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    productInterest: row.product_interest ?? undefined,
    quantity: row.quantity ?? undefined,
    eventDate: row.event_date ?? undefined,
    fileUrl: row.file_url ?? undefined,
    read: row.read ?? false,
    createdAt: row.created_at,
  }));

  return NextResponse.json({ messages });
}

export async function PATCH(req: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await req.json();

    if (typeof body.id !== "string" || !body.id) {
      return NextResponse.json(
        { error: "id required" },
        { status: 400 }
      );
    }

    if (typeof body.read !== "boolean") {
      return NextResponse.json(
        { error: "read must be boolean" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("messages")
      .update({ read: body.read })
      .eq("id", body.id);

    if (error) {
      console.error("Failed to update message:", error);

      return NextResponse.json(
        { error: "Failed to update message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected message PATCH error:", error);

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  const id = new URL(req.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "id required" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("messages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete message:", error);

    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}