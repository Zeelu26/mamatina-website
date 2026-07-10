import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Settings } from "@/lib/types";
import { PageHead } from "../ui";
import PhotoManager from "../PhotoManager";
import HeroForm from "./HeroForm";

export const dynamic = "force-dynamic";

export default async function HeroPage() {
  const [
    { data: settingsRow, error: settingsError },
    { data: heroRows, error: heroError },
  ] = await Promise.all([
    supabaseAdmin
      .from("settings")
      .select("data")
      .eq("id", "site")
      .maybeSingle(),

    supabaseAdmin
      .from("hero_photos")
      .select("id, url, alt, sort_order")
      .order("sort_order", { ascending: true }),
  ]);

  if (settingsError) {
    console.error("Failed to load hero settings:", settingsError);
  }

  if (heroError) {
    console.error("Failed to load hero photos:", heroError);
  }

  const settings = settingsRow?.data as Settings | undefined;

  const heroPhotos = (heroRows ?? []).map((photo) => ({
    id: photo.id,
    url: photo.url,
    alt: photo.alt ?? "",
    order: photo.sort_order ?? 0,
  }));

  return (
    <>
      <PageHead
        eyebrow="Homepage"
        title="Hero Section"
        sub="The first thing visitors see. Headline, subheading, calls to action, and the photos that shuffle behind them."
      />

      {settings?.hero ? (
        <HeroForm hero={settings.hero} />
      ) : (
        <p className="text-chocolate/70">
          Hero settings could not be loaded.
        </p>
      )}

      <h2 className="font-display text-2xl text-chocolate mt-14 mb-5">
        Hero Photos
      </h2>

      <PhotoManager
        resource="hero"
        initial={heroPhotos}
        hint="These shuffle in the background. Upload several for the best effect."
      />
    </>
  );
}