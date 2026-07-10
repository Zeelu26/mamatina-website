import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Settings } from "@/lib/types";

function mergeSettings(
  current: Settings,
  patch: Partial<Settings>
): Settings {
  return {
    ...current,
    ...patch,

    business: {
      ...current.business,
      ...(patch.business ?? {}),
    },

    hero: {
      ...current.hero,
      ...(patch.hero ?? {}),
    },

    about: {
      ...current.about,
      ...(patch.about ?? {}),
    },

    gallery: {
      ...current.gallery,
      ...(patch.gallery ?? {}),
    },

    announcement: {
      ...current.announcement,
      ...(patch.announcement ?? {}),
    },

    seo: {
      ...current.seo,
      ...(patch.seo ?? {}),
    },

    legal: {
      ...current.legal,
      ...(patch.legal ?? {}),
    },

    footer: {
      ...current.footer,
      ...(patch.footer ?? {}),
    },
  };
}

export async function PATCH(req: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const patch = (await req.json()) as Partial<Settings>;

    const { data: settingsRow, error: readError } = await supabaseAdmin
      .from("settings")
      .select("data")
      .eq("id", "site")
      .maybeSingle();

    if (readError) {
      console.error("Failed to load settings before update:", readError);

      return NextResponse.json(
        { error: "Could not load current settings" },
        { status: 500 }
      );
    }

    if (!settingsRow?.data) {
      return NextResponse.json(
        { error: "Settings row not found" },
        { status: 404 }
      );
    }

    const current = settingsRow.data as Settings;
    const nextSettings = mergeSettings(current, patch);

    const { error: updateError } = await supabaseAdmin
      .from("settings")
      .update({
        data: nextSettings,
      })
      .eq("id", "site");

    if (updateError) {
      console.error("Failed to save settings:", updateError);

      return NextResponse.json(
        { error: "Save failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      settings: nextSettings,
    });
  } catch (error) {
    console.error("Unexpected settings update error:", error);

    return NextResponse.json(
      { error: "Save failed" },
      { status: 500 }
    );
  }
}