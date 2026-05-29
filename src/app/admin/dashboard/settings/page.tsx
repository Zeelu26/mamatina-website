import { readDB } from "@/lib/db";
import { PageHead } from "../ui";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const db = await readDB();
  return (
    <>
      <PageHead
        eyebrow="Site"
        title="Site Settings"
        sub="SEO, branding assets, legal text, and maintenance mode."
      />
      <SettingsForm
        seo={db.settings.seo}
        legal={db.settings.legal}
        maintenanceMode={db.settings.maintenanceMode}
      />
    </>
  );
}
