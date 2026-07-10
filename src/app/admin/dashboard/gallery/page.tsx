import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Settings } from "@/lib/types";
import { PageHead } from "../ui";
import PhotoManager from "../PhotoManager";
import GalleryForm from "./GalleryForm";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [
    { data: settingsRow, error: settingsError },
    { data: galleryRows, error: galleryError },
  ] = await Promise.all([
    supabaseAdmin
      .from("settings")
      .select("data")
      .eq("id", "site")
      .maybeSingle(),

    supabaseAdmin
      .from("gallery_photos")
      .select("id, url, alt, sort_order")
      .order("sort_order", { ascending: true }),
  ]);

  if (settingsError) {
    console.error("Failed to load gallery settings:", settingsError);
  }

  if (galleryError) {
    console.error("Failed to load gallery photos:", galleryError);
  }

  const settings = settingsRow?.data as Settings | undefined;

  const galleryPhotos = (galleryRows ?? []).map((photo) => ({
    id: photo.id,
    url: photo.url,
    alt: photo.alt ?? "",
    order: photo.sort_order ?? 0,
  }));

  return (
    <>
      <PageHead
        eyebrow="Homepage"
        title="Gallery"
        sub="Editorial photos. Choose whether they cross-fade as a single feature or display as a layout grid."
      />

      {settings?.gallery ? (
        <GalleryForm gallery={settings.gallery} />
      ) : (
        <p className="text-chocolate/70">
          Gallery settings could not be loaded.
        </p>
      )}

      <h2 className="font-display text-2xl text-chocolate mt-14 mb-5">
        Gallery Photos
      </h2>

      <PhotoManager
        resource="gallery"
        initial={galleryPhotos}
      />
    </>
  );
}