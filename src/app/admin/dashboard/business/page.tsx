import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Settings } from "@/lib/types";
import { PageHead } from "../ui";
import BusinessForm from "./BusinessForm";

export const dynamic = "force-dynamic";

export default async function BusinessPage() {
  const { data: settingsRow, error } = await supabaseAdmin
    .from("settings")
    .select("data")
    .eq("id", "site")
    .maybeSingle();

  if (error) {
    console.error("Failed to load business settings:", error);
  }

  const settings = settingsRow?.data as Settings | undefined;

  return (
    <>
      <PageHead
        eyebrow="Brand"
        title="Business Information"
        sub="Contact details, social links, business hours, and the announcement banner."
      />

      {settings ? (
        <BusinessForm
          business={settings.business}
          announcement={settings.announcement}
          footer={settings.footer}
        />
      ) : (
        <p className="text-chocolate/70">
          Business settings could not be loaded.
        </p>
      )}
    </>
  );
}