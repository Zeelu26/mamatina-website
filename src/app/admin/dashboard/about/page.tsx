import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Settings } from "@/lib/types";
import { PageHead } from "../ui";
import AboutForm from "./AboutForm";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { data: settingsRow, error } = await supabaseAdmin
    .from("settings")
    .select("data")
    .eq("id", "site")
    .maybeSingle();

  if (error) {
    console.error("Failed to load about settings:", error);
  }

  const settings = settingsRow?.data as Settings | undefined;

  return (
    <>
      <PageHead
        eyebrow="Homepage"
        title="About Section"
        sub="The brand story. Eyebrow, title, paragraph, and image."
      />

      {settings?.about ? (
        <AboutForm about={settings.about} />
      ) : (
        <p className="text-chocolate/70">
          About settings could not be loaded.
        </p>
      )}
    </>
  );
}