import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { requireAdmin } from "@/lib/api";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { deleteImage } from "@/lib/uploads";

export async function GET() {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  const { data, error } = await supabaseAdmin
    .from("hero_photos")
    .select("id, url, alt, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load hero photos:", error);

    return NextResponse.json(
      { error: "Failed to load hero photos" },
      { status: 500 }
    );
  }

  const photos = (data ?? []).map((photo) => ({
    id: photo.id,
    url: photo.url,
    alt: photo.alt ?? "",
    order: photo.sort_order ?? 0,
  }));

  return NextResponse.json({ photos });
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await req.json();
    const { url, alt } = body;

    if (typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { error: "url required" },
        { status: 400 }
      );
    }

    const { data: lastPhoto, error: orderError } = await supabaseAdmin
      .from("hero_photos")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orderError) {
      console.error("Failed to determine hero photo order:", orderError);

      return NextResponse.json(
        { error: "Failed to add hero photo" },
        { status: 500 }
      );
    }

    const nextOrder = (lastPhoto?.sort_order ?? 0) + 1;

    const { error } = await supabaseAdmin.from("hero_photos").insert({
      id: uuid(),
      url: url.trim(),
      alt: typeof alt === "string" ? alt.slice(0, 200) : "",
      sort_order: nextOrder,
    });

    if (error) {
      console.error("Failed to add hero photo:", error);

      return NextResponse.json(
        { error: "Failed to add hero photo" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected hero photo POST error:", error);

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

    if (Array.isArray(body.order)) {
      const updates = body.order.map((id: string, index: number) =>
        supabaseAdmin
          .from("hero_photos")
          .update({ sort_order: index + 1 })
          .eq("id", id)
      );

      const results = await Promise.all(updates);
      const failed = results.find((result) => result.error);

      if (failed?.error) {
        console.error("Failed to reorder hero photos:", failed.error);

        return NextResponse.json(
          { error: "Failed to reorder hero photos" },
          { status: 500 }
        );
      }

      return NextResponse.json({ ok: true });
    }

    if (typeof body.id !== "string" || !body.id) {
      return NextResponse.json(
        { error: "id required" },
        { status: 400 }
      );
    }

    const updates: {
      alt?: string;
    } = {};

    if (typeof body.alt === "string") {
      updates.alt = body.alt.slice(0, 200);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabaseAdmin
      .from("hero_photos")
      .update(updates)
      .eq("id", body.id);

    if (error) {
      console.error("Failed to update hero photo:", error);

      return NextResponse.json(
        { error: "Failed to update hero photo" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected hero photo PATCH error:", error);

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

  const { data: photo, error: findError } = await supabaseAdmin
    .from("hero_photos")
    .select("url")
    .eq("id", id)
    .maybeSingle();

  if (findError) {
    console.error("Failed to find hero photo:", findError);

    return NextResponse.json(
      { error: "Failed to delete hero photo" },
      { status: 500 }
    );
  }

  const { error: deleteError } = await supabaseAdmin
    .from("hero_photos")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Failed to delete hero photo:", deleteError);

    return NextResponse.json(
      { error: "Failed to delete hero photo" },
      { status: 500 }
    );
  }

  if (photo?.url) {
    try {
      await deleteImage(photo.url);
    } catch (error) {
      console.error("Failed to delete hero image file:", error);
    }
  }

  return NextResponse.json({ ok: true });
}