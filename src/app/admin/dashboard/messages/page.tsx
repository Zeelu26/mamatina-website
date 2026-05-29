import { readDB } from "@/lib/db";
import { PageHead } from "../ui";
import MessagesView from "./MessagesView";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const db = await readDB();
  return (
    <>
      <PageHead
        eyebrow="Inbox"
        title="Contact Messages"
        sub="All inquiries from the contact form. Export to CSV for catering or events."
      />
      <MessagesView initial={db.messages} />
    </>
  );
}
