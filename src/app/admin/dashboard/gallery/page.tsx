import { readDB } from "@/lib/db";
import { PageHead } from "../ui";
import PhotoManager from "../PhotoManager";
import GalleryForm from "./GalleryForm";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const db = await readDB();
  return (
    <>
      <PageHead
        eyebrow="Homepage"
        title="Gallery"
        sub="Editorial photos. Choose whether they cross-fade as a single feature or display as a layout grid."
      />
      <GalleryForm gallery={db.settings.gallery} />
      <h2 className="font-display text-2xl text-chocolate mt-14 mb-5">Gallery Photos</h2>
      <PhotoManager resource="gallery" initial={db.galleryPhotos} />
    </>
  );
}
