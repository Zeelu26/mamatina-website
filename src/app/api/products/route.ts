import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { requireAdmin } from "@/lib/api";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Product } from "@/lib/types";

function fromRow(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    ingredients: row.ingredients,
    allergens: row.allergens,
    imageUrl: row.image_url,
    availability: row.availability,
    featured: row.featured,
    order: row.sort_order,
    createdAt: row.created_at,
  };
}

function parseProduct(input: any): Omit<Product, "id" | "createdAt" | "order"> {
  const availability = ["available", "sold-out", "coming-soon"].includes(input.availability)
    ? input.availability
    : "available";

  return {
    name: String(input.name || "").slice(0, 200),
    price: String(input.price || "").slice(0, 50),
    shortDescription: String(input.shortDescription || "").slice(0, 500),
    fullDescription: String(input.fullDescription || "").slice(0, 4000),
    ingredients: String(input.ingredients || "").slice(0, 1000),
    allergens: String(input.allergens || "").slice(0, 500),
    imageUrl: String(input.imageUrl || ""),
    availability,
    featured: !!input.featured,
  };
}

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    products: (data || []).map(fromRow),
  });
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const parsed = parseProduct(body);

  const { data: maxRows, error: maxError } = await supabaseAdmin
    .from("products")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  if (maxError) return NextResponse.json({ error: maxError.message }, { status: 500 });

  const nextOrder = ((maxRows?.[0]?.sort_order as number | undefined) || 0) + 1;

  const { error } = await supabaseAdmin.from("products").insert({
    id: uuid(),
    name: parsed.name,
    price: parsed.price,
    short_description: parsed.shortDescription,
    full_description: parsed.fullDescription,
    ingredients: parsed.ingredients,
    allergens: parsed.allergens,
    image_url: parsed.imageUrl,
    availability: parsed.availability,
    featured: parsed.featured,
    sort_order: nextOrder,
    created_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const parsed = parseProduct(body);

  const { error } = await supabaseAdmin
    .from("products")
    .update({
      name: parsed.name,
      price: parsed.price,
      short_description: parsed.shortDescription,
      full_description: parsed.fullDescription,
      ingredients: parsed.ingredients,
      allergens: parsed.allergens,
      image_url: parsed.imageUrl,
      availability: parsed.availability,
      featured: parsed.featured,
    })
    .eq("id", body.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { order } = await req.json();
  if (!Array.isArray(order)) {
    return NextResponse.json({ error: "order array required" }, { status: 400 });
  }

  for (let idx = 0; idx < order.length; idx++) {
    const { error } = await supabaseAdmin
      .from("products")
      .update({ sort_order: idx + 1 })
      .eq("id", order[idx]);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}