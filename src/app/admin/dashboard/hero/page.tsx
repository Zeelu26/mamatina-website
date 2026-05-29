import { readDB } from "@/lib/db";
import { PageHead } from "../ui";
import PhotoManager from "../PhotoManager";
import HeroForm from "./HeroForm";

export const dynamic = "force-dynamic";

export default async function HeroPage() {
  const db = await readDB();
  return (
    <>
      <PageHead
        eyebrow="Homepage"
        title="Hero Section"
        sub="The first thing visitors see. Headline, subheading, calls to action, and the photos that shuffle behind them."
      />
      <HeroForm hero={db.settings.hero} />
      <h2 className="font-display text-2xl text-chocolate mt-14 mb-5">Hero Photos</h2>
      <PhotoManager resource="hero" initial={db.heroPhotos} hint="These shuffle in the background. Upload several for the best effect." />
    </>
  );
}
