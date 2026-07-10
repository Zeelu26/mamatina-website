import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { requireAdmin } from "@/lib/api";
import { supabaseAdmin } from "@/lib/supabase/admin";

function mapReview(row: {
  id: string;
  customer_name: string;
  rating: number;
  text: string;
  photo_url: string | null;
  date: string;
  approved: boolean;
  featured: boolean;
}) {
  return {
    id: row.id,
    customerName: row.customer_name,
    rating: row.rating,
    text: row.text,
    photoUrl: row.photo_url ?? undefined,
    date: row.date,
    approved: row.approved,
    featured: row.featured,
  };
}

function parseReview(body: Record<string, unknown>) {
  return {
    customer_name: String(body.customerName ?? "").slice(0, 200),
    rating: Math.min(
      5,
      Math.max(1, Number(body.rating) || 5)
    ),
    text: String(body.text ?? "").slice(0, 2000),
    photo_url:
      typeof body.photoUrl === "string" && body.photoUrl.trim()
        ? body.photoUrl.trim().slice(0, 1000)
        : null,
    approved: Boolean(body.approved),
    featured: Boolean(body.featured),
  };
}

export async function GET() {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  const { data: rows, error } = await supabaseAdmin
    .from("reviews")
    .select(
      "id, customer_name, rating, text, photo_url, date, approved, featured"
    )
    .order("date", { ascending: false });

  if (error) {
    console.error("Failed to load admin reviews:", error);

    return NextResponse.json(
      { error: "Failed to load reviews" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    reviews: (rows ?? []).map(mapReview),
  });
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await req.json();
    const review = parseReview(body);

    if (!review.customer_name.trim()) {
      return NextResponse.json(
        { error: "Name required" },
        { status: 400 }
      );
    }

    if (review.text.trim().length < 5) {
      return NextResponse.json(
        { error: "Review too short" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("reviews")
      .insert({
        id: uuid(),
        ...review,
        date: new Date().toISOString(),
      });

    if (error) {
      console.error("Failed to create review:", error);

      return NextResponse.json(
        { error: "Failed to create review" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected admin review POST error:", error);

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

export async function PUT(req: Request) {
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

    const review = parseReview(body);

    if (!review.customer_name.trim()) {
      return NextResponse.json(
        { error: "Name required" },
        { status: 400 }
      );
    }

    if (review.text.trim().length < 5) {
      return NextResponse.json(
        { error: "Review too short" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("reviews")
      .update(review)
      .eq("id", body.id);

    if (error) {
      console.error("Failed to update review:", error);

      return NextResponse.json(
        { error: "Failed to update review" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected admin review PUT error:", error);

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
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

    const updates: {
      approved?: boolean;
      featured?: boolean;
    } = {};

    if (typeof body.approved === "boolean") {
      updates.approved = body.approved;
    }

    if (typeof body.featured === "boolean") {
      updates.featured = body.featured;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabaseAdmin
      .from("reviews")
      .update(updates)
      .eq("id", body.id);

    if (error) {
      console.error("Failed to patch review:", error);

      return NextResponse.json(
        { error: "Failed to update review" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected admin review PATCH error:", error);

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
    .from("reviews")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete review:", error);

    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}