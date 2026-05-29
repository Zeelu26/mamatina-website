import { readDB } from "@/lib/db";
import { PageHead } from "../ui";
import AboutForm from "./AboutForm";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const db = await readDB();
  return (
    <>
      <PageHead
        eyebrow="Homepage"
        title="About Section"
        sub="The brand story. Eyebrow, title, paragraph, and image."
      />
      <AboutForm about={db.settings.about} />
    </>
  );
}
