import { readDB } from "@/lib/db";
import { PageHead } from "../ui";
import BusinessForm from "./BusinessForm";

export const dynamic = "force-dynamic";

export default async function BusinessPage() {
  const db = await readDB();
  return (
    <>
      <PageHead
        eyebrow="Brand"
        title="Business Information"
        sub="Contact details, social links, business hours, and the announcement banner."
      />
      <BusinessForm
        business={db.settings.business}
        announcement={db.settings.announcement}
        footer={db.settings.footer}
      />
    </>
  );
}
