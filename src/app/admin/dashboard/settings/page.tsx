import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Settings } from "@/lib/types";
import { PageHead } from "../ui";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { data: settingsRow, error } = await supabaseAdmin
    .from("settings")
    .select("data")
    .eq("id", "site")
    .maybeSingle();

  if (error) {
    console.error("Failed to load site settings:", error);
  }

  const settings = settingsRow?.data as Settings | undefined;

  return (
    <>
      <PageHead
        eyebrow="Site"
        title="Site Settings"
        sub="SEO, branding assets, legal text, and maintenance mode."
      />

      {settings ? (
        <SettingsForm
          seo={settings.seo}
          legal={settings.legal}
          maintenanceMode={settings.maintenanceMode}
        />
      ) : (
        <p className="text-chocolate/70">
          Site settings could not be loaded.
        </p>
      )}
    </>
  );
}