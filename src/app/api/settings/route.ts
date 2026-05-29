import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api";
import { updateDB } from "@/lib/db";

export async function PATCH(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const patch = await req.json();
    const next = await updateDB((db) => {
      db.settings = {
        ...db.settings,
        ...patch,
        business: { ...db.settings.business, ...(patch.business || {}) },
        hero: { ...db.settings.hero, ...(patch.hero || {}) },
        about: { ...db.settings.about, ...(patch.about || {}) },
        gallery: { ...db.settings.gallery, ...(patch.gallery || {}) },
        announcement: { ...db.settings.announcement, ...(patch.announcement || {}) },
        seo: { ...db.settings.seo, ...(patch.seo || {}) },
        legal: { ...db.settings.legal, ...(patch.legal || {}) },
        footer: { ...db.settings.footer, ...(patch.footer || {}) },
      };
    });
    return NextResponse.json({ ok: true, settings: next.settings });
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
